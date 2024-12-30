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

const AddAgentDrawer = ({ openDrawer, toggleDrawer, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    agentCode: "",
    userName: "",
    password: "",
    confirmPassword: "",
    status: false,
  });

  const [loading, setLoading] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const apiurl = process.env.REACT_APP_API_URL;

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
      alert("Please fix the errors before submitting.");
      return;
    }

    const payload = {
      lml: sessid,
      nm: formData.name,
      mob: formData.mobileNumber,
      cod: formData.agentCode,
      uname: formData.userName,
      pswd: formData.password,
      // uniq: data.uniq,
      sts: formData.status, // Convert boolean to string if needed
    };

    try {
      const response = await axios.post(`${apiurl}/agent_masters_add`, payload);
      console.log(response, "AddData");
      if (response?.status === 200) {
        alert("Agent added successfully!");
        toggleDrawer(); // Close the drawer
        setFormData([]);
      } else {
        alert("Failed to add agent. Please try again.");
      }
    } catch (error) {
      console.error("Error adding agent:", error);
      alert("An error occurred while adding the agent.");
    }
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, status: !prev.status }));
  };

  const handleReset = () => {
    setFormData({
      name: "",
      mobileNumber: "",
      agentCode: "",
      userName: "",
      password: "",
      confirmPassword: "",
      status: false,
    });
    setPasswordError("");
    setConfirmPasswordError("");
  };

  return (
    <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
      <Box p={4} sx={{ width: 400, backgroundColor: "#fff" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" gutterBottom>
            Add New Agent
          </Typography>
          <IconButton onClick={toggleDrawer}>
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
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Agent Code"
                name="agentCode"
                value={formData.agentCode}
                onChange={handleChange}
                required
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
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status}
                    onChange={handleToggle}
                    color="primary"
                  />
                }
                label={`Status: ${formData.status ? "Enable" : "Disable"}`}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" gap={2} mt={5}>
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
                <Button variant="contained" color="error" onClick={handleReset}>
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Drawer>
  );
};

export default AddAgentDrawer;
