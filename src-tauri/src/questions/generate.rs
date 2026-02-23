use crate::{auth::startup::fetch_jwt_token, services::questions::generate_question, structs::question_pair::QuestionPair};

#[tauri::command(rename_all = "snake_case")]
pub async fn handle_generate_question(app_data_dir: String, topic: String) -> Result<QuestionPair, String> {
    let jwt = fetch_jwt_token(app_data_dir).await?;
    let question_pair = generate_question(&jwt, &topic)
        .await?;
    Ok(question_pair)
}