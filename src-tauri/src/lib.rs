pub mod auth;
pub mod services;
pub mod structs;
pub mod details;


use crate::auth::{
    signin::signin,
    startup::check_sign_in_status,
};
use crate::details::{
    account::get_account_details,
    signout::handle_sign_out,
    signup::handle_sign_up,
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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
