use crate::{auth::startup::fetch_jwt_token, services::questions::generate_question, settings::question_type::read_question_type, structs::question_pair::QuestionPair};

#[tauri::command(rename_all = "snake_case")]
pub async fn handle_generate_question(app_data_dir: String, topic: String) -> Result<QuestionPair, String> {
    let jwt = fetch_jwt_token(app_data_dir.clone()).await?;
    let word = read_question_type(app_data_dir)?;
    let question_pair = generate_question(&jwt, &topic, word)
        .await?;
    Ok(question_pair)
}