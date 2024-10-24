import React, { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import styles from "./login.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";

export function LogIn() {
  const [alertMessage, setAlertMessage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const onLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const pin = e.target.pin.value;

    try {
      // call the login service
      const response = await fetch("http://localhost:3100/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, pin }),
      });

      const json = await response.json();
      //if get success response navigate to homepage
      console.log(json.success);
      if (json.success) {
        setAlertMessage({
          type: "success",
          message: "Logged In",
        });
        navigate("/");
      } else {
        console.log("error");
        setAlertMessage({
          type: "error",
          message: json.message,
        });
        console.error("Error: " + json.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Grid container spacing={1}>
      {/* Left Column */}
      <Grid item lg={6} xs={12} sm={12} style={{ padding: 0 }}>
        <div className={styles.leftCol}>
          <img
            src={require("../images/logo-color.png")}
            style={{
              width: isMobile ? "500px" : "700px",
              height: isMobile ? "500px" : "700px",
            }}
          />
          <h1
            style={{
              marginTop: isMobile ? "-100px" : "-200px",
              width: "70%",
              textAlign: "center",
              fontSize: "30px",
              color: "white",
            }}
          >
            ABC bank group is personal finance, made simple.
          </h1>
        </div>
      </Grid>

      {/* Right Column */}
      <Grid item lg={6} xs={12} sm={12}>
        <div className={styles.rightCol}>
          <h1>Login</h1>
          <p style={{ fontWeight: "bold", paddingBottom: "20px" }}>
            Login to your account to start using your app
          </p>
          <form onSubmit={onLogin}>
            <label>Account Email</label>
            <input type="text" placeholder="account@example.com" name="email" />
            <label>Account Password</label>
            <input
              type="password"
              placeholder="******"
              name="pin"
              title="Please enter a 6-digit number"
              required
            />
            <input
              type="submit"
              value="Login"
              className={styles.submitButton}
              required
            />
          </form>
          <p>
            New to the app?{" "}
            <Link
              to="/new"
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              Register Now
            </Link>
          </p>
          {/* Conditionally render the Alert component */}
          {alertMessage && (
            <Alert variant="filled" severity={alertMessage.type}>
              {alertMessage.message}
            </Alert>
          )}
        </div>
      </Grid>
    </Grid>
  );
}
