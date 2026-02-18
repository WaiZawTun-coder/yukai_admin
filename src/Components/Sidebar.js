"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import SupervisedUserCircleOutlinedIcon from "@mui/icons-material/SupervisedUserCircleOutlined";
import SupervisedUserCircleRoundedIcon from "@mui/icons-material/SupervisedUserCircleRounded";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import ReportRoundedIcon from "@mui/icons-material/ReportRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const adminMenuList = [
  {
    id: 1,
    name: "Dashboard",
    icon: DashboardOutlinedIcon,
    activeIcon: DashboardRoundedIcon,
    link: "/",
    access: ["super_admin", "moderator"],
  },
  {
    id: 2,
    name: "Admin Management",
    icon: SupervisedUserCircleOutlinedIcon,
    activeIcon: SupervisedUserCircleRoundedIcon,
    link: "/admin-management",
    access: ["super_admin"],
  },
  {
    id: 3,
    name: "User Management",
    icon: GroupOutlinedIcon,
    activeIcon: GroupRoundedIcon,
    link: "/user-management",
    access: ["super_admin", "moderator"],
  },
  {
    id: 4,
    name: "Reports",
    icon: ReportOutlinedIcon,
    activeIcon: ReportRoundedIcon,
    link: "/reports/reported-accounts",
    access: ["super_admin", "moderator"],
  },
  {
    id: 5,
    name: "Settings",
    icon: SettingsOutlinedIcon,
    activeIcon: SettingsRoundedIcon,
    link: "/settings",
    access: ["super_admin", "moderator"],
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <div className="sidebar">
        <div className="header-logo">
          <small>yukai</small>愉快
        </div>

        {/* <Link href="/admin/profile" style={{ textDecoration: "none" }}> */}
        <div className="profile">
          <Image
            src={
              user?.profile_image
                ? `/api/images?url=${user.profile_image}`
                : `/Images/default-profiles/${user?.gender || "male"}.jpg`
            }
            alt="profile"
            width={52}
            height={52}
          />
          <div className="info">
            <h4>{user?.display_name || "super_admin"}</h4>
            <p>@{user?.username || "super_admin"}</p>
          </div>
        </div>
        {/* </Link> */}

        <hr className="profile-horizontal-bar" />

        <ul className="menu">
          {adminMenuList.map((item) => {
            if (!item.access.includes(user?.role)) return null;

            const isActive =
              item.link === "/reports/reported-accounts"
                ? pathname.startsWith("/reports")
                : pathname === item.link;
            const Icon = isActive ? item.activeIcon : item.icon;
            return (
              <Link
                key={item.id}
                href={item.link}
                style={{
                  textDecoration: "none",
                  backgroundColor: isActive
                    ? "var(--surface-3)"
                    : "transparent",
                  borderRadius: "12px",
                }}
              >
                <li className={isActive ? "active" : ""}>
                  <Icon className="menu-icon" />
                  <span>{item.name}</span>
                </li>
              </Link>
            );
          })}
          <li className="logout-item" onClick={() => setShowLogoutModal(true)}>
            <LogoutRoundedIcon className="menu-icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>

      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3>Confirm Logout</h3>
            <p>
              Are you sure you want to <strong>logout</strong>?
            </p>
            <div className="logout-modal-actions">
              <button
                className="logout-btn-cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="logout-btn-danger"
                onClick={() => {
                  logout();
                  setShowLogoutModal(false);
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
