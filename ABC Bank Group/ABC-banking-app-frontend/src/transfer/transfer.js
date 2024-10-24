import { useState } from "react";
import styles from "./transfer.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { Sidebar } from "../Components/sidebar";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useAuth } from "../Auth/auth";
import Alert from "@mui/material/Alert";

export function Transfer(props) {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const location = useLocation();
  const search = location.search || "";
  const accnoValue = new URLSearchParams(search).get("accno") || "";
  const [balance, setBalance] = useState(userData.Balance);
  const [alertMessage, setAlertMessage] = useState(null);
  const [error, setError] = useState(false);
  const [type, setType] = useState(10);

  const AmountChange = (e) => {
    setError(false);
    const newValue = e.target.value;
    //subtract the amount entered with the total balance
    setBalance(userData.Balance - newValue);
    if (newValue == "") {
      setBalance(userData.Balance);
    }
    //show error if you don't have enough balance in account
    if (newValue > userData.Balance) {
      setError(true);
    }
  };

  const handleChange = (event) => {
    //set the transfer type
    setType(event.target.value);
  };
  const onTransfer = async (e) => {
    //the value of transfer type direct is 10
    if (type == 10) {
      e.preventDefault();
      const date = new Date();
      const current = date.getHours() + ":" + date.getMinutes();
      const day =
        date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear();
      const accName = e.target.name.value;
      const accNumber = e.target.accno.value;
      const amount = e.target.amount.value;
      const accbalance = balance;
      const bname = e.target.bname.value;
      const baccno = e.target.baccno.value;
      const bnote = e.target.bnote.value;
      const userid = user.uid;
      const currentDate = current;
      const currentDay = day;
      const transfer = "direct";
      // call the transfer service
      const response = await fetch(
        "https://abc-banking-app-backend-8c00c6f66f4d.herokuapp.com/transfer",
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
            bname,
            baccno,
            bnote,
            userid,
            currentDate,
            currentDay,
            accbalance,
            transfer,
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
      }
    } else {
      e.preventDefault();
      const date = new Date();
      const current = date.getHours() + ":" + date.getMinutes();
      const day =
        date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear();
      const accName = e.target.name.value;
      const accNumber = e.target.accno.value;
      const amount = e.target.amount.value;
      const accbalance = balance;
      const bankname = e.target.bankname.value;
      const branchcode = e.target.branchcode.value;
      const bname = e.target.bname.value;
      const baccno = e.target.baccno.value;
      const bnote = e.target.bnote.value;
      const userid = user.uid;
      const currentDate = current;
      const currentDay = day;
      const transfer = "bank";

      // call the transfer service
      const response = await fetch(
        "https://abc-banking-app-backend-8c00c6f66f4d.herokuapp.com/transfer",
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
            bname,
            baccno,
            bnote,
            userid,
            currentDate,
            currentDay,
            accbalance,
            bankname,
            branchcode,
            transfer,
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
      }
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        {/* Sidebar Grid */}
        <Grid item xs={2.5}>
          <Sidebar />
        </Grid>
        {/* Main Page Grid */}
        <Grid item lg={3} xs={12} sm={12}>
          <h1 style={{ margin: "30px" }}>Transfer</h1>
          <div>
            <p style={{ margin: "30px", fontSize: "25px", fontWeight: "600" }}>
              Transaction Type
            </p>
            <Box
              sx={{
                width: "96%",
                margin: "30px",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={type}
                  label="type"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Direct Transfer</MenuItem>
                  <MenuItem value={20}>Bank Transfer</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
          <div className={styles.transCount}>
            <div style={{ padding: "20px" }}>
              <h3>Current Account</h3>
              <p style={{ color: "#ededed" }}>Current Balace</p>
              {error ? (
                <h1 style={{ letterSpacing: "3px", color: "red" }}>
                  Not enough balance
                </h1>
              ) : (
                <h1 style={{ letterSpacing: "3px", color: "#b4f0e4" }}>
                  GBP {balance}
                </h1>
              )}
              <hr
                style={{
                  width: "300px",
                }}
              ></hr>
              <p style={{ color: "#ededed" }}>Account Number</p>
              <h4 style={{ letterSpacing: "3px" }}>{userData.Account_No}</h4>
              <p style={{ color: "#ededed" }}>Account Owner</p>
              <h4>{userData.Account_Name}</h4>
            </div>
          </div>
        </Grid>
        <Grid item lg={6.5} xs={12} sm={12}>
          <div className={styles.col3}>
            <h2>Transfer To</h2>
            <div className={styles.TransferContainer}>
              {type === 20 && (
                <form onSubmit={onTransfer}>
                  <input
                    type="text"
                    placeholder="Account Name"
                    name="name"
                    defaultValue={userData.Account_Name}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Account Number"
                    name="accno"
                    defaultValue={userData.Account_No}
                    required
                  />
                  <input type="text" placeholder="Bank Name" name="bankname" />
                  <input
                    type="number"
                    placeholder="Branch Code"
                    name="branchcode"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    name="amount"
                    onChange={AmountChange}
                    required
                  />
                  <h3>Other data</h3>
                  <Grid container spacing={10}>
                    <Grid item xs={6}>
                      <input
                        type="text"
                        placeholder="Beneficiary's Name"
                        name="bname"
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <input
                        type="number"
                        placeholder="Beneficiary's Account No"
                        name="baccno"
                        defaultValue={accnoValue}
                        required
                      />
                    </Grid>
                  </Grid>
                  <input
                    type="text"
                    placeholder="Note for beneficiary"
                    name="bnote"
                  />
                  {/* Hide submit button if there is error */}
                  {error ? null : (
                    <input
                      type="submit"
                      value="Deposit"
                      className={styles.submitButton}
                    />
                  )}
                </form>
              )}
              {type === 10 && (
                <form onSubmit={onTransfer}>
                  <input
                    type="text"
                    placeholder="Account Name"
                    name="name"
                    defaultValue={userData.Account_Name}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Account Number"
                    name="accno"
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
                  <h3>Other data</h3>
                  <Grid container spacing={10}>
                    <Grid item xs={6}>
                      <input
                        type="text"
                        placeholder="Beneficiary's Name"
                        name="bname"
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <input
                        type="number"
                        placeholder="Beneficiary's Account No"
                        name="baccno"
                        defaultValue={accnoValue}
                        required
                      />
                    </Grid>
                  </Grid>
                  <input
                    type="text"
                    placeholder="Note for beneficiary"
                    name="bnote"
                  />
                  {/* Hide submit button if there is error */}
                  {error ? null : (
                    <input
                      type="submit"
                      value="Deposit"
                      className={styles.submitButton}
                    />
                  )}
                </form>
              )}
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
