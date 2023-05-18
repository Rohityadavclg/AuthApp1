const express = require("express");
const router = express.Router();
const { auth, isStudent, isAdmin } = require("../middleware/auth");
const { login, signup } = require("../controller/Auth");
router.post("/login", login);
router.post("/signup", signup);
//protected routes
router.get("/test", auth,(req, res) => {
  res.json({
    success: true,
    message: "Welcome to the protected route for TEST",
  });
});
router.get("/student", auth, isStudent, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the protected route for Students",
  });
});
router.get("/admin", auth, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the protected route for Admin",
  });
});
router.get("/getEmail", auth, (req, res) => {
  const email = req.body.email;
  const id = req.body.id;
  console.log("Id and email", id, email);
  res.json({
    success: true,
    message: "Welcome to the protected route for Email",
  });
});
module.exports = router;
