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

import CustomPagination from "./customPagination";

import Cookies from "js-cookie"; // Import js-cookie
import Header from "../../Tabs/tabs";
import { useNavigate } from "react-router-dom";
import FilterDrawer from "./add-agent-drawer";
import AddAgentDrawer from "./add-agent-drawer";
import EditAgentDrawer from "./edit-agent-drawer";

const AgentTable = () => {
  const [data, setData] = useState([]);
  const [checkedBox, setCheckedBox] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const apiurl = process.env.REACT_APP_API_URL;
  console.log(apiurl, "apiurl");

  const [globalSelectedRows, setGlobalSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleDrawer = () => setOpenDrawer(!openDrawer);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null); // Store the row to be deleted
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25); // Default rows per page

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

  const handleDelete = async () => {
    try {
      // Call your API to delete the row
      const response = await axios.post(`${apiurl}/agent_masters_delete`, {
        lml: "sessid", // Replace with session ID
        k: rowToDelete.uniq, // Unique ID of the agent to delete
      });
      if (response.status === 200) {
        // Filter out the deleted row from the state
        setData((prevData) =>
          prevData.filter((item) => item.uniq !== rowToDelete.uniq)
        );
        setOpenDeleteDialog(false); // Close the dialog
      } else {
        console.error("Error deleting row:", response.data);
      }
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const handleOpenDeleteDialog = (row) => {
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
      width: 100,
      align: "center",
    },

    {
      field: "nm",
      headerName: "Agent Name",
      filterable: true,
      width: 300,
    },
    {
      field: "exnum",
      headerName: "Agent Username",
      width: 200,
    },
    {
      field: "code",
      headerName: "Agent Code",
      width: 200,
    },

    {
      field: "mob",
      headerName: "Mobile Number",
      width: 200,
    },

    {
      field: "sts",
      headerName: " Status",
      width: 200,

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
      width: 240,

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
      const overAllData = response?.data?.resp?.alrt_contacts_list?.map(
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

  const handleEdit = async (row) => {
    try {
      setLoading(true);
      const response = await axios.post(`${apiurl}/agent_masters_list`, {
        lml: sessid,
        k: row.uniq, // Get the ID of the selected agent
      });

      if (response?.status === 200) {
        const agentDetails = response.data?.resp.alrt_contacts_list[0];
        setSelectedAgent(agentDetails); // Set the fetched agent details to selectedAgent state
        setOpenEditDrawer(true); // Open the EditDrawer
      } else {
        console.error("Failed to fetch agent details.");
      }
    } catch (error) {
      console.error("Error fetching agent details:", error);
    } finally {
      setLoading(false);
    }
  };
  // const handleRemove = () => {
  //   setDrawerOpen(false); // Close the drawer after removal
  //   setOpenDrawer(false);
  //   setOpenEditDrawer(false);
  // };

  const total = data?.length;
  console.log(total, "total");
  return (
    <Box>
      <Header />
      <LocalizationProvider>
        <Box m={3}>
          <Grid container>
            <Grid item xs={12}>
              <Card sx={{ height: 830 }}>
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
                          mt: "10px",
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
                      height: 250,
                      position: "absolute",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mt: 8,
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
                      <Box width={"100%"} mt={35}>
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
                            height: 620,
                            width: "100%",

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
            toggleDrawer={toggleDrawer}
            handleSave={handleSave}
          />

          <EditAgentDrawer
            openDrawer={openEditDrawer}
            toggleEditDrawer={() => setOpenEditDrawer(false)} // Close the drawer
            data={selectedAgent} // Pass the selected agent details
            handleUpdateAgent={(updatedAgent) => {
              // Handle update agent after successful form submission
              console.log("Updated Agent:", updatedAgent);
              fetchData(); // Refresh the agent list
              setOpenEditDrawer(false); // Close the edit drawer
            }}
          />

          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this agent? This action cannot
                be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog} color="primary">
                No
              </Button>
              <Button onClick={handleDelete} color="error" autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default AgentTable;
