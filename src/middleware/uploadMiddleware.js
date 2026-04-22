const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const multer = require("multer");

const uploadDirectory = path.join(process.cwd(), "uploads", "courses");
const bookingUploadDirectory = path.join(process.cwd(), "uploads", "bookings");
const teamUploadDirectory = path.join(process.cwd(), "uploads", "team");

fs.mkdirSync(uploadDirectory, { recursive: true });
fs.mkdirSync(bookingUploadDirectory, { recursive: true });
fs.mkdirSync(teamUploadDirectory, { recursive: true });

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const allowedBookingMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, uploadDirectory);
  },
  filename(req, file, callback) {
    const extension = path.extname(file.originalname || "").toLowerCase();
    const safeExtension = extension || ".jpg";

    callback(null, `course-${Date.now()}-${crypto.randomUUID()}${safeExtension}`);
  },
});

const uploader = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new Error("Only JPG, PNG, and WEBP image uploads are allowed"));
      return;
    }

    callback(null, true);
  },
});

const bookingUploader = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, bookingUploadDirectory);
    },
    filename(req, file, callback) {
      const extension = path.extname(file.originalname || "").toLowerCase();
      const safeExtension = extension || ".pdf";

      callback(null, `booking-${Date.now()}-${crypto.randomUUID()}${safeExtension}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter(req, file, callback) {
    if (!allowedBookingMimeTypes.has(file.mimetype)) {
      callback(new Error("Only PDF, JPG, PNG, and WEBP uploads are allowed"));
      return;
    }

    callback(null, true);
  },
});

const teamUploader = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, teamUploadDirectory);
    },
    filename(req, file, callback) {
      const extension = path.extname(file.originalname || "").toLowerCase();
      const safeExtension = extension || ".jpg";

      callback(null, `team-${Date.now()}-${crypto.randomUUID()}${safeExtension}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new Error("Only JPG, PNG, and WEBP image uploads are allowed"));
      return;
    }

    callback(null, true);
  },
});

function uploadCourseImage(req, res, next) {
  uploader.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ])(req, res, (error) => {
    if (error) {
      return next(error);
    }

    const uploadedFile = req.files?.file?.[0] || req.files?.image?.[0] || req.files?.thumbnail?.[0];

    if (uploadedFile) {
      req.uploadedImageUrl = `/uploads/courses/${uploadedFile.filename}`;
    }

    return next();
  });
}

function uploadBookingDocument(req, res, next) {
  bookingUploader.single("file")(req, res, (error) => {
    if (error) {
      return next(error);
    }

    if (req.file) {
      req.uploadedDocument = {
        fileName: req.file.originalname,
        fileUrl: `/uploads/bookings/${req.file.filename}`,
        mimeType: req.file.mimetype,
      };
    }

    return next();
  });
}

function uploadTeamImage(req, res, next) {
  teamUploader.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ])(req, res, (error) => {
    if (error) {
      return next(error);
    }

    const uploadedFile = req.files?.file?.[0] || req.files?.image?.[0] || req.files?.photo?.[0];

    if (uploadedFile) {
      req.uploadedImageUrl = `/uploads/team/${uploadedFile.filename}`;
    }

    return next();
  });
}

module.exports = {
  uploadCourseImage,
  uploadBookingDocument,
  uploadTeamImage,
};
