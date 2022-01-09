import "./App.css";
import Header from "./Components/Header";
import Button from "./Components/Button";
import Grid from "./Components/Grid";
import { useEffect, useState } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pairs, setPairs] = useState([]);
  const loadedData = [];

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://crossworddb-default-rtdb.firebaseio.com/WordData.json"
      );

      if (!response.ok) {
        throw new Error("Could not fetch Data!");
      }

      const data = await response.json();

      for (const key in data) {
        loadedData.push({
          id: key,
          word: data[key].word,
          clue: data[key].clue,
        });
      }

      setPairs(loadedData);
    } catch (error) {
      setError(error.message || "Something went Wrong!");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (pairs.length > 0) {
    var words = pairs.map((eachWord) => eachWord.word);

    var clues = pairs.map((eachClue) => eachClue.clue);
  }

  return (
    <>
      <Header />
      <Button onFetch={fetchData} />
      <Grid
        pairs={pairs}
        words={words}
        clues={clues}
        loading={isLoading}
        error={error}
        onFetch={fetchData}
      />
    </>
  );
}

export default App;