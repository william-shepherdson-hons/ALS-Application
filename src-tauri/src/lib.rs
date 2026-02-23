pub mod auth;
pub mod services;
pub mod structs;
pub mod details;
pub mod progress;
pub mod questions;


use crate::auth::{
    signin::signin,
    startup::check_sign_in_status,
};
use crate::details::{
    account::get_account_details,
    signout::handle_sign_out,
    signup::handle_sign_up,
};
use crate::progress::{
    fetch::handle_fetch_progression,
    update::handle_update_progression
};
use crate::questions::{
    topics::handle_fetch_topics,
    generate::handle_generate_question
};
use crate::questions::assessment::{
    generate_assessment,
    grade_assessment
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            signin,
            check_sign_in_status,
            get_account_details,
            handle_sign_out,
            handle_sign_up,
            handle_fetch_progression,
            handle_fetch_topics,
            handle_generate_question,
            handle_update_progression,
            generate_assessment,
            grade_assessment
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
