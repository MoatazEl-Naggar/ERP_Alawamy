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
  useMediaQuery,
  Stack,
  Chip,
  ListSubheader
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  Dashboard,
  Logout,
  Language,
  Person,
  Business,
  LocalShipping,
  AccountBalance,
  Assessment
} from "@mui/icons-material";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 268;

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isRTL = i18n.language === "ar";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const navigateTo = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const isSelected = (path: string) => location.pathname === path;

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

  const userRole = useMemo(() => user?.role?.toLowerCase() ?? "user", [user?.role]);

  const drawerContent = (
    <Box sx={{ width: drawerWidth, height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, pt: 3 }}>
        <Typography variant="h6" fontWeight={700} color="primary.main">
          {t("appName")}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t("dashboard")}
        </Typography>
      </Box>
      <Divider />

      <List sx={{ flexGrow: 1, px: 1, py: 1 }}>
        <ListItemButton selected={isSelected("/dashboard")} onClick={() => navigateTo("/dashboard")}>
          <Dashboard fontSize="small" sx={{ mr: 1 }} />
          <ListItemText primary={t("dashboard")} />
        </ListItemButton>

        <ListSubheader sx={{ bgcolor: "transparent", lineHeight: 2.2, fontWeight: 700 }}>
          {t("registration")}
        </ListSubheader>

        <ListItemButton onClick={() => toggleMenu("registration")}>
          <ListItemText primary={t("registration")} />
          {openMenu === "registration" ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMenu === "registration"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            {user?.role === "ADMIN" && (
              <ListItemButton selected={isSelected("/users")} onClick={() => navigateTo("/users")}>
                <Person fontSize="small" sx={{ mr: 1 }} />
                <ListItemText primary={t("usersRegistration")} />
              </ListItemButton>
            )}
            <ListItemButton selected={isSelected("/customers")} onClick={() => navigateTo("/customers")}>
              <Business fontSize="small" sx={{ mr: 1 }} />
              <ListItemText primary={t("customersRegistration")} />
            </ListItemButton>
            <ListItemButton selected={isSelected("/suppliers")} onClick={() => navigateTo("/suppliers")}>
              <Business fontSize="small" sx={{ mr: 1 }} />
              <ListItemText primary={t("suppliersRegistration")} />
            </ListItemButton>
            <ListItemButton selected={isSelected("/container-registration")} onClick={() => navigateTo("/container-registration")}>
              <LocalShipping fontSize="small" sx={{ mr: 1 }} />
              <ListItemText primary={t("containerRegistration")} />
            </ListItemButton>
            <ListItemButton selected={isSelected("/items-registration")} onClick={() => navigateTo("/items-registration")}>
              <LocalShipping fontSize="small" sx={{ mr: 1 }} />
              <ListItemText primary={t("itemsRegistration")} />
            </ListItemButton>
          </List>
        </Collapse>

        <ListSubheader sx={{ bgcolor: "transparent", lineHeight: 2.2, fontWeight: 700 }}>
        {t("transactions")}
        </ListSubheader>
        <ListItemButton onClick={() => toggleMenu("transactions")}>
          <ListItemText primary={t("transactions")} />
          {openMenu === "transactions" ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openMenu === "transactions"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            <ListItemButton selected={isSelected("/purchases")} onClick={() => navigateTo("/purchases")}>
              <ListItemText primary={t("purchaseDraft")} />
            </ListItemButton>
            <ListItemButton selected={isSelected("/receiving")} onClick={() => navigateTo("/receiving")}>
              <ListItemText primary={t("receivingGInvoice")} />
            </ListItemButton>
            <ListItemButton selected={isSelected("/shipments")} onClick={() => navigateTo("/shipments")}>
              <ListItemText primary={t("containerLoading")} />
            </ListItemButton>
          </List>
        </Collapse>

        <ListSubheader sx={{ bgcolor: "transparent", lineHeight: 2.2, fontWeight: 700 }}>
          {t("financeManagement")}
        </ListSubheader>
        <ListItemButton onClick={() => toggleMenu("finance")}>
          <AccountBalance fontSize="small" sx={{ mr: 1 }} />
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
                <ListItemButton selected={isSelected("/treasuries")} onClick={() => navigateTo("/treasuries")}>
                  <ListItemText primary={t("treasuries")} />
                </ListItemButton>
                <ListItemButton selected={isSelected("/expenses")} onClick={() => navigateTo("/expenses")}>
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
                <ListItemButton onClick={() => navigateTo("/payment-vouchers")}>
                  <ListItemText primary={t("paymentVoucher")} />
                </ListItemButton>
                <ListItemButton onClick={() => navigateTo("/receipt-vouchers")}>
                  <ListItemText primary={t("receiptVoucher")} />
                </ListItemButton>
                {user?.role === "ADMIN" && (
                  <ListItemButton onClick={() => navigateTo("/voucher-review")}>
                    <ListItemText primary={t("voucherReview")} />
                  </ListItemButton>
                )}
              </List>
            </Collapse>
          </List>
        </Collapse>

        <Divider sx={{ my: 1 }} />

        <ListItemButton selected={isSelected("/reports")} onClick={() => navigateTo("/reports")}>
          <Assessment fontSize="small" sx={{ mr: 1 }} />
          <ListItemText primary={t("reportsMenu")} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1300,
          background: "linear-gradient(100deg, #1f4ea3 5%, #406bc0 50%, #00a389 110%)"
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {t("appName")}
          </Typography>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip
              icon={<Person />}
              label={userRole}
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "white", textTransform: "capitalize" }}
            />
            <Select
              size="small"
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              sx={{
                minWidth: 84,
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 2,
                "& .MuiSvgIcon-root": { color: "white" }
              }}
            >
              <MenuItem value="ar">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Language fontSize="small" />
                  <span>AR</span>
                </Stack>
              </MenuItem>
              <MenuItem value="zh">中文</MenuItem>
            </Select>

            <IconButton color="inherit" onClick={logout}>
              <Logout />
            </IconButton>
          </Stack>
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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          mt: 8,
          ml: !isMobile && !isRTL ? `${drawerWidth}px` : 0,
          mr: !isMobile && isRTL ? `${drawerWidth}px` : 0
        }}
      >        
      <Outlet />
      </Box>
    </Box>
  );
}
