import clsx from 'clsx';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PopoverPortalProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  visible: boolean;
  children: ReactNode;
}

let popoverPortal = document.getElementById('popover-portal');

if (!popoverPortal) {
  const popoverPortalDiv = document.createElement('div');
  popoverPortalDiv.id = 'popover-portal';
  document.body.appendChild(popoverPortalDiv);
  popoverPortal = popoverPortalDiv;
}

const PopoverPortal = ({ visible, children, ...props }: PopoverPortalProps) => {
  return createPortal(
    <div
      {...props}
      className={clsx(
        'fixed top-0 left-0 h-full w-full',
        props.className,
        visible ? 'block' : 'hidden'
      )}
    >
      <div className='relative w-full h-full'>{children}</div>
    </div>,
    popoverPortal
  );
};

export default PopoverPortal;
