use tide::Request;
use std::{process::Command};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Tip {
    pub block: usize,
    pub epoch: usize,
    pub era: String,
    pub hash: String,
    pub slot: usize,
    pub syncProgress: String
}
#[derive(Serialize, Deserialize, Debug)]
pub struct Tx {
    pub hash: Option<String>,
    pub ix: Option<String>,
    pub amount: Option<String>
}

#[async_std::main]
async fn main() -> tide::Result<()> {
    let mut app = tide::new();
    app.at("/tip").get(get_tip);
    app.at("/utxo/:addr").get(get_utxo);
    app.listen("127.0.0.1:5796").await?;
    Ok(())
}

async fn get_tip(mut _req: Request<()>) -> tide::Result {
    let query_tip = Command::new("cardano-cli")
                                        .arg("query")
                                        .arg("tip")
                                        .arg("--mainnet")
                                        .output()
                                        .unwrap();
    let tip: Tip = serde_json::from_str(&String::from_utf8_lossy(&query_tip.stdout)).unwrap();
    Ok(format!("{}", serde_json::to_string(&tip).unwrap()).into())
}

async fn get_utxo(req: Request<()>) -> tide::Result {
    let addr = req.param("addr").unwrap();
    let query_utxo = Command::new("cardano-cli")
                                .arg("query")
                                .arg("utxo")
                                .arg("--address")
                                .arg(addr)
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
    Ok(format!("{}", serde_json::to_string(&tx_history).unwrap()).into())
}