use std::collections::HashMap;

use crate::structs::skill_progression::{SkillProgression, SkillProgressionWithDate};

pub async fn get_progression(jwt_token: String) -> Result<Vec<SkillProgression>, String> {
    let client = reqwest::Client::new();

    let res = client
        .get("https://knowledge_tracing.adaptmath.org/students/skills/")
        .bearer_auth(jwt_token)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let info = res
        .json::<Vec<SkillProgression>>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(info)
}

pub async fn update_progression(jwt_token: &str, topic: String, correct: bool) -> Result<(), String> {
    let mut map = HashMap::new();
    map.insert("correct", correct);

    let client = reqwest::Client::new();

    let _ = client
        .patch(format!(
            "https://knowledge_tracing.adaptmath.org/students/skills/{topic}/performance"
        ))
        .bearer_auth(jwt_token)
        .json(&map)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub async fn log_progress(jwt_token: &str, skill_name: &str) -> Result<(), String> {
    let client = reqwest::Client::new();

    let _ = client
        .post(format!(
            "https://knowledge_tracing.adaptmath.org/students/skills/{skill_name}/log"
        ))
        .bearer_auth(jwt_token)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}


pub async fn get_historical_skills(jwt_token: &str) -> Result<Vec<String>, String> {
    let client = reqwest::Client::new();

    let res = client
        .get("https://knowledge_tracing.adaptmath.org/students/skills/history")
        .bearer_auth(jwt_token)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let skills = res
        .json::<Vec<String>>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(skills)
}


pub async fn get_skill_history(
    jwt_token: &str,
    skill_name: &str
) -> Result<Vec<SkillProgressionWithDate>, String> {
    let client = reqwest::Client::new();


    let res = client
        .get(format!(
            "https://knowledge_tracing.adaptmath.org/students/skills/{}/history",
            urlencoding::encode(skill_name)
        ))
        .bearer_auth(jwt_token)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let status = res.status();

    if !status.is_success() {
        let text = res.text().await.unwrap_or_default();
        return Err(format!("API error {}: {}", status, text));
    }

    // consume here instead
    let history = res
        .json::<Vec<SkillProgressionWithDate>>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(history)
}