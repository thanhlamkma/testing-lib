import { CommentOutlined, VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const AISidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navItems = [
    { label: 'General Chat', path: '/' },
    { label: 'Room 1', path: '/room1' },
    { label: 'Room 2', path: '/room2' },
    { label: 'Settings', path: '/settings' }
  ];
  const navItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <>
      <AnimatePresence>
        {!collapsed ? (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: collapsed ? '-100%' : 0, opacity: collapsed ? 0 : 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='fixed top-0 left-0 z-40 w-64 h-full text-white bg-gray-800 md:static md:w-[280px] md:h-auto md:bg-gray-800 md:text-white md:flex md:flex-col'
          >
            <div className='flex flex-col h-full p-4 ai-chat__sidebar'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold cursor-pointer hover:text-sky-500'>GrelaAI</h2>
                <Tooltip title='Close sidebar'>
                  <Button
                    size='small'
                    type='text'
                    className='border border-solid border-[#d9d9d9] dark:border-[#434343] rounded-md px-2 py-1 flex items-center gap-2'
                    icon={<VerticalRightOutlined />}
                    onClick={() => setCollapsed(true)}
                  />
                </Tooltip>
              </div>

              {!collapsed && (
                <>
                  <Button type='primary' icon={<CommentOutlined />}>
                    New Chat
                  </Button>

                  <nav className='flex flex-col space-y-4'>
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.label}
                        custom={index}
                        initial='hidden'
                        animate='visible'
                        variants={navItemVariants}
                      >
                        {item.label}
                      </motion.div>
                    ))}
                  </nav>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <div className='items-center ai-chat__sidebar' data-collapsed={collapsed}>
            <img
              className='cursor-pointer'
              src='images/logo-grela.png'
              alt='Grela Logo'
              width={40}
            />

            <Tooltip title='Open sidebar'>
              <Button
                size='small'
                type='text'
                className='border border-solid border-[#d9d9d9] dark:border-[#434343] rounded-md px-2 py-1 flex items-center gap-2'
                icon={<VerticalLeftOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
            </Tooltip>

            <Button type='primary' icon={<CommentOutlined />} />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AISidebar;
