import { Layout } from "antd";
import { NavLink, Outlet } from "react-router-dom";

const { Header, Content } = Layout;

const linkStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.85)",
  textDecoration: "none",
  padding: "0 12px",
  lineHeight: "64px",
  display: "inline-block",
};

export default function AppLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              marginRight: 8,
            }}
          >
            School Admin
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <NavLink
              to="/students"
              style={({ isActive }) => ({
                ...linkStyle,
                fontWeight: isActive ? 600 : 400,
                borderBottom: isActive
                  ? "2px solid #1677ff"
                  : "2px solid transparent",
              })}
            >
              Students
            </NavLink>

            <NavLink
              to="/rooms"
              style={({ isActive }) => ({
                ...linkStyle,
                fontWeight: isActive ? 600 : 400,
                borderBottom: isActive
                  ? "2px solid #1677ff"
                  : "2px solid transparent",
              })}
            >
              Rooms
            </NavLink>

            <NavLink
              to="/reports"
              style={({ isActive }) => ({
                ...linkStyle,
                fontWeight: isActive ? 600 : 400,
                borderBottom: isActive
                  ? "2px solid #1677ff"
                  : "2px solid transparent",
              })}
            >
              Reports
            </NavLink>
          </nav>
        </div>
        <div />
      </Header>

      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
    </Layout>
  );
}
