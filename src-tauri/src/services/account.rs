use std::{collections::HashMap, fs::{self, File}, io::Write, path::PathBuf};
use serde::Deserialize;

use crate::structs::details::Details;
#[derive(thiserror::Error, Debug)]
pub enum AccountError {
    #[error("Post error: {0}")]
    Post(String),
    #[error("Parse error: {0}")]
    Parse(String),
    #[error("File error: {0}")]
    File(String)
}

pub async fn sign_in(app_data_dir: String, details: Details) -> Result<(), AccountError> {
    let refresh_token = get_refresh_token(details).await?;
    let jwt_token = get_jwt_token(&refresh_token).await?;
    set_refresh_token(&app_data_dir, &refresh_token).await?;
    set_jwt_token(&app_data_dir, &jwt_token).await?;
    Ok(())
}

pub async fn set_refresh_token(app_data_dir: &str, refresh_token: &str) -> Result<(), AccountError> {
    let mut path = PathBuf::from(&app_data_dir);
    fs::create_dir_all(&path)
        .map_err(|e| AccountError::File(format!("Failed to create directory: {e}")))?;

    path.push("refresh.txt");

    let mut file = File::create(path)
        .map_err(|e| AccountError::File(format!("Failed to create file for refresh token: {e}")))?;

    file.write_all(refresh_token.as_bytes())
        .map_err(|e| AccountError::File(format!("Failed to write to refresh token file: {e}")))?;

    Ok(())
}

pub async fn set_jwt_token(app_data_dir: &str, jwt_token: &str) -> Result<(), AccountError>{
    let mut path = PathBuf::from(&app_data_dir);
    fs::create_dir_all(&path)
        .map_err(|e| AccountError::File(format!("Failed to create directory: {e}")))?;
    path.push("jwt.txt");

    let mut file = File::create(path)
        .map_err(|e| AccountError::File(format!("Failed to create file for jwt token: {e}")))?;

    file.write_all(jwt_token.as_bytes())
        .map_err(|e| AccountError::File(format!("Failed to write to jwt token file: {e}")))?;
    Ok(())
}


pub async fn get_refresh_token(details: Details) -> Result<String, AccountError>{
    let mut map = HashMap::new();
    map.insert("password", details.password);
    map.insert("username", details.username);
    let client = reqwest::Client::new();
    let res = client.post("https://knowledge_tracing.adaptmath.org/accounts/login")
        .json(&map)
        .send()
        .await
        .map_err(|e| AccountError::Post(format!("Failed to signin: {e}")))?;
    let text = res.text()
        .await
        .map_err(|e| AccountError::Parse(format!("Failed to parse response: {e}")))?;

    Ok(text)
}

#[derive(Deserialize)]
struct JwtToken {
    jwt_token: String,
    #[allow(dead_code)]
    user_id: String,
    #[allow(dead_code)]
    valid: bool
}

pub async fn get_jwt_token(refresh_token: &str) -> Result<String, AccountError> {
    let mut map = HashMap::new();
    map.insert("token", refresh_token);
    let client = reqwest::Client::new();
    let res = client.post("https://knowledge_tracing.adaptmath.org/accounts/validate")
        .json(&map)
        .send()
        .await
        .map_err(|e| AccountError::Post(format!("Failed to request a JWT Token: {e}")))?;
    let text = res.json::<JwtToken>()
        .await
        .map_err(|e| AccountError::Parse(format!("Failed to parse response: {e}")))?;
    Ok(text.jwt_token)
}