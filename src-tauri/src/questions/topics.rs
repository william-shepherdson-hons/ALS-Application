use crate::{auth::startup::fetch_jwt_token, services::questions::get_topics};

#[tauri::command(rename_all = "snake_case")]
pub async fn handle_fetch_topics(app_data_dir: String) -> Result<Vec<String>, String> {
    let jwt = fetch_jwt_token(app_data_dir).await?;
    let progression = get_topics(jwt)
        .await?;
    Ok(progression)
}