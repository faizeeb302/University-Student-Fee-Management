// components/AdminLayout.js
import Navbar from "./navbar/navbar";
import Sidebar from "./sidebar/sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ padding: "20px", flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
