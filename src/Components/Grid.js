import "../Assets/Grid.css";
const Grid = (props) => {

  let grid = Array.from(Array(10), () => new Array(10));
  const emptySlot = '_';
  let grids = [];
  let wordSet = [];
  let clueSet = [];
  let reqClues = [];
  let reqWords = [];
  let usedWords = [];
  let firstLetters = [];
  let index = [];
  let word = {text: '', row: 0, column: 0, vertical: true};

  for(let row=0; row<10; row++){
    for(let column=0; column<10; column++){
      grid[row][column]=emptySlot;
    }
  }

  const getSpecWord = () => { //get word of a particular length
    let specWords = wordSet.filter((eachWord) => eachWord.length>=6);
    return specWords[Math.floor(Math.random() * specWords.length)];
  };

  const pushUsedWords = (text) => { //add the used words into usedWords array
    usedWords.push(text);
    text.split("").filter((eachLetter) => firstLetters.push(eachLetter));
    console.log(firstLetters);
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

  const isEmptySlot = (row, column) => { //checks if the slot is empty
    return !isLetter(row, column);
  };

  const isGettingBlocked = (row, column, nextRow, nextColumn) => {
    return (
      isValidPos(row, column) &&
      isValidPos(nextRow, nextColumn) &&
      isLetter(row, column) &&
      isLetter(nextRow, nextColumn)
    );
  };

  const isSlotFilled = (row, column) => {
    return isValidPos(row, column) && isLetter(row, column);
  };

  const lastWord = (row, column) => {
    if(word.vertical){
      return word.row + word.text.length - 1 === row;
    }
    else{
      return word.column + word.text.length -1 === column;
    }
  };

  const isReplacingSlot = (row, column) => {
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

  const addWord = () => {
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
    console.log(grid);
  };

  const updateGrid = () => { //updates the grid array if a word is eligible
    let update = false;
    if(canBePlaced()){
      addWord();
      update = true;
    }
    return update;
  };

  const attemptToPlaceWord = () => {
    let text = getWord();
    for(let row = 0; row<10; row++){
      for(let column = 0; column<10; column++){
        word.text=text;
        word.row=row;
        word.column=column;
        word.vertical=Math.random()>=0.5;

        if(isLetter(row, column)){
          if(updateGrid()){
            pushUsedWords(word.text);
            return true;
          }
        }
      }
    }
    return false;
  };

  const getIntersections = () => {
    let intersection = 0;
    for(let row=0; row<10; row++){
      for(let column=0; column<10; column++){
        if(isLetter(row, column)){
          if(
            isValidPos(row-1, column) &&
            isValidPos(row+1, column) &&
            isValidPos(row, column-1) &&
            isValidPos(row, column+1) &&
            isLetter(row-1, column) &&
            isLetter(row+1, column) &&
            isLetter(row, column-1) &&
            isLetter(row, column+1)
          ){
            ++intersection;
          }
        }
      }
    }
    return intersection;
  };

  const generateGrids = () => {
    grids = [];
    for(let gridsMade = 0; gridsMade<1; gridsMade++){
      word.text = getSpecWord();
      word.row = 0;
      word.column = 0;
      word.vertical = false;
      
      updateGrid();
      pushUsedWords(word.text);

      let i = 0;
      for(let attempt=0; attempt<5000; attempt++){
        let placed = attemptToPlaceWord();
        if(placed){
          i=0;
        }
        else{
          i++;
        }
        if(i>470){
          break;
        }
      }
      grids.push(grid);
      if(getIntersections() >= 4){
        break;
      }
      usedWords = [];
    }
    console.log(grids);
  };

  const obtainClues = () => {
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
          reqClues.push(`${index.indexOf(eachIndex)+1}. ${eachClue}`);
          reqClues.push(<br/>);
        }
      })
    );
  };

  const displayCrossWord = () => {

  };

  const generateCrossWord = () => {
    generateGrids();
    obtainClues();
    displayCrossWord();
  };

  // const wordsNClues = () => {
  //   word.text = getWord();
  //   word.vertical = Math.random()>=0.5;
  // };

  const getWord = () => { 
    let word = getRandomWord();

    while(!hasStartingLetter(word)){
      word = getRandomWord();
    }

    return word;
  };

  const hasStartingLetter = (word) => {
    let startLetter = false;
    for(let letter of firstLetters){
      if(letter == word.charAt(0)){
        startLetter = true;
        break;
      }
    }
    return startLetter;
  };

  const getUnusedWords = () => {
    return wordSet.filter((eachWord) => !usedWords.includes(eachWord));
  };

  const getRandomWord = () => {
    let unusedWords = getUnusedWords();
    return unusedWords[Math.floor(Math.random() * unusedWords.length)];
  };

  if (typeof props.words !== 'undefined') {
    wordSet = props.words;
    clueSet = props.clues;
    generateCrossWord();
    console.log('hiii');
    //wordsNClues();
  }

  const gridSlots = () => {
    let row = 0;
    let column = 0;
    let slots = [];
    for (row = 0; row < 10; row++) {
      for (column = 0; column < 10; column++) {
        slots.push(
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
    }

    return slots;
  };

  let content = wordSet;
  
  if(props.error){
    content = <button type="button" className="btn btn-outline-dark mt-4 tryAgnBtn" onClick={props.onFetch}>
    Try Again
  </button>
  }

  if(props.loading){
    content = 'Loading Clues...';
  }
  
  return (
    <>
      <div className="grid">{gridSlots()}</div>
      <div className="clues">{content}</div>
    </>
  );
};

export default Grid;