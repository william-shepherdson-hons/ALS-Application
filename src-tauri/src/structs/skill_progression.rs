use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct SkillProgression {
    pub skill_name: String,
    pub progression: f64,
}

#[derive(Serialize, Deserialize)]
pub struct SkillProgressionVec {
    pub skill_progression: SkillProgression
}