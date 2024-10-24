import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import CallMadeIcon from "@mui/icons-material/CallMade";
import { useNavigate } from "react-router-dom";
import styles from "../dashboard/dashboard.module.css";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

export function Sidebar() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    window.location.reload(); // Reload the page after navigation
    closeDrawer();
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div>
      {/* Hamburger icon for opening the drawer in mobile view */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={openDrawer}
        sx={{ mr: 2, display: { xs: "block", sm: "block", lg: "none" } }}
      >
        <MenuIcon />
      </IconButton>

      {/* Responsive Drawer (visible only in mobile view) */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={closeDrawer}>
        <List>
          {/* Sidebar Links for mobile view */}
          <ListItem button onClick={() => handleNavigation("/")}>
            <HomeIcon />
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation("/transfer")}>
            <CallMadeIcon />
            <ListItemText primary="Transfer" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation("/withdraw")}>
            <CallMadeIcon />
            <ListItemText primary="Withdraw" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation("/transactions")}>
            <PictureAsPdfIcon />
            <ListItemText primary="Statement" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation("/setting")}>
            <SettingsIcon />
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem
            button
            onClick={async () => {
              const response = await fetch(
                "https://abc-banking-app-backend-8c00c6f66f4d.herokuapp.com/logout"
              );
              const data = await response.json();
              if (data.success === true) {
                console.log("success");
                handleNavigation("/login");
              }
            }}
          >
            <LogoutIcon />
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      <div
        className={styles.sidebar}
        style={{ display: { xs: "none", sm: "block" } }}
      >
        <p style={{ fontSize: "25px" }}>ABC Bank Group</p>
        {/* Sidebar Links for larger screens */}
        <div
          onClick={() => handleNavigation("/")}
          className={styles.sidebarLink}
        >
          <span>
            <HomeIcon />
          </span>
          <span
            style={{
              marginTop: "-3px",
              fontSize: "18px",
              paddingLeft: "10px",
              fontWeight: 700,
            }}
          >
            Dashboard
          </span>
        </div>
        <div
          onClick={() => handleNavigation("/transfer")}
          className={styles.sidebarLink}
        >
          <span>
            <CallMadeIcon />
          </span>
          <span
            style={{
              marginTop: "-3px",
              fontSize: "18px",
              paddingLeft: "10px",
              fontWeight: 700,
            }}
          >
            Transfer
          </span>
        </div>
        <div
          onClick={() => handleNavigation("/withdraw")}
          className={styles.sidebarLink}
        >
          <span>
            <CallMadeIcon />
          </span>
          <span
            style={{
              marginTop: "-3px",
              fontSize: "18px",
              paddingLeft: "10px",
              fontWeight: 700,
            }}
          >
            Withdraw
          </span>
        </div>
        <div
          onClick={() => handleNavigation("/transactions")}
          className={styles.sidebarLink}
        >
          <span>
            <PictureAsPdfIcon />
          </span>
          <span
            style={{
              marginTop: "-3px",
              fontSize: "18px",
              paddingLeft: "10px",
              fontWeight: 700,
            }}
          >
            Statement
          </span>
        </div>
        <div
          onClick={() => handleNavigation("/setting")}
          className={styles.sidebarLink}
        >
          <span>
            <SettingsIcon />
          </span>
          <span
            style={{
              marginTop: "-3px",
              fontSize: "18px",
              paddingLeft: "10px",
              fontWeight: 700,
            }}
          >
            Settings
          </span>
        </div>
        <div
          onClick={async () => {
            const response = await fetch(
              "https://abc-banking-app-backend-8c00c6f66f4d.herokuapp.com/logout"
            );
            const data = await response.json();
            if (data.success === true) {
              console.log("success");
              handleNavigation("/login");
            }
          }}
          className={styles.sidebarLink}
        >
          <span>
            <LogoutIcon />
          </span>
          <span
            style={{
              marginTop: "-3px",
              fontSize: "18px",
              paddingLeft: "10px",
              fontWeight: 700,
            }}
          >
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}
