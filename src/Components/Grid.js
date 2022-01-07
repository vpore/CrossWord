import "../Assets/Grid.css";
const Grid = (props) => {

  let grids = [];
  let wordSet = [];
  let clueSet = [];
  let reqClues = [];
  let reqWords = [];
  let usedWords = [];
  let firstLetters = [];
  let index = [];
  let word = {text: '', row: 0, column: 0, vertical: true};

  const getSpecWord = () => {
    let specWords = wordSet.filter((eachWord) => eachWord.length>=6);
    return specWords[Math.floor(Math.random() * specWords.length)];
  };

  const pushUsedWords = (text) => {
    usedWords.push(text);
    text.split("").filter((eachLetter) => firstLetters.push(eachLetter));
    console.log(firstLetters);
  };

  const generateGrids = () => {
    grids = [];
    for(let gridsMade = 0; gridsMade<1; gridsMade++){
      word.text = getSpecWord();
      word.row = 0;
      word.column = 0;
      word.vertical = false;
      
      pushUsedWords(word.text);
    }
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

  const wordsNClues = () => {
    word.text = getWord();
    word.vertical = Math.random()>=0.5;
  };

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
      if(letter === word.charAt(0)){
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

  let content = reqClues;
  
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