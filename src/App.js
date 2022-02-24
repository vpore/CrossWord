import "./App.css";
import Header from "./Components/Header";
import GenerateBtn from "./Components/GenerateBtn";
import Grid from "./Components/Grid";
import { useEffect, useState } from "react";
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pairs, setPairs] = useState([]);
  const loadedData = [];

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://crossword-03-default-rtdb.firebaseio.com/WordData.json"
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
    document.getElementById('helloImg').style.display='none';
    document.getElementById('info').style.display = 'block';
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  if (pairs.length > 0) {
    var words = pairs.map((eachWord) => eachWord.word);

    var clues = pairs.map((eachClue) => eachClue.clue);
  }

  return (
    <>
      <Header />
      <GenerateBtn onFetch={fetchData} />
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