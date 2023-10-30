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

### Update Notes

- Game pivots off of Game ID in URL, instead of GID/PID. This enables sharing via mobile device ecosystem share feature. IE Link share in iOS. A player can spin up a game, share the same link in their url to a friend who can then join. Basically standardized the transport medium in that it will always be a URL with a game ID that players pivot from, and does not reflect the PID. In testing I often removed the player ID when naturally sharing the link between devices. It occoured to me that the player ID should'nt be part of the transport ID (URL) as the server (API) handles the player join, and the game can determine that a new player is viewing the link. 

- Would like to have a simulation game running in the background on the home page that displays the dynamic of the game.

- Need a quick tutorial that explains the game. I mean... It's so simple it kinda explains itself.

- Explicitly explained, temporary ruleset, for Pandora PVP; Shut The Box core game rules:

- A Player has an option to roll one (1) or two (2) dice, the sum of which may be reduced from the tiles on the board.
- A Player loses when unable to entirely distribute the result of a dice roll, and their score is the sum of the remaining tiles.
- A Player wins when all tiles are removed , or an opponent loses.
- A Player normally may only Pick a max of two (2) tiles per Cast, Pandora PvP has no limit.
- A Player may Give a tile to an opponent by long pressing a tile (1000ms).
- A Player may only Give tiles which factor into the sum of a dice Cast, already Picked by opponent, denoted as bright red bg.

### Next Targets

- Sometimes a glitch where tiles vanish into limbo.

- Rematch is broken. 

- Design improvements. Probably Vuetify integration.

- Configure remote for game.types.ts

- Calculated rematch KO's that keep track of win loss between players who enjoy rematch workflow loop.

- Best two out of three / three out of five as a standard. Like some Street Fighter games where you can lose once but continue...

### Nexter Targets

- Refactor CSS/SCSS. Ran into issues in mobile with SCSS, thus the random double style tags with temp CSS.

- Leader board.

- Friends list.

- 4 Player support.

- Authenticated Player.

- Open matches queue.

- Rotate inactive games from history to archive in API

- Taunts & abilities

### Nextest Targets

- Docker Containers.

- Refactor to state machines & lambda functions.

-

- Profit.
