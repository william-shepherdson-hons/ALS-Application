use crate::{
    auth::startup::fetch_jwt_token,
    services::{
        progress::{log_progress, update_progression},
        questions::generate_questions
    },
    settings::question_type::read_question_type,
    structs::{
        question_pair::QuestionPair,
        results::AssesmentResult
    }
};

#[tauri::command(rename_all = "snake_case")]
pub async fn generate_assessment(
    app_data_dir: String,
    topic: String,
    amount: i32
) -> Result<Vec<QuestionPair>, String> {

    let jwt = fetch_jwt_token(app_data_dir.clone()).await?;

    let word = read_question_type(app_data_dir)?;

    let questions = generate_questions(
        &jwt,
        &topic,
        amount as usize,
        word
    )
    .await
    .map_err(|e| format!("Failed to generate questions: {e}"))?;

    Ok(questions)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn grade_assessment(
    app_data_dir: String,
    results: Vec<AssesmentResult>
) -> Result<(), String> {

    let jwt = fetch_jwt_token(app_data_dir).await?;

    for result in results.clone() {
        update_progression(&jwt, result.topic, result.correct)
            .await
            .map_err(|e| format!("Failed to update knowledge: {e}"))?;
    }
    log_progress(&jwt, &results[0].topic).await
        .map_err(|e| format!("Failed to log progress: {e}"))?;

    Ok(())
}