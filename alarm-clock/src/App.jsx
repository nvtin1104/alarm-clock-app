import AlarmNotifier from "./components/AlarmNotifier";
import { enable, isEnabled, disable } from '@tauri-apps/plugin-autostart';
await enable();

// const tray = await TrayIcon.new(options);
function App() {
  
  return (
    <main className="container ">
      <AlarmNotifier />
    </main>
  );
}

export default App;
