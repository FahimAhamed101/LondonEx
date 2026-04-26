const User = require("../models/User");
const { hashPassword, verifyPassword } = require("../utils/auth");

const NOTIFICATION_KEYS = [
  "courseUpdates",
  "bookingConfirmations",
  "checklistReminders",
  "documentRequests",
  "signatureRequests",
  "weeklyProgressDigest",
];

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value) {
  return normalizeString(value).toLowerCase();
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

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhoneNumber(phoneNumber) {
  return /^[0-9+\-\s()]{7,30}$/.test(phoneNumber);
}

function validatePassword(password) {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must include at least one number";
  }

  return null;
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

function buildSettingsTabs(activeTab) {
  return [
    {
      id: "profile",
      label: "Profile",
      active: activeTab === "profile",
      apiUrl: "/api/settings/profile",
    },
    {
      id: "notifications",
      label: "Notifications",
      active: activeTab === "notifications",
      apiUrl: "/api/settings/notifications",
    },
    {
      id: "security",
      label: "Security",
      active: activeTab === "security",
      apiUrl: "/api/settings/security",
    },
  ];
}

function buildSettingsBreadcrumb(activeLabel) {
  return [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Setting", href: "/settings/profile" },
    { label: activeLabel, href: `/settings/${activeLabel.toLowerCase()}` },
  ];
}

function buildSettingsSidebarProfile(user) {
  return {
    name: user.name || "",
    email: user.email || "",
    avatar: {
      imageUrl: user.profileImageUrl || "",
      initials: getInitial(user.name || user.email),
      tone: getAvatarTone(user.name || user.email),
    },
  };
}

function buildNotificationSettings(user) {
  const settings = user.notificationSettings || {};

  return {
    courseUpdates: normalizeBoolean(settings.courseUpdates, true),
    bookingConfirmations: normalizeBoolean(settings.bookingConfirmations, true),
    checklistReminders: normalizeBoolean(settings.checklistReminders, true),
    documentRequests: normalizeBoolean(settings.documentRequests, true),
    signatureRequests: normalizeBoolean(settings.signatureRequests, true),
    weeklyProgressDigest: normalizeBoolean(settings.weeklyProgressDigest, false),
  };
}

function buildProfileScreen(user) {
  return {
    breadcrumb: buildSettingsBreadcrumb("Profile"),
    title: "Setting",
    tabs: buildSettingsTabs("profile"),
    sidebarProfile: buildSettingsSidebarProfile(user),
    section: {
      title: "Profile Information",
      subtitle: "Update your personal details.",
      avatar: {
        imageUrl: user.profileImageUrl || "",
        initials: getInitial(user.name || user.email),
        tone: getAvatarTone(user.name || user.email),
        actions: {
          upload: {
            label: "Change Photo",
            method: "PATCH",
            apiUrl: "/api/settings/profile",
            fieldName: "file",
          },
          delete: {
            label: "Delete",
            method: "DELETE",
            apiUrl: "/api/settings/profile/photo",
            enabled: Boolean(user.profileImageUrl),
          },
        },
      },
      form: {
        submitAction: {
          label: "Save Changes",
          method: "PATCH",
          apiUrl: "/api/settings/profile",
        },
        fields: [
          { id: "name", label: "Your Name", type: "text", value: user.name || "", required: true },
          { id: "email", label: "Your Email", type: "email", value: user.email || "", required: true },
          { id: "phoneNumber", label: "Contact Phone", type: "tel", value: user.phoneNumber || "", required: true },
          { id: "ntiNumber", label: "NTI Number", type: "text", value: user.ntiNumber || "", required: false },
        ],
      },
    },
  };
}

function buildNotificationsScreen(user) {
  const settings = buildNotificationSettings(user);

  return {
    breadcrumb: buildSettingsBreadcrumb("Notification"),
    title: "Setting",
    tabs: buildSettingsTabs("notifications"),
    sidebarProfile: buildSettingsSidebarProfile(user),
    section: {
      title: "Email Notifications",
      subtitle: "Choose which emails you want to receive.",
      submitAction: {
        label: "Save Changes",
        method: "PATCH",
        apiUrl: "/api/settings/notifications",
      },
      toggles: [
        {
          id: "courseUpdates",
          label: "Course Updates",
          description: "Get notified about changes to your enrolled courses",
          value: settings.courseUpdates,
        },
        {
          id: "bookingConfirmations",
          label: "Booking Confirmations",
          description: "Receive confirmation emails when you book a course",
          value: settings.bookingConfirmations,
        },
        {
          id: "checklistReminders",
          label: "Checklist Reminders",
          description: "Get reminders to complete your AM2 checklist sections",
          value: settings.checklistReminders,
        },
        {
          id: "documentRequests",
          label: "Document Requests",
          description: "Get notified when documents are requested or approved",
          value: settings.documentRequests,
        },
        {
          id: "signatureRequests",
          label: "Signature Requests",
          description: "Get notified when signatures are needed or received",
          value: settings.signatureRequests,
        },
        {
          id: "weeklyProgressDigest",
          label: "Weekly Progress Digest",
          description: "Receive a weekly summary of your progress and upcoming deadlines",
          value: settings.weeklyProgressDigest,
        },
      ],
    },
  };
}

function buildSecurityScreen(user) {
  return {
    breadcrumb: buildSettingsBreadcrumb("Security"),
    title: "Setting",
    tabs: buildSettingsTabs("security"),
    sidebarProfile: buildSettingsSidebarProfile(user),
    section: {
      title: "Change Password",
      subtitle: "Update your password to keep your account secure.",
      form: {
        submitAction: {
          label: "Save Changes",
          method: "POST",
          apiUrl: "/api/settings/security/password",
        },
        fields: [
          { id: "currentPassword", label: "Current Password", type: "password", value: "", required: true },
          { id: "newPassword", label: "New Password", type: "password", value: "", required: true },
          { id: "confirmPassword", label: "Confirm New Password", type: "password", value: "", required: true },
        ],
      },
    },
  };
}

async function findSettingsUser(userId, withPassword = false) {
  return withPassword
    ? User.findById(userId).select("+passwordHash +passwordSalt")
    : User.findById(userId);
}

async function getProfileSettingsScreen(req, res, next) {
  try {
    const user = await findSettingsUser(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Profile settings screen fetched successfully",
      data: {
        screen: buildProfileScreen(user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function updateProfileSettings(req, res, next) {
  try {
    const user = await findSettingsUser(req.user.id);
    const name = normalizeString(req.body.name);
    const email = normalizeEmail(req.body.email);
    const phoneNumber = normalizeString(req.body.phoneNumber);
    const ntiNumber = normalizeString(req.body.ntiNumber);

    if (!name || name.length < 2 || name.length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 80 characters",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "A valid email is required",
      });
    }

    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be between 7 and 30 valid characters",
      });
    }

    const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.ntiNumber = ntiNumber;

    if (req.uploadedImageUrl) {
      user.profileImageUrl = req.uploadedImageUrl;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile settings updated successfully",
      data: {
        screen: buildProfileScreen(user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteProfilePhoto(req, res, next) {
  try {
    const user = await findSettingsUser(req.user.id);
    user.profileImageUrl = "";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile photo removed successfully",
      data: {
        screen: buildProfileScreen(user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getNotificationSettingsScreen(req, res, next) {
  try {
    const user = await findSettingsUser(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Notification settings screen fetched successfully",
      data: {
        screen: buildNotificationsScreen(user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function updateNotificationSettings(req, res, next) {
  try {
    const user = await findSettingsUser(req.user.id);
    const currentSettings = buildNotificationSettings(user);

    user.notificationSettings = NOTIFICATION_KEYS.reduce((accumulator, key) => {
      accumulator[key] = Object.prototype.hasOwnProperty.call(req.body, key)
        ? normalizeBoolean(req.body[key], currentSettings[key])
        : currentSettings[key];
      return accumulator;
    }, {});

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Notification settings updated successfully",
      data: {
        screen: buildNotificationsScreen(user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getSecuritySettingsScreen(req, res, next) {
  try {
    const user = await findSettingsUser(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Security settings screen fetched successfully",
      data: {
        screen: buildSecurityScreen(user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function updatePasswordSettings(req, res, next) {
  try {
    const user = await findSettingsUser(req.user.id, true);
    const currentPassword = typeof req.body.currentPassword === "string" ? req.body.currentPassword : "";
    const newPassword = typeof req.body.newPassword === "string" ? req.body.newPassword : "";
    const confirmPassword = typeof req.body.confirmPassword === "string" ? req.body.confirmPassword : "";

    if (!verifyPassword(currentPassword, user.passwordSalt, user.passwordHash)) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password must match",
      });
    }

    const { salt, passwordHash } = hashPassword(newPassword);
    user.passwordSalt = salt;
    user.passwordHash = passwordHash;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: {
        screen: buildSecurityScreen(user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProfileSettingsScreen,
  updateProfileSettings,
  deleteProfilePhoto,
  getNotificationSettingsScreen,
  updateNotificationSettings,
  getSecuritySettingsScreen,
  updatePasswordSettings,
};
