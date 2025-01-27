import { Carousel } from 'antd';

const Wedding = () => {
  return (
    <div className='light-theme'>
      <div className='wedding-page template-v1'>
        {/* Left card */}
        <div className='lc'>
          <div className='lc__save-date'>Save The Date</div>

          <div className='lc__img-ctn'>
            <Carousel
              className='w-full h-full'
              infinite={true}
              dots={false}
              draggable
              fade
              // autoplay
            >
              <div>
                <img className='lc__img' src='./images/WeddingCard5.png' alt='Image 1' />
              </div>
              <div>
                <img className='lc__img' src='./images/NTH_8926.JPG' alt='Image 2' />
              </div>
              <div>
                <img className='lc__img' src='./images/NTH_8144.JPG' alt='Image 3' />
              </div>
              <div>
                <img className='lc__img' src='./images/NTH_8524.JPG' alt='Image 4' />
              </div>
              <div>
                <img className='lc__img' src='./images/NTH_9000.JPG' alt='Image 5' />
              </div>
              <div>
                <img className='lc__img' src='./images/NTH_9213.JPG' alt='Image 6' />
              </div>
              <div>
                <img className='lc__img' src='./images/NTH_9499.JPG' alt='Image 7' />
              </div>
              <div>
                <img className='lc__img' src='./images/NTH_9510.JPG' alt='Image 8' />
              </div>
            </Carousel>
            {/* <img className='lc__img' src='./images/NTH_9321.JPG' alt='Image 1' /> */}
          </div>

          <div className='lc__date'>15 . 03 . 2025</div>
        </div>

        {/* Right card */}
        <div className='rc'>
          <p className='text-xl font-bold md:text-3xl' style={{ fontFamily: 'Times New Roman' }}>
            TRÂN TRỌNG KÍNH MỜI
          </p>

          <div className='relative w-full'>
            <p className='absolute left-0 flex justify-center w-full italic bottom-[2px]'>
              Bạn và người thương
            </p>
            <p>............................................................</p>
          </div>

          <p>Đến dự lễ thành hôn của chúng tôi</p>

          <div className='rc__couple'>
            <p>Thanh Lâm</p>
            <p className='rc__couple-and'>&</p>
            <p>Nguyễn Ninh</p>
          </div>

          <p>Được tổ chức vào hồi</p>

          <div className='flex flex-col items-center justify-center gap-1 text-base font-semibold'>
            <p className='text-base'>10 giờ 30</p>

            <div className='flex items-center justify-center gap-4'>
              <span className='py-1 border-t border-b border-solid'>THỨ BẢY</span>
              <span className='flex items-center justify-center w-12 h-12 text-3xl font-semibold border border-solid rounded-full text-[#da312e]'>
                15
              </span>
              <span className='py-1 border-t border-b border-solid'>03 - 2025</span>
            </div>

            {/* <p className='text-base'>2025</p> */}

            <p className='text-sm'>(Tức ngày 16 tháng 02 năm Tân Tỵ)</p>
          </div>

          <div className='my-1 text-base font-medium font-[Mulish]'>
            <p>Tại: Tư gia nhà trai</p>
            <p>Xóm 2, Xuân Châu, Xuân Trường, Nam Định</p>
          </div>

          <div className='text-2xl font-[Santillana-Daughter] leading-6'>
            Sự hiện diện của quý khách là niềm vinh dự cho gia đình chúng tôi!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wedding;
