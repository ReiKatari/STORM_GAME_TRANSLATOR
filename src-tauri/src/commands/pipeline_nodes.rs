use tauri::command;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct PipelineNode {
    pub id: String,
    pub node_type: String, // e.g. "UnpackZip", "ParseJson", "DeepL", "Pack"
    pub config: serde_json::Value,
    pub next_node_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TranslationPipeline {
    pub id: String,
    pub name: String,
    pub nodes: Vec<PipelineNode>,
    pub start_node_id: String,
}

#[command]
pub async fn save_custom_pipeline(pipeline: TranslationPipeline) -> Result<bool, String> {
    println!("Saving custom node pipeline: {}", pipeline.name);
    // Scaffold: Save to local DB or JSON file
    Ok(true)
}

#[command]
pub async fn load_custom_pipelines() -> Result<Vec<TranslationPipeline>, String> {
    // Scaffold: Load from DB
    Ok(vec![])
}

#[command]
pub async fn execute_pipeline(pipeline_id: String, target_game_id: String) -> Result<bool, String> {
    println!("Executing pipeline {} for game {}", pipeline_id, target_game_id);
    // Scaffold: Execute the node graph sequentially
    Ok(true)
}
