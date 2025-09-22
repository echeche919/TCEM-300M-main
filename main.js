const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const mysql = require('mysql2');
const { SerialPort } = require("serialport");


function createWindow() {
  const mainWindow = new BrowserWindow({
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

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '131412',
    database: 'trommerbench'
  });
connection.connect(err => {
    if (err) {
      console.error('Error connecting to database:', err.stack);
      return;
    }
    console.log('Connected to database as id ' + connection.threadId);
  });

  ipcMain.handle('list-serial-ports', async () => {
    const ports = await SerialPort.list();
    return ports;
  });

    ipcMain.handle('serial-port', async ({path, baudRate}) => {
    return new SerialPort({path, baudRate});
  });

  // Handler para insertar datos
  ipcMain.handle('insertar-usuario', async (event, userData) => {
    return new Promise((resolve) => {
      const sql = 'INSERT INTO valores (valor, id_sensor, id_experimento) VALUES (?, ?, ?)';
      connection.query(sql, [userData.first_name, userData.last_name, userData.email], (error, results) => {
        if (error) {
          resolve({ ok: false, error: error.message });
        } else {
          resolve({ ok: true, id: results.insertId });
        }
      });
    });
  });
});


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})