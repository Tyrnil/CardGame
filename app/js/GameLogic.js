function checkInvokCard (card, player){
	if (player.cardInPlay.length )
  else if (card.type === "monster")
    return checkInvokCardMonster(card, player);
  else if (card.type === "magic")
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

function invokBySacrifice (card, selectedCard){
	bonus = 0;
	malus = 0;
	for (i = 0; i < selectedCard.length; i++){
		if (card.type === selectedCard[i].type)
			bonus = bonus + 1;
		else if (typeCheck(card.type, selectedCard[i].type) === -1)
			malus += 1;
	}
	if (bonus === selectedCard.length){
		card.attack += (card.attack * (20/100))
		card.currentHealt += (card.currentHealt * (20/100))
	}
	else if (malus > 0){
		card.attack -= (card.attack * (10 * malus/100))
		card.currentHealt -= (card.currentHealt * (10 * malus/100))
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
