import { Outlet } from 'react-router-dom';

const LayoutApps = () => {
  return (
    <div className='grid grid-cols-7'>
      <div className='col-span-1'></div>

      <Outlet />
    </div>
  );
};

export default LayoutApps;
