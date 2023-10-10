import {BrowserRouter, Route, Routes} from "react-router-dom";
import React, { useState } from "react";
import { CookiesProvider, useCookies } from 'react-cookie';

import Main from "./components/main_page/MainPage";
import Login from "./components/login_page/LoginPage";
import DM from "./components/dm_page/TestDM";

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/Login/*" element={<Login/>}/>
        <Route path="/DM/*" element={<DM/>}/>
      </Routes>
    </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
