import {BrowserRouter, Route, Routes} from "react-router-dom";
import React, { useState } from "react";
import { CookiesProvider, useCookies } from 'react-cookie';

import Main from "./components/main_page/MainPage";
import Login from "./components/login_page/LoginPage";
import DM from "./components/dm_page/TestDM";

function App() {
  const [id, setID] = useState('');

  return (
    <CookiesProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main setID={setID}/>}/>
        <Route path="/Login/*" element={<Login/>}/>
        <Route path="/DM/*" element={<DM loginID={id}/>}/>
      </Routes>
    </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
