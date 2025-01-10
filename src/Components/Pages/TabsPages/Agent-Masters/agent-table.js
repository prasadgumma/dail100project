import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CircularProgress,
  IconButton,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CustomPagination from "./customPagination";

import Cookies from "js-cookie"; // Import js-cookie
// import Header from "../../Tabs/tabs";
import { useNavigate } from "react-router-dom";
import FilterDrawer from "./add-agent-drawer";
import AddAgentDrawer from "./add-agent-drawer";
import EditAgentDrawer from "./edit-agent-drawer";
import { Snackbar, Alert } from "@mui/material";
import Header from "../../../Tabs/tabs";

const AgentTable = () => {
  const [data, setData] = useState([]);

  const [globalSelectedRows, setGlobalSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleDrawer = () => setOpenDrawer(!openDrawer);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState();
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(); // Store the row to be deleted
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25); // Default rows per page
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success", "error", "warning", or "info"
  });

  const apiurl = process.env.REACT_APP_API_URL;

  const totalRows = data?.length || 0; // Ensure data is not undefined
  const totalPages = pageSize === "All" ? 1 : Math.ceil(totalRows / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRows =
    pageSize === "All" ? data : data?.slice(startIndex, startIndex + pageSize);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handlePageSizeChange = (event) => {
    const value = event.target.value;
    setPageSize(value);
    setCurrentPage(1); // Reset to the first page
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleDelete = async () => {
    console.log(rowToDelete);
    try {
      // Call your API to delete the row
      const response = await axios.post(`${apiurl}/agent_masters_delete`, {
        lml: sessid, // Replace with session ID
        k: rowToDelete.uniq, // Unique ID of the agent to delete
      });

      if (response.status === 200) {
        // Filter out the deleted row from the state
        setSnackbar({
          open: true,
          message: "Agent Deleted successfully!",
          severity: "success",
        });

        setData((prevData) =>
          prevData.filter((item) => item.uniq !== rowToDelete.uniq)
        );
        // await fetchData();
        setOpenDeleteDialog(false); // Close the dialog
      } else {
        console.error("Error deleting row:", response.data);
      }
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const handleOpenDeleteDialog = (row) => {
    console.log(row);
    setRowToDelete(row);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setRowToDelete(null);
  };
  const handleSave = (newAgent) => {
    setData((prevData) => [
      ...prevData,
      { ...newAgent, id: prevData.length + 1 },
    ]);
  };

  const columns = [
    {
      field: "id",
      headerName: "S.No",
      headerAlign: "center",
      flex: 0.5,
      align: "center",
    },

    {
      field: "nm",
      headerName: "Agent Name",
      filterable: true,
      flex: 1,
    },
    {
      field: "agnt_unm",
      headerName: "Agent Username",
      flex: 1,
    },
    {
      field: "code",
      headerName: "Agent Code",
      flex: 1,
    },

    {
      field: "mob",
      headerName: "Mobile Number",
      flex: 1,
    },

    {
      field: "sts",
      headerName: " Status",
      flex: 1,

      renderCell: (params) => (
        <Typography
          sx={{
            textAlign: "center",
            width: 80,
            backgroundColor: params.row.sts === 1 ? "#4caf50" : "#f44336", // Green for enabled, red for disabled
            color: "white",
            padding: "2px 6px",
            borderRadius: "4px",
            display: "inline-block", // Ensures the background fits the text
          }}
        >
          {params.row.sts === 1 ? "Enabled" : "Disabled"}
        </Typography>
      ),
    },

    {
      field: "action",
      headerName: "Actions",
      flex: 1,

      renderCell: (params) => (
        <Box display={"flex"} gap={2}>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleOpenDeleteDialog(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const sessid = Cookies.get("sessid"); // Get sessid from cookies

  // Fetch data from API with pagination
  const fetchData = async (page, size) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(`${apiurl}/agent_masters_list`, {
        lml: sessid, // Replace with your actual session ID if needed
      });
      console.log(response, "Response");
      const overAllData = response?.data?.resp?.agnt_masters_list?.map(
        (trip, index) => {
          return { ...trip, id: index + 1 };
        }
      );
      const todatDate = setData(overAllData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // End loading
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const onRender = () => {
    fetchData();
  };

  const handleEdit = async (row) => {
    console.log(row, "row");
    try {
      // setLoading(true);
      const response = await axios.post(`${apiurl}/agent_masters_list`, {
        lml: sessid,
        k: row.uniq, // Get the ID of the selected agent
      });
      //alrt_contacts_list
      if (response?.status === 200) {
        const agentDetails = response.data?.resp.agnt_masters_list[0];
        setSelectedAgent(agentDetails); // Set the fetched agent details to selectedAgent state
        setOpenEditDrawer(true); // Open the EditDrawer
      } else {
        console.error("Failed to fetch agent details.");
      }
    } catch (error) {
      console.error("Error fetching agent details:", error);
    }
  };

  const total = data?.length;
  console.log(total, "total");
  return (
    <Box>
      <Header />
      <LocalizationProvider>
        <Box m={3}>
          <Grid container>
            <Grid item xs={12}>
              <Card>
                <Box mt={13}>
                  <Grid
                    container
                    spacing={2}
                    alignItems="right" // Vertically center the items
                  >
                    <Grid
                      container
                      spacing={2}
                      alignItems="center" // Vertically center the items
                      justifyContent="space-between" // This will push items to the left and right
                    >
                      <Grid
                        item
                        xs={4}
                        sx={{
                          ml: "25px",
                          mb: "15px",
                          mt: 1,
                        }}
                      >
                        <Typography
                          variant="h5"
                          color="#000"
                          align="left"
                          fontFamily={"serif"}
                          width={"50%"}
                        >
                          Agents List
                        </Typography>
                      </Grid>

                      <Grid item>
                        <Button
                          variant="contained"
                          // color="#000"
                          onClick={toggleDrawer}
                        >
                          Add New Agent
                        </Button>
                        {/* </Box> */}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      borderRadius: "1px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    {loading ? (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                      >
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Box width={"100%"}>
                        <DataGrid
                          rows={paginatedRows || []}
                          columns={columns}
                          disableSelectionOnClick={true} // Disable row selection on click
                          rowSelectionModel={globalSelectedRows}
                          loading={loading}
                          hideFooter
                          getRowHeight={() => "auto"}
                          rowCount={data?.length}
                          paginationMode="server" // Very Important Pagination
                          sx={{
                            height: "66vh",
                            width: "98vw",

                            "& .MuiDataGrid-cell": {
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            },

                            "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root":
                              {
                                color: "white",
                              },
                            "& .MuiDataGrid-columnHeader": {
                              backgroundColor: "#000",
                              color: "white",
                              maxHeight: 70,
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                              color: "white",
                            },
                            "& .MuiDataGrid-columnMenuIcon": {
                              color: "#fffff !important",
                            },
                            "& .MuiDataGrid-menu": {
                              backgroundColor: "#1976d2",
                            },
                            "& .MuiMenuItem-root": {
                              color: "white",
                            },
                            "& .MuiDataGrid-menuItem-root:hover": {
                              backgroundColor: "#1565c0",
                            },
                            "& .MuiDataGrid-sortIcon": {
                              opacity: 1,
                              color: "white",
                            },
                            "& .MuiDataGrid-menuIconButton": {
                              opacity: 1,
                              color: "white",
                            },
                            "& .MuiDataGrid-filterIcon": {
                              opacity: 1,
                              color: "white",
                            },

                            "& .MuiDataGrid-cell": {
                              borderRight: "1px solid rgba(224, 224, 224, 1)", // Add vertical lines in cells
                            },
                          }}
                        />

                        <CustomPagination
                          currentPage={currentPage}
                          totalRows={totalRows}
                          pageSize={pageSize}
                          handlePageSizeChange={handlePageSizeChange}
                          handlePreviousPage={handlePreviousPage}
                          handleNextPage={handleNextPage}
                          totalPages={totalPages}
                          data={data}
                          total={total}
                          startIndex={startIndex}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>

          <AddAgentDrawer
            openDrawer={openDrawer}
            toggleDrawer={() => setOpenDrawer(true)}
            setOpenDrawer={setOpenDrawer}
            handleSave={handleSave}
            onRender={onRender}
          />

          <EditAgentDrawer
            openDrawer={openEditDrawer}
            toggleEditDrawer={() => setOpenEditDrawer(true)} // Close the drawer
            data={selectedAgent} // Pass the selected agent details
            setOpenEditDrawer={setOpenEditDrawer}
            handleUpdateAgent={(updatedAgent) => {
              // Handle update agent after successful form submission
              console.log("Updated Agent:", updatedAgent);
              fetchData(); // Refresh the agent list
              setOpenEditDrawer(false); // Close the edit drawer
            }}
          />

          {/* <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText>
                <Typography variant="h5">
                  <strong>Are you sure ?</strong>
                </Typography>
                <Typography>Do You Want To Dlete? </Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDelete}
                color="primary"
                variant="contained"
                autoFocus
              >
                Yes
              </Button>
              <Button
                onClick={handleCloseDeleteDialog}
                color="error"
                variant="contained"
              >
                No
              </Button>
            </DialogActions>
          </Dialog> */}
          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent sx={{ padding: 3, width: 300 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  paddingBottom: 2,
                }}
              >
                <IconButton
                  // onClick={handleRemoveIconClick} // You can define this function
                  color="error"
                >
                  <HighlightOffIcon sx={{ fontSize: 45 }} />
                </IconButton>
              </Box>
              <DialogContentText sx={{ textAlign: "center" }}>
                <Typography variant="h5">
                  <strong>Are you sure?</strong>
                </Typography>
                <Typography>Do you want to delete?</Typography>
              </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ padding: 2, justifyContent: "center" }}>
              <Button
                onClick={handleDelete}
                color="primary"
                variant="contained"
                autoFocus
              >
                Yes
              </Button>
              <Button
                onClick={handleCloseDeleteDialog}
                color="error"
                variant="contained"
              >
                No
              </Button>
            </DialogActions>

            {/* Remove Icon Button at the bottom */}
          </Dialog>
        </Box>
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
      </LocalizationProvider>
    </Box>
  );
};

export default AgentTable;
