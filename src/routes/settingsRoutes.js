const express = require("express");

const {
  getProfileSettingsScreen,
  updateProfileSettings,
  deleteProfilePhoto,
  getNotificationSettingsScreen,
  updateNotificationSettings,
  getSecuritySettingsScreen,
  updatePasswordSettings,
  listLegalPages,
  getPublicLegalPage,
  getLegalPageSettingsScreen,
  updateLegalPageContent,
  addLegalPageSection,
  updateLegalPageSection,
  updateLegalPageSectionVisibility,
  deleteLegalPageSection,
} = require("../controllers/settingsController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { uploadUserProfileImage } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/public/legal-pages/:slug", getPublicLegalPage);

router.use(requireAuth);

router.get("/profile", getProfileSettingsScreen);
router.patch("/profile", uploadUserProfileImage, updateProfileSettings);
router.delete("/profile/photo", deleteProfilePhoto);
router.get("/notifications", getNotificationSettingsScreen);
router.patch("/notifications", updateNotificationSettings);
router.get("/security", getSecuritySettingsScreen);
router.post("/security/password", updatePasswordSettings);
router.get("/legal-pages", requireRole("admin"), listLegalPages);
router.get("/legal-pages/:slug", requireRole("admin"), getLegalPageSettingsScreen);
router.patch("/legal-pages/:slug", requireRole("admin"), updateLegalPageContent);
router.post("/legal-pages/:slug/sections", requireRole("admin"), addLegalPageSection);
router.patch(
  "/legal-pages/:slug/sections/:sectionId/visibility",
  requireRole("admin"),
  updateLegalPageSectionVisibility
);
router.patch(
  "/legal-pages/:slug/sections/:sectionId",
  requireRole("admin"),
  updateLegalPageSection
);
router.delete(
  "/legal-pages/:slug/sections/:sectionId",
  requireRole("admin"),
  deleteLegalPageSection
);

module.exports = router;
