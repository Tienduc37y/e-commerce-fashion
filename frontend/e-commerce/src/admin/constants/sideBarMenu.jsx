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
        title: 'Dashboard',
        icon: HomeOutlinedIcon,
        path: '/admin/',
    },
    {
        title: 'User',
        icon: PeopleOutlinedIcon,
        path: '/admin/customers',
    },
    {
        title: 'Products',
        icon: ClothesIcon,
        path: '/admin/products',
    },
    {
        title: 'Orders',
        icon: ReceiptOutlinedIcon,
        path: '/admin/orders',
    },
    {
        title: 'Promotions',
        icon: LoyaltyIcon,
        path: '/admin/promotions',
    },
    {
        title: 'Banner',
        icon: CollectionsIcon,
        path: '/admin/banners',
    },
    {
        title: 'Reviews',
        icon: ReviewsIcon,
        path: '/admin/reviews',
    },
    {
        title: 'Log Out',
        icon: LogoutOutlinedIcon,
        action: 'logout'
    }
];