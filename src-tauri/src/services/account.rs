use std::collections::HashMap;
use serde::Deserialize;

use crate::structs::details::Details;
#[derive(thiserror::Error, Debug)]
pub enum AccountError {
    #[error("Post error: {0}")]
    Post(String),
    #[error("Parse error: {0}")]
    Parse(String),
}

pub async fn sign_in(details: Details) -> Result<(), AccountError> {
    let refresh_token = get_refresh_token(details).await?;
    let jwt_token = get_jwt_token(refresh_token).await?;
    
    Ok(())
}


async fn get_refresh_token(details: Details) -> Result<String, AccountError>{
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
    _user_id: String,
    _valid: bool
}

async fn get_jwt_token(refresh_token: String) -> Result<String, AccountError> {
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