import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useAuth } from "../Auth/auth";

export function DetailedTransaction() {
  const { transdata } = useAuth();
  const [transactionType, setTransactionType] = useState("all");
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
  const filteredTransactions = transdata.filter((transaction) => {
    // Check if credit is displayed or deposit
    if (transactionType === "all") {
      // the default value is all
      return true;
    } else {
      return transaction.Transaction_Type.toLowerCase() === transactionType;
    }
  });

  return (
    <div style={{ paddingTop: "50px", padding: isMobile ? "5px" : "40px" }}>
      <h2>Transactions</h2>
      <div>
        <Button
          variant={transactionType === "all" ? "contained" : "outlined"}
          onClick={() => setTransactionType("all")}
        >
          All
        </Button>
        <Button
          variant={transactionType === "credit" ? "contained" : "outlined"}
          onClick={() => setTransactionType("credit")}
        >
          Credit
        </Button>
        <Button
          variant={transactionType === "deposit" ? "contained" : "outlined"}
          onClick={() => setTransactionType("deposit")}
        >
          Deposit
        </Button>
      </div>
      {/* {Heading to the table} */}
      <Grid container spacing={2}>
        <Grid container item>
          <Grid item lg={3} xs={4} sm={4}>
            <h4>Name</h4>
          </Grid>
          <Grid item xs={3}>
            <h4>Date</h4>
          </Grid>
          <Grid item xs={3}>
            <h4>Time</h4>
          </Grid>
          <Grid item lg={3} xs={2} sm={2}>
            <h4>Amount</h4>
          </Grid>
        </Grid>
        {/* Display all transactions */}
        {filteredTransactions.map((transaction, index) => (
          <Grid container item key={index}>
            <Grid item lg={3} xs={4} sm={4}>
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "18px",
                  }}
                >
                  {transaction.Account_Name}
                </p>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div>
                <p>{transaction.Current_Day}</p>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div>
                <p>{transaction.Current_Date}</p>
              </div>
            </Grid>
            <Grid item lg={3} xs={2} sm={2}>
              <div>
                {transaction.Transaction_Type === "Deposit" ? (
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: "18px",
                      textTransform: "uppercase",
                      textAlign: "right",
                      color: "red",
                    }}
                  >
                    -{transaction.Amount} £
                  </p>
                ) : (
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: "18px",
                      textTransform: "uppercase",
                      textAlign: "right",
                      color: "green",
                    }}
                  >
                    +{transaction.Amount} £
                  </p>
                )}
              </div>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
