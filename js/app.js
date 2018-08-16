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
let firstSelection;
let startTime;
let time;

document.addEventListener("DOMContentLoaded", function(event) {
    console.log(localStorage);
});

/** Function to handler the keydown events of the game**/
keyDownCardsHandler = function (event){
  //if the winner modal is display
  if($('#winner').is(":visible")){
    if(event.which == keyEnter){
      playAgain();
    }else if (event.which == keyEsc){
      $('#winner').modal("hide");
    } //if the board is display esc will reload the game
  }else if (event.which == keyEsc){
    reload();
  }else{
    const cards = $('.board').find('.flip-container');
    const index = cards.index($('.select'));
    let newCard = $('.select');;
    switch(event.which) {
      case keyEnter:
        keySelectCard();
        break;
      case keySpace:
        keySelectCard();
        break;
      case keyRight:
        //check if the select card isn't in the last column
        if(index !== 3 && index !== 7 && index !== 11 && index !== 15){
          newCard = $('.board .flip-container:eq(' + (index + 1) +')');
        }
        break;
      case keyLeft:
        //check if  the select card isn't in the first column
        if(index !== 0 && index !== 4 && index !== 8 && index !== 12){
          newCard = $('.board .flip-container:eq(' + (index - 1) + ')');
        }
        break;
      case keyDown:
        //check if  the select card isn't in the last line
        if(index !== 12 && index !== 13 && index !== 14 && index !== 15){
          newCard = $('.board .flip-container:eq(' + (index + 4) + ')');
        }
        break;
      case keyUp:
        //check if the select card isn't in the first line
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

  //all icons
  const allIcons = ['fas fa-ambulance', 'fas fa-bus-alt', 'fab fa-accessible-icon', 'fas fa-frog', 'fas fa-chess-knight', 'fas fa-laptop-code', 'fas fa-smile-wink', 'fas fa-coffee', 'fas fa-user-secret', 'fas fa-bug', 'fas fa-volume-up', 'fas fa-hand-point-up', 'fas fa-kiwi-bird', 'fas fa-cut', 'fas fa-paperclip', 'fas fa-user-graduate', 'fas fa-hand-spock', 'fas fa-music', 'fas fa-microscope', 'fas fa-swimming-pool', 'fas fa-pencil-alt', 'fas fa-bicycle', 'fas fa-shopping-cart', 'fas fa-bed', 'fas fa-globe-americas', 'fas fa-umbrella-beach', 'fas fa-space-shuttle', 'fas fa-quidditch', 'fas fa-table-tennis', 'fas fa-sun', 'far fa-save', 'fas fa-couch'];

  if(localStorage.getItem('moves') == 0 || localStorage.getItem('moves') === null){

    movesInit();

    let iconsList = [];
    let saveIcons = [];

    for(i = 0; i < 8; i++){
      const index = getRandomInt(allIcons.length);
      iconsList.push(allIcons[index]);
      iconsList.push(allIcons[index]);
      allIcons.splice(index,1);
    }

    icons.each(function() {
      //randonly select a icon from the vector of icons
      const index = getRandomInt(iconsList.length);
      $(this).removeClass();
      $(this).toggleClass(iconsList[index]);
      saveIcons.push(iconsList[index]);
      //remove the icon that was already allocated
      iconsList.splice(index,1);
    });
    localStorage.setItem('icons', saveIcons);
  }
  else{

    moves = localStorage.getItem('moves');
    $('#timer').text(localStorage.getItem('time'));
    $('.moves').text(moves);
    const restoredIcons = localStorage.getItem('icons').split(',');
    for (var i = 0; i < restoredIcons.length; i++) {
      $(icons[i]).removeClass();
      $(icons[i]).toggleClass(restoredIcons[i]);
    }
    const restoredFlip = localStorage.getItem('flipped').split(',');
    const flipContainer = $('.flip-container');

    for (var i = 0; i < restoredFlip.length; i++) {
      
      $(flipContainer[i]).removeClass();
      $(flipContainer[i]).toggleClass(restoredFlip[i]);

      if(restoredFlip[i].lastIndexOf('flip') != 0){
        $($(flipContainer[i]).find('.card-front')).toggleClass('match');
      }
    }
  }

  //initiate stars
  starsInit();

  //reload time;
  firstSelection = false;

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
    //check if the actual two flipped cards are a match
    isMatch($('.clicked'));

    //if all cards match is a victory
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
  //activates the timer after the first card is selected
  if(!firstSelection){
    firstSelection = true;
    startTime = $.now();
    if(localStorage.getItem('moves') == 0 || localStorage.getItem('moves') === null){
      time = setInterval(function() {
        const diference = Math.floor((new Date - startTime) / 1000);
        const minutes = Math.floor(diference/60);
        const seconds = diference - (minutes*60);
        const timeString = ('0' + minutes).slice(-2) +':'+('0' + seconds).slice(-2);
        localStorage.setItem('time', timeString);
        $('#timer').text(timeString);
      }, 1000);
    }else{
      const oldTime = localStorage.getItem('time').split(':');
      time = setInterval(function() {
        const diference = Math.floor((new Date - startTime) / 1000) + parseInt(oldTime[0])*60 + parseInt(oldTime[1]);
        const minutes = Math.floor(diference/60);
        const seconds = diference - (minutes*60);
        const timeString = ('0' + minutes).slice(-2) +':'+('0' + seconds).slice(-2);
        localStorage.setItem('time', timeString);
        $('#timer').text(timeString);
      }, 1000);
    }
    
  }
}

/** Function to verify if is a match**/
function isMatch(clicked){

  const firstCard = clicked[0];
  const firstIcon = $(firstCard).find('i')[0];
  const secondCard = clicked[1];
  const secondIcon = $(secondCard).find('i')[0]

  moves++;
  localStorage.setItem('moves',moves);
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

      let flipped = [];
      $('.flip-container').each(function(){
          flipped.push(this.className);
      });
      localStorage.setItem('flipped', flipped);

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

/** Funtion to open the winner modal**/
function victory(){
  clearTimeout(time);
  firstSelection=false;
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

  const stars = $('.stars').find('i');
  stars.each(function (){
    $(this).removeClass('far');
    $(this).addClass('fas');
  });
}

function movesInit (){
  moves = 0;
  localStorage.setItem('moves', moves);
  $('.moves').text(`${moves}`);
}

/** Function to count the star points **/
function starsHandler(){

  $('.moves').text(`${moves}`);
  const starsIcons = $('.stars').find('i');
  switch (moves) {
    case 14:
      $(starsIcons[2]).toggleClass('fas far');
      break;
    case 18:
      $(starsIcons[1]).toggleClass('fas far');
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
  $('#timer').text('00:00');
  localStorage.setItem('time', '00:00');
  clearTimeout(time)
  firstSelection=false;
  movesInit();

  //adjust all cards classes so they comeback to hidden
  const cards = $(".board").find(".flip-container");
  $(cards).removeClass();
  $(cards).toggleClass('flip-container unselect');
  const first = $(cards).first()[0];
  $(first).toggleClass('select unselect');
  const cardFront = $('.card-front');
  $(cardFront).removeClass();
  cardFront.addClass('card-front');
  
  $('.board').off('click', '.flip-container', clickSelectCard);
  $(document).off('keydown', keyDownCardsHandler);
  //sort the images
  allocateImages();  
}

/** add click listener to the reload icon **/
$('#reload').on('click', reload);

allocateImages();