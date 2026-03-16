use crate::{
    auth::startup::fetch_jwt_token,
    services::questions::generate_questions,
    settings::question_type::read_question_type,
    structs::question_pair::QuestionPair
};

#[tauri::command(rename_all = "snake_case")]
pub async fn handle_generate_questions(
    app_data_dir: String,
    topic: String,
    amount: usize,
) -> Result<Vec<QuestionPair>, String> {

    let jwt = fetch_jwt_token(app_data_dir.clone()).await?;

    let word = read_question_type(app_data_dir)?;

    let questions = generate_questions(
        &jwt,
        &topic,
        amount,
        word
    ).await?;

    Ok(questions)
}