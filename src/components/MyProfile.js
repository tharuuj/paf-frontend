import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfilePosts, getProfileInfo } from "../feature/checkProfile/checkProfileSlice";
import PostItem from "./PostItem";
import SavedPosts from "./SavedPosts";
import { Button, Form, Modal } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Utensils, BookOpen, Pencil, UserX, Image, MapPin, Briefcase, Globe } from 'lucide-react';

function MyProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const postList = useSelector((state) => state.checkProfileReducer.postList);
  const userInfo = useSelector((state) => state.checkProfileReducer.profileInfo);

  const [editPostId, setEditPostId] = useState(null);
  const [editedPostContent, setEditedPostContent] = useState("");
  const [BioContent, setBioContent] = useState(localStorage.getItem("psnBio") || "");
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEditModal, setShowEditModal] = useState(false);

  const schema = yup.object().shape({
    bio: yup.string().required("Bio is required"),
  });

  useEffect(() => {
    if (!localStorage.getItem("psnToken")) {
      navigate("/unauthorized");
    } else {
      dispatch(getProfilePosts(localStorage.getItem("psnUserId")));
      dispatch(getProfileInfo(localStorage.getItem("psnUserId")));
    }
  }, []);

  const showSuccessMessage = (msg) => toast.success(msg, { position: "bottom-center", autoClose: 3000, theme: "colored" });
  const showFailMessage = (msg) => toast.error(msg, { position: "bottom-center", autoClose: 3000, theme: "colored" });

  const handleEditPost = (postItem) => {
    setEditPostId(postItem.id);
    setEditedPostContent(postItem.content || "");
  };

  const handleSavePost = (postItem) => {
    const updatedPost = { ...postItem, content: editedPostContent };
    updatePost(updatedPost);
  };

  const updatePost = async (obj) => {
    try {
      const res = await axios.put("/api/v1/editpost", obj, { headers: { Authorization: localStorage.getItem("psnToken") } });
      if (res.data?.status === "success") {
        showSuccessMessage("Post updated successfully!");
        window.location.reload();
      } else {
        showFailMessage("Failed to update post.");
      }
    } catch (error) {
      showFailMessage("Error occurred.");
    }
  };

  const handleDeletePost = async (postItem) => {
    try {
      const res = await axios.delete("/api/v1/deletepost", {
        headers: { Authorization: localStorage.getItem("psnToken") },
        data: { id: postItem.id }
      });
      if (res.data?.status === "success") {
        showSuccessMessage("Post deleted successfully!");
        window.location.reload();
      } else {
        showFailMessage("Failed to delete post.");
      }
    } catch (error) {
      showFailMessage("Error occurred.");
    }
  };

  const handleSubmitBio = async (values) => {
    setSubmitting(true);
    try {
      const obj = {
        firstName: localStorage.getItem("psnUserFirstName"),
        lastName: localStorage.getItem("psnUserLastName"),
        email: localStorage.getItem("psnUserEmail"),
        password: "123456",
        role: "user",
        id: localStorage.getItem("psnUserId"),
        nic: localStorage.getItem("nic"),
        bio: values.bio
      };
      const res = await axios.put("/api/v1/users/update", obj, { headers: { Authorization: localStorage.getItem("psnToken") } });
      localStorage.setItem("psnBio", res.data.payload.bio);
      showSuccessMessage("Profile updated!");
      setBioContent(res.data.payload.bio);
      setShowEditModal(false);
    } catch (error) {
      showFailMessage("Failed to update bio.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        await axios.delete("/api/v1/users/delete", {
          headers: { Authorization: localStorage.getItem("psnToken") },
          data: { id: localStorage.getItem("psnUserId") }
        });
        localStorage.clear();
        showSuccessMessage("Account deleted.");
        navigate("/signin");
      } catch (error) {
        showFailMessage("Failed to delete account.");
      }
    }
  };

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <ToastContainer />

      {/* Cover Section */}
      <div style={{ height: "250px", backgroundColor: "#0b2447", position: "relative", borderRadius: "0 0 8px 8px" }}>
        <div style={{
          position: "absolute", bottom: "-60px", left: "50%", transform: "translateX(-50%)",
          width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "#19304f", border: "4px solid white",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", fontWeight: "bold", color: "white"
        }}>
          {userInfo?.firstName?.charAt(0)}{userInfo?.lastName?.charAt(0)}
        </div>
      </div>

      {/* Profile Info */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 16px 0", textAlign: "center" }}>
        <h2>{userInfo?.firstName} {userInfo?.lastName}</h2>
        <p style={{ color: "#65676b" }}>{BioContent || "Add a bio"}</p>

        {/* Action Buttons */}
        <div style={{ margin: "20px 0", display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button variant="primary" onClick={() => setShowEditModal(true)}>Edit Profile</Button>
          <Button variant="outline-primary" onClick={() => setShowModal(true)}>View Posts</Button>
        </div>

        {/* Tabs */}
        <div style={{ margin: "20px 0", borderBottom: "2px solid #dee2e6", display: "flex", justifyContent: "center", gap: "30px" }}>
          {["posts", "about", "saved"].map(tab => (
            <div key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                cursor: "pointer",
                borderBottom: activeTab === tab ? "3px solid #0b2447" : "none",
                color: activeTab === tab ? "#0b2447" : "#6c757d",
                paddingBottom: "8px"
              }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "posts" && (
          <div style={{ textAlign: "left" }}>
            {postList?.length ? postList.map(post => (
              <PostItem
                key={post.id}
                postId={post.id}
                userId={post.userId}
                firstName={userInfo?.firstName || ""}
                lastName={userInfo?.lastName || ""}
                content={post.content}
                image={post.image}
                loveList={post.love || []}
                shareList={post.share || []}
                commentList={post.comment || []}
                postDate={post.createdAt}
                editClick={() => handleEditPost(post)}
                deleteClick={() => handleDeletePost(post)}
                images={post.images || []}
              />
            )) : <p>No posts yet.</p>}
          </div>
        )}

        {activeTab === "about" && (
          <div style={{ textAlign: "left" }}>
            <h4>About</h4>
            <p>{BioContent || "No bio available."}</p>
          </div>
        )}

        {activeTab === "saved" && (
          <SavedPosts />
        )}
      </div>

      {/* Posts Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>My Posts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {postList?.length ? postList.map(post => (
            <PostItem
              key={post.id}
              postId={post.id}
              userId={post.userId}
              firstName={userInfo?.firstName || ""}
              lastName={userInfo?.lastName || ""}
              content={post.content}
              image={post.image}
              loveList={post.love || []}
              shareList={post.share || []}
              commentList={post.comment || []}
              postDate={post.createdAt}
              editClick={() => handleEditPost(post)}
              deleteClick={() => handleDeletePost(post)}
              images={post.images || []}
            />
          )) : <p>No posts found.</p>}
        </Modal.Body>
      </Modal>

      {/* Edit Bio Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Bio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={schema}
            initialValues={{ bio: BioContent }}
            onSubmit={handleSubmitBio}
          >
            {({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="bio">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    type="text"
                    name="bio"
                    value={values.bio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.bio && !!errors.bio}
                    as="textarea"
                    rows={4}
                  />
                  <Form.Control.Feedback type="invalid">{errors.bio}</Form.Control.Feedback>
                </Form.Group>
                <div className="d-flex justify-content-end mt-3">
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default MyProfile;