import MaximizePortal from '@/pages/about/components/MaximizePortal';

const About = () => {
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <MaximizePortal>
        <div className='flex items-center justify-center w-full h-full'>
          <p className='text-2xl font-medium text-center capitalize'>
            Test maximize and restore down
          </p>
        </div>
      </MaximizePortal>
    </div>
  );
};

export default About;
