/*** Function that will allocate randonly the icons into the cards***/
function allocateImages (icons){

	//list of elementes where the icon will be allocate
	const lis = $(".cards").find("i");

	lis.each(function() {
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

//vector with the cards icons
let icons = ["fa-ambulance", "fa-bus-alt", "fa-wheelchair", "fa-frog", "fa-chess-knight", "fa-laptop-code", "fa-smile-wink", "fa-coffee", "fa-ambulance", "fa-bus-alt", "fa-wheelchair", "fa-frog", "fa-chess-knight", "fa-laptop-code", "fa-smile-wink", "fa-coffee"];

allocateImages(icons);