import type { ComponentType, SVGProps } from "react";
import type { LucideIcon } from "lucide-react";

export type SidebarIcon = ComponentType<SVGProps<SVGSVGElement>>;
export type DashboardIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type SidebarItem = {
  label: string;
  href: string;
  icon: SidebarIcon;
  group: "Menu" | "Help";
};

export type QuickAction = {
  title: string;
  description: string;
  date: string;
  color: string;
};

export type ActivityEntry = {
  title: string;
  subtitle: string;
  time: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
};

export type DashboardShortcut = {
  title: string;
  subtitle: string;
  action: string;
  accent: string;
  icon: LucideIcon;
};

export type DashboardStat = {
  value: string;
  label: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
};

export type CandidateStat = {
  value: string;
  label: string;
  icon: DashboardIcon;
  iconColor: string;
  iconBg: string;
};

export type CandidateRow = {
  id: string;
  initial: string;
  initialBg: string;
  name: string;
  candidateId: string;
  course: string;
  progress: number;
  submittedDate: string;
  submittedTime: string;
};

export type CandidateVerificationItem = {
  label: string;
  status: string;
};

export type DashboardTone = "success" | "warning" | "danger" | "info";

export type DashboardStatus = {
  key: string;
  label: string;
  tone: DashboardTone;
};

export type CandidateDocument = {
  id: string;
  title: string;
  description: string;
};

export type CandidateChecklistRow = {
  id: string;
  name: string;
  knowledge: string;
  experience: string;
};

export type CandidateChecklistSection = {
  id: string;
  title: string;
  status: string;
  items: CandidateChecklistRow[];
};

export type CandidateDetail = {
  id: string;
  candidateId: string;
  avatarLetter: string;
  avatarBg: string;
  name: string;
  submittedOn: string;
  reviewStatus: string;
  email: string;
  phone: string;
  niNumber: string;
  verifications: CandidateVerificationItem[];
  documents: CandidateDocument[];
  checklistSections: CandidateChecklistSection[];
};

export type AdminCandidateDetailBreadcrumb = {
  label: string;
  url: string;
};

export type AdminCandidateDetailVerificationItem = {
  id: string;
  label: string;
  status: DashboardStatus;
  supportingText: string;
  action: {
    label: string;
    type: string;
    url: string;
  } | null;
};

export type AdminCandidateDetailDocument = {
  id: string;
  name: string;
  description: string;
  category: string;
  isDerived: boolean;
  available: boolean;
  previewUrl: string | null;
  downloadUrl: string | null;
};

export type AdminCandidateDetailChecklistRow = {
  id: string;
  no: number;
  criterion: string;
  knowledge: DashboardStatus;
  experience: DashboardStatus;
};

export type AdminCandidateDetailChecklistSection = {
  id: string;
  title: string;
  status: DashboardStatus;
  rows: AdminCandidateDetailChecklistRow[];
  summary: {
    totalItems: number;
    approvedItems: number;
    pendingItems: number;
    rejectedItems: number;
  };
};

export type AdminCandidateDetail = {
  id: string;
  bookingId: string;
  bookingNumber: string;
  submittedAt: string;
  submittedAtLabel: string;
  submittedRelative: string;
  reviewStatus: DashboardStatus;
  breadcrumbs: AdminCandidateDetailBreadcrumb[];
  candidate: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    initial: string;
    avatarTone: string;
    candidateNumber: string;
    nationalInsuranceNumber: string | null;
    submittedAtLabel: string;
    address: string;
    city: string;
    postcode: string;
    trainingCenter: string;
  };
  course: {
    id: string;
    title: string;
    slug: string;
    qualification: string;
    schedule: string;
    duration: string;
    location: string;
    progress: {
      percentage: number;
      label: string;
      tone: DashboardTone;
    };
  };
  verification: {
    title: string;
    items: AdminCandidateDetailVerificationItem[];
  };
  uploadedDocuments: {
    title: string;
    isDerived: boolean;
    items: AdminCandidateDetailDocument[];
    downloadAll: {
      label: string;
      available: boolean;
      url: string | null;
      reason: string | null;
    };
    emptyState: string | null;
  };
  checklistSummary: {
    title: string;
    isDerived: boolean;
    status: DashboardStatus;
    sections: AdminCandidateDetailChecklistSection[];
    summary: {
      totalSections: number;
      totalItems: number;
      approvedItems: number;
      pendingItems: number;
      rejectedItems: number;
    };
    download: {
      label: string;
      available: boolean;
      url: string | null;
      reason: string | null;
    };
  };
  reviewDecision: {
    title: string;
    currentStatus: DashboardStatus;
    actions: {
      approve: {
        label: string;
        tone: DashboardTone;
        method: string;
        url: string;
        payload: Record<string, string>;
        enabled: boolean;
      };
      reject: {
        label: string;
        tone: DashboardTone;
        method: string;
        url: string;
        payload: Record<string, string>;
        enabled: boolean;
      };
    };
  };
  adminNotes: string | null;
  relatedLinks: {
    booking: string;
    updateBooking: string;
  };
};

export type AdminCandidateDetailResponse = {
  candidate: AdminCandidateDetail;
};

export type CourseManagementRow = {
  id: string;
  name: string;
  price: string;
  date: string;
  duration: string;
  location: string;
};

export type AdminCourse = {
  id: string;
  title: string;
  slug: string;
  status: string;
  schedule: {
    label: string;
    date: string;
    displayDate: string;
    time: string;
    duration: string;
  };
  shortDescription: string;
  audience: string;
  duration: string;
  price: number;
  currency: string;
  thumbnailUrl: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  pricing: {
    amount: number;
    currency: string;
    displayPrice: string;
    vatIncluded?: boolean;
    note?: string;
  };
  capacity: {
    totalSeats: number;
    bookedSeats: number;
    remainingSeats: number;
  };
  actions: {
    viewUrl: string;
    editUrl: string;
  };
  overview?: string;
  description?: string;
  qualification?: string;
  location?: string;
  entryRequirements?: string;
  media?: {
    thumbnailUrl: string;
    galleryImages: string[];
  };
  cta?: {
    label: string;
    url: string;
  };
  sections?: Array<{
    title: string;
    content: string;
  }>;
  order?: number;
  adminMeta?: {
    sourceCourseId: string | null;
    sourceCourseName: string;
    sessionDate: string;
    timeSlot: string;
    totalSeats: number;
  };
};

export type AdminCoursesResponse = {
  courses: AdminCourse[];
  filters: {
    search: string;
    status: string | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminCourseDetailResponse = {
  course: AdminCourse;
};

export type CreateAdminCourseRequest = {
  title: string;
  shortDescription: string;
  description: string;
  duration: string;
  location: string;
  price: number;
  totalSeats: number;
  sourceCourseId?: string | null;
  sessionDate?: string;
  timeSlot?: string;
};

export type UpdateAdminCourseRequest = Partial<CreateAdminCourseRequest>;

export type CourseSourceOption = {
  id: string;
  title: string;
  slug: string;
  status: string;
};

export type CourseSourceOptionsResponse = {
  options: CourseSourceOption[];
};

export type SubmissionStatus = "Online" | "Pending" | "Approved" | "Rejected";

export type SubmissionEntry = {
  initial: string;
  initialBg: string;
  candidate: string;
  submittedDate: string;
  submittedTime: string;
  status: SubmissionStatus;
};

export type AdminSubmission = {
  id: string;
  bookingId: string;
  bookingNumber: string;
  candidate: {
    name: string;
    email: string;
    initial: string;
    avatarTone: string;
  };
  course: {
    id: string;
    title: string;
    slug: string;
  };
  submittedAt: string;
  submittedAtLabel: string;
  submittedRelative: string;
  status: DashboardStatus;
  action: {
    label: string;
    type: string;
    url: string;
  };
};

export type AdminSubmissionsResponse = {
  submissions: AdminSubmission[];
  filters: {
    search: string;
    status: string | null;
    courseId: string | null;
    courseSlug: string | null;
  };
  filterOptions: {
    placeholders: {
      status: string;
      from: string;
    };
    statuses: Array<{
      value: string | null;
      label: string;
      count: number;
    }>;
    fromCourses: Array<{
      value: string | null;
      label: string;
      slug: string | null;
    }>;
  };
  summary: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type SubmissionTone = DashboardTone;

export type AdminCandidate = {
  id: string;
  candidate: {
    id: string;
    candidateNumber: string;
    name: string;
    email: string;
    initial: string;
    avatarTone: string;
  };
  enrolledCourse: {
    id: string;
    title: string;
    slug: string;
  };
  progress: {
    percentage: number;
    label: string;
    tone: SubmissionTone;
  };
  submittedAt: string;
  submittedAtLabel: string;
  isStuck: boolean;
  bookingStatus: {
    key: string;
    label: string;
    tone: SubmissionTone;
  };
  actions: {
    message: {
      label: string;
      type: string;
      value: string;
      url: string;
    };
    view: {
      label: string;
      type: string;
      url: string;
      apiUrl: string;
    };
  };
};

export type AdminCandidatesResponse = {
  candidates: AdminCandidate[];
  filters: {
    search: string;
    courseId: string | null;
    courseSlug: string | null;
    stuckOnly: boolean;
    sortBy: string;
    sortOrder: string;
  };
  summary: {
    totalCandidates: number;
    stuckCandidates: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminBooking = {
  id: string;
  bookingNumber: string;
  checklistVariant?: string;
  assessmentVariant?: string;
  status: string;
  applicationStatus?: "under_review" | "approved" | string;
  paymentStatus: string;
  tab: string;
  statusBadge: {
    label: string;
    tone: DashboardTone;
  };
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
  session: {
    startDateTime: string;
    endDateTime: string;
    displayDate: string;
    displayTime: string;
    displayDateTime: string;
    location: string;
  };
  course: {
    id: string;
    title: string;
    slug: string;
    schedule: string;
    duration: string;
    location: string;
    qualification: string;
    assessmentVariant?: string;
    thumbnailUrl: string;
    price: number;
    currency: string;
    displayPrice: string;
    detailsUrl: string;
  };
  actions: {
    detailsLabel: string;
    detailsUrl: string;
    view: {
      label: string;
      type: string;
      url: string;
      apiUrl: string;
    };
    candidate: {
      label: string;
      type: string;
      url: string;
      apiUrl: string;
    };
  };
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export type BookingChecklistVariantMetadata = {
  checklistVariant: string;
  assessmentVariant: string;
  templateId: string;
  title: string;
  description: string;
  resolvedFrom: {
    source: string;
    selectedQuestionId: string;
    selectedAnswerId: string;
    selectedAnswerLabel: string;
  };
  pdfExport: {
    checklistVariant: string;
    assessmentVariant: string;
    templateId: string;
    title: string;
    hasSavedResponses: boolean;
    bookingChecklistUrl: string;
    courseFlowUrl: string;
  };
};

export type BookingChecklistFlowResponse = {
  course: Record<string, any>;
  flow: Record<string, any>;
  checklistVariant: string;
  assessmentVariant: string;
  resolvedFrom?: Record<string, any>;
  pdfExport?: Record<string, any>;
  availableVariants?: Array<Record<string, any>>;
  coverage?: Record<string, any>;
  eligibilityRouting?: Record<string, any>;
};

export type AdminBookingsResponse = {
  bookings: AdminBooking[];
  tabs: {
    active: string;
    counts: {
      upcoming: number;
      past: number;
      cancelled: number;
    };
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminBookingDetail = AdminBooking & {
  personalDetails: {
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    trainingCenter: string;
    city: string;
    postcode: string;
  };
  payment: {
    status: string;
    amount: number;
    currency: string;
    displayAmount: string;
    agreedToTerms: boolean;
    method: string;
    transactionId: string;
    cardBrand: string;
    cardLast4: string;
    paidAt: string | null;
    failureReason: string;
  };
  progress: {
    details: string;
    payment: string;
    confirmation: string;
  };
  notes: string | null;
  breadcrumbs: Array<{
    label: string;
    url: string;
  }>;
  profile: {
    title: string;
    initial: string;
    avatarTone: string;
    name: string;
    bookingNumber: string;
    candidateNumber: string;
    submittedAt: string;
    submittedAtLabel: string;
    submittedRelative: string;
    lifecycleStatus: DashboardStatus;
    email: string;
    phoneNumber: string;
    nationalInsuranceNumber: string | null;
    address: string;
    city: string;
    postcode: string;
    trainingCenter: string;
  };
  verification: {
    title: string;
    items: Array<{
      id: string;
      label: string;
      status: DashboardStatus;
      supportingText: string;
      action: {
        label: string;
        type: string;
        url: string;
        apiUrl: string;
      } | null;
    }>;
  };
  uploadedDocuments: {
    title: string;
    isDerived: boolean;
    items: Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      available: boolean;
      previewUrl: string | null;
      downloadUrl: string | null;
    }>;
    downloadAll: {
      label: string;
      available: boolean;
      url: string | null;
      reason: string | null;
    };
  };
  reviewDecision: {
    title: string;
    currentStatus: DashboardStatus;
    actions: {
      approveReview?: {
        label: string;
        tone: DashboardTone;
        method: string;
        enabled: boolean;
        url: string;
        payload?: Record<string, string>;
      };
      markUnderReview?: {
        label: string;
        tone: DashboardTone;
        method: string;
        enabled: boolean;
        url: string;
        payload?: Record<string, string>;
      };
      sendReminder: {
        label: string;
        tone: "secondary" | DashboardTone;
        type: string;
        enabled: boolean;
        url: string;
      };
      rejectCandidate: {
        label: string;
        tone: DashboardTone;
        method: string;
        enabled: boolean;
        url: string;
        payload: Record<string, string>;
      };
    };
  };
  checklistSummary: {
    title: string;
    isDerived: boolean;
    sections: Array<{
      id: string;
      title: string;
      status: DashboardStatus;
      rows: Array<{
        id: string;
        no: number;
        criterion: string;
        knowledge: DashboardStatus;
        experience: DashboardStatus;
      }>;
      summary: {
        totalItems: number;
        completedItems: number;
        pendingItems: number;
      };
    }>;
    summary: {
      totalSections: number;
      totalItems: number;
      completedItems: number;
      pendingItems: number;
    };
    download: {
      label: string;
      available: boolean;
      url: string | null;
      reason: string | null;
    };
  };
  checklistResponses?: Array<{
    itemId: string;
    knowledgeLevel: string;
    experienceLevel: string;
    knowledge: ChecklistBooleanMap;
    experience: ChecklistBooleanMap;
  }>;
  checklistVariantMetadata?: BookingChecklistVariantMetadata;
  checklistFlow?: BookingChecklistFlowResponse;
  pdfExport?: BookingChecklistVariantMetadata["pdfExport"];
};

export type AdminBookingDetailResponse = {
  booking: AdminBookingDetail;
};

export type ChecklistBooleanMap = {
  extensive: boolean;
  adequate: boolean;
  limited: boolean;
  unsure: boolean;
};

export type UpdateAdminBookingRequest = {
  applicationStatus: "under_review" | "approved";
};

export type SaveRegistrationEligibilityRequest = {
  qualificationId: string;
  qualificationLabel: string;
  nvqRegistrationDate: string;
};

export type SaveRegistrationAssessmentRequest = {
  assessmentDetails: {
    apprentice: string;
    uln: string;
    funding: string;
    awardingBody: string;
    reasonableAdjustments: string;
    recognitionOfPriorLearning: string;
    assessmentType: string;
  };
};

export type SaveRegistrationEmployerRequest = {
  employerDetails: {
    companyName: string;
    email: string;
    contactName: string;
    contactNumber: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    town: string;
    postcode: string;
  };
};

export type SaveRegistrationTrainingRequest = {
  trainingProviderDetails: {
    companyName: string;
    email: string;
    contactName: string;
    contactNumber: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    town: string;
    postcode: string;
  };
};

export type SaveRegistrationPrivacyRequest = {
  privacyConfirmation: boolean;
};

export type MockRegistrationDataResponse = {
  mockRegistration: {
    course: Record<string, any>;
    personalDetails: Record<string, any>;
    assessmentDetails: Record<string, any>;
    employerDetails: Record<string, any>;
    trainingProviderDetails: Record<string, any>;
    privacyConfirmation: boolean;
  };
  pdfCoverage: {
    coveredFields: string[];
    likelyMissingFields: Array<{
      field: string;
      status: string;
      note: string;
    }>;
    notes: string[];
  };
};

export type Am2ChecklistFlowResponse = {
  course: Record<string, any>;
  flow: Record<string, any>;
  coverage: Record<string, any>;
};

export type Am2eChecklistFlowResponse = {
  course: Record<string, any>;
  checklistVariant: string;
  eligibilityRouting: Record<string, any>;
  flow: Record<string, any>;
  coverage: Record<string, any>;
};

export type Am2eV1ChecklistFlowResponse = {
  course: Record<string, any>;
  checklistVariant: string;
  eligibilityRouting: Record<string, any>;
  flow: Record<string, any>;
  coverage: Record<string, any>;
};

export type BookingDocumentsFlowResponse = {
  screen: Record<string, any>;
};

export type DashboardActionLink = {
  label: string;
  badge?: string;
};

export type BookingSubmissionRow = {
  id: string;
  candidateId: string;
  initial: string;
  initialBg: string;
  candidate: string;
  enrolledCourse: string;
  submittedDate: string;
  submittedTime: string;
  status: SubmissionStatus;
};

export type BookingDetail = {
  id: string;
  avatarLetter: string;
  avatarBg: string;
  name: string;
  submittedOn: string;
  bookingStatus: string;
  email: string;
  phone: string;
  niNumber: string;
  verifications: CandidateVerificationItem[];
  documents: CandidateDocument[];
  checklistSections: CandidateChecklistSection[];
};
