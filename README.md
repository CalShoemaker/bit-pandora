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