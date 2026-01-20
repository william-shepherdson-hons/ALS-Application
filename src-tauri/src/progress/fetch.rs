use crate::{auth::startup::fetch_jwt_token, services::progress::get_progression, structs::skill_progression::SkillProgression};

#[tauri::command(rename_all = "snake_case")]
pub async fn handle_fetch_progression(app_data_dir: String) -> Result<Vec<SkillProgression>, String> {
    let jwt = fetch_jwt_token(app_data_dir).await?;
    let progression = get_progression(jwt)
        .await?;
    Ok(progression)
}