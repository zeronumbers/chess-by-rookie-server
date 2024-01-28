import * as WebSocket from 'ws';
import { WebSocketServer } from 'ws';
import { parse } from 'url';

// FIXME: should it even log stuff?
const log = (x) => {
  console.log(new Date(), x);
};

/* reconnect false because it is supposed to just exchange few messages,
   it is much easier to just tell user to try again
   rather than dealing with acknowledgements,
   and complex logic like figuring out on client side
   whether event.code may result in reconnect or not,
   storing messages and sending them in right order etc. */
const wss = new WebSocketServer({ port: 8080 }, { reconnect: false });

const answerer = 'answerer';
const offerer = 'offerer';

type Id = string;
type Role = typeof offerer | typeof answerer;
type Msg = {
  type: string;
  data: object;
};

// FIXME: idk how to name this
const storageOfPairs: {
  [key: Id]: { [key in Role]?: WebSocket };
} = {};

const sendMsg = (ws: WebSocket, msg: Msg) => ws.send(JSON.stringify(msg));
const invertRole = (role: Role) => {
  if (role === offerer) {
    return answerer;
  }

  if (role === answerer) {
    return offerer;
  }

  throw new Error('unexpected role:', role);
};

const setStorageOfPairs = (id: string, role: Role, ws: WebSocket) => {
  const idValue = storageOfPairs[id];

  if (idValue) {
    idValue[role] = ws;
  } else {
    storageOfPairs[id] = { [role]: ws };
  }
};

const TIME_TO_TIMEOUT = 300000; // 5 minutes

const cleanUp = (id: string) => {
  log(`deleting id ${id}`);
  delete storageOfPairs[id];
};

wss.on('connection', (ws, request) => {
  log('connection');

  const params = new URLSearchParams(parse(request.url).query);
  const role = params.get('role');
  const id = params.get('id');

  if (
    id &&
    (role === offerer ||
      // if answerer connected after offerer
      (role === answerer && storageOfPairs[id]?.[offerer]))
  ) {
    setStorageOfPairs(id, role, ws);
    log(`connected: ${role} ${id}`);
    const roles = storageOfPairs[id];

    // FIXME frontend must also start timer, and notify user that it is going
    const idleTimer: NodeJS.Timeout = setTimeout(() => {
      log(`terminating connection because timed out for id ${id} ${role}`);

      // no need to call cleanup here since onclose would run
      ws.terminate();
    }, TIME_TO_TIMEOUT);

    if (roles.offerer && roles.answerer) {
      // FIXME: should it really send ready to both?
      log('both players connected');
      sendMsg(roles[offerer], { type: 'ready' });
      sendMsg(roles[answerer], { type: 'ready' });
    }

    // FIXME: is it ok that this isn't first?
    ws.on('error', console.error);

    // onclose is run even if u call terminate
    ws.on('close', () => {
      cleanUp(id);
      log(`disconnecting id ${id}`);
    });

    ws.on('message', (data, isBinary) => {
      try {
        /* FIXME: TS: i have no idea how to deal with this,
                   RawData is what is written in api of ws:
                   it is Buffer (which has to json function which calls JSON.stringify anyway)
                   or ArrayBuffer or Buffer[] */
        const d: Msg = JSON.parse(`${data}`) || {};
        log(`recieved message from ${role} ${id} ${JSON.stringify(d)}`);

        const opponentWs = storageOfPairs[id][invertRole(role)];

        if (opponentWs) {
          switch (d.type) {
            case 'offer': {
              log(`recieved offer, redirecting to opponent ${id}`);
              sendMsg(opponentWs, d);

              break;
            }
            case 'answer': {
              log(`recieved answer, redirecting to opponent ${id}`);
              sendMsg(opponentWs, d);

              break;
            }
            case 'candidate': {
              log(`recieved ice, redirecting to opponent ${id}`);
              sendMsg(opponentWs, d);

              break;
            }

            default: {
              console.error(
                `recieved unknown type of message: ${d.type}, ${d}`,
              );

              break;
            }
          }
        }
      } catch (err) {
        // FIXME: should connection close or what happens?
        console.error('wasnt json', err);
      }
    });
  } else {
    ws.terminate();
  }
});
