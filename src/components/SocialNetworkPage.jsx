import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MessageCircle, Home, Users, UserPlus, Search, ChevronRight } from "lucide-react";

// Import your components
import FollowerList from "./FollowerList";
import FollowingList from "./FollowingList";
import AllAccounts from "./AllAccounts";

function SocialNetworkContainer() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("following");
  const [animationProgress, setAnimationProgress] = useState(0);

  // Theme colors
  const colors = {
    blueDark: "#19304f",
    bluePrimary: "#1e40af",
    blueLight: "#dbeafe",
    white: "#ffffff",
    greyLight: "#e5e7eb",
    greyDark: "#374151",
    textPrimary: "#1f2937"
  };

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 500);
    return () => clearTimeout(timer);
  }, [navigate]);

  const NavItem = ({ icon, label, isActive, onClick }) => (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        marginBottom: '0.5rem',
        cursor: 'pointer',
        backgroundColor: isActive ? colors.bluePrimary : 'transparent',
        color: isActive ? colors.white : colors.textPrimary,
        fontWeight: isActive ? 'bold' : 'normal',
        borderRadius: '8px',
        transition: 'all 0.3s ease'
      }}
    >
      {icon}
      <span style={{ marginLeft: '0.75rem' }}>{label}</span>
      {isActive && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "following":
        return (
          <div className="component-wrapper" style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '8px'
          }}>
            <FollowingList />
          </div>
        );
      case "followers":
        return (
          <div className="component-wrapper" style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '8px'
          }}>
            <FollowerList />
          </div>
        );
      case "discover":
        return (
          <div className="component-wrapper" style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: '8px'
          }}>
            <AllAccounts />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.blueLight,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: colors.white,
        borderBottom: `1px solid ${colors.greyLight}`,
        padding: '0.75rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            backgroundColor: colors.bluePrimary,
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '0.75rem'
          }}>
            <Users size={24} style={{ color: colors.white }} />
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: colors.textPrimary,
          }}>
            Friends Connect
          </h1>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{
        display: 'flex',
        flex: 1,
        padding: '1rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Sidebar */}
        <div style={{
          width: '280px',
          marginRight: '1rem',
          background: colors.white,
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          padding: '1rem',
          height: 'fit-content',
          position: 'sticky',
          top: '80px',
          opacity: animationProgress / 100,
          transform: `translateX(${(1 - animationProgress / 100) * -30}px)`,
          transition: 'transform 1s, opacity 1s'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: '1rem'
          }}>
            Connections
          </h2>

          {/* Nav Items */}
          <NavItem 
            icon={<UserPlus size={20} />} 
            label="Following" 
            isActive={activeTab === "following"} 
            onClick={() => setActiveTab("following")} 
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Followers" 
            isActive={activeTab === "followers"} 
            onClick={() => setActiveTab("followers")} 
          />
          <NavItem 
            icon={<Search size={20} />} 
            label="Discover People" 
            isActive={activeTab === "discover"} 
            onClick={() => setActiveTab("discover")} 
          />
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          background: colors.white,
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          padding: '0',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 30}px)`,
          transition: 'transform 1s, opacity 1s',
          transitionDelay: '0.3s',
          overflow: 'hidden'
        }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default SocialNetworkContainer;