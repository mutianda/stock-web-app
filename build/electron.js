mainWindow.loadURL(url.format({
	pathname: path.join(__dirname, '../dist/index.html'),
	protocol: 'file:',
	slashes: true
}))