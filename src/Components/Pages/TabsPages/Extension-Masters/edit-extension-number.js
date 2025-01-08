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
import { Snackbar, Alert } from "@mui/material";

const EditExtensionNumber = ({
  openDrawer,
  toggleEditDrawer,
  data,
  handleUpdateAgent,
  setOpenEditDrawer,
}) => {
  const [formData, setFormData] = useState({
    extensionNumber: "",

    status: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success", "error", "warning", or "info"
  });
  const apiurl = process.env.REACT_APP_API_URL;
  const sessid = Cookies.get("sessid"); // Get sessid from cookies

  useEffect(() => {
    if (data) {
      setFormData({
        extensionNumber: data.num || "",

        // password: data.pswd,
        status: data.sts === 1 ? "true" : "false" || false,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async () => {
    const updatedAgent = {
      ...formData,
    };

    try {
      await axios.post(`${apiurl}/extension_masters_update`, {
        lml: sessid,
        k: data.uniq,

        num: formData.extensionNumber,

        sts: 1,
      });
      setSnackbar({
        open: true,
        message: "Agent Updated successfully!",
        severity: "success",
      });
      handleUpdateAgent(updatedAgent); // Pass the updated agent to the parent component
      // toggleEditDrawer(); // Close the drawer after updating
      setOpenEditDrawer(false);
    } catch (error) {
      console.error("Error updating agent:", error);
      setSnackbar({
        open: true,
        message: "Please fix the errors before submitting.",
        severity: "error",
      });
    }
  };
  console.log(data, "dataForm");
  return (
    <Box>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => {
          // Do nothing to prevent automatic close on outside click
          setOpenEditDrawer(true);
        }}
      >
        <Box pl={4} pr={4} mt={2} sx={{ width: 400, backgroundColor: "#fff" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" gutterBottom>
              <strong>Add Extension Number</strong>
            </Typography>
            <IconButton onClick={() => setOpenEditDrawer(false)} edge="start">
              <CancelIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Extension Number"
                name="extensionNumber"
                value={formData.extensionNumber}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                {/* Label for Status */}
                <Typography variant="body1" sx={{ marginRight: 2 }}>
                  <strong>Status:</strong>
                </Typography>

                {/* Left-side label for Disable */}
                <Typography
                  variant="body1"
                  sx={{
                    marginRight: 1,
                    color: !formData.status ? "inherit" : "inherit", // Highlight when Disabled
                    fontWeight: !formData.status ? "bold" : "normal",
                  }}
                >
                  Disable
                </Typography>

                {/* Switch for toggling the status */}
                <Switch
                  checked={formData.status}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      status: !prev.status,
                    }))
                  }
                  color="primary"
                />

                {/* Right-side label for Enable */}
                <Typography
                  variant="body1"
                  sx={{
                    marginLeft: 1,
                    color: formData.status ? "inherit" : "inherit", // Highlight when Enabled
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

export default EditExtensionNumber;
