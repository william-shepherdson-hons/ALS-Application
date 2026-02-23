use crate::{auth::startup::fetch_jwt_token, services::questions::generate_question, structs::question_pair::QuestionPair};

pub async fn generate_assessment(app_data_dir: String, topic: String, amount: i32) -> Result<Vec<QuestionPair>,String> {
    let jwt = fetch_jwt_token(app_data_dir).await?;
    let mut question_pairs: Vec<QuestionPair> = Vec::new();
    for _ in 0..amount {
        question_pairs.push(
            generate_question(&jwt, &topic).await
                .map_err(|e| format!("Failed to generate questions: {e}"))?
        );
    }
    Err("test".to_string())
}