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