import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TabsComponent from "./Components/Tabs/tabs";
import LoginPage from "./Components/Pages/Login/login";
import AddNewAgent from "./Components/Pages/TabsPages/Agent-Masters/addNewAgent";
import AgentTable from "./Components/Pages/TabsPages/Agent-Masters/agent-table";
import ExtensionMastersTable from "./Components/Pages/TabsPages/Extension-Masters/extension-masters-table";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/tabs" element={<TabsComponent />} />
        <Route path="/agent_masters" element={<AgentTable />} />
        <Route path="/:id" element={<TabsComponent />} />
        <Route path="/add-new-agent" element={<AddNewAgent />} />
        <Route path="/extension_masters" element={<ExtensionMastersTable />} />
      </Routes>
    </Router>
  );
};

export default App;
