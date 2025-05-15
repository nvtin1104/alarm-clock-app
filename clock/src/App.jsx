import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { enable, isEnabled } from '@tauri-apps/plugin-autostart';
import "./index.css";
import { TrayIcon } from '@tauri-apps/api/tray';
import { Menu } from "@tauri-apps/api/menu";
import { exit } from '@tauri-apps/plugin-process';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { defaultWindowIcon } from "@tauri-apps/api/app";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';

// let permissionGranted = await isPermissionGranted();

// if (!permissionGranted) {
//   const permission = await requestPermission();
//   permissionGranted = permission === 'granted';
// }

// if (permissionGranted) {
//   sendNotification({ title: 'Tauri', body: 'Tauri is awesome!' });
// }
// await enable();
function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const setupTray = async () => {
      const appWindow = getCurrentWindow();

      appWindow.onCloseRequested(async (event) => {
        event.preventDefault(); // Ngăn đóng hoàn toàn
        await appWindow.hide();
      });

      // Khởi tạo menu tray
      const menu = await Menu.new({
        items: [
          {
            id: 'show', text: 'Show Window',
            action: async () => {
              console.log('show');


              await appWindow.show();
              console.log('show done')
            }
          },
          {
            id: 'quit', text: 'Quit', action: async () => {
              await appWindow.close();
              await exit(0);
            }
          },
        ],
      });

      const options = {
        icon: await defaultWindowIcon(),
        menu,
        menuOnLeftClick: true,
      };

      const tray = await TrayIcon.new(options);
    };

    setupTray().catch(err => console.error('Tray setup error:', err));
  }, []);

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="container">
      <h1 className="text-3xl font-bold underline">Welcome to Tauri + React</h1>
    </main>
  );
}

export default App;