const Wedding = () => {
  return (
    <div className='light-theme'>
      <div className='wedding-page'>
        {/* Left */}
        <div className='left-card'>
          <div className='flex items-center justify-center w-full h-[60px]'>Happy Wedding</div>

          <div className='w-[468px] h-[calc(100%-140px)]'>
            <img
              className='object-cover w-full h-full'
              src='./images/NTH_8926_edit.JPG'
              alt='Image 1'
            />
          </div>

          <div className='flex flex-col items-center justify-center h-[80px]'>
            <p>Trân trọng kính mời</p>
            <p>....................................</p>
          </div>
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