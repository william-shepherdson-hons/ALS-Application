use crate::{auth::startup::fetch_jwt_token, services::account::get_account_info, structs::info::Info};

#[tauri::command(rename_all = "snake_case")]
pub async fn get_account_details(app_data_dir: String) -> Result<Info, String> {
    let jwt_token = fetch_jwt_token(app_data_dir).await?;
    let account = get_account_info(&jwt_token)
        .await
        .map_err(|e| e.to_string())?;
    Ok(account)
}