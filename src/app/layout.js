import "./css/sidebar.css";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {/* AuthProvider က children ကို သေချာ ပတ်ထားရပါမယ် */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}