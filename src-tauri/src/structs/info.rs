use serde::{Serialize,Deserialize};
#[derive(Debug, Deserialize, Serialize)]
pub struct Info {
    pub first_name: String,
    pub last_name: String
}