const express = require("express");

const {
  getProfileSettingsScreen,
  updateProfileSettings,
  deleteProfilePhoto,
  getNotificationSettingsScreen,
  updateNotificationSettings,
  getSecuritySettingsScreen,
  updatePasswordSettings,
} = require("../controllers/settingsController");
const { requireAuth } = require("../middleware/authMiddleware");
const { uploadUserProfileImage } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(requireAuth);

router.get("/profile", getProfileSettingsScreen);
router.patch("/profile", uploadUserProfileImage, updateProfileSettings);
router.delete("/profile/photo", deleteProfilePhoto);
router.get("/notifications", getNotificationSettingsScreen);
router.patch("/notifications", updateNotificationSettings);
router.get("/security", getSecuritySettingsScreen);
router.post("/security/password", updatePasswordSettings);

module.exports = router;
