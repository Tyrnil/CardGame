const fs = require('fs')
const appFolder = require('electron').remote.app.getAppPath()
const nav = require('./navigation')

const imgFolder = appFolder + '/cards/img'
const cardDB = appFolder + '/cards/cards.json'

let list = []

function init (cardList) {
	list = cardList
}

function copyFile (source, target, callback) {
	let callbackCalled = false

	let rd = fs.createReadStream(source)
	rd.on('error', function (err) {
		done(err)
	})

	let wr = fs.createWriteStream(target)
	wr.on('error', function (err) {
		done(err)
	})
	wr.on('close', function (ex) {
		done()
	})
	rd.pipe(wr)

	function done (err) {
		if (!callbackCalled) {
			callback(err)
			callbackCalled = true
		}
	}
}

function writeCardImg (source, card) {
	card.img = '/cards/img/card_' + card.id + '.png'

	card.img = card.img.replace(/\//g, '\\')

	if (source === (appFolder + card.img))
		return

	copyFile(source, appFolder + card.img, (err) => {
		if (err)
			throw error
		console.log('copy sucessfull')
	})
}

function writeCardDB () {
	fs.writeFile(cardDB, JSON.stringify(list, null, '\t'), (err) => {
		if (err)
			throw err
		console.log('write sucessfull')
	})

	nav.buildSidebarList()

	$('#popup').hide()
	$('#footer-text').html('')
}

function save () {
	$('#footer-text').html('<span class="icon icon-hourglass icon-text"></span> Sauvegarde en cours')
	$('#popup').show()

	for (let i in list) {
		if (list[i].imgChanged) {
			writeCardImg(list[i].newImgUrl, list[i])
			list[i].imgChanged = false
		}
	}

	copyFile(cardDB, appFolder + '\\cards\\cards_old.json', writeCardDB)
}


module.exports = {
	'init': init,
	'copyFile': copyFile,
	'save': save
}
