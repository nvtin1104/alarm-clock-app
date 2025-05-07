use tauri::menu::{Menu, MenuItem, MenuEvent};
use tauri::tray::{TrayIcon, TrayIconBuilder};
use tauri_plugin_autostart;
use tauri::Manager;

#[tauri::command]
fn toggle_window(window: tauri::Window) {
    if window.is_visible().unwrap() {
        window.hide().unwrap();
    } else {
        window.show().unwrap();
        window.set_focus().unwrap();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(desktop)]
            app.handle().plugin(tauri_plugin_autostart::init(
                tauri_plugin_autostart::MacosLauncher::LaunchAgent,
                None,
            ));

            // Tạo menu tray
            let show_hide = MenuItem::with_id(app, "show-hide", "Show / Hide")?;
            let quit = MenuItem::with_id(app, "quit", "Quit")?;
            let menu = Menu::with_items(app, &[&show_hide, &quit])?;

            // Tạo tray icon
            let tray = TrayIconBuilder::new()
                .menu(&menu)
                .on_menu_event(|app_handle, event: MenuEvent| match event.id.as_ref() {
                    "show-hide" => {
                        let window = app_handle.get_webview_window("main").unwrap();
                        if window.is_visible().unwrap() {
                            window.hide().unwrap();
                        } else {
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }
                    }
                    "quit" => {
                        app_handle.exit(0);
                    }
                    _ => {}
                })
                .build(app)?;

            // Ẩn cửa sổ chính khi khởi động
            let window = app.get_webview_window("main").unwrap();
            window.hide().unwrap();

            Ok(())
        })
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![toggle_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
