const express = require("express");

const {
  createBooking,
  getMyDashboard,
  listMyBookings,
  getMyBookingById,
  getMyBookingDocumentsScreen,
  uploadMyBookingDocument,
  getMyBookingChecklistScreen,
  getMyBookingChecklistFullScreen,
  saveMyBookingChecklist,
  getMyBookingSignaturesScreen,
  getMyBookingSubmitScreen,
  submitMyBookingFlow,
  getMyBookingReviewScreen,
  submitMyBookingCandidateSignature,
  requestMyBookingTrainingProviderSignature,
  getTrainingProviderSignatureByToken,
  submitTrainingProviderSignatureByToken,
  saveMyBookingEligibility,
  saveMyBookingAssessmentDetails,
  saveMyBookingEmployerDetails,
  saveMyBookingTrainingProviderDetails,
  saveMyBookingPrivacyConfirmation,
  updateMyBookingDetails,
  getMyBookingCheckoutDetailsScreen,
  getMyBookingPaymentScreen,
  createMyBookingPaymentIntent,
  getMyBookingPaymentStatus,
  getMyBookingConfirmationScreen,
  payForMyBooking,
} = require("../controllers/bookingController");
const { requireAuth } = require("../middleware/authMiddleware");
const { uploadBookingDocument } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/provider-signature/:token", getTrainingProviderSignatureByToken);
router.post("/provider-signature/:token", submitTrainingProviderSignatureByToken);

router.use(requireAuth);

router.get("/dashboard", getMyDashboard);
router.get("/", listMyBookings);
router.post("/", createBooking);
router.get("/:id/flow/documents", getMyBookingDocumentsScreen);
router.post("/:id/flow/documents/upload", uploadBookingDocument, uploadMyBookingDocument);
router.get("/:id/flow/checklist", getMyBookingChecklistScreen);
router.get("/:id/flow/checklist/full", getMyBookingChecklistFullScreen);
router.patch("/:id/flow/checklist", saveMyBookingChecklist);
router.get("/:id/flow/signatures", getMyBookingSignaturesScreen);
router.post("/:id/flow/signatures/candidate", submitMyBookingCandidateSignature);
router.post("/:id/flow/signatures/training-provider/request", requestMyBookingTrainingProviderSignature);
router.get("/:id/flow/submit", getMyBookingSubmitScreen);
router.post("/:id/flow/submit", submitMyBookingFlow);
router.get("/:id/flow/review", getMyBookingReviewScreen);
router.post("/:id/registration/eligibility", saveMyBookingEligibility);
router.post("/:id/registration/assessment", saveMyBookingAssessmentDetails);
router.post("/:id/registration/employer", saveMyBookingEmployerDetails);
router.post("/:id/registration/training", saveMyBookingTrainingProviderDetails);
router.post("/:id/registration/privacy", saveMyBookingPrivacyConfirmation);
router.get("/:id/checkout/details", getMyBookingCheckoutDetailsScreen);
router.get("/:id/checkout/payment", getMyBookingPaymentScreen);
router.get("/:id/checkout/confirmation", getMyBookingConfirmationScreen);
router.get("/:id", getMyBookingById);
router.patch("/:id/details", updateMyBookingDetails);
router.post("/:id/payment/intent", createMyBookingPaymentIntent);
router.get("/:id/payment/status", getMyBookingPaymentStatus);
router.post("/:id/payment", payForMyBooking);

module.exports = router;
