import PolicyProductCard from './PolicyProductCard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { PaymentOutlined, RefreshOutlined } from '@mui/icons-material';

const infoPolicyProduct = [
    {
        icon: <LocalShippingIcon />,
        title: "Thanh toán khi nhận hàng (COD)",
        description: "Giao hàng toàn quốc."
    },
    {
        icon: <PaymentOutlined />,
        title: "Thanh toán an toàn",
        description: "Thanh toán Banking"
    },
    {
        icon: <RefreshOutlined />,
        title: "Đổi hàng miễn phí",
        description: "Trong 7 ngày kể từ ngày mua."
    }
];

const PolicyProductSection = () => {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-start md:justify-center items-start sm:items-center py-4 px-4 lg:px-8 border-b-[1px] border-solid border-gray-300 gap-4 overflow-x-hidden">
            {infoPolicyProduct.map((item, index) => (
                <PolicyProductCard
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                />
            ))}
        </div>
    );
};

export default PolicyProductSection;
