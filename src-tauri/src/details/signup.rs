use std::collections::HashMap;

use crate::services::account::sign_up;

#[tauri::command(rename_all = "snake_case")]
pub async fn handle_sign_up(first_name: &str, last_name: &str, username: &str, password: &str) -> Result<(), String> {
    let mut map = HashMap::new();
    map.insert("first_name", first_name);
    map.insert("last_name", last_name);
    map.insert("password", password);
    map.insert("username", username);
    sign_up(&map)
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}