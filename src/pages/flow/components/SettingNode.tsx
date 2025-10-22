import { CloseOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import classNames from 'classnames';
import { memo, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface SettingNodeProps {
  title: string;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
}

const SettingNode = ({ title, children, open, onClose }: SettingNodeProps) => {
  const settingDivRef = useRef<HTMLElement>(null);

  const [visible, setVisible] = useState<boolean>(false);
  const [phase, setPhase] = useState<string>('');

  const portalRoot = typeof document !== 'undefined' ? document.getElementById('flow-page') : null;

  const portal = useMemo(() => {
    if (!portalRoot || !visible) return null;

    return createPortal(
      <Flex
        ref={settingDivRef}
        vertical
        className={classNames(
          'flow-page-setting fixed top-[124px] right-8 z-[1] w-[600px] h-[calc(100%-152px)] bg-[rgba(var(--bg-main)/1)] rounded-lg',
          phase
        )}
        gap={16}
      >
        <Flex
          className='px-4 py-3 border-b-[1px] border-solid border-white'
          align='center'
          justify='space-between'
          gap={16}
        >
          <h2 className='text-base font-semibold'>{title} Setting</h2>
          <CloseOutlined className='cursor-pointer' onClick={onClose} />
        </Flex>

        {children}
      </Flex>,
      portalRoot
    );
  }, [onClose, phase, portalRoot, visible, children, title]);

  useEffect(() => {
    if (open) {
      setVisible(true);
      // next tick add 'enter' so there's no exit animation on mount
      requestAnimationFrame(() => {
        setPhase('enter');
      });
    } else if (visible) {
      // trigger exit animation
      setPhase('exit');
    }
  }, [open]);

  useEffect(() => {
    function onAnimEnd() {
      // ensure it was drawer animation (optional check)
      if (phase === 'exit') {
        setVisible(false);
        setPhase('');
      }
    }
    const node = settingDivRef.current;
    if (node) {
      node.addEventListener('animationend', onAnimEnd);
      return () => node.removeEventListener('animationend', onAnimEnd);
    }
  }, [phase]);

  return portal;
};

export default memo(SettingNode);
