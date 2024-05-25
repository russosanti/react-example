import { useState } from 'react';

const size = 3;

function Square({value, onSquareClick}) {

    return(
        <button className="square" onClick={onSquareClick}>
        {value}
        </button>
    );
}


function Board({ xIsNext, squares, onPlay }) {

    function handleClick(i) {

        if(squares[i] || calculateWinner(squares)){
            return;
        }

        const nextSquares = squares.slice();
        if(xIsNext){
            nextSquares[i] = "X";
        }else{
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if(winner){
        status = "Winner: " + winner;
    }else{
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    const sq = createBoard(squares, handleClick);

    return (
        <>
            <div className="status">{status}</div>
            {sq}
        </>
    );
}

export default function Game(){
    //Set to X if even
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((history, move) => {
        let description
        if(move > 0){
            description = 'Go to move #' + move;
        }else{
            description = 'Go to game start';
        }

        if(move === currentMove){
            return(
                <li key={move}>
                    <div>You are at move # {currentMove}</div>
                </li>
            );
        }

        return(
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
          <div className="game-board">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
          </div>
          <div className="game-info">
            <ol>{moves}</ol>
          </div>
        </div>
    );
}

function calculateWinner(squares){
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for(let i = 0; i < lines.length; i++){
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }
    return null;
}

function createBoard(squares, handleClick){
    
    let board = [];
    let sqs;
    let k;
    
    for (let i = 0; i <= size - 1; i++){
        sqs = [];
        for(let j = 0; j <= size - 1; j++){
            let s = i*3 + j;
            k = "square" + s;
            sqs.push(<Square key={s} value={squares[s]} onSquareClick={() => handleClick(s)}/>);
        }
        board.push(
            <div key={i} className="board-row">
                {sqs}
            </div>
        );
    }
    return(
        <>
        {board}
        </>
    );
}
