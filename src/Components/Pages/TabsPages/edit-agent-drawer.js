import React, { useState, useEffect } from "react";
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

const EditAgentDrawer = ({
  openDrawer,
  toggleEditDrawer,
  data,
  handleUpdateAgent,
}) => {
  const [formData, setFormData] = useState({
    name: "",

    mobileNumber: "",
    code: "",
    userName: "",
    password: "",
    status: false,
  });

  const apiurl = process.env.REACT_APP_API_URL;
  const sessid = Cookies.get("sessid"); // Get sessid from cookies

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.nm || "",
        mobileNumber: data.mob || "",
        code: data.code || "",
        userName: data.exnum || "",
        password: data.pswd,
        status: data.sts === 1 ? "true" : "false" || false,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const updatedAgent = {
      ...formData,
    };

    try {
      await axios.post(`${apiurl}/agent_masters_update`, {
        lml: sessid,
        k: data.uniq,
        nm: formData.name,
        mob: formData.mobileNumber,
        cod: formData.agentCode,
        uname: formData.userName,
        pswd: formData.password,
        sts: 1,
      });

      handleUpdateAgent(updatedAgent); // Pass the updated agent to the parent component
      toggleEditDrawer(); // Close the drawer after updating
    } catch (error) {
      console.error("Error updating agent:", error);
    }
  };
  console.log(data, "dataForm");
  return (
    <Drawer anchor="right" open={openDrawer} onClose={toggleEditDrawer}>
      <Box p={3} width={400}>
        <IconButton onClick={toggleEditDrawer} edge="start">
          <CancelIcon />
        </IconButton>
        <Typography variant="h6" gutterBottom>
          Edit Agent
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Agent Code"
              name="agentCode"
              value={formData.code}
              onChange={handleChange}
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
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, status: !prev.status }))
                  }
                />
              }
              label="Status"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Update
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default EditAgentDrawer;
