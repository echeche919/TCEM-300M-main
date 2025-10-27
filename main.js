const { app, BrowserWindow, ipcMain } = require('electron');
const { SerialPort } = require('serialport');
const mysql = require('mysql');

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
// Conectar: create or reuse a global MySQL connection. Exposed as an invoke so renderer can await it.
ipcMain.handle('conectar', async () => {
  if (global.connection && global.connection.state !== 'disconnected') {
    console.log('MySQL already connected');
    return true;
  }

  // create a connection and wait until it's connected (or fails)
  global.connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'sys',
    user: 'root',
    password: '131412',
  });

  return new Promise((resolve) => {
    global.connection.connect(function(err) {
      if (err) {
        console.error('error connecting: ' + err.stack);
        global.connection = null;
        resolve(false);
        return;
      }
      console.log('connected as id ' + global.connection.threadId);
      resolve(true);
    });
  });
});

// datoBase: insert a full row. Expect renderer to call conectar() first.
ipcMain.on('datoBase', (event, data) => {
  const connection = global.connection;
  if (!connection) {
    console.warn('datoBase called but no DB connection');
    return;
  }

  const { Sensor, Prueba, AceleracionX, AceleracionY, AceleracionZ, GiroscopioX, GiroscopioY, GiroscopioZ } = data;
  const query = 'INSERT INTO users (Sensor, Prueba, AceleracionX, AceleracionY, AceleracionZ, GiroscopioX, GiroscopioY, GiroscopioZ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [Sensor, Prueba, AceleracionX, AceleracionY, AceleracionZ, GiroscopioX, GiroscopioY, GiroscopioZ], (err, result) => {
    if (err) {
      console.error('Error al insertar:', err);
      return;
    }
  });
});

ipcMain.handle('askBase', async (event) => {
  return new Promise((resolve, reject) => {
    if (!connection) return resolve(0);
    const query = 'SELECT MAX(Prueba) AS maxPrueba FROM users';
    connection.query(query, (err, results) => {
      if (err) return reject(err);
      const max = results && results[0] && results[0].maxPrueba != null ? results[0].maxPrueba : 0;
      console.log("ACA ESTA MAX:", max);
      resolve(max);
    });
  });
});


ipcMain.on('enviar-dato', (event, data) => {
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
  return { isOpen: port.isOpen };
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
