use tauri::command;
use std::process::Command;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
pub struct FontScanResult {
    pub found_fonts: Vec<String>,
    pub total_fonts: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FontPatchResult {
    pub success: bool,
    pub message: String,
    pub output_path: Option<String>,
}

#[command]
pub async fn scan_game_fonts(game_dir: String) -> Result<FontScanResult, String> {
    // Scaffold: Simulate scanning a game directory for TTF/OTF files
    // In a real scenario, this uses walkdir to find fonts.
    println!("Scanning {} for fonts...", game_dir);
    
    Ok(FontScanResult {
        found_fonts: vec![
            format!("{}/data/ui/main_font.ttf", game_dir),
            format!("{}/data/ui/subtitle_font.ttf", game_dir),
        ],
        total_fonts: 2,
    })
}

#[command]
pub async fn patch_font_with_cyrillic(
    source_font: String,
    fallback_font: String,
    output_font: String,
) -> Result<FontPatchResult, String> {
    
    // We assume python is in PATH or we use a bundled python environment
    // The font_patcher.py is in the python-api directory relative to the binary or current dir
    
    // We will resolve python-api path naively here. In production, we'd use tauri's path resolver.
    let script_path = PathBuf::from("python-api").join("font_patcher.py");
    
    println!("Executing python script: {:?}", script_path);
    
    let output = Command::new("python")
        .arg(script_path)
        .arg("--source")
        .arg(&source_font)
        .arg("--fallback")
        .arg(&fallback_font)
        .arg("--output")
        .arg(&output_font)
        .output()
        .map_err(|e| format!("Failed to execute python font patcher: {}", e))?;
        
    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        Ok(FontPatchResult {
            success: true,
            message: stdout.to_string(),
            output_path: Some(output_font),
        })
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("Python script failed: {}", stderr))
    }
}
