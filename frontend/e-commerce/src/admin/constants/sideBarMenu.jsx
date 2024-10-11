import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DashboardIcon from '@mui/icons-material/Dashboard';

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
        icon: DashboardIcon,
        path: '/admin/products',
    },
    {
        title: 'Orders',
        icon: ReceiptOutlinedIcon,
        path: '/admin/orders',
    },
    {
        title: 'Log Out',
        icon: LogoutOutlinedIcon,
        action: 'logout'
    }
];