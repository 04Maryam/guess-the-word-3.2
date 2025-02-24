import logo from "/logo.png";
import { Button, Form } from "react-bootstrap";
import "./App.css";
import { getRandomWord } from "./utils";
import { useState, useEffect } from "react";

const MAX_GUESSES = 6;

export default function App() {
  // currWord is the current secret word for this round. Update this with the updater function after each round.
  const [currWord, setCurrentWord] = useState(getRandomWord());
  // guessedLetters stores all letters a user has guessed so far
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState([]);

  const [inputLetter, setInputLetter] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [wins, setWins] = useState(0);

  useEffect(() => {
    setCurrentWord(getRandomWord().toUpperCase());
  }, []);

  const generateWordDisplay = () => {
    return currWord
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (gameOver || inputLetter.length !== 1) return;

    const letter = inputLetter.toUpperCase();
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter]);
      if (!currWord.includes(letter)) {
        setWrongGuesses([...wrongGuesses, letter]);
      }
    }
    setInputLetter("");
  };

  useEffect(() => {
    if (wrongGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
      setWin(false);
      setRoundsPlayed(roundsPlayed + 1);
    } else if (
      currWord &&
      currWord.split("").every((letter) => guessedLetters.includes(letter))
    ) {
      setGameOver(true);
      setWin(true);
      setRoundsPlayed(roundsPlayed + 1);
      setWins(wins + 1);
    }
  }, [guessedLetters, wrongGuesses, currWord]);

  const resetGame = () => {
    setCurrentWord(getRandomWord().toUpperCase());
    setGuessedLetters([]);
    setWrongGuesses([]);
    setGameOver(false);
    setWin(false);
  };

  // const getHangmanClasses = () => {
  //   const hangmanStage = wrongGuesses.length;
  //   return `hangman hangman-${hangmanStage}`;
  // };

  // const getHangmanClasses = () => {
  //   const hangmanStages = [
  //     "head",
  //     "body",
  //     "left-arm",
  //     "right-arm",
  //     "left-leg",
  //     "right-leg",
  //   ];

  //   const classes = hangmanStages
  //     .slice(0, wrongGuesses.length) // Get the number of parts based on wrong guesses
  //     .map((part) => `hangman-${part}`);

  //   return `hangman ${classes.join(" ")}`; // Combine all the classes
  // };

  return (
    <div className="game-container">
      <div className="py-3 my-2 text-center">
        <img
          src={logo}
          className="d-block mx-auto mb-4"
          alt="Rocket logo"
          width="72"
          height="72"
        />
        <h1 className="display-5 fw-semibold">Guess The Word 🚀</h1>
      </div>
      <div className="container py-md-5">
        <div className="d-md-flex justify-content-md-end">
          <h5>
            Score{" "}
            <span className="fw-normal fs-6">
              {/* Wins: {wins} / Rounds: {roundsPlayed} */}
              {wins} / {roundsPlayed}
            </span>
          </h5>
        </div>
        <div className="row flex-lg-row-reverse align-items-center g-md-5 py-md-5 vw-100">
          <div className="col-10 col-sm-8 col-lg-6 hangman-container">
            {/* Hangman figure drawn with CSS */}
            <div className="hangman">
              <div className="pole-crossbar">
                <div className="rope"></div>
                {/* <div className="head"></div> */}
                {wrongGuesses.length >= 1 && <div className="head"></div>}
                {wrongGuesses.length >= 2 && <div className="body"></div>}
                {wrongGuesses.length >= 3 && <div className="left-arm"></div>}
                {wrongGuesses.length >= 4 && <div className="right-arm"></div>}
                {wrongGuesses.length >= 5 && <div className="left-leg"></div>}
                {wrongGuesses.length >= 6 && <div className="right-leg"></div>}
              </div>
            </div>
          </div>
          <div className="col-10 col-sm-8 col-lg-6">
            <h3 className="mb-3">Word Display</h3>
            <p className="word-display">{generateWordDisplay()}</p>

            <h3>Guessed Letters</h3>
            <p>
              {guessedLetters.length > 0
                ? guessedLetters.map((letter) => (
                    <span
                      key={letter}
                      className={`fw-bold ${
                        wrongGuesses.includes(letter)
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >
                      {letter}{" "}
                    </span>
                  ))
                : "-"}
            </p>

            {!gameOver ? (
              <>
                <Form onSubmit={handleGuess} className="mt-3">
                  <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                    <Form.Group className="mb-3" controlId="LetterGuessed">
                      <Form.Label>Guess a letter:</Form.Label>
                      <Form.Control
                        type="text"
                        maxLength="1"
                        value={inputLetter}
                        onChange={(e) =>
                          setInputLetter(e.target.value.toUpperCase())
                        }
                        required
                        // className="text-center"
                        placeholder="Enter a letter"
                      />
                      <Form.Text className="text-muted">
                        Enter a letter to guess the word. Be careful, wrong
                        guesses reduce your chances!
                      </Form.Text>
                    </Form.Group>
                    <div className="d-md-flex justify-content-md-center align-items-md-center button-container">
                      <Button
                        variant="primary"
                        type="submit"
                        className="btn button"
                      >
                        Guess
                      </Button>
                    </div>
                  </div>
                </Form>
                <p className="fw-bold fs-6">
                  Remaining Guesses:{" "}
                  <span className="fw-normal">
                    {MAX_GUESSES - wrongGuesses.length}
                  </span>
                </p>
              </>
            ) : (
              <div className="mt-5">
                <h2>
                  {win ? "You Win! 🎉" : `You Lose! The word was: ${currWord}`}
                </h2>
                <Button variant="success" onClick={resetGame} className="mt-2">
                  Play Again
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
