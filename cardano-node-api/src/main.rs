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

#[async_std::main]
async fn main() -> tide::Result<()> {
    let mut app = tide::new();
    app.at("/tip").get(get_tip);
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