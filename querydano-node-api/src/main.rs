use std::{process::Command};
use serde::{Deserialize, Serialize};
use actix_web::{get, web, App, HttpServer, Responder, HttpResponse};

// JSON Response Structs.
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Tip {
    pub block: usize,
    pub epoch: usize,
    pub era: String,
    pub hash: String,
    pub slot: usize,
    pub sync_progress: String
}
#[derive(Serialize, Deserialize, Debug)]
pub struct Tx {
    pub hash: Option<String>,
    pub ix: Option<String>,
    pub amount: Option<String>
}

#[get("/tip")]
async fn get_tip() -> impl Responder {
    let query_tip = Command::new("cardano-cli")
                                        .arg("query")
                                        .arg("tip")
                                        .arg("--mainnet")
                                        .output()
                                        .unwrap();
    let tip: Tip = serde_json::from_str(&String::from_utf8_lossy(&query_tip.stdout)).unwrap();
    HttpResponse::Ok().body(serde_json::to_string(&tip).unwrap())
}

#[derive(Deserialize)]
struct GetUtxoAddressParams {
    address: String
}
#[get("/utxo/{address}")]
async fn get_utxo_of_address(params: web::Path<GetUtxoAddressParams>) -> impl Responder {
    let address = &params.address;
    let query_utxo = Command::new("cardano-cli")
                                .arg("query")
                                .arg("utxo")
                                .arg("--address")
                                .arg(address)
                                .arg("--mainnet")
                                .output()
                                .unwrap();
    let query_result = String::from_utf8_lossy(&query_utxo.stdout).into_owned();
    let mut tx_history: Vec<Tx> = Vec::new();
    for line in query_result.lines().skip(2) {
        let mut line_index = 0;
        let mut tx = Tx {hash: None, amount: None, ix: None};
        for token in line.split("     ") {
            match line_index {
                0 => tx.hash = Some(token.trim().to_owned()),
                1 => tx.ix = Some(token.trim().to_owned()),
                _ => tx.amount = Some(token.trim().to_owned()),
            }
            line_index += 1;
        }
        tx_history.push(tx);
    }
    HttpResponse::Ok().body(serde_json::to_string(&tx_history).unwrap())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(get_tip)
            .service(get_utxo_of_address)
    })
    .bind(("127.0.0.1", 5796))?
    .run()
    .await
}