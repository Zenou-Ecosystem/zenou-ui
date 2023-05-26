import React from "react";
import { Route, Routes } from "react-router-dom";
import { fecthCompanies } from "./services/companies.service";
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
import Subscription from "./pages/dashboard/subscriptions/Subscription";
import Logout from "./pages/user/Logout";
import Profile from "./pages/user/Profile";
import DataDetails from "./core/table/Details";
import Personnel from "./pages/dashboard/personnels";
// import Documentation from './pages/api-docs/Documentation';

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Login />}></Route>
        {/* <Route path='api/docs' element={<Documentation />}></Route> */}
        <Route path="login" element={<Login />}></Route>
        <Route path="register" element={<Register />}></Route>
        <Route path="dashboard" element={<DashboardHome />}>
          <Route index path="home" element={<Dashboard />}></Route>
          <Route path="stats" element={<Statistics />}></Route>
          <Route
            path="companies"
            loader={fecthCompanies}
            element={<CompaniesList />}
          ></Route>
          <Route path="laws" element={<Law />}></Route>
          <Route path="personnel" element={<Personnel />}></Route>
          <Route path="controls" element={<Controls />}></Route>
          <Route path="actions" element={<Actions />}></Route>
          <Route path="Subscriptions" element={<Subscription />}></Route>
          <Route path=":context/:id" element={<DataDetails />}></Route>
        </Route>
        <Route path="user" element={<DashboardHome />}>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="logout" element={<Logout />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
