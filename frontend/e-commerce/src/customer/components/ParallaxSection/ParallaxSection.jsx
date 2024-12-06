import React from 'react';

const ParallaxSection = () => {
  return (
    <div 
      id="parallax-section"
      className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden"
    >
      <div 
        className="absolute inset-0 w-full"
        style={{
          height: '100%',
          backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=3270&auto=format&fit=crop')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />
      {/* Sử dụng CSS media query thông qua className thay vì inline style */}
      <style>
        {`
          @media (max-width: 768px) {
            #parallax-section > div {
              background-attachment: scroll;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ParallaxSection; 