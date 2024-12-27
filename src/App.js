import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/Pages/login";
import TabsComponent from "./Components/Tabs/tabs";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/tabs" element={<TabsComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
