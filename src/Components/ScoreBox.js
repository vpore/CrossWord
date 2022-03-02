import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import * as React from "react";
import { useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import { useCallback, useRef } from "react";

const ScoreBox = (props) => {
  var [Score, setScore] = useState(0);
  let answerGrid = Array.from(Array(10), () => new Array(10));
  var finalGrid = props.answer;

  const canvasStyles = {
    position: "fixed",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  };

  const refAnimationInstance = useRef(null);

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  const checkAnswers = () => {
    for (let row = 0; row < 10; row++) {
      for (let column = 0; column < 10; column++) {
        if (
          typeof document.getElementById(`${row}_${column}`).value !==
          "undefined"
        ) {
          answerGrid[row][column] = document
            .getElementById(`${row}_${column}`)
            .value.toUpperCase();
        } else {
          answerGrid[row][column] = "_";
        }
      }
    }
    var points = 0;
    var totalPoints = 0;
    for (let row = 0; row < 10; row++) {
      for (let column = 0; column < 10; column++) {
        if (finalGrid[row][column] === "_") {
          continue;
        } else {
          ++totalPoints;
        }
        if (finalGrid[row][column] === answerGrid[row][column]) ++points;
      }
    }
    Score = Math.round((points / totalPoints) * 100);
    setScore(Score);
    handleClickOpen();
    fire();
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fire();
  };

  return (
    <>
      <div className="text-center">
        <Button
          type="button"
          className="mt-4"
          onClick={checkAnswers}
          variant="contained"
          color="success"
        >
          Check
        </Button>
      </div>
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Your score is {Score}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Thanks a lot for playing this crossword!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
    </>
  );
};

export default ScoreBox;