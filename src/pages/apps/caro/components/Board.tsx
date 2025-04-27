import React from 'react';
import Cell from './Cell';

interface BoardProps {
  board: (string | null)[][];
  onClick: (row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, onClick }) => {
  return (
    <div className='board'>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className='board-row'>
          {row.map((cell, colIndex) => (
            <Cell key={colIndex} value={cell} onClick={() => onClick(rowIndex, colIndex)} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
