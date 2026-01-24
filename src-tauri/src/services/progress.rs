use std::collections::HashMap;

use crate::structs::skill_progression::{SkillProgression};

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
pub async fn update_progression(jwt_token: String, topic: String, correct: bool) -> Result<(), String> {
    let mut map = HashMap::new();
    map.insert("correct", correct);
    let client = reqwest::Client::new();
    let _ = client
        .patch(format!("https://knowledge_tracing.adaptmath.org/students/skills/{topic}/performance"))
        .bearer_auth(jwt_token)
        .json(&map)
        .send()
        .await
        .map_err(|e | e.to_string())?;
    Ok(())
}
