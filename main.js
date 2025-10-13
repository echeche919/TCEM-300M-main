const { app, BrowserWindow, ipcMain } = require('electron');
const { SerialPort } = require('serialport');
let port = null;
let mainWindow = null;
const path = require('path');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 2000,
    frame: true,
    icon: path.join(__dirname, 'logo.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // Dejar asi
      contextIsolation: true, // Dejar asi
      enableRemoteModule: true, // Dejar asi
    },
  });
  mainWindow.menuBarVisible = false;
  mainWindow.loadFile('index.html')
}
ipcMain.on('enviar-dato', (event, data) => {
  console.log(data);
  if (port && port.isOpen) {
    port.write(data, (err) => {
      if (err) {
        console.error('Error writing to port:', err.message);
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('serial-error', err.message);
        }
      }
    });
  } else {
    console.error('Port is not open. Cannot send data.');
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('serial-error', 'Port is not open. Cannot send data.');
    }
  }
});

// Handler para listar puertos serie
ipcMain.handle('list-ports', async () => {
  return await SerialPort.list();
});

// Handler para abrir un puerto serie
ipcMain.handle('open-serial-port', async (event, options) => {
  // if (port && port.isOpen) {
  //   // TODO: Creo que no es necesario la Promise
  //   await new Promise((resolve) => port.close(resolve));
  // }
  port = new SerialPort({ path: options.path, baudRate: options.baudRate });
  port.open();

  // Eventos del puerto serie
  port.on('open', () => {
    console.log('Serial port opened:', port.isOpen);
  });
  port.on('data', (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('serial-data', data.toString());
    }
  });
  port.on('error', (err) => {
    console.error('Serial port error:', err.message);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('serial-error', err.message);
    }
  });
  port.on('close', () => {
    console.log('Serial port closed');
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('serial-close');
    }
  });
  return {isOpen: port.isOpen };
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
