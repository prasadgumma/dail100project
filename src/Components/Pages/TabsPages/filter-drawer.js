import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Drawer,
} from "@mui/material";
import DateRangeFilter from "./date-range-filter";
import CancelIcon from "@mui/icons-material/Cancel";

const FilterDrawer = (props) => {
  const {
    openDrawer,
    toggleDrawer,
    dateFilter,
    setDateFilter,
    applyHandler,
    sendCheckedDate,
    sendStatus,
    sendSearchType,
    sendSearchText,
    onRemove,
  } = props;
  const [status, setStatus] = useState("1");
  const [searchType, setSearchType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [checkDate, setCheckDate] = useState("2");
  const [dateRange, setDateRange] = useState(["", ""]);
  // console.log(dateFilter, "dateFilter");
  const handleChangeStatus = (event) => {
    const Value = event.target.value;
    setStatus(Value);
    sendStatus(Value);
  };

  const handleChangeSearchType = (event) => {
    const Value = event.target.value;
    setSearchType(Value);
    sendSearchType(Value);
    setSearchText("");
  };
  const handleChangeDate = (event) => {
    const Value = event.target.value;
    setCheckDate(Value);
    sendCheckedDate(Value);
  };
  const handleSearchChange = (event) => {
    const Value = event.target.value;

    if (searchType === "1") {
      // Restrict to numbers only and limit to 10 digits for Phone Number
      if (/^\d*$/.test(Value) && Value.length <= 10) {
        console.log(Value, "SearchValue");
        setSearchText(Value);
        sendSearchText(Value);
      }
    } else {
      // Allow any value for other search types
      setSearchText(Value);
      sendSearchText(Value);
    }
  };

  return (
    <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
      <Box p={2} width="580px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="textPrimary" mb={2}>
            My Filters
          </Typography>
          <CancelIcon
            sx={{ cursor: "pointer", mr: 1, height: 70, width: 35 }}
            variant="contained"
            color="#000"
            onClick={onRemove} // Trigger remove functionality
            // startIcon={<CancelIcon />}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DateRangeFilter
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                value={status}
                label="Status"
                onChange={handleChangeStatus}
              >
                <MenuItem value="-1">Any</MenuItem>
                <MenuItem value="1">Started</MenuItem>
                <MenuItem value="2">End</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Check Date</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                value={checkDate}
                label="Check Date"
                onChange={handleChangeDate}
              >
                <MenuItem value="1">Yes</MenuItem>
                <MenuItem value="2">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="search-select-label">Search Type</InputLabel>
              <Select
                labelId="search-select-label"
                id="search-select"
                value={searchType}
                label="Search Type"
                onChange={handleChangeSearchType}
              >
                <MenuItem value="">Select Type</MenuItem>
                <MenuItem value="1">Phone Number</MenuItem>
                <MenuItem value="2">Trip ID</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchText}
              onChange={handleSearchChange}
              // placeholder="Type to search..."
              placeholder={
                searchType === "1"
                  ? "Enter Phone Number (10 digits)"
                  : searchType === "2"
                  ? "Enter Trip ID"
                  : "Select Search Type"
              }
              disabled={searchType === ""}
              inputProps={{
                maxLength: searchType === "1" ? 10 : undefined, // Apply max length for Phone Number
              }}
            />
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={applyHandler}
              sx={{ width: "40%" }}
            >
              Show
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default FilterDrawer;
