// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Grid,
//   Drawer,
//   Switch,
//   FormControlLabel,
//   IconButton,
// } from "@mui/material";
// import CancelIcon from "@mui/icons-material/Cancel";
// import axios from "axios";
// import Cookies from "js-cookie"; // Import js-cookie
// import { Snackbar, Alert } from "@mui/material";

// const EditAgentDrawer = ({
//   openDrawer,
//   toggleEditDrawer,
//   data,
//   handleUpdateAgent,
//   setOpenEditDrawer,
// }) => {
//   const [formData, setFormData] = useState({
//     name: "",

//     mobileNumber: "",
//     code: "",
//     userName: "",

//     status: false,
//   });
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success", // "success", "error", "warning", or "info"
//   });
//   const apiurl = process.env.REACT_APP_API_URL;
//   const sessid = Cookies.get("sessid"); // Get sessid from cookies

//   useEffect(() => {
//     if (data) {
//       setFormData({
//         name: data.nm || "",
//         mobileNumber: data.mob || "",
//         code: data.cod || "",
//         userName: data.agnt_unm || "",
//         password: data.pswd,
//         status: data.sts === 1 ? "true" : "false" || false,
//       });
//     }
//   }, [data]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar((prev) => ({ ...prev, open: false }));
//   };

//   const handleSubmit = async () => {
//     const updatedAgent = {
//       ...formData,
//     };

//     try {
//       await axios.post(`${apiurl}/agent_masters_update`, {
//         lml: sessid,
//         k: data.uniq,
//         nm: formData.name,
//         mob: formData.mobileNumber,
//         cod: formData.code,
//         agnt_unm: formData.userName,
//         pswd: formData.password,
//         agnt_sts: 1,
//       });
//       setSnackbar({
//         open: true,
//         message: "Agent Updated successfully!",
//         severity: "success",
//       });
//       handleUpdateAgent(updatedAgent); // Pass the updated agent to the parent component
//       // toggleEditDrawer(); // Close the drawer after updating
//       setOpenEditDrawer(false);
//     } catch (error) {
//       console.error("Error updating agent:", error);
//       setSnackbar({
//         open: true,
//         message: "Please fix the errors before submitting.",
//         severity: "error",
//       });
//     }
//   };
//   console.log(data, "dataForm");
//   return (
//     <Box>
//       <Drawer
//         anchor="right"
//         open={openDrawer}
//         onClose={() => {
//           // Do nothing to prevent automatic close on outside click
//           setOpenEditDrawer(true);
//         }}
//       >
//         <Box pl={4} pr={4} mt={2} sx={{ width: 400, backgroundColor: "#fff" }}>
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <Typography variant="h5" gutterBottom>
//               <strong>Add New Agent</strong>
//             </Typography>
//             <IconButton onClick={() => setOpenEditDrawer(false)} edge="start">
//               <CancelIcon />
//             </IconButton>
//           </Box>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Mobile Number"
//                 name="mobileNumber"
//                 value={formData.mobileNumber}
//                 onChange={handleChange}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Agent Code"
//                 name="agentCode"
//                 value={formData.code}
//                 onChange={handleChange}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Username"
//                 name="userName"
//                 value={formData.userName}
//                 onChange={handleChange}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Box display="flex" alignItems="center">
//                 {/* Label for Status */}
//                 <Typography variant="body1" sx={{ marginRight: 2 }}>
//                   <strong>Status:</strong>
//                 </Typography>

//                 {/* Left-side label for Disable */}
//                 <Typography
//                   variant="body1"
//                   sx={{
//                     marginRight: 1,
//                     color: !formData.status ? "inherit" : "inherit", // Highlight when Disabled
//                     fontWeight: !formData.status ? "bold" : "normal",
//                   }}
//                 >
//                   Disable
//                 </Typography>

//                 {/* Switch for toggling the status */}
//                 <Switch
//                   checked={formData.status}
//                   onChange={() =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       status: !prev.status,
//                     }))
//                   }
//                   color="primary"
//                 />

//                 {/* Right-side label for Enable */}
//                 <Typography
//                   variant="body1"
//                   sx={{
//                     marginLeft: 1,
//                     color: formData.status ? "inherit" : "inherit", // Highlight when Enabled
//                     fontWeight: formData.status ? "bold" : "normal",
//                   }}
//                 >
//                   Enable
//                 </Typography>
//               </Box>
//             </Grid>

//             <Grid item xs={12}>
//               <Box display="flex" justifyContent="center" gap={2} mt={5}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleSubmit}
//                 >
//                   Update
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="error"
//                   onClick={() => setOpenEditDrawer(false)}
//                 >
//                   Cancel
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </Box>
//       </Drawer>
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000} // Automatically close after 6 seconds
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity}
//           variant="filled"
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default EditAgentDrawer;

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Drawer,
  Switch,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import Cookies from "js-cookie";

const EditAgentDrawer = ({
  openDrawer,
  toggleEditDrawer,
  data,
  handleUpdateAgent,
  setOpenEditDrawer,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    code: "",
    userName: "",
    password: "",
    status: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const apiurl = process.env.REACT_APP_API_URL;
  const sessid = Cookies.get("sessid");

  useEffect(() => {
    console.log("Data from backend:", data);
    if (data) {
      setFormData({
        name: data.nm || "", // Map 'nm' to 'name'
        mobileNumber: data.mob || "", // Map 'mob' to 'mobileNumber'
        code: data.code || "", // Map 'code' correctly
        userName: data.agnt_unm || "", // Map 'agnt_unm' to 'userName'
        password: data.pswd || "", // Include password
        status: data.sts === 1, // Convert 'sts' to boolean (1 -> true, 0 -> false)
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name}:`, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${apiurl}/agent_masters_update`, {
        lml: sessid, // Session ID
        k: data.uniq, // Unique identifier
        nm: formData.name, // Name
        mob: formData.mobileNumber, // Mobile Number
        cod: formData.code, // Code
        uname: formData.userName, // Username
        pswd: formData.password, // Password
        agnt_sts: formData.status ? 1 : 0, // Status as integer
      });

      setSnackbar({
        open: true,
        message: "Agent updated successfully!",
        severity: "success",
      });

      handleUpdateAgent(formData); // Notify parent
      setOpenEditDrawer(false); // Close drawer
    } catch (error) {
      console.error("Error updating agent:", error);
      setSnackbar({
        open: true,
        message: "Error updating agent. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <Box>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={toggleEditDrawer} // Ensure consistent closing
      >
        <Box pl={4} pr={4} mt={2} sx={{ width: 400, backgroundColor: "#fff" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" gutterBottom>
              <strong>Edit Agent</strong>
            </Typography>
            <IconButton onClick={() => setOpenEditDrawer(false)}>
              <CancelIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Agent Code"
                name="code" // Fixed name to match state key
                value={formData.code}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User Name"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ marginRight: 2 }}>
                  <strong>Status:</strong>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    marginRight: 1,
                    fontWeight: !formData.status ? "bold" : "normal",
                  }}
                >
                  Disable
                </Typography>
                <Switch
                  checked={formData.status}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, status: !prev.status }))
                  }
                  color="primary"
                />
                <Typography
                  variant="body1"
                  sx={{
                    marginLeft: 1,
                    fontWeight: formData.status ? "bold" : "normal",
                  }}
                >
                  Enable
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" gap={2} mt={5}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setOpenEditDrawer(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditAgentDrawer;