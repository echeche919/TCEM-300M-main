const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('apiSerial', {
  enviarDato: (dato) => ipcRenderer.send('enviar-dato', dato),
  onSerialData: (callback) => ipcRenderer.on('serial-data', (event, data) => callback(data)),
  listPorts: () => ipcRenderer.invoke('list-ports'),
  openSerialPort: (options) => ipcRenderer.invoke('open-serial-port', options),
  onSerialClosed: (callback) => ipcRenderer.on('serial-close', () => callback()),
  onSerialOpened: (callback) => ipcRenderer.on('port-opened', () => callback()),
  conectar: () => ipcRenderer.invoke('conectar'),
  datoBase: (data) => ipcRenderer.send('datoBase', data),
  askBase: (data) => ipcRenderer.invoke('askBase', data),
});
