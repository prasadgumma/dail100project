import React, { useEffect, useState } from "react";
import {
  TextField,
  Grid,
  Typography,
  Box,
  Button,
  Switch,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel"; // Import Cancel Icon
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie

const AddNewAgent = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    agentCode: "",
    userName: "",
    password: "",
    confirmPassword: "",
    status: false,
  });
  const apiurl = process.env.REACT_APP_API_URL;

  const [loading, setLoading] = useState(true);

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

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

  // const fetchData = async (page, size) => {
  //   setLoading(true); // Start loading
  //   try {
  //     const response = await axios.post(`${apiurl}/agent_masters_add`, {
  //       lml: sessid, // Replace with your actual session ID if needed
  //     });
  //     console.log(response, "Response");
  //     const overAllData = response?.data?.resp?.alrt_contacts_list?.map(
  //       (trip, index) => {
  //         return { ...trip, id: index + 1 };
  //       }
  //     );
  //     // const todatDate = setData(overAllData);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false); // End loading
  //   }
  // };
  // useEffect(() => {
  //   fetchData();
  // }, []);

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(`${apiurl}/agent_masters_add`, {
        lml: sessid, // Replace with your actual session ID if needed
      });
      console.log(response, "Response");
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, status: !prev.status }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordError || confirmPasswordError) {
      alert("Please fix the errors before submitting.");
      return;
    }
    console.log("Form Data Submitted:", formData);
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
    // <Box
    //   p={4}
    //   sx={{ maxWidth: 600, margin: "0 auto", backgroundColor: "#fff" }}
    // >
    //   <Typography variant="h6" gutterBottom>
    //     Add New Agent
    //   </Typography>
    //   <form onSubmit={handleSubmit}>
    //     <Grid container spacing={2}>
    //       <Grid item xs={12}>
    //         <TextField
    //           fullWidth
    //           label="Name"
    //           name="name"
    //           value={formData.name}
    //           onChange={handleChange}
    //           required
    //         />
    //       </Grid>
    //       <Grid item xs={12}>
    //         <TextField
    //           fullWidth
    //           label="Mobile Number"
    //           name="mobileNumber"
    //           value={formData.mobileNumber}
    //           onChange={handleChange}
    //           required
    //         />
    //       </Grid>
    //       <Grid item xs={12}>
    //         <TextField
    //           fullWidth
    //           label="Agent Code"
    //           name="agentCode"
    //           value={formData.agentCode}
    //           onChange={handleChange}
    //           required
    //         />
    //       </Grid>
    //       <Grid item xs={12}>
    //         <TextField
    //           fullWidth
    //           label="User Name"
    //           name="userName"
    //           value={formData.userName}
    //           onChange={handleChange}
    //           required
    //         />
    //       </Grid>
    //       <Grid item xs={12}>
    //         <TextField
    //           fullWidth
    //           label="Password"
    //           name="password"
    //           type="password"
    //           value={formData.password}
    //           onChange={handleChange}
    //           required
    //           error={!!passwordError}
    //           helperText={passwordError}
    //         />
    //       </Grid>
    //       <Grid item xs={12}>
    //         <TextField
    //           fullWidth
    //           label="Confirm Password"
    //           name="confirmPassword"
    //           type="password"
    //           value={formData.confirmPassword}
    //           onChange={handleChange}
    //           required
    //           error={!!confirmPasswordError}
    //           helperText={
    //             confirmPasswordError && (
    //               <Typography color="error">{confirmPasswordError}</Typography>
    //             )
    //           }
    //         />
    //       </Grid>
    //       <Grid item xs={12}>
    //         <Box color={"red"} sx={{ fontSize: 20 }}>
    //           <strong>Password Must:</strong>
    //         </Box>
    //         <Box color={"red"}>Password must contain 8 to 16 characters,</Box>
    //         <Box color={"red"}> at least one uppercase,</Box>
    //         <Box color={"red"}>one lowercase,</Box>
    //         <Box color={"red"}>one number, and one special character.</Box>
    //       </Grid>
    //       <Grid item xs={12}>
    //         <FormControlLabel
    //           control={
    //             <Switch
    //               checked={formData.status}
    //               onChange={handleToggle}
    //               color="primary"
    //             />
    //           }
    //           label={`Status: ${formData.status ? "Enable" : "Disable"}`}
    //         />
    //       </Grid>
    //       <Grid item xs={12}>
    //         <Box display="flex" justifyContent="space-between">
    //           <Button variant="contained" color="primary" type="submit">
    //             Save
    //           </Button>
    //           <Button
    //             variant="outlined"
    //             color="secondary"
    //             onClick={handleReset}
    //           >
    //             Close
    //           </Button>
    //         </Box>
    //       </Grid>
    //     </Grid>
    //   </form>
    // </Box>

    <Box
      p={4}
      sx={{ maxWidth: 600, margin: "0 auto", backgroundColor: "#fff" }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          Add New Agent
        </Typography>
        {/* <IconButton onClick={onClose}>
          <CancelIcon />
        </IconButton> */}
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
            <Box display="flex" justifyContent="space-between">
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleReset}
              >
                Close
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddNewAgent;
