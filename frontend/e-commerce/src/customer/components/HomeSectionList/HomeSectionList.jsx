import HomeSectionCard from "./HomeSectionCard";
import EastIcon from '@mui/icons-material/East';

const HomeSectionList = ({ data, sectionName, haveImage }) => {
    const items = data?.slice(0, 8).map((item, index) => (
        <div
            key={index}
            className="px-2 md:px-4 flex-shrink-0 w-1/2 md:w-1/2 lg:w-1/4"
        >
            <HomeSectionCard product={item} />
        </div>
    ));

    return (
        <div className="px-4 md:px-0">
            {haveImage ? (
                <img
                    className="w-full h-auto object-cover"
                    src="https://media.canifa.com/Simiconnector/Ao_phong_block_home_desktop-29.07.webp"
                    alt=""
                />
            ) : (
                ""
            )}
            <div className="py-8 md:px-0">
                <div className="relative">
                    <div className="flex flex-wrap gap-y-6 -mx-2 lg:-mx-4">
                        {items}
                    </div>
                    <div className="flex justify-center mt-8">
                        <button className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-300 ease-in-out">
                            Xem thêm
                            <EastIcon className="text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSectionList;
