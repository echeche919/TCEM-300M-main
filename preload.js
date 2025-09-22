const { contextBridge, ipcRenderer } = require('electron/renderer');
const { SerialPort } = require("serialport");
const mysql = require('mysql2'); 

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  serialList: () => ipcRenderer.invoke('serial-list', options),
  openSerialPort: (options) => ipcRenderer.invoke('serial-open', options),
  onSerialData: (callback) => ipcRenderer.on('serial-data', (event, data) => callback(data)),
  SerialPorts: ({path, baudRate}) => ipcRenderer.invoke('serial-port', {path, baudRate})
});