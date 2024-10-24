import { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { Transaction } from "../Components/transactions";
import { Sidebar } from "../Components/sidebar";
import { Linechart } from "../Components/linechart";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../Auth/auth";

export function Dashboard() {
  const navigate = useNavigate();
  const { userData, transdata } = useAuth();
  const [amountVisible, setAmountVisible] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpence, setTotalExence] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const toggleAmountVisibility = () => {
    setAmountVisible(!amountVisible);
  };
  const onNext = async (e) => {
    e.preventDefault();

    const accnoValue = e.target.elements.accno.value;

    // Navigate to the transfer page with the accno value
    navigate(`/transfer?accno=${accnoValue}`);
  };
  useEffect(() => {
    let incomeTotal = 0;
    let expenceTotal = 0;

    transdata.forEach((transaction) => {
      //calculate total income
      if (transaction.Transaction_Type === "Credit") {
        incomeTotal += parseInt(transaction.Amount, 10);
      }
    });
    transdata.forEach((transaction) => {
      //calcualte total expence
      if (transaction.Transaction_Type === "Deposit") {
        expenceTotal += parseInt(transaction.Amount, 10);
      }
    });
    setTotalExence(expenceTotal);
    setTotalIncome(incomeTotal);
  }, [transdata]); // Run the effect whenever transdata changes

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

  return (
    <div>
      <Grid container spacing={2}>
        {/* Sidebar Grid */}
        <Grid item lg={2.5} md={2}>
          <Sidebar />
        </Grid>
        {/* Homepage Grid */}
        <Grid item lg={4.5} md={6} xs={12} sm={12}>
          <h1 style={{ margin: "30px" }}>Welcome {userData.Account_Name}!</h1>
          <div className={styles.dashCont}>
            <div style={{ padding: "20px" }}>
              <h3>Total Balance</h3>
              <div style={{ position: isMobile ? "" : "relative" }}>
                {/* Check if balance is hidden or not */}
                {amountVisible ? (
                  <h1
                    style={{
                      letterSpacing: "3px",
                    }}
                  >
                    GBP {userData.Balance}
                  </h1>
                ) : (
                  <h1
                    style={{
                      letterSpacing: "3px",
                    }}
                  >
                    ******
                  </h1>
                )}

                <IconButton
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                  }}
                  onClick={toggleAmountVisibility}
                >
                  {amountVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </div>
              <Grid
                container
                spacing={2}
                sx={{ width: "500px", padding: "20px" }}
              >
                <Grid xs={6}>
                  <p>Total Income</p>
                  <h3 style={{ letterSpacing: "3px" }}>GPD {totalIncome}</h3>
                </Grid>
                <Grid xs={6}>
                  <p>Total Expences</p>
                  <h3 style={{ letterSpacing: "3px" }}>GPD {totalExpence}</h3>
                </Grid>
              </Grid>
            </div>
          </div>
          <Linechart />
        </Grid>
        {/* Transaction Section Grid */}
        <Grid item md={4} lg={5} xs={12} sm={12}>
          <div className={styles.col3}>
            <Transaction />
            <div className={styles.transactionsection}>
              <div style={{ padding: "20px" }}>
                <h3>Quick Transfer</h3>
                <form onSubmit={onNext}>
                  <label>Account Number</label>
                  <input type="text" placeholder="Account No" name="accno" />
                  <input
                    type="submit"
                    value="Next"
                    className={styles.submitButton}
                    required
                  />
                </form>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
