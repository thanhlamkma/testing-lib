import useOnClickOutside from '@/core/hooks/useOnClickOutside';
import { CompressOutlined, ExpandOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import clsx from 'clsx';
import { CSSProperties, memo, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

interface MaximizePortalProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode;
}

const MaximizePortal = ({ children, ...props }: MaximizePortalProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const portalRootRef = useRef<HTMLDivElement | null>(null);
  const componentRef = useRef<HTMLDivElement | null>(null);

  // Create the portal target dynamically
  useEffect(() => {
    const portalRoot = document.createElement('div');
    portalRoot.id = 'portal-root';
    document.body.appendChild(portalRoot);
    portalRootRef.current = portalRoot;

    return () => {
      document.body.removeChild(portalRoot);
    };
  }, []);

  // Toggle maximize state
  const toggleMaximize = () => {
    setIsMaximized((prev) => !prev);
  };

  // Memoized styles for the outer container
  const containerStyle: CSSProperties = useMemo(
    () => ({
      background: '#c8cacccc',
      ...(isMaximized
        ? {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            padding: '8px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        : {
            position: 'static',
            width: '300px',
            height: '200px'
          })
    }),
    [isMaximized]
  );

  // Memoized styles for the inner content
  const contentStyle: CSSProperties = useMemo(
    () => ({
      position: 'relative',
      width: isMaximized ? 'calc(100% - 16px)' : '100%',
      height: isMaximized ? 'calc(100% - 16px)' : '100%',
      border: '1px solid #ccc',
      backgroundColor: '#f9f9f9'
    }),
    [isMaximized]
  );

  // Memoized content to avoid unnecessary re-renders
  const content = useMemo(
    () => (
      <div style={containerStyle}>
        <div
          ref={componentRef}
          className={clsx('rounded-lg shadow-md', props.className)}
          style={contentStyle}
        >
          <Flex
            className={clsx(
              'absolute top-0 left-0 w-full',
              isMaximized ? 'px-5 py-4' : 'px-3 py-2'
            )}
            align='center'
            justify='end'
          >
            <button onClick={toggleMaximize}>
              {isMaximized ? <CompressOutlined /> : <ExpandOutlined />}
            </button>
          </Flex>
          {children}
        </div>
      </div>
    ),
    [isMaximized, props.className, children, containerStyle, contentStyle]
  );

  // Close the popover when clicking outside
  useOnClickOutside(componentRef, () => {
    setIsMaximized(false);
  });

  // Render in portal if maximized, otherwise render in place
  if (isMaximized && portalRootRef.current) {
    return ReactDOM.createPortal(content, portalRootRef.current);
  }

  return content;
};

export default memo(MaximizePortal); // Memoize the component to prevent unnecessary re-renders
