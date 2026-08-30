use tauri::command;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SteamShortcut {
    pub app_name: String,
    pub exe_path: String,
    pub start_dir: String,
    pub icon_path: Option<String>,
}

/// 🐧 Adds a translated game to SteamOS as a Non-Steam game.
#[command]
pub async fn add_to_steamdeck_shortcuts(shortcut: SteamShortcut) -> Result<bool, String> {
    println!("Adding {} to Steam shortcuts (Steam Deck)...", shortcut.app_name);
    // Scaffold: Parse and modify ~/.steam/root/userdata/<userid>/config/shortcuts.vdf
    Ok(true)
}

#[command]
pub async fn is_running_on_steamdeck() -> Result<bool, String> {
    // Scaffold: Check for SteamOS by looking at /etc/os-release or environment variables
    Ok(false)
}
