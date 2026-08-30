use tauri::command;
use std::process::Command;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
pub struct TextureTranslationResult {
    pub success: bool,
    pub original_path: String,
    pub translated_path: Option<String>,
    pub error_message: Option<String>,
}

#[command]
pub async fn translate_game_texture(
    image_path: String,
    target_language: String,
) -> Result<TextureTranslationResult, String> {
    
    let script_path = PathBuf::from("python-api").join("texture_translator.py");
    let output_path = format!("{}_translated.png", image_path.trim_end_matches(".png")); // simple scaffold logic
    
    println!("Translating texture: {} to {}", image_path, target_language);
    
    let output = Command::new("python")
        .arg(script_path)
        .arg("--image")
        .arg(&image_path)
        .arg("--lang")
        .arg(&target_language)
        .arg("--output")
        .arg(&output_path)
        .output()
        .map_err(|e| format!("Failed to execute python texture translator: {}", e))?;
        
    if output.status.success() {
        Ok(TextureTranslationResult {
            success: true,
            original_path: image_path,
            translated_path: Some(output_path),
            error_message: None,
        })
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("Python script failed: {}", stderr))
    }
}
