import React, { useState } from "react";
import styles from "./setting.module.css";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { Sidebar } from "../Components/sidebar";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAuth } from "../Auth/auth";

export function Setting() {
  const navigate = useNavigate();
  const { userData, transdata } = useAuth();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteUser = async () => {
    try {
      // Delete user logic
      // call the delete service
      const response = await fetch(
        "https://abc-banking-app-backend-8c00c6f66f4d.herokuapp.com/delete"
      );
      const data = await response.json();
      {
        if (data.success == true) {
          console.log("success");
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      // Handle error or show an error message to the user
    }
  };

  // Delete popup section
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <div>
      <Grid container spacing={2}>
        {/* Sidebar Grid */}
        <Grid item xs={2.5}>
          <Sidebar />
        </Grid>
        {/* Main Page Grid */}
        <Grid item lg={4.5} xs={12} sm={12}>
          <h1 style={{ margin: "30px" }}>Personal Information</h1>
          <div className={styles.settingcont}>
            <p>Name: {userData.Account_Name}</p>
            <p>Email: {userData.Account_Email}</p>
            <p>Account Number: {userData.Account_No}</p>
            <p>Branch Name: {userData.Bank_Name}</p>
            <p>Branch Code: {userData.Branch_Code}</p>
            <p>Remaining Balance: {userData.Balance}</p>
          </div>
          <div className={styles.btn}>
            <Button
              variant="contained"
              color="error"
              onClick={handleOpenDeleteDialog}
            >
              Delete User
            </Button>
          </div>
        </Grid>
      </Grid>

      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
