const User = require("../models/User");
const Notification = require("../models/Notification");

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function buildBookingSubmittedNotificationPayload({ booking, actor, recipientId }) {
  const candidateName =
    normalizeString(booking.personalDetails?.fullName) ||
    normalizeString(actor?.name) ||
    "A candidate";
  const courseTitle = normalizeString(booking.courseSnapshot?.title) || "course";

  return {
    recipient: recipientId,
    actor: actor?._id || actor?.id || null,
    type: "booking_submitted",
    booking: booking._id,
    title: "New booking submitted",
    message: `${candidateName} submitted ${courseTitle} for admin review.`,
    metadata: {
      bookingId: String(booking._id),
      applicationStatus: booking.applicationStatus || "submitted",
      courseTitle,
      candidateName,
    },
  };
}

function buildBookingApprovedNotificationPayload({ booking, actor, recipientId }) {
  const courseTitle = normalizeString(booking.courseSnapshot?.title) || "your booking";

  return {
    recipient: recipientId,
    actor: actor?._id || actor?.id || null,
    type: "booking_approved",
    booking: booking._id,
    title: "Booking approved",
    message: `Your ${courseTitle} application has been approved. You can continue to payment now.`,
    metadata: {
      bookingId: String(booking._id),
      applicationStatus: booking.applicationStatus || "approved",
      courseTitle,
    },
  };
}

async function createNotifications(notifications) {
  const validNotifications = Array.isArray(notifications) ? notifications.filter(Boolean) : [];

  if (validNotifications.length === 0) {
    return [];
  }

  return Notification.insertMany(validNotifications);
}

async function notifyAdminsOfBookingSubmission(booking, actor) {
  const admins = await User.find({ role: "admin" }).select("_id");

  if (!admins.length) {
    return [];
  }

  return createNotifications(
    admins.map((admin) =>
      buildBookingSubmittedNotificationPayload({
        booking,
        actor,
        recipientId: admin._id,
      })
    )
  );
}

async function notifyUserOfBookingApproval(booking, actor) {
  const userId = booking.user?._id || booking.user;

  if (!userId) {
    return [];
  }

  return createNotifications([
    buildBookingApprovedNotificationPayload({
      booking,
      actor,
      recipientId: userId,
    }),
  ]);
}

module.exports = {
  notifyAdminsOfBookingSubmission,
  notifyUserOfBookingApproval,
};
