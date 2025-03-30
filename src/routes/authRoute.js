const express = require("express")
const router = express.Router()
const {signUp, signIn} = require("../controllers/authController")

router.post("/sign-in", signIn)
router.post("/sign-up", signUp)

module.exports = router
