use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct SkillProgression {
    pub skill_name: String,
    pub progression: f64,
    //pub recorded_at: String,
}

