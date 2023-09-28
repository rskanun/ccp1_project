import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";

import Login from "./components/login_page/TestLogin";
import DM from "./components/dm_page/TestDM";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/DM/*" element={<DM/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
