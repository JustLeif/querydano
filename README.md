# querydano :receipt:
v0.1.0

### Purpose
- This project is an interface for querying the Cardano Blockchain. The following is a demonstration of how the interface can be used.
- **Built as a portfolio project, this software demonstrates my ability to use Angular, build a REST API with Rust and Actix Web (Though I have other projects using tokio), and work with the Cardano CLI tools to interact and query the blockchain**.

Video Link: https://youtu.be/4zWg6jcsjVg
![thumbnail](https://user-images.githubusercontent.com/69766831/232885458-a0075ac2-a32b-431b-aca3-2d5d6407bcae.png)

### Setup Guide
1. Have cargo installed (Rust) (https://www.rust-lang.org/tools/install)
2. Have a full Cardano Node running on your machine. 3 Part tutorial: (https://www.youtube.com/watch?v=VnaxHzvF1ow) (https://www.youtube.com/watch?v=8AniDW6fVwk) (https://www.youtube.com/watch?v=uUwGMfKgs2M)
3. Have the Angular CLI (https://angular.io/cli)
4. Clone this repository.
5. Run the Rust HTTP server: `cd querydano-node-api` and run `cargo run`.
6. Run the Angular project: `cd ../querydano-interface` and run `ng serve`.
7. Navigate in your browser to `localhost:4200`
8. Enjoy!

### Available Commands
`tip` => Returns a JSON representation of the Cardano Block Tip.

`utxo {cardano_address}` => Returns a JSON represntation of the utxo of each transaction for an address.

`clear` => Clears the 'terminal'
