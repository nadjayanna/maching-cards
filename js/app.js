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

let moves;
let clickSelectCard;
let keyDownCardsHandler;
let animationErrorTimeOut;
let animationMatchTimeOut;
let waitFlipTimeOut;
let initTimer;
let startTime;
let time;

/** Function to handler the keydown events of the game**/
keyDownCardsHandler = function (event){
  //if the win screen is display
  if($('#winner').is(":visible")){
    if(event.which == keyEnter){
      playAgain();
    }
  }else if (event.which == keyEsc){ 
    reload();
  }else{
    const cards = $('.board').find('.flip-container');
    const index = cards.index($('.select'));
    let newCard = $('.select'); 
    switch(event.which) {
      case keyEnter:
        keySelectCard();
        break;
      case keySpace:
        keySelectCard();
        break;
      case keyRight:
        if(index !== 3 && index !== 7 && index !== 11 && index !== 15){
          newCard = $('.board .flip-container:eq(' + (index + 1) +')');
        }
        break;
      case keyLeft:
        if(index !== 0 && index !== 4 && index !== 8 && index !== 12){
          newCard = $('.board .flip-container:eq(' + (index - 1) + ')');
        }
        break;
      case keyDown:
        if(index !== 12 && index !== 13 && index !== 14 && index !== 15){
          newCard = $('.board .flip-container:eq(' + (index + 4) + ')');
        }
        break;
      case keyUp:
        if(index !== 0 && index !== 1 && index !== 2 && index !== 3){
          newCard = $('.board .flip-container:eq(' + (index - 4) + ')');
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
clickSelectCard = function (event){

  timer();

  $('.select').toggleClass('select unselect');
  $(this).toggleClass('select unselect'); 

  checkSelected();
}

/** Function that will allocate randonly the icons into the cards**/
function allocateImages (){
  
  //list of elementes where the icon will be allocate
  const icons = $(".board").find("i");
  //vector with the cards icons
  const iconsList = ["fa-ambulance", "fa-bus-alt", "fa-wheelchair", "fa-frog", "fa-chess-knight", "fa-laptop-code", "fa-smile-wink", "fa-coffee", "fa-ambulance", "fa-bus-alt", "fa-wheelchair", "fa-frog", "fa-chess-knight", "fa-laptop-code", "fa-smile-wink", "fa-coffee"];
  //initiate stars
  starsInit();
  initTimer = 0;

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
  $('.board').on('click', '.flip-container', clickSelectCard);
  $(document).on('keydown', keyDownCardsHandler);
}

/** Function to select a integer between 0 (inclusive) and max (exclusive) **/
function getRandomInt(max) {
  max = Math.floor(max);
  return Math.floor(Math.random() * max);
}

function checkFlipped() {
    isMatch($('.clicked'));
    if($('.match').length == 16){
      victory();
    }
}

function checkSelected(){
//not allow to flip the card that was alredy flipped
  if($('.select').hasClass('flip') == false){
    $('.select').toggleClass('flip clicked');
    if($('.clicked').length == 2){
      $('.board').off('click', '.flip-container', clickSelectCard);
      $(document).off('keydown', keyDownCardsHandler);
      waitFlipTimeOut = setTimeout(checkFlipped,300);
    }
  }
}
/** Function to handle when a card is chosen through the keyboard **/
function keySelectCard(){
  timer();
  checkSelected();
}

function timer (){
  initTimer++;
  //if is the first move
  if(initTimer == 1){
    startTime = $.now();
    time = setInterval(function() {
      const diference = Math.floor((new Date - startTime) / 1000);
      const minutes = Math.floor(diference/60);
      const seconds = diference - (minutes*60);
      $('#timer').text(('0' + minutes).slice(-2) +':'+('0' + seconds).slice(-2));
    }, 1000);
  }
}
/** Function to verify if is a match**/
function isMatch(clicked){

  const firstCard = clicked[0];
  const firstIcon = $(firstCard).find('i')[0];
  const secondCard = clicked[1];
  const secondIcon = $(secondCard).find('i')[0]

  moves++;
  starsHandler();
  
  if (firstIcon.className == secondIcon.className){  
    //add match animation class
    $(firstCard).toggleClass('clicked animation-match ');
    $(firstCard).find('.card-front').toggleClass('match');
    $(secondCard).toggleClass('clicked animation-match ');
    $(secondCard).find('.card-front').toggleClass('match');
    //remove match animation class
    animationErrorTimeOut = setTimeout(function(){
      $(firstCard).toggleClass('animation-match');
      $(secondCard).toggleClass('animation-match');
      $('.board').on('click', '.flip-container', clickSelectCard);
      $(document).on('keydown', keyDownCardsHandler);
    },1000);
  }else {
    //add error animation class
    $(firstCard).toggleClass('clicked animation-error');
    $(secondCard).toggleClass('clicked animation-error');
    //remove erro animation class
    animationMatchTimeOut = setTimeout(function(){
      $(firstCard).toggleClass('flip animation-error');
      $(secondCard).toggleClass('flip animation-error');
      $('.board').on('click', '.flip-container', clickSelectCard);
      $(document).on('keydown', keyDownCardsHandler);
    },1000);
  }
}

/** Funtion to open the win screen**/
function victory(){
  $('#winner').modal('show');
  $('.congrats-moves').text(`With ${moves} Moves and ${$('.fa-star.fas').length} Stars.`);
  $('.congrats-time').text('Time: ' + $('#timer').text());
}

function playAgain(){
  $('#winner').modal("hide");
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

  //stop animation
  $('.animation-error').stop();
  $('.animation-match').stop();
  $('.flip-container').stop();

  //clear animations timeout
  clearTimeout(animationMatchTimeOut);
  clearTimeout(animationErrorTimeOut);
  clearTimeout(waitFlipTimeOut);
  //clear timer
  clearTimeout(time);
  $('#timer').text('00:00');
  //adjust all cards classes so they comeback to hidden
  const cards = $(".board").find(".flip-container");
  $(cards).removeClass();
  $(cards).toggleClass('flip-container unselect');
  const first = $(cards).first()[0];
  $(first).toggleClass('select unselect');
  const cardFront = $('.card-front');
  $(cardFront).removeClass();
  cardFront.addClass('card-front');
  //sort the images
  allocateImages();  
}

/** add click listener to the reload icon **/
$('#reload').on('click', reload);

allocateImages();