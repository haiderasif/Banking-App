import React, { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import styles from "./new-customer.module.css";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

export function NewCustomer() {
  const [alertMessage, setAlertMessage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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
  const onNewCustomer = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.mail.value;
    const bankname = e.target.bankname.value;
    const pin = e.target.pin.value;
    const balance = e.target.balance.value;

    try {
      // call the register service
      const response = await fetch(
        "https://abc-banking-app-backend-8c00c6f66f4d.herokuapp.com/create",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          //sending data to backend
          body: JSON.stringify({ name, email, pin, balance, bankname }),
        }
      );

      const json = await response.json();

      if (json.success) {
        console.log("Data is: " + json.message);
        setAlertMessage({
          type: "success",
          message:
            "Verification email has been sent. Please verify your account to log in.",
        });
      } else {
        setAlertMessage({
          type: "error",
          message: json.message,
        });
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
          <h1>Create Account</h1>
          <p style={{ fontWeight: "bold" }}>
            Create an account to view and manage your account
          </p>
          <form onSubmit={onNewCustomer}>
            <label>Account Name</label>
            <input
              type="text"
              placeholder="Muhammad Haider"
              name="name"
              required
            />
            <label>Account Email</label>
            <input
              type="text"
              placeholder="account@example.com"
              name="mail"
              required
            />
            <label>Bank Name</label>
            <input
              type="text"
              placeholder="account@example.com"
              name="bankname"
              required
            />
            <label>Create Password</label>
            <input
              type="password"
              placeholder="*****"
              name="pin"
              title="Please enter a 6-digit number"
              required
            />
            <label>Enter Balance</label>
            <input type="number" placeholder="4300" name="balance" />
            <input
              type="submit"
              value="Create"
              className={styles.submitButton}
              required
            />
          </form>
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              Login
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
