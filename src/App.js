import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";
import { CookiesProvider } from 'react-cookie';

import Main from "./components/main_page/MainPage";
import Login from "./components/login_page/LoginPage";
import FindAcc from "./components/login_page/FindAcc";
import DM from "./components/dm_page/DM";

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/login/*" element={<Login/>}/>
        <Route path="/login/FindAcc" element={<FindAcc/>}/>
        <Route path="/DM/*" element={<DM/>}/>
      </Routes>
    </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
