import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  IconButton,
  Select,
  MenuItem
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";

const drawerWidth = 240;

export default function Layout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useTranslation();

  const menuItems = [
    { text: t("dashboard"), path: "/dashboard" },
    { text: t("customers"), path: "/customers" },
    { text: t("suppliers"), path: "/suppliers" },
    { text: t("purchases"), path: "/purchases" },
    { text: t("receiving"), path: "/receiving" },
    { text: t("shipments"), path: "/shipments" },
    { text: t("treasuries"), path: "/treasuries" },
    { text: t("expenses"), path: "/expenses" },
    { text: t("inventory"), path: "/inventory" },
    { text: t("reports"), path: "/reports" }
  ];

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    document.body.dir = lang === "ar" ? "rtl" : "ltr";
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Bar */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start">
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ERP System
          </Typography>

          {/* Language Selector */}
          <Select
            size="small"
            defaultValue={i18n.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            sx={{
              mr: 2,
              color: "white",
              borderBottom: "1px solid white",
              "& .MuiSvgIcon-root": { color: "white" }
            }}
          >
            <MenuItem value="en">EN</MenuItem>
            <MenuItem value="ar">AR</MenuItem>
            <MenuItem value="zh">中文</MenuItem>
          </Select>

          <Typography sx={{ cursor: "pointer" }} onClick={logout}>
            {t("logout")}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box"
          }
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItemButton key={item.text} onClick={() => navigate(item.path)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Page Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
