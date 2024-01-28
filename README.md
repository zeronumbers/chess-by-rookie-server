# About

This is a simple websocket signaling server made for webrtc chess game.

the client side that deals with frontend and chess can be found in project called: `chess-by-rookie-client`

# rewrite.ts

This is a code used for client's rewrite.tsx

# WebRTC "perfect negotiation"

I believe it is not needed since I can make sure that only one side creates offer and that the other creates only answer.

I have two users, one creates "game" the other joins, i don't see how it would cause both of them to send offer if one sends it and other recieves.

# WebRTC "signaling"

WebSocket was chosen

## turn?

webrtc requires turn for Symmetric NAT.

In such case turn server just acts as a server and actual p2p does not happen. Is there point then in webrtc? If I can just use websocket server instead.

I guess complexity of software is smaller when you use turn server that isn't written by you, and using same webrtc functions when p2p and when not. As opposed to using webrtc for p2p and websocket when it is not p2p.

How to show dependency of something like a turn server that doesn't belong to nodejs?

### private
such turn server would consume resources, it is important to make sure that it is used only for my chess.


## server actually is not needed(if nat is not symmetric), but it saves people from:

See manual signaling in client. There are many issues with manual signaling, but it can be done.

# what needs to be sent

'ready' -> 'offer' -> 'answer' -> 'icecandidate'

order matters.

There are additional steps in rewrite.ts, basically clients send message to server that they are ready, and when both are, only then server sends ready.

# Why play as soon as opponent connected to server is a bad idea

I have websocket as first step of connection.
So as soon as both players are connected they can play.

This would create additional work for server. and it is kind of turn server.

User experience is much better this way.

## This is bad design

If webrtc cannot be stablished, I have to continue sending state, since the game is in progress and I cannot just stop it in the middle because webrtc failed.

# TODO restart on fail

there is node tool that restarts app when it crashes.

