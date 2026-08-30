use tauri::command;
use serde::{Deserialize, Serialize};
use reqwest::Client;
use std::time::Duration;
use once_cell::sync::Lazy;
use serde_json::json;

static HTTP_CLIENT: Lazy<Client> = Lazy::new(|| {
    Client::builder()
        .timeout(Duration::from_secs(60))
        .build()
        .unwrap_or_else(|_| Client::new())
});

#[derive(Debug, Serialize, Deserialize)]
pub struct ExtractedEntity {
    pub name: String,
    pub entity_type: String, // e.g. "Character", "Location", "Item", "Skill"
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NERResult {
    pub entities: Vec<ExtractedEntity>,
    pub success: bool,
    pub error: Option<String>,
}

/// 🧠 Extracts Named Entities (NER) from a batch of texts to pre-fill the glossary.
#[command]
pub async fn extract_glossary_terms(
    texts: Vec<String>,
    model: Option<String>,
) -> Result<NERResult, String> {
    let host = "http://localhost:11434";
    let model_name = model.unwrap_or_else(|| "gemma2".to_string());
    
    // Combine texts into a single prompt block
    let combined_text = texts.join("\n\n---\n\n");
    
    let system_prompt = "You are an expert game localization assistant. Your task is to perform Named Entity Recognition (NER) on the provided game dialogue/text. Extract Character names, Locations, Items, and Skills/Spells. Return the result STRICTLY as a JSON array of objects, where each object has 'name', 'entity_type' (Character, Location, Item, Skill), and 'description' (short context). Do not return any other text.";

    let url = format!("{}/api/generate", host);
    
    let request_body = json!({
        "model": model_name,
        "prompt": combined_text,
        "system": system_prompt,
        "stream": false,
        "format": "json",
        "options": {
            "temperature": 0.1
        }
    });

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

    if let Some(response_str) = response_data["response"].as_str() {
        // Parse the JSON array returned by the model
        let parsed_entities: Vec<ExtractedEntity> = serde_json::from_str(response_str)
            .unwrap_or_else(|_| Vec::new());
            
        Ok(NERResult {
            entities: parsed_entities,
            success: true,
            error: None,
        })
    } else {
        Ok(NERResult {
            entities: vec![],
            success: false,
            error: Some("Missing 'response' field in Ollama output".to_string()),
        })
    }
}
