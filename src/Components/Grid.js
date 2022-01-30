import "../Assets/Grid.css";
import CheckBtn from "./CheckBtn";

const Grid = (props) => {

  let crossword = [];
  let grid = [];
  const emptySlot = '_';
  let grids = [];
  let finalGrid = [];
  let bestGrid = [];
  let wordSet = [];
  let clueSet = [];
  let reqWords = [];
  let reqAlign = [];
  let reqClues = [];
  let reqRow = [];
  let reqColumn = [];
  let hClues = [];
  let vClues = [];
  let usedWords = [];
  let usedAlign = [];
  let usedRow = [];
  let usedColumn = [];
  let totalUsedWords = [];
  let totalUsedAlign = [];
  let totalUsedRow = [];
  let totalUsedColumn = [];
  let firstLetters = [];
  let index = [];
  let repeatingIndex = [];
  let clueColor = ["red", "aqua", "blue", "orange", "green", "magenta", "maroon", "olive", "indigo"];
  let word = {text: '', row: 0, column: 0, vertical: true};

  const getSpecWord = () => { //get word of a particular length
    let specWords = wordSet.filter((eachWord) => eachWord.length>=6);
    return specWords[Math.floor(Math.random() * specWords.length)];
  };

  const pushUsedData = (data) => { //add the used words into usedWords array
    usedWords.push(data.text);
    usedAlign.push(data.vertical);
    usedRow.push(data.row);
    usedColumn.push(data.column);
    data.text.split("").filter((eachLetter) => firstLetters.push(eachLetter));
  };

  const isValidPos = (row, column) => { //checks if the row/column is b/w 0 n 9
    return row >= 0 && row < 10 && column >= 0 && column < 10;
  };

  const fitsOnGrid = () => { //checks if the length of a word doesnt exceed the last row/column
    if(word.vertical){
      return word.row + word.text.length <= 10;
    }
    else{
      return word.column + word.text.length <= 10;
    }
  };

  const isLetter = (row, column) => { //checks if the slot is filled
    return grid[row][column] !== emptySlot;
  };

  const isSpecLetter = (row, column, index) => { //checks if the slot of a particular grid is filled
    let grid = grids[index];
    return grid[row][column] !== emptySlot;
  };

  const isEmptySlot = (row, column) => { //checks if the slot is empty
    return !isLetter(row, column);
  };

  const isGettingBlocked = (row, column, nextRow, nextColumn) => { //checks if a slot is filled
    return (
      isValidPos(row, column) &&
      isValidPos(nextRow, nextColumn) &&
      isLetter(row, column) &&
      isLetter(nextRow, nextColumn)
    );
  };

  const isSlotFilled = (row, column) => { //checks if a slot is filled
    return isValidPos(row, column) && isLetter(row, column);
  };

  const lastWord = (row, column) => { //to check if a letter is last letter of a particular word
    if(word.vertical){
      return word.row + word.text.length - 1 === row;
    }
    else{
      return word.column + word.text.length -1 === column;
    }
  };

  const isReplacingSlot = (row, column) => { //
    let replacing = false;
    let empty = isEmptySlot(row, column);
    let isAdjacentSlotFilled;
    if(word.vertical){
      isAdjacentSlotFilled =
        isSlotFilled(row, column - 1) ||
        isSlotFilled(row, column + 1) ||
        (lastWord(row, column) && isSlotFilled(row + 1, column));
      
        replacing = empty && isAdjacentSlotFilled;
    }
    else{
      isAdjacentSlotFilled =
        isSlotFilled(row - 1, column) ||
        isSlotFilled(row + 1, column) ||
        (lastWord(row, column) && isSlotFilled(row, column + 1));

      replacing = empty && isAdjacentSlotFilled;
    }

    return replacing;
  };

  const isReplacingHorizontalWord = (row, column) => {
    let columnLeft = column-1;
    return isValidPos(row, columnLeft) && isLetter(row, column) && isLetter(row, columnLeft);
  };

  const isReplacingVerticalWord = (row, column) => {
    let rowAbove = row-1;
    return isValidPos(rowAbove, column) && isLetter(row, column) && isLetter(rowAbove, column);
  };

  const isAptPlacement = (row, column) => { //checks if the word can be placed w/o getting blocked
    let apt = false;
    if(word.vertical){
      apt =
        isGettingBlocked(row, column + 1, row + 1, column) ||
        isGettingBlocked(row, column - 1, row + 1, column) ||
        isReplacingVerticalWord(row, column) ||
        isReplacingSlot(row, column);
    }
    else{
      apt =
        isGettingBlocked(row + 1, column, row, column + 1) ||
        isGettingBlocked(row - 1, column, row, column + 1) ||
        isReplacingHorizontalWord(row, column) ||
        isReplacingSlot(row, column);
    }
    return !apt;
  };

  const canBePlaced = () => { //determines if a word can be placed or not
    let placed = true;
    if(isValidPos(word.row, word.column) && fitsOnGrid()){
      let index = 0;
      while(index < word.text.length){
        let currentRow = word.vertical ? word.row+index : word.row;
        let currentColumn = word.vertical ? word.column : word.column+index;

        if(
          (word.text.charAt(index) === grid[currentRow][currentColumn]) ||
          (emptySlot === grid[currentRow][currentColumn] &&
          isAptPlacement(currentRow, currentColumn))
        ){
          //Word can be placed
        }
        else{
          placed = false;
        }
        index++;
      }
    }
    else{
      placed = false;
    }
    return placed;
  };

  const addWord = () => { //adds every letter of a selected word into grid[][] array
    for(let index = 0; index < word.text.length; index++){
      let row = word.row;
      let column = word.column;
      if(word.vertical){
        row += index;
      }
      else{
        column += index;
      }
      grid[row][column] = word.text.substring(index, index+1);
    }
  };

  const updateGrid = () => { //updates the grid array if a word is eligible
    let update = false;
    if(canBePlaced()){
      addWord();
      update = true;
    }
    return update;
  };

  const attemptToPlaceWord = () => { //checks if a random word can be placed on the grid
    let text = getWord();
    for(let row = 0; row<10; row++){
      for(let column = 0; column<10; column++){
        word.text=text;
        word.row=row;
        word.column=column;
        word.vertical=Math.random()>=0.5;

        if(isLetter(row, column)){
          if(updateGrid()){
            pushUsedData(word);
            return true;
          }
        }
      }
    }
    return false;
  };

  const getIntersections = (index) => { //returns the no. of 4 letter intersections
    let intersection = 0;
    for(let row=0; row<10; row++){
      for(let column=0; column<10; column++){
        if(isSpecLetter(row, column, index)){
          if(
            isValidPos(row-1, column) &&
            isValidPos(row+1, column) &&
            isValidPos(row, column-1) &&
            isValidPos(row, column+1) &&
            isSpecLetter(row-1, column, index) &&
            isSpecLetter(row+1, column, index) &&
            isSpecLetter(row, column-1, index) &&
            isSpecLetter(row, column+1, index)
          ){
            ++intersection;
          }
        }
      }
    }
    return intersection;
  };

/* 1) how come 11 grids?? 
   2) cal intersecN and Best Grid <done>
   3) display clues acc to words in best grid - sort them into accross n down <done>
   4) create btn to check the entered values 
   5) function to check the answers
   6) display slots acc. to the words(use async await) <done>
   7) add more words
*/

  const getSubIS = (index) => { //returns the no. of 3 letter intersections
    let subIS = 0;
    for(let row=0; row<10; row++){
      for(let column =0; column<10; column++){
        if(isSpecLetter(row, column, index)){
          if(
            (
              isValidPos(row+1, column) &&
              isValidPos(row, column-1) &&
              isValidPos(row-1, column) &&
              isSpecLetter(row+1, column, index) &&
              isSpecLetter(row, column-1, index) &&
              isSpecLetter(row-1, column, index)
            ) ||
            (
              isValidPos(row, column-1) &&
              isValidPos(row-1, column) &&
              isValidPos(row, column+1) &&
              isSpecLetter(row, column-1, index) &&
              isSpecLetter(row-1, column, index) &&
              isSpecLetter(row, column+1, index)
            ) ||
            (
              isValidPos(row-1, column) &&
              isValidPos(row, column+1) &&
              isValidPos(row+1, column) &&
              isSpecLetter(row-1, column, index) &&
              isSpecLetter(row, column+1, index) &&
              isSpecLetter(row+1, column, index)
            ) ||
            (
              isValidPos(row, column-1) &&
              isValidPos(row+1, column) &&
              isValidPos(row, column+1) &&
              isSpecLetter(row, column-1, index) &&
              isSpecLetter(row+1, column, index) &&
              isSpecLetter(row, column+1, index)
            )
          ){
            ++subIS;
          }
        }
      }
    }
    return subIS;
  };

  const getBestGrid = () => { //gets the best grid out of the 10 grids generated based on no. of intersections
    bestGrid = grids[0];
    for(let grid of grids){
      let index = grids.indexOf(grid);

      if(getIntersections(grids.indexOf(bestGrid)) !== 0 || getIntersections(index) !== 0){
        if(getIntersections(index) >= getIntersections(grids.indexOf(bestGrid))){
          bestGrid = grid;
        }
      }
      else{
        if(getSubIS(index) >= getSubIS(grids.indexOf(bestGrid))){
          bestGrid = grid;
        }
      }

    }
    
    return bestGrid;
  };

  const pushUsedWordsArray = (arr) => { //pushes the array into totalUsedWords Array
    totalUsedWords.push(arr);
  };

  const pushUsedAlignArray = (arr) => { //pushes the array into totalUsedAlign array
    totalUsedAlign.push(arr);
  };

  const pushUsedRowArray = (arr) => {
    totalUsedRow.push(arr);
  };

  const pushUsedColumnArray = (arr) => {
    totalUsedColumn.push(arr);
  };

  const generateGrids = () => { //generates the grids
    grids = [];
    for(let gridIndex = 0; gridIndex<20; gridIndex++){
      grids[gridIndex] = Array.from(Array(10), () => new Array(10));
      grid = grids[gridIndex];
      for(let row=0; row<10; row++){
        for(let column=0; column<10; column++){
          grid[row][column]=emptySlot;
        }
      }
      word.text = getSpecWord();
      word.row = 0;
      word.column = 0;
      word.vertical = false;
      
      updateGrid();
      pushUsedData(word);

      let i = 0;
      for(let attempt=0; attempt<50; attempt++){
        let placed = attemptToPlaceWord();
        if(placed){
          i=0;
        }
        else{
          i++;
        }
        if(i>500){
          break;
        }
      }
      grids.push(grid);
      if(getIntersections(grids.indexOf(grid)) >= 4){
        break;
      }
      pushUsedWordsArray(usedWords);
      pushUsedAlignArray(usedAlign);
      pushUsedRowArray(usedRow);
      pushUsedColumnArray(usedColumn);
      usedWords = [];
      usedAlign = [];
      usedRow = [];
      usedColumn = [];
    }
  };

  const colorCode = (index) => {
    return <div className="clueColor" style={{backgroundColor: `${clueColor[index]}`}} key={index}></div>
  };

  const obtainClues = () => { //get clues acc. to words used in finalGrid
    let j = 1;
    let pos = grids.indexOf(finalGrid);
    reqWords = totalUsedWords[pos];
    reqAlign = totalUsedAlign[pos];
    reqRow = totalUsedRow[pos];
    reqColumn = totalUsedColumn[pos];
    
    /*console.log(reqRow);
    console.log(reqColumn);
    console.log(finalGrid[0][0])*/

    reqWords.forEach((eachReqWord) =>
      wordSet.forEach((eachWord) => {
        if (eachReqWord === eachWord) {
          index.push(wordSet.indexOf(eachWord));
        }
      })
    );

    index.forEach((eachIndex) =>
      clueSet.forEach((eachClue) => {
        if (eachIndex === clueSet.indexOf(eachClue)) {
          reqClues.push(eachClue);
        }
      })
    );

    /*for(let i=0; i<reqRow.length; i++){
      for(let k=0; k<reqRow.length; k++){
        if(`${reqRow[i]}_${reqColumn[i]}` === `${reqRow[k]}_${reqColumn[k]}`){
          console.log(`${reqRow[i]}_${reqColumn[i]}: i=${i}`);
          console.log(`${reqRow[k]}_${reqColumn[k]}: k=${k}`);
          reqRow.splice(i,1);
          reqColumn.splice(i,1);
          j = i;
        }
      }
    }*/

    for(let i=0; i<reqRow.length; i++){
      for(let k=i+1; k<reqRow.length; k++){
        if(`${reqRow[i]}_${reqColumn[i]}` === `${reqRow[k]}_${reqColumn[k]}`){
          repeatingIndex.push(i);
          repeatingIndex.push(k);
        }
      }
    }

    hClues[0]=<h5>ACROSS</h5>;
    vClues[0]=<h5>DOWN</h5>;

    for(let i=0; i<reqAlign.length; i++){
      if(reqAlign[i]){
        if(repeatingIndex[j] === i){
          vClues.push(colorCode(repeatingIndex[j-1]));
          vClues.push(reqClues[i]);
          vClues.push(<br/>);
          j=j+2;
        }
        else{
          vClues.push(colorCode(i));
          vClues.push(reqClues[i]);
          vClues.push(<br/>);
        }
      }
      else{
        if(repeatingIndex[j] === i){
          hClues.push(colorCode(repeatingIndex[j-1]));
          hClues.push(reqClues[i]);
          hClues.push(<br/>);
          j=j+2;
        }
        else{
          hClues.push(colorCode(i));
          hClues.push(reqClues[i]);
          hClues.push(<br/>);
        }
      }
    }    

  };

  //const getSpecLetter() 

  const displayCrossWord = () => { //puts textfield or white blocks as required
    let row = 0;
    let column = 0;
    crossword = [];
    for (row = 0; row < 10; row++) {
      for (column = 0; column < 10; column++) {
        if(isSpecLetter(row, column, grids.indexOf(finalGrid))){
          crossword.push(
            <input
              type="text"
              className="slot"
              maxLength={1}
              style={{ textTransform: "uppercase" }}
              id={`${row}_${column}`}
              key={`${row}_${column}`}
            ></input>
          );
        }
        else{
          crossword.push(
            <div className="block" id={`${row}_${column}`}></div>
          );
        }
      }
    }
    let j=1;
    for(let i=0; i<reqRow.length; i++){
      if(repeatingIndex[j] !== i){
        crossword[reqRow[i] * 10 + reqColumn[i]] = (
          <input
            type="text"
            className="slot"
            maxLength={1}
            style={{
              textTransform: "uppercase",
              backgroundColor: `${clueColor[i]}`,
              opacity: "80%"
            }}
            id={`${reqRow[i]}_${reqColumn[i]}`}
            key={`${reqRow[i]}_${reqColumn[i]}`}
          ></input>
        );
      }
    }
  };

  const generateCrossWord = () => { //Main Function
    generateGrids();
    finalGrid = getBestGrid();
    obtainClues();
    displayCrossWord();
  };

  const getWord = () => { //get word which is random & has its first letter which is same as atleast one letter of the letters of the usedWords
    let word = getRandomWord();

    while(!hasStartingLetter(word)){
      word = getRandomWord();
    }

    return word;
  };

  const hasStartingLetter = (word) => { //gets a word which has its first letter which is same as atleast one letter of the letters of the usedWords
    let startLetter = false;
    for(let letter of firstLetters){
      if(letter === word.charAt(0)){
        startLetter = true;
        break;
      }
    }
    return startLetter;
  };

  const getUnusedWords = () => { //returns the usedWords array 
    return wordSet.filter((eachWord) => !usedWords.includes(eachWord));
  };

  const getRandomWord = () => { //returns a random word from unusedWords array
    let unusedWords = getUnusedWords();
    return unusedWords[Math.floor(Math.random() * unusedWords.length)];
  };

  let answerGrid = Array.from(Array(10), () => new Array(10));
  const checkAnswers = () => {
    for(let row = 0; row<10; row++){
      for(let column = 0; column<10; column++){
        if(typeof document.getElementById(`${row}_${column}`).value !== 'undefined'){
          answerGrid[row][column] = document.getElementById(`${row}_${column}`).value.toUpperCase();
        }
        else{
          answerGrid[row][column] = '_';
        }
      }
    }
    var points = 0;
    for(let row = 0; row<10; row++){
      for(let column = 0; column<10; column++){
        if(finalGrid[row][column] === '_'){continue;}
        if(finalGrid[row][column] === answerGrid[row][column])
        ++points;
      }
    }
    console.log(answerGrid);
    alert(`Your score is ${points}!!`);
  };

  document.addEventListener('keydown', changeFocus);
  function changeFocus(event){
    if(event.code === 'ArrowRight'){
      alert('right');
    }
    //change input fields' focus
  }

  if (typeof props.words !== 'undefined') {
    wordSet = props.words;
    wordSet = wordSet.map(eachWord => eachWord.toUpperCase());
    clueSet = props.clues;
    generateCrossWord();
  }

  if(props.error){
    crossword = <button type="button" className="btn btn-outline-dark mt-4 tryAgnBtn" onClick={props.onFetch}>
    Try Again
  </button>
  }

  if(props.loading){
    crossword = 'Loading CrossWord...';
    hClues = 'Loading Accross...';
    vClues = 'Loading Down...';
  }

  return (
    <>
      <CheckBtn onCheck={checkAnswers}/>
      <div className="grid">{crossword}</div>
      <div className="accross">{hClues}</div>
      <div className="down">{vClues}</div>
    </>
  );
};

export default Grid;