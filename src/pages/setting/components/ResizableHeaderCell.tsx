import React, { useRef } from 'react';

export interface ResizableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  width: number;
  onResize: (width: number) => void;
}

export const MIN_WIDTH_COL = 30;

const ResizableHeaderCell: React.FC<ResizableHeaderCellProps> = ({
  width,
  onResize,
  children,
  style,
  ...restProps
}) => {
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const isResizingRef = useRef(false);

  const isCollapsed = width <= MIN_WIDTH_COL;

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    startXRef.current = e.clientX;
    startWidthRef.current = width;
    isResizingRef.current = true;

    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;

    const deltaX = e.clientX - startXRef.current;
    const nextWidth = Math.max(startWidthRef.current + deltaX, MIN_WIDTH_COL);

    onResize(nextWidth);
  };

  const onMouseUp = () => {
    isResizingRef.current = false;
    document.body.style.userSelect = 'auto';

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  return (
    <th
      {...restProps}
      className={isCollapsed ? 'collapsed-column' : ''}
      style={{
        ...style,
        width,
        minWidth: width,
        maxWidth: width,
        position: 'relative',
        padding: isCollapsed ? 0 : undefined
      }}
    >
      <div className='header-content'>{children}</div>

      <div
        onMouseDown={onMouseDown}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 8,
          height: '100%',
          cursor: 'col-resize',
          zIndex: 10
        }}
      />
    </th>
  );
};

export default ResizableHeaderCell;
