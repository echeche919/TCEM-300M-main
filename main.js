const { app, BrowserWindow, ipcMain } = require('electron');

const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 2000,
    frame: true,
    icon: path.join(__dirname, 'logo.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // Dejar asi
      contextIsolation: false, // Dejar asi
      enableRemoteModule: true, // Dejar asi
    },
  });
  mainWindow.menuBarVisible = false;
  mainWindow.loadFile('index.html')
}

function createNewWindow() {
  newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'logo.ico'),
    webPreferences: {
      nodeIntegration: true, // Be cautious with this in production apps
      contextIsolation: false // Be cautious with this in production apps
    }
  });
  newWindow.loadFile('new-window.html');
  newWindow.on('closed', () => {
    newWindow = null;
  });
}

app.on('open-new-window', () => {
  createNewWindow();
});

ipcMain.on('open-new-window', (event) => {
  createNewWindow();
});

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})