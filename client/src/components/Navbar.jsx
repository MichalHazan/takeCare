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
import { ThemeProvider, createTheme } from "@mui/material/styles";
import TranslateIcon from "@mui/icons-material/Translate";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";
import axiosInstance from "../api/axiosConfig";


const pages = ["Home", "About"];
const settings = ["profile", "Logout"];
export default function Navbar() {
  const { toggleLanguage } = useLanguage();
  const { t } = useTranslation();
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
    try {
      console.log("logout");
      localStorage.clear();
      //Deleted due to an error message on exit.
      //const response = await axiosInstance.delete("/api/users/logout");
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
                  {pages.map((page) => (
                      <MenuItem
                          key={page}
                          onClick={() => {
                            travelTo(page);
                          }}
                      >
                        <Typography textAlign="center">{page}</Typography>
                      </MenuItem>
                  ))}
                </Menu>
              </Box>
              {/* Center Section */}
              <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
              >
                <Typography variant="h6">TakeCare</Typography>
              </Box>

              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                    <Button
                        key={page}
                        sx={{ my: 2, color: "white", display: "block" }}
                        onClick={() => travelTo(page)}
                    >
                      {page}
                    </Button>
                ))}
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
                    <Avatar alt="Uemy Sharp" src="/static/images/avatar/2.jpg" />
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
                  {localStorage.token ? (
                      settings.map((setting) => (
                          <MenuItem key={setting} onClick={handleCloseUserMenu}>
                            <Typography
                                onClick={() => {
                                  if (setting === "Logout") {
                                    logout();
                                  } else {
                                    travelTo(setting);
                                  }
                                }}
                                textAlign="center"
                            >
                              {setting}
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
