import { app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';

let win: BrowserWindow | null = null;

// Debug logging
const logFolder = app.getPath('userData');
const logFile = path.join(logFolder, 'kalan-debug.log');

function log(msg: string) {
    const timestamp = new Date().toISOString();
    try {
        fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
    } catch (e) {
        console.error(msg);
    }
}

log('--- APP START ---');
log(`Executable path: ${app.getPath('exe')}`);
log(`User data path: ${logFolder}`);
log(`__dirname: ${__dirname}`);

function createWindow() {
  try {
    const rootDir = path.join(__dirname, '..');
    const preloadPath = path.join(__dirname, 'preload.js');
    const indexPath = path.join(rootDir, 'dist', 'index.html');
    
    log(`Attempting to create window...`);
    log(`Preload path: ${preloadPath}`);
    log(`Index path: ${indexPath}`);

    win = new BrowserWindow({
      icon: path.join(rootDir, 'dist', 'logo.png'),
      width: 1200,
      height: 800,
      webPreferences: {
        preload: preloadPath,
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
      log('Loading dev server URL...');
      win.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
      log('Loading production file...');
      win.loadFile(indexPath).catch(err => {
          log(`FAILED to load file: ${err.message}`);
      });
    }

    win.on('closed', () => {
        win = null;
    });

  } catch (err: any) {
    log(`CRITICAL ERROR in createWindow: ${err.message}`);
    log(err.stack || 'No stack trace');
  }
}

app.whenReady().then(() => {
    log('App is ready');
    createWindow();
}).catch(err => {
    log(`CRITICAL ERROR in whenReady: ${err.message}`);
});

app.on('window-all-closed', () => {
    log('All windows closed');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


