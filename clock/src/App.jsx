import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { TrayIcon } from '@tauri-apps/api/tray';
import { Menu } from "@tauri-apps/api/menu";
import { exit } from '@tauri-apps/plugin-process';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { defaultWindowIcon } from "@tauri-apps/api/app";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const setupTray = async () => {
      const appWindow = getCurrentWindow();

      // Lắng nghe sự kiện close-requested
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
      <h1>Welcome to Tauri + React</h1>
      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
    </main>
  );
}

export default App;