var gridcells = document.getElementsByClassName("gridcell");
var statusheading = document.getElementById("statusheading");
var maingridcontainer = document.getElementById("maingridcontainer");
var gameover = true;
var currenthead = maingridcontainer.getElementsByClassName("headcell");
var startbutton = document.getElementById("startbutton");
var scoreboard = document.getElementById("scoreboard");
var scorenumber = document.getElementById("scorenumber");
var nooffoodcollected = 0;
var gridsizeoption = document.getElementById("gridsizeoption");
var speedoption = document.getElementById("speedoption");
var settingsconfirmbtn = document.getElementById("settingsconfirmbtn");
var docstyle = document.createElement("style");
var gameoversound = new Audio("public/gameover.mp3");
var winsound = new Audio("public/allsquares-achievement-bell-600.wav");
var noofcols; 
var boardsize;
var timed;
var speed;
var rightinterval;
var leftinterval;
var upinterval;
var downinterval;
var currentdirection;
var startX = 0;
var endX = 0;
var startY = 0;
var endY = 0;


// #region logic for touchscreens

maingridcontainer.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

var leftkeyevent = new KeyboardEvent("keydown", {
    key: "ArrowLeft"
});

var rightkeyevent = new KeyboardEvent("keydown", {
    key: "ArrowRight"
});

var upkeyevent = new KeyboardEvent("keydown", {
    key: "ArrowUp"
});

var downkeyevent = new KeyboardEvent("keydown", {
    key: "ArrowDown"
});

maingridcontainer.addEventListener("dragstart", e => e.preventDefault());

maingridcontainer.addEventListener("mousedown", (e) =>{
    startX = e.clientX;
    startY = e.clientY;
    console.log("startx and starty is: ", startX, startY);
});

maingridcontainer.addEventListener("mouseup", (e) =>{
    endX = e.clientX;
    endY = e.clientY;
    console.log("endX and endY is: ", endX, endY);
    handleGesture();

});

maingridcontainer.addEventListener("touchstart", (e) =>{
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

maingridcontainer.addEventListener("touchend", (e) =>{
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    handleGesture();
});

function handleGesture() {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    
    let regX = false;
    let regY = false;
    
    (Math.abs(deltaX) > Math.abs(deltaY) ) ? regX = true : regY = true;
    
    if (Math.abs(deltaX) > 50 && regX) {
        if (deltaX > 0) {
            console.log("right swipe was activated.");
            document.dispatchEvent(rightkeyevent);
        } else {
            console.log("left swipe was activated.");
            document.dispatchEvent(leftkeyevent);
        }
    }
    

    if (Math.abs(deltaY) > 50 && regY) {
        if (deltaY > 0) {
            console.log("swipe down was activated.");
            document.dispatchEvent(downkeyevent);
        } else {
            console.log("swipe up was activated.");
            document.dispatchEvent(upkeyevent);
        }
    }
};

// #endregion logic for touchscreens

// #region used in logic 1
// var snakebodyarr = [];
// var directionhistarr = [];
// #endregion used in logic 1

//#region used in logic 2
var snake = [];

// #endregion used in logic 2




scorenumber.innerHTML = nooffoodcollected;



var cellsarr = [];

function generategridcells(){
    for (let i=0; i<boardsize; i++){
        let newgridcell = document.createElement("div");
        newgridcell.id = i;
        newgridcell.classList.add("gridcell");
        maingridcontainer.appendChild(newgridcell);
    }
};

function startbtnon(){
    startbutton.style.display = 'block';
   
}

function startbtnoff(){
    startbutton.style.display = 'none';
    scoreboard.style.display = 'block';
}



function startgame(){
    gameover = false;
    statusheading.innerHTML = `Use <i class="bi bi-arrow-left-square"></i> <i class="bi bi-arrow-up-square"></i> <i class="bi bi-arrow-down-square"></i> and <i class="bi bi-arrow-right-square"></i> or drag to play`;
    noofcols = parseInt(gridsizeoption.value);
    boardsize = noofcols * noofcols;
    if(speedoption.value=="untimed"){
        timed=false;
    } else {
        timed=true;
        speed = speedoption.value;
    }
    
    resetboard();
    cellsarr = [...gridcells];

    docstyle.textContent = `
        @media (max-width: 600px) {
            #maingridcontainer{
                grid-template-rows: repeat(${noofcols}, ${200/noofcols}px);
                 grid-template-columns: repeat(${noofcols}, ${200/noofcols}px);
            }
        }
        @media (min-width: 601px) {
            #maingridcontainer{
                grid-template-rows: repeat(${noofcols}, ${400/noofcols}px);
                grid-template-columns: repeat(${noofcols}, ${400/noofcols}px);
            }

        }   

    `;

    document.head.appendChild(docstyle);

    // maingridcontainer.style.gridTemplate = `repeat(${noofcols}, ${500/noofcols}px) / repeat(${noofcols}, ${500/noofcols}px)`;

    startbtnoff();
    generatesnake();
    generatefood();

}

function clearallintervals(){
    clearInterval(rightinterval);
    clearInterval(leftinterval);
    clearInterval(upinterval);
    clearInterval(downinterval);
    currentdirection = null;
};

function resetboard(){

    maingridcontainer.innerHTML = '';
    
    console.log("gridsizeoption received is: ", gridsizeoption.value);
    generategridcells();
    clearallintervals();

    nooffoodcollected = 0;
    scorenumber.innerHTML = nooffoodcollected;

    // #region used in logic 1
    // snakebodyarr = [];
    // directionhistarr = [];
    // #endregion used in logic 1

    // #region used in logic 2
    snake = [];
    // #endregion used in logic 2
};

settingsconfirmbtn.addEventListener("click", (e) =>{
    if(gameover){
        gameover = false;
        startgame();
    }
});



//#region Used in logic 1
// function bodyarrlogic(newheadcellindex){
//     var nextcellindex = newheadcellindex;
//     cellsarr.forEach((cell, index) => {
//     cell.classList.remove("bodycell");
//     });
//     for (let i=1; i<=nooffoodcollected; i++){
//         // starting from the last item in the directionhistarr
//         let processingdir = directionhistarr[(directionhistarr.length) -i];


//         switch(processingdir){
//             case "r":
//                 cellsarr[nextcellindex-1].classList.add("bodycell");
//                 nextcellindex=nextcellindex-1;
//                 break;
//             case "l":
//                 cellsarr[nextcellindex+1].classList.add("bodycell");
//                 nextcellindex=nextcellindex+1;
//                 break;
//              case "u":
//                 cellsarr[nextcellindex+noofcols].classList.add("bodycell");
//                 nextcellindex=nextcellindex+noofcols;
//                 break;
//              case "d":
//                 cellsarr[nextcellindex-noofcols].classList.add("bodycell");
//                 nextcellindex=nextcellindex-noofcols;
//                 break;
//         };
//     };
// };
// #endregion used in logic 1

//  #region used in logic 2

function snakeclassadd(){
    for (let i=0; i<snake.length; i++){
        if (i !== (snake.length -1)){
            snake[i].classList.add('bodycell');
        }
    }
};

function snakeclassremove(){
    for (cell of snake){
        cell.classList.remove("bodycell");
    }
};

//  #endregion used in logic 2

function wallhitlogic(){
    gameover = true;
    clearallintervals();
    if (snake.length == cellsarr.length){
        winsound.play();
        document.body.classList.add("gamewin");
        setTimeout(()=>{document.body.classList.remove("gamewin");}, 100);
    } else {
        gameoversound.play();
        document.body.classList.add("gameover");
        setTimeout(()=>{document.body.classList.remove("gameover");}, 100);
    }
    statusheading.innerHTML = "Game Over! Press start to play again.";
    startbtnon();
    console.log("currentheadcell after gameover is: ", [...currenthead][0]);

}

function insidegridlogic(newheadcellindex){

    if(!(cellsarr[newheadcellindex].classList.contains("bodycell"))){
        [...currenthead][0].classList.remove("headcell");
            var newhead = cellsarr[newheadcellindex];
            newhead.classList.add("headcell");
            console.log("currentheadcell after reassignment is: ", [...currenthead][0]);

            // #region used in logic 2

            // push the newhead into [snake]. Drop tail (first entry in [snake]) is 'foodcell' is not found.

            snake.push(newhead);
            snakeclassremove();
            if(!(newhead.classList.contains("foodcell"))){
                snake.splice(0,1);
                console.log("splice was run and result is: ", snake);
            };
            snakeclassadd();

            // #endregion used in logic 2
            
            // #region used in logic 1
            // bodyarrlogic(newheadcellindex);
            // #endregion used in logic 1

            if([...currenthead][0].classList.contains("foodcell")){
                nooffoodcollected++;
                scorenumber.innerHTML = nooffoodcollected;

                generatefood();
                
                console.log("nooffood collected is now: ", nooffoodcollected);
            }

            

    } else {
            wallhitlogic();
            console.log("gameover was triggered by snake body hit");
    }
};



function rightlogicfunction(){
            let newheadcellindex = parseInt([...currenthead][0].id) + 1;
            // console.log("newheadcellindex on right arrow is: ", newheadcellindex);

            // #region used in logic 1
            // directionhistarr.push("r");
            // #endregion used in logic 1
            
            if (newheadcellindex % noofcols != 0){
                // The food and body checking logic needs to be within these constraints

                console.log("newheadcellindex % noofcols returned is: ",(newheadcellindex % noofcols) );
                insidegridlogic(newheadcellindex);

                
            }  else {
            wallhitlogic();
            console.log("gameover was triggered by right wall");
            
            }
        }

function leftlogicfunction(){
                let newheadcellindex = parseInt([...currenthead][0].id) - 1;
                // #region used in logic 1
                // directionhistarr.push("l");
                // #endregion used in logic 1

                if (((newheadcellindex % noofcols != (noofcols -1)) && !([...currenthead][0].id < noofcols)) || 
                (([...currenthead][0].id < noofcols) && !(newheadcellindex < 0))){
                    insidegridlogic(newheadcellindex);
                } 

                else {
                wallhitlogic();
                console.log("gameover was triggered by left wall");
                
                }
            }

function downlogicfunction(){
                let newheadcellindex = parseInt([...currenthead][0].id) + noofcols;
                // #region used in logic 1
                // directionhistarr.push("d");
                // #endregion used in logic 1
                if (!(newheadcellindex >= gridcells.length)){
                    insidegridlogic(newheadcellindex);
                }  else {
                wallhitlogic();
                console.log("gameover was triggered by bottom wall");
                
                
                }
            }

function uplogicfunction(){
                let newheadcellindex = parseInt([...currenthead][0].id) - noofcols;
                // #region used in logic 1
                // directionhistarr.push("u");
                // #endregion used in logic 1
                if (!(newheadcellindex < 0)){
                    insidegridlogic(newheadcellindex);
                }  else {
                wallhitlogic();
                console.log("gameover was triggered by Top wall");
            
                };
            }


function keypresslogic(e) {
    console.log("keyboard key pressed was: ", e.key);
    
    console.log("currentheadcell recorded before is: ", [...currenthead][0]);

    if(!gameover){
        // The headcell needs to check for wall and for food

        e.preventDefault(), { passive: false };
        if(e.key == "ArrowRight" && currentdirection != "left"){
            // If timed=true, all the below needs to be repeated using a setInterval()

            

            if (timed==true){
                clearallintervals();
                currentdirection = "right";
                rightinterval = setInterval(rightlogicfunction, (speed));
                
            } else {rightlogicfunction()};
        }

        

        if(e.key == "ArrowLeft" && currentdirection != "right"){
            

            if (timed==true){
                clearallintervals();
                currentdirection = "left";
                leftinterval = setInterval(leftlogicfunction, (speed));
                
            } else {leftlogicfunction()};
        }

        if(e.key == "ArrowDown" && currentdirection != "up"){

            

            if (timed==true){
                clearallintervals();
                currentdirection = "down";
                downinterval = setInterval(downlogicfunction, (speed));
                
            } else {downlogicfunction()};
        }

        if(e.key == "ArrowUp" && currentdirection != "down"){
            
            if (timed==true){
                clearallintervals();
                currentdirection = "up";
                upinterval = setInterval(uplogicfunction, (speed));
                
            } else {uplogicfunction()};
        }
    };
};




function generatesnake(){
    var randomsnakecellindex = Math.floor(Math.random()*gridcells.length);
    console.log("cellsarr passed onto generatesnake is: ", cellsarr);
    var startinghead = cellsarr[randomsnakecellindex];
    startinghead.classList.add("headcell");

    // #region used in logic 2

    snake.push(startinghead);
    // #endregion used in logic 2
};

function generatefood(){
    cellsarr.forEach((cell) =>{
        cell.classList.remove("foodcell");
    });

    let emptycells = cellsarr.filter(cell =>{
        return !cell.classList.contains("headcell") && !cell.classList.contains("bodycell")
    });

    if(emptycells.length === 0) return;

    var randomfoodcellindex = Math.floor(Math.random()*emptycells.length);
    emptycells[randomfoodcellindex].classList.add("foodcell");

};



document.addEventListener("keydown", keypresslogic);