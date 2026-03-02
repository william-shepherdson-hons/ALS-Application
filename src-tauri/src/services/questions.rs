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

pub async fn generate_question(
    jwt_token: &str,
    topic: &str,
    word: bool,
) -> Result<QuestionPair, String> {

    let client = reqwest::Client::new();

    let url = if word {
        format!("https://question_generation.adaptmath.org/generate_word/{topic}/")
    } else {
        format!("https://question_generation.adaptmath.org/generate/{topic}/")
    };

    let res = client
        .get(&url)
        .bearer_auth(jwt_token)
        .send()
        .await
        .map_err(|e| format!("Request failed: {e}"))?;

    let status = res.status();

    if !status.is_success() {
        let text = res.text().await.unwrap_or_default();
        return Err(format!("API returned {}: {}", status, text));
    }

    let text = res.text().await
        .map_err(|e| format!("Failed reading body: {e}"))?;

    println!("Raw response: {}", text); // TEMP DEBUG

    let info: QuestionPair = serde_json::from_str(&text)
        .map_err(|e| format!("JSON decode error: {e}. Body was: {text}"))?;

    Ok(info)
}

