const Wedding = () => {
  return (
    <div className='light-theme'>
      <div className='wedding-page template-v1'>
        {/* Left */}
        <div className='left-card'>
          <div className='w-[300px] h-[440px] border-[3px] border-solid border-[#b59264]'>
            <img className='object-cover w-full h-full' src='./images/NTH_9321.JPG' alt='Image 1' />
          </div>

          <div className='absolute flex items-center justify-end top-4 right-8 save-the-date'>
            Save The Date
          </div>

          <div className='absolute left-0 flex flex-col items-center justify-center w-full bottom-8 wed-date'>
            15 . 03 . 2025
          </div>

          {/* <div className='absolute left-0 flex flex-col items-center justify-center w-full bottom-4 best-regards'>
            <p className='title'>Trân trọng kính mời</p>
            <p className='content'>....................................</p>
          </div> */}
        </div>

        {/* Right */}
        <div className='right-card'>
          <div>
            <p>Thanh Lâm</p>
            <p>&</p>
            <p>Bảo Ninh</p>
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
