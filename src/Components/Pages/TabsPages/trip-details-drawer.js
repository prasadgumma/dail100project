import React from "react";
import { Box, Drawer, Typography, Button } from "@mui/material";
import FormComponent from "./form-component";
import CancelIcon from "@mui/icons-material/Cancel";

const TripDetailsDrawer = ({
  open,
  onClose,
  tripId,
  setDrawerOpen,
  onRemove,
}) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box p={2} width={500}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Trip Details</Typography>
          <CancelIcon
            sx={{ cursor: "pointer", height: 70, width: 35 }}
            variant="contained"
            color="#000"
            onClick={onRemove} // Trigger remove functionality
            // startIcon={<CancelIcon />}
          />
        </Box>
        <Box mt={2}>
          {tripId ? (
            <>
              <Typography>Trip ID: {tripId}</Typography>
              <FormComponent setDrawerOpen={setDrawerOpen} />
            </>
          ) : (
            <Typography>No Trip Selected</Typography>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default TripDetailsDrawer;
