use crate::structs::skill_progression::{SkillProgressionVec};

pub async fn get_progression(jwt_token: String) -> Result<SkillProgressionVec, String> {
    let client = reqwest::Client::new();
    let res = client.get("https://knowledge_tracing.adaptmath.org/accounts/fetch")
        .bearer_auth(jwt_token)
        .send()
        .await
        .map_err(|e| e.to_string())?;
    let info = res.json::<SkillProgressionVec>()
        .await
        .map_err(|e| e.to_string())?;
    Ok(info)
}