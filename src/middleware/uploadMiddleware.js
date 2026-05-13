const multer = require("multer");

const { uploadBufferToCloudinary } = require("../utils/cloudinary");

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const maxImageUploadSize = 5 * 1024 * 1024;
const maxImageFieldSize = 8 * 1024 * 1024;
const inlineCourseImageFields = ["thumbnailUrl", "file", "image", "courseImage", "thumbnail"];
const imageExtensionsByMimeType = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
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
    fileSize: maxImageUploadSize,
    fieldSize: maxImageFieldSize,
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

function getStringFieldValue(body, fieldName) {
  const value = body?.[fieldName];

  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0].trim() : "";
  }

  return typeof value === "string" ? value.trim() : "";
}

function parseInlineImageDataUrl(value) {
  if (!value.startsWith("data:")) {
    return null;
  }

  const match = value.match(/^data:([^;,]+);base64,(.+)$/s);

  if (!match) {
    throw new Error("Invalid image data URL");
  }

  const mimeType = match[1].toLowerCase();

  if (!allowedMimeTypes.has(mimeType)) {
    throw new Error("Only JPG, PNG, and WEBP image uploads are allowed");
  }

  const base64Value = match[2].replace(/\s/g, "");

  if (!base64Value || !/^[A-Za-z0-9+/]+={0,2}$/.test(base64Value)) {
    throw new Error("Invalid image data URL");
  }

  const buffer = Buffer.from(base64Value, "base64");

  if (!buffer.length) {
    throw new Error("Invalid image data URL");
  }

  if (buffer.length > maxImageUploadSize) {
    throw new Error("Image size must be 5MB or smaller");
  }

  return {
    buffer,
    mimetype: mimeType,
    originalname: `course-image.${imageExtensionsByMimeType[mimeType] || "jpg"}`,
  };
}

async function uploadInlineCourseImage(req) {
  if (req.uploadedImageUrl) {
    return;
  }

  for (const fieldName of inlineCourseImageFields) {
    const fieldValue = getStringFieldValue(req.body, fieldName);
    const inlineImage = fieldValue ? parseInlineImageDataUrl(fieldValue) : null;

    if (!inlineImage) {
      continue;
    }

    const uploadResult = await uploadFileToCloudinary(
      inlineImage,
      "londonessexelec/courses",
      "image"
    );

    req.uploadedImageUrl = uploadResult.fileUrl;
    req.body.thumbnailUrl = uploadResult.fileUrl;
    return;
  }
}

function uploadCourseImage(req, res, next) {
  const contentType = req.headers["content-type"] || "";

  // Allow normal JSON PATCH without multer
  if (!contentType.includes("multipart/form-data")) {
    return next();
  }

  imageUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
    { name: "courseImage", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ])(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Image upload failed",
      });
    }

    (async () => {
      try {
        if (!req.files) {
          req.files = {};
        }

        const uploadedFile =
          req.files?.image?.[0] ||
          req.files?.file?.[0] ||
          req.files?.courseImage?.[0] ||
          req.files?.thumbnail?.[0];

        if (uploadedFile) {
          const uploadResult = await uploadFileToCloudinary(
            uploadedFile,
            "londonessexelec/courses",
            "image"
          );

          req.uploadedImageUrl = uploadResult.fileUrl;
          req.body.thumbnailUrl = uploadResult.fileUrl;
        }

        await uploadInlineCourseImage(req);

        return next();
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: uploadError.message || "Image upload failed",
        });
      }
    })();
  });
}

function uploadBookingDocument(req, res, next) {
  bookingDocumentUpload.single("file")(req, res, (error) => {
    if (error) {
      return next(error);
    }

    (async () => {
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
    })();
  });
}

function uploadBookingSignatureImage(req, res, next) {
  imageUpload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "candidateSignature", maxCount: 1 },
  ])(req, res, (error) => {
    if (error) {
      return next(error);
    }

    (async () => {
      try {
        // Ensure req.files is initialized as an object
        if (!req.files) {
          req.files = {};
        }

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
    })();
  });
}

function uploadTeamImage(req, res, next) {
  imageUpload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ])(req, res, (error) => {
    if (error) {
      return next(error);
    }

    (async () => {
      try {
        // Ensure req.files is initialized as an object
        if (!req.files) {
          req.files = {};
        }

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
    })();
  });
}

function uploadUserProfileImage(req, res, next) {
  imageUpload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ])(req, res, (error) => {
    if (error) {
      return next(error);
    }

    (async () => {
      try {
        // Ensure req.files is initialized as an object
        if (!req.files) {
          req.files = {};
        }

        const uploadedFile =
          req.files?.file?.[0] ||
          req.files?.image?.[0] ||
          req.files?.photo?.[0] ||
          req.files?.avatar?.[0];

        if (uploadedFile) {
          const uploadResult = await uploadFileToCloudinary(
            uploadedFile,
            "londonessexelec/users/profile",
            "image"
          );
          req.uploadedImageUrl = uploadResult.fileUrl;
        }

        return next();
      } catch (uploadError) {
        return next(uploadError);
      }
    })();
  });
}

module.exports = {
  uploadCourseImage,
  uploadBookingDocument,
  uploadBookingSignatureImage,
  uploadTeamImage,
  uploadUserProfileImage,
};
