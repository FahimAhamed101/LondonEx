const mongoose = require("mongoose");

const User = require("../models/User");
const Course = require("../models/Course");
const Booking = require("../models/Booking");

const SUBMISSION_STATUS_OPTIONS = [
  { value: "not_started", label: "Not started" },
  { value: "awaiting_signatures", label: "Awaiting signatures" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeBoolean(value, fallbackValue = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return true;
    }

    if (value.toLowerCase() === "false") {
      return false;
    }
  }

  return fallbackValue;
}

function normalizeNumber(value, fallbackValue = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsedValue = Number(value);
    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return fallbackValue;
}

function parsePagination(query) {
  const page = Math.max(1, Math.floor(normalizeNumber(query.page, 1)));
  const limit = Math.min(100, Math.max(1, Math.floor(normalizeNumber(query.limit, 10))));

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatDisplayDateTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(",", "");
}

function formatRelativeTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diffInSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (diffInSeconds < 60) {
    return `${diffInSeconds || 1} sec ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
}

function getInitial(value) {
  return (typeof value === "string" && value.trim() ? value.trim()[0] : "?").toUpperCase();
}

function getAvatarTone(seed) {
  const tones = ["green", "blue", "orange", "red", "cyan", "purple", "indigo", "teal"];
  const normalizedSeed = typeof seed === "string" ? seed : "";

  const toneIndex = normalizedSeed
    .split("")
    .reduce((sum, character) => sum + character.charCodeAt(0), 0);

  return tones[toneIndex % tones.length];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundToOneDecimal(value) {
  return Math.round(value * 10) / 10;
}

function mapSubmissionStatus(booking) {
  if (booking.status === "cancelled" || booking.payment?.status === "refunded") {
    return {
      key: "rejected",
      label: "Rejected",
      tone: "danger",
    };
  }

  if (booking.payment?.status === "failed") {
    return {
      key: "rejected",
      label: "Rejected",
      tone: "danger",
    };
  }

  if (booking.status === "confirmed" && booking.payment?.status === "paid") {
    return {
      key: "approved",
      label: "Approved",
      tone: "success",
    };
  }

  return {
    key: "pending",
    label: "Pending",
    tone: "warning",
  };
}

function buildSubmissionSummary(items) {
  return items.reduce(
    (summary, item) => {
      summary.total += 1;

      if (item.status?.key === "approved") {
        summary.approved += 1;
      } else if (item.status?.key === "pending") {
        summary.pending += 1;
      } else if (item.status?.key === "rejected") {
        summary.rejected += 1;
      }

      return summary;
    },
    {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
    }
  );
}

function buildSubmissionStatusOptions(items) {
  const counts = items.reduce((accumulator, item) => {
    const key = item.status?.key;

    if (key) {
      accumulator[key] = (accumulator[key] || 0) + 1;
    }

    return accumulator;
  }, {});

  return [
    {
      value: null,
      label: "All Statuses",
      count: items.length,
    },
    ...SUBMISSION_STATUS_OPTIONS.map((option) => ({
      ...option,
      count: counts[option.value] || 0,
    })),
  ];
}

function buildSubmissionCourseOptions(courses) {
  return [
    {
      value: null,
      label: "All Courses",
      slug: null,
    },
    ...courses.map((course) => ({
      value: course._id,
      label: course.title,
      slug: course.slug,
    })),
  ];
}

function mapRecentSubmission(booking) {
  const candidateName = booking.personalDetails?.fullName || booking.user?.name || "Unknown Candidate";
  const candidateEmail = booking.personalDetails?.email || booking.user?.email || "";
  const status = mapSubmissionStatus(booking);

  return {
    id: booking._id,
    bookingId: booking._id,
    bookingNumber: booking.bookingNumber,
    candidate: {
      name: candidateName,
      email: candidateEmail,
      initial: getInitial(candidateName),
      avatarTone: getAvatarTone(candidateName || candidateEmail),
    },
    course: {
      id: booking.course,
      title: booking.courseSnapshot?.title || "",
      slug: booking.courseSnapshot?.slug || "",
    },
    submittedAt: booking.createdAt,
    submittedAtLabel: formatDisplayDateTime(booking.createdAt),
    submittedRelative: formatRelativeTime(booking.createdAt),
    status,
    action: {
      label: "View",
      type: "view_booking",
      url: `/admin/bookings/${booking._id}`,
    },
  };
}

function calculateCandidateProgress(booking, now = new Date()) {
  const createdAt = booking.createdAt ? new Date(booking.createdAt) : null;
  const startDateTime = booking.session?.startDateTime ? new Date(booking.session.startDateTime) : null;
  const endDateTime = booking.session?.endDateTime ? new Date(booking.session.endDateTime) : null;
  const daysSinceCreated = createdAt
    ? Math.max(0, (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  let percentage = 0;

  if (booking.status === "cancelled" || booking.payment?.status === "refunded") {
    percentage = 0;
  } else if (booking.payment?.status === "failed") {
    percentage = 15 + Math.min(daysSinceCreated * 1.5, 20);
  } else if (booking.status === "pending_payment") {
    percentage = 12 + Math.min(daysSinceCreated * 1.2, 18);
  } else if (
    startDateTime &&
    endDateTime &&
    !Number.isNaN(startDateTime.getTime()) &&
    !Number.isNaN(endDateTime.getTime())
  ) {
    if (now.getTime() <= startDateTime.getTime()) {
      const totalLeadTime = Math.max(1, startDateTime.getTime() - (createdAt?.getTime() || startDateTime.getTime()));
      const elapsedLeadTime = clamp(
        now.getTime() - (createdAt?.getTime() || now.getTime()),
        0,
        totalLeadTime
      );
      percentage = 35 + (elapsedLeadTime / totalLeadTime) * 30;
    } else if (now.getTime() >= endDateTime.getTime()) {
      percentage = 100;
    } else {
      const totalSessionTime = Math.max(1, endDateTime.getTime() - startDateTime.getTime());
      const elapsedSessionTime = clamp(now.getTime() - startDateTime.getTime(), 0, totalSessionTime);
      percentage = 65 + (elapsedSessionTime / totalSessionTime) * 35;
    }
  } else if (startDateTime && !Number.isNaN(startDateTime.getTime())) {
    percentage = now.getTime() < startDateTime.getTime() ? 62 : 92;
  } else if (booking.status === "confirmed" && booking.payment?.status === "paid") {
    percentage = 55;
  }

  const normalizedPercentage = roundToOneDecimal(clamp(percentage, 0, 100));
  let tone = "danger";

  if (normalizedPercentage >= 80) {
    tone = "success";
  } else if (normalizedPercentage >= 35) {
    tone = "warning";
  }

  return {
    percentage: normalizedPercentage,
    label: `${normalizedPercentage.toFixed(1)}%`,
    tone,
  };
}

function isStuckCandidate(booking, progress, now = new Date()) {
  const createdAt = booking.createdAt ? new Date(booking.createdAt) : null;
  const bookingAgeInDays = createdAt ? (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) : 0;

  if (booking.status === "cancelled" || booking.payment?.status === "refunded") {
    return false;
  }

  if (booking.payment?.status === "failed" || booking.status === "pending_payment") {
    return bookingAgeInDays >= 3;
  }

  if (booking.status === "confirmed" && !booking.session?.startDateTime) {
    return bookingAgeInDays >= 7;
  }

  return progress.percentage < 25 && bookingAgeInDays >= 5;
}

function mapCandidateRow(booking, now = new Date()) {
  const candidateName = booking.personalDetails?.fullName || booking.user?.name || "Unknown Candidate";
  const candidateEmail = booking.personalDetails?.email || booking.user?.email || "";
  const progress = calculateCandidateProgress(booking, now);
  const candidateId = String(booking.user?._id || booking._id || "");

  return {
    id: booking._id,
    candidate: {
      id: booking.user?._id || null,
      candidateNumber: candidateId ? candidateId.slice(-6).toUpperCase() : "",
      name: candidateName,
      email: candidateEmail,
      initial: getInitial(candidateName),
      avatarTone: getAvatarTone(candidateName || candidateEmail),
    },
    enrolledCourse: {
      id: booking.course,
      title: booking.courseSnapshot?.title || "",
      slug: booking.courseSnapshot?.slug || "",
    },
    progress,
    submittedAt: booking.createdAt,
    submittedAtLabel: formatDisplayDateTime(booking.createdAt),
    isStuck: isStuckCandidate(booking, progress, now),
    bookingStatus: mapSubmissionStatus(booking),
    actions: {
      message: candidateEmail
        ? {
            label: "Message",
            type: "email",
            value: candidateEmail,
            url: `mailto:${candidateEmail}`,
          }
        : null,
      view: {
        label: "View",
        type: "view_candidate",
        url: `/admin/candidates/${booking._id}`,
        apiUrl: `/api/admin/candidates/${booking._id}`,
      },
    },
  };
}

function buildCandidateReviewStatus(booking) {
  const submissionStatus = mapSubmissionStatus(booking);

  if (submissionStatus.key === "approved") {
    return {
      key: "approved",
      label: "Approved",
      tone: "success",
    };
  }

  if (submissionStatus.key === "rejected") {
    return {
      key: "rejected",
      label: "Rejected",
      tone: "danger",
    };
  }

  return {
    key: "pending_review",
    label: "Pending Review",
    tone: "warning",
  };
}

function splitChecklistItems(content) {
  const normalizedContent = normalizeString(content);

  if (!normalizedContent) {
    return [];
  }

  const lineItems = normalizedContent
    .split(/\r?\n|•|;|\|/)
    .map((item) => normalizeString(item))
    .filter(Boolean);

  if (lineItems.length > 1) {
    return lineItems.slice(0, 8);
  }

  return normalizedContent
    .split(". ")
    .map((item) => normalizeString(item.replace(/\.$/, "")))
    .filter(Boolean)
    .slice(0, 8);
}

function buildFallbackChecklistSections(booking, course) {
  const courseTitle = course?.title || booking.courseSnapshot?.title || "Selected course";
  const qualification = course?.qualification || booking.courseSnapshot?.qualification || "";
  const sessionLocation = booking.session?.location || course?.location || booking.courseSnapshot?.location || "";
  const sessionLabel = formatDisplayDateTime(booking.session?.startDateTime);
  const trainingCenter = booking.personalDetails?.trainingCenter || "";

  return [
    {
      title: "Candidate Submission",
      rows: [
        `Candidate details submitted for ${courseTitle}`,
        booking.personalDetails?.email
          ? `Primary email provided: ${booking.personalDetails.email}`
          : "Primary email provided",
        booking.personalDetails?.phoneNumber
          ? `Primary phone provided: ${booking.personalDetails.phoneNumber}`
          : "Primary phone provided",
      ],
    },
    {
      title: "Course & Session Review",
      rows: [
        qualification ? `Qualification selected: ${qualification}` : `Course selected: ${courseTitle}`,
        trainingCenter ? `Training centre selected: ${trainingCenter}` : "Training centre selected",
        sessionLabel
          ? `Session schedule prepared for ${sessionLabel}`
          : "Session schedule awaiting confirmation",
        sessionLocation ? `Session location: ${sessionLocation}` : "Session location awaiting confirmation",
      ],
    },
    {
      title: "Payment & Approval",
      rows: [
        `Payment status recorded as ${booking.payment?.status || "pending"}`,
        `Booking status recorded as ${booking.status || "pending_payment"}`,
        booking.notes ? "Admin notes recorded for this candidate" : "No admin notes recorded yet",
      ],
    },
  ];
}

function buildCandidateChecklistSummary(booking, course) {
  const reviewStatus = buildCandidateReviewStatus(booking);
  const sourceTitle =
    normalizeString(course?.sourceCourseName) ||
    normalizeString(course?.title) ||
    normalizeString(booking.courseSnapshot?.title) ||
    "Candidate";

  const sourceSections =
    Array.isArray(course?.detailSections) && course.detailSections.length > 0
      ? course.detailSections.map((section) => ({
          title: section.title,
          rows: splitChecklistItems(section.content),
        }))
      : buildFallbackChecklistSections(booking, course);

  const sections = sourceSections
    .map((section, sectionIndex) => {
      const rows = (Array.isArray(section.rows) ? section.rows : [])
        .map((item) => normalizeString(item))
        .filter(Boolean)
        .slice(0, 8)
        .map((criterion, rowIndex) => ({
          id: `${booking._id}-section-${sectionIndex + 1}-row-${rowIndex + 1}`,
          no: rowIndex + 1,
          criterion,
          knowledge: reviewStatus,
          experience: reviewStatus,
        }));

      if (rows.length === 0) {
        return null;
      }

      const summary = {
        totalItems: rows.length,
        approvedItems: reviewStatus.key === "approved" ? rows.length : 0,
        pendingItems: reviewStatus.key === "pending_review" ? rows.length : 0,
        rejectedItems: reviewStatus.key === "rejected" ? rows.length : 0,
      };

      return {
        id: `${booking._id}-section-${sectionIndex + 1}`,
        title: section.title || `Checklist Section ${sectionIndex + 1}`,
        status: reviewStatus,
        rows,
        summary,
      };
    })
    .filter(Boolean);

  return {
    title: `${sourceTitle} Checklist Summary`,
    isDerived: true,
    status: reviewStatus,
    sections,
    summary: sections.reduce(
      (accumulator, section) => {
        accumulator.totalSections += 1;
        accumulator.totalItems += section.summary.totalItems;
        accumulator.approvedItems += section.summary.approvedItems;
        accumulator.pendingItems += section.summary.pendingItems;
        accumulator.rejectedItems += section.summary.rejectedItems;
        return accumulator;
      },
      {
        totalSections: 0,
        totalItems: 0,
        approvedItems: 0,
        pendingItems: 0,
        rejectedItems: 0,
      }
    ),
    download: {
      label: "Download",
      available: false,
      url: null,
      reason: "Checklist exports are not implemented yet",
    },
  };
}

function buildCandidateDocuments(booking, course) {
  const bookingNumber = booking.bookingNumber || String(booking._id || "");
  const courseSlug = course?.slug || booking.courseSnapshot?.slug || "course";
  const courseTitle = course?.title || booking.courseSnapshot?.title || "Selected Course";
  const hasPaidReceipt = booking.payment?.status === "paid" && booking.payment?.transactionId;

  const items = [
    {
      id: `${booking._id}-document-submission`,
      name: `${bookingNumber}_submission_record.pdf`,
      description: "Derived from the candidate booking form and submission metadata.",
      category: "submission_record",
      isDerived: true,
      available: false,
      previewUrl: null,
      downloadUrl: null,
    },
    {
      id: `${booking._id}-document-identity`,
      name: `${bookingNumber}_identity_reference.pdf`,
      description: "Placeholder for candidate identity uploads until document storage is added.",
      category: "identity",
      isDerived: true,
      available: false,
      previewUrl: null,
      downloadUrl: null,
    },
    {
      id: `${booking._id}-document-course`,
      name: `${courseSlug || "course"}_summary.pdf`,
      description: `Derived summary for ${courseTitle}.`,
      category: "course_summary",
      isDerived: true,
      available: false,
      previewUrl: null,
      downloadUrl: null,
    },
  ];

  if (hasPaidReceipt) {
    items.splice(1, 0, {
      id: `${booking._id}-document-receipt`,
      name: `${bookingNumber}_payment_receipt.pdf`,
      description: "Derived payment receipt placeholder linked to the successful booking payment.",
      category: "payment_receipt",
      isDerived: true,
      available: false,
      previewUrl: null,
      downloadUrl: null,
    });
  }

  return {
    title: "Uploaded Documents",
    isDerived: true,
    items: items.slice(0, 4),
    downloadAll: {
      label: "Download all",
      available: false,
      url: null,
      reason: "File storage has not been implemented for candidate documents yet",
    },
    emptyState: null,
  };
}

function buildCandidateVerification(booking) {
  const providerStatus = buildCandidateReviewStatus(booking);
  const candidateStatus = {
    key: "signed",
    label: "Signed",
    tone: "success",
  };

  return {
    title: "Signatures & Verification",
    items: [
      {
        id: "candidate",
        label: "Candidate",
        status: candidateStatus,
        supportingText: "Candidate submission has been received and recorded.",
        action: {
          label: "View",
          type: "view_booking",
          url: `/admin/bookings/${booking._id}`,
        },
      },
      {
        id: "training_provider",
        label: "Training Provider",
        status:
          providerStatus.key === "approved"
            ? {
                key: "signed",
                label: "Signed",
                tone: "success",
              }
            : providerStatus,
        supportingText:
          providerStatus.key === "approved"
            ? "Training provider verification has been completed."
            : "Training provider verification is still awaiting review.",
        action: {
          label: "View",
          type: "view_booking",
          url: `/admin/bookings/${booking._id}`,
        },
      },
    ],
  };
}

function buildCandidateReviewDecision(booking) {
  const currentStatus = buildCandidateReviewStatus(booking);
  const approvePayload = {
    status: "confirmed",
    paymentStatus: "paid",
  };
  const rejectPayload =
    booking.payment?.status === "paid"
      ? {
          status: "cancelled",
          paymentStatus: "refunded",
        }
      : {
          status: "cancelled",
        };

  return {
    title: "Review Decision",
    currentStatus,
    actions: {
      approve: {
        label: "Approve Candidate",
        tone: "success",
        method: "PATCH",
        url: `/api/admin/bookings/${booking._id}`,
        payload: approvePayload,
        enabled: !(booking.status === "confirmed" && booking.payment?.status === "paid"),
      },
      reject: {
        label: "Reject Candidate",
        tone: "danger",
        method: "PATCH",
        url: `/api/admin/bookings/${booking._id}`,
        payload: rejectPayload,
        enabled: booking.status !== "cancelled",
      },
    },
  };
}

function mapCandidateView(booking) {
  const candidateName = booking.personalDetails?.fullName || booking.user?.name || "Unknown Candidate";
  const candidateEmail = booking.personalDetails?.email || booking.user?.email || "";
  const course = booking.course && typeof booking.course === "object" ? booking.course : null;
  const reviewStatus = buildCandidateReviewStatus(booking);
  const progress = calculateCandidateProgress(booking);
  const candidateNumber = String(booking.user?._id || booking._id || "")
    .slice(-6)
    .toUpperCase();

  return {
    id: booking._id,
    bookingId: booking._id,
    bookingNumber: booking.bookingNumber,
    submittedAt: booking.createdAt,
    submittedAtLabel: formatDisplayDateTime(booking.createdAt),
    submittedRelative: formatRelativeTime(booking.createdAt),
    reviewStatus,
    breadcrumbs: [
      {
        label: "Dashboard",
        url: "/admin/dashboard",
      },
      {
        label: "Candidates",
        url: "/admin/candidates",
      },
      {
        label: candidateName,
        url: `/admin/candidates/${booking._id}`,
      },
    ],
    candidate: {
      id: booking.user?._id || null,
      name: candidateName,
      email: candidateEmail,
      phoneNumber: booking.personalDetails?.phoneNumber || "",
      initial: getInitial(candidateName),
      avatarTone: getAvatarTone(candidateName || candidateEmail),
      candidateNumber,
      nationalInsuranceNumber: null,
      submittedAtLabel: formatDisplayDateTime(booking.createdAt),
      address: booking.personalDetails?.address || "",
      city: booking.personalDetails?.city || "",
      postcode: booking.personalDetails?.postcode || "",
      trainingCenter: booking.personalDetails?.trainingCenter || "",
    },
    course: {
      id: booking.course?._id || booking.course || null,
      title: course?.title || booking.courseSnapshot?.title || "",
      slug: course?.slug || booking.courseSnapshot?.slug || "",
      qualification: course?.qualification || booking.courseSnapshot?.qualification || "",
      schedule: course?.schedule || booking.courseSnapshot?.schedule || "",
      duration: course?.duration || booking.courseSnapshot?.duration || "",
      location: booking.session?.location || course?.location || booking.courseSnapshot?.location || "",
      progress,
    },
    verification: buildCandidateVerification(booking),
    uploadedDocuments: buildCandidateDocuments(booking, course),
    checklistSummary: buildCandidateChecklistSummary(booking, course),
    reviewDecision: buildCandidateReviewDecision(booking),
    adminNotes: booking.notes || "",
    relatedLinks: {
      booking: `/api/admin/bookings/${booking._id}`,
      updateBooking: `/api/admin/bookings/${booking._id}`,
    },
  };
}

function buildActivityFeed({ recentUsers = [], recentBookings = [], recentCourses = [] }) {
  const userActivities = recentUsers.map((user) => ({
    id: `user-${user._id}`,
    type: "user_signup",
    title: `${user.name} joined the platform`,
    subtitle: user.email,
    occurredAt: user.createdAt,
    relativeTime: formatRelativeTime(user.createdAt),
    tone: "info",
  }));

  const bookingActivities = recentBookings.map((booking) => {
    const candidateName = booking.personalDetails?.fullName || booking.user?.name || "A candidate";

    let title = `${candidateName} submitted a booking`;
    let occurredAt = booking.createdAt;
    let tone = "warning";

    if (booking.status === "cancelled" || booking.payment?.status === "refunded") {
      title = `${candidateName}'s booking was cancelled`;
      occurredAt = booking.cancelledAt || booking.updatedAt || booking.createdAt;
      tone = "danger";
    } else if (booking.status === "confirmed" && booking.payment?.status === "paid") {
      title = `${candidateName}'s booking was approved`;
      occurredAt = booking.confirmedAt || booking.updatedAt || booking.createdAt;
      tone = "success";
    }

    return {
      id: `booking-${booking._id}`,
      type: "booking",
      title,
      subtitle: booking.courseSnapshot?.title || "",
      occurredAt,
      relativeTime: formatRelativeTime(occurredAt),
      tone,
    };
  });

  const courseActivities = recentCourses.map((course) => ({
    id: `course-${course._id}`,
    type: "course",
    title: `Course updated: ${course.title}`,
    subtitle: course.status,
    occurredAt: course.updatedAt,
    relativeTime: formatRelativeTime(course.updatedAt),
    tone: "info",
  }));

  return [...bookingActivities, ...userActivities, ...courseActivities]
    .sort((left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime())
    .slice(0, 8);
}

async function getDashboard(req, res, next) {
  try {
    const [
      totalUsers,
      adminUsers,
      totalCourses,
      availableCourses,
      totalBookings,
      confirmedBookings,
      pendingBookings,
      recentUsers,
      recentSubmissions,
      recentBookingsForActivity,
      recentCourses,
    ] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "admin" }),
        Course.countDocuments(),
        Course.countDocuments({ status: "available", isPublished: true }),
        Booking.countDocuments(),
        Booking.countDocuments({ status: "confirmed", "payment.status": "paid" }),
        Booking.countDocuments({
          $or: [{ status: "pending_payment" }, { "payment.status": "failed" }],
        }),
        User.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select("name email role createdAt"),
        Booking.find()
          .populate("user", "name email")
          .sort({ createdAt: -1 })
          .limit(10),
        Booking.find()
          .populate("user", "name email")
          .sort({ updatedAt: -1, createdAt: -1 })
          .limit(10),
        Course.find()
          .sort({ updatedAt: -1, createdAt: -1 })
          .limit(5)
          .select("title status updatedAt"),
      ]);

    const revenue = await Booking.aggregate([
      {
        $match: {
          status: "confirmed",
          "payment.status": "paid",
        },
      },
      {
        $group: {
          _id: "$payment.currency",
          totalRevenue: { $sum: "$payment.amount" },
        },
      },
    ]);

    const revenueSummary = revenue.map((item) => ({
      currency: item._id || "GBP",
      totalRevenue: item.totalRevenue,
    }));

    const activityFeed = buildActivityFeed({
      recentUsers,
      recentBookings: recentBookingsForActivity,
      recentCourses,
    });

    return res.status(200).json({
      success: true,
      message: "Admin dashboard data fetched successfully",
      data: {
        summary: {
          totalUsers,
          adminUsers,
          standardUsers: totalUsers - adminUsers,
          totalCourses,
          availableCourses,
          totalBookings,
          confirmedBookings,
          pendingBookings,
        },
        revenue: revenueSummary,
        recentSubmissions: {
          title: "Recent Submissions",
          viewAllUrl: "/admin/bookings",
          pendingCount: pendingBookings,
          items: recentSubmissions.map(mapRecentSubmission),
        },
        quickActions: [
          {
            id: "review-pending-checklists",
            label: "Review Pending Checklists",
            count: pendingBookings,
            url: "/admin/bookings?status=pending_payment",
          },
          {
            id: "manage-courses",
            label: "Manage Courses",
            count: totalCourses,
            url: "/admin/courses",
          },
          {
            id: "view-bookings",
            label: "View Bookings",
            count: totalBookings,
            url: "/admin/bookings",
          },
        ],
        systemActivity: {
          title: "System Activity",
          items: activityFeed,
        },
        recentUsers,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("name email role createdAt updatedAt");

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: {
        users,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function listSubmissions(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query || {});
    const search = normalizeString(req.query.search);
    const courseId = normalizeString(req.query.courseId || req.query.fromCourseId);
    const courseSlug = normalizeString(req.query.courseSlug || req.query.fromCourseSlug).toLowerCase();
    const status = normalizeString(req.query.status).toLowerCase();

    if (status && !SUBMISSION_STATUS_OPTIONS.some((option) => option.value === status)) {
      return res.status(400).json({
        success: false,
        message: "status must be not_started, awaiting_signatures, pending, approved, or rejected",
      });
    }

    const filter = {};

    if (courseId) {
      if (!mongoose.isValidObjectId(courseId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid course id",
        });
      }

      filter.course = courseId;
    }

    if (courseSlug) {
      filter["courseSnapshot.slug"] = courseSlug;
    }

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");
      filter.$or = [
        { "personalDetails.fullName": searchRegex },
        { "personalDetails.email": searchRegex },
        { "courseSnapshot.title": searchRegex },
        { bookingNumber: searchRegex },
      ];
    }

    const [bookings, courseOptions] = await Promise.all([
      Booking.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(500),
      Course.find()
        .sort({ title: 1 })
        .limit(200)
        .select("title slug"),
    ]);

    const allSubmissionItems = bookings.map(mapRecentSubmission);
    const submissionItems = allSubmissionItems
      .filter((item) => (status ? item.status.key === status : true));

    const summary = buildSubmissionSummary(submissionItems);
    const paginatedItems = submissionItems.slice(skip, skip + limit);

    return res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      data: {
        submissions: paginatedItems,
        filters: {
          search,
          status: status || null,
          courseId: courseId || null,
          courseSlug: courseSlug || null,
        },
        filterOptions: {
          placeholders: {
            status: "All Statuses",
            from: "Select your From",
          },
          statuses: buildSubmissionStatusOptions(allSubmissionItems),
          fromCourses: buildSubmissionCourseOptions(courseOptions),
        },
        summary,
        pagination: {
          page,
          limit,
          total: submissionItems.length,
          totalPages: Math.max(1, Math.ceil(submissionItems.length / limit)),
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function listCandidates(req, res, next) {
  try {
    const now = new Date();
    const { page, limit, skip } = parsePagination(req.query || {});
    const search = normalizeString(req.query.search);
    const courseId = normalizeString(req.query.courseId);
    const courseSlug = normalizeString(req.query.courseSlug).toLowerCase();
    const stuckOnly = normalizeBoolean(req.query.stuckOnly, false);
    const sortBy = normalizeString(req.query.sortBy).toLowerCase() || "submitted";
    const sortOrder = normalizeString(req.query.sortOrder).toLowerCase() === "asc" ? "asc" : "desc";

    if (courseId && !mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course id",
      });
    }

    const filter = {};

    if (courseId) {
      filter.course = courseId;
    }

    if (courseSlug) {
      filter["courseSnapshot.slug"] = courseSlug;
    }

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");
      filter.$or = [
        { "personalDetails.fullName": searchRegex },
        { "personalDetails.email": searchRegex },
        { "courseSnapshot.title": searchRegex },
        { bookingNumber: searchRegex },
      ];
    }

    const bookings = await Booking.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(500);

    const candidateRows = bookings
      .map((booking) => mapCandidateRow(booking, now))
      .filter((candidate) => (stuckOnly ? candidate.isStuck : true))
      .sort((left, right) => {
        const direction = sortOrder === "asc" ? 1 : -1;

        if (sortBy === "progress") {
          return (left.progress.percentage - right.progress.percentage) * direction;
        }

        if (sortBy === "name") {
          return left.candidate.name.localeCompare(right.candidate.name) * direction;
        }

        return (new Date(left.submittedAt).getTime() - new Date(right.submittedAt).getTime()) * direction;
      });

    const total = candidateRows.length;
    const paginatedCandidates = candidateRows.slice(skip, skip + limit);
    const stuckCandidatesCount = candidateRows.filter((candidate) => candidate.isStuck).length;

    return res.status(200).json({
      success: true,
      message: "Candidates fetched successfully",
      data: {
        candidates: paginatedCandidates,
        filters: {
          search,
          courseId: courseId || null,
          courseSlug: courseSlug || null,
          stuckOnly,
          sortBy,
          sortOrder,
        },
        summary: {
          totalCandidates: total,
          stuckCandidates: stuckCandidatesCount,
        },
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getCandidateById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate id",
      });
    }

    const booking = await Booking.findById(id)
      .populate("user", "name email role")
      .populate(
        "course",
        "title slug qualification sourceCourseName location schedule duration detailSections"
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Candidate view fetched successfully",
      data: {
        candidate: mapCandidateView(booking),
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getDashboard,
  listUsers,
  listSubmissions,
  listCandidates,
  getCandidateById,
};
