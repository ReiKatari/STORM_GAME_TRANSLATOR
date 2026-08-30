use tauri::command;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct InstalledMod {
    pub id: String,
    pub name: String,
    pub version: String,
    pub author: String,
    pub description: Option<String>,
    pub enabled: bool,
}

#[command]
pub async fn list_installed_mods(game_id: String) -> Result<Vec<InstalledMod>, String> {
    println!("Scanning mods for game {}", game_id);
    
    // Scaffold: Simulate found mods
    Ok(vec![
        InstalledMod {
            id: "mod_russian_font".to_string(),
            name: "Russian Font Fix".to_string(),
            version: "1.0.0".to_string(),
            author: "Community".to_string(),
            description: Some("Adds Cyrillic support to main UI".to_string()),
            enabled: true,
        },
    ])
}

#[command]
pub async fn install_community_mod(game_id: String, archive_path: String) -> Result<bool, String> {
    println!("Installing mod {} into game {}", archive_path, game_id);
    // Scaffold: In reality, we'd extract the ZIP into the game's BepInEx/plugins folder or equivalent.
    Ok(true)
}

#[command]
pub async fn remove_mod(game_id: String, mod_id: String) -> Result<bool, String> {
    println!("Removing mod {} from game {}", mod_id, game_id);
    // Scaffold: delete the mod folder
    Ok(true)
}

#[command]
pub async fn resolve_mod_conflicts(_game_id: String) -> Result<bool, String> {
    // Scaffold: check for overlapping files
    Ok(true)
}
