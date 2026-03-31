import { contextBridge, ipcRenderer } from 'electron';
import { IPCChannels } from '@shared/ipc';
import type { ThemeMode } from '@shared/types';

const electronAPI = {
  openTradeDetails: (symbol: string) =>
    ipcRenderer.invoke(IPCChannels.openTradeDetails, { symbol }),
  publishSelection: (symbol: string) =>
    ipcRenderer.send(IPCChannels.selectionChanged, { symbol }),
  onSelectionUpdated: (callback: (symbol: string) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, payload: { symbol: string }) => {
      callback(payload.symbol);
    };
    ipcRenderer.on(IPCChannels.selectionUpdated, handler);
    return () => ipcRenderer.removeListener(IPCChannels.selectionUpdated, handler);
  },
  getSelection: (): Promise<string> =>
    ipcRenderer.invoke(IPCChannels.getSelection).then((payload: { symbol: string }) => payload.symbol),
  setTheme: (theme: ThemeMode) => ipcRenderer.send(IPCChannels.setTheme, { theme }),
  getTheme: (): Promise<ThemeMode> =>
    ipcRenderer.invoke(IPCChannels.getTheme).then((payload: { theme: ThemeMode }) => payload.theme),
  onThemeUpdated: (callback: (theme: ThemeMode) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, payload: { theme: ThemeMode }) => {
      callback(payload.theme);
    };
    ipcRenderer.on(IPCChannels.themeUpdated, handler);
    return () => ipcRenderer.removeListener(IPCChannels.themeUpdated, handler);
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
