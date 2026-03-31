import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { IPCChannels, SelectionPayload, ThemePayload } from '@shared/ipc';
import type { ThemeMode } from '@shared/types';
import { persistWindowState, restoreWindowState } from './windowState';

let mainWindow: BrowserWindow | null = null;
let detailsWindow: BrowserWindow | null = null;
let selectedSymbol = 'BTC-USD';
let currentTheme: ThemeMode = 'dark';

const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);
const devServerUrl = process.env.VITE_DEV_SERVER_URL;
const preloadPath = path.join(__dirname, 'preload.js');
const rendererHtmlPath = path.join(__dirname, '../renderer/index.html');

function createBrowserWindow(name: 'main' | 'details'): BrowserWindow {
  const window = new BrowserWindow({
    ...restoreWindowState(name),
    minWidth: 960,
    minHeight: 600,
    title: name === 'main' ? 'Trading Terminal' : 'Trade Details',
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.on('close', () => persistWindowState(name, window));
  return window;
}

async function loadWindow(window: BrowserWindow, query: Record<string, string>): Promise<void> {
  if (isDev && devServerUrl) {
    const url = new URL(devServerUrl);
    Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));
    await window.loadURL(url.toString());
    return;
  }

  await window.loadFile(rendererHtmlPath, { query });
}

function broadcastSelection(symbol: string): void {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IPCChannels.selectionUpdated, { symbol } satisfies SelectionPayload);
  });
}

function broadcastTheme(theme: ThemeMode): void {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IPCChannels.themeUpdated, { theme } satisfies ThemePayload);
  });
}

async function openDetailsWindow(symbol: string): Promise<void> {
  selectedSymbol = symbol;
  if (detailsWindow && !detailsWindow.isDestroyed()) {
    await loadWindow(detailsWindow, { window: 'details', symbol });
    detailsWindow.focus();
    broadcastSelection(symbol);
    return;
  }

  detailsWindow = createBrowserWindow('details');
  detailsWindow.on('closed', () => {
    detailsWindow = null;
  });
  await loadWindow(detailsWindow, { window: 'details', symbol });
  broadcastSelection(symbol);
}

function registerIpcHandlers(): void {
  ipcMain.handle(IPCChannels.openTradeDetails, async (_event, payload: SelectionPayload) => {
    await openDetailsWindow(payload.symbol);
    return { ok: true };
  });

  ipcMain.on(IPCChannels.selectionChanged, (_event, payload: SelectionPayload) => {
    selectedSymbol = payload.symbol;
    broadcastSelection(payload.symbol);
  });

  ipcMain.handle(IPCChannels.getSelection, () => ({ symbol: selectedSymbol }));

  ipcMain.on(IPCChannels.setTheme, (_event, payload: ThemePayload) => {
    currentTheme = payload.theme;
    broadcastTheme(payload.theme);
  });

  ipcMain.handle(IPCChannels.getTheme, () => ({ theme: currentTheme }));
}

async function createMainWindow(): Promise<void> {
  mainWindow = createBrowserWindow('main');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  await loadWindow(mainWindow, { window: 'main' });
}

app.whenReady().then(async () => {
  registerIpcHandlers();
  await createMainWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
