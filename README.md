# bit-pandora
Shut the box, Padroras box.

## Todos
1.  Architecture
    * Add Docker
    * Shared game state through API
    * QR Code game sharing
    * Authed user history storage
2. Game play
    * Quickplay
    * Bit Pandora Game Agent (Randomly unflips tiles)
    * Multiplayer local
    * Multiplayer QR linked

### Notes

- Tight coupling between the host & remotes is a bit disconcerting. Solutions exist with async loading, however the implementation is verbose & clearly not mature. Federation still cool, but will be cooler when remotes support runtime fallbacks.

- SSE is intended to act as an event driven, one way broadcast of game state slices & typed interactions. WebSocket, though an interesting lateral protocol, isn't appropriate in this context. BitPandora, by nature of it's simplicity & rapid gameplay, will never want to introduce a direct communications channel between players. A player will want to emote, which will be a typed interaction, simple emojis or common phrases. The player posts an action (Cast or Pick, eventually emotes) which is a mutation of the game state. The game is responsible for aligning the player clients. The idea is that an immutable slice of the game can be shared & synced in a client agnostic environment while preventing players from 'lazy hacking' the game state. It allows a desktop, webclient, and device interact through a standard. The natural limit of six connections to a given SSE resource is simply a coincidental limiting feature (it's a feature, not a bug) as Shut The Box is played by one to four people. 

- Game mutations occur server side for security & consistency. 

- Fundamentally a simple state machine, the target solution will be a serverless simple state machine. Looking at you AWS. 