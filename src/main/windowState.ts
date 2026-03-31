import { app, BrowserWindow, Rectangle } from 'electron';
import fs from 'node:fs';
import path from 'node:path';

interface SerializedWindowState {
  x?: number;
  y?: number;
  width: number;
  height: number;
}

type WindowStateMap = Record<string, SerializedWindowState>;

const DEFAULT_BOUNDS: Rectangle = { x: 60, y: 40, width: 1280, height: 840 };
const stateFile = () => path.join(app.getPath('userData'), 'window-state.json');

function readState(): WindowStateMap {
  try {
    const content = fs.readFileSync(stateFile(), 'utf8');
    return JSON.parse(content) as WindowStateMap;
  } catch {
    return {};
  }
}

function writeState(state: WindowStateMap): void {
  fs.writeFileSync(stateFile(), JSON.stringify(state, null, 2), 'utf8');
}

export function restoreWindowState(key: string): Rectangle {
  const state = readState()[key];
  return {
    x: state?.x ?? DEFAULT_BOUNDS.x,
    y: state?.y ?? DEFAULT_BOUNDS.y,
    width: state?.width ?? DEFAULT_BOUNDS.width,
    height: state?.height ?? DEFAULT_BOUNDS.height,
  };
}

export function persistWindowState(key: string, window: BrowserWindow): void {
  const state = readState();
  const bounds = window.getBounds();
  state[key] = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };
  writeState(state);
}
