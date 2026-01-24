use crate::{auth::startup::fetch_jwt_token, services::progress::update_progression};

#[tauri::command(rename_all = "snake_case")]
pub async fn handle_update_progression(app_data_dir: String, skill: String, correct: bool) -> Result<(), String> {
    let jwt = fetch_jwt_token(app_data_dir).await?;
    update_progression(jwt, skill, correct).await 
}