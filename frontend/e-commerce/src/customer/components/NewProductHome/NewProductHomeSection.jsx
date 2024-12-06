import NewProductHomeCard from './NewProductHomeCard';
import { useNavigate } from 'react-router-dom';

const infoNewProduct = [
  {
    image: "https://media.canifa.com/Simiconnector/SP-moi_Nu-19.04a.webp",
    title: "NỮ",
    link: "/top-level-category/nu",
    width: "w-full sm:w-1/4"
  },
  {
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
    title: "BỘ SƯU TẬP MỚI",
    link: "/",
    width: "w-full sm:w-2/4",
    isMain: true
  },
  {
    image: "https://media.canifa.com/Simiconnector/SP-moi_Nam-19.04a.webp",
    title: "NAM",
    link: "/top-level-category/nam",
    width: "w-full sm:w-1/4"
  },
];

const NewProductHomeSection = () => {
  const navigate = useNavigate();

  const handleCardClick = (link) => {
    navigate(link);
  };

  return (
    <div className="max-w-full">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 sm:h-[500px]">
        {infoNewProduct.map((item, index) => (
          <div 
            key={index} 
            className={`${item.width} h-[180px] sm:h-full cursor-pointer`}
            onClick={() => handleCardClick(item.link)}
          >
            <NewProductHomeCard 
              title={item.title} 
              image={item.image}
              isMain={item.isMain}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewProductHomeSection; 