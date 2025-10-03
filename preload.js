const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('apiSerial', {
  enviarDato: (dato) => ipcRenderer.send('enviar-dato', dato),
  onSerialData: (callback) => ipcRenderer.on('serial-data', (event, data) => callback(data)),
  listPorts: () => ipcRenderer.invoke('list-ports'),
  openSerialPort: (options) => ipcRenderer.invoke('open-serial-port', options),
  onSerialClose: (callback) => ipcRenderer.on('serial-close', () => callback()),
});