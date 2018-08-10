//var declaration
let matchTimeOut;
let moves;
let clickCardsHandler;

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

  $('.cards').off('click', 'li', clickCardsHandler);
  /** add click listener to the cards **/
  $('.cards').on('click', 'li', clickCardsHandler);
}

/** Function to select a integer between 0 (inclusive) and max (exclusive) **/
function getRandomInt(max) {

  max = Math.floor(max);
  return Math.floor(Math.random() * max);
}

/** Function to verify if is a match**/
function isMatch(clicked){

  const firstCard = clicked[0];
  const fisrtIcon = firstCard.childNodes[0];
  const secondCard = clicked[1];
  const secondIcon = secondCard.childNodes[0];

  if (fisrtIcon.className == secondIcon.className){

    //add animation class
    $(secondCard).toggleClass('match clicked animation-match ');
    $(firstCard).toggleClass('match clicked animation-match ');

    //remove animation class
    setTimeout(function(){
      $(firstCard).toggleClass('animation-match');
      $(secondCard).toggleClass('animation-match');
    },1000);
  }else {
    //add animation class
    $(firstCard).toggleClass('animation-error');
    $(secondCard).toggleClass('animation-error');

    //remove animation class
    setTimeout(function(){
      $(fisrtIcon).toggleClass('icon-clicked icon');
      $(firstCard).toggleClass('hide clicked animation-error');
  
      $(secondIcon).toggleClass('icon-clicked icon');
      $(secondCard).toggleClass('hide clicked animation-error');
    },1000);
  }
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

/*** Function to count the star points ***/
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

  //adjust all cards classes so they comeback to hidden
  const cards = $(".cards").find("li");
  $(cards).removeClass();
  $(cards).toggleClass('card col hide unselect');
  const first = $(cards).first()[0];
  $(first).toggleClass('select unselect');

  //sort the images
  allocateImages();  
}

function playAgain(){
  $('#game').show();
  $('#win').css('display', 'none');
  $('header').show();
  reload();
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
  
      //dont allow clicks while evaluating if there is a match
      $('.cards').off('click', 'li', clickCardsHandler);
  
      moves++;
      starsHandler();
      
      isMatch(clicked);

      matchTimeOut = setTimeout(function() { 
        
        //enable cards click
        $('.cards').on('click', 'li', clickCardsHandler);

        if($('.match').length == 16){
          $('#game').hide();
          $('#win').css('display', 'flex');
          $('header').hide();
          $('.congrats-moves').text(`With ${moves} Moves and ${$('.fa-star.fas').length} Stars.`);
        }
      }, 1000);
    }
  }
}

/** add click listener to the reload **/
$('#reload').on('click', reload);

allocateImages();

/** Function to handle when a card is chosen through the keyboard **/
function keyCardsHandler(){

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
  
      //dont allow clicks while evaluating if there is a match
      $('.cards').off('click', 'li', clickCardsHandler);
  
      moves++;
      starsHandler();

      isMatch(clicked);

      matchTimeOut = setTimeout(function() { 
        
        //enable cards click
        $('.cards').on('click', 'li', clickCardsHandler);

        if($('.match').length == 16){
          $('#game').hide();
          $('#win').css('display', 'flex');
          $('header').hide();
          $('.congrats-moves').text(`With ${moves} Moves and ${$('.fa-star.fas').length} Stars.`);
        }
      }, 1000);
    }
  }
}

//key to flip a card or beginn a new game
const keyEnter = 13;
//key to reload
const keyEsc = 27;
//keys to move
const keyLeft = 37;
const keyUp = 38;
const keyRight = 39;
const keyDown = 40;

$(document).keydown(function(e){

  //if the win screen is display
  if($('#win').css("display") == 'flex'){
    if(e.which == keyEnter){
      playAgain();
    }
  }
  else { //if is the game screen
    
    const cards = $('.cards').find('li');
    const index = cards.index($('.select'));
    let newCard = $('.select'); 
  
    switch(e.which) {
      case keyEnter:
        keyCardsHandler();
        break;
      case  keyEsc:
        reload();
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
});