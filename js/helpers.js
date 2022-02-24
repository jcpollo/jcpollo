function addNewRowToPlayArea(){
  const table = document.getElementById("play area");
  
  
  if(gWordState.round>0){
  // Remove previous row listeners
    const previousRow = table.rows[gWordState.round-1];
    for(let i=0;i<5;i++){
      let thisCell = previousRow.cells[i+1];
      let newCell = thisCell.cloneNode(true);
      thisCell.parentNode.replaceChild(newCell,thisCell);
    }  
  }
  if(gWordState.round<6){
    const row = table.insertRow();
    const playRowData = createPlayRow(gWordState["round"]+1);
    row.innerHTML= playRowData.html
    for (let id of playRowData.ids){
      let cell = document.getElementById(id);
      cell.addEventListener("click", function(){toggleColor(id);});
    }
  }    
};


function buttonConfig(code){
  //TODO contunue here
  if(code == 0){
    document.getElementById("elButton").textContent="Click to enter word";
    document.getElementById("elButton").removeAttribute("onclick");  //enterNewWord;
    document.getElementById("elButton").style.visibility = 'hidden';
  }else if(code == 1){
    document.getElementById("elButton").textContent="Click to accept clues";
    document.getElementById("elButton").onclick=readStatus;
    document.getElementById("elButton").style.visibility = 'visible';
  }else if(code == 2){
    document.getElementById("elButton").textContent="START OVER";
    document.getElementById("elButton").onclick= initPlayArea;
    document.getElementById("elButton").style.visibility = 'visible';
  }
};


function readTheWordsCSV(str) {
  let out = [];
  let wordList = str.split("\n");
  for(var w of wordList){
    w = w.replace(/\r/,"");
    out.push(w);
  }
  return out;
};


function colorKeyDict(){
  //return {"green":"darkseagreen", "yellow":"khaki", "gray":"slategray"};
  return {"darkseagreen":"green", "khaki":"yellow", "slategray":"gray"};
}


function createPlayRow(rowNumber){
  let ids=[];
  const colorKey = colorKeyDict();
  let htmlStr="<td style=\"white-space: nowrap; font-size: 200%\">Try "+rowNumber.toString()+":</td>";
  for(let i=0;i<5;i++){
    htmlStr += "<td ";
    const thisId = "gamecell_"+rowNumber.toString()+(i+1).toString(); 
    ids.push(thisId);
    htmlStr += "id=\""+thisId+"\" ";
    htmlStr += "class=\"basic\" "; 
    htmlStr+= ">"+gWordState.data[i].letter+"</td>";
  }
  return {"html": htmlStr, "ids": ids};
};


function enterNewWord(){
  let word = prompt("Please enter a 5 letter word", "");
  if(word != null){
    word = word.trim();
    if (word.length != 5){
      alert("\""+word+"\" is not a 5 letter word.");
    }else{
      word = word.toLowerCase();
      const alphaExp = /^[a-z]+$/;
      if(!word.match(alphaExp)){
        alert("\""+word+"\": only letters are allowed.");
      }else{
        const idx = gWordleHelper.allWords.findIndex((x) => x == word);
        if(idx == -1){
          alert("I'm sorry, but I don't know the word \""+word+"\".");
        }else{
          for(let i=0;i<5;i++){
            gWordState.data[i].letter = word.charAt(i);
          }
          updatePlayRow(gWordState.round+1);
          buttonConfig(1);
        }
      }
    }
  }
};


function initPlayArea(){
  gWordState = newState();
  document.getElementById("play area").innerHTML ='';
  addNewRowToPlayArea();
  buttonConfig(0);
  populateWordTable();
};


function newState(){
  out = [];
  for(let i=0;i<5;i++){
    out.push({"letter":"?", "status":null});
  };
  return {"round": 0 , "data": out};
};


function readStatus(){
  const myColorDict = colorKeyDict();
  const rowIdx = gWordState.round;
  const table = document.getElementById("play area");
  const row = table.rows[rowIdx];
  let allColorsAreIn = true;
  for(i=0;i<5;i++){
    const myCell = row.cells[i+1];
    if(myCell.style.backgroundColor in myColorDict){
      gWordState.data[i].status = myColorDict[myCell.style.backgroundColor];
    }else{
      alert("Please color in clues for all five letters.")
      allColorsAreIn = false;
      break
    }
  }
  if(allColorsAreIn){
    buttonConfig(0);
    gWordleHelper.Filter(gWordState);
    populateWordTable(gWordleHelper.wordList);
    let numberOfGreens = countGreens(gWordState);
    updateWordState();   // reset word state 
    if(gWordState.round > 5 || gWordleHelper.wordCount()<1 || numberOfGreens==5 ){
      buttonConfig(2);
      gWordleHelper.reset();
    }else{
      addNewRowToPlayArea();
    }
  }
}

function countGreens(state){
  let count = 0;
  for(let el of state.data){
    if(el.status == 'green'){
      count++;
    }
  }
  return count;
}

function populateWordTable(){
  const wordList = gWordleHelper.wordList;
  /*
  for(const row of wordList){
    const myRow = table.insertRow();
    const myCell = myRow.insertCell(0);
    myCell.innerHTML = row;
  }
  */
  const table = document.getElementById("word table");
  table.innerHTML = "";
  const myRow = table.insertRow();
  const myCell = myRow.insertCell(0);
  myCell.innerHTML = wordList.join(" ");

  document.getElementById("random word").innerHTML = gWordleHelper.RandomWord();

};


function toggleColor(id){
  let cell = document.getElementById(id);
  if(cell.innerText!="?"){
    const myTransitionMap = {"-1": 0, "0": 1, "1": 2, "2": 0};
    const colorList = Object.keys(colorKeyDict());
    let idx = colorList.findIndex((x)=> x == cell.style.backgroundColor);
    const newColor = colorList[myTransitionMap[idx.toString()]];
    cell.style.backgroundColor = newColor;
  }else{
    enterNewWord();
  }
};


function updateWordState(){
  gWordState.round++;
  for(let i=0;i<5;i++){
    gWordState.data[i].letter = "?";
    gWordState.data[i].status = null;
  };
};


function updatePlayRow(rowNumber){
  const table = document.getElementById("play area")
  const rowIdx=rowNumber-1;
  const row = table.rows[rowIdx];
  for(let i=0;i<5;i++){
    const thisCell = row.cells[i+1];
    thisCell.innerText = gWordState.data[i].letter;
    thisCell.style.color = "black";
  }
}
