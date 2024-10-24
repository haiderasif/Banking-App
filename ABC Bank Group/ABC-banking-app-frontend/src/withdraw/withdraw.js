import { useState } from "react";
import styles from "./withdraw.module.css";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { Sidebar } from "../Components/sidebar";
import ContactlessIcon from "@mui/icons-material/Contactless";
import Alert from "@mui/material/Alert";
import { useAuth } from "../Auth/auth";

export function Withdraw() {
  const { user, userData } = useAuth();
  const [balance, setBalance] = useState(userData.Balance);
  const [alertMessage, setAlertMessage] = useState(null);
  //same as we did in transfer page
  const AmountChange = (e) => {
    const newValue = e.target.value;
    console.log(newValue);
    setBalance(userData.Balance - newValue);
    if (newValue == "") {
      setBalance(userData.Balance);
    }
  };
  const onTransfer = async (e) => {
    e.preventDefault();
    const date = new Date();
    const current = date.getHours() + ":" + date.getMinutes();
    const day =
      date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear();
    const accName = e.target.accName.value;
    const accNumber = e.target.accNumber.value;
    const amount = e.target.amount.value;
    const accbalance = balance;
    const userid = user.uid;
    const currentDate = current;
    const currentDay = day;
    // call the withdraw service
    const response = await fetch(
      "https://abc-banking-app-backend-8c00c6f66f4d.herokuapp.com/withdraw",
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accName,
          accNumber,
          amount,
          userid,
          currentDate,
          currentDay,
          accbalance,
        }),
      }
    );
    const json = await response.json();
    if (json.success) {
      setAlertMessage({
        type: "success",
        message: json.message,
      });
    } else {
      setAlertMessage({
        type: "error",
        message: json.message,
      });
      console.error("Error: " + json.message);
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        {/* Sidebar Grid */}
        <Grid item xs={2.5}>
          <Sidebar />
        </Grid>
        <Grid item lg={3} xs={12} sm={12}>
          <h1 style={{ margin: "30px" }}>Withdraw</h1>
          <div>
            <p style={{ margin: "30px", fontSize: "25px", fontWeight: "600" }}>
              Your Details
            </p>
          </div>
          <div className={styles.withdrawCount}>
            <div style={{ padding: "20px" }}>
              <ContactlessIcon fontSize="medium" />
              <p style={{ paddingTop: "30px" }}>Available Balance</p>
              <h1
                style={{
                  letterSpacing: "3px",
                  marginTop: "-10px",
                }}
              >
                GBP {balance}
              </h1>
              <h3 style={{ letterSpacing: "3px", paddingTop: "50px" }}>
                213021302131
              </h3>
              <h4>{userData.Account_Name}</h4>
              <h4>12/24</h4>
            </div>
          </div>
        </Grid>
        <Grid item lg={6.5} xs={12} sm={12}>
          <div className={styles.col3}>
            <h2>Withdraw Amount</h2>
            <div className={styles.TransferContainer}>
              <form onSubmit={onTransfer}>
                <input
                  type="text"
                  placeholder="Account Name"
                  name="accName"
                  defaultValue={userData.Account_Name}
                  required
                />
                <input
                  type="number"
                  placeholder="Account Number"
                  name="accNumber"
                  defaultValue={userData.Account_No}
                  required
                />
                <input
                  type="number"
                  placeholder="Amount"
                  name="amount"
                  onChange={AmountChange}
                  required
                />
                <input
                  type="submit"
                  value="Deposit"
                  className={styles.submitButton}
                  required
                />
              </form>
              {alertMessage && (
                <Alert variant="filled" severity={alertMessage.type}>
                  {alertMessage.message}
                </Alert>
              )}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
