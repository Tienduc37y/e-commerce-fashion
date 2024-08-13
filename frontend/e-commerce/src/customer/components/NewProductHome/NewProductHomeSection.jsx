import NewProductHomeCard from './NewProductHomeCard';

const infoNewProduct = [
  {
    image: "https://media.canifa.com/Simiconnector/SP-moi_Nu-19.04a.webp",
    title: "NỮ",
  },
  {
    image: "https://media.canifa.com/Simiconnector/SP-moi_Nam-19.04a.webp",
    title: "NAM",
  },
  {
    image: "https://media.canifa.com/Simiconnector/SP-moi_Boy-19.04a.webp",
    title: "BÉ TRAI",
  },
  {
    image: "https://media.canifa.com/Simiconnector/SP-moi_Girl-19.04a.webp",
    title: "BÉ GÁI",
  },
];

const NewProductHomeSection = () => {
  return (
    <div className="px-4 pb-8 md:px-0">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 my-4">Sản phẩm mới</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {infoNewProduct.map((item, index) => (
          <NewProductHomeCard key={index} title={item.title} image={item.image} />
        ))}
      </div>
    </div>
  );
};

export default NewProductHomeSection;
