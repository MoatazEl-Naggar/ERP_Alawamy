import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f4ea3"
    },
    secondary: {
      main: "#00a389"
    },
    background: {
      default: "#f3f6fb",
      paper: "#ffffff"
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: ["Inter", "Segoe UI", "Arial", "sans-serif"].join(",")
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top right, rgba(31, 78, 163, 0.08), transparent 30%), radial-gradient(circle at bottom left, rgba(0, 163, 137, 0.1), transparent 35%), #f3f6fb"
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(8px)"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 6px 24px rgba(15, 23, 42, 0.06)"
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        size: "small"
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: "none",
          backgroundImage: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)"
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: "2px 8px",
          "&.Mui-selected": {
            backgroundColor: "rgba(31, 78, 163, 0.12)",
            color: "#1f4ea3",
            "& .MuiListItemIcon-root": {
              color: "#1f4ea3"
            }
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: "#f5f8ff"
        }
      }
    }
  }
});

export default theme;
