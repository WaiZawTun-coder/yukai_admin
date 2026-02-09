import AdminSidebar from "../../Components/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="layout">
        <AdminSidebar />
        {children}
    </div>
  );
}