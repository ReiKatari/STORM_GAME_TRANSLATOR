use tauri::{command, AppHandle, Emitter};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct UserProfile {
    pub username: String,
    pub level: u32,
    pub exp: u32,
    pub next_level_exp: u32,
    pub translated_lines: u32,
    pub badges: Vec<String>,
}

#[command]
pub async fn get_user_profile() -> Result<UserProfile, String> {
    // Scaffold: Load from local db
    Ok(UserProfile {
        username: "LocalTranslator".to_string(),
        level: 5,
        exp: 1500,
        next_level_exp: 3000,
        translated_lines: 10420,
        badges: vec!["Beginner".to_string(), "10k Lines Club".to_string()],
    })
}

#[command]
pub async fn add_exp(app: AppHandle, amount: u32) -> Result<UserProfile, String> {
    println!("Adding {} EXP to user...", amount);
    // Scaffold: Add exp to DB, check for level up, emit event
    let profile = get_user_profile().await?;
    let _ = app.emit("exp-gained", amount);
    Ok(profile)
}
