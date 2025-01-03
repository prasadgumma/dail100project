import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Box,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [sliderData, setSliderData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null); // For handling submenu
  const [submenuItems, setSubmenuItems] = useState([]);
  const navigate = useNavigate();
  console.log(submenuItems, "submenuItems");

  const sessid = Cookies.get("sessid"); // Get sessid from cookies

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://192.168.21.71/devenv/d100_ipbx_ajax_apis/public/index.php/v1/slider_new",
          {
            lml: sessid,
            page: "",
          }
        );
        if (response?.data?.resp?.error_code === "0") {
          setSliderData(response?.data?.resp?.slider);
        } else {
          console.error("Invalid API response", response.data);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Update submenu items when tab is clicked
  const handleSubmenuClick = (event, submenuId) => {
    setSubmenuAnchorEl(event.currentTarget);

    // Find the submenu for the selected tab (by its id)
    const selectedTab = sliderData.find((item) => item.id === submenuId);

    if (selectedTab && selectedTab.sub_menu) {
      setSubmenuItems(selectedTab.sub_menu); // Set submenu items for the selected tab
    } else {
      setSubmenuItems([]); // If no submenu is found, clear submenu
    }
  };

  // Close submenu when clicking outside
  const handleCloseSubmenu = () => {
    setSubmenuAnchorEl(null); // Close the submenu
  };

  const handleSubmenuItemClick = (submenuItem) => {
    // Check if the submenu item is "Dashboard Static" and navigate
    if (submenuItem.mname === "Dashboard Static") {
    }
    handleCloseSubmenu(); // Close the submenu
  };

  return (
    <Box m={2}>
      <Box
        display={"flex"}
        justifyContent="space-between"
        position={"absolute"}
      >
        <Typography>
          <strong>KRISHNAS IPBX</strong>
        </Typography>
        <Typography>{/* <strong>User</strong> */}</Typography>
      </Box>
      <AppBar sx={{ mt: 6, backgroundColor: "#175b61" }}>
        <Toolbar>
          <Box ml={10}>
            <Tabs
              // value={activeTab}
              onChange={handleTabChange}
              indicatorColor="green"
              textColor="green"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="dynamic tabs"
            >
              {sliderData.map((item) => (
                <Tab
                  key={item.id}
                  label={item.mname}
                  onClick={(e) => handleSubmenuClick(e, item.id)} // Pass item.id to the handler
                />
              ))}
            </Tabs>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Render submenu dynamically */}
      <Menu
        anchorEl={submenuAnchorEl}
        open={Boolean(submenuAnchorEl)}
        onClose={handleCloseSubmenu}
      >
        {submenuItems.length > 0 ? (
          submenuItems.map((submenuItem) => (
            <Link
              to={`/${submenuItem.lname}`}
              style={{ textDecoration: "none", color: "#000" }}
            >
              <MenuItem
                key={submenuItem.id}
                onClick={() => handleSubmenuItemClick(submenuItem)}
              >
                {submenuItem.mname}
              </MenuItem>
            </Link>
          ))
        ) : (
          <MenuItem disabled>No sub-menu available</MenuItem>
        )}
      </Menu>

      {/* <Box p={2} m={5}>
        {sliderData[activeTab] && <AgentTable />}
      </Box> */}
    </Box>
  );
};

export default Header;
