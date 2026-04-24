const multer = require("multer");

const { uploadBufferToCloudinary } = require("../utils/cloudinary");

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const allowedBookingMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);

const imageUpload = multer({
  storage: multer.memoryStorage(),
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

const bookingDocumentUpload = multer({
  storage: multer.memoryStorage(),
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

async function uploadFileToCloudinary(file, folder, resourceType = "image") {
  const result = await uploadBufferToCloudinary(file.buffer, {
    folder,
    resource_type: resourceType,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  });

  return {
    fileName: file.originalname,
    fileUrl: result.secure_url,
    mimeType: file.mimetype,
  };
}

function uploadCourseImage(req, res, next) {
  imageUpload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ])(req, res, async (error) => {
    if (error) {
      return next(error);
    }

    try {
      const uploadedFile = req.files?.file?.[0] || req.files?.image?.[0] || req.files?.thumbnail?.[0];

      if (uploadedFile) {
        const uploadResult = await uploadFileToCloudinary(
          uploadedFile,
          "londonessexelec/courses",
          "image"
        );
        req.uploadedImageUrl = uploadResult.fileUrl;
      }

      return next();
    } catch (uploadError) {
      return next(uploadError);
    }
  });
}

function uploadBookingDocument(req, res, next) {
  bookingDocumentUpload.single("file")(req, res, async (error) => {
    if (error) {
      return next(error);
    }

    try {
      if (req.file) {
        req.uploadedDocument = await uploadFileToCloudinary(
          req.file,
          "londonessexelec/bookings/documents",
          "auto"
        );
      }

      return next();
    } catch (uploadError) {
      return next(uploadError);
    }
  });
}

function uploadBookingSignatureImage(req, res, next) {
  imageUpload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "candidateSignature", maxCount: 1 },
  ])(req, res, async (error) => {
    if (error) {
      return next(error);
    }

    try {
      const uploadedFile =
        req.files?.file?.[0] ||
        req.files?.image?.[0] ||
        req.files?.signature?.[0] ||
        req.files?.candidateSignature?.[0];

      if (uploadedFile) {
        req.uploadedSignatureFile = await uploadFileToCloudinary(
          uploadedFile,
          "londonessexelec/bookings/signatures",
          "image"
        );
      }

      return next();
    } catch (uploadError) {
      return next(uploadError);
    }
  });
}

function uploadTeamImage(req, res, next) {
  imageUpload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ])(req, res, async (error) => {
    if (error) {
      return next(error);
    }

    try {
      const uploadedFile = req.files?.file?.[0] || req.files?.image?.[0] || req.files?.photo?.[0];

      if (uploadedFile) {
        const uploadResult = await uploadFileToCloudinary(
          uploadedFile,
          "londonessexelec/team",
          "image"
        );
        req.uploadedImageUrl = uploadResult.fileUrl;
      }

      return next();
    } catch (uploadError) {
      return next(uploadError);
    }
  });
}

module.exports = {
  uploadCourseImage,
  uploadBookingDocument,
  uploadBookingSignatureImage,
  uploadTeamImage,
};
