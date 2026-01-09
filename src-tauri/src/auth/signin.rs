use std::fs::{self, File};
use std::io::Write;
use std::path::PathBuf;

#[tauri::command(rename_all = "snake_case")]
pub fn signin(app_data_dir: String) -> Result<(), String> {
    let mut path = PathBuf::from(&app_data_dir);

    fs::create_dir_all(&path)
        .map_err(|e| e.to_string())?;

    path.push("launch");

    let mut file = File::create(path)
        .map_err(|e| e.to_string())?;

    file.write_all(b"sign")
        .map_err(|e| e.to_string())?;

    Ok(())
}
