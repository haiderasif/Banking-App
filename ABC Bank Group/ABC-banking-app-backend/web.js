const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  deleteDoc,
} = require("firebase/firestore");
const express = require("express");
const cors = require("cors");
const {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  deleteUser,
} = require("firebase/auth");
const app = express();
app.use(cors());
app.use(express.json());

const port = 3100;

const firebaseConfig = {};

// Initialize Firebase
const database = initializeApp(firebaseConfig);
const db = getFirestore(database);
const auth = getAuth();
function generateAccountNumber() {
  const min = 1000000; // Smallest 7-digit number
  const max = 9999999; // Largest 7-digit number

  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomNumber;
}
function generatecode() {
  const min = 100; // Smallest 3-digit number
  const max = 999; // Largest 3-digit number

  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomNumber;
}

app.post("/create", async (req, res) => {
  console.log("here");
  createUserWithEmailAndPassword(auth, req.body.email, req.body.pin)
    .then(async (userCredential) => {
      // Signed up
      const user = userCredential.user;
      sendEmailVerification(user);
      const uniqueNumber = generateAccountNumber();
      const uniqueCode = generatecode();

      try {
        const docRef = await addDoc(collection(db, "users"), {
          Account_Id: user.uid,
          Account_Name: req.body.name,
          Account_Email: req.body.email,
          Account_No: uniqueNumber,
          Bank_Name: req.body.bankname,
          Branch_Code: uniqueCode,
          Balance: req.body.balance,
          Pin: req.body.pin,
        });
        console.log("Document written with ID: ", docRef.id);
        res.json({
          success: true,
          message: "Document written with ID: " + docRef.id,
        });
      } catch (e) {
        console.error("Error adding document: ", e);
        res
          .status(500)
          .json({ success: false, message: "Error adding document" });
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      res.status(500).json({ success: false, message: errorMessage });
    });
});

app.post("/login", (req, res) => {
  signInWithEmailAndPassword(auth, req.body.email, req.body.pin)
    .then(async (userCredential) => {
      // Signed up
      const user = userCredential.user;
      if (user.emailVerified) {
        res.json({
          success: true,
          message: "Document written with ID: ",
        });
      } else {
        signOut(auth).then(() => {
          res.json({
            success: false,
            message: "Email not verified",
          });
        });
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      res.status(500).json({ success: false, message: errorMessage });
    });
});
app.get("/logout", (req, res) => {
  signOut(auth).then(() => {
    res.json({
      success: true,
    });
  });
});
app.get("/delete", async (req, res) => {
  const user = auth.currentUser;
  // delete user and delete all user data including transactions
  const UserquerySnapshot = await getDocs(collection(db, "users"));
  UserquerySnapshot.forEach(async (docdata) => {
    if (docdata.data().Account_Id == user.uid) {
      await deleteDoc(doc(db, "users", docdata.id));
    }
  });
  const TransquerySnapshot = await getDocs(collection(db, "Transactions"));
  TransquerySnapshot.forEach(async (docdata) => {
    if (docdata.data().User_Id == user.uid) {
      await deleteDoc(doc(db, "Transactions", docdata.id));
    }
  });
  deleteUser(user)
    .then(() => {
      res.json({
        success: true,
      });
    })
    .catch((error) => {
      // An error ocurred
      // ...
    });
});
app.get("/auth", async (req, res) => {
  try {
    const user = await new Promise((resolve, reject) => {
      // checking if user is logged in or not
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Unsubscribe once the initial user state is received
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
    if (user) {
      const querySnapshot = await getDocs(collection(db, "users"));

      const queryTransctionSnapshot = collection(db, "Transactions");
      // ordering transactions by date and day
      const TransactionquerySnapshot = query(
        queryTransctionSnapshot,
        orderBy("Current_Day", "desc")
      );
      const Snapshot = await getDocs(TransactionquerySnapshot);

      const userDataArray = [];
      Snapshot.forEach((doc) => {
        if (doc.data().User_Id == user.uid) {
          userDataArray.push(doc.data());
        }
      });
      querySnapshot.forEach((doc) => {
        if (doc.data().Account_Id == user.uid) {
          res.json({
            message: user,
            userData: doc.data(),
            TransactionData: userDataArray,
          });
        }
      });
    } else {
      res.json({ message: null });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/withdraw", express.json(), async (req, res) => {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach(async (docdata) => {
    if (docdata.data().Account_Id == req.body.userid) {
      // updating the user balance after withdraw
      const updatedoc = doc(db, "users", docdata.id);
      await updateDoc(updatedoc, {
        Balance: req.body.accbalance,
      });
    }
  });
  try {
    // adding the transaction
    const docRef = await addDoc(collection(db, "Transactions"), {
      Account_Name: req.body.accName,
      Account_No: req.body.accNumber,
      Amount: req.body.amount,
      User_Id: req.body.userid,
      Transaction_Type: "Deposit",
      Current_Date: req.body.currentDate,
      Current_Day: req.body.currentDay,
    });
    res.json({
      success: true,
      message: "Amount has been deposited sucessfully",
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    res.status(500).json({ success: false, message: "Error adding document" });
  }
});

app.put("/transfer", express.json(), async (req, res) => {
  console.log(req.body.transfer);
  // checking if it is direct transfer or bank transfer
  if (req.body.transfer == "direct") {
    const querySnapshot = await getDocs(collection(db, "users"));
    const beneficiarySnapshot = await getDocs(collection(db, "users"));
    let check = false;
    beneficiarySnapshot.forEach(async (docdata) => {
      if (
        // checking the account number and account name
        docdata.data().Account_No == req.body.baccno &&
        docdata.data().Account_Name == req.body.bname
      ) {
        check = true;
        const currentBalance = parseInt(docdata.data().Balance, 10);
        const amountToAdd = parseInt(req.body.amount, 10);
        const new_balance = currentBalance + amountToAdd;
        const updatedoc = doc(db, "users", docdata.id);
        await updateDoc(updatedoc, {
          Balance: new_balance,
        });
        try {
          // adding transction for beneficiary
          const docRef = await addDoc(collection(db, "Transactions"), {
            Account_Name: req.body.accName,
            Account_No: req.body.baccno,
            Amount: req.body.amount,
            User_Id: docdata.data().Account_Id,
            Transaction_Type: "Credit",
            Current_Date: req.body.currentDate,
            Current_Day: req.body.currentDay,
          });
        } catch (e) {
          console.error("Error document: ", e);
          res.status(500).json({ success: false, message: "Error document" });
        }
      }
    });
    // if account number is correct, updating the user data and adding transaction
    if (check == true) {
      querySnapshot.forEach(async (docdata) => {
        if (docdata.data().Account_No == req.body.accNumber) {
          const updatedoc = doc(db, "users", docdata.id);
          await updateDoc(updatedoc, {
            Balance: req.body.accbalance,
          });
          try {
            const docRef = await addDoc(collection(db, "Transactions"), {
              Account_Name: req.body.bname,
              Account_No: req.body.accNumber,
              Amount: req.body.amount,
              User_Id: req.body.userid,
              Transaction_Type: "Deposit",
              Current_Date: req.body.currentDate,
              Current_Day: req.body.currentDay,
            });
            res.json({
              success: true,
              message: "Amount has been deposited sucessfully",
            });
          } catch (e) {
            console.error("Error adding document: ", e);
            res
              .status(500)
              .json({ success: false, message: "Error adding document" });
          }
        }
      });
    } else {
      res.status(500).json({ success: false, message: "Details not correct" });
    }
  } else {
    // repeating the same thing if transfer type is bank transfer
    const querySnapshot = await getDocs(collection(db, "users"));
    const beneficiarySnapshot = await getDocs(collection(db, "users"));
    let check = false;
    beneficiarySnapshot.forEach(async (docdata) => {
      if (
        docdata.data().Account_No == req.body.baccno &&
        docdata.data().Account_Name == req.body.bname &&
        // checking branch name and branch code in bank transfer
        docdata.data().Bank_Name == req.body.bankname &&
        docdata.data().Branch_Code == req.body.branchcode
      ) {
        check = true;
        const currentBalance = parseInt(docdata.data().Balance, 10);
        const amountToAdd = parseInt(req.body.amount, 10);
        const new_balance = currentBalance + amountToAdd;
        const updatedoc = doc(db, "users", docdata.id);
        await updateDoc(updatedoc, {
          Balance: new_balance,
        });
        try {
          const docRef = await addDoc(collection(db, "Transactions"), {
            Account_Name: req.body.accName,
            Account_No: req.body.baccno,
            Amount: req.body.amount,
            User_Id: docdata.data().Account_Id,
            Transaction_Type: "Credit",
            Current_Date: req.body.currentDate,
            Current_Day: req.body.currentDay,
          });
        } catch (e) {
          console.error("Error document: ", e);
          res.status(500).json({ success: false, message: "Error document" });
        }
      }
    });
    if (check == true) {
      querySnapshot.forEach(async (docdata) => {
        if (docdata.data().Account_No == req.body.accNumber) {
          const updatedoc = doc(db, "users", docdata.id);
          await updateDoc(updatedoc, {
            Balance: req.body.accbalance,
          });
          try {
            const docRef = await addDoc(collection(db, "Transactions"), {
              Account_Name: req.body.bname,
              Account_No: req.body.accNumber,
              Amount: req.body.amount,
              User_Id: req.body.userid,
              Transaction_Type: "Deposit",
              Current_Date: req.body.currentDate,
              Current_Day: req.body.currentDay,
            });
            res.json({
              success: true,
              message: "Amount has been deposited sucessfully",
            });
          } catch (e) {
            console.error("Error adding document: ", e);
            res
              .status(500)
              .json({ success: false, message: "Error adding document" });
          }
        }
      });
    } else {
      res.status(500).json({ success: false, message: "Details not correct" });
    }
  }
});

app.listen(3100, () => {
  console.log(`Banking App app listening on port ${3100}`);
});
