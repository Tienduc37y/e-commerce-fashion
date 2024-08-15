import React, { useRef } from "react";
import Slider from "react-slick";
import { dataTest } from './dataTest';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const MainCarousel = () => {
  const sliderRef = useRef(null);

  const items = dataTest.map((item, index) => (
    <img
      className="cursor-pointer object-contain w-full"
      src={item.image}
      alt=""
      key={index}
      style={{ maxHeight: '100%' }}
    />
  ));

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,            // Bật auto-play
    autoplaySpeed: 2000,       // Thời gian chuyển slide (tính bằng milliseconds)
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <div className="container mx-auto relative">
      <Slider ref={sliderRef} {...settings}>
        {items}
      </Slider>
      <button
        className="absolute top-1/2 transform -translate-y-1/2 left-0 bg-gray-800 text-white px-4 py-2 rounded"
        onClick={() => sliderRef.current.slickPrev()}
      >
        <ArrowBackIosIcon/>
      </button>
      <button
        className="absolute top-1/2 transform -translate-y-1/2 right-0 bg-gray-800 text-white px-4 py-2 rounded"
        onClick={() => sliderRef.current.slickNext()}
      >
        <ArrowForwardIosIcon/>
      </button>
    </div>
  );
};

export default MainCarousel;
