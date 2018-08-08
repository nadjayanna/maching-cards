/*** Function that will allocate randonly the icons into the cards***/
function allocateImages (icons, cards){
	cards.each(function() {
		//randonly select a icon from the vector of icons
		const index = getRandomInt(icons.length);
  	$(this).toggleClass(icons[index]);
  	//remove the icon that was already allocated
  	icons.splice(index,1);
	});
}

/*** Function to select a integer between 0 (inclusive) and max (exclusive) ***/
function getRandomInt(max) {
  max = Math.floor(max);
  return Math.floor(Math.random() * max);
}

/*** Function to verify if is a match**/
function isMatch(clicked){
	const firstCard = clicked[0];
	const fisrtIcon = firstCard.childNodes[0];
	const secondCard = clicked[1];
	const secondIcon = secondCard.childNodes[0];

	if (fisrtIcon.className == secondIcon.className){
		$(firstCard).toggleClass('match clicked');
		$(secondCard).toggleClass('match clicked');
	}
	else{
		$(fisrtIcon).toggleClass('icon-clicked icon');
		$(firstCard).toggleClass('hide clicked');

		$(secondIcon).toggleClass('icon-clicked icon');
		$(secondCard).toggleClass('hide clicked');
	}
}

var clickHandler = function (event){

	event.stopPropagation();
	//select the elemente where the icon will be display
	const icon = event.currentTarget.childNodes[0];
	//make the icon show
	$(icon).toggleClass('icon-clicked icon');
	//change the card aspect
	$(this).toggleClass('hide clicked');

	const clicked = $('.clicked');
	if(clicked.length == 2){
		$('.cards').off('click');
		setTimeout(function() { 
			isMatch(clicked);
			$('.cards').on('click', 'li', clickHandler);
		}, 1000);
	}

}
/*** list of elementes where the icon will be allocate ***/
const cards = $(".cards").find("i");

/*** vector with the cards icons ***/
const icons = ["fa-ambulance", "fa-bus-alt", "fa-wheelchair", "fa-frog", "fa-chess-knight", "fa-laptop-code", "fa-smile-wink", "fa-coffee", "fa-ambulance", "fa-bus-alt", "fa-wheelchair", "fa-frog", "fa-chess-knight", "fa-laptop-code", "fa-smile-wink", "fa-coffee"];

allocateImages(icons, cards);

/*** add click listener to the cards ***/
$('.cards').on( 'click', 'li', clickHandler);