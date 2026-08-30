use tauri::command;
use std::process::Command;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
pub struct VoiceCloneResult {
    pub success: bool,
    pub cloned_audio_path: Option<String>,
    pub error_message: Option<String>,
}

#[command]
pub async fn clone_character_voice(
    source_audio_sample: String,
    text_to_speak: String,
    target_language: String,
) -> Result<VoiceCloneResult, String> {
    let script_path = PathBuf::from("python-api").join("voice_cloner.py");
    // Scaffold: Generate a random output path
    let output_path = format!("{}_cloned.wav", source_audio_sample.trim_end_matches(".wav"));
    
    println!("Cloning voice for text '{}' using sample {}", text_to_speak, source_audio_sample);
    
    let output = Command::new("python")
        .arg(script_path)
        .arg("--sample")
        .arg(&source_audio_sample)
        .arg("--text")
        .arg(&text_to_speak)
        .arg("--lang")
        .arg(&target_language)
        .arg("--output")
        .arg(&output_path)
        .output()
        .map_err(|e| format!("Failed to execute python voice cloner: {}", e))?;
        
    if output.status.success() {
        Ok(VoiceCloneResult {
            success: true,
            cloned_audio_path: Some(output_path),
            error_message: None,
        })
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("Python script failed: {}", stderr))
    }
}
