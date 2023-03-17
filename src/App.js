import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FilterableClaimsTable from "./pages/FilterableClaimsTable";
import ClaimDetails from "./pages/ClaimDetails";
import ItemDetailsWrapper from "./components/claimDetails/ItemDetailsWrapper";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate replace to="/claims" />} />
        <Route path="/claims" element={<FilterableClaimsTable />} />
        <Route path="/claims/:claimNb" element={<ClaimDetails />}>
          <Route path=":itemCPT" element={<ItemDetailsWrapper />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
