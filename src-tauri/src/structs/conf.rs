use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize)]
pub struct Conf {
    pub ai: bool,
}