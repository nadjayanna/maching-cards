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

//list of elementes where the icon will be allocate
const cards = $(".cards").find("i");

//vector with the cards icons
let icons = ["fa-ambulance", "fa-bus-alt", "fa-wheelchair", "fa-frog", "fa-chess-knight", "fa-laptop-code", "fa-smile-wink", "fa-coffee", "fa-ambulance", "fa-bus-alt", "fa-wheelchair", "fa-frog", "fa-chess-knight", "fa-laptop-code", "fa-smile-wink", "fa-coffee"];

allocateImages(icons, cards);

//add click listener to the cards
$('.cards').on( 'click', 'li', function(e) {
	//select the elemente where the icon will be display
	var icon = e.currentTarget.childNodes[0];
	//make the icon show
	$(icon).toggleClass('icon-clicked');
	$(icon).toggleClass('icon');
	//change the card aspect
	$(this).toggleClass('card');
	$(this).toggleClass('card-clicked');
});