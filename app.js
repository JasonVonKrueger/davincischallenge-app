// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        title: "Da Vinci's Challenge",
        icon: path.join(__dirname, '/resources/images/favicon.ico'),
        width: 1475,
        height: 860,
        center: true,
        resizable: false,        
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
  
    // and load the index.html of the app.
    mainWindow.loadFile('index.html')
  
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
  }

  // This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
  
  app.on('window-all-closed', () => {
    app.quit()
  })
  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
