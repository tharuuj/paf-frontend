import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllAccounts, getFollowingAccounts } from "../feature/followingAccounts/followingAccountSlice";
import FollowerAccountItem from "./FollowerAccountItem";
import { Search } from "lucide-react";

function AllAccounts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storeFollowerAccounts = useSelector(
    (state) => state.followingAccountReducer.followerAccounts
  );
  const [animationProgress, setAnimationProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Blue color theme
  const colors = {
    blueDark: "#19304f",
    bluePrimary: "#1e40af",
    blueLight: "#dbeafe",
    white: "#FFFFFF",
    greyLight: "#E5E7EB",
    textPrimary: "#1f2937"
  };

  useEffect(() => {
    if (dispatch(getFollowingAccounts())) {
      dispatch(getAllAccounts());
    }
  }, [dispatch]);

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
    dispatch(getFollowingAccounts());
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredAccounts = storeFollowerAccounts
    ? storeFollowerAccounts.filter(account =>
        `${account.firstName} ${account.lastName}.toLowerCase().includes(searchTerm.toLowerCase())`
      )
    : [];

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.blueLight,
      color: colors.textPrimary,
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
            backgroundColor: colors.bluePrimary,
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginRight: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <Search size={32} style={{ color: colors.white }} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              color: colors.textPrimary,
              fontWeight: '600',
              margin: 0
            }}>
              Discover People
            </h1>
            <p style={{
              fontSize: '0.875rem',
              color: colors.textPrimary,
              opacity: 0.7,
              margin: '0.25rem 0 0'
            }}>
              Find and connect with other users
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div style={{
          width: '100%',
          marginBottom: '1.5rem',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 30}px)`,
          transition: 'transform 0.8s, opacity 0.8s',
          transitionDelay: '0.1s'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: colors.white,
            border: `1px solid ${colors.greyLight}`,
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <Search size={20} style={{ color: colors.textPrimary, opacity: 0.5, marginRight: '0.75rem' }} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                width: '100%',
                fontSize: '0.875rem',
                color: colors.textPrimary
              }}
            />
          </div>
        </div>

        {/* Account list */}
        <div style={{
          width: '100%',
          backgroundColor: colors.white,
          borderRadius: '0.5rem',
          padding: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 30}px)`,
          transition: 'transform 0.8s, opacity 0.8s',
          transitionDelay: '0.2s',
          border: `1px solid ${colors.greyLight}`
        }}>
          <div style={{
            padding: '1rem',
            borderBottom: `1px solid ${colors.greyLight}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{
              fontSize: '1rem',
              color: colors.textPrimary,
              fontWeight: '500',
              margin: 0
            }}>
              Available Accounts
            </h2>
            <span style={{
              fontSize: '0.875rem',
              color: colors.textPrimary,
              opacity: 0.6
            }}>
              {filteredAccounts.length} found
            </span>
          </div>

          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0'
          }}>
            <tbody>
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <FollowerAccountItem
                    key={account.id}
                    id={account.id}
                    firstName={account.firstName}
                    lastName={account.lastName}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{
                    textAlign: 'center',
                    padding: '2.5rem',
                    color: colors.textPrimary,
                    backgroundColor: colors.blueLight,
                    borderRadius: '0.25rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Search size={24} style={{ opacity: 0.5 }} />
                      <span>No accounts found</span>
                      {searchTerm && (
                        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                          Try a different search term
                        </span>
                      )}
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
          color: colors.textPrimary,
          opacity: 0.6,
          textAlign: 'center',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 20}px)`,
          transition: 'transform 0.8s, opacity 0.8s',
          transitionDelay: '0.4s'
        }}>
          Connect with other users by selecting the follow button on their profile.
        </div>
      </div>
    </div>
  );
}

export default AllAccounts;