const fs = require ('fs')
const nav = require('./js/CardManager/navigation')
const SimplifiedCard = require('./js/CardManager/SimplifiedCard')
const file = require('./js/CardManager/file')
const appFolder = require('electron').remote.app.getAppPath()

const cardDB = '/cards/cards.json'

let cardList = []

$(document).ready (() => {

	let tmp = JSON.parse(readCards())

	for (let i in tmp)
		cardList.push(new SimplifiedCard(tmp[i].id, tmp[i].name, tmp[i].attack, tmp[i].health, tmp[i].rank, tmp[i].type, tmp[i].nature, tmp[i].img))

	file.init(cardList)
	nav.init(cardList)

	nav.buildSidebarList()
	nav.buildTabList()
})

window.onbeforeunload = () => {
}

function readCards () {
	return fs.readFileSync(appFolder + cardDB)
}

function writeCards () {
	file.writeCardDB(JSON.stringify(cardList))
}
