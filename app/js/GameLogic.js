function checkInvokCard (card, player){
  if (card.type === "monster")
    checkInvokCardMonster(card, player);
  else if (card.type === "magic")
    checkInvokCardMagic(card, player);
}

function checkInvokCardMonster (card, player) {
	
}
