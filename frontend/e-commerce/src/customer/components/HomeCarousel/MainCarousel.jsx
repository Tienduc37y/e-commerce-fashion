import React, { useRef, useEffect } from "react";
import Slider from "react-slick";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useSelector, useDispatch } from "react-redux";
import { getBanners } from "../../../redux/Banner/Action";
const MainCarousel = () => {
  const sliderRef = useRef(null);

  const dispatch = useDispatch();
  const {banners, loading} = useSelector(state => state.banner);
  const visibleBanners = banners?.filter(banner => banner.visible) || [];

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  const items = visibleBanners.map((item, index) => (
    <img
      className="cursor-pointer object-contain w-full h-max-[450px]"
      src={item.imageUrl}
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
        className="absolute top-1/2 transform -translate-y-1/2 left-0 bg-gray-800/50 text-white p-2 sm:px-4 sm:py-2 rounded hidden sm:block"
        onClick={() => sliderRef.current.slickPrev()}
      >
        <ArrowBackIosIcon className="text-sm sm:text-base"/>
      </button>
      <button
        className="absolute top-1/2 transform -translate-y-1/2 right-0 bg-gray-800/50 text-white p-2 sm:px-4 sm:py-2 rounded hidden sm:block"
        onClick={() => sliderRef.current.slickNext()}
      >
        <ArrowForwardIosIcon className="text-sm sm:text-base"/>
      </button>
    </div>
  );
};

export default MainCarousel;
