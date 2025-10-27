/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from '@ant-design/icons';
import { Handle, Position, useOnViewportChange } from '@xyflow/react';
import { Menu } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type AddHandler = (type: string, handleId: string) => void;

interface CustomHandleProps {
  id: string;
  type: 'source' | 'target';
  position: Position;
  onAddNode: AddHandler;
}

export const CustomHandle: React.FC<CustomHandleProps> = ({ id, type, position, onAddNode }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ left: number; top: number; flip: boolean } | null>(null);

  const menuItems = [
    { key: 'action', label: 'Action Node' },
    { key: 'condition', label: 'Condition Node' },
    { key: 'data', label: 'Data Node' }
  ];

  /** 🧮 Tính vị trí menu tuyệt đối + tự flip khi gần mép phải */
  const computeMenuPos = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return null;

    const rect = el.getBoundingClientRect();
    const OFFSET_X = 8;
    const menuWidth = 180;
    const menuHeight = 140;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let left = rect.right + OFFSET_X + window.scrollX;
    let top = rect.top + rect.height / 2 + window.scrollY;
    let flip = false;

    if (left + menuWidth > viewportW) {
      left = rect.left - menuWidth - OFFSET_X + window.scrollX;
      flip = true;
    }

    if (top - menuHeight / 2 < 0) top = menuHeight / 2 + 8;
    if (top + menuHeight / 2 > viewportH) top = viewportH - menuHeight / 2 - 8;

    return { left, top, flip };
  }, []);

  const openMenu = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const pos = computeMenuPos();
      if (pos) {
        setMenuPos(pos);
        setMenuOpen(true);
      }
    },
    [computeMenuPos]
  );

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  /** 🔒 Đóng menu khi click ra ngoài */
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const menuEl = menuRef.current;
      const wrapperEl = wrapperRef.current;
      if (
        menuEl &&
        !menuEl.contains(e.target as Node) &&
        wrapperEl &&
        !wrapperEl.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen, closeMenu]);

  useOnViewportChange({
    onChange: () => {
      if (menuOpen) closeMenu();
    }
  });

  /** 🌀 Giữ đúng vị trí khi pan/zoom/scroll */
  useEffect(() => {
    if (!menuOpen) return;
    const updatePos = () => {
      const pos = computeMenuPos();
      if (pos) setMenuPos(pos);
    };
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    window.addEventListener('wheel', updatePos, { passive: true });
    return () => {
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
      window.removeEventListener('wheel', updatePos as any);
    };
  }, [menuOpen, computeMenuPos]);

  /** 🪟 Render menu qua portal để tránh ReactFlow re-render */
  const portal =
    menuOpen && menuPos
      ? createPortal(
          <div
            ref={menuRef}
            className='absolute z-[9999]'
            style={{
              left: menuPos.left,
              top: menuPos.top,
              transform: 'translateY(-50%)'
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`
                bg-white rounded-xl border shadow-lg min-w-[180px]
                origin-top-left p-1 transition-all duration-150 ease-out
                animate-[fadeIn_0.15s_ease-out]
                ${menuPos.flip ? 'origin-top-right' : 'origin-top-left'}
              `}
              style={{
                transform: menuPos.flip ? 'translateX(-10px) scale(1)' : 'translateX(10px) scale(1)'
              }}
            >
              <Menu
                selectable={false}
                onClick={({ key }) => {
                  onAddNode(key as string, id);
                  closeMenu();
                }}
                items={menuItems}
              />
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className='absolute right-0 -translate-x-1/2 -translate-y-1/2 top-1/2'>
        <div
          ref={wrapperRef}
          className='relative'
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Handle id={id} type={type} position={position} className='!bg-blue-500' />

          {/* ➕ Dấu cộng khi hover */}
          {hovered && (
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={openMenu}
              className='absolute z-20 flex items-center justify-center w-6 h-6 transition bg-white border border-solid rounded-full shadow-md text-emerald-600 -top-3 -right-3 hover:bg-blue-700'
            >
              <PlusOutlined style={{ fontSize: 12 }} />
            </button>
          )}
        </div>

        {portal}
      </div>
    </>
  );
};

/* Thêm animation Tailwind vào global.css
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
*/
