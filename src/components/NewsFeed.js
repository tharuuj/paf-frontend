import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Box, Paper, Typography, IconButton, Tooltip, Avatar } from "@mui/material";
import { 
  LogoutRounded, 
  Explore, 
  Dashboard, 
  School,
  Home as HomeIcon
} from "@mui/icons-material";
import { PlusSquare, User, Network } from "lucide-react";

function NewsFeed() {
  let navigate = useNavigate();
  const userFirstName = localStorage.getItem("psnUserFirstName") || "User";

  function handleSignOut(e) {
    localStorage.clear();
    navigate("/s");
  }

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
  }, [navigate]);

  return (
    <Container className="py-4" style={{ maxWidth: "1200px" }}>
      {/* Header with Left Sidebar Navigation */}
      <Box sx={{ display: "flex", gap: 3, minHeight: "85vh" }}>
        {/* Left Navigation Sidebar */}
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 10px",
            width: "80px",
            borderRadius: "16px",
            background: "linear-gradient(180deg, #2563EB 0%, #1D4ED8 100%)",  // ✅ Modern Blue gradient
            position: "sticky",
            top: "20px",
            height: "fit-content",
          }}
        >
          {/* Logo */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: "1.8rem",
              color: "#fff",
              mb: 4,
              letterSpacing: "1px",
            }}
          >
            FC
          </Typography>

          {/* Navigation Icons */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
            {[
              { title: "Home", icon: <HomeIcon />, to: "" },
              { title: "Discover", icon: <PlusSquare size={24} />, to: "all" },
              { title: "Progress", icon: <Explore />, to: "progress" },
              { title: "Dashboard", icon: <Dashboard />, to: "dashboard" },
              { title: "Network", icon: <Network size={24} />, to: "education" },
              { title: "Education", icon: <School />, to: "education" },
            ].map((item, index) => (
              <Tooltip title={item.title} placement="right" key={index}>
                <IconButton
                  sx={{
                    color: "#ffffff",
                    "&:hover": { background: "rgba(255, 255, 255, 0.15)" },
                    padding: "10px",
                  }}
                  component={Link}
                  to={item.to}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>

          {/* User Profile & Logout */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
            <Tooltip title="My Profile" placement="right">
              <IconButton
                sx={{
                  background: "#22C55E",
                  color: "#ffffff",
                  "&:hover": { opacity: 0.9 },
                  padding: "10px",
                }}
                component={Link}
                to="myprofile"
              >
                <User size={24} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Sign Out" placement="right">
              <IconButton
                sx={{
                  color: "#F87171",
                  "&:hover": { background: "rgba(248,113,113,0.15)" },
                  padding: "10px",
                }}
                onClick={handleSignOut}
              >
                <LogoutRounded />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Fixed Header Bar */}
          <Paper
            elevation={2}
            sx={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "16px 24px",
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "sticky",
              top: "20px",
              zIndex: 100,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #10B981 30%, #06B6D4 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Foodie Crush
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 500, color: "#555" }}>
                Welcome, {userFirstName}
              </Typography>
              <Avatar sx={{ 
                background: "#06B6D4", 
                width: 40, 
                height: 40 
              }}>
                {userFirstName[0]}
              </Avatar>
            </Box>
          </Paper>

          {/* Content Container */}
          <Paper
            elevation={2}
            sx={{
              background: "#F9FAFC",
              borderRadius: "16px",
              minHeight: "70vh",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Outlet />
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default NewsFeed;