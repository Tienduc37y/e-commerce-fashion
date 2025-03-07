import { Typography, useTheme, Tooltip } from "@mui/material";
import { MenuItem } from "react-pro-sidebar";
import { tokens } from "../../theme/theme";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const SidebarMenuItem = ({ menu, selected, setSelected, isCollapsed, onLogout }) => {
	const themes = useTheme();
	const color = tokens(themes.palette.mode);
	const location = useLocation();

	const isActive = location.pathname === menu.path;

	const handleClick = () => {
		if (onLogout) {
			onLogout();
		} else {
			setSelected(menu.path);
		}
	};

	const menuItem = (
		<MenuItem
			icon={<menu.icon />}
			active={isActive}
			onClick={handleClick}
			style={{ 
				color: isActive ? color.blueAccent[500] : color.primary[100],
			}}
		>
			{!isCollapsed && <Typography>{menu.title}</Typography>}
			{!onLogout && <Link to={menu.path} />}
		</MenuItem>
	);

	return isCollapsed ? (
		<Tooltip title={menu.title} placement="right">
			{menuItem}
		</Tooltip>
	) : (
		menuItem
	);
};

export default SidebarMenuItem;
