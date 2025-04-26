import React, { useEffect, useState } from "react";
import PostCompose from "./PostCompose";
import PostItem from "./PostItem";
import { Spinner } from "react-bootstrap";
import { getFollowingPosts } from "../feature/followingPost/followingPostSlice";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react"; // for beautiful plus icon

function NewsFeedContent() {
  const dispatch = useDispatch();
  const storeFollowingPosts = useSelector((state) => state.followingPostReducer.followingPosts);
  const [showPostCompose, setShowPostCompose] = useState(false);
  const [activeTab, setActiveTab] = useState("following");
  const [isMobile, setIsMobile] = useState(false);

  const colors = {
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    textDark: '#1c1e21',
    textLight: '#606770',
    background: '#f0f2f5',
    feedBackground: '#ffffff',
    border: '#e0e0e0',
  };

  useEffect(() => {
    dispatch(getFollowingPosts());
  }, [dispatch]);

  const [displayPosts, setDisplayPosts] = useState([]);

  useEffect(() => {
    if (storeFollowingPosts) {
      let sortedPosts = [...storeFollowingPosts];
      if (activeTab === "following") {
        setDisplayPosts(sortedPosts);
      } else if (activeTab === "most-liked") {
        sortedPosts.sort((a, b) =>
          (b.post.love?.length || 0) - (a.post.love?.length || 0)
        );
        setDisplayPosts(sortedPosts);
      } else if (activeTab === "latest") {
        sortedPosts.sort((a, b) =>
          new Date(b.post.createdAt) - new Date(a.post.createdAt)
        );
        setDisplayPosts(sortedPosts);
      }
    }
  }, [storeFollowingPosts, activeTab]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const togglePostCompose = () => {
    setShowPostCompose(!showPostCompose);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      {/* Main Content Area */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: colors.feedBackground,
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}>
        
        {/* Create Post Button */}
        <div style={{
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <button onClick={togglePostCompose} style={{
            backgroundColor: colors.primary,
            color: colors.white,
            padding: '0.6rem 1.2rem',
            fontSize: '0.95rem',
            fontWeight: '600',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <Plus size={18} />
            Create Post
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '1.5rem',
          borderBottom: `1px solid ${colors.border}`,
        }}>
          {[
            { key: 'following', label: 'Following' },
            { key: 'most-liked', label: 'Most Liked' },
            { key: 'latest', label: 'Latest' }
          ].map((tab) => (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '0.75rem',
                fontWeight: activeTab === tab.key ? '700' : '500',
                color: activeTab === tab.key ? colors.primary : colors.textLight,
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: colors.primary,
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {storeFollowingPosts !== null ? (
            displayPosts.length > 0 ? (
              displayPosts.map((post) => (
                <div key={post.post.id} style={{
                  backgroundColor: colors.white,
                  borderRadius: '12px',
                  padding: '1rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                  border: `1px solid ${colors.border}`,
                }}>
                  <PostItem
                    postId={post.post.id}
                    userId={post.user.id}
                    firstName={post.user.firstName || ""}
                    lastName={post.user.lastName || ""}
                    content={post.post.content}
                    image={post.post.image}
                    images={post.post.images}
                    loveList={post.post.love}
                    shareList={post.post.share}
                    commentList={post.post.comment}
                    postDate={post.post.createdAt}
                    postType={post.post.postType}
                  />
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                color: colors.textLight
              }}>
                No posts found.
              </div>
            )
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '4rem 0',
            }}>
              <Spinner animation="border" style={{ color: colors.primary }} />
            </div>
          )}
        </div>
      </div>

      {/* Post Compose Modal */}
      {showPostCompose && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: colors.white,
            padding: '2rem',
            borderRadius: '1rem',
            width: '90%',
            maxWidth: '500px',
            position: 'relative',
          }}>
            <button onClick={togglePostCompose} style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: colors.textLight,
              cursor: 'pointer',
            }}>
              ×
            </button>
            <PostCompose onPostComplete={togglePostCompose} />
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsFeedContent;