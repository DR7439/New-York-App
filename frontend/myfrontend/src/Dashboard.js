// src/Dashboard.js

import SearchTable from "./components/SearchTable";
import Credit from "./Credits.js";
const Dashboard = () => {
  return (
    <>
      <div>
        <h1 className="text-4xl font-medium">Dashboard</h1>
        <p className="mt-2 text-neutral-500">
          Track your credit usage and search history.{" "}
        </p>
      </div>
      <Credit />
      <SearchTable />
    </>
  );
};

export default Dashboard;
