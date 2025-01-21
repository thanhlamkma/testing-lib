import { Carousel } from 'antd';

const Wedding = () => {
  return (
    <div className='light-theme'>
      <div className='wedding-page template-v1'>
        {/* Left card */}
        <div className='lc'>
          <div className='lc__save-date'>Save The Date</div>

          <div className='lc__img-ctn border-[3px] border-solid border-[#b59264]'>
            <Carousel infinite={true} draggable>
              <div>
                <img className='lc__img' src='./images/WeddingCard2.png' alt='Image 1' />
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
                <img className='lc__img' src='./images/NTH_9285.JPG' alt='Image 6' />
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
          <p className='font-semibold'>TRÂN TRỌNG KÍNH MỜI</p>
          <p>...Bạn + Người thân...</p>
          <p>Đến dự lễ thành hôn của chúng tôi</p>

          <div className='rc__couple'>
            <p>Thanh Lâm</p>
            <p className='rc__couple-and'>&</p>
            <p>Nguyễn Ninh</p>
          </div>

          <p>Được tổ chức vào hồi</p>

          <div className='rc__date'>
            <p>10 giờ 30 phút</p>
            <div>
              <span>THỨ BẢY</span>
              <span>15</span>
              <span>THÁNG 3</span>
            </div>
            <p>2025</p>
            <p>(Tức ngày 16 tháng 02 năm Tân Tỵ)</p>
          </div>

          <div>
            <p>Tại tư gia nhà trai</p>
            <p>Xóm 2 - Xuân Châu - Xuân Trường - Nam Định</p>
          </div>

          <div>Sự hiện diện của quý khách là niềm vinh dự cho gia đình chúng tôi</div>
        </div>
      </div>
    </div>
  );
};

export default Wedding;
