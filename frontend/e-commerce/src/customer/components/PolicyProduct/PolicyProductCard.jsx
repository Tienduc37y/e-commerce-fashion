const PolicyProductCard = ({ icon, title, description }) => {
  return (
    <div className="flex justify-center items-center gap-4 basis-1/3">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default PolicyProductCard;
