import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Grid,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Container } from "@mui/system";
import styles from "./Login.module.css"; // Import the CSS module
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js"; // Import CryptoJS for hashing
import { v4 as uuidv4 } from "uuid"; // Import uuidv4
import Cookies from "js-cookie"; // Import js-cookie

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [extensionNumber, setExtensionNumber] = useState("");
  const [shiftType, setShiftType] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    extensionNumber: "",
    shiftType: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    let newErrors = {
      email: "",
      password: "",
      // extensionNumber: "",
      // shiftType: "",
    };

    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/;
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    } else if (email.length <= 9 || email.length >= 30) {
      newErrors.email = "Email must be between 9 and 30 characters";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length <= 6 || password.length >= 16) {
      newErrors.password = "Password must be between 6 and 16 characters";
      isValid = false;
    }

    // Extension number validation
    // if (!extensionNumber) {
    //   newErrors.extensionNumber = "Extension number is required";
    //   isValid = false;
    // } else if (!/^\d+$/.test(extensionNumber)) {
    //   newErrors.extensionNumber = "Extension number must be digits only";
    //   isValid = false;
    // }

    // // Shift type validation
    // if (!shiftType) {
    //   newErrors.shiftType = "Please select a shift type";
    //   isValid = false;
    // }

    setErrors(newErrors);
    if (isValid) {
      const hashedPassword = CryptoJS.MD5(password).toString();
      const sessid = uuidv4();
      const apiPayload = {
        username: "madhavan@krishnasoft.in",
        password: hashedPassword,
        sessid: sessid,
        extn_num: "",
        shift_id: shiftType === "Shift 1" ? "1" : "2", // Map shift to API shift_id
      };
      // const data = fetch()

      axios
        .post(
          "http://192.168.21.71/devenv/d100_ipbx_ajax_apis/public/index.php/v1/checkauth",
          apiPayload
        )
        .then((response) => {
          console.log(response, "respo");
          Cookies.set("sessid", sessid, { expires: 7, path: "/" });
          if (response?.data?.resp?.error_code === "0") {
            navigate("/tabs");
            setSnackbarMessage("Login successful!");
            setSnackbarSeverity("success");
          } else {
            setSnackbarMessage(response?.data?.message || "Login failed.");
            setSnackbarSeverity("error");
          }
          setSnackbarOpen(true);
        })
        .catch((error) => {
          console.error("API Error:", error);
          setSnackbarMessage("An error occurred while logging in.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        });
    } else {
      setSnackbarMessage("Please fix the errors in the Login.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box className={styles.container}>
      <Container maxWidth="sm" className={styles.formWrapper}>
        <Box className={styles.formBox}>
          <Typography variant="h5" className={styles.title} gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} direction="column">
              {/* Email */}
              <Grid item>
                <TextField
                  className={styles.textfieldbackground}
                  fullWidth
                  label="Email"
                  size="small"
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 42, // Adjust height
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black", // Default border color
                      },
                      "&:hover fieldset": {
                        borderColor: "green", // Border color on hover
                        borderRadius: "10px",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffff", // Border color when focused
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "black", // Default label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "white", // Label color when focused
                    },
                  }}
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>

              {/* Password */}
              <Grid item>
                <TextField
                  fullWidth
                  className={styles.textfieldbackground}
                  label="Password"
                  type="password"
                  size="small"
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 42, // Adjust height
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black", // Default border color
                      },
                      "&:hover fieldset": {
                        borderColor: "green", // Border color on hover
                        borderRadius: "10px",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffff", // Border color when focused
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "black", // Default label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "white", // Label color when focused
                    },
                  }}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>

              {/* Extension Number */}
              <Grid item>
                <TextField
                  className={styles.textfieldbackground2}
                  fullWidth
                  label="Extension Number"
                  type="text"
                  //   variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 42, // Adjust height
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black", // Default border color
                      },
                      "&:hover fieldset": {
                        borderColor: "green", // Border color on hover
                        borderRadius: "10px",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffff", // Border color when focused
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "black", // Default label color
                      mb: 20,
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "white", // Label color when focused
                    },
                  }}
                  value={extensionNumber}
                  onChange={(e) => setExtensionNumber(e.target.value)}
                  error={!!errors.extensionNumber}
                  helperText={errors.extensionNumber}
                />
              </Grid>

              {/* Shift Type */}
              <Grid item>
                <FormControl
                  size="small"
                  fullWidth
                  error={!!errors.shiftType}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 42, // Adjust height
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black", // Default border color
                      },
                      "&:hover fieldset": {
                        borderColor: "green", // Border color on hover
                        borderRadius: "10px",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffff", // Border color when focused
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "black", // Default label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "white", // Label color when focused
                    },
                  }}
                >
                  <InputLabel>Shift Type</InputLabel>
                  <Select
                    size="small"
                    className={styles.textfieldbackground2}
                    value={shiftType}
                    onChange={(e) => setShiftType(e.target.value)}
                    label="Shift Type"
                  >
                    <MenuItem value="Shift 1">Day Shift </MenuItem>
                    <MenuItem value="Shift 2">Night Shift</MenuItem>
                  </Select>
                  {errors.shiftType && (
                    <Typography className={styles.errorText} variant="body2">
                      {errors.shiftType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Submit Button */}
              <Grid item>
                <Button
                  fullWidth
                  variant="contained"
                  className={styles.submitButton}
                  type="submit"
                  sx={{
                    backgroundColor: "#24c1c9",
                    color: "#ffff",
                    textTransform: "none",
                  }}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              anchorOrigin={{
                vertical: "top", // Set to top
                horizontal: "right", // Set to right
              }}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity={snackbarSeverity}
                sx={{ width: "100%" }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </form>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;
