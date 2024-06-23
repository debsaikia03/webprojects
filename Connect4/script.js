const board = document.querySelector("#board");
const modalContainer = document.querySelector("#modal-container");
const modalMessage = document.querySelector("#modal-message");
const resetButton = document.querySelector("#reset");

resetButton.onclick = () => {
    location.reload();
}


const RED_TURN = 1;
const YELLOW_TURN = 2;

// 0-> empty
// 1-> red
// 2-> yellow

const pieces= [
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
]

let playerTurn = RED_TURN; //1-> red 2-> yellow
let hoverColumn = -1;
let animating = false;

for(let i = 0; i < 42; i++){
   let cell = document.createElement("div");
   cell.className = "cell";
   board.appendChild(cell);

   cell.onmouseenter = () =>{
     onMouseEnteredColumn(i % 7);
   }

   cell.onclick = () =>{
    if(!animating){
        onColumnClicked(i % 7);
    }
   }
}

function onColumnClicked(column){
   let availableRow = pieces.filter( (_,index) => index % 7 === column).lastIndexOf(0);

   if(availableRow === -1){
    //no space in the column
    return;
   }

   //drops piece

   pieces[(availableRow * 7) + column] = playerTurn;
   let cell = board.children[(availableRow * 7) + column];

   let piece = document.createElement("div");
   piece.className = "piece";
   piece.dataset.placed = true;
   piece.dataset.player = playerTurn;
   cell.appendChild(piece);

   //animate piece
   
   let unplacedPiece = document.querySelector("[data-placed='false']");
   let unplacedY = unplacedPiece.getBoundingClientRect().y;
   let placedY = piece.getBoundingClientRect().y;
   let yDiff = unplacedY - placedY;
   
   animating = true;
       removeUnplacedPiece();
   let animation = piece.animate(
    [
        { transform: `translateY(${yDiff}px)`, offset: 0},
        { transform: `translateY(0px)`, offset: 0.6},
        { transform: `translateY(${yDiff/20}px)`, offset: 0.8},   
        { transform: `translateY(0px)`, offset: 0.95},
    ],
    {
        duration: 400,
        easing: "linear",
        iterations: 1
    }
   )

   animation.addEventListener('finish', checkGameWinOrDraw);
}

function checkGameWinOrDraw() {

   animating = false;

   //check if game is draw
   if(!pieces.includes(0)){
      //game is draw
      modalContainer.style.display = "block";
      modalMessage.textContent = "Draw!";
   }

   //check if the current player has won
   if(hasPlayerWon(playerTurn, pieces)){
      //current player has won
      modalContainer.style.display = "block";
      modalMessage.textContent = `${playerTurn === RED_TURN ? "Red" : "Yellow"} WON!`;
   }

   if(playerTurn === RED_TURN){
    playerTurn = YELLOW_TURN;
   }
   else{
    playerTurn = RED_TURN;
   }

   //update hovering piece
   updateHover();
}

function hasPlayerWon(playerTurn, pieces){
    for (let index = 0; index < 42; index++) {
        //check horizontal win starting at index
        if(
            index % 7 < 4 &&
            pieces[index] === playerTurn && 
            pieces[index + 1] === playerTurn && 
            pieces[index + 2] === playerTurn && 
            pieces[index + 3] === playerTurn 
        ){
            return true;
        }

        //check vertical win starting at index
        if(
            index < 21 &&
            pieces[index] === playerTurn && 
            pieces[index + 7] === playerTurn && 
            pieces[index + 14] === playerTurn && 
            pieces[index + 21] === playerTurn 
        ){
            return true;
        }

        //check diagonal win starting at index
        if(
            index % 7 < 4 &&
            index < 18 &&
            pieces[index] === playerTurn && 
            pieces[index + 8] === playerTurn && 
            pieces[index + 16] === playerTurn && 
            pieces[index + 24] === playerTurn 
        ){
            return true;
        }


        //check diagonal win (other diagonal) starting at index
        if(
            index % 7 >= 3 &&
            index < 21 &&
            pieces[index] === playerTurn && 
            pieces[index + 6] === playerTurn && 
            pieces[index + 12] === playerTurn && 
            pieces[index + 18] === playerTurn 
        ){
            return true;
        }
    }

    return false;
}

function updateHover(){

    removeUnplacedPiece();

    //adds piece
    if(pieces[hoverColumn] === 0){
        let cell = board.children[hoverColumn];
        let piece = document.createElement("div");
        piece.className = "piece";
        piece.dataset.placed = false;
        piece.dataset.player = playerTurn;
        cell.appendChild(piece);
    }
}

function removeUnplacedPiece(){
    //removing existing unplaced piece

    let unplacedPiece = document.querySelector("[data-placed='false']");
    if(unplacedPiece){
        unplacedPiece.parentElement.removeChild(unplacedPiece);
    }
}

function onMouseEnteredColumn(column){
    hoverColumn = column;
    if(!animating){
        updateHover();
    }
}

