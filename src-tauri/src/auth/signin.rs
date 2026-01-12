use crate::services::account::sign_in;
use crate::structs::details::Details;

#[tauri::command(rename_all = "snake_case")]
pub async fn signin(app_data_dir: String, username: String, password: String) -> Result<(), String> {
    let details = Details {
        username: username,
        password: password
    };
    sign_in(app_data_dir, details)
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}
