
const NewProductHomeCard = ({ image, title }) => {
  return (
    <div className="relative group">
      <img src={image} alt={title} className="w-full h-full object-cover rounded-lg" />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <h3 className="text-white text-lg font-bold">{title}</h3>
      </div>
    </div>
  );
};

export default NewProductHomeCard;
