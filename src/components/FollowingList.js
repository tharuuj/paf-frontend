import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFollowingAccounts } from "../feature/followingAccounts/followingAccountSlice";
import FollowingAccountItem from "./FollowingAccountItem";
import { Users } from "lucide-react";

function FollowingList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storeFollowingAccounts = useSelector(
    (state) => state.followingAccountReducer.followingAccounts
  );
  const [animationProgress, setAnimationProgress] = useState(0);

  // Blue color theme
  const colors = {
    white: "#FFFFFF",
    lightBlue: "#E6F0FF",
    mediumBlue: "#99C2FF",
    darkBlue: "#0056D2",
    navyBlue: "#003580",
    skyBlue: "#D9E8FF",
  };

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }

    dispatch(getFollowingAccounts());

    // Animation effect
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.skyBlue,
      color: colors.navyBlue,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1152px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2.5rem',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 50}px)`,
          transition: 'transform 0.8s, opacity 0.8s'
        }}>
          <div style={{
            backgroundColor: colors.darkBlue,
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginRight: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <Users size={32} style={{ color: colors.white }} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              color: colors.navyBlue,
              fontWeight: '600',
              letterSpacing: '-0.025em',
              margin: 0
            }}>Following List</h1>
            <p style={{
              fontSize: '0.875rem',
              color: colors.navyBlue,
              opacity: 0.7,
              margin: '0.25rem 0 0'
            }}>Manage your account connections</p>
          </div>
        </div>

        {/* Following accounts content */}
        <div style={{
          width: '100%',
          backgroundColor: colors.white,
          borderRadius: '0.5rem',
          padding: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 30}px)`,
          transition: 'transform 0.8s, opacity 0.8s',
          transitionDelay: '0.2s',
          border: `1px solid ${colors.mediumBlue}`
        }}>
          <div style={{
            padding: '1rem',
            borderBottom: `1px solid ${colors.mediumBlue}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{
              fontSize: '1rem',
              color: colors.navyBlue,
              fontWeight: '500',
              margin: 0
            }}>Connected Accounts</h2>
            <span style={{
              fontSize: '0.875rem',
              color: colors.navyBlue,
              opacity: 0.6
            }}>
              {storeFollowingAccounts ? storeFollowingAccounts.length : 0} accounts
            </span>
          </div>

          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0'
          }}>
            <tbody>
              {storeFollowingAccounts && storeFollowingAccounts.length > 0 ? (
                storeFollowingAccounts.map((followingAccount) => (
                  <FollowingAccountItem
                    key={followingAccount.id}
                    id={followingAccount.id}
                    firstName={followingAccount.firstName}
                    lastName={followingAccount.lastName}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{
                    textAlign: 'center',
                    padding: '2.5rem',
                    color: colors.navyBlue,
                    backgroundColor: colors.lightBlue,
                    borderRadius: '0.25rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Users size={24} style={{ opacity: 0.5 }} />
                      <span>No following accounts found</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          fontSize: '0.75rem',
          color: colors.navyBlue,
          opacity: 0.7,
          textAlign: 'center',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 20}px)`,
          transition: 'transform 0.8s, opacity 0.8s',
          transitionDelay: '0.4s'
        }}>
          Accounts you follow will appear in this list. To unfollow an account, select the menu option.
        </div>
      </div>
    </div>
  );
}

export default FollowingList;