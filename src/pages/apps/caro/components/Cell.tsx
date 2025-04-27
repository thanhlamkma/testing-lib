import React from 'react';

interface CellProps {
  value: string | null;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ value, onClick }) => {
  return (
    <div className='cell' onClick={onClick}>
      <span>{value}</span>
    </div>
  );
};

export default Cell;
