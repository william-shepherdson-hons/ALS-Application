use crate::{
    auth::startup::fetch_jwt_token,
    services::progress::{
        get_historical_skills, get_progression, get_skill_history
    },
    structs::skill_progression::{SkillProgression, SkillProgressionWithDate}
};

#[tauri::command(rename_all = "snake_case")]
pub async fn handle_fetch_progression(
    app_data_dir: String
) -> Result<Vec<SkillProgression>, String> {
    let jwt = fetch_jwt_token(app_data_dir).await?;
    let progression = get_progression(jwt).await?;
    Ok(progression)
}


#[tauri::command(rename_all = "snake_case")]
pub async fn handle_fetch_historical_skills(
    app_data_dir: String
) -> Result<Vec<String>, String> {
    let jwt = fetch_jwt_token(app_data_dir).await?;

    let skills = get_historical_skills(&jwt).await?;

    Ok(skills)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn handle_fetch_skill_history(
    app_data_dir: String,
    skill_name: String
) -> Result<Vec<SkillProgressionWithDate>, String> {
    let jwt = fetch_jwt_token(app_data_dir).await?;

    let history = get_skill_history(&jwt, &skill_name).await?;

    Ok(history)
}