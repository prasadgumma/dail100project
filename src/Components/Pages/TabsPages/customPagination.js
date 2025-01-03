import React from "react";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const CustomPagination = ({
  currentPage,
  totalRows,
  startRow,
  endRow,
  startIndex,
  pageSize,
  handlePageSizeChange,
  handlePreviousPage,
  handleNextPage,
  totalPages,
  total,
}) => {
  console.log(total, "total");
  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      gap={3}
      m={1.5}
    >
      {/* Page Size Selector */}
      <Select
        value={pageSize}
        onChange={handlePageSizeChange}
        size="small"
        variant="outlined"
        sx={{ height: 35 }}
      >
        <MenuItem value={25}>25</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        <MenuItem value={100}>100</MenuItem>
        <MenuItem value="All">All</MenuItem>
      </Select>

      {/* Pagination Info */}
      <Box>
        {pageSize === "All"
          ? `1-${totalRows} of ${totalRows}` // Show all rows
          : `${startIndex + 1}-${Math.min(
              startIndex + pageSize,
              totalRows
            )} of ${totalRows}`}
      </Box>

      {/* Pagination Controls */}
      {pageSize !== "All" && (
        <Box>
          {" "}
          <IconButton
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            sx={{ padding: "4px", fontSize: "20px" }}
          >
            <ArrowBackIosIcon sx={{ fontSize: "18px" }} />
          </IconButton>
          <IconButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            sx={{ padding: "4px", fontSize: "20px" }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default CustomPagination;
