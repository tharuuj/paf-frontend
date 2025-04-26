import React, { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Hashicon } from "@emeraldpay/hashicon-react";
import { useDispatch, useSelector } from "react-redux";
import { getFollowingPosts } from "../feature/followingPost/followingPostSlice";
import MultiImageUpload from "../feature/multiImageUpload";
import { Share2, Image, Send, ChevronDown, Lightbulb, HelpCircle, Briefcase, Palette, Compass, Zap, MessageCircle } from 'lucide-react';

function PostCompose({ onPostComplete }) {
  const dispatch = useDispatch();
  const userIds = localStorage.getItem("psnUserId")
  const storeFollowingPosts = useSelector((state) => state.followingPostReducer.followingPosts);

  // Professional color palette
  const colors = {
    primary: '#333333', // Dark grey
    secondary: '#555555', // Medium grey
    accent: '#222222', // Almost black
    background: '#ffffff', // White
    lightGrey: '#f5f5f5', // Very light grey for sections
    border: '#e0e0e0', // Light grey for borders
  };

  const [userFullname, setUserFullname] = useState(
    localStorage.getItem("psnUserFirstName") +
    " " +
    localStorage.getItem("psnUserLastName")
  );
  const [userId, setUserId] = useState(localStorage.getItem("psnUserId"));
  const [postContent, setPostContent] = useState("");
  const [postContentCount, setPostContentCount] = useState(0);
  const [disablePostButton, setDisablePostButton] = useState(true);
  const [file, setFile] = useState(null);
  const [MultiImages, setMultiImages] = useState(null);
  const [MultiImagesUrl, setMultiImagesUrl] = useState(null);
  const [file64String, setFile64String] = useState(null);
  const [file64StringWithType, setFile64StringWithType] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState({
    id: "insight",
    name: "Share Insight",
    icon: <Lightbulb size={16} />,
    color: colors.primary
  });
  
  // Post type options - updated with grayscale colors
  const postTypes = [
    {
      id: "insight",
      name: "Share Insight",
      icon: <Lightbulb size={16} />,
      color: colors.primary,
      placeholder: "Share your knowledge or insights..."
    },
    {
      id: "question",
      name: "Ask Question",
      icon: <HelpCircle size={16} />,
      color: colors.primary,
      placeholder: "What would you like to know?"
    },
    {
      id: "opportunity",
      name: "Job/Opportunity",
      icon: <Briefcase size={16} />,
      color: colors.primary,
      placeholder: "Share a job opening or opportunity..."
    },
    {
      id: "showcase",
      name: "Portfolio Showcase",
      icon: <Palette size={16} />,
      color: colors.primary,
      placeholder: "Show off your latest work or project..."
    },
    {
      id: "event",
      name: "Event/Meetup",
      icon: <Compass size={16} />,
      color: colors.primary,
      placeholder: "Share an event or gathering..."
    },
    {
      id: "resource",
      name: "Learning Resource",
      icon: <Zap size={16} />,
      color: colors.primary,
      placeholder: "Share a helpful resource or tutorial..."
    },
    {
      id: "discussion",
      name: "Start Discussion",
      icon: <MessageCircle size={16} />,
      color: colors.primary,
      placeholder: "What's on your mind to discuss?"
    }
  ];
  
  var marray = [];

  function showSuccessMessage(inputMessage) {
    toast.success(inputMessage, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  function showFailMessage(inputMessage) {
    toast.error(inputMessage, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  function handleContentChange(e) {
    setPostContent(e.target.value);
    setPostContentCount(e.target.value.length);
    if (postContentCount === 0 || postContentCount > 200) {
      setDisablePostButton(true);
    } else {
      setDisablePostButton(false);
    }
  }

  async function createPost(inputContent) {
    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/insertpost",
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: {
          id: null,
          userId: localStorage.getItem("psnUserId"),
          content: inputContent,
          image: file64StringWithType,
          createdAt: null,
          love: null,
          share: null,
          comment: null,
          images: MultiImagesUrl,
          postType: selectedPostType.id
        },
      });
  
      if (response.data !== null && response.data.status === "success") {
        showSuccessMessage("Posted successfully!");
        setPostContent("");
        setPostContentCount(0);
        setDisablePostButton(true);
        setFile64String(null);
        setFile64StringWithType(null);
        setMultiImages(null);
        setMultiImagesUrl(null);
        if (onPostComplete) onPostComplete();
      }
  
      if (response.data !== null && response.data.status === "fail") {
        showFailMessage("Post failed. Please try again later!");
      }
    } catch (error) {
      showFailMessage("Post failed. Please try again later!");
    }
  }

  function onUploadFileChange(e) {
    setFile64String(null);
    if (e.target.files < 1 || !e.target.validity.valid) {
      return;
    }
    compressImageFile(e);
  }

  function fileToBase64(file, cb) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(null, reader.result);
    };
    reader.onerror = function (error) {
      cb(error, null);
    };
  }

  async function compressImageFile(event) {
    const imageFile = event.target.files[0];

    const options = {
      maxWidthOrHeight: 500,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      fileToBase64(compressedFile, (err, result) => {
        if (result) {
          setFile(result);
          setFile64StringWithType(result);
          setFile64String(String(result.split(",")[1]));
        }
      });
    } catch (error) {
      setFile64String(null);
    }
  }

  async function compressImageFileTest(images) {
    const imageFile = images;

    const options = {
      maxWidthOrHeight: 1000,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);

      fileToBase64(compressedFile, (err, result) => {
        if (result) {
          let url = `${result}`
          marray.push(url)
          setMultiImagesUrl(marray)
          return result
        }
      });
    } catch (error) {
      setFile64String(null);
    }
  }

  async function handleCreatePost(e) {
    e.preventDefault();
    createPost(postContent);
    dispatch(getFollowingPosts());
  }

  async function multiHandle(mediaItems) {
    if (mediaItems && mediaItems.length > 0) {
      const base64Strings = mediaItems.map(item => item.base64);
      setMultiImagesUrl(base64Strings);
    }
  }

  function selectPostType(type) {
    setSelectedPostType(type);
    setIsTypeDropdownOpen(false);
  }

  const getPlaceholder = () => {
    const type = postTypes.find(type => type.id === selectedPostType.id);
    return type ? type.placeholder : "Share your skills or ask a question...";
  };

  return (
    <div style={{
      width: '100%',
      margin: '0 auto',
      padding: '0.5rem'
    }}>
      <div style={{
        background: colors.background,
        borderRadius: '4px',
        padding: '1.25rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${colors.border}`,
        position: 'relative',
        overflow: 'hidden'
      }}>        
        <ToastContainer />

        <Form style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
            justifyContent: 'space-between'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{
                marginRight: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.lightGrey,
                borderRadius: '50%',
                padding: '0.25rem',
                width: '2.5rem',
                height: '2.5rem',
                border: `1px solid ${colors.border}`
              }}>
                {userId ? (
                  <Hashicon value={userId} size={32} />
                ) : (
                  <div style={{
                    backgroundColor: colors.background,
                    borderRadius: '50%',
                    padding: '0.5rem'
                  }}>
                    <Share2 size={20} style={{ color: colors.primary }} />
                  </div>
                )}
              </div>
              <div style={{
                fontWeight: '500',
                fontSize: '1rem',
                color: colors.primary
              }}>
                {userFullname || 'Talent Mesh User'}
              </div>
            </div>

            {/* Post Type Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: colors.lightGrey,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  padding: '0.4rem 0.6rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: colors.primary,
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>{selectedPostType.icon}</span>
                <span>{selectedPostType.name}</span>
                <ChevronDown size={14} style={{ marginLeft: '0.5rem', transition: 'transform 0.2s ease', transform: isTypeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              
              {isTypeDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.25rem)',
                  right: 0,
                  zIndex: 10,
                  background: colors.background,
                  borderRadius: '4px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: `1px solid ${colors.border}`,
                  width: '200px',
                  padding: '0.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.1rem'
                }}>
                  {postTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => selectPostType(type)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.5rem',
                        borderRadius: '3px',
                        border: 'none',
                        background: selectedPostType.id === type.id ? colors.lightGrey : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.2s ease',
                        color: colors.primary
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = colors.lightGrey;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = selectedPostType.id === type.id ? colors.lightGrey : 'transparent';
                      }}
                    >
                      <span style={{ marginRight: '0.75rem' }}>{type.icon}</span>
                      <span style={{ color: colors.primary, fontSize: '0.85rem' }}>{type.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Post Type Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.4rem 0.6rem',
            marginBottom: '0.75rem',
            borderRadius: '3px',
            background: colors.lightGrey,
            border: `1px solid ${colors.border}`,
          }}>
            <span style={{ color: colors.primary, marginRight: '0.5rem' }}>
              {selectedPostType.icon}
            </span>
            <span style={{ color: colors.primary, fontSize: '0.85rem', fontWeight: '500' }}>
              {selectedPostType.name}
            </span>
          </div>

          <Form.Group style={{ marginBottom: '0.75rem' }}>
            <Form.Control
              as="textarea"
              placeholder={getPlaceholder()}
              value={postContent}
              onChange={handleContentChange}
              style={{
                resize: 'none',
                height: '6rem',
                padding: '0.75rem',
                borderRadius: '4px',
                border: `1px solid ${colors.border}`,
                fontSize: '0.9rem',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                background: colors.background,
                color: colors.primary
              }}
              onFocus={(e) => e.target.style.borderColor = colors.secondary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </Form.Group>

          <div style={{
            backgroundColor: colors.lightGrey,
            borderRadius: '4px',
            padding: '0.6rem',
            marginBottom: '0.75rem',
            border: `1px solid ${colors.border}`
          }}>
            <MultiImageUpload multiHandle={multiHandle} />
          </div>

          {file64StringWithType && (
            <div style={{
              marginTop: '0.75rem',
              marginBottom: '0.75rem',
              borderRadius: '4px',
              overflow: 'hidden',
              maxHeight: '250px',
              display: 'flex',
              justifyContent: 'center',
              border: `1px solid ${colors.border}`
            }}>
              <img 
                src={file64StringWithType} 
                alt="preview" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '250px',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.5rem'
          }}>
            <span style={{
              fontSize: '0.8rem',
              color: postContentCount > 180 ? (postContentCount > 200 ? '#666666' : '#444444') : '#666666'
            }}>
              {postContentCount}/200 characters
            </span>
            
            <Button
              onClick={handleCreatePost}
              disabled={disablePostButton}
              style={{
                background: disablePostButton ? '#d1d5db' : colors.primary,
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'white',
                cursor: disablePostButton ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.85rem'
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onMouseOver={(e) => !disablePostButton && (e.currentTarget.style.backgroundColor = colors.secondary)}
              onMouseOut={(e) => !disablePostButton && (e.currentTarget.style.backgroundColor = colors.primary)}
            >
              <span>Post {selectedPostType.name}</span>
              <Send size={14} />
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default PostCompose;