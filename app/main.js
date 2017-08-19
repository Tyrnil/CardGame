const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

let win, cardManager

function createWindow () {
	win = new BrowserWindow({width: 800, height: 600})

	win.setMenu(null)

	win.maximize()

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	win.webContents.openDevTools()

	win.on('closed', () => {
		win = null
	})
}

function createCardManagerWindow () {
	if (cardManager == null) {
		cardManager = new BrowserWindow({width: 800, height: 600, frame: false, minWidth: 800, minHeight: 600})

		cardManager.loadURL(url.format({
			pathname: path.join(__dirname, './cardManager.html'),
			protocol: 'file:',
			slashes: true
		}))

		cardManager.webContents.openDevTools()

		cardManager.on('closed', () => {
			cardManager = null
		})
	}
	else
		cardManager.focus()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow()
	}
})

ipcMain.on('openCardManager', (event, arg) => {
	createCardManagerWindow()
})
