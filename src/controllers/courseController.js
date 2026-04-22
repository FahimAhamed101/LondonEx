const mongoose = require("mongoose");

const Course = require("../models/Course");
const Booking = require("../models/Booking");

const COURSE_STATUSES = ["available", "upcoming", "archived"];

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseJsonArrayString(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue.startsWith("[") || !trimmedValue.endsWith("]")) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(trimmedValue);
    return Array.isArray(parsedValue) ? parsedValue : null;
  } catch (error) {
    return null;
  }
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

function normalizeTags(tags) {
  if (typeof tags === "string") {
    const parsedArray = parseJsonArrayString(tags);
    if (parsedArray) {
      return parsedArray
        .map((tag) => normalizeString(tag))
        .filter(Boolean)
        .slice(0, 20);
    }

    return tags
      .split(",")
      .map((tag) => normalizeString(tag))
      .filter(Boolean)
      .slice(0, 20);
  }

  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map((tag) => normalizeString(tag))
    .filter(Boolean)
    .slice(0, 20);
}

function normalizeStringArray(values, maxItems = 10) {
  if (typeof values === "string") {
    const parsedArray = parseJsonArrayString(values);
    if (parsedArray) {
      return parsedArray
        .map((value) => normalizeString(value))
        .filter(Boolean)
        .slice(0, maxItems);
    }

    return values
      .split(",")
      .map((value) => normalizeString(value))
      .filter(Boolean)
      .slice(0, maxItems);
  }

  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value) => normalizeString(value))
    .filter(Boolean)
    .slice(0, maxItems);
}

function normalizeDetailSections(sections) {
  if (typeof sections === "string") {
    const parsedSections = parseJsonArrayString(sections);
    if (parsedSections) {
      return parsedSections
        .map((section) => ({
          title: normalizeString(section && section.title),
          content: normalizeString(section && section.content),
        }))
        .filter((section) => section.title && section.content)
        .slice(0, 10);
    }

    return [];
  }

  if (!Array.isArray(sections)) {
    return [];
  }

  return sections
    .map((section) => ({
      title: normalizeString(section && section.title),
      content: normalizeString(section && section.content),
    }))
    .filter((section) => section.title && section.content)
    .slice(0, 10);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugify(value) {
  const normalizedValue = normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalizedValue || `course-${Date.now()}`;
}

async function ensureUniqueSlug(baseSlug, excludeId) {
  let candidateSlug = baseSlug;
  let suffix = 1;

  while (true) {
    const existingCourse = await Course.findOne({
      slug: candidateSlug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    }).select("_id");

    if (!existingCourse) {
      return candidateSlug;
    }

    suffix += 1;
    candidateSlug = `${baseSlug}-${suffix}`;
  }
}

function deriveShortDescription(description, overview) {
  const fallbackSource = normalizeString(description) || normalizeString(overview);

  if (!fallbackSource) {
    return "";
  }

  return fallbackSource.length <= 160 ? fallbackSource : `${fallbackSource.slice(0, 157)}...`;
}

function normalizeObjectId(value) {
  const normalizedValue = normalizeString(value);
  return normalizedValue && mongoose.isValidObjectId(normalizedValue) ? normalizedValue : "";
}

function parseDateValue(value, label) {
  const normalizedValue = normalizeString(value);

  if (!normalizedValue) {
    return { value: null };
  }

  const parsedDate = new Date(normalizedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return { error: `${label} must be a valid date` };
  }

  return { value: parsedDate };
}

function composeScheduleLabel(sessionDate, timeSlot, duration) {
  const scheduleParts = [];

  if (sessionDate) {
    scheduleParts.push(
      new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(sessionDate)
    );
  }

  if (timeSlot) {
    scheduleParts.push(timeSlot);
  }

  if (duration) {
    scheduleParts.push(duration);
  }

  return scheduleParts.join(" | ");
}

function buildScheduleLabel({ schedule, sessionDate, timeSlot, duration }) {
  if (schedule) {
    return schedule;
  }

  return composeScheduleLabel(sessionDate, timeSlot, duration);
}

function buildCoursePayload(payload, options = {}) {
  const { partial = false } = options;

  const title = normalizeString(payload.title);
  const customSlug = normalizeString(payload.slug);
  const status = normalizeString(payload.status).toLowerCase();
  const description = normalizeString(payload.description);
  const overview = normalizeString(payload.overview);
  const shortDescription =
    normalizeString(payload.shortDescription) || (!partial ? deriveShortDescription(description, overview) : "");
  const sessionDateResult = parseDateValue(payload.sessionDate || payload.date, "Date");
  const sessionDate = sessionDateResult.value;
  const timeSlot = normalizeString(payload.timeSlot || payload.time || payload.sessionTime);
  const schedule = buildScheduleLabel({
    schedule: normalizeString(payload.schedule),
    sessionDate,
    timeSlot,
    duration: normalizeString(payload.duration),
  });
  const qualification = normalizeString(payload.qualification);
  const sourceCourseId = normalizeObjectId(
    payload.sourceCourseId || payload.fromCourseId || payload.sourceCourse || payload.fromCourse
  );
  const sourceCourseName =
    normalizeString(payload.sourceCourseName || payload.fromCourseName || payload.from) || "";
  const location = normalizeString(payload.location);
  const entryRequirements = normalizeString(payload.entryRequirements);
  const audience = normalizeString(payload.audience);
  const duration = normalizeString(payload.duration);
  const thumbnailUrl = normalizeString(payload.thumbnailUrl);
  const galleryImages = normalizeStringArray(payload.galleryImages, 8);
  const bookNowUrl = normalizeString(payload.bookNowUrl);
  const totalSeats = normalizeNumber(payload.totalSeats, 0);
  const currency = normalizeString(payload.currency).toUpperCase() || "GBP";
  const tags = normalizeTags(payload.tags);
  const detailSections = normalizeDetailSections(payload.detailSections);

  const courseData = {};

  if (sessionDateResult.error) {
    return { error: sessionDateResult.error };
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, "title")) {
    if (!title) {
      return { error: "Title is required" };
    }

    if (title.length < 3 || title.length > 160) {
      return { error: "Title must be between 3 and 160 characters" };
    }

    courseData.title = title;
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, "slug") || courseData.title) {
    const rawSlug = customSlug || title;
    const slug = slugify(rawSlug);

    if (!slug) {
      return { error: "A valid slug could not be generated for this course" };
    }

    courseData.slug = slug;
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, "status")) {
    const normalizedStatus = status || "available";
    if (!COURSE_STATUSES.includes(normalizedStatus)) {
      return { error: "Status must be one of available, upcoming, or archived" };
    }

    courseData.status = normalizedStatus;
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, "schedule")) {
    if (!schedule) {
      return { error: "Schedule is required" };
    }

    if (schedule.length > 120) {
      return { error: "Schedule must be 120 characters or fewer" };
    }

    courseData.schedule = schedule;
  }

  if (
    partial &&
    !Object.prototype.hasOwnProperty.call(payload, "schedule") &&
    (Object.prototype.hasOwnProperty.call(payload, "sessionDate") ||
      Object.prototype.hasOwnProperty.call(payload, "date") ||
      Object.prototype.hasOwnProperty.call(payload, "timeSlot") ||
      Object.prototype.hasOwnProperty.call(payload, "time") ||
      Object.prototype.hasOwnProperty.call(payload, "sessionTime") ||
      Object.prototype.hasOwnProperty.call(payload, "duration"))
  ) {
    courseData.schedule = schedule;
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, "shortDescription")) {
    if (!shortDescription) {
      return { error: "Short description is required" };
    }

    if (shortDescription.length < 10 || shortDescription.length > 500) {
      return { error: "Short description must be between 10 and 500 characters" };
    }

    courseData.shortDescription = shortDescription;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "description") || !partial) {
    if (description.length > 3000) {
      return { error: "Description must be 3000 characters or fewer" };
    }

    courseData.description = description;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "overview") || !partial) {
    if (overview.length > 1200) {
      return { error: "Overview must be 1200 characters or fewer" };
    }

    courseData.overview = overview;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "qualification") || !partial) {
    if (qualification.length > 150) {
      return { error: "Qualification must be 150 characters or fewer" };
    }

    courseData.qualification = qualification;
  }

  if (
    Object.prototype.hasOwnProperty.call(payload, "sourceCourseId") ||
    Object.prototype.hasOwnProperty.call(payload, "fromCourseId") ||
    Object.prototype.hasOwnProperty.call(payload, "sourceCourse") ||
    Object.prototype.hasOwnProperty.call(payload, "fromCourse") ||
    Object.prototype.hasOwnProperty.call(payload, "sourceCourseName") ||
    Object.prototype.hasOwnProperty.call(payload, "fromCourseName") ||
    Object.prototype.hasOwnProperty.call(payload, "from") ||
    !partial
  ) {
    courseData.sourceCourse = sourceCourseId || null;

    if (sourceCourseName.length > 160) {
      return { error: "From course name must be 160 characters or fewer" };
    }

    courseData.sourceCourseName = sourceCourseName;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "location") || !partial) {
    if (location.length > 150) {
      return { error: "Location must be 150 characters or fewer" };
    }

    courseData.location = location;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "sessionDate") || Object.prototype.hasOwnProperty.call(payload, "date") || !partial) {
    courseData.sessionDate = sessionDate;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "timeSlot") || Object.prototype.hasOwnProperty.call(payload, "time") || Object.prototype.hasOwnProperty.call(payload, "sessionTime") || !partial) {
    if (timeSlot.length > 80) {
      return { error: "Time must be 80 characters or fewer" };
    }

    courseData.timeSlot = timeSlot;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "entryRequirements") || !partial) {
    if (entryRequirements.length > 250) {
      return { error: "Entry requirements must be 250 characters or fewer" };
    }

    courseData.entryRequirements = entryRequirements;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "audience") || !partial) {
    if (audience.length > 250) {
      return { error: "Audience must be 250 characters or fewer" };
    }

    courseData.audience = audience;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "duration") || !partial) {
    if (duration.length > 120) {
      return { error: "Duration must be 120 characters or fewer" };
    }

    courseData.duration = duration;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "thumbnailUrl") || !partial) {
    if (thumbnailUrl.length > 500) {
      return { error: "Thumbnail URL must be 500 characters or fewer" };
    }

    courseData.thumbnailUrl = thumbnailUrl;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "galleryImages") || !partial) {
    if (galleryImages.some((image) => image.length > 500)) {
      return { error: "Each gallery image URL must be 500 characters or fewer" };
    }

    courseData.galleryImages = galleryImages;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "bookNowUrl") || !partial) {
    if (bookNowUrl.length > 500) {
      return { error: "Book now URL must be 500 characters or fewer" };
    }

    courseData.bookNowUrl = bookNowUrl;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "currency") || !partial) {
    if (currency.length > 10) {
      return { error: "Currency must be 10 characters or fewer" };
    }

    courseData.currency = currency;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "tags") || !partial) {
    courseData.tags = tags;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "detailSections") || !partial) {
    courseData.detailSections = detailSections;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "isPublished") || !partial) {
    courseData.isPublished = normalizeBoolean(payload.isPublished, true);
  }

  if (Object.prototype.hasOwnProperty.call(payload, "price") || !partial) {
    const price = normalizeNumber(payload.price, 0);
    if (price < 0) {
      return { error: "Price cannot be negative" };
    }

    courseData.price = price;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "totalSeats") || !partial) {
    if (totalSeats < 0 || !Number.isInteger(totalSeats)) {
      return { error: "Total seats must be a non-negative integer" };
    }

    courseData.totalSeats = totalSeats;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "vatIncluded") || !partial) {
    courseData.vatIncluded = normalizeBoolean(payload.vatIncluded, true);
  }

  if (Object.prototype.hasOwnProperty.call(payload, "priceNote") || !partial) {
    const priceNote = normalizeString(payload.priceNote);

    if (priceNote.length > 120) {
      return { error: "Price note must be 120 characters or fewer" };
    }

    courseData.priceNote = priceNote;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "order") || !partial) {
    const order = normalizeNumber(payload.order, 0);
    if (order < 0 || !Number.isInteger(order)) {
      return { error: "Order must be a non-negative integer" };
    }

    courseData.order = order;
  }

  return { value: courseData };
}

function parsePagination(query) {
  const page = Math.max(1, Math.floor(normalizeNumber(query.page, 1)));
  const limit = Math.min(50, Math.max(1, Math.floor(normalizeNumber(query.limit, 12))));

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

function formatDateOnly(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function formatDisplayDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function buildCatalogFilter(query) {
  const filter = {
    isPublished: true,
    status: { $in: ["available", "upcoming"] },
  };

  const search = normalizeString(query.search);
  const status = normalizeString(query.status).toLowerCase();

  if (status) {
    if (!COURSE_STATUSES.includes(status)) {
      return { error: "Status filter must be available, upcoming, or archived" };
    }

    filter.status = status;
  }

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    filter.$or = [
      { title: searchRegex },
      { shortDescription: searchRegex },
      { schedule: searchRegex },
      { tags: searchRegex },
    ];
  }

  return {
    value: {
      filter,
      search,
      status: status || null,
    },
  };
}

function mapCourseSummary(course) {
  const primaryImage = course.thumbnailUrl || course.galleryImages?.[0] || "";

  return {
    id: course._id,
    title: course.title,
    slug: course.slug,
    status: course.status,
    schedule: course.schedule,
    shortDescription: course.shortDescription,
    audience: course.audience,
    duration: course.duration,
    price: course.price,
    currency: course.currency,
    thumbnailUrl: primaryImage,
    tags: course.tags,
    isPublished: course.isPublished,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
}

function mapCourseSource(course) {
  return {
    id: course.sourceCourse || null,
    name: course.sourceCourseName || "",
  };
}

function mapCourseSchedule(course) {
  return {
    label: course.schedule || "",
    date: formatDateOnly(course.sessionDate),
    displayDate: formatDisplayDate(course.sessionDate),
    time: course.timeSlot || "",
    duration: course.duration || "",
  };
}

function mapCourseCapacity(course, bookedSeats = 0) {
  const totalSeats = Number.isFinite(course.totalSeats) ? course.totalSeats : 0;
  const normalizedBookedSeats = Math.max(0, bookedSeats || 0);

  return {
    totalSeats,
    bookedSeats: normalizedBookedSeats,
    remainingSeats: Math.max(0, totalSeats - normalizedBookedSeats),
  };
}

function mapAdminCourseSummary(course, bookedSeats = 0) {
  const summary = mapCourseSummary(course);

  return {
    ...summary,
    source: mapCourseSource(course),
    schedule: mapCourseSchedule(course),
    pricing: {
      amount: course.price,
      currency: course.currency,
      displayPrice: formatDisplayPrice(course.price, course.currency),
    },
    capacity: mapCourseCapacity(course, bookedSeats),
    actions: {
      viewUrl: `/admin/courses/${course._id}`,
      editUrl: `/admin/courses/${course._id}`,
    },
  };
}

function applyUploadedImage(courseData, uploadedImageUrl, existingCourse) {
  if (!uploadedImageUrl) {
    return courseData;
  }

  const nextGalleryImages = Array.isArray(courseData.galleryImages)
    ? courseData.galleryImages
    : Array.isArray(existingCourse?.galleryImages)
      ? existingCourse.galleryImages.filter(Boolean)
      : [];

  if (!nextGalleryImages.includes(uploadedImageUrl)) {
    nextGalleryImages.unshift(uploadedImageUrl);
  }

  courseData.thumbnailUrl = uploadedImageUrl;
  courseData.galleryImages = nextGalleryImages.slice(0, 8);

  return courseData;
}

function formatDisplayPrice(amount, currency) {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency || "GBP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  } catch (error) {
    const normalizedAmount = Number(amount || 0).toFixed(2);
    return `${currency || "GBP"} ${normalizedAmount}`;
  }
}

function buildDefaultSections(course) {
  const sections = [];

  if (course.description) {
    sections.push({
      title: "What you'll learn",
      content: course.description,
    });
  }

  if (course.audience || course.schedule || course.duration) {
    sections.push({
      title: "How you'll learn",
      content: [course.audience, course.schedule, course.duration].filter(Boolean).join(". "),
    });
  }

  if (course.entryRequirements || course.qualification || course.location) {
    sections.push({
      title: "Additional info",
      content: [course.entryRequirements, course.qualification, course.location]
        .filter(Boolean)
        .join(". "),
    });
  }

  return sections;
}

function buildEligibilityCheckOptions() {
  return [
    {
      id: "ewa-city-and-guilds-2346",
      label: "(EWA) City & Guilds 2346",
      nextStepId: "nvq-registration-date",
    },
    {
      id: "eal-603-5982-1",
      label: "EAL 603/5982/1",
      nextStepId: "nvq-registration-date",
    },
    {
      id: "city-and-guilds-2357",
      label: "City & Guilds 2357",
    },
    {
      id: "eal-501-1605-8-electrotechnical",
      label: "EAL 501/1605/8 Electrotechnical",
    },
    {
      id: "eal-501-1604-6-electrotechnical-maintenance",
      label: "EAL 501/1604/6 Electrotechnical Maintenance",
    },
    {
      id: "city-and-guilds-2556-certificate-nvq",
      label: "City & Guilds 2556 Certificate (NVQ)",
    },
    {
      id: "city-and-guilds-2355-03-certificate-nvq",
      label: "City & Guilds 2355-03 Certificate (NVQ)",
    },
    {
      id: "eal-100-4720-7-electrotechnical-services-nvq",
      label: "EAL 100/4720/7 Certificate in Electrotechnical Services (NVQ)",
    },
    {
      id: "city-and-guilds-2356-99-mature-candidate-assessment-route",
      label: "City & Guilds 2356-99 - JIB Mature Candidate Assessment route",
    },
    {
      id: "eal-ets-3-jib-mature-candidate-assessment-route",
      label: "EAL ETS3 -- JIB Mature Candidate Assessment route",
    },
    {
      id: "city-and-guilds-2360-part-1-and-2",
      label: "City & Guilds 2360 Part 1 and 2",
    },
    {
      id: "level-3-or-level-4-diplomas-in-electrotechnical-studies-and-practice",
      label: "Level 3 or Level 4 Diplomas in Electrotechnical Studies and Practice (Military Engineering)",
    },
  ];
}

function buildEligibilityCheckSteps() {
  return [
    {
      id: "qualification-check",
      title: "Eligibility Check",
      question:
        "Have you completed or are you registered for any of the following qualifications?",
      selectionMode: "single",
      confirmLabel: "Continue",
      options: buildEligibilityCheckOptions(),
    },
    {
      id: "nvq-registration-date",
      title: "NVQ Registration Date",
      question: "When did you register for your NVQ?",
      selectionMode: "single",
      confirmLabel: "Continue",
      options: [
        {
          id: "before-3rd-september-2023",
          label: "Before 3rd September 2023",
        },
        {
          id: "after-september-2023",
          label: "After September 2023",
        },
      ],
    },
  ];
}

function buildBookNowModal(course) {
  const courseTitle = normalizeString(course.title);
  const qualification = normalizeString(course.qualification);
  const isAm2Course =
    /\bam2\b/i.test(courseTitle) ||
    /\bam2\b/i.test(qualification) ||
    normalizeString(course.slug) === "am2-assessment-preparation";

  if (!isAm2Course) {
    return null;
  }

  const steps = buildEligibilityCheckSteps();
  const initialStep = steps[0];

  return {
    type: "eligibility_check",
    title: initialStep.title,
    question: initialStep.question,
    selectionMode: initialStep.selectionMode,
    cancelLabel: "Cancel",
    confirmLabel: initialStep.confirmLabel,
    options: initialStep.options,
    initialStepId: initialStep.id,
    steps,
  };
}

function mapCourseDetail(course) {
  const summary = mapCourseSummary(course);
  const sections =
    Array.isArray(course.detailSections) && course.detailSections.length > 0
      ? course.detailSections.map((section) => ({
          title: section.title,
          content: section.content,
        }))
      : buildDefaultSections(course);

  return {
    ...summary,
    overview: course.overview || course.description || course.shortDescription,
    description: course.description,
    qualification: course.qualification,
    location: course.location,
    entryRequirements: course.entryRequirements,
    media: {
      thumbnailUrl: summary.thumbnailUrl,
      galleryImages: normalizeStringArray(course.galleryImages, 8),
    },
    pricing: {
      amount: course.price,
      currency: course.currency,
      displayPrice: formatDisplayPrice(course.price, course.currency),
      vatIncluded: course.vatIncluded,
      note: course.priceNote || (course.vatIncluded ? "inc VAT" : ""),
    },
    cta: {
      label: "Book Now",
      url: course.bookNowUrl || "",
    },
    bookNowModal: buildBookNowModal(course),
    sections,
    order: course.order,
  };
}

function mapCatalogCourseCard(course) {
  const summary = mapCourseSummary(course);

  return {
    ...summary,
    badge: {
      label: course.status === "upcoming" ? "Upcoming" : course.status === "archived" ? "Archived" : "Available",
      tone: course.status,
    },
    image: {
      url: summary.thumbnailUrl,
      alt: summary.title,
    },
    subtitle: summary.schedule || summary.duration || "",
    description: summary.shortDescription,
    actions: {
      primary: {
        label: "View Details",
        apiUrl: `/api/courses/${summary.slug}`,
        url: `/courses/${summary.slug}`,
      },
    },
  };
}

function mapRelatedCourseCard(course) {
  const summary = mapCourseSummary(course);

  return {
    id: summary.id,
    title: summary.title,
    slug: summary.slug,
    badge: {
      label: course.status === "upcoming" ? "Upcoming" : course.status === "archived" ? "Archived" : "Available",
      tone: course.status,
    },
    pricing: {
      amount: course.price,
      currency: course.currency,
      displayPrice: formatDisplayPrice(course.price, course.currency),
    },
    session: {
      date: formatDisplayDate(course.sessionDate),
      time: course.timeSlot || "",
      location: course.location || "",
    },
    description: course.shortDescription,
    image: {
      url: summary.thumbnailUrl,
      alt: summary.title,
    },
    actions: {
      primary: {
        label: "View Details",
        apiUrl: `/api/courses/${summary.slug}`,
        url: `/courses/${summary.slug}`,
      },
    },
  };
}

function mapCourseDetailScreen(course, relatedCourses) {
  const detail = mapCourseDetail(course);

  return {
    breadcrumbs: [
      {
        label: "Dashboard",
        url: "/dashboard",
      },
      {
        label: "Courses",
        url: "/courses",
      },
      {
        label: detail.title,
        url: `/courses/${detail.slug}`,
      },
    ],
    course: detail,
    relatedCourses: relatedCourses.map(mapRelatedCourseCard),
  };
}

function buildRegistrationSteps(activeStepId = "candidate") {
  const orderedSteps = [
    { id: "candidate", label: "Candidate" },
    { id: "assessment", label: "Assessment" },
    { id: "employer", label: "Employer" },
    { id: "training", label: "Training" },
    { id: "privacy", label: "Privacy" },
  ];
  const activeIndex = Math.max(
    0,
    orderedSteps.findIndex((step) => step.id === activeStepId)
  );

  return orderedSteps.map((step, index) => ({
    ...step,
    status: index < activeIndex ? "completed" : index === activeIndex ? "current" : "upcoming",
  }));
}

function buildRegistrationScaffold(course, activeStepId) {
  return {
    courseContext: {
      id: course._id,
      title: course.title,
      slug: course.slug,
      qualification: course.qualification || "",
      location: course.location || "",
      schedule: course.schedule || "",
    },
    steps: buildRegistrationSteps(activeStepId),
  };
}

function buildStepNavigation(course, stepId, options = {}) {
  const { previousStep = null, nextStep = null, nextLabel = "Continue" } = options;

  return {
    previous:
      previousStep
        ? {
            label: "Back to previous step",
            apiUrl:
              previousStep === "candidate"
                ? `/api/courses/${course.slug}/registration-form`
                : `/api/courses/${course.slug}/registration-form/${previousStep}`,
          }
        : null,
    next:
      nextStep
        ? {
            label: nextLabel,
            apiUrl: `/api/courses/${course.slug}/registration-form/${nextStep}`,
          }
        : null,
  };
}

function buildRadioOptions(options) {
  return options.map((option) => ({
    id: option.id,
    label: option.label,
  }));
}

function buildCandidateRegistrationForm(course) {
  return {
    ...buildRegistrationScaffold(course, "candidate"),
    title: "NET Candidate Registration Form",
    description:
      "Once this form is completed please return it to your assessment centre. All fields are mandatory.",
    assistanceText:
      "To view how NET uses candidate data please view our Privacy Policy at www.netservices.org.uk/gdpr.",
    sections: [
      {
        id: "candidate-details",
        title: "Candidate Details",
        description: "Please complete all fields. All fields in this section are mandatory.",
        fields: [
          { id: "title", label: "Title", type: "text", required: true, placeholder: "Enter title" },
          { id: "firstName", label: "First Name", type: "text", required: true, placeholder: "Enter first name" },
          { id: "lastName", label: "Last Name", type: "text", required: true, placeholder: "Enter last name" },
          { id: "dateOfBirth", label: "Date of Birth", type: "date", required: true, placeholder: "mm/dd/yyyy" },
          {
            id: "niNumber",
            label: "NI Number",
            type: "text",
            required: true,
            placeholder: "Enter NI Number",
            helperText: "or PPS/Social Security number for candidates from Channel Islands/ROI",
          },
          { id: "email", label: "Email", type: "email", required: true, placeholder: "Enter email address" },
          {
            id: "mobileNumber",
            label: "Mobile Number",
            type: "tel",
            required: true,
            placeholder: "Enter mobile number",
          },
          { id: "addressLine1", label: "Address 1", type: "text", required: true, placeholder: "Enter address line 1" },
          { id: "addressLine2", label: "Address 2", type: "text", required: true, placeholder: "Enter address line 2" },
          { id: "town", label: "Town", type: "text", required: true, placeholder: "Enter town" },
          { id: "postcode", label: "Postcode", type: "text", required: true, placeholder: "Enter postcode" },
        ],
      },
    ],
    navigation: buildStepNavigation(course, "candidate", {
      nextStep: "assessment",
    }),
    submission: {
      apiUrl: "/api/bookings",
      method: "POST",
      payloadTemplate: {
        courseSlug: course.slug,
        personalDetails: {
          title: "",
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          niNumber: "",
          email: "",
          mobileNumber: "",
          addressLine1: "",
          addressLine2: "",
          town: "",
          postcode: "",
          trainingCenter: course.location || "",
        },
      },
      continueLabel: "Continue",
    },
  };
}

function buildAssessmentRegistrationForm(course) {
  return {
    ...buildRegistrationScaffold(course, "assessment"),
    title: "Assessment & Registration Details",
    description: "Please complete all fields.",
    sections: [
      {
        id: "assessment-details",
        title: "Assessment & Registration Details",
        fields: [
          {
            id: "apprentice",
            label: "Apprentice",
            type: "radio",
            required: true,
            options: buildRadioOptions([
              { id: "yes", label: "Yes" },
              { id: "no", label: "No" },
            ]),
          },
          {
            id: "uln",
            label: "U.L.N.",
            type: "text",
            required: false,
            placeholder: "Enter U.L.N.",
          },
          {
            id: "funding",
            label: "Funding",
            type: "radio",
            required: true,
            options: buildRadioOptions([
              { id: "england-16-18", label: "England 16-18 Apprenticeship funded" },
              { id: "england-19-plus", label: "England 19+ Apprenticeship funded" },
              { id: "other", label: "Other funding Method" },
            ]),
          },
          {
            id: "awardingBody",
            label: "Awarding Body",
            type: "radio",
            required: true,
            options: buildRadioOptions([
              { id: "city-and-guilds", label: "City & Guilds" },
              { id: "eal", label: "EAL" },
              { id: "nja", label: "NJA" },
              { id: "other", label: "Other" },
            ]),
          },
          {
            id: "reasonableAdjustments",
            label: "Does the candidate require any reasonable adjustments?",
            type: "radio",
            required: true,
            helperText:
              "If Yes, the Reasonable Adjustments Request Form must be submitted and evidence provided.",
            options: buildRadioOptions([
              { id: "yes", label: "Yes" },
              { id: "no", label: "No" },
            ]),
          },
          {
            id: "recognitionOfPriorLearning",
            label: "Recognition of Prior Learning",
            type: "radio",
            required: true,
            options: buildRadioOptions([
              { id: "yes", label: "Yes" },
              { id: "no", label: "No" },
            ]),
          },
          {
            id: "assessmentType",
            label: "Type of assessment",
            type: "choice-grid",
            required: true,
            options: buildRadioOptions([
              { id: "am2", label: "AM2" },
              { id: "am2e", label: "AM2E" },
              { id: "awcs-v1-0", label: "AWCS v1.0" },
              { id: "am2ed", label: "AM2ED" },
              { id: "am20", label: "AM2O" },
              { id: "cable-jointing", label: "Cable Jointing" },
              { id: "am2e-v1-1", label: "AM2E v1.1" },
              { id: "am2s-v1-1-2", label: "AM2S v1.1/1.2" },
              { id: "aqdsvn", label: "AQDSNV" },
            ]),
          },
        ],
      },
    ],
    navigation: buildStepNavigation(course, "assessment", {
      previousStep: "candidate",
      nextStep: "employer",
    }),
    submission: {
      apiUrlTemplate: "/api/bookings/{bookingId}/registration/assessment",
      method: "POST",
      payloadTemplate: {
        assessmentDetails: {
          apprentice: "",
          uln: "",
          funding: "",
          awardingBody: "",
          reasonableAdjustments: "",
          recognitionOfPriorLearning: "",
          assessmentType: "",
        },
      },
    },
  };
}

function buildAddressFieldSet(prefixLabel, prefixId, companyPlaceholder, emailPlaceholder, contactPlaceholder) {
  return [
    {
      id: "companyName",
      label: "Company Name",
      type: "text",
      required: true,
      placeholder: companyPlaceholder,
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: emailPlaceholder,
    },
    {
      id: "contactName",
      label: "Contact Name",
      type: "text",
      required: true,
      placeholder: contactPlaceholder,
    },
    {
      id: "contactNumber",
      label: "Contact Number",
      type: "tel",
      required: true,
      placeholder: "Enter contact number",
    },
    {
      id: "address1",
      label: "Address 1",
      type: "text",
      required: true,
      placeholder: "Enter address line 1",
    },
    {
      id: "address2",
      label: "Address 2",
      type: "text",
      required: true,
      placeholder: "Enter address line 2",
    },
    {
      id: "address3",
      label: "Address 3",
      type: "text",
      required: false,
      placeholder: "Enter address line 3",
    },
    {
      id: "address4",
      label: "Address 4",
      type: "text",
      required: false,
      placeholder: "Enter address line 4",
    },
    {
      id: "town",
      label: "Town",
      type: "text",
      required: true,
      placeholder: "Enter town",
    },
    {
      id: "postcode",
      label: "Postcode",
      type: "text",
      required: true,
      placeholder: "Enter postcode",
    },
  ].map((field) => ({
    ...field,
    id: `${prefixId}.${field.id}`,
    group: prefixLabel,
  }));
}

function buildEmployerRegistrationForm(course) {
  return {
    ...buildRegistrationScaffold(course, "employer"),
    title: "Current Employer",
    description: "Please complete all fields.",
    sections: [
      {
        id: "employer-details",
        title: "Current Employer",
        fields: buildAddressFieldSet(
          "Employer",
          "employer",
          "Enter employer company name",
          "Enter employer email address",
          "Enter employer contact name"
        ),
      },
    ],
    navigation: buildStepNavigation(course, "employer", {
      previousStep: "assessment",
      nextStep: "training",
    }),
    submission: {
      apiUrlTemplate: "/api/bookings/{bookingId}/registration/employer",
      method: "POST",
      payloadTemplate: {
        employerDetails: {
          companyName: "",
          email: "",
          contactName: "",
          contactNumber: "",
          address1: "",
          address2: "",
          address3: "",
          address4: "",
          town: "",
          postcode: "",
        },
      },
    },
  };
}

function buildTrainingRegistrationForm(course) {
  return {
    ...buildRegistrationScaffold(course, "training"),
    title: "Training Provider / Certificate Issuer",
    description:
      "Please enter the details of the training provider or college where you gained the qualifications to enable you to apply for this assessment. This section is mandatory.",
    sections: [
      {
        id: "training-provider-details",
        title: "Training Provider / Certificate Issuer",
        fields: buildAddressFieldSet(
          "Training Provider",
          "trainingProvider",
          "Enter training provider or college name",
          "Enter provider email",
          "Enter contact name"
        ),
      },
    ],
    navigation: buildStepNavigation(course, "training", {
      previousStep: "employer",
      nextStep: "privacy",
    }),
    submission: {
      apiUrlTemplate: "/api/bookings/{bookingId}/registration/training",
      method: "POST",
      payloadTemplate: {
        trainingProviderDetails: {
          companyName: "",
          email: "",
          contactName: "",
          contactNumber: "",
          address1: "",
          address2: "",
          address3: "",
          address4: "",
          town: "",
          postcode: "",
        },
      },
    },
  };
}

function buildPrivacyRegistrationForm(course) {
  return {
    ...buildRegistrationScaffold(course, "privacy"),
    title: "Privacy Notice & Confirmation",
    description:
      "NET and the Assessment Centre you attend are both Data Controllers for the purposes of Data Protection Law. Where applicable they will jointly uphold your rights.",
    sections: [
      {
        id: "privacy-confirmation",
        title: "Privacy Notice & Confirmation",
        content: [
          "Information that you include in this form is necessary for the completion of your assessment and will only be shared between the Controllers for this purpose or their professional or legal obligations.",
          "In accordance with our terms and conditions, all units of the assessment must be completed within 24 months of commencement.",
          "We are required to retain a photograph of you to enable the verification of your identity. Specifically, photographs are retained for either 6 months after you pass the assessment, or 6 months after the 24 months period has expired.",
          "Other data is kept in accordance with our data retention policy. For full details of NET's policy on Data Protection please visit www.netservices.org.uk or the website of your assigned Assessment Centre.",
        ],
        fields: [
          {
            id: "privacyConfirmation",
            label: "I confirm that the information provided in this registration form is complete and accurate.",
            type: "checkbox",
            required: true,
          },
        ],
      },
    ],
    navigation: buildStepNavigation(course, "privacy", {
      previousStep: "training",
      nextStep: "submit",
      nextLabel: "Continue",
    }),
    submission: {
      apiUrlTemplate: "/api/bookings/{bookingId}/registration/privacy",
      method: "POST",
      payloadTemplate: {
        privacyConfirmation: true,
      },
    },
  };
}

function mapAdminCourseDetail(course, bookedSeats = 0) {
  const detail = mapCourseDetail(course);

  return {
    ...detail,
    source: mapCourseSource(course),
    schedule: mapCourseSchedule(course),
    pricing: {
      ...detail.pricing,
      displayPrice: formatDisplayPrice(course.price, course.currency),
    },
    capacity: mapCourseCapacity(course, bookedSeats),
    adminMeta: {
      sourceCourseId: course.sourceCourse || null,
      sourceCourseName: course.sourceCourseName || "",
      sessionDate: formatDateOnly(course.sessionDate),
      timeSlot: course.timeSlot || "",
      totalSeats: Number.isFinite(course.totalSeats) ? course.totalSeats : 0,
    },
  };
}

async function buildBookedSeatsMap(courseIds) {
  const normalizedCourseIds = courseIds.filter(Boolean);

  if (normalizedCourseIds.length === 0) {
    return new Map();
  }

  const bookedSeats = await Booking.aggregate([
    {
      $match: {
        course: {
          $in: normalizedCourseIds,
        },
        status: "confirmed",
        "payment.status": "paid",
      },
    },
    {
      $group: {
        _id: "$course",
        bookedSeats: {
          $sum: 1,
        },
      },
    },
  ]);

  return new Map(bookedSeats.map((item) => [String(item._id), item.bookedSeats]));
}

async function hydrateSourceCourseData(courseData, options = {}) {
  const { excludeId = null } = options;
  const hasSourceField =
    Object.prototype.hasOwnProperty.call(courseData, "sourceCourse") ||
    Object.prototype.hasOwnProperty.call(courseData, "sourceCourseName");

  if (!hasSourceField) {
    return { value: courseData };
  }

  const sourceCourseId = courseData.sourceCourse ? String(courseData.sourceCourse) : "";

  if (!sourceCourseId) {
    courseData.sourceCourse = null;
    return { value: courseData };
  }

  if (excludeId && String(excludeId) === sourceCourseId) {
    return {
      error: "A course cannot reference itself as the source course",
      status: 400,
    };
  }

  const sourceCourse = await Course.findById(sourceCourseId).select("title");

  if (!sourceCourse) {
    return {
      error: "Source course not found",
      status: 404,
    };
  }

  courseData.sourceCourse = sourceCourse._id;
  courseData.sourceCourseName = sourceCourse.title;

  return { value: courseData };
}

async function listCourseSourceOptions(req, res, next) {
  try {
    const search = normalizeString(req.query.search);
    const filter = {};

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");
      filter.title = searchRegex;
    }

    const courses = await Course.find(filter)
      .sort({ title: 1 })
      .limit(100)
      .select("title slug status");

    return res.status(200).json({
      success: true,
      message: "Course source options fetched successfully",
      data: {
        options: courses.map((course) => ({
          id: course._id,
          title: course.title,
          slug: course.slug,
          status: course.status,
        })),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function findRelatedCourses(course, limit = 3) {
  const baseFilter = {
    _id: { $ne: course._id },
    isPublished: true,
    status: { $in: ["available", "upcoming"] },
  };

  const preferredCourses = course.tags?.length
    ? await Course.find({
        ...baseFilter,
        tags: { $in: course.tags },
      })
        .sort({ order: 1, createdAt: -1 })
        .limit(limit)
    : [];

  if (preferredCourses.length >= limit) {
    return preferredCourses;
  }

  const excludedIds = preferredCourses.map((item) => item._id);

  const fallbackCourses = await Course.find({
    ...baseFilter,
    _id: {
      $nin: [course._id, ...excludedIds],
    },
  })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit - preferredCourses.length);

  return [...preferredCourses, ...fallbackCourses];
}

async function listCourses(req, res, next) {
  try {
    const filterResult = buildCatalogFilter(req.query || {});
    if (filterResult.error) {
      return res.status(400).json({
        success: false,
        message: filterResult.error,
      });
    }

    const { filter, search, status } = filterResult.value;
    const { page, limit, skip } = parsePagination(req.query || {});

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Course.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: {
        courses: courses.map(mapCourseSummary),
        filters: {
          search,
          status,
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

async function getCourseDetails(req, res, next) {
  try {
    const slug = normalizeString(req.params.slug).toLowerCase();
    const course = await Course.findOne({
      slug,
      isPublished: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const relatedCourses = await findRelatedCourses(course, 3);

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: {
        course: mapCourseDetail(course),
        relatedCourses: relatedCourses.map(mapCourseSummary),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getCourseCatalogScreen(req, res, next) {
  try {
    const filterResult = buildCatalogFilter(req.query || {});
    if (filterResult.error) {
      return res.status(400).json({
        success: false,
        message: filterResult.error,
      });
    }

    const { filter, search, status } = filterResult.value;
    const { page, limit, skip } = parsePagination(req.query || {});

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Course.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Course catalog screen data fetched successfully",
      data: {
        screen: {
          title: "Course Catalog",
          subtitle: "Browse and book training courses",
          filters: {
            search,
            status,
          },
          cards: courses.map(mapCatalogCourseCard),
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / limit)),
          },
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getCourseDetailScreen(req, res, next) {
  try {
    const slug = normalizeString(req.params.slug).toLowerCase();
    const course = await Course.findOne({
      slug,
      isPublished: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const relatedCourses = await findRelatedCourses(course, 3);

    return res.status(200).json({
      success: true,
      message: "Course detail screen data fetched successfully",
      data: {
        screen: mapCourseDetailScreen(course, relatedCourses),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getCourseBookNowModal(req, res, next) {
  try {
    const slug = normalizeString(req.params.slug).toLowerCase();
    const course = await Course.findOne({
      slug,
      isPublished: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const modal = buildBookNowModal(course);

    return res.status(200).json({
      success: true,
      message: "Book now modal data fetched successfully",
      data: {
        course: {
          id: course._id,
          title: course.title,
          slug: course.slug,
        },
        modal,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getCourseRegistrationForm(req, res, next) {
  try {
    const slug = normalizeString(req.params.slug).toLowerCase();
    const course = await Course.findOne({
      slug,
      isPublished: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course registration form fetched successfully",
      data: {
        screen: buildCandidateRegistrationForm(course),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getCourseAssessmentRegistrationForm(req, res, next) {
  try {
    const slug = normalizeString(req.params.slug).toLowerCase();
    const course = await Course.findOne({ slug, isPublished: true });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course assessment registration form fetched successfully",
      data: {
        screen: buildAssessmentRegistrationForm(course),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getCourseEmployerRegistrationForm(req, res, next) {
  try {
    const slug = normalizeString(req.params.slug).toLowerCase();
    const course = await Course.findOne({ slug, isPublished: true });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course employer registration form fetched successfully",
      data: {
        screen: buildEmployerRegistrationForm(course),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getCourseTrainingRegistrationForm(req, res, next) {
  try {
    const slug = normalizeString(req.params.slug).toLowerCase();
    const course = await Course.findOne({ slug, isPublished: true });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course training registration form fetched successfully",
      data: {
        screen: buildTrainingRegistrationForm(course),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getCoursePrivacyRegistrationForm(req, res, next) {
  try {
    const slug = normalizeString(req.params.slug).toLowerCase();
    const course = await Course.findOne({ slug, isPublished: true });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course privacy registration form fetched successfully",
      data: {
        screen: buildPrivacyRegistrationForm(course),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function listAdminCourses(req, res, next) {
  try {
    const search = normalizeString(req.query.search);
    const status = normalizeString(req.query.status).toLowerCase();
    const { page, limit, skip } = parsePagination(req.query || {});

    const filter = {};

    if (status) {
      if (!COURSE_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status filter must be available, upcoming, or archived",
        });
      }

      filter.status = status;
    }

    if (Object.prototype.hasOwnProperty.call(req.query, "isPublished")) {
      filter.isPublished = normalizeBoolean(req.query.isPublished, true);
    }

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");
      filter.$or = [
        { title: searchRegex },
        { sourceCourseName: searchRegex },
        { shortDescription: searchRegex },
        { schedule: searchRegex },
        { location: searchRegex },
        { tags: searchRegex },
      ];
    }

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Course.countDocuments(filter),
    ]);

    const bookedSeatsMap = await buildBookedSeatsMap(courses.map((course) => course._id));

    return res.status(200).json({
      success: true,
      message: "Admin courses fetched successfully",
      data: {
        courses: courses.map((course) => mapAdminCourseSummary(course, bookedSeatsMap.get(String(course._id)) || 0)),
        filters: {
          search,
          status: status || null,
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

async function createCourse(req, res, next) {
  try {
    const payloadResult = buildCoursePayload(req.body || {});
    if (payloadResult.error) {
      return res.status(400).json({
        success: false,
        message: payloadResult.error,
      });
    }

    const courseData = payloadResult.value;
    applyUploadedImage(courseData, req.uploadedImageUrl);
    const hydratedSourceCourseResult = await hydrateSourceCourseData(courseData);
    if (hydratedSourceCourseResult.error) {
      return res.status(hydratedSourceCourseResult.status || 400).json({
        success: false,
        message: hydratedSourceCourseResult.error,
      });
    }

    courseData.slug = await ensureUniqueSlug(courseData.slug);

    const course = await Course.create(courseData);

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: {
        course: mapAdminCourseDetail(course, 0),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getAdminCourseById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course id",
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const bookedSeatsMap = await buildBookedSeatsMap([course._id]);

    return res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: {
        course: mapAdminCourseDetail(course, bookedSeatsMap.get(String(course._id)) || 0),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function updateCourse(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course id",
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const payloadResult = buildCoursePayload(req.body || {}, { partial: true });
    if (payloadResult.error) {
      return res.status(400).json({
        success: false,
        message: payloadResult.error,
      });
    }

    const updates = payloadResult.value;
    applyUploadedImage(updates, req.uploadedImageUrl, course);
    const hydratedSourceCourseResult = await hydrateSourceCourseData(updates, { excludeId: course._id });
    if (hydratedSourceCourseResult.error) {
      return res.status(hydratedSourceCourseResult.status || 400).json({
        success: false,
        message: hydratedSourceCourseResult.error,
      });
    }

    if (updates.slug) {
      updates.slug = await ensureUniqueSlug(updates.slug, course._id);
    }

    Object.assign(course, updates);

    if (
      Object.prototype.hasOwnProperty.call(updates, "schedule") ||
      Object.prototype.hasOwnProperty.call(updates, "sessionDate") ||
      Object.prototype.hasOwnProperty.call(updates, "timeSlot") ||
      Object.prototype.hasOwnProperty.call(updates, "duration")
    ) {
      course.schedule =
        normalizeString(updates.schedule) ||
        composeScheduleLabel(course.sessionDate, course.timeSlot, course.duration) ||
        course.schedule;
    }

    await course.save();

    const bookedSeatsMap = await buildBookedSeatsMap([course._id]);

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: {
        course: mapAdminCourseDetail(course, bookedSeatsMap.get(String(course._id)) || 0),
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listCourses,
  getCourseDetails,
  getCourseCatalogScreen,
  getCourseDetailScreen,
  getCourseBookNowModal,
  getCourseRegistrationForm,
  getCourseAssessmentRegistrationForm,
  getCourseEmployerRegistrationForm,
  getCourseTrainingRegistrationForm,
  getCoursePrivacyRegistrationForm,
  listAdminCourses,
  listCourseSourceOptions,
  createCourse,
  getAdminCourseById,
  updateCourse,
};
