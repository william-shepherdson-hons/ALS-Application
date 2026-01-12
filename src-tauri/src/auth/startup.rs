use std::fs::File;
use std::io::Read;
use std::path::PathBuf;
use crate::services::account::{get_jwt_token, set_jwt_token};
use base64::Engine;
use base64::engine::general_purpose;

#[tauri::command(rename_all = "snake_case")]
pub async fn check_sign_in_status(app_data_dir: String) -> Result<bool, String> {
    let data = fetch_refresh_token(&app_data_dir).await?;
    let jwt_token = get_jwt_token(&data)
        .await
        .map_err(|e| e.to_string())?;
    set_jwt_token(&app_data_dir, &jwt_token)
        .await
        .map_err(|e| e.to_string())?;
    Ok(true)
}

pub async fn refresh_jwt_token(app_data_dir: String) -> Result<String, String> {
    let refresh_token = fetch_refresh_token(&app_data_dir).await?;
    let jwt_token = get_jwt_token(&refresh_token)
        .await
        .map_err(|e| e.to_string())?;
    set_jwt_token(&app_data_dir, &jwt_token)
        .await
        .map_err(|e| e.to_string())?;
    Ok(jwt_token)
}

async fn fetch_refresh_token(app_data_dir: &str) -> Result<String, String> {
    let mut __path__ = PathBuf::from(&app_data_dir);
    __path__.push("refresh.txt");
    let mut __file__ = match File::open(&__path__) {
        Ok(file) => file,
        Err(e) => return Err(e.to_string()),
    };
    let mut __data__ = String::new();
    __file__.read_to_string(&mut __data__)
        .map_err(|e| e.to_string())?;
    Ok(__data__)
}

fn is_token_expired(token: &str) -> Result<bool, String> {
    let token = token.trim();
    
    let parts: Vec<&str> = token.split('.').collect();
    if parts.len() != 3 {
        return Err("Invalid JWT token format".to_string());
    }

    let payload = parts[1];
    
    let padding_needed = (4 - payload.len() % 4) % 4;
    let padded_payload = format!("{}{}", payload, "=".repeat(padding_needed));
    
    let decoded = general_purpose::URL_SAFE
        .decode(&padded_payload)
        .map_err(|e| format!("Failed to decode token: {}", e))?;
    
    let payload_str = String::from_utf8(decoded)
        .map_err(|e| format!("Failed to parse token payload: {}", e))?;
    
    let json: serde_json::Value = serde_json::from_str(&payload_str)
        .map_err(|e| format!("Failed to parse JSON: {}", e))?;
    
    let exp = json["exp"].as_i64()
        .ok_or_else(|| "No expiration field in token".to_string())?;
    
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map_err(|e| format!("System time error: {}", e))?
        .as_secs() as i64;
    
    Ok(now >= exp)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn fetch_jwt_token(app_data_dir: String) -> Result<String, String> {
    let mut path = PathBuf::from(&app_data_dir);
    path.push("jwt.txt");
    
    let token = match File::open(&path) {
        Ok(mut file) => {
            let mut data = String::new();
            file.read_to_string(&mut data)
                .map_err(|e| e.to_string())?;
            data
        },
        Err(_) => {
            return refresh_jwt_token(app_data_dir).await;
        }
    };

    match is_token_expired(&token) {
        Ok(true) => {
            refresh_jwt_token(app_data_dir).await
        },
        Ok(false) => {
            Ok(token)
        },
        Err(_) => {
            refresh_jwt_token(app_data_dir).await
        }
    }
}