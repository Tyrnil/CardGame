class Boot extends Phaser.State {
	preload () {
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
		this.game.scale.pageAlignHorizontally = true
		this.game.scale.pageAlignVertically = true

		console.log('Canvas WIDTH: ',$('#main').width(), ' - HEIGHT: ', $('#main').height(), '\nGame WIDTH: ', this.game.width, ' - HEIGHT: ', this.game.height)

		this.game.load.spritesheet('button_300x150', './assets/button_300x150.png', 300, 150)
		this.game.load.spritesheet('button_300x100_green', './assets/button_300x100_green.png', 300, 100)
		this.game.load.spritesheet('button_300x100_red', './assets/button_300x100_red.png', 300, 100)
		this.game.load.spritesheet('button_400x100_dark_grey', './assets/button_400x100_dark_grey.png', 400, 100)
	}

	create () {
		this.game.state.start('mainMenu')
	}
}

module.exports = Boot
