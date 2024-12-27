import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Box,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import axios from "axios";

import Cookies from "js-cookie"; // Import js-cookie

// const data = [
//   {
//     0: {
//       id: 53,
//       mname: "Campaign Create",
//       lname: "campaign_create_v1",
//       icon: "a fa-create",
//     },
//     1: {
//       id: 21,
//       mname: "Campaign Report",
//       lname: "campaign_report",
//       icon: "fa",
//     },
//     slider: [
//       {
//         cnt: 2,
//         id: 69,
//         lid: "6036729b59327",
//         parent: "0",
//         path: "#",
//         mname: "Survey NEW",
//         lname: "#",
//         sts: 1,
//         icon: "#",
//         ord: 1,
//         sub_menu: [
//           {
//             id: 71,
//             mname: "Survey Report",
//             lname: "fb-cmp-sur-rpt",
//             icon: "#",
//           },
//           {
//             id: 70,
//             mname: "Upload Data",
//             lname: "Upload-Data",
//             icon: "#",
//           },
//         ],
//       },
//       {
//         cnt: 3,
//         id: 38,
//         lid: "5d382d349486e",
//         parent: "0",
//         path: "#",
//         mname: "Accounts",
//         lname: "#",
//         sts: 1,
//         icon: "#",
//         ord: 0,
//         sub_menu: [
//           {
//             id: 30,
//             mname: "My Balances",
//             lname: "mybalance",
//             icon: "#",
//           },
//           {
//             id: 20,
//             mname: "My Recharges",
//             lname: "my_recharges",
//             icon: "f",
//           },
//           {
//             id: 40,
//             mname: "Statement",
//             lname: "credits_statement",
//             icon: "#",
//           },
//         ],
//       },
//       {
//         cnt: 3,
//         id: 36,
//         lid: "5d382c626562d",
//         parent: "0",
//         path: "#",
//         mname: "Content Management",
//         lname: "#",
//         sts: 1,
//         icon: "#",
//         ord: 0,
//         sub_menu: [
//           {
//             id: 17,
//             mname: "Audio list",
//             lname: "audio_list",
//             icon: "d",
//           },
//           {
//             id: 19,
//             mname: "Contact List",
//             lname: "contact_list",
//             icon: "fa ",
//           },
//           {
//             id: 16,
//             mname: "Webhook List",
//             lname: "vf_whook_list",
//             icon: "a",
//           },
//         ],
//       },
//       {
//         cnt: 4,
//         id: 64,
//         lid: "5e634687ba285",
//         parent: "0",
//         path: "#",
//         mname: "D100 Feedback",
//         lname: "#",
//         sts: 1,
//         icon: "fa fa-file-text-o",
//         ord: 0,
//         sub_menu: [
//           {
//             id: 55,
//             mname: "D100 Feedback Report",
//             lname: "Excel_Campaign_Report",
//             icon: "i",
//           },
//           {
//             id: 68,
//             mname: "Day Summary",
//             lname: "d100-report1",
//             icon: "#",
//           },
//           {
//             id: 62,
//             mname: "Feedback Statistics",
//             lname: "cal_stats",
//             icon: "icon-basket-loaded",
//           },
//           {
//             id: 56,
//             mname: "Upload",
//             lname: "Excel_Campaigns",
//             icon: "i",
//           },
//         ],
//       },
//       {
//         cnt: 0,
//         id: 22,
//         lid: "5d25d87daec6f",
//         parent: "0",
//         path: "voice_dashboard.php",
//         mname: "Dashboard",
//         lname: "voice_dashboard",
//         sts: 1,
//         icon: "f",
//         ord: 0,
//         sub_menu: [],
//       },
//       {
//         cnt: 3,
//         id: 37,
//         lid: "5d382ce180267",
//         parent: "0",
//         path: "#",
//         mname: "Manage",
//         lname: "#",
//         sts: 1,
//         icon: "#",
//         ord: 0,
//         sub_menu: [
//           {
//             id: 15,
//             mname: "Apis Key List",
//             lname: "api_key_list",
//             icon: "s",
//           },
//           {
//             id: 61,
//             mname: "Downloads",
//             lname: "down_docs",
//             icon: "icon-basket-loaded",
//           },
//           {
//             id: 34,
//             mname: "Profile",
//             lname: "my_profile_edit",
//             icon: "#",
//           },
//         ],
//       },
//       {
//         cnt: 2,
//         id: 65,
//         lid: "5fcdfa087646b",
//         parent: "0",
//         path: "#",
//         mname: "Survey",
//         lname: "#",
//         sts: 1,
//         icon: "#",
//         ord: 0,
//         sub_menu: [
//           {
//             id: 66,
//             mname: "Manage Survey",
//             lname: "manage-survey",
//             icon: "#",
//           },
//           {
//             id: 67,
//             mname: "Survey Report",
//             lname: "survey-report",
//             icon: "#",
//           },
//         ],
//       },
//       {
//         cnt: 0,
//         id: 54,
//         lid: "5e3c07d948473",
//         parent: "0",
//         path: "vc_dashboard.php",
//         mname: "VC Dashboard",
//         lname: "vc_dash",
//         sts: 1,
//         icon: "fa fa-file-text-o",
//         ord: 0,
//         sub_menu: [],
//       },
//       {
//         cnt: 2,
//         id: 63,
//         lid: "5e63464752c1c",
//         parent: "0",
//         path: "#",
//         mname: "Voice Campaigns",
//         lname: "#",
//         sts: 1,
//         icon: "icon-basket-loaded",
//         ord: 0,
//         sub_menu: [
//           {
//             id: 53,
//             mname: "Campaign Create",
//             lname: "campaign_create_v1",
//             icon: "a fa-create",
//           },
//           {
//             id: 21,
//             mname: "Campaign Report",
//             lname: "campaign_report",
//             icon: "fa",
//           },
//         ],
//       },
//     ],
//   },
// ];

const TabsComponent = () => {
  const [sliderData, setSliderData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null); // For handling submenu
  const [submenuItems, setSubmenuItems] = useState();
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
        console.log(response, "Tres");
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
  const handleSubmenuClick = (event, submenu) => {
    // Display submenu when tab is clicked
    setSubmenuAnchorEl(event.currentTarget);
    setSubmenuItems(sliderData[0]?.sub_menu);
  };

  const handleCloseSubmenu = () => {
    setSubmenuAnchorEl(null); // Close the submenu when clicking outside
  };
  console.log(sliderData[0]?.sub_menu);
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          {/* <Typography variant="h6">MyApp</Typography> */}
          <Box ml={5}>
            {/* Render tabs dynamically */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="green"
              textColor="green"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="dynamic tabs"
            >
              {sliderData.map((item, index) => (
                <Tab
                  key={item.id}
                  label={item.mname}
                  onClick={handleSubmenuClick}
                />
              ))}
            </Tabs>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={submenuAnchorEl}
        open={Boolean(submenuAnchorEl)}
        onClose={handleCloseSubmenu}
      >
        {sliderData[0]?.sub_menu &&
          sliderData[0]?.sub_menu.map((submenuItem) => (
            <MenuItem key={submenuItem.id} onClick={handleCloseSubmenu}>
              {submenuItem.mname}
            </MenuItem>
          ))}
      </Menu>

      {/* Render content for the active tab */}
      {/* <Box p={2}>
        {sliderData[activeTab] && (
          <Typography variant="body1">
            You selected: {sliderData[activeTab].mname}
          </Typography>
        )}
      </Box> */}
    </Box>
  );
};

export default TabsComponent;

// import React, { useEffect, useState } from "react";
// import { AppBar, Toolbar, Tabs, Tab, Box, Typography } from "@mui/material";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import Cookies from "js-cookie"; // Import js-cookie

// const TabsComponent = () => {
//   const [sliderData, setSliderData] = useState([]);
//   const [activeTab, setActiveTab] = useState(0);

//   const sessid = Cookies.get("sessid"); // Get sessid from cookies

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.post(
//           "http://192.168.21.71/devenv/d100_ipbx_ajax_apis/public/index.php/v1/slider_new",
//           {
//             lml: sessid,
//             page: "",
//           }
//         );
//         console.log(response, "Tres");
//         if (response?.data && response?.data.slider) {
//           setSliderData(response?.data?.slider);
//         } else {
//           console.error("Invalid API response", response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching data", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//   };

//   return (
//     <Box>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6">MyApp</Typography>
//           <Box sx={{ bgcolor: "background.paper" }} ml={5}>
//             <Tabs
//               value={activeTab}
//               onChange={handleTabChange}
//               indicatorColor="primary"
//               textColor="primary"
//               variant="scrollable"
//               scrollButtons="auto"
//               aria-label="dynamic tabs"
//             >
//               {sliderData.map((item, index) => (
//                 <Tab key={item.id} label={item.mname} />
//               ))}
//             </Tabs>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Render content for the active tab */}
//       <Box p={2}>
//         {sliderData[activeTab] && (
//           <Typography variant="body1">
//             You selected: {sliderData[activeTab].mname}
//           </Typography>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default TabsComponent;
