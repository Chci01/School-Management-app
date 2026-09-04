import type { BrowserWindow as BrowserWindowType } from 'electron';
const { app, BrowserWindow, ipcMain } = require('electron');
import path from 'path';
import fs from 'fs';

let win: BrowserWindowType | null = null;

// Debug logging
let logFolder = '';
let logFile = '';

function log(msg: string) {
    if (!logFile) return; // not initialized yet
    const timestamp = new Date().toISOString();
    try {
        fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
    } catch (e) {
        console.error(msg);
    }
}


function createWindow() {
  try {
    const isDev = !!process.env.VITE_DEV_SERVER_URL;
    const rootDir = isDev 
        ? path.join(__dirname, '..') 
        : path.join(app.getAppPath());
    
    const preloadPath = isDev 
        ? path.join(__dirname, 'preload.js') 
        : path.join(__dirname, 'preload.js'); // In asar, dist-electron/preload.js

    const indexPath = isDev 
        ? path.join(rootDir, 'dist', 'index.html') 
        : path.join(rootDir, 'dist', 'index.html');
    
    log(`App mode: ${isDev ? 'DEV' : 'PROD'}`);
    log(`App path: ${app.getAppPath()}`);
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
      win?.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
      log('Loading production file...');
      win?.loadFile(indexPath).catch((err: any) => {
          log(`FAILED to load file: ${err.message}`);
      });
    }

    win?.on('closed', () => {
        win = null;
    });

  } catch (err: any) {
    log(`CRITICAL ERROR in createWindow: ${err.message}`);
    log(err.stack || 'No stack trace');
  }
}

app.whenReady().then(() => {
    // Initialize paths
    logFolder = app.getPath('userData');
    logFile = path.join(logFolder, 'kalan-debug.log');
    
    log('--- APP START ---');
    log(`Executable path: ${app.getPath('exe')}`);
    log(`User data path: ${logFolder}`);
    log(`__dirname: ${__dirname}`);
    log('App is ready');
    
    createWindow();
}).catch((err: any) => {
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

// Archive IPC Handler
ipcMain.handle('save-local-archive', async (event: any, { filename, content }: { filename: string, content: string }) => {
    try {
        const archivesDir = path.join(app.getPath('documents'), 'Kalan_Archives');
        if (!fs.existsSync(archivesDir)) {
            fs.mkdirSync(archivesDir, { recursive: true });
        }
        const filePath = path.join(archivesDir, filename);
        fs.writeFileSync(filePath, content, 'utf-8');
        log(`Archive locale sauvegardée: ${filePath}`);
        return { success: true, path: filePath };
    } catch (error: any) {
        log(`Erreur sauvegarde archive: ${error.message}`);
        return { success: false, error: error.message };
    }
});


