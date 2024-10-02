import { Typography, useTheme, Tooltip } from "@mui/material";
import { MenuItem } from "react-pro-sidebar";
import { tokens } from "../../theme/theme";
import { Link } from "react-router-dom";

const SidebarMenuItem = ({ menu, selected, setSelected, isCollapsed }) => {
	const themes = useTheme();
	const color = tokens(themes.palette.mode);

	const menuItem = (
		<MenuItem
			icon={<menu.icon />}
			active={selected === menu.path}
			onClick={() => setSelected(menu.path)}
			style={{ color: color.primary[100] }}
		>
			{!isCollapsed && <Typography>{menu.title}</Typography>}
			<Link to={menu.path} />
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