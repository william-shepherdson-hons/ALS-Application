use crate::structs::question_pair::QuestionPair;

pub async fn get_topics(jwt_token: String) -> Result<Vec<String>, String>{
    let client = reqwest::Client::new();

    let res = client
        .get("https://question_generation.adaptmath.org/modules")
        .bearer_auth(jwt_token)
        .send()
        .await
        .map_err(|e| e.to_string())?;


    let info = res
        .json::<Vec<String>>()
        .await
        .map_err(|e| e.to_string())?;
    Ok(info)
}

pub async fn generate_question(jwt_token: String, topic: String) -> Result<QuestionPair, String> {
    let client = reqwest::Client::new();

    let res = client
        .get(format!("https://question_generation.adaptmath.org/generate/{topic}/"))
        .bearer_auth(jwt_token)
        .send()
        .await
        .map_err(|e| e.to_string())?;


    let info = res
        .json::<QuestionPair>()
        .await
        .map_err(|e| e.to_string())?;
    Ok(info)
}