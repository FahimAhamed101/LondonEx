const express = require("express");

const {
  getDashboard,
  listUsers,
  listSubmissions,
  listCandidates,
  getCandidateById,
} = require("../controllers/adminController");
const {
  listAdminCourses,
  listCourseSourceOptions,
  createCourse,
  getAdminCourseById,
  updateCourse,
} = require("../controllers/courseController");
const {
  listAdminTeamMembers,
  createTeamMember,
  getAdminTeamMemberById,
  updateTeamMember,
} = require("../controllers/teamController");
const {
  listAdminBookings,
  getAdminBookingById,
  updateAdminBooking,
} = require("../controllers/bookingController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { uploadCourseImage, uploadTeamImage } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(requireAuth, requireRole("admin"));

router.get("/dashboard", getDashboard);
router.get("/users", listUsers);
router.get("/submissions", listSubmissions);
router.get("/candidates", listCandidates);
router.get("/candidates/:id", getCandidateById);
router.get("/courses", listAdminCourses);
router.get("/courses/options", listCourseSourceOptions);
router.post("/courses", uploadCourseImage, createCourse);
router.get("/courses/:id", getAdminCourseById);
router.patch("/courses/:id", uploadCourseImage, updateCourse);
router.get("/team", listAdminTeamMembers);
router.post("/team", uploadTeamImage, createTeamMember);
router.get("/team/:id", getAdminTeamMemberById);
router.patch("/team/:id", uploadTeamImage, updateTeamMember);
router.get("/bookings", listAdminBookings);
router.get("/bookings/:id", getAdminBookingById);
router.patch("/bookings/:id", updateAdminBooking);

module.exports = router;
