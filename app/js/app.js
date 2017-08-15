let game
const Player = require('./js/Player')
const Duel = require('./js/Duel')
const DuelLoading = require('./js/DuelLoading')
const MainMenu = require('./js/MainMenu')
const Boot = require('./js/Boot')

$(() => {
	game = new Phaser.Game(2560, 1440, Phaser.CANVAS, 'main', null, null, false)

	game.player1 = new Player()
	game.player2 = new Player()

	game.state.add('boot', new Boot())
	game.state.add('mainMenu', new MainMenu())
	game.state.add('duelLoading', new DuelLoading())
	game.state.add('duel', new Duel())

	game.state.start('boot')
})
