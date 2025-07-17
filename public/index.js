var gridcells = document.getElementsByClassName("gridcell");
var statusheading = document.getElementById("statusheading");
var maingridcontainer = document.getElementById("maingridcontainer");
var gameover = true;
var currenthead = maingridcontainer.getElementsByClassName("headcell");
var startbutton = document.getElementById("startbutton");
var scoreboard = document.getElementById("scoreboard");
var scorenumber = document.getElementById("scorenumber");
var nooffoodcollected = 0;
var snakebodyarr = [];
var directionhistarr = [];


// Alternate logic
var snake = [];


scorenumber.innerHTML = nooffoodcollected;

var noofrows = gridcells.length/5;
var noofcols = gridcells.length/5;

console.log("noofrows is: ", noofrows);

var cellsarr = [...gridcells];

// assign an id to the cells which correspond to the index numbers of the cells in [...gridcells]
cellsarr.forEach((cell, index) => {
    cell.id = index;
})

function startbtnon(){
    startbutton.style.display = 'block';
    scoreboard.style.display = 'none';
}

function startbtnoff(){
    startbutton.style.display = 'none';
    scoreboard.style.display = 'block';
}



function startgame(){
    gameover = false;
    statusheading.innerHTML = `Use <i class="bi bi-arrow-left-square"></i> <i class="bi bi-arrow-up-square"></i> <i class="bi bi-arrow-down-square"></i> and <i class="bi bi-arrow-right-square"></i> to play`;
    resetboard()
    startbtnoff();
    generatesnake();
    generatefood();

}

function resetboard(){
    cellsarr.forEach((cell) =>{
        cell.classList.remove("headcell");
        cell.classList.remove("bodycell");
        cell.classList.remove("foodcell");
    });
    nooffoodcollected = 0;
    snakebodyarr = [];
    directionhistarr = [];
};

startbutton.addEventListener("click", (e) =>{
    if(gameover){
        gameover = false;
        startgame();
    }
})

function bodyarrlogic(newheadcellindex){
    var nextcellindex = newheadcellindex;
    cellsarr.forEach((cell, index) => {
    cell.classList.remove("bodycell");
    });
    for (let i=1; i<=nooffoodcollected; i++){
        // starting from the last item in the directionhistarr
        let processingdir = directionhistarr[(directionhistarr.length) -i];


        switch(processingdir){
            case "r":
                cellsarr[nextcellindex-1].classList.add("bodycell");
                nextcellindex=nextcellindex-1;
                break;
            case "l":
                cellsarr[nextcellindex+1].classList.add("bodycell");
                nextcellindex=nextcellindex+1;
                break;
             case "u":
                cellsarr[nextcellindex+noofcols].classList.add("bodycell");
                nextcellindex=nextcellindex+noofcols;
                break;
             case "d":
                cellsarr[nextcellindex-noofcols].classList.add("bodycell");
                nextcellindex=nextcellindex-noofcols;
                break;
        };
    };
};

function keypresslogic(e) {
    console.log("keyboard key pressed was: ", e.key);
    
    console.log("currentheadcell recorded before is: ", [...currenthead][0]);

    if(!gameover){
        // The headcell needs to check for wall and for food

        function insidegridlogic(newheadcellindex){

            if(!(cellsarr[newheadcellindex].classList.contains("bodycell"))){
                [...currenthead][0].classList.remove("headcell");
                    cellsarr[newheadcellindex].classList.add("headcell");
                    console.log("currentheadcell after reassignment is: ", [...currenthead][0]);
                    bodyarrlogic(newheadcellindex);
                    

                    if([...currenthead][0].classList.contains("foodcell")){
                        nooffoodcollected++;
                        scorenumber.innerHTML = nooffoodcollected;

                        generatefood();
                        // snakebodyarr.push([...currenthead][0]);
                        console.log("direction hist arr is: ", directionhistarr);
                        console.log("nooffood collected is now: ", nooffoodcollected);
                    }
                } else {
                    wallhitlogic();
                    console.log("gameover was triggered by snake body hit");
                }
        };

        function wallhitlogic(){
            gameover = true;
            statusheading.innerHTML = "Game Over! Press start to play again.";
            startbtnon();
            console.log("currentheadcell after gameover is: ", [...currenthead][0]);

        }

        if(e.key == "ArrowRight"){
            let newheadcellindex = parseInt([...currenthead][0].id) + 1;
            directionhistarr.push("r");
            if (newheadcellindex % noofcols != 0){
                // The food and body checking logic needs to be within these constraints

                insidegridlogic(newheadcellindex);
                
            }  else {
             wallhitlogic();
            console.log("gameover was triggered by right wall");
            
            }
        }

        

        if(e.key == "ArrowLeft"){
            let newheadcellindex = parseInt([...currenthead][0].id) - 1;
            directionhistarr.push("l");
            if (((newheadcellindex % noofcols != (noofcols -1)) && !([...currenthead][0].id < noofcols)) || 
            (([...currenthead][0].id < noofcols) && !(newheadcellindex < 0))){
                insidegridlogic(newheadcellindex);
            } 

            else {
             wallhitlogic();
            console.log("gameover was triggered by left wall");
            
            }
        }

        if(e.key == "ArrowDown"){
            let newheadcellindex = parseInt([...currenthead][0].id) + noofcols;
            directionhistarr.push("d");
            if (!(newheadcellindex >= gridcells.length)){
                insidegridlogic(newheadcellindex);
            }  else {
            wallhitlogic();
            console.log("gameover was triggered by bottom wall");
            
            
            }
        }

        if(e.key == "ArrowUp"){
            let newheadcellindex = parseInt([...currenthead][0].id) - noofcols;
            directionhistarr.push("u");
            if (!(newheadcellindex < 0)){
                insidegridlogic(newheadcellindex);
            }  else {
             wallhitlogic();
            console.log("gameover was triggered by Top wall");
           
            };
        };
    };
};




function generatesnake(){
    var randomsnakecellindex = Math.floor(Math.random()*gridcells.length);
    cellsarr[randomsnakecellindex].classList.add("headcell");
};

function generatefood(){
    cellsarr.forEach((cell) =>{
        cell.classList.remove("foodcell");
    });
    var randomfoodcellindex = Math.floor(Math.random()*gridcells.length);
    while ((cellsarr[randomfoodcellindex].classList.contains("headcell")) || (cellsarr[randomfoodcellindex].classList.contains("bodycell"))){
        randomfoodcellindex = Math.floor(Math.random()*gridcells.length);
    }
    cellsarr[randomfoodcellindex].classList.add("foodcell");
};



document.addEventListener("keydown", keypresslogic);