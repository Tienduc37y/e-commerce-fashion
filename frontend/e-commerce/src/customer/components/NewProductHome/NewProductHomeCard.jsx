const NewProductHomeCard = ({ image, title }) => {
  return (
    <div className="relative overflow-hidden group h-full rounded-lg">
      <div className="absolute inset-0">
        <img 
          className="w-full h-full object-cover sm:object-center object-top transition-transform duration-300 group-hover:scale-110"
          src={image} 
          alt={title}
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-20">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-base sm:text-2xl font-semibold transform transition-transform duration-300 group-hover:scale-110 text-center">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewProductHomeCard;