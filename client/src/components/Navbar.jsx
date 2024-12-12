import React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import TranslateIcon from "@mui/icons-material/Translate";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";
import axiosInstance from "../api/axiosConfig";
import profileicon from '../images/profileicon.png';
import { googleLogout } from '@react-oauth/google';

export default function Navbar() {
  const { toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const pages = [
    { label: t("Home"), path: "home" },
    { label: t("About"), path: "about" },
  ];
const settings = [{label: t("profile"), path: "profile"}, {label: t("Logout"), path: "logout"}];
  // ---------------------MUI-------------------
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  // ---------------------------------------------
  // -------routing---------
  const navigate = useNavigate();
  const travelTo = (dest) => {
    navigate("/" + dest);
  };
  // -----------------------
  const logout = async () => {
    googleLogout(); 
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      const response = await axiosInstance.post("/api/auth/logout");
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="header">
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #f8c6c4, #fab28d)",
          padding: "10px 0",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Left Section */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page, index) => (
                  <MenuItem
                  key={index}
                    onClick={() => {
                      travelTo(page.path);
                    }}
                  >
                    <Typography textAlign="center"> {page.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {pages.map((page, index) => (
                <Button
                  key={index}
                  sx={{
                    my: 1,
                    display: "block",
                    fontFamily: "Open Sans",
                    fontWeight: 400,
                    color: "black",
                    marginRight: "10px",
                    border: "1px solid black",
                    borderRadius: "20px",
                    padding: "5px 15px",
                  }}
                  onClick={() => travelTo(page.path)}
                >
                   {page.label}
                </Button>
              ))}
            </Box>

            {/* Center Section */}
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "Zeyada, cursive",
                  fontWeight: 400,
                  color: "black",
                }}
              >
                Take care
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={t("Change Language")}>
                <IconButton
                  onClick={toggleLanguage}
                  sx={{ p: 1, color: "white", marginRight: "10px" }}
                >
                  <TranslateIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Uemy Sharp" src={profileicon} />
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {localStorage.accessToken ? (
                  settings.map((setting, index) => (
                    <MenuItem key={setting.path} onClick={handleCloseUserMenu}>
                      <Typography
                        onClick={() => {
                          if (setting.path === "logout") {
                            logout();
                          } else {
                            travelTo(setting.path);
                          }
                        }}
                        textAlign="center"
                      >
                        {setting.label}
                      </Typography>
                    </MenuItem>
                  ))
                ) : (
                  <div>
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography onClick={() => travelTo("login")}>
                        {" "}
                        {t("Login")}{" "}
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography onClick={() => travelTo("register")}>
                        {" "}
                        {t("register")}{" "}
                      </Typography>
                    </MenuItem>
                  </div>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
