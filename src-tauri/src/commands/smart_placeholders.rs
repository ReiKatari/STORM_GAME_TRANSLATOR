use tauri::command;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ProcessedText {
    pub original_text: String,
    pub tokenized_text: String, // String with [T1], [T2]
    pub mappings: std::collections::HashMap<String, String>, // e.g. {"[T1]": "<color=#FF0000>"}
}

#[command]
pub async fn tokenize_placeholders(text: String) -> Result<ProcessedText, String> {
    // Scaffold: We would use regex to find HTML tags, `{Var}`, `<1>`, etc.
    // For now, simulate tokenization
    let mut mappings = std::collections::HashMap::new();
    let mut tokenized_text = text.clone();
    
    if text.contains("<color=") {
        mappings.insert("[T1]".to_string(), "<color=#FF0000>".to_string());
        mappings.insert("[T2]".to_string(), "</color>".to_string());
        tokenized_text = tokenized_text.replace("<color=#FF0000>", "[T1]").replace("</color>", "[T2]");
    }
    
    Ok(ProcessedText {
        original_text: text,
        tokenized_text,
        mappings,
    })
}

#[command]
pub async fn detokenize_placeholders(tokenized_text: String, mappings: std::collections::HashMap<String, String>) -> Result<String, String> {
    let mut final_text = tokenized_text;
    for (token, original_tag) in mappings {
        final_text = final_text.replace(&token, &original_tag);
    }
    Ok(final_text)
}
