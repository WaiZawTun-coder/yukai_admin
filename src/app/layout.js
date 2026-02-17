import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "Yukai - Admin Dashboard",
  description:
    "Admin dashboard for managing users, content, and settings of the Yukai social media platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
