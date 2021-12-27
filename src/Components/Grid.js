import "../Assets/Grid.css";
const Grid = (props) => {

  var reqClues=[];

  const wordsNClues = (words, clues) => {
    var reqWords = getRandomData(words, 5);
    var index = [];

    reqWords.forEach((eachReqWord) =>
      words.forEach((eachWord) => {
        if (eachReqWord === eachWord) {
          index.push(words.indexOf(eachWord));
        }
      })
    );

    index.forEach((eachIndex) =>
      clues.forEach((eachClue) => {
        if (eachIndex === clues.indexOf(eachClue)) {
          reqClues.push(`${index.indexOf(eachIndex)+1}. ${eachClue}`);
          reqClues.push(<br/>);
        }
      })
    );

    console.log(reqWords);
    console.log(reqClues);
  };

  const getRandomData = (arr, n) => {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  };

  

  if (props.words !== undefined) {
    let totalWords = props.words;
    let totalClues = props.clues;

    wordsNClues(totalWords, totalClues);
  }

  const gridSlots = () => {
    let row = 1;
    let column = 1;
    let slots = [];
    for (row = 1; row <= 10; row++) {
      for (column = 1; column <= 10; column++) {
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
    content = <button type="button" className="btn btn-outline-dark mt-4" onClick={props.onFetch}>
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