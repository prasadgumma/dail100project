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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import CustomPagination from "./customPagination";

import Cookies from "js-cookie"; // Import js-cookie
import Header from "../../Tabs/tabs";

const AgentTable = () => {
  const [data, setData] = useState([]);
  const [checkedBox, setCheckedBox] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [globalSelectedRows, setGlobalSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleDrawer = () => setOpenDrawer(!openDrawer);
  const [status, setStatus] = useState("1");
  const [searchType, setSearchType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [checkDate, setCheckDate] = useState("2");
  const [dateFilter, setDateFilter] = useState(["", ""]);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

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

  const handleEdit = (row) => {
    console.log("Edit clicked for:", row);
    // Add your logic to edit the row here
  };

  const handleDelete = (row) => {
    console.log("Delete clicked for:", row);
    // Add your logic to delete the row here
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
      width: 220,

      renderCell: (params) => (
        <Box display={"flex"} gap={2}>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row)}>
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
      const response = await axios.post(
        "http://192.168.21.71/devenv/d100_ipbx_ajax_apis/public/index.php/v1/agent_masters_list",
        {
          lml: sessid, // Replace with your actual session ID if needed
        }
      );
      console.log(response, "Response");
      const overAllData = response?.data?.resp?.alrt_contacts_list?.map(
        (trip, index) => {
          return { ...trip, id: index + 1 };
        }
      );
      const todatDate = setData(overAllData);
      // Assuming the response contains the actual rows and the total number of rows
      // setData(response?.data?.resp?.alrt_contacts_list); // Update data with the response
      // setTotalRows(response.total); // Set total number of rows for pagination
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // End loading
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // const applyHandler = async () => {
  //   console.log(`${dateFilter[0]} ${dateFilter[1]}`);
  //   console.log(searchText, searchType, "searchType");
  //   if (searchType !== 1 || searchType !== 2) {
  //     setSearchText("");
  //   }
  //   try {
  //     setLoading(true);
  //     const response = await axios.post(
  //       "http://192.168.21.71/devenv/d100_ipbx_ajax_apis/public/index.php/v1/agent_masters_list",
  //       {
  //         lml: sessid,
  //         page: "",
  //       }
  //     );
  //     console.log(response, "responce");
  //     const overAllData = response?.data?.resp?.trips_list?.map(
  //       (trip, index) => {
  //         return { ...trip, id: index + 1 };
  //       }
  //     );
  //     console.log(overAllData, "overAll");

  //     setOpenDrawer(false);
  //     setData(overAllData);
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 1000);
  //   } catch (error) {
  //     console.error("Error fetching members:", error);
  //   }
  // };

  // const handleTripIdClick = (tripId) => {
  //   setSelectedTripId(tripId);
  //   setDrawerOpen(true);
  // };

  // Export to CSV function
  const exportToCSV = () => {
    const headers =
      columns
        .filter((col) => !col.hide)
        .map((col) => col.headerName)
        .join(",") + "\n";

    const rows = data
      .map((row) =>
        columns
          .filter((col) => !col.hide)
          .map((col) => row[col.field] || "")
          .join(",")
      )
      .join("\n");

    const csvContent = headers + rows;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "members_list.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRemove = () => {
    setDrawerOpen(false); // Close the drawer after removal
    setOpenDrawer(false);
  };

  // const showThebottomButtons = globalSelectedRows.length > 0;
  const total = data?.length;
  console.log(total, "total");
  return (
    <Box>
      <Header />
      <LocalizationProvider>
        <Box ml={3}>
          <Grid container>
            <Grid item xs={12}>
              <Card sx={{ height: 800 }}>
                <Box m={2.5}>
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
                      <Grid item xs={4} sx={{ ml: "25px", mt: "16px" }}>
                        <Typography
                          variant="h5"
                          color="#000"
                          align="left"
                          fontFamily={"serif"}
                          width={"50%"}
                        >
                          Trip List Reports
                        </Typography>
                      </Grid>

                      <Grid item>
                        <Box display="flex" alignItems="center" gap={2} m={2}>
                          <Button
                            variant="outlined"
                            color="#000"
                            onClick={exportToCSV}
                          >
                            Export to CSV
                          </Button>

                          <Button
                            variant="outlined"
                            color="#000"
                            onClick={toggleDrawer}
                          >
                            My Filters
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      height: 250,
                      position: "relative",
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

          {/* Drawer Component */}
          {/* <FilterDrawer
          openDrawer={openDrawer}
          toggleDrawer={toggleDrawer}
          data={data}
          applyHandler={applyHandler}
          setData={setData}
          sendStatus={sendStatus}
          sendSearchType={sendSearchType}
          sendCheckedDate={sendCheckedDate}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          sendSearchText={sendSearchText}
          sendDateRange={sendDateRange}
          onRemove={handleRemove}
        /> */}
          {/* <TripDetailsDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          // onClose={toggleDrawer1}
          tripId={selectedTripId}
          setDrawerOpen={setDrawerOpen}
          onRemove={handleRemove}
        /> */}
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default AgentTable;

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Grid,
//   Card,
//   Button,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import axios from "axios";
// import CustomPagination from "./customPagination";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import Cookies from "js-cookie"; // Import js-cookie

// const TripListReports = () => {
//   const [data, setData] = useState([]); // Data from API
//   const [loading, setLoading] = useState(false); // Loading state for the data fetch
//   const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
//   const [pageSize, setPageSize] = useState(10); // Rows per page
//   const [totalRows, setTotalRows] = useState(0); // Total rows from the API response
//   const [globalSelectedRows, setGlobalSelectedRows] = useState([]); // Tracking selected rows

//   // const columns = [
//   //   { field: "id", headerName: "ID", width: 90 },
//   //   { field: "name", headerName: "Name", width: 200 },
//   //   { field: "status", headerName: "Status", width: 150 },
//   //   // Add more columns as needed
//   // ];

//   const columns = [
//     {
//       field: "id",
//       headerName: "S.No",
//       headerAlign: "center",
//       width: 100,
//       align: "center",
//     },

//     {
//       field: "nm",
//       headerName: "Agent Name",
//       filterable: true,
//       width: 200,
//     },
//     {
//       field: "exnum",
//       headerName: "Agent Username",
//       width: 230,
//     },
//     {
//       field: "code",
//       headerName: "Agent Code",
//       width: 200,
//     },

//     {
//       field: "mob",
//       headerName: "Mobile Number",
//       width: 200,
//     },

//     {
//       field: "sts",
//       headerName: " Status",
//       width: 180,

//       renderCell: (params) => (
//         <Typography
//           sx={{
//             textAlign: "center",
//             width: 120,
//             backgroundColor: params.row.livsts === 1 ? "#4caf50" : "#f44336", // Green for enabled, red for disabled
//             color: "white",
//             padding: "2px 6px",
//             borderRadius: "4px",
//             display: "inline-block", // Ensures the background fits the text
//           }}
//         >
//           {params.row.livsts === 1 ? "Started" : "End"}
//         </Typography>
//       ),
//     },

//     {
//       field: "action",
//       headerName: "Actions",
//       width: 200,

//       renderCell: (params) => (
//         <Box display={"flex"} justifyContent={"space-between"} gap={2}>
//           {/* View Icon with Name */}
//           {/* <Box>
//             <IconButton color="primary">
//               <Visibility />
//             </IconButton>
//             <Typography sx={{ display: "inline" }}>View</Typography>
//           </Box> */}
//           {/* <ViewButton
//             tripId={params.row.tripid}
//             tripGenId={params.row.trip_genid}
//           /> */}
//           {/* <Box>

//             <IconButton color="primary">
//               <PlaceIcon />
//             </IconButton>
//             <Typography sx={{ display: "inline" }}>Map</Typography>
//           </Box> */}
//           {/* <MapButton
//             tripId={params.row.tripid}
//             tripGenId={params.row.trip_genid}
//           /> */}
//         </Box>
//       ),
//     },
//   ];

//   const sessid = Cookies.get("sessid"); // Get sessid from cookies

//   // Fetch data from API with pagination
//   const fetchData = async (page, size) => {
//     setLoading(true); // Start loading
//     try {
//       const response = await axios.post(
//         "http://192.168.21.71/devenv/d100_ipbx_ajax_apis/public/index.php/v1/agent_masters_list",
//         {
//           lml: sessid, // Replace with your actual session ID if needed
//         }
//       );
//       console.log(response, "Response");
//       const overAllData = response?.data?.resp?.alrt_contacts_list?.map(
//         (trip, index) => {
//           return { ...trip, id: index + 1 };
//         }
//       );
//       const todatDate = setData(overAllData);
//       // Assuming the response contains the actual rows and the total number of rows
//       // setData(response?.data?.resp?.alrt_contacts_list); // Update data with the response
//       // setTotalRows(response.total); // Set total number of rows for pagination
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false); // End loading
//     }
//   };

//   // Fetch data when the page or page size changes
//   useEffect(() => {
//     fetchData(currentPage, pageSize);
//   }, [currentPage, pageSize]);

//   // Pagination handlers
//   const handlePageSizeChange = (newPageSize) => {
//     setPageSize(newPageSize);
//     setCurrentPage(1); // Reset to page 1 when page size changes
//   };

//   const handlePreviousPage = () => {
//     setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); // Go to the previous page
//   };

//   const handleNextPage = () => {
//     setCurrentPage((prevPage) =>
//       Math.min(prevPage + 1, Math.ceil(totalRows / pageSize))
//     ); // Go to the next page
//   };
//   console.log(data, "Data");
//   return (
//     <LocalizationProvider>
//       <Box ml={3}>
//         <Grid container>
//           <Grid item xs={12}>
//             <Card sx={{ height: 800 }}>
//               <Box m={2.5}>
//                 <Grid container spacing={2} alignItems="right">
//                   <Grid
//                     container
//                     spacing={2}
//                     alignItems="center"
//                     justifyContent="space-between"
//                   >
//                     <Grid item xs={4} sx={{ ml: "25px", mt: "16px" }}>
//                       <Typography
//                         variant="h5"
//                         color="#000"
//                         align="left"
//                         fontFamily={"serif"}
//                         width={"50%"}
//                       >
//                         Trip List Reports
//                       </Typography>
//                     </Grid>

//                     <Grid item>
//                       <Box display="flex" alignItems="center" gap={2} m={2}>
//                         <Button
//                           variant="outlined"
//                           color="primary"
//                           onClick={() => {
//                             /* Export logic */
//                           }}
//                         >
//                           Export to CSV
//                         </Button>

//                         <Button
//                           variant="outlined"
//                           color="primary"
//                           onClick={() => {
//                             /* Filter logic */
//                           }}
//                         >
//                           My Filters
//                         </Button>
//                       </Box>
//                     </Grid>
//                   </Grid>
//                 </Grid>

//                 <Box
//                   sx={{
//                     height: 250,
//                     position: "relative",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     mt: 8,
//                     borderRadius: "1px",
//                     backgroundColor: "#f9f9f9",
//                   }}
//                 >
//                   {loading ? (
//                     <Box
//                       display="flex"
//                       justifyContent="center"
//                       alignItems="center"
//                       height="100%"
//                     >
//                       <CircularProgress />
//                     </Box>
//                   ) : (
//                     <Box width={"100%"} mt={35}>
//                       <DataGrid
//                         rows={data} // Data fetched from the API
//                         columns={columns} // Column configuration
//                         disableSelectionOnClick={true}
//                         rowSelectionModel={globalSelectedRows}
//                         loading={loading} // Loading spinner when fetching data
//                         hideFooter
//                         getRowHeight={() => "auto"}
//                         rowCount={totalRows} // Total rows for pagination
//                         paginationMode="server" // Server-side pagination
//                         pageSize={pageSize} // Set page size
//                         page={currentPage - 1} // Set current page (zero-indexed for DataGrid)
//                         sx={{
//                           height: 620,
//                           width: "100%",
//                           "& .MuiDataGrid-cell": {
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                           },
//                         }}
//                       />

//                       <CustomPagination
//                         currentPage={currentPage}
//                         totalRows={totalRows}
//                         pageSize={pageSize}
//                         handlePageSizeChange={handlePageSizeChange}
//                         handlePreviousPage={handlePreviousPage}
//                         handleNextPage={handleNextPage}
//                         totalPages={Math.ceil(totalRows / pageSize)}
//                       />
//                     </Box>
//                   )}
//                 </Box>
//               </Box>
//             </Card>
//           </Grid>
//         </Grid>
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default TripListReports;
