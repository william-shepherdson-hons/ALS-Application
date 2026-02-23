use crate::{auth::startup::fetch_jwt_token, services::{progress::update_progression, questions::generate_question}, structs::{question_pair::QuestionPair, results::AssesmentResult}};
#[tauri::command(rename_all = "snake_case")]
pub async fn generate_assessment(app_data_dir: String, topic: String, amount: i32) -> Result<Vec<QuestionPair>,String> {
    let jwt = fetch_jwt_token(app_data_dir).await?;
    let mut question_pairs: Vec<QuestionPair> = Vec::new();
    for _ in 0..amount {
        question_pairs.push(
            generate_question(&jwt, &topic).await
                .map_err(|e| format!("Failed to generate questions: {e}"))?
        );
    }
    Ok(question_pairs)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn grade_assessment(app_data_dir: String, results: Vec<AssesmentResult>) -> Result<(), String> {
    let jwt = fetch_jwt_token(app_data_dir).await?;
    for result in results {
        update_progression(&jwt, result.topic, result.correct).await
            .map_err(|e| format!("Failed to update knowledge: {e}"))?
    }
    Ok(())
}