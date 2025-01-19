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
                <img className='lc__img' src='./images/WeddingCard.png' alt='Image 1' />
              </div>
              <div>
                <img className='lc__img' src='./images/NTH_8926.JPG' alt='Image 1' />
              </div>
              <div>
                <img className='lc__img' src='./images/NTH_8144.JPG' alt='Image 1' />
              </div>
              <div>
                <img className='lc__img' src='./images/NTH_8524.JPG' alt='Image 1' />
              </div>
              <div>
                <img className='lc__img' src='./images/NTH_9000.JPG' alt='Image 1' />
              </div>
              <div>
                <img className='lc__img' src='./images/NTH_9285.JPG' alt='Image 1' />
              </div>
              <div>
                <img className='lc__img' src='./images/NTH_9328.JPG' alt='Image 1' />
              </div>
              <div>
                <img className='lc__img' src='./images/NTH_9499.JPG' alt='Image 1' />
              </div>
            </Carousel>
            {/* <img className='lc__img' src='./images/NTH_9321.JPG' alt='Image 1' /> */}
          </div>

          <div className='lc__date'>15 . 03 . 2025</div>
        </div>

        {/* Right card */}
        <div className='rc'>
          <div>
            <p>Thanh Lâm</p>
            <p>&</p>
            <p>Nguyễn Ninh</p>
          </div>

          <p>Trân trọng kính mời</p>
          <p>Bạn + Người thân</p>
          <p>Đến dự buổi tiệc chung vui cùng gia đình chúng tôi</p>
          <p>Được tổ chức vào hồi</p>
          <p>11 giờ 30 phút</p>

          <div>
            <p>Thứ bảy</p>
            <p>15</p>
            <p>03-2024</p>
          </div>

          <p>(Tức ngày 16 tháng 02 năm Tân Tỵ)</p>

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
