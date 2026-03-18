use std::fs;
use std::path::PathBuf;


use crate::structs::conf::Conf;


#[tauri::command(rename_all = "snake_case")]
pub fn toggle_question_type(app_data_dir: String) -> Result<(), String> {
    let mut path = PathBuf::from(&app_data_dir);
    path.push("conf.json");

    // Load existing config or create default
    let mut conf = if path.exists() {
        let content = fs::read_to_string(&path)
            .map_err(|e| format!("Failed to read conf.json: {}", e))?;

        serde_json::from_str::<Conf>(&content)
            .map_err(|e| format!("Failed to parse conf.json: {}", e))?
    } else {
        Conf { ai: false }
    };

    // Toggle the boolean
    conf.ai = !conf.ai;

    // Serialize with pretty formatting
    let serialized = serde_json::to_string_pretty(&conf)
        .map_err(|e| format!("Failed to serialize config: {}", e))?;

    // Write back to disk
    fs::write(&path, serialized)
        .map_err(|e| format!("Failed to write conf.json: {}", e))?;

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub fn read_question_type(app_data_dir: String) -> Result<bool, String> {
    let mut path = PathBuf::from(&app_data_dir);
    path.push("conf.json");

    if !path.exists() {
        let default_conf = Conf { ai: false };

        let json = serde_json::to_string_pretty(&default_conf)
            .map_err(|e| format!("Failed to serialize default config: {}", e))?;

        fs::write(&path, json)
            .map_err(|e| format!("Failed to create conf.json: {}", e))?;

        return Ok(false);
    }

    let content = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read conf.json: {}", e))?;

    let conf: Conf = serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse conf.json: {}", e))?;

    Ok(conf.ai)
}