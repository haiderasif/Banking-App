import { useState } from "react";
import styles from "./transactions.module.css";
import Grid from "@mui/material/Grid";
import { DetailedTransaction } from "../Components/DetailedTransactions";
import { Sidebar } from "../Components/sidebar";
import ContactlessIcon from "@mui/icons-material/Contactless";
import { useAuth } from "../Auth/auth";

export function Transactions() {
  const { userData } = useAuth();

  return (
    <div>
      <Grid container spacing={2}>
        {/* Sidebar Grid */}
        <Grid item xs={2.5}>
          <Sidebar />
        </Grid>
        {/* Main Page Grid */}
        <Grid item lg={9.5} xs={12} sm={12}>
          <div className={styles.transCont}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <div className={styles.card}>
                  <div style={{ padding: "20px" }}>
                    <ContactlessIcon fontSize="medium" />
                    <p style={{ paddingTop: "30px" }}>Available Balance</p>
                    <h1
                      style={{
                        letterSpacing: "2px",
                        marginTop: "-10px",
                      }}
                    >
                      GBP {userData.Balance}
                    </h1>
                    <h3 style={{ letterSpacing: "2px", paddingTop: "50px" }}>
                      213021302131
                    </h3>
                    <h4>{userData.Account_Name}</h4>
                    <h4>12/24</h4>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div style={{ padding: "10px" }}>
                  <h2>Credit Card</h2>
                  <hr></hr>
                  <div style={{ paddingTop: "10px" }}>
                    <h5 style={{ lineHeight: 0 }}>Owner Name</h5>
                    <h4 style={{ lineHeight: 0 }}>Muhammad Haider</h4>
                  </div>
                  <div style={{ paddingTop: "10px" }}>
                    <h5 style={{ lineHeight: 0 }}>Type</h5>
                    <h4 style={{ lineHeight: 0 }}>Physical</h4>
                  </div>
                  <div style={{ paddingTop: "10px" }}>
                    <h5 style={{ lineHeight: 0 }}>Card Number</h5>
                    <h4 style={{ lineHeight: 0 }}>{userData.Account_No}</h4>
                  </div>
                  <div style={{ paddingTop: "10px" }}>
                    <h5 style={{ lineHeight: 0 }}>CVC</h5>
                    <h4 style={{ lineHeight: 0 }}>***</h4>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          <DetailedTransaction />
        </Grid>
      </Grid>
    </div>
  );
}
