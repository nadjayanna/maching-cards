//key to flip a card
const keyEnter = 13;
const keySpace = 32;
//key to reload
const keyEsc = 27;
//keys to move
const keyLeft = 37;
const keyUp = 38;
const keyRight = 39;
const keyDown = 40;

let matchTimeOut;
let moves;
let clickCardsHandler;
let keyDownCardsHandler;
let animationErrorTimeOut;
let animationMatchTimeOut;

$('#win').hide();

/** Function to handler the keydown events of the game**/
keyDownCardsHandler = function (event){
  //if the win screen is display
  if($('#win').is(":visible")){
    if(event.which == keyEnter){
      playAgain();
    }
  }else if (event.which == keyEsc){ 
    reload();
  }else{
    const cards = $('.cards').find('li');
    const index = cards.index($('.select'));
    let newCard = $('.select'); 
    switch(event.which) {
      case keyEnter:
        keySelectCards();
        break;
      case keySpace:
        keySelectCards();
        break;
      case keyRight:
        if(index !== 3 && index !== 7 && index !== 11 && index !== 15){
          newCard = $('.cards li:eq(' + (index + 1) +')');
        }
        break;
      case keyLeft:
        if(index !== 0 && index !== 4 && index !== 8 && index !== 12){
          newCard = $('.cards li:eq(' + (index - 1) + ')');
        }
        break;
      case keyDown:
        if(index !== 12 && index !== 13 && index !== 14 && index !== 15){
          newCard = $('.cards li:eq(' + (index + 4) + ')');
        }
        break;
      case keyUp:
        if(index !== 0 && index !== 1 && index !== 2 && index !== 3){
          newCard = $('.cards li:eq(' + (index - 4) + ')');
        }
        break;
      default:
         newCard = $('.select'); 
    }
  
    $('.select').toggleClass('select unselect');
    $(newCard[0]).toggleClass('select unselect');
  }
}

/** Function to handler the cards click event**/
clickCardsHandler = function (event){

  $('.select').toggleClass('select unselect');
  $(this).toggleClass('select unselect'); 
  //not allow to flip the card that was alredy flipped
  if($(this).hasClass('hide')){
    event.stopPropagation();
    //select the elemente where the icon will be display
    const icon = event.target.childNodes[0];

    //make the icon show
    $(icon).toggleClass('icon-clicked icon');
    //change the card aspect
    $(this).toggleClass('hide clicked');
    const clicked = $('.clicked');  
    if(clicked.length == 2){
      isMatch(clicked);
      if($('.match').length == 16){
        matchTimeOut = setTimeout(victory, 1000);
      }
    }
  }
}

/** Function that will allocate randonly the icons into the cards**/
function allocateImages (){
  
  //list of elementes where the icon will be allocate
  const icons = $(".cards").find("i");
  //vector with the cards icons
  const iconsList = ["fa-ambulance", "fa-bus-alt", "fa-wheelchair", "fa-frog", "fa-chess-knight", "fa-laptop-code", "fa-smile-wink", "fa-coffee", "fa-ambulance", "fa-bus-alt", "fa-wheelchair", "fa-frog", "fa-chess-knight", "fa-laptop-code", "fa-smile-wink", "fa-coffee"];
  //initiate stars
  starsInit();

  icons.each(function() {
    //randonly select a icon from the vector of icons
    const index = getRandomInt(iconsList.length);
    $(this).removeClass();
    $(this).toggleClass('icon fas');
    $(this).toggleClass(iconsList[index]);
    //remove the icon that was already allocated
    iconsList.splice(index,1);
  });

  /** add listeners to the cards **/
  $('.cards').on('click', 'li', clickCardsHandler);
  $(document).on('keydown', keyDownCardsHandler);
}

/** Function to select a integer between 0 (inclusive) and max (exclusive) **/
function getRandomInt(max) {

  max = Math.floor(max);
  return Math.floor(Math.random() * max);
}

/** Function to handle when a card is chosen through the keyboard **/
function keySelectCards(){

  const selected = $('.select');
  //not allow to flip the card that was alredy flipped
  if(selected.hasClass('hide')){
    //select the elemente where the icon will be display
    const icon = selected[0].firstChild;
    //make the icon show
    $(icon).toggleClass('icon-clicked icon');
    //change the card aspect
    $(selected).toggleClass('hide clicked');

    const clicked = $('.clicked');
    if(clicked.length == 2){
      isMatch(clicked);
      if($('.match').length == 16){
        matchTimeOut = setTimeout(victory, 1000);
      }
    }
  }
}

/** Function to verify if is a match**/
function isMatch(clicked){

  const firstCard = clicked[0];
  const fisrtIcon = firstCard.childNodes[0];
  const secondCard = clicked[1];
  const secondIcon = secondCard.childNodes[0];

  $('.cards').off('click', 'li', clickCardsHandler);
  $(document).off('keydown', keyDownCardsHandler);

  moves++;
  starsHandler();
  
  if (fisrtIcon.className == secondIcon.className){  
    //add match animation class
    $(secondCard).toggleClass('match clicked animation-match ');
    $(firstCard).toggleClass('match clicked animation-match ');
    //remove match animation class
    animationErrorTimeOut = setTimeout(function(){
      $(firstCard).toggleClass('animation-match');
      $(secondCard).toggleClass('animation-match');
      $('.cards').on('click', 'li', clickCardsHandler);
      $(document).on('keydown', keyDownCardsHandler);
    },1000);
  }else {
    //add error animation class
    $(firstCard).toggleClass('animation-error');
    $(secondCard).toggleClass('animation-error');
    //remove erro animation class
    animationMatchTimeOut = setTimeout(function(){
      $(fisrtIcon).toggleClass('icon-clicked icon');
      $(firstCard).toggleClass('hide clicked animation-error');
  
      $(secondIcon).toggleClass('icon-clicked icon');
      $(secondCard).toggleClass('hide clicked animation-error');
      $('.cards').on('click', 'li', clickCardsHandler);
      $(document).on('keydown', keyDownCardsHandler);
    },1000);
  }
}

/** Funtion to open the win screen**/
function victory(){
  $('#game').fadeOut("slow");
  $('#win').fadeIn(1500);
  $('header').fadeOut("slow");
  $('.congrats-moves').text(`With ${moves} Moves and ${$('.fa-star.fas').length} Stars.`);
}

function playAgain(){
  $('#game').fadeIn(1500);
  $('#win').fadeOut("slow");
  $('header').fadeIn(1500);
  reload();
}

/** Function to initiate the stars **/
function starsInit (){

  moves = 0;
  const stars = $('.stars').find('i');
  stars.each(function (){
    $(this).removeClass('far');
    $(this).addClass('fas');
  });
  $('.moves').text(`${moves}`);
}

/** Function to count the star points **/
function starsHandler(){

  $('.moves').text(`${moves}`);
  const starsIcons = $('.stars').find('i');
  switch (moves) {
    case 12:
      $(starsIcons[2]).toggleClass('fas far');
      break;
    case 16:
      $(starsIcons[1]).toggleClass('fas far');
      break;
    case 20:
      $(starsIcons[0]).toggleClass('fas far');
      break;
  }
}

function reload(){

  //clear timeout for matching cards
  clearTimeout(matchTimeOut);
  //stop animation
  $('.animation-error').stop();
  $('.animation-match').stop();
  //clear animations timeout
  clearTimeout(animationMatchTimeOut);
  clearTimeout(animationErrorTimeOut);
  //adjust all cards classes so they comeback to hidden
  const cards = $(".cards").find("li");
  $(cards).removeClass();
  $(cards).toggleClass('card col hide unselect');
  const first = $(cards).first()[0];
  $(first).toggleClass('select unselect');
  //sort the images
  allocateImages();  
}

/** add click listener to the reload icon **/
$('#reload').on('click', reload);

allocateImages();