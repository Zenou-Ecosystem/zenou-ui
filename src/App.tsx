import React from "react";
import { Outlet, Route, Routes } from 'react-router-dom';
import "./App.scss";
import Login from "./components/Authentication/Login/Login";
import Register from "./components/Authentication/Register/Register";
import DashboardHome from "./pages/dashboard";
import Actions from "./pages/dashboard/actions/Actions";
import CompaniesList from "./pages/dashboard/companies/CompaniesList";
import Controls from "./pages/dashboard/controls/Controls";
import Dashboard from "./pages/dashboard/home/Dashboard";
import Law from "./pages/dashboard/laws/Law";
import Statistics from "./pages/dashboard/statistics/Statistics";
import Logout from "./pages/user/Logout";
import Profile from "./pages/user/Profile";
import DataDetails from "./core/table/Details";
import ReviewLaw from './pages/dashboard/laws/ReviewLaw';
import TextAnalysis from './pages/dashboard/laws/TextAnalysis';
import NewLaw from './pages/dashboard/laws/NewLaw';
import ErrorComponent from './core/shared/error';

function App() {
  return (
      <div>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="login" element={<Login />}></Route>
          <Route path="register" element={<Register />}></Route>

          <Route path="dashboard" element={<DashboardHome />}>
            <Route index path="home" element={<Dashboard />}></Route>
            <Route path="stats" element={<Statistics />}></Route>
            <Route path="companies" element={<CompaniesList />}></Route>
            <Route path="laws" element={<Outlet />}>
              <Route index path="" element={<Law />}></Route>
              <Route path="new" element={<NewLaw />}/>
              <Route path="edit/:id" element={<NewLaw />}/>
              <Route path="analysis/:id/review" element={<ReviewLaw />}></Route>
              <Route path="analysis/:id" element={<TextAnalysis />}></Route>
            </Route>
            <Route path="controls" element={<Controls />}></Route>
            <Route path="actions" element={<Actions />}></Route>
            <Route path=":context/:id" element={<DataDetails />}></Route>
          </Route>

          <Route path="*" element={<ErrorComponent/>} />

          <Route path="user" element={<DashboardHome />}>
            <Route path="profile" element={<Profile />}></Route>
            <Route path="logout" element={<Logout />}></Route>
          </Route>
        </Routes>
      </div>
  );
}

export default App;
