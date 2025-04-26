import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuth from "./googleAuth";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import signupRightImage from "../components/assets/images/signup-right.jpg";

function SignUp() {
  const [userRole] = useState("user");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [animationProgress, setAnimationProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
  });

  async function postSignUpInfo(inputData) {
    try {
      const response = await axios.post("/api/v1/users/save", {
        ...inputData,
        role: userRole,
      });
      if (response.data?.status === "success") {
        navigate("/signin");
      } else {
        setSnackbarMessage(response.data?.message || "Signup failed");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("An error occurred during signup");
      setSnackbarOpen(true);
    }
  }

  async function postSignUpInfoWithGoogle(inputData) {
    const displayName = inputData.user?.displayName || "FirstName";
    const datas = {
      firstName: displayName,
      lastName: " ",
      email: inputData.user?.email,
      password: "PAF2023@@",
      role: userRole,
    };
    try {
      const response = await axios.post("/api/v1/users/save", datas);
      if (response.data?.status === "success") {
        navigate("/signin");
      } else {
        setSnackbarMessage(response.data?.message || "Signup failed");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("An error occurred during signup with Google");
      setSnackbarOpen(true);
    }
  }

  const handleAuth = (data) => {
    postSignUpInfoWithGoogle(data);
  };

  const colors = {
    white: "#ffffff",
    lightBlue: "#E0F2FE",
    midBlue: "#BFDBFE",
    deepBlue: "#2563EB",
    hoverBlue: "#1D4ED8",
    textDark: "#1E293B",
    textLight: "#64748B",
  };

  return (
    <>
      <div style={{
        minHeight: "100vh",
        background: colors.lightBlue,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{
          background: colors.white,
          borderRadius: "1rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          overflow: "hidden",
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 20}px)`,
          transition: "transform 0.7s ease-out, opacity 0.7s ease-out",
        }}>
          {/* Left Form */}
          <div style={{
            flex: 1,
            padding: "2.5rem",
            background: colors.white,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}>
            <h2 style={{
              color: colors.textDark,
              fontWeight: 800,
              fontSize: "2rem",
              textAlign: "center",
              marginBottom: "0.5rem",
            }}>
              Create New Account
            </h2>
            <p style={{
              color: colors.textLight,
              fontSize: "0.9rem",
              textAlign: "center",
              marginBottom: "2rem",
            }}>
              Join Foodie Crush today!
            </p>

            <GoogleAuth handleAuth={handleAuth} />

            <div style={{
              display: "flex",
              alignItems: "center",
              margin: "1.5rem 0",
            }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: colors.midBlue }} />
              <div style={{ margin: "0 1rem", fontSize: "0.75rem", color: colors.textLight, fontWeight: 600 }}>
                OR CONTINUE WITH EMAIL
              </div>
              <div style={{ flex: 1, height: "1px", backgroundColor: colors.midBlue }} />
            </div>

            <Formik
              validationSchema={schema}
              initialValues={{ email: "", password: "", firstName: "", lastName: "" }}
              onSubmit={(values, { setSubmitting }) => {
                postSignUpInfo(values);
                setSubmitting(false);
              }}
            >
              {({
                handleSubmit,
                handleChange,
                values,
                touched,
                errors,
              }) => (
                <Form noValidate onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {["firstName", "lastName", "email", "password"].map((field, index) => (
                    <Form.Group key={index}>
                      <Form.Label style={{ fontWeight: 600, fontSize: "0.9rem", color: colors.textDark }}>
                        {(field === "firstName" && "First Name") ||
                         (field === "lastName" && "Last Name") ||
                         (field.charAt(0).toUpperCase() + field.slice(1))}
                      </Form.Label>
                      <Form.Control
                        type={field.includes("password") ? "password" : field.includes("email") ? "email" : "text"}
                        name={field}
                        value={values[field]}
                        onChange={handleChange}
                        isInvalid={touched[field] && errors[field]}
                        placeholder={`Enter your ${field}`}
                        style={{
                          padding: "0.75rem",
                          borderRadius: "0.5rem",
                          border: `1px solid ${colors.midBlue}`,
                          fontSize: "0.875rem",
                        }}
                      />
                      <Form.Control.Feedback type="invalid" style={{ fontSize: "0.75rem" }}>
                        Please enter your {field}
                      </Form.Control.Feedback>
                    </Form.Group>
                  ))}

                  <Button
                    type="submit"
                    style={{
                      marginTop: "1rem",
                      backgroundColor: colors.deepBlue,
                      border: "none",
                      padding: "0.75rem",
                      fontWeight: 600,
                      fontSize: "1rem",
                      borderRadius: "0.5rem",
                      transition: "background 0.3s",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.hoverBlue}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.deepBlue}
                  >
                    Sign Up <BsFillPersonPlusFill style={{ marginLeft: "0.5rem" }} />
                  </Button>

                  <div style={{
                    textAlign: "center",
                    marginTop: "1rem",
                    fontSize: "0.85rem",
                    color: colors.textLight,
                  }}>
                    Already have an account?{" "}
                    <Link to="/signin" style={{ textDecoration: "none", color: colors.deepBlue, fontWeight: 600 }}>
                      Sign In
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          {/* Right Background Image Section */}
          <div style={{
            flex: 1,
            backgroundImage: `url(${signupRightImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.white,
            textAlign: "center",
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.4)",
            }}></div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
                Welcome to Foodie Crush
              </h2>
              <p style={{ fontSize: "1rem", opacity: 0.9 }}>
                Create your account and join a world of amazing recipes and foodies!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ backgroundColor: "#fef2f2", color: colors.textDark }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SignUp;