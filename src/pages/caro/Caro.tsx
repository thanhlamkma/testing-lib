import Board from '@/pages/caro/components/Board';
import { useState } from 'react';

const Caro = () => {
  const [board, setBoard] = useState<(string | null)[][]>(
    Array(24)
      .fill(null)
      .map(() => Array(24).fill(null))
  );
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<string | null>(null);

  const directions: number[][][] = [
    [
      [0, 1],
      [0, -1]
    ], // Ngang
    [
      [1, 0],
      [-1, 0]
    ], // Dọc
    [
      [1, 1],
      [-1, -1]
    ], // Chéo phải
    [
      [1, -1],
      [-1, 1]
    ] // Chéo trái
  ];

  function checkWinner(board: (string | null)[][], row: number, col: number): boolean {
    const currentPlayer = board[row][col];
    console.log('currentPlayer', currentPlayer);
    if (!currentPlayer) return false;

    for (const direction of directions) {
      let count = 1;
      console.log('🚀 ~ checkWinner ~ count:', count);

      for (const [dx, dy] of direction) {
        let r = row + dx;
        let c = col + dy;

        while (r >= 0 && r < 24 && c >= 0 && c < 24 && board[r][c] === currentPlayer) {
          count++;
          r += dx;
          c += dy;
        }
      }

      if (count >= 5) return true;
    }

    return false;
  }

  const handleClick = (row: number, col: number): void => {
    if (board[row][col] || winner) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = isXNext ? 'X' : 'O';

    if (checkWinner(newBoard, row, col)) {
      setWinner(newBoard[row][col]);
    }

    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = (): void => {
    setBoard(
      Array(24)
        .fill(null)
        .map(() => Array(24).fill(null))
    );
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className='game'>
      <div className='status'>
        {winner ? `Người chiến thắng: ${winner}` : `Lượt tiếp theo: ${isXNext ? 'X' : 'O'}`}
      </div>
      <Board board={board} onClick={handleClick} />
      <button className='reset-btn' onClick={resetGame}>
        Chơi lại
      </button>
    </div>
  );
};

export default Caro;
