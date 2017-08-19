const win = require('electron').remote.getCurrentWindow()
const {dialog} = require('electron').remote

let list = []

function init (cardList) {
	list = cardList
	$('#cardImgUrl').on('click', () => {
		dialog.showOpenDialog({filters: [{name: 'Images', extensions: ['jpg', 'png']}]}, imgSelectDialogCallback)
	})
	$('#cardName').change({attribute: 'name'}, onChangeHandler)
	$('#cardNature').change({attribute: 'nature'}, onChangeHandler)
	$('#cardAttack').change({attribute: 'attack'}, onChangeHandler)
	$('#cardHealth').change({attribute: 'health'}, onChangeHandler)
	$('#cardType').change({attribute: 'type'}, onChangeHandler)
	$('#cardRank').change({attribute: 'rank'}, onChangeHandler)
}

function buildSidebarList () {
	$('#sidebarList').html('<h5 class="nav-group-title">Cartes</h5>')
	for (i in list)
		$('#sidebarList').append($('<a></a>').attr('id', list[i].id).addClass('nav-group-item')
			.append($('<span></span>').addClass('icon icon-right-open-big')).append(list[i].name))
	$('#sidebarList > a').click(openTab)
}

function buildTabList () {
	$('#tabList').html('')

	if (tabListIsEmpty()) {
			$('#content').hide()
			return
	}

	for (i in list) {
		if (list[i].isOpen)
			$('#tabList').append($('<div></div>').attr('id', 'tab-' + list[i].id).addClass('tab-item')
				.append($('<span></span>').addClass('icon icon-cancel icon-close-tab')).append(list[i].name))
		if (list[i].isFocused)
			$('#tab-' + list[i].id).addClass('active')
	}

	$('#tabList > div').click(openTab)
	$('#tabList > div > .icon-close-tab').click(closeTab)
}

function tabListIsEmpty () {
	let test = true

	for (i in list) {
		if (list[i].isOpen)
			test = false
	}
	return test
}

function buildContentPane () {
	if (!$('#content').is('visible'))
		$('#content').show()

	for (let i in list) {
		if (list[i].isFocused && list[i].isOpen) {
			$('#cardImg').attr('src', list[i].imgChanged ? list[i].newImgUrl : '../' + list[i].img)
			$('#cardName').val(list[i].name)
			$('#cardNature').val(list[i].nature)
			$('#cardAttack').val(list[i].attack)
			$('#cardHealth').val(list[i].health)
			$('#cardType').val(list[i].type)
			$('#cardRank').val(list[i].rank)
		}
	}
}

function openTab (event) {
	let id

	if (typeof event === 'number')
		id = list[event].id
	else if (typeof event === 'string')
		id = event
	else {
		id = $(this).attr('id')
		let tmp = id.split('tab-')
		id = tmp.length > 1 ? tmp[1] : tmp[0]
	}

	let focused = getFocused()
	if ((focused >= 0) && (list[focused].id === id))
		return

	setFocused(id)

	buildContentPane()
	buildTabList()
}

function closeTab (event) {
	if (typeof event.stopPropagation === 'function')
		event.stopPropagation()
	let id

	if (typeof event === 'number')
		id = list[event].id
	else if (typeof event === 'string')
		id = event
	else {
		id = $(this).parent().attr('id')
		let tmp = id.split('tab-')
		id = tmp.length > 1 ? tmp[1] : tmp[0]
	}

	for (let i in list) {
		if (list[i].id === id) {
			list[i].isOpen = false
			list[i].isFocused = false
		}
	}

	nextToFocus()

	buildContentPane()
	buildTabList()
}

function minimizeWindow () {
	win.minimize()
}

function maximizeWindow () {
	if (win.isMaximized())
		win.unmaximize()
	else
		win.maximize()
}

function closeWindow () {
	win.close()
}

function getFocused () {
	for (let i in list) {
		if (list[i].isFocused)
			return i
	}
	return -1
}

function setFocused (id) {
	for (let i in list) {
		if (list[i].id === id) {
			list[i].isFocused = true
			list[i].isOpen = true
		}
		else if (list[i].isFocused)
			list[i].isFocused = false
	}
}

function nextToFocus () {
	for (let i in list) {
		if (list[i].isOpen) {
			list[i].isFocused = true
			return
		}
	}
}

function setAttribute (attribute, value) {
	for (let i in list) {
		if ((list[i].isOpen) && (list[i].isFocused)) {
			if (attribute === 'name')
				list[i].name = value
			else if (attribute === 'nature')
				list[i].nature = value
			else if (attribute === 'attack')
				list[i].attack = value
			else if (attribute === 'health')
				list[i].health = value
			else if (attribute === 'type')
				list[i].type = value
			else if (attribute === 'rank')
				list[i].rank = value
			return
		}
	}
}

function imgSelectDialogCallback (filePaths) {
	if ((filePaths == undefined) || (filePaths.length === 0))
		return

	$('#cardImg').attr('src', filePaths[0])

	for (let i in list) {
		if ((list[i].isFocused) && (list[i].isOpen)) {
			list[i].imgChanged = true
			list[i].newImgUrl = filePaths[0]
		}
	}
}

function onChangeHandler (event) {
	setAttribute(event.data.attribute, $(this).val())

	let id = '', name = ''
	for (let i in list) {
		if ((list[i].isOpen) && (list[i].isFocused)) {
			id = list[i].id
			name = list[i].name
		}
	}

	$('#' + id).contents().last().replaceWith(name + '*')
	$('#tab-' + id).contents().last().replaceWith(name)
}

function onNewCard () {
	let id = -1
	for (let i in list) {
		if (list[i].id >= id)
			id = (+list[i].id + 1).toString()
	}

	list.push(SimplifiedCard.defaultCard(id))

	setFocused(id)

	buildSidebarList()
	buildContentPane()
	buildTabList()
}

function onDestroyCard () {
	let card = getFocused()
	list.splice(card, 1)

	nextToFocus()

	buildSidebarList()
	buildContentPane()
	buildTabList()
}

module.exports = {
	'init': init,
	'buildSidebarList': buildSidebarList,
	'buildTabList': buildTabList,
	'minimizeWindow': minimizeWindow,
	'maximizeWindow': maximizeWindow,
	'closeWindow': closeWindow,
	'onNewCard': onNewCard,
	'onDestroyCard': onDestroyCard
}
