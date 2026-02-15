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
  MenuItem,
  Collapse,
  Divider,
  useMediaQuery
} from "@mui/material";
import { ExpandLess, ExpandMore, Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 240;

export default function Layout() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isRTL = i18n.language === "ar";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
    setOpenSubMenu(null);
  };

  const toggleSubMenu = (menu: string) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    document.body.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const drawerContent = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar />
      <List>
        <ListItemButton onClick={() => navigate("/dashboard")}>
          <ListItemText primary={t("dashboard")} />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />

        <ListItemButton onClick={() => toggleMenu("registration")}>
          <ListItemText primary={t("registration")} />
          {openMenu === "registration" ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openMenu === "registration"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            {user?.role === "ADMIN" && (
              <ListItemButton onClick={() => navigate("/users")}>
                <ListItemText primary={t("usersRegistration")} />
              </ListItemButton>
            )}
            <ListItemButton onClick={() => navigate("/customers")}>
              <ListItemText primary={t("customersRegistration")} />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/suppliers")}>
              <ListItemText primary={t("suppliersRegistration")} />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton onClick={() => toggleMenu("transactions")}>
          <ListItemText primary={t("transactions")} />
          {openMenu === "transactions" ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openMenu === "transactions"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            <ListItemButton onClick={() => navigate("/purchases")}>
              <ListItemText primary={t("purchaseDraft")} />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/receiving")}>
              <ListItemText primary={t("receivingGInvoice")} />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/shipments")}>
              <ListItemText primary={t("containerLoading")} />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton onClick={() => toggleMenu("finance")}>
          <ListItemText primary={t("financeManagement")} />
          {openMenu === "finance" ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openMenu === "finance"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            <ListItemButton onClick={() => toggleSubMenu("financeSettings")}>
              <ListItemText primary={t("financialSettings")} />
              {openSubMenu === "financeSettings" ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openSubMenu === "financeSettings"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 2 }}>
                <ListItemButton onClick={() => navigate("/treasuries")}>
                  <ListItemText primary={t("treasuries")} />
                </ListItemButton>
                <ListItemButton onClick={() => navigate("/expense-categories")}>
                  <ListItemText primary={t("expenseCategories")} />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton onClick={() => toggleSubMenu("vouchers")}>
              <ListItemText primary={t("vouchers")} />
              {openSubMenu === "vouchers" ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openSubMenu === "vouchers"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 2 }}>
                <ListItemButton onClick={() => navigate("/payment-vouchers")}>
                  <ListItemText primary={t("paymentVoucher")} />
                </ListItemButton>
                <ListItemButton onClick={() => navigate("/receipt-vouchers")}>
                  <ListItemText primary={t("receiptVoucher")} />
                </ListItemButton>
                {user?.role === "ADMIN" && (
                  <ListItemButton onClick={() => navigate("/voucher-review")}>
                    <ListItemText primary={t("voucherReview")} />
                  </ListItemButton>
                )}
              </List>
            </Collapse>
          </List>
        </Collapse>

        <Divider sx={{ my: 1 }} />

        <ListItemButton onClick={() => navigate("/reports")}>
          <ListItemText primary={t("reportsMenu")} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t("appName")}
          </Typography>

          <Select
            size="small"
            value={i18n.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            sx={{ mr: 2, color: "white", borderBottom: "1px solid white", "& .MuiSvgIcon-root": { color: "white" } }}
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

      {isMobile ? (
        <Drawer variant="temporary" open={mobileOpen} onClose={toggleDrawer} anchor={isRTL ? "right" : "left"} ModalProps={{ keepMounted: true }}>
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer variant="permanent" anchor={isRTL ? "right" : "left"} sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" } }}>
          {drawerContent}
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, ml: !isMobile && !isRTL ? `${drawerWidth}px` : 0, mr: !isMobile && isRTL ? `${drawerWidth}px` : 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
