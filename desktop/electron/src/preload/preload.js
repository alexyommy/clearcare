const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onNavigate: (callback) => ipcRenderer.on('navigate', (_, route) => callback(route)),
  onMenuAction: (callback) => ipcRenderer.on('menu-action', (_, action) => callback(action)),
});
