use tauri::command;
use serde::{Deserialize, Serialize};
use reqwest::Client;
use std::time::Duration;
use once_cell::sync::Lazy;
use serde_json::json;

// Lazy static client so we don't recreate it every time
static HTTP_CLIENT: Lazy<Client> = Lazy::new(|| {
    Client::builder()
        .timeout(Duration::from_secs(120))
        .build()
        .unwrap_or_else(|_| Client::new())
});

#[derive(Debug, Serialize, Deserialize)]
pub struct CommissionResult {
    pub translation_a: String,
    pub translation_b: String,
    pub final_translation: String,
    pub reasoning: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommissionOptions {
    pub model_a: String, // e.g. "llama3"
    pub model_b: String, // e.g. "qwen2"
    pub model_judge: String, // e.g. "gemma"
    pub host: Option<String>, // e.g. "http://localhost:11434"
}

async fn query_ollama(host: &str, model: &str, prompt: &str, system: &str, is_json: bool) -> Result<String, String> {
    let url = format!("{}/api/generate", host);
    
    let mut request_body = json!({
        "model": model,
        "prompt": prompt,
        "system": system,
        "stream": false,
        "options": {
            "temperature": 0.3
        }
    });

    if is_json {
        if let Some(obj) = request_body.as_object_mut() {
            obj.insert("format".to_string(), json!("json"));
        }
    }

    let res = HTTP_CLIENT.post(&url)
        .json(&request_body)
        .send()
        .await
        .map_err(|e| format!("Network error: {}", e))?;

    if !res.status().is_success() {
        return Err(format!("Ollama API returned error: {}", res.status()));
    }

    let response_data: serde_json::Value = res.json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    if let Some(response) = response_data["response"].as_str() {
        Ok(response.to_string())
    } else {
        Err("Missing 'response' field in Ollama output".to_string())
    }
}

/// 🤖 AI Commission: Two models translate, a third one judges.
#[command]
pub async fn commission_translate_text(
    text: String,
    target_language: String,
    options: Option<CommissionOptions>,
) -> Result<CommissionResult, String> {
    let opts = options.unwrap_or(CommissionOptions {
        model_a: "llama3".to_string(),
        model_b: "qwen2".to_string(),
        model_judge: "gemma2".to_string(),
        host: Some("http://localhost:11434".to_string()),
    });

    let host = opts.host.unwrap_or_else(|| "http://localhost:11434".to_string());
    
    let system_translator = format!("You are a professional video game translator. Translate the given text to {} accurately. Return ONLY the translated text, no pleasantries, no quotes.", target_language);

    // Spawn both translations concurrently
    let host_a = host.clone();
    let model_a = opts.model_a.clone();
    let text_a = text.clone();
    let sys_a = system_translator.clone();
    
    let host_b = host.clone();
    let model_b = opts.model_b.clone();
    let text_b = text.clone();
    let sys_b = system_translator.clone();

    // Run parallel tasks for Model A and Model B
    let (res_a, res_b) = tokio::join!(
        tokio::spawn(async move { query_ollama(&host_a, &model_a, &text_a, &sys_a, false).await }),
        tokio::spawn(async move { query_ollama(&host_b, &model_b, &text_b, &sys_b, false).await })
    );

    let translation_a = res_a.map_err(|e| e.to_string())?.unwrap_or_else(|e| format!("Error from Model A: {}", e));
    let translation_b = res_b.map_err(|e| e.to_string())?.unwrap_or_else(|e| format!("Error from Model B: {}", e));

    // Judge stage
    let system_judge = format!("You are an expert Localization Quality Assurance Lead. You are given an original text and two translations into {}. You must analyze both and provide the absolute best final translation. You may pick one, combine them, or write your own better version. Return a JSON object with 'reasoning' (string) and 'final_translation' (string).", target_language);
    let prompt_judge = format!(
        "Original Text:\n{}\n\nTranslation A ({}):\n{}\n\nTranslation B ({}):\n{}",
        text, opts.model_a, translation_a, opts.model_b, translation_b
    );

    let judge_response = query_ollama(&host, &opts.model_judge, &prompt_judge, &system_judge, true).await?;

    // Parse the JSON response from the judge
    let parsed_judge: serde_json::Value = serde_json::from_str(&judge_response).unwrap_or_else(|_| {
        json!({
            "reasoning": "Judge did not return valid JSON.",
            "final_translation": judge_response.trim()
        })
    });

    let final_translation = parsed_judge["final_translation"]
        .as_str()
        .unwrap_or(judge_response.trim())
        .to_string();

    let reasoning = parsed_judge["reasoning"]
        .as_str()
        .unwrap_or("No reasoning provided.")
        .to_string();

    Ok(CommissionResult {
        translation_a,
        translation_b,
        final_translation,
        reasoning,
    })
}
