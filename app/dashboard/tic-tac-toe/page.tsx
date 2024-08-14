'use client'

import { lusitana } from '@/app/ui/fonts'
import { useState } from 'react'

interface squareProps {
    value: string
    onSquareClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}
interface resetProps {
    resetSquares: (event: React.MouseEvent<HTMLButtonElement>) => void
}

function Square({ value, onSquareClick }: squareProps) {
    return (
        <button className="outline outline-indigo-600 mr-0.5 mb-0.5 w-12 h-12" onClick={onSquareClick}>
            {value}
        </button>
    )
}

function calculateWinner(squares: number[]) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null
}

function Board() {
    const [xIsNext, setXIsNext] = useState(true)
    const [squares, setSquare] = useState(Array(9).fill(null))
    const winner = calculateWinner(squares)

    let status

    if (winner) {
        status = 'Winner: ' + winner
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O')
    }

    function handleClick(i: number) {
        if (squares[i] || calculateWinner(squares)) {
            return
        }
        const nextSquares = squares.slice()
        if (xIsNext) {
            nextSquares[i] = 'X'
        } else {
            nextSquares[i] = 'O'
        }
        setSquare(nextSquares)
        setXIsNext(!xIsNext)
        console.log(squares)
    }

    function Restart() {
        return (
            <button
                className="px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-400 transition-colors"
                onClick={startGame}
            >
                Restart
            </button>
        )
    }

    function startGame() {
        setSquare(Array(9).fill(null))
        setXIsNext(true)
        return
    }

    return (
        <>
            <div className="mb-4">{status}</div>
            <div className="flex flex-wrap w-48 mb-4">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
            <Restart />
        </>
    )
}

export default function Page() {
    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Tic-Tac-Toe</h1>
            <Board />
        </main>
    )
}
