use serde::{Deserialize, Serialize};
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssesmentResult {
    pub topic: String,
    pub correct: bool
}