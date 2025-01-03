import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Drawer,
  Switch,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import { v4 as uuidv4 } from "uuid";
import { Snackbar, Alert } from "@mui/material";

const AddAgentDrawer = ({
  openDrawer,
  toggleDrawer,
  setOpenDrawer,
  onRender,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    agentCode: "",
    userName: "",
    password: "",
    confirmPassword: "",
    status: true,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success", "error", "warning", or "info"
  });

  // const [loading, setLoading] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  // const [drawerOpen, setDrawerOpen] = useState(false);

  const apiurl = process.env.REACT_APP_API_URL;

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_[\]{}|]).{8,16}$/;
      if (!passwordRegex.test(value)) {
        setPasswordError(
          "Password must contain 8 to 16 characters, at least one uppercase, one lowercase, one number, and one special character."
        );
      } else {
        setPasswordError("");
      }
    }

    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setConfirmPasswordError("Passwords do not match.");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const sessid = Cookies.get("sessid"); // Get sessid from cookies

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordError || confirmPasswordError) {
      setSnackbar({
        open: true,
        message: "Please fix the errors before submitting.",
        severity: "error",
      });
      return;
    }

    const payload = {
      lml: sessid,
      nm: formData.name,
      mob: formData.mobileNumber,
      cod: formData.agentCode,
      uname: formData.userName,
      pswd: formData.password,

      agnt_sts: formData.status, // Convert boolean to string if needed
    };
    console.log(formData, "form");
    try {
      const response = await axios.post(`${apiurl}/agent_masters_add`, payload);
      console.log(response, "AddData");
      if (response?.data?.resp?.error_code === "0") {
        setSnackbar({
          open: true,
          message: "Agent added successfully!",
          severity: "success",
        });
        // toggleDrawer(); // Close the drawer
        setOpenDrawer(false);
        setFormData({
          name: "",
          mobileNumber: "",
          agentCode: "",
          userName: "",
          password: "",
          confirmPassword: "",
          status: true,
        });

        onRender();
      } else {
        setSnackbar({
          open: true,
          message: response?.data?.resp?.message,
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error adding agent:", error);
      setSnackbar({
        open: true,
        message: "An error occurred while adding the agent.",
        severity: "error",
      });
    }
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, status: !prev.status }));
  };

  // const handleReset = () => {
  //   setFormData({
  //     name: "",
  //     mobileNumber: "",
  //     agentCode: "",
  //     userName: "",
  //     password: "",
  //     confirmPassword: "",
  //     status: false,
  //   });
  //   setPasswordError("");
  //   setConfirmPasswordError("");
  // };

  return (
    <Box>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => {
          // Do nothing to prevent automatic close on outside click
          setOpenDrawer(true);
        }}
      >
        <Box pl={4} pr={4} mt={2} sx={{ width: 400, backgroundColor: "#fff" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" gutterBottom>
              <strong>Add New Agent</strong>
            </Typography>
            <IconButton onClick={() => setOpenDrawer(false)}>
              <CancelIcon />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit}>
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
                  name="agentCode"
                  value={formData.agentCode}
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
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  error={!!confirmPasswordError}
                  helperText={confirmPasswordError}
                />
              </Grid>

              <Grid item xs={12}>
                <Box color={"red"} sx={{ fontSize: 18 }}>
                  <strong>Password Must:</strong>
                </Box>
                <Box color={"red"}>
                  Password must contain 8 to 16 characters
                </Box>
                <Box color={"red"}>
                  {" "}
                  Contain both lower and uppercase letters
                </Box>
                <Box color={"red"}>Contain 1 Number</Box>
                <Box color={"red"}>
                  Contain 1 special character like AN_@#$!-()[]|
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  {/* Left-side label */}
                  <Typography variant="body1" sx={{ marginRight: 1 }}>
                    <strong> Status:</strong>
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      marginRight: 1,
                      color: !formData.status ? "#000" : "#inherit", // Highlight when Disabled
                      fontWeight: !formData.status ? "bold" : "normal",
                    }}
                  >
                    Disable
                  </Typography>

                  {/* Switch */}
                  <Switch
                    checked={formData.status}
                    onChange={handleToggle}
                    color="primary"
                  />

                  {/* Right-side label */}
                  <Typography
                    variant="body1"
                    sx={{
                      marginLeft: 1,
                      color: formData.status ? "#000" : "inherit", // Highlight when Enabled
                      fontWeight: formData.status ? "bold" : "normal",
                    }}
                  >
                    Enable
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" gap={2} mt={5}>
                  <Button variant="contained" color="primary" type="submit">
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setOpenDrawer(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Drawer>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000} // Automatically close after 6 seconds
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

export default AddAgentDrawer;
