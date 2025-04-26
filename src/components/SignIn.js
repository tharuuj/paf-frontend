import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import GoogleAuth from "./googleAuth";
import { RiLoginBoxLine } from "react-icons/ri";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import signinImage from "../components/assets/images/signin.jpg";
function SignIn() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [animationProgress, setAnimationProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  async function postSignInInfo(inputData) {
    try {
      const response = await axios.post("/api/v1/users/signin", {
        email: inputData.email,
        password: inputData.password,
      });

      if (response.data.status === "success") {
        localStorage.setItem("psnUserId", response.data.payload.user.id);
        localStorage.setItem("psnUserFirstName", response.data.payload.user.firstName);
        localStorage.setItem("psnUserLastName", response.data.payload.user.lastName);
        localStorage.setItem("psnUserEmail", response.data.payload.user.email);
        localStorage.setItem("psnBio", response.data.payload.user.bio);
        localStorage.setItem("psnToken", response.data.payload.token);
        navigate("/newsfeed");
      } else {
        setSnackbarMessage("Authentication failed");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Authentication error");
      setSnackbarOpen(true);
    }
  }

  const colors = {
    white: "#FFFFFF",
    deepBlue: "#2563eb",
    lightBlue: "#eff6ff",
    grey: "#6b7280",
    darkGrey: "#1f2937",
  };

  return (
    <>
      <div style={{
        minHeight: '100vh',
        backgroundColor: colors.lightBlue,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1000px',
          background: colors.white,
          display: 'flex',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 30}px)`,
          transition: 'transform 0.7s ease-out, opacity 0.7s ease-out',
          position: 'relative',
          zIndex: 2
        }}>
          
          {/* Left Form Side */}
          <div style={{
            flex: 1,
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h2 style={{
              fontWeight: '700',
              color: colors.darkGrey,
              marginBottom: '1rem',
              fontSize: '1.75rem'
            }}>
              Welcome to Foodie Crush
            </h2>
            <p style={{
              color: colors.grey,
              marginBottom: '1.5rem',
              fontSize: '0.95rem'
            }}>
              Sign in to your account
            </p>

            <GoogleAuth />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '1rem 0'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
              <span style={{ margin: '0 1rem', fontSize: '0.8rem', color: colors.grey }}>or sign in with email</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            </div>

            <Formik
              validationSchema={schema}
              initialValues={{
                email: "",
                password: "",
              }}
              onSubmit={(values, { setSubmitting }) => {
                postSignInInfo(values);
                setSubmitting(false);
              }}
            >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Form.Group controlId="signInEmail">
                    <Form.Label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      isInvalid={touched.email && errors.email}
                      placeholder="Enter your email"
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="signInPassword">
                    <Form.Label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      isInvalid={touched.password && errors.password}
                      placeholder="Enter your password"
                    />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    style={{
                      marginTop: '1rem',
                      backgroundColor: colors.deepBlue,
                      border: 'none',
                      fontWeight: '600',
                      padding: '0.75rem',
                      fontSize: '0.95rem'
                    }}
                  >
                    Sign In <RiLoginBoxLine style={{ marginLeft: '0.5rem' }} />
                  </Button>
                </Form>
              )}
            </Formik>

            <p style={{
              marginTop: '1rem',
              fontSize: '0.85rem',
              color: colors.grey
            }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: colors.deepBlue, fontWeight: '600', textDecoration: 'none' }}>
                Sign Up
              </Link>
            </p>
          </div>

          {/* Right Static Image */}
          <div style={{
            flex: 1,
            backgroundImage: `url(${signinImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "400px"
          }}>
          </div>
        </div>
      </div>

      {/* Snackbar Error */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SignIn;