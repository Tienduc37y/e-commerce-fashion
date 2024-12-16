import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import CollectionsIcon from '@mui/icons-material/Collections';
import ReviewsIcon from '@mui/icons-material/Reviews';
import ClothesIcon from "../components/global/ClothesIcon";
export const sidebarMenu = [
    {
        title: 'Bảng điều khiển',
        icon: HomeOutlinedIcon,
        path: '/admin/',
    },
    {
        title: 'Quản lý người dùng',
        icon: PeopleOutlinedIcon,
        path: '/admin/customers',
    },
    {
        title: 'Quản lý sản phẩm',
        icon: ClothesIcon,
        path: '/admin/products',
    },
    {
        title: 'Quản lý đơn hàng',
        icon: ReceiptOutlinedIcon,
        path: '/admin/orders',
    },
    {
        title: 'Quản lý mã giảm giá',
        icon: LoyaltyIcon,
        path: '/admin/promotions',
    },
    {
        title: 'Quản lý banner',
        icon: CollectionsIcon,
        path: '/admin/banners',
    },
    {
        title: 'Quản lý đánh giá',
        icon: ReviewsIcon,
        path: '/admin/reviews',
    },
    {
        title: 'Đăng xuất',
        icon: LogoutOutlinedIcon,
        action: 'logout'
    }
];