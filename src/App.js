import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";
import { CookiesProvider } from 'react-cookie';

import Main from "./components/main_page/MainPage";
import Login from "./components/login_page/LoginPage";
import FindAcc from "./components/login_page/FindAcc";
import DM from "./components/dm_page/DM";
<<<<<<< Updated upstream
=======
import BoardList from "./components/board_page/BoardList";
import BoardWrite from "./components/board_page/BoardWrite";
import Register from "./components/login_page/RegisterPage";
import Admit from "./components/login_page/AdmitPage";

import 'bootstrap/dist/css/bootstrap.min.css';
>>>>>>> Stashed changes

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
<<<<<<< Updated upstream
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/login/*" element={<Login/>}/>
        <Route path="/login/FindAcc" element={<FindAcc/>}/>
        <Route path="/DM/*" element={<DM/>}/>
      </Routes>
    </BrowserRouter>
=======
        <Routes>
          <Route path="" element={
              <div>
                <Top />
                <Outlet />
                <Bottom />
              </div>
            }
          >
            <Route path="" element={<Main />} />
            <Route path="login/*" element={<Login />} />
            <Route path="register/enterInfo/*" element={<Register />} />
            <Route path="register/admitCheck/*" element={<Admit />} />
            <Route path="DM/*" element={<DM />} />
            <Route path="board/list/*" element={<BoardList />} />
            <Route path="board/write/*" element={<BoardWrite />} />
          </Route>
          <Route path="login/FindAcc" element={<FindAcc />} />
        </Routes>
      </BrowserRouter>
>>>>>>> Stashed changes
    </CookiesProvider>
  );
}

export default App;
