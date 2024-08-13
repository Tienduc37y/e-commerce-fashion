import HomeSectionCard from "./HomeSectionCard";
import EastIcon from '@mui/icons-material/East';

const HomeSectionCarousel = ({ data, sectionName }) => {
    const items = data?.slice(0, 8).map((item, index) => (
        <div
            key={index}
            className="px-2 lg:px-4 flex-shrink-0 basis-1/2 md:basis-1/4 lg:basis-1/4"
        >
            <HomeSectionCard product={item} />
        </div>
    ));

    return (
        <div className="px-4 md:px-0">
            <img className="w-full h-auto object-cover" src="https://media.canifa.com/Simiconnector/Ao_phong_block_home_desktop-29.07.webp" alt="" />
            <div className="mb-6 py-8 md:px-0">
                {/* <div className="flex justify-between items-center">
                    <h3 className="text-2xl my-4 font-bold">{sectionName}</h3>
                    <div className="flex justify-center items-center gap-2 cursor-pointer">
                        <span className="text-red-500">Xem thêm</span>
                        <EastIcon className="text-red-500" />
                    </div>
                </div> */}
                <div className="relative">
                    <div className="flex flex-wrap gap-y-5 -mx-2 lg:-mx-4">
                        {items}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSectionCarousel;
