function checkInvokCard (card, player){
	if (player.cardInPlay.length )
  else if (card.nature === "monster")
    return checkInvokCardMonster(card, player);
  else if (card.nature === "magic")
    return checkInvokCardMagic(card, player);
}

function checkInvokCardMonster (card, player) {
	if (card.rank <= 2)
		return true;
	else if ((card.rank <= 5) && (cardInPlay.length >= 1))
		return true;
	else if ((card.rank <= 7) && (cardInPlay.length >= 2))
		return true;
	else if ((card.rank >= 8) && (cardInPlay.length >= 3))
		return true;
	return false;
}

function checkInvokCardMagic (card, player) {
	if (card.energy <= player.energy)
		return true;
	return false;
}

function invok (card, selectedCard) {
	if (card.nature === "monster") {
		card.state = "PLAY";
		if (card.rank <= 2)
			return 0;
		return invokBySacrifice(card, selectedCard);
	}
}

function invokBySacrifice (card, selectedCard){
	let bonus = 0;
	let malus = 0;
	let energy = 2;
	for (let i = 0; i < selectedCard.length; i++){
		if (card.type === selectedCard[i].type)
			bonus = bonus + 1;
		else if (typeCheck(card.type, selectedCard[i].type) === -1)
			malus += 1;
		energy += sacrificeCheck(selectedCard[i]);
	}
	if (bonus === selectedCard.length){
		card.attack += (card.attack * (20/100))
		card.currentHealt += (card.currentHealt * (20/100))
	}
	else if (malus > 0){
		card.attack -= (card.attack * (10 * malus/100))
		card.currentHealt -= (card.currentHealt * (10 * malus/100))
	}
	return energy;
}

function sacrificeCheck(card){
	if (card.nature === "monster"){
		if (card.rank <= 2)
			return 0
		else if (card.rank <= 5)
			return 1
		else if (card.rank <= 7)
			return 2
		else if (card.rank >= 8)
			return 3
	}
	return -1
}

function attackPhase(cardAtk, cardDef){
	if (cardDef.nature === "monster"){
		let mult = typeCheck(cardAtk.type, cardDef.type);
		let atk = cardAtk.attack;
		if (mult === 1)
			atk += (atk * (20/100));
		else if (mult === -1)
			atk += (atk * (20/100));
		cardDef.currentHealt -= atk;
	}
}

function deadCard(group){
	for (let i in group.children){
		if (group.children[i].currentHealt <= 0)
			group.children[i].state = "DEAD";
	}
}

function typeCheck (typeA, typeB){
		if (typeA === "Bouffe" && typeB === "Sport")
			return -1;
		else if (typeA === "Bouffe" && typeB === "Culture")
			return 1;
		else if (typeA === "Culture" && typeB === "Bouffe")
			return -1;
		else if (typeA === "Culture" && typeB === "Internet")
			return 1;
		else if (typeA === "Internet" && typeB === "Culture")
			return -1;
		else if (typeA === "Internet" && typeB === "Sport")
			return 1;
		else if (typeA === "Sport" && typeB === "Internet")
			return -1;
		else if (typeA === "Sport" && typeB === "Bouffe")
			return 1;
}

module.exports = {
	"checkInvokCard" : checkInvokCard,
	"invok" : invok,
	"sacrificeCheck" : sacrificeCheck,
	"attackPhase" : attackPhase,
	"deadCard" : deadCard
}
