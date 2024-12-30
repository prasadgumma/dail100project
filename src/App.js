import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginPage from "./Components/Pages/Login/login";
import TabsComponent from "./Components/Tabs/tabs";
import AddNewAgent from "./Components/Pages/TabsPages/addNewAgent";
import LoginPage from "./Components/Pages/Login/login";
import AgentTable from "./Components/Pages/TabsPages/agent-table";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/tabs" element={<TabsComponent />} />
        <Route path="/agent_masters" element={<AgentTable />} />
        <Route path="/:id" element={<TabsComponent />} />
        <Route path="/add-new-agent" element={<AddNewAgent />} />
      </Routes>
    </Router>
  );
};

export default App;
