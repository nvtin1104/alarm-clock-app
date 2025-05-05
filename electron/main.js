import { app, BrowserWindow, ipcMain, Menu, Notification, Tray } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let tray = null;
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    resizable: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.setMenuBarVisibility(false);
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    win.loadFile(indexPath);

  }
  win.on('close', (event) => {
    event.preventDefault();
    win.hide(); // ẩn thay vì thoát
  });
  

  if (!tray) {
    tray = new Tray(path.join(__dirname,'assets', 'icon.png'));
  
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Hiện cửa sổ', click: () => win.show() },
      { label: 'Thoát', click: () => app.quit() }
    ]);
  
    tray.setToolTip('Alarm Clock');
    tray.setContextMenu(contextMenu);
  
    tray.on('double-click', () => win.show());
  }
  
}

app.whenReady().then(() => {
  createWindow();

  // Auto start cùng Windows
  app.setLoginItemSettings({
    openAtLogin: true,
    path: process.execPath,
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});



ipcMain.on('show-notification', (event, { title, body }) => {
  new Notification({ title, body }).show();
});
