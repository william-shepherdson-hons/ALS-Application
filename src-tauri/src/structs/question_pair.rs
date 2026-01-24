use serde::{Deserialize, Serialize};
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuestionPair {
    pub question: String,
    pub answer: String
}