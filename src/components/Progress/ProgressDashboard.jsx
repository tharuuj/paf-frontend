import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { LineChart, BarChart, User } from 'lucide-react';

const ProgressDashboard = ({ userId }) => {
  const [progressItems, setProgressItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // Fetch all progress items for the user
  const fetchProgressItems = async () => {
    const _id = localStorage.getItem("psnUserId");

    try {
      setLoading(true);
      const response = await axios.post(
        '/api/v1/progress/following',
        { id: _id },
        {
          headers: {
            Authorization: localStorage.getItem("psnToken"),
          },
        }
      );
  
      if (response.data.status === 'success') {
        // Extract progress items from the new data structure
        const items = response.data.payload || [];
        // Transform the data to have consistent format
        const formattedItems = items.map(item => ({
          ...item.progress,
          user: item.user
        }));
        
        setProgressItems(formattedItems);
  
        // Extract unique categories
        const uniqueCategories = [...new Set(formattedItems.map(item => item.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to fetch progress items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = (current, initial, target) => {
    if (target === initial) return 0;
    const progress = ((current - initial) / (target - initial)) * 100;
    return Math.min(Math.max(progress, 0), 100); // Clamp between 0-100
  };
  
  // Filter progress items by category
  const getFilteredItems = () => {
    if (selectedCategory === 'all') {
      return progressItems;
    }
    return progressItems.filter(item => item.category === selectedCategory);
  };
  
  // Get statistics
  const getStats = () => {
    const stats = {
      total: progressItems.length,
      completed: progressItems.filter(item => 
        calculateProgress(item.currentValue, item.initialValue, item.targetValue) >= 100
      ).length,
      inProgress: progressItems.filter(item => {
        const progress = calculateProgress(item.currentValue, item.initialValue, item.targetValue);
        return progress > 0 && progress < 100;
      }).length,
      notStarted: progressItems.filter(item => 
        calculateProgress(item.currentValue, item.initialValue, item.targetValue) === 0
      ).length
    };
    
    return stats;
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Load progress data on component mount
  useEffect(() => {
    fetchProgressItems();
    
    // Animation effect
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [userId]);
  
  const filteredItems = getFilteredItems();
  const stats = getStats();
  
  // Color palette for the professional white and dark grey theme
  const theme = {
    primary: '#0056D2',        // Dark grey for primary elements
    secondary: '#000',      // Medium grey for secondary elements
    accent: '#000',         // Light accent color
    light: '#0000',          // Light background
    white: '#E3F2FD',          // White
    border: '#E0E0E0',         // Border color
    shadow: 'rgba(0, 0, 0, 0.08)' // Shadow color
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      background: theme.white,
      color: theme.primary,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden',
      border: `1.5px solid ${theme.border}`,
      borderRadius: '5px',
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 20}px)`,
        transition: 'transform 0.8s, opacity 0.8s',
      }}>
        <div style={{
          backgroundColor: theme.primary,
          padding: '0.75rem',
          borderRadius: '0.75rem',
          marginRight: '1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <LineChart size={32} style={{ color: theme.white }} />
        </div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: theme.primary,
          margin: 0
        }}>PROGRESS DASHBOARD</h1>
      </div>

      {/* Main content container */}
      <div style={{
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 15}px)`,
        transition: 'transform 0.8s, opacity 0.8s',
        transitionDelay: '0.1s',
        color: theme.accent
      }}>
        <div style={{
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: 0.9,
            color: theme.secondary 
          }}>Track and visualize your progress across different categories</p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: theme.light, 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            marginBottom: '1.5rem',
            borderLeft: `4px solid ${theme.accent}`,
            color: theme.secondary
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem'
          }}>
            <Spinner animation="border" style={{ color: theme.accent }} />
          </div>
        ) : progressItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: theme.light,
            borderRadius: '1rem',
            color: theme.secondary
          }}>
            <p style={{ fontSize: '1.125rem' }}>No progress items found. Start by creating your first progress tracker.</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
              opacity: animationProgress / 100,
              transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
              transition: 'transform 0.8s, opacity 0.8s',
              transitionDelay: '0.2s'
            }}>
              <div style={{
                backgroundColor: theme.white,
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                boxShadow: `0 4px 6px ${theme.shadow}`,
                border: `1px solid ${theme.border}`
              }}>
                <h3 style={{ margin: '0 0 0.5rem', color: theme.secondary, fontSize: '1rem' }}>Total</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: theme.accent }}>{stats.total}</p>
              </div>

              <div style={{
                backgroundColor: theme.white,
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                boxShadow: `0 4px 6px ${theme.shadow}`,
                border: `1px solid ${theme.border}`
              }}>
                <h3 style={{ margin: '0 0 0.5rem', color: theme.secondary, fontSize: '1rem' }}>Completed</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: theme.accent }}>{stats.completed}</p>
              </div>

              <div style={{
                backgroundColor: theme.white,
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                boxShadow: `0 4px 6px ${theme.shadow}`,
                border: `1px solid ${theme.border}`
              }}>
                <h3 style={{ margin: '0 0 0.5rem', color: theme.secondary, fontSize: '1rem' }}>In Progress</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: theme.accent }}>{stats.inProgress}</p>
              </div>

              <div style={{
                backgroundColor: theme.white,
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                boxShadow: `0 4px 6px ${theme.shadow}`,
                border: `1px solid ${theme.border}`
              }}>
                <h3 style={{ margin: '0 0 0.5rem', color: theme.secondary, fontSize: '1rem' }}>Not Started</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: theme.accent }}>{stats.notStarted}</p>
              </div>
            </div>
            
            {/* Category Filters Header */}
            <div style={{
              textAlign: 'center',
              marginTop: '2rem',
              marginBottom: '1.5rem',
              opacity: animationProgress / 100,
              transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
              transition: 'transform 0.8s, opacity 0.8s',
              transitionDelay: '0.2s'
            }}>
              <h3 style={{
                color: theme.accent,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                position: 'relative',
                display: 'inline-block',
                padding: '0 1rem'
              }}>
                Categories
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '3px',
                  backgroundColor: theme.accent,
                  borderRadius: '2px'
                }}></div>
              </h3>
            </div>
            
            {/* Category Filters */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              opacity: animationProgress / 100,
              transform: `translateY(${(1 - animationProgress / 100) * 5}px)`,
              transition: 'transform 0.8s, opacity 0.8s',
              transitionDelay: '0.3s'
            }}>
              <button 
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: selectedCategory === 'all' ? theme.accent : theme.light,
                  color: selectedCategory === 'all' ? theme.white : theme.accent,
                  border: selectedCategory === 'all' ? 'none' : `1px solid ${theme.border}`,
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: selectedCategory === 'all' ? 'bold' : 'normal',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </button>
              
              {categories.map((category) => (
                <button 
                  key={category} 
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: selectedCategory === category ? theme.accent : theme.light,
                    color: selectedCategory === category ? theme.white : theme.accent,
                    border: selectedCategory === category ? 'none' : `1px solid ${theme.border}`,
                    borderRadius: '2rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: selectedCategory === category ? 'bold' : 'normal',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Progress List Header */}
            <div style={{
              textAlign: 'center',
              marginTop: '2rem',
              marginBottom: '1.5rem',
              opacity: animationProgress / 100,
              transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
              transition: 'transform 0.8s, opacity 0.8s',
              transitionDelay: '0.2s'
            }}>
              <h3 style={{
                color: theme.accent,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                position: 'relative',
                display: 'inline-block',
                padding: '0 1rem'
              }}>
                Progress Items
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '3px',
                  backgroundColor: theme.accent,
                  borderRadius: '2px'
                }}></div>
              </h3>
            </div>
            
            {/* Progress List */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}>
              {filteredItems.map((progress, index) => {
                const progressPercent = calculateProgress(
                  progress.currentValue,
                  progress.initialValue,
                  progress.targetValue
                );
                
                // Different shades of dark grey for progress based on percentage
                const progressColor = 
                  progressPercent >= 100 ? '#2E2E2E' : 
                  progressPercent > 50 ? '#3D3D3D' : 
                  progressPercent > 25 ? '#4A4A4A' : '#575757';
                
                return (
                  <div 
                    key={progress.id} 
                    style={{
                      backgroundColor: theme.white,
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      boxShadow: `0 4px 6px ${theme.shadow}`,
                      border: `1px solid ${theme.border}`,
                      transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
                      opacity: animationProgress / 100,
                      transition: 'transform 0.8s, opacity 0.8s',
                      transitionDelay: `${0.3 + index * 0.05}s`
                    }}
                  >
                    {/* User info - new addition */}
                    {progress.user && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        padding: '0.5rem',
                        backgroundColor: theme.light,
                        borderRadius: '0.5rem'
                      }}>
                        <div style={{
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '50%',
                          backgroundColor: theme.accent,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: '0.75rem'
                        }}>
                          <User size={18} color={theme.white} />
                        </div>
                        <div>
                          <div style={{
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            color: theme.accent
                          }}>
                            {progress.user.firstName} {progress.user.lastName}
                          </div>
                          <div style={{
                            fontSize: '0.8rem',
                            color: theme.secondary,
                            opacity: 0.7
                          }}>
                            {progress.user.email}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <h3 style={{ 
                      margin: '0 0 0.75rem', 
                      fontSize: '1.25rem',
                      color: theme.accent,
                      fontWeight: 'bold'
                    }}>
                      {progress.title}
                    </h3>
                    
                    {progress.category && (
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: theme.light,
                        color: theme.secondary,
                        borderRadius: '1rem',
                        fontSize: '0.8rem',
                        marginBottom: '1rem',
                        border: `1px solid ${theme.border}`
                      }}>
                        {progress.category}
                      </span>
                    )}
                    
                    <div style={{
                      height: '0.5rem',
                      backgroundColor: theme.light,
                      borderRadius: '0.25rem',
                      overflow: 'hidden',
                      margin: '1rem 0',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        backgroundColor: progressColor,
                        borderRadius: '0.25rem',
                        transition: 'width 1s ease-in-out',
                      }} />
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      fontSize: '0.9rem',
                      color: theme.secondary
                    }}>
                      <div>{progress.currentValue} {progress.unit}</div>
                      <div>{progress.targetValue} {progress.unit}</div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '1.5rem',
                      fontSize: '0.8rem',
                      color: theme.secondary
                    }}>
                      <div>Updated: {formatDate(progress.updatedAt)}</div>
                      <div style={{
                        backgroundColor: progressColor,
                        color: theme.white,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                      }}>
                        {Math.round(progressPercent)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressDashboard;