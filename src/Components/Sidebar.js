"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Material UI Icons
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import SupervisedUserCircleRoundedIcon from '@mui/icons-material/SupervisedUserCircleRounded';
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import ReportRoundedIcon from "@mui/icons-material/ReportRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

const adminMenuList = [
  { id: 1, name: "Dashboard", icon: DashboardOutlinedIcon, activeIcon: DashboardRoundedIcon, link: "/" },
  { id: 2, name: "Admin Management", icon: SupervisedUserCircleOutlinedIcon, activeIcon: SupervisedUserCircleRoundedIcon, link: "/admin-management"},
  { id: 3, name: "User Management", icon: GroupOutlinedIcon, activeIcon: GroupRoundedIcon, link: "/user-management" },
  { id: 4, name: "Reports", icon: ReportOutlinedIcon, activeIcon: ReportRoundedIcon, link: "/reports" },
  { id: 5, name: "Settings", icon: SettingsOutlinedIcon, activeIcon: SettingsRoundedIcon, link: "/settings" },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const user = { username: "admin", display_name: "Admin", gender: "male" };

  return (
    <div className="sidebar">
      {/* LOGO */}
      <div className="header-logo">
        <small>yukai</small>
        愉快
      </div>

      {/* PROFILE CARD */}
      <Link href="/admin/profile" style={{ textDecoration: 'none' }}>
        <div className="profile">
          <Image
            src={`/images/default-profiles/${user.gender}.jpg`}
            alt="profile"
            width={52}
            height={52}
          />
          <div className="info">
            <h4>{user.display_name}</h4>
            <p>@{user.username}</p>
          </div>
        </div>
      </Link>

      <hr className="profile-horizontal-bar" />

      {/* MENU LIST */}
      <ul className="menu">
        {adminMenuList.map((item) => {
          const isActive = pathname === item.link;
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link key={item.id} href={item.link} style={{ textDecoration: 'none' }}>
              <li className={isActive ? "active" : ""}>
                <Icon className="menu-icon" />
                <span>{item.name}</span>
              </li>
            </Link>
          );
        })}
      </ul>

      {/* THEME TOGGLE */}
      <div className="toggle">
        <DarkModeRoundedIcon style={{ fontSize: '20px', color: '#fff' }} />
      </div>
    </div>
  );
};

export default AdminSidebar;