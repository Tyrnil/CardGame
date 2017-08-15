const utils = require('./utils')
const fonts = require('./fonts')
const colors = require('./colors')

class MainMenu extends Phaser.State {
	create () {
		this.game.stage.backgroundColor = '#ff9966'

		utils.createLinearGradient(this.game, '#ff9966', '#ff5e62')

		this.title = this.game.add.text(0, 0, 'TROUVE UN TITRE', fonts.pixel128px)
		this.title.setTextBounds(0, 0, this.game.width, this.game.height / 2.5)

		this.buttonGroup = this.game.add.group()
		this.buttonGroup.add(this._createButton(this.game.world.centerX - (200), this.game.world.centerY - 100, 'button_400x100_dark_grey', 'Jouer', 'play'))
		this.buttonGroup.add(this._createButton(this.game.world.centerX - (200), this.game.world.centerY + 100, 'button_400x100_dark_grey', 'Quitter', 'quit'))

		this._titleColorChange()
	}

	update () {
		for (let i in this.buttonGroup.children) {
			if ((this.buttonGroup.children[i].frame == '2') || (this.buttonGroup.children[i].frame == '0'))
				this.buttonGroup.children[i].text.addColor(colors.white, 0)
			else if (this.buttonGroup.children[i].frame == '1')
				this.buttonGroup.children[i].text.addColor(colors.dark_grey, 0)
		}
	}

	_buttonClick (button, pointer) {
		if (button.label === 'play')
			this._onPlay()
		else if (button.label === 'quit')
			this._onQuit()
	}

	_createButton (x, y, sprite, t, label) {
		let button = this.game.add.button(x, y, sprite, this._buttonClick, this, 1, 0, 2)

		let text = this.game.add.text(Math.floor(button.x + button.width / 2), Math.floor(button.y + button.height / 2), t, fonts.pixel32px)
		text.anchor.set(0.5, 0.5)

		button.text = text
		button.label = label

		return button
	}

	_onPlay () {
		this.game.state.start('duelLoading')
	}

	_onQuit () {
		require('electron').remote.getCurrentWindow().close()
	}

	_titleColorChange () {
		let r = utils.getRandomArbitrary(0, 256), g = utils.getRandomArbitrary(0, 256), b = utils.getRandomArbitrary(0, 256)

		let tween = this.game.add.tween(this.title).to({red: r, green: g, blue: b}, 800, Phaser.Easing.Linear.None, true)
		tween.onComplete.add(this._titleColorChange, this)
		tween.onUpdateCallback(this._onTitleTweenUpdate, this)
	}

	_onTitleTweenUpdate () {
		this.title.addColor('#' + utils.RGBtoHEX(this.title.red, this.title.green, this.title.blue), 0)
	}
}

module.exports = MainMenu
