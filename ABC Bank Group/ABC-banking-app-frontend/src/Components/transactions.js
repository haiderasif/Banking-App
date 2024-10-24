import React from "react";
import Grid from "@mui/material/Grid";
import { useAuth } from "../Auth/auth";

export function Transaction() {
  const { transdata } = useAuth();
  return (
    <div style={{ paddingTop: "50px" }}>
      <h2>Transactions</h2>
      <Grid container spacing={2}>
        {/* Display only first 4 transaction values */}
        {transdata.slice(0, 4).map((transaction, index) => (
          <Grid container item key={index}>
            <Grid item lg={2} xs={4} sm={4}>
              <img
                src={require("../images/sent.png")}
                style={{ width: "30px", height: "30px", paddingTop: "20px" }}
              />
            </Grid>
            <Grid item lg={5} xs={4} sm={4}>
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "18px",
                  }}
                >
                  {transaction.Account_Name}
                </p>
                <p style={{ marginTop: "-16px" }}>{transaction.Current_Date}</p>
              </div>
            </Grid>
            <Grid item lg={5} xs={4} sm={4}>
              <div>
                {transaction.Transaction_Type == "Deposit" ? (
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
