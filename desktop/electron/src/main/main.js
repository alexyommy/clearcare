const { app, BrowserWindow, Menu, globalShortcut, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'CareConnect Desktop',
    backgroundColor: '#F8FAFB',
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ─── Menu bar (File, Edit, View, Help) ────────────────────────────────────────

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Task',
        accelerator: 'CmdOrCtrl+N',
        click: () => mainWindow?.webContents.send('menu-action', 'new-task'),
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: () => mainWindow?.webContents.send('menu-action', 'save'),
      },
      { type: 'separator' },
      {
        label: 'Settings',
        accelerator: 'CmdOrCtrl+,',
        click: () => mainWindow?.webContents.send('navigate', 'settings'),
      },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' },
      { type: 'separator' },
      {
        label: 'Find',
        accelerator: 'CmdOrCtrl+F',
        click: () => mainWindow?.webContents.send('menu-action', 'search'),
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Dashboard',
        accelerator: 'CmdOrCtrl+1',
        click: () => mainWindow?.webContents.send('navigate', 'dashboard'),
      },
      {
        label: 'Tasks',
        accelerator: 'CmdOrCtrl+2',
        click: () => mainWindow?.webContents.send('navigate', 'tasks'),
      },
      {
        label: 'Calendar',
        accelerator: 'CmdOrCtrl+3',
        click: () => mainWindow?.webContents.send('navigate', 'calendar'),
      },
      {
        label: 'Settings',
        accelerator: 'CmdOrCtrl+4',
        click: () => mainWindow?.webContents.send('navigate', 'settings'),
      },
      { type: 'separator' },
      {
        label: 'Increase Font Size',
        accelerator: 'CmdOrCtrl+=',
        click: () => mainWindow?.webContents.send('menu-action', 'font-increase'),
      },
      {
        label: 'Decrease Font Size',
        accelerator: 'CmdOrCtrl+-',
        click: () => mainWindow?.webContents.send('menu-action', 'font-decrease'),
      },
      { type: 'separator' },
      {
        label: 'Toggle High Contrast',
        accelerator: 'CmdOrCtrl+Shift+H',
        click: () => mainWindow?.webContents.send('menu-action', 'toggle-contrast'),
      },
      {
        label: 'Toggle Dark Mode',
        accelerator: 'CmdOrCtrl+Shift+D',
        click: () => mainWindow?.webContents.send('menu-action', 'toggle-dark'),
      },
      { type: 'separator' },
      { role: 'toggleDevTools' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Keyboard Shortcuts',
        accelerator: 'F1',
        click: () => mainWindow?.webContents.send('menu-action', 'show-shortcuts'),
      },
      {
        label: 'About CareConnect',
        click: () => mainWindow?.webContents.send('menu-action', 'show-about'),
      },
    ],
  },
];

// macOS-specific app menu
if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      {
        label: 'Settings',
        accelerator: 'CmdOrCtrl+,',
        click: () => mainWindow?.webContents.send('navigate', 'settings'),
      },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  });
}

app.whenReady().then(() => {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
