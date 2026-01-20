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
