import React, { useEffect, useState } from "react";
import { Hashicon } from "@emeraldpay/hashicon-react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import {
  RiHeartFill,
  RiHeartLine,
  RiMessage2Fill,
  RiBookmarkLine,
  RiBookmarkFill,
  RiMoreFill
} from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import { BsFillPencilFill } from "react-icons/bs";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  addLove,
  addComment,
} from "../feature/followingPost/followingPostSlice";
import MultiImageUploadView from "../feature/multiImageUploadView";
import axios from "axios";

function PostItem(props) {
  const dispatch = useDispatch();

  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");

  // Professional color palette matching NewsFeedContent
  const colors = {
    primary: '#333333', // Dark grey
    secondary: '#555555', // Medium grey
    accent: '#222222', // Almost black
    background: '#ffffff', // White
    lightGrey: '#f5f5f5', // Very light grey for sections
    border: '#e0e0e0', // Light grey for borders
    interactive: '#0095f6', // Blue for interactive elements
    danger: '#ed4956', // Red for destructive actions
    success: '#0095f6', // Using blue for success actions too
    textLight: '#8e8e8e', // Light grey for secondary text
    textDark: '#262626', // Dark grey for primary text
  };

  const [loveStatus, setLoveStatus] = useState(false);
  const [commentStatus, setCommentStatus] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [sendButtonDisable, setSendButtonDisable] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(
    localStorage.getItem("psnUserId")
  );
  const [postId, setPostId] = useState(props.postId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedContent, setEditedContent] = useState(props.content || "");
  const [editedHashtags, setEditedHashtags] = useState(props.hashtags || []);
  const [editedImages, setEditedImages] = useState(props.images || []);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [Cedit, setCedit] = useState(true);
  const [CurrentCommentitem, setCurrentCommentitem] = useState(null);
  const [CeditComment, setCeditComment] = useState("");

  // Extract or use provided hashtags
  const hashtags = props.hashtags || extractHashtags(props.content);

  // Function to extract hashtags from content
  function extractHashtags(content) {
    if (!content) return [];
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const matches = content.match(hashtagRegex);
    return matches || [];
  }

  // Format hashtags as a string for display
  function formatHashtags(tags) {
    if (!tags || tags.length === 0) return "";
    return tags.join(" ");
  }

  // Check if post is saved when component mounts
  useEffect(() => {
    checkIfPostIsSaved();
  }, []);

  // Function to check if post is saved
  const checkIfPostIsSaved = () => {
    axios({
      method: "post",
      url: "/api/v1/ispostsaved",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: {
        userId: currentUserId,
        postId: props.postId
      }
    })
    .then((res) => {
      if (res.data.status === "success") {
        setIsSaved(res.data.payload);
      }
    })
    .catch((err) => {
      console.error("Error checking if post is saved:", err);
    });
  };

  function handleLoveClick(e) {
    if (!props.loveList.includes(currentUserId)) {
      setLoveStatus(true);
      dispatch(addLove({ postId: postId, userId: currentUserId }));
    } else {
      setLoveStatus(false);
      dispatch(addLove({ postId: postId, userId: currentUserId }));
    }
  }

  function handleCommentButtonClick(e) {
    setCommentStatus(!commentStatus);
  }

  function handleCommentContentChange(e) {
    e.preventDefault();
    setCommentContent(e.target.value);
    if (e.target.value.length > 0 && e.target.value.length <= 100) {
      setSendButtonDisable(false);
    } else {
      setSendButtonDisable(true);
    }
  }

  function sendComment(e) {
    dispatch(
      addComment({
        postId: postId,
        newComment: {
          userId: localStorage.getItem("psnUserId"),
          userFullname:
            localStorage.getItem("psnUserFirstName") +
            " " +
            localStorage.getItem("psnUserLastName"),
          content: commentContent,
        },
      })
    );
    setCommentContent("");
    setSendButtonDisable(true);
  }

  function handlePrevImage() {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? props.images.length - 1 : prevIndex - 1
    );
  }

  function handleNextImage() {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === props.images.length - 1 ? 0 : prevIndex + 1
    );
  }

  const handlesave = () => {
    const endpoint = isSaved ? "/api/v1/unsavepost" : "/api/v1/savepost";
    
    axios({
      method: "post",
      url: endpoint,
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: {
        userId: currentUserId,
        postId: props.postId
      }
    })
    .then((res) => {
      if (res.data.status === "success") {
        setIsSaved(!isSaved);
      }
    })
    .catch((err) => {
      console.error("Error saving/unsaving post:", err);
    });
  };

  const handleEditModalOpen = () => {
    setShowOptionsMenu(false);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  const handleEditSubmit = () => {
    const updatedPostData = {
      id: props.postId,
      content: editedContent,
      hashtags: editedHashtags,
      images: editedImages
    };

    axios({
      method: "put",
      url: "/api/v1/editpost",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: updatedPostData,
    })
      .then((res) => {
        console.log("Post updated successfully");
        setShowEditModal(false);
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error updating post:", err);
      });
  };

  const handleCommentEdit = (commentItem) => {
    setCedit(false);
    setCeditComment(commentItem.content);
    setCurrentCommentitem(commentItem);
  };

  const updateComment = () => {
    var data = {
      "commentEntity": {
        "userId": localStorage.getItem("psnUserId"),
        "userFullname": localStorage.getItem("psnUserFirstName") +
          " " +
          localStorage.getItem("psnUserLastName"),
        "content": CeditComment,
        "id": CurrentCommentitem.id ? CurrentCommentitem.id : ""
      },
      "postId": {
        "id": postId
      }
    };
    axios({
      method: "put",
      url: "/api/v1/editcomment",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: data
    }).then((res) => {
      setCedit(true);
      window.location.reload();
    });
  };

  const deleteComment = (commentItem) => {
    setCeditComment(commentItem.content);
    setCurrentCommentitem(commentItem);
    var data = {
      "commentEntity": {
        "userId": localStorage.getItem("psnUserId"),
        "userFullname": localStorage.getItem("psnUserFirstName") +
          " " +
          localStorage.getItem("psnUserLastName"),
        "content": CeditComment,
        "id": commentItem.id ? commentItem.id : ""
      },
      "postId": {
        "id": postId
      }
    };
    axios({
      method: "put",
      url: "/api/v1/deletecomment",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: data
    }).then((res) => {
      window.location.reload();
    });
  };

  const handleDeleteConfirmOpen = () => {
    setShowOptionsMenu(false);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmClose = () => {
    setShowDeleteConfirm(false);
  };

  const deletePost = () => {
    axios({
      method: "delete",
      url: "/api/v1/deletepost",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: { id: props.postId },
    })
      .then((res) => {
        console.log("Post deleted successfully");
        setShowDeleteConfirm(false);
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error deleting post:", err);
      });
  };

  const isMyPost = props.userId === currentUserId;

  return (
    <div style={{
      background: colors.background,
      borderRadius: '4px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      margin: '0',
      overflow: 'hidden',
      width: '100%',
      border: `1px solid ${colors.border}`,
      transition: 'box-shadow 0.3s ease'
    }}>
      {/* Post Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: `1px solid ${colors.border}`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            overflow: 'hidden',
            marginRight: '12px',
            border: `1px solid ${colors.border}`
          }}>
            <Hashicon value={props.userId || "default"} size={40} />
          </div>
          <div>
            <p style={{
              margin: 0,
              fontWeight: '600',
              fontSize: '14px',
              color: colors.primary
            }}>
              {props.username || (props.firstName + " " + props.lastName)}
            </p>
            {props.location && (
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: colors.secondary
              }}>
                {props.location}
              </p>
            )}
          </div>
        </div>
        
        {isMyPost && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                color: colors.primary,
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.lightGrey}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <RiMoreFill size={20} />
            </button>
            
            {showOptionsMenu && (
              <div style={{
                position: 'absolute',
                right: '0',
                top: 'calc(100% + 4px)',
                backgroundColor: colors.background,
                borderRadius: '4px',
                boxShadow: '0 0 10px rgba(0,0,0,0.15)',
                zIndex: 100,
                width: '150px',
                overflow: 'hidden',
                border: `1px solid ${colors.border}`
              }}>
                <button
                  onClick={handleEditModalOpen}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    width: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderBottom: `1px solid ${colors.border}`,
                    color: colors.primary,
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.lightGrey}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <BsFillPencilFill style={{ marginRight: '12px' }} /> Edit
                </button>
                <button
                  onClick={handleDeleteConfirmOpen}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    width: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: colors.danger,
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.lightGrey}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <AiFillDelete style={{ marginRight: '12px' }} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Carousel */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '100%', // Square aspect ratio
        backgroundColor: colors.lightGrey,
        overflow: 'hidden'
      }}>
        {props.images && props.images.length > 0 ? (
          <div style={{ height: '100%', width: '100%', position: 'absolute' }}>
            <img 
              src={props.images[currentImageIndex]} 
              alt="Post content"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute'
              }}
            />
            
            {/* Image counter indicator */}
            {props.images.length > 1 && (
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                borderRadius: '12px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {currentImageIndex + 1}/{props.images.length}
              </div>
            )}
            
            {/* Navigation arrows for multiple images */}
            {props.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '16px',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'background-color 0.2s',
                    fontWeight: '600',
                    fontSize: '18px',
                    color: colors.primary
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
                >
                  &lt;
                </button>
                <button
                  onClick={handleNextImage}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '16px',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'background-color 0.2s',
                    fontWeight: '600',
                    fontSize: '18px',
                    color: colors.primary
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
                >
                  &gt;
                </button>
              </>
            )}
          </div>
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.lightGrey
          }}>
            <span style={{ color: colors.secondary, fontSize: '14px' }}>No image</span>
          </div>
        )}
      </div>

      {/* Interaction bar (likes, comments, save) */}
      <div style={{
        display: 'flex',
        padding: '12px 16px',
        borderTop: `1px solid ${colors.border}`
      }}>
        <div style={{ display: 'flex', gap: '18px', flex: 1 }}>
          <button 
            onClick={handleLoveClick}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s',
              borderRadius: '4px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {props.loveList.includes(currentUserId) ? (
              <RiHeartFill size={22} color={colors.danger} />
            ) : (
              <RiHeartLine size={22} color={colors.primary} />
            )}
          </button>
          
          <button 
            onClick={handleCommentButtonClick}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s',
              borderRadius: '4px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <RiMessage2Fill size={22} color={colors.primary} />
          </button>
        </div>
        
        <button 
          onClick={handlesave}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            borderRadius: '4px'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isSaved ? (
            <RiBookmarkFill size={22} color={colors.primary} />
          ) : (
            <RiBookmarkLine size={22} color={colors.primary} />
          )}
        </button>
      </div>

      {/* Like count */}
      {props.loveList.length > 0 && (
        <div style={{
          padding: '0 16px 8px',
        }}>
          <span style={{
            fontWeight: '600',
            fontSize: '14px',
            color: colors.primary
          }}>
            {props.loveList.length} {props.loveList.length === 1 ? 'like' : 'likes'}
          </span>
        </div>
      )}

      {/* Post content: username and caption */}
      <div style={{
        padding: '0 16px 12px',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        <p style={{ margin: '0' }}>
          <span style={{ 
            fontWeight: '600', 
            marginRight: '4px',
            color: colors.primary
          }}>
            {props.username || (props.firstName + " " + props.lastName)}
          </span>
          <span style={{ color: colors.textDark }}>{props.content}</span>
        </p>
        
        {/* Dynamic Hashtags */}
        {hashtags && hashtags.length > 0 && (
          <p style={{ 
            margin: '6px 0 0 0',
            color: colors.interactive,
            fontSize: '14px'
          }}>
            {formatHashtags(hashtags)}
          </p>
        )}
      </div>
      
      {/* View all comments link */}
      {props.commentList && props.commentList.length > 2 && !commentStatus && (
        <div style={{
          padding: '0 16px 6px',
          fontSize: '14px',
          color: colors.textLight
        }}>
          <button 
            onClick={handleCommentButtonClick}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0',
              fontSize: '14px',
              color: colors.textLight,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            View all {props.commentList.length} comments
          </button>
        </div>
      )}

      {/* Preview of comments (showing just 2) */}
      {props.commentList && props.commentList.length > 0 && !commentStatus && (
        <div style={{
          padding: '0 16px 10px',
          fontSize: '14px'
        }}>
          {props.commentList.slice(0, 2).map((comment, index) => (
            <p key={index} style={{ margin: '0 0 4px 0' }}>
              <span style={{ 
                fontWeight: '600', 
                marginRight: '4px',
                color: colors.primary
              }}>
                {comment.userFullname.split(' ')[0]}
              </span>
              <span style={{ color: colors.textDark }}>{comment.content}</span>
            </p>
          ))}
        </div>
      )}

      {/* Post time */}
      <div style={{
        padding: '0 16px 16px',
        fontSize: '12px',
        color: colors.textLight,
        textTransform: 'uppercase',
        letterSpacing: '0.2px'
      }}>
        {timeAgo.format(new Date(props.postDate).getTime())}
      </div>

      {/* Comments section when expanded */}
      {commentStatus && (
        <div style={{
          borderTop: `1px solid ${colors.border}`,
          padding: '16px',
          backgroundColor: colors.background
        }}>
          <div style={{
            maxHeight: '250px',
            overflowY: 'auto',
            marginBottom: '16px',
            padding: '4px 0'
          }}>
            {props.commentList && props.commentList.map((commentItem, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  marginBottom: '16px',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginRight: '12px',
                  border: `1px solid ${colors.border}`
                }}>
                  <Hashicon value={commentItem.userId} size={32} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0', fontSize: '14px' }}>
                    <span style={{ 
                      fontWeight: '600', 
                      marginRight: '4px',
                      color: colors.primary
                    }}>
                      {commentItem.userFullname.split(' ')[0]}
                    </span>
                    <span style={{ color: colors.textDark }}>{commentItem.content}</span>
                  </p>
                  <div style={{ 
                    display: 'flex',
                    gap: '16px',
                    marginTop: '6px',
                    fontSize: '12px',
                    color: colors.textLight
                  }}>
                    <span style={{ cursor: 'pointer' }}>Reply</span>
                    {commentItem.userId === currentUserId && (
                      <>
                        <span 
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleCommentEdit(commentItem)}
                        >
                          Edit
                        </span>
                        <span 
                          style={{ cursor: 'pointer', color: colors.danger }}
                          onClick={() => deleteComment(commentItem)}
                        >
                          Delete
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comment input */}
          <div style={{
            display: 'flex',
            borderTop: `1px solid ${colors.border}`,
            paddingTop: '16px'
          }}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentContent}
              onChange={handleCommentContentChange}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                padding: '8px 0',
                color: colors.primary
              }}
            />
            <button
              onClick={sendComment}
              disabled={sendButtonDisable}
              style={{
                background: 'none',
                border: 'none',
                color: sendButtonDisable ? colors.textLight : colors.interactive,
                fontWeight: '600',
                cursor: sendButtonDisable ? 'default' : 'pointer',
                padding: '0 0 0 12px',
                fontSize: '14px',
                transition: 'opacity 0.2s'
              }}
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* Comment edit form */}
      {!Cedit && (
        <div style={{
          padding: '16px',
          borderTop: `1px solid ${colors.border}`,
          backgroundColor: colors.lightGrey
        }}>
          <textarea
            value={CeditComment}
            onChange={(e) => setCeditComment(e.target.value)}
            style={{
              width: '100%',
              borderRadius: '4px',
              padding: '10px',
              fontSize: '14px',
              border: `1px solid ${colors.border}`,
              resize: 'none',
              marginBottom: '12px',
              minHeight: '80px',
              outline: 'none',
              color: colors.primary
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              onClick={() => setCedit(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: `1px solid ${colors.border}`,
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                color: colors.primary,
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.border}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Cancel
            </button>
            <button
              onClick={updateComment}
              style={{
                padding: '8px 16px',
                backgroundColor: colors.primary,
                border: 'none',
                color: 'white',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.primary}
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleEditModalClose} centered>
        <Modal.Header closeButton style={{ borderBottom: `1px solid ${colors.border}` }}>
          <Modal.Title style={{ fontSize: '18px', fontWeight: '600', color: colors.primary }}>
            Edit Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{ minHeight: '100px' }}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Hashtags (separated by spaces, including #)</Form.Label>
              <Form.Control
                type="text"
                value={editedHashtags ? editedHashtags.join(" ") : ""}
                onChange={(e) => {
                  const tags = e.target.value.split(" ")
                    .map(tag => tag.trim())
                    .filter(tag => tag.startsWith("#"));
                  setEditedHashtags(tags);
                }}
                placeholder="#hashtag1 #hashtag2 #hashtag3"
              />
            </Form.Group>
            
            <Form.Group>
              <Form.Label>Images (Comma-separated URLs)</Form.Label>
              <Form.Control
                type="text"
                value={editedImages ? editedImages.join(", ") : ""}
                onChange={(e) => {
                  const urls = e.target.value.split(",").map(url => url.trim()).filter(url => url);
                  setEditedImages(urls);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={handleEditModalClose}
          >
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={handleEditSubmit}
            style={{ backgroundColor: '#333333', borderColor: '#333333' }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={handleDeleteConfirmClose} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '16px', fontWeight: '600' }}>
            Delete Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this post? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={handleDeleteConfirmClose}
          >
            Cancel
          </Button>
          <Button 
            variant="danger"
            onClick={deletePost}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PostItem;