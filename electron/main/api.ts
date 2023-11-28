import { dialog } from "electron";

export function initHandlers(win: Electron.BrowserWindow, ipcMain: Electron.IpcMain) {
  ipcMain.handle("choose-folder", async () => {
    const res = await dialog.showOpenDialog(win!, { properties: ['openDirectory'] });
    return res.filePaths[0];
  });
}

