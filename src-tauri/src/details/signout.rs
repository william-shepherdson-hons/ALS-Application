use std::{fs, path::PathBuf};

#[tauri::command(rename_all = "snake_case")]
pub async fn handle_sign_out(app_data_dir: String) -> Result<(), String> {
    remove_tokens(&app_data_dir).await?;
    Ok(())
}

async fn remove_tokens(app_data_dir: &str) -> Result<(), String> {
    let mut path = PathBuf::from(&app_data_dir);
    fs::create_dir_all(&path)
        .map_err(|e| e.to_string())?;
    let mut refresh = path.clone();
    refresh.push("refresh.txt");
    path.push("jwt.txt");
    fs::remove_file(refresh)
        .map_err(|e | e.to_string())?;
    fs::remove_file(path)
        .map_err(|e| e.to_string())?;
    Ok(())
}