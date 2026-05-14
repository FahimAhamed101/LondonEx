"use client";

import { useState, useMemo, type ReactNode } from "react";
import {
  Building2,
  Download,
  Eye,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";

import { 
  useUpdateAdminBookingMutation, 
  useGetMockRegistrationDataQuery,
} from "@/features/dashboard/dashboard.api";

import type { AdminBookingDetail, DashboardTone } from "@/types/dashboard";
import NetRegistrationFormTemplate from "@/components/pdf/NetRegistrationFormTemplate";
import { getNetRegistrationFormData } from "@/components/pdf/netRegistrationFormData";
import ChecklistPdfTemplate from "@/components/pdf/ChecklistPdfTemplate";
import { getChecklistTemplateData } from "@/components/pdf/mockChecklistData";
import "@/components/pdf/checklist-pdf.css";


type BookingDetailsViewProps = {
  booking: AdminBookingDetail;
};

type PreviewState =
  | {
      title: string;
      subtitle: string;
      content: string;
    }
  | null;

type ChecklistAnswerValue =
  | string
  | {
      id?: string;
      label?: string;
      extensive?: boolean;
      adequate?: boolean;
      limited?: boolean;
      unsure?: boolean;
    }
  | null
  | undefined;

type ChecklistFlowItem = {
  id: string;
  no?: number | string;
  number?: number | string;
  criterion?: string;
  text?: string;
  knowledge?: ChecklistAnswerValue;
  experience?: ChecklistAnswerValue;
};

type ChecklistFlowSection = {
  id: string;
  title: string;
  label?: string;
  duration?: string;
  summary?: string;
  subtitle?: string;
  description?: string;
  items: ChecklistFlowItem[];
};

type ChecklistFlowData = {
  checklistSummary?: {
    title?: string;
  };
  checklistSections?: ChecklistFlowSection[];
  sections?: ChecklistFlowSection[];
  candidate?: {
    uln?: string;
  };
};

type ChecklistPreviewConfig = {
  templateId: string;
  label: string;
  title: string;
  buttonClassName: string;
};

const checklistPreviewConfigs: Record<string, ChecklistPreviewConfig> = {
  am2: {
    templateId: "am2-checklist",
    label: "Preview AM2",
    title: "AM2 Checklist Preview",
    buttonClassName:
      "bg-[linear-gradient(90deg,#48cfff_0%,#0ba8dd_100%)] text-white shadow-[0_12px_24px_rgba(11,168,221,0.24)]",
  },
  am2e: {
    templateId: "net-am2e-full-candidate-checklist",
    label: "Preview AM2E",
    title: "AM2E Checklist Preview",
    buttonClassName:
      "bg-[linear-gradient(90deg,#65b7ff_0%,#1b76d1_100%)] text-white shadow-[0_12px_24px_rgba(27,118,209,0.24)]",
  },
  "am2e-v1": {
    templateId: "am2e-v1-checklist",
    label: "Preview AM2E V1",
    title: "AM2E V1 Checklist Preview",
    buttonClassName:
      "bg-[linear-gradient(90deg,#8b5cf6_0%,#6d28d9_100%)] text-white shadow-[0_12px_24px_rgba(109,40,217,0.24)]",
  },
};

function getChecklistPreviewConfig(variant?: string): ChecklistPreviewConfig {
  return checklistPreviewConfigs[variant || ""] || checklistPreviewConfigs.am2;
}

const avatarToneClasses: Record<string, string> = {
  indigo: "bg-[#4f46e5]",
  orange: "bg-[#f59e0b]",
  cyan: "bg-[#06b6d4]",
  teal: "bg-[#14b8a6]",
  purple: "bg-[#8b5cf6]",
};

function escapePdfText(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function createPdfContent(title: string, body: string) {
  const lines = [title, "", ...body.split("\n")];
  const pageWidth = 595;
  const pageHeight = 842;
  const left = 50;
  const top = 780;
  const lineHeight = 18;
  const maxLinesPerPage = 38;
  const pages: string[] = [];

  for (let index = 0; index < lines.length; index += maxLinesPerPage) {
    const pageLines = lines.slice(index, index + maxLinesPerPage);
    const commands = ["BT", "/F1 12 Tf"];

    pageLines.forEach((line, lineIndex) => {
      const y = top - lineIndex * lineHeight;
      commands.push(`${left} ${y} Td`);
      commands.push(`(${escapePdfText(line)}) Tj`);
      if (lineIndex < pageLines.length - 1) {
        commands.push(`0 -${lineHeight} Td`);
      }
    });

    commands.push("ET");
    pages.push(commands.join("\n"));
  }

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  const objects: string[] = [];
  const totalObjects = 3 + pages.length * 2;

  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  const pageObjectNumbers = pages.map((_, index) => 4 + index * 2);
  objects.push(
    `2 0 obj\n<< /Type /Pages /Kids [${pageObjectNumbers
      .map((pageNumber) => `${pageNumber} 0 R`)
      .join(" ")}] /Count ${pages.length} >>\nendobj\n`,
  );

  objects.push(
    "3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  );

  pages.forEach((pageContent, index) => {
    const pageObjectNumber = 4 + index * 2;
    const contentObjectNumber = 5 + index * 2;
    const length = new TextEncoder().encode(pageContent).length;

    objects.push(
      `${pageObjectNumber} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectNumber} 0 R >>\nendobj\n`,
    );
    objects.push(
      `${contentObjectNumber} 0 obj\n<< /Length ${length} >>\nstream\n${pageContent}\nendstream\nendobj\n`,
    );
  });

  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += object;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${totalObjects + 1}\n`;
  pdf += "0000000000 65535 f \n";

  offsets.forEach((offset) => {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  });

  pdf += `trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

function downloadPdf(filename: string, title: string, content: string) {
  const pdf = createPdfContent(title, content);
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}

function toDownloadName(title: string) {
  const baseName = title.replace(/\.[^/.]+$/, "");
  return `${baseName}.pdf`;
}

function getToneClasses(tone: DashboardTone | "secondary") {
  if (tone === "success") {
    return {
      soft: "bg-[#dcf8df] text-[#14985d]",
      solid: "bg-[linear-gradient(90deg,#4fd1ff_0%,#0ba8dd_100%)] text-white shadow-[0_12px_24px_rgba(11,168,221,0.28)]",
    };
  }

  if (tone === "danger") {
    return {
      soft: "bg-[#ffe0df] text-[#e24343]",
      solid: "bg-[linear-gradient(90deg,#ff5b58_0%,#ff2020_100%)] text-white shadow-[0_12px_24px_rgba(255,32,32,0.18)]",
    };
  }

  if (tone === "warning") {
    return {
      soft: "bg-[#fff0cd] text-[#cc8b00]",
      solid: "bg-[linear-gradient(90deg,#ffcb57_0%,#f0a300_100%)] text-white shadow-[0_12px_24px_rgba(240,163,0,0.22)]",
    };
  }

  if (tone === "secondary") {
    return {
      soft: "bg-[#eef2fb] text-[#5c6cb0]",
      solid: "bg-[#b8b9cb] text-white",
    };
  }

  return {
    soft: "bg-[#e6f3ff] text-[#1b76d1]",
    solid: "bg-[linear-gradient(90deg,#65b7ff_0%,#1b76d1_100%)] text-white shadow-[0_12px_24px_rgba(27,118,209,0.22)]",
  };
}

function openUrl(url: string | null) {
  if (!url) {
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

function getChecklistAnswerValue(value: ChecklistAnswerValue) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value.toLowerCase();
  }

  if (value && typeof value === "object") {
    const booleanOptionEntries = [
      ["extensive", value.extensive],
      ["adequate", value.adequate],
      ["limited", value.limited],
      ["unsure", value.unsure],
    ] as const;
    const selectedBooleanOption = booleanOptionEntries.find(([, selected]) => selected === true);

    if (selectedBooleanOption) {
      return selectedBooleanOption[0];
    }

    if (typeof value.label === "string") {
      return value.label.toLowerCase();
    }
    if (typeof value.id === "string") {
      return value.id.toLowerCase();
    }
  }

  return null;
}

function getStoredChecklistAnswer(value: ChecklistAnswerValue) {
  return getChecklistAnswerValue(value) ? value : null;
}

function appendPdfCandidateParams(url: string, candidate: { name: string; niNumber: string; uln: string }) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}candidateName=${encodeURIComponent(candidate.name)}&niNumber=${encodeURIComponent(candidate.niNumber)}&uln=${encodeURIComponent(candidate.uln)}`;
}

function DetailLine({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[#4e63b6]">{icon}</div>
      <div className="flex flex-col gap-1.5 rounded-[16px] bg-[#f5f9ff] px-4 py-3">
        <p className="text-[13px] text-[#8b98b8]">{label}</p>
        <p className="mt-0.5 text-[15px] font-medium text-[#3b489f]">{value}</p>
      </div>
    </div>
  );
}

type ChecklistPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  booking: AdminBookingDetail;
  candidate: { name: string; niNumber: string; uln: string };
  flowData: ChecklistFlowData | null;
  courseData: unknown;
  title?: string;
};

function ChecklistPreviewModal({ isOpen, onClose, templateId, booking, candidate, flowData, courseData, title }: ChecklistPreviewModalProps) {
  const templateData = getChecklistTemplateData(templateId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12214d]/40 p-4 backdrop-blur-[4px]">
      <div className="flex h-full max-h-[90vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-[24px] border border-[#d7e5f8] bg-[#fbfdff] shadow-[0_32px_80px_rgba(18,33,77,0.25)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e7eef8] bg-white px-6 py-4 border-t border-t-[#dbe7f8] sm:border-t-0">
          <div>
            <h3 className="text-[20px] font-bold text-[#1e2b5e] sm:text-[22px]">
              {title || templateData.documentMeta.title}
            </h3>
            <p className="text-[13px] text-[#718096] sm:text-[14px]">
              Previewing filled checklist data from backend
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                openUrl(
                  appendPdfCandidateParams(
                    `/api/pdf/am2?template=${templateId}&courseId=${booking.course.id}&fileName=${templateId.replaceAll("-", "_")}_${booking.bookingNumber}.pdf`,
                    candidate,
                  ),
                );
              }}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[linear-gradient(90deg,#48cfff_0%,#0ba8dd_100%)] px-3 text-[13px] font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-95 sm:h-11 sm:px-5 sm:text-[14px]"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export to PDF</span>
              <span className="sm:hidden">Export</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-xl bg-[#f7fafc] text-[#4a5568] transition hover:bg-[#edf2f7] hover:text-[#2d3748] sm:h-11 sm:w-11"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#eef2f6]">
          <div className="mx-auto w-full">
            <div className="bg-white p-0">
              <div className="am2-pdf" style={{ minHeight: 'auto', padding: '20px 0' }}>
                <div className="am2-pdf__document" style={{ width: '100%', maxWidth: '210mm', margin: '0 auto' }}>
                  <ChecklistPdfTemplate
                    {...templateData}
                    templateId={templateId}
                    candidate={candidate}
                    hideToolbar={true}
                    data={flowData}
                    course={courseData}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookingDetailsView({ booking }: BookingDetailsViewProps) {
  const [showNetRegPreview, setShowNetRegPreview] = useState(false);
  const [showChecklistPreview, setShowChecklistPreview] = useState(false);
  const [preview, setPreview] = useState<PreviewState>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [decisionMessage, setDecisionMessage] = useState("");

  const [updateAdminBooking, { isLoading: isUpdatingBookingStatus }] =
    useUpdateAdminBookingMutation();

  const { data: mockRegResponse } = useGetMockRegistrationDataQuery(booking.course.id, {
    skip: !showNetRegPreview,
  });

  const checklistVariant =
    booking.checklistVariantMetadata?.checklistVariant ||
    booking.checklistVariant ||
    booking.course.assessmentVariant ||
    "am2";
  const checklistPreview = getChecklistPreviewConfig(checklistVariant);
  const rawFlowData = booking.checklistFlow?.flow as ChecklistFlowData | undefined;
  const rawCourseData = booking.checklistFlow?.course || booking.course;

  // Enrich flow data with the actual saved checklist responses from backend
const checklistFlowData = useMemo(() => {
  if (!rawFlowData) return null;
  
  const sections = rawFlowData.checklistSections || rawFlowData.sections || [];
  const responseMap = new Map(
    (booking.checklistResponses || []).map((response) => [
      response.itemId,
      {
        knowledge: getStoredChecklistAnswer(response.knowledge) ?? getStoredChecklistAnswer(response.knowledgeLevel),
        experience: getStoredChecklistAnswer(response.experience) ?? getStoredChecklistAnswer(response.experienceLevel),
      },
    ]),
  );
  
  const enrichedSections = sections.map((flowSection) => ({
      ...flowSection,
      items: flowSection.items.map((item, iIdx) => {
        const savedResponse = responseMap.get(item.id);

        return {
          ...item,
          no: item.no || item.number || iIdx + 1,
          criterion: item.criterion || item.text || "",
          knowledge: savedResponse?.knowledge ?? getStoredChecklistAnswer(item.knowledge),
          experience: savedResponse?.experience ?? getStoredChecklistAnswer(item.experience),
        };
      })
    }));

  const regData = mockRegResponse?.data?.mockRegistration;

  return {
    ...rawFlowData,
    course: rawCourseData,
    checklistSections: enrichedSections,
    sections: enrichedSections,
    candidate: {
      name: booking.profile.name,
      niNumber: booking.profile.nationalInsuranceNumber,
      uln: regData?.assessmentDetails?.uln || rawFlowData?.candidate?.uln,
      trainingCenter: booking.profile.trainingCenter,
      employer: regData?.employerDetails?.companyName,
      trainingProvider: regData?.trainingProviderDetails?.companyName,
    },
    signatures: {
      candidate: { 
        url: booking.uploadedDocuments.items.find(d => d.name.toLowerCase().includes("signature"))?.previewUrl 
      },
    }
  };
}, [rawFlowData, rawCourseData, booking, mockRegResponse]);

  const realCandidate = {
    name: booking.profile.name,
    niNumber: booking.profile.nationalInsuranceNumber || "N/A",
    uln: checklistFlowData?.candidate?.uln || "1234567890"
  };

  const getOptionTone = (option: string): DashboardTone => {
    switch (option?.toLowerCase()) {
      case "extensive":
      case "adequate":
        return "success";
      case "limited":
        return "warning";
      case "unsure":
        return "danger";
      default:
        return "info";
    }
  };

  const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const displayChecklistSections = useMemo(() => {
  // If we have enriched flow data, use that
  if (checklistFlowData && checklistFlowData.sections) {
    return checklistFlowData.sections.map(section => ({
      id: section.id,
      title: section.title,
      rows: section.items.map(item => {
        const knowledgeValue = getChecklistAnswerValue(item.knowledge);
        const experienceValue = getChecklistAnswerValue(item.experience);

        return {
          id: item.id,
          no: item.no || item.number,
          criterion: item.criterion || item.text,
          knowledge: knowledgeValue ? { 
            label: capitalize(knowledgeValue), 
            tone: getOptionTone(knowledgeValue) 
          } : null,
          experience: experienceValue ? { 
            label: capitalize(experienceValue), 
            tone: getOptionTone(experienceValue) 
          } : null
        };
      }),
    })).map((section) => {
      const completedItems = section.rows.filter((row) => row.knowledge && row.experience).length;
      const pendingItems = section.rows.length - completedItems;

      return {
        ...section,
        status:
          completedItems === section.rows.length
            ? { label: "Completed", tone: "success" as DashboardTone }
            : completedItems > 0
              ? { label: "In Progress", tone: "warning" as DashboardTone }
              : { label: "Pending", tone: "info" as DashboardTone },
        summary: {
          totalItems: section.rows.length,
          completedItems,
          pendingItems
        }
      };
    });
  }
  
  // Fallback to booking data
  return booking.checklistSummary.sections;
}, [checklistFlowData, booking.checklistSummary.sections]);

  const profile = booking.profile;
  const regFlow = mockRegResponse?.data.registrationFlow;
  const regPersonal = regFlow?.candidate?.submission?.payloadTemplate?.personalDetails;
  const regAssessment = regFlow?.assessment?.submission?.payloadTemplate?.assessmentDetails;
  
  const regData = regFlow ? {
    personalDetails: {
      title: regPersonal?.title || "N/A",
      firstName: regPersonal?.firstName || profile.name.split(" ")[0] || "N/A",
      lastName: regPersonal?.lastName || profile.name.split(" ").slice(1).join(" ") || "N/A",
      dateOfBirth: regPersonal?.dateOfBirth || "N/A",
      niNumber: regPersonal?.niNumber || profile.nationalInsuranceNumber || "N/A",
      email: regPersonal?.email || profile.email || "N/A",
      mobileNumber: regPersonal?.mobileNumber || profile.phoneNumber || "N/A",
      address1: regPersonal?.address1 || regPersonal?.addressLine1 || profile.address || "N/A",
      address2: regPersonal?.address2 || regPersonal?.addressLine2 || "N/A",
      town: regPersonal?.town || profile.city || "N/A",
      postcode: regPersonal?.postcode || profile.postcode || "N/A",
    },
    assessmentDetails: regAssessment ? {
      ...regAssessment,
      isApprentice: regAssessment.apprentice === "yes",
      requiresAdjustments: regAssessment.reasonableAdjustments === "yes",
      priorLearning: regAssessment.recognitionOfPriorLearning === "yes",
      fundingMethod: regAssessment.funding === "england-16-18" ? "England 16-18 Apprenticeship funded" : 
                     regAssessment.funding === "england-19-plus" ? "England 19+ Apprenticeship funded" : 
                     regAssessment.funding === "other" ? "Other Funding Method" : regAssessment.funding,
      awardingBody: regAssessment.awardingBody === "city-and-guilds" ? "City & Guilds" : 
                    regAssessment.awardingBody === "eal" ? "EAL" : 
                    regAssessment.awardingBody === "nja" ? "N/A" : regAssessment.awardingBody,
      assessmentType: regAssessment.assessmentType === "am2" ? "AM2" : 
                      regAssessment.assessmentType === "am2e" ? "AM2E" : 
                      regAssessment.assessmentType === "am2s-v1-1-2" ? "AM2S v1.1 / 1.2" : 
                      regAssessment.assessmentType === "am2e-v1-1" ? "AM2E v1.1" : 
                      regAssessment.assessmentType?.toUpperCase() || "",
    } : null,
    employerDetails: regFlow.employer?.submission?.payloadTemplate?.employerDetails ? {
      companyName: regFlow.employer.submission.payloadTemplate.employerDetails.companyName || "N/A",
      email: regFlow.employer.submission.payloadTemplate.employerDetails.email || "N/A",
      contactName: regFlow.employer.submission.payloadTemplate.employerDetails.contactName || "N/A",
      contactNumber: regFlow.employer.submission.payloadTemplate.employerDetails.contactNumber || "N/A",
      address1: regFlow.employer.submission.payloadTemplate.employerDetails.address1 || "N/A",
      address2: regFlow.employer.submission.payloadTemplate.employerDetails.address2 || "N/A",
      address3: regFlow.employer.submission.payloadTemplate.employerDetails.address3 || "N/A",
      address4: regFlow.employer.submission.payloadTemplate.employerDetails.address4 || "N/A",
      town: regFlow.employer.submission.payloadTemplate.employerDetails.town || "N/A",
      postcode: regFlow.employer.submission.payloadTemplate.employerDetails.postcode || "N/A",
    } : { companyName: "N/A", email: "N/A", contactName: "N/A", contactNumber: "N/A", address1: "N/A", town: "N/A", postcode: "N/A" },
    trainingProviderDetails: regFlow.training?.submission?.payloadTemplate?.trainingProviderDetails ? {
      companyName: regFlow.training.submission.payloadTemplate.trainingProviderDetails.companyName || "N/A",
      email: regFlow.training.submission.payloadTemplate.trainingProviderDetails.email || "N/A",
      contactName: regFlow.training.submission.payloadTemplate.trainingProviderDetails.contactName || "N/A",
      contactNumber: regFlow.training.submission.payloadTemplate.trainingProviderDetails.contactNumber || "N/A",
      address1: regFlow.training.submission.payloadTemplate.trainingProviderDetails.address1 || "N/A",
      address2: regFlow.training.submission.payloadTemplate.trainingProviderDetails.address2 || "N/A",
      address3: regFlow.training.submission.payloadTemplate.trainingProviderDetails.address3 || "N/A",
      address4: regFlow.training.submission.payloadTemplate.trainingProviderDetails.address4 || "N/A",
      town: regFlow.training.submission.payloadTemplate.trainingProviderDetails.town || "N/A",
      postcode: regFlow.training.submission.payloadTemplate.trainingProviderDetails.postcode || "N/A",
    } : { companyName: "N/A", email: "N/A", contactName: "N/A", contactNumber: "N/A", address1: "N/A", town: "N/A", postcode: "N/A" },
    privacyConfirmation: regFlow.privacy?.submission?.payloadTemplate?.privacyConfirmation,
  } : mockRegResponse?.data.mockRegistration;

  const netRegStatic = getNetRegistrationFormData();
  
  const currentStatusClasses = getToneClasses(
    booking.reviewDecision.currentStatus.tone,
  );
  const isAlreadyUnderReview = booking.applicationStatus === "under_review";
  const isAlreadyApproved = booking.applicationStatus === "approved";

  const toggleSection = (sectionId: string) => {
    setExpandedSections((current) =>
      current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId],
    );
  };

  const handleVerificationView = (item: AdminBookingDetail["verification"]["items"][number]) => {
    setPreview({
      title: `${item.label} Verification`,
      subtitle: `${profile.name} | ${item.status.label}`,
      content: [
        `Candidate: ${profile.name}`,
        `Verification type: ${item.label}`,
        `Status: ${item.status.label}`,
        `Submitted on: ${profile.submittedAtLabel}`,
        "",
        item.supportingText,
        item.action ? "" : "",
        item.action ? `Action: ${item.action.label}` : "",
        item.action ? `Link: ${item.action.url}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  };

  const handleDocumentView = (
    document: AdminBookingDetail["uploadedDocuments"]["items"][number],
    displayName?: string,
  ) => {
    const nameToUse = displayName || document.name;

    if (nameToUse === "NET Candidate Registration Form") {
      setShowNetRegPreview(true);
      return;
    }

    if (document.previewUrl) {
      openUrl(document.previewUrl);
      return;
    }

    setPreview({
      title: nameToUse,
      subtitle: `${profile.name} | Uploaded document`,
      content: [
        `Document: ${nameToUse}`,
          `Candidate: ${profile.name}`,
          `Booking number: ${booking.bookingNumber}`,
          `Submitted on: ${profile.submittedAtLabel}`,
          "",
          document.description,
          document.available
            ? "A preview URL was not provided by the API."
            : "Document storage is not available yet for this file.",
        ].join("\n"),
      });
    };

  const handleDocumentDownload = (
    document: AdminBookingDetail["uploadedDocuments"]["items"][number],
    displayName?: string,
  ) => {
    const nameToUse = displayName || document.name;

    if (nameToUse === "NET Candidate Registration Form") {
      openUrl("/api/pdf/am2?template=net-registration-form&fileName=NET_Registration_Form.pdf");
      return;
    }

    if (document.downloadUrl) {
      openUrl(document.downloadUrl);
      return;
    }

    downloadPdf(
      toDownloadName(nameToUse),
      nameToUse,
      [
        `Document export: ${nameToUse}`,
          `Candidate: ${profile.name}`,
          `Booking number: ${booking.bookingNumber}`,
          `Submitted on: ${profile.submittedAtLabel}`,
          "",
          document.description,
        ].join("\n"),
      );
    };

  const handleSendReminder = () => {
    openUrl(booking.reviewDecision.actions.sendReminder.url);
    setDecisionMessage(`Reminder opened for ${profile.name}.`);
  };

  const updateBookingApplicationStatus = async (
    applicationStatus: "under_review" | "approved",
  ) => {
    if (isUpdatingBookingStatus) {
      return;
    }

    try {
      const response = await updateAdminBooking({
        bookingId: booking.id,
        body: {
          applicationStatus,
        },
      }).unwrap();

      setDecisionMessage(
        response.message ||
          (applicationStatus === "approved"
            ? `${profile.name} is now approved.`
            : `${profile.name} is now marked under review.`),
      );
    } catch {
      setDecisionMessage(
        applicationStatus === "approved"
          ? `We could not approve ${profile.name} right now.`
          : `We could not mark ${profile.name} under review right now.`,
      );
    }
  };

  const handleApproveReview = async () => {
    if (isAlreadyApproved) {
      return;
    }

    await updateBookingApplicationStatus("approved");
  };

  const handleMarkUnderReview = async () => {
    if (isAlreadyUnderReview) {
      return;
    }

    await updateBookingApplicationStatus("under_review");
  };

  const handleRejectCandidate = () => {
    setDecisionMessage(
      `${profile.name} is marked for rejection review.`,
    );
  };

  return (
    <>
      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className="rounded-[18px] border border-[#dbe7f8] bg-[#fbfdff] p-5 shadow-[0_12px_32px_rgba(22,43,120,0.04)]">
              <div
                className={`mx-auto grid h-20 w-20 place-items-center rounded-full text-[36px] font-medium text-white ${
                  avatarToneClasses[profile.avatarTone] ?? "bg-[#18acd6]"
                }`}
              >
                {profile.initial}
              </div>

              <div className="mt-4 text-center">
                <h1 className="text-[26px] font-semibold text-[#2f3c96]">
                  {profile.name}
                </h1>
                <p className="mt-1 text-[13px] text-[#93a1bc]">
                  Submitted: {profile.submittedAtLabel}
                </p>
                <p className="mt-1 text-[13px] text-[#93a1bc]">
                  Booking: {booking.bookingNumber}
                </p>
              </div>

              <div className="mt-4 flex justify-center">
                <span
                  className={`rounded-full px-3 py-1 text-[13px] font-medium ${currentStatusClasses.soft}`}
                >
                  {booking.reviewDecision.currentStatus.label}
                </span>
              </div>

              <div className="mt-6 space-y-4 border-t border-[#ebf1f9] pt-5">
                <DetailLine
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={profile.email}
                />
                <DetailLine
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={profile.phoneNumber}
                />
                <DetailLine
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="NI Number"
                  value={profile.nationalInsuranceNumber ?? "Not provided"}
                />
                <DetailLine
                  icon={<MapPin className="h-4 w-4" />}
                  label="Address"
                  value={`${profile.address}, ${profile.city}, ${profile.postcode}`}
                />
                <DetailLine
                  icon={<Building2 className="h-4 w-4" />}
                  label="Training Centre"
                  value={profile.trainingCenter}
                />
              </div>
            </section>

            <section className="rounded-[18px] border border-[#dbe7f8] bg-[#fbfdff] p-4 shadow-[0_12px_32px_rgba(22,43,120,0.04)]">
              <h2 className="text-[20px] font-semibold text-[#33469c]">
                {booking.reviewDecision.title}
              </h2>
              {decisionMessage ? (
                <p className="mt-3 rounded-[12px] border border-[#dce8f8] bg-[#f6fbff] px-3 py-2 text-[13px] text-[#5162a8]">
                  {decisionMessage}
                </p>
              ) : null}
              {booking.notes ? (
                <p className="mt-3 rounded-[12px] border border-[#e4ecf8] bg-[#fcfeff] px-3 py-2 text-[13px] text-[#5d6cb1]">
                  {booking.notes}
                </p>
              ) : null}
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  disabled={isAlreadyApproved || isUpdatingBookingStatus}
                  onClick={handleApproveReview}
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-[12px] px-4 text-[15px] font-semibold ${
                    isAlreadyApproved || isUpdatingBookingStatus
                      ? "cursor-not-allowed bg-[#eaf0f7] text-[#9aa8c4]"
                      : getToneClasses("success").solid
                  }`}
                >
                  {isAlreadyApproved
                    ? "Already Approved"
                    : isUpdatingBookingStatus
                      ? "Approving Review..."
                      : "Admin Approve Review"}
                </button>
                <button
                  type="button"
                  disabled={isAlreadyUnderReview || isUpdatingBookingStatus}
                  onClick={handleMarkUnderReview}
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-[12px] px-4 text-[15px] font-semibold ${
                    isAlreadyUnderReview || isUpdatingBookingStatus
                      ? "cursor-not-allowed bg-[#eaf0f7] text-[#9aa8c4]"
                      : getToneClasses("warning").solid
                  }`}
                >
                  {isAlreadyUnderReview
                    ? "Already Under Review"
                    : isUpdatingBookingStatus
                      ? "Marking Under Review..."
                      : "Admin Mark Under Review"}
                </button>
                <button
                  type="button"
                  disabled={!booking.reviewDecision.actions.sendReminder.enabled}
                  onClick={handleSendReminder}
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-[12px] px-4 text-[15px] font-semibold ${
                    booking.reviewDecision.actions.sendReminder.enabled
                      ? getToneClasses(booking.reviewDecision.actions.sendReminder.tone)
                          .solid
                      : "cursor-not-allowed bg-[#eaf0f7] text-[#9aa8c4]"
                  }`}
                >
                  {booking.reviewDecision.actions.sendReminder.label}
                </button>
                <button
                  type="button"
                  disabled={!booking.reviewDecision.actions.rejectCandidate.enabled}
                  onClick={handleRejectCandidate}
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-[12px] px-4 text-[15px] font-semibold ${
                    booking.reviewDecision.actions.rejectCandidate.enabled
                      ? getToneClasses(booking.reviewDecision.actions.rejectCandidate.tone)
                          .solid
                      : "cursor-not-allowed bg-[#eaf0f7] text-[#9aa8c4]"
                  }`}
                >
                  {booking.reviewDecision.actions.rejectCandidate.label}
                </button>
              </div>
            </section>
          </aside>

          <div className="space-y-4">
            <section className="rounded-[18px] border border-[#dbe7f8] bg-[#fbfdff] p-4 shadow-[0_12px_32px_rgba(22,43,120,0.04)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#33469c]">
                    Course Overview
                  </h2>
                  <p className="mt-2 text-[18px] font-medium text-[#4051a6]">
                    {booking.course.title}
                  </p>
                  <p className="mt-1 text-[14px] text-[#7c89aa]">
                    {booking.course.qualification}
                  </p>
                  <p className="mt-3 text-[14px] text-[#5c6cb0]">
                    {booking.course.schedule}
                  </p>
                  <p className="mt-1 text-[14px] text-[#5c6cb0]">
                    {booking.session.location}
                  </p>
                </div>

                <div className="min-w-[220px] rounded-[16px] border border-[#e1ebf8] bg-[#fafdff] px-4 py-4">
                  <p className="text-[13px] text-[#8a97b8]">Payment</p>
                  <p className="mt-3 text-[22px] font-semibold text-[#33469c]">
                    {booking.payment.displayAmount}
                  </p>
                  <p className="mt-2 text-[13px] text-[#8a97b8]">
                    Status: {booking.statusBadge.label}
                  </p>
                  <p className="mt-1 text-[13px] text-[#8a97b8]">
                    Session: {booking.session.displayDateTime}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[18px] border border-[#dbe7f8] bg-[#fbfdff] p-4 shadow-[0_12px_32px_rgba(22,43,120,0.04)]">
              <h2 className="text-[18px] font-semibold text-[#33469c]">
                {booking.verification.title}
              </h2>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {booking.verification.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-[16px] border border-[#e1ebf8] bg-[#fafdff] px-4 py-4"
                  >
                    <div>
                      <p className="text-[15px] font-medium text-[#3a4aa0]">
                        {item.label}
                      </p>
                      <p className="mt-2 text-[13px] text-[#7180a6]">
                        {item.supportingText}
                      </p>
                      <p
                        className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[12px] font-medium ${getToneClasses(item.status.tone).soft}`}
                      >
                        {item.status.label}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleVerificationView(item)}
                      className="flex items-center gap-2 rounded-full px-2 py-1 text-[14px] text-[#6475b3] transition hover:bg-[#f3f8ff]"
                    >
                      <Eye className="h-4 w-4" />
                      <span>{item.action?.label ?? "View"}</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[18px] border border-[#dbe7f8] bg-[#fbfdff] p-4 shadow-[0_12px_32px_rgba(22,43,120,0.04)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[18px] font-semibold text-[#33469c]">
                  {booking.uploadedDocuments.title}
                </h2>
              </div>


              {booking.uploadedDocuments.downloadAll.reason ? (
                <p className="mt-3 text-[13px] text-[#8e9cbc]">
                  {booking.uploadedDocuments.downloadAll.reason}
                </p>
              ) : null}

              <div className="mt-4 space-y-3">
                {booking.uploadedDocuments.items.map((document) => {
                  const isRegistrationFormDocument =
                    document.category === "booking_form" ||
                    document.category === "registration_form" ||
                    document.name === "NET Candidate Registration Form";
                  const displayName = document.name;

                  return (
                    <div
                      key={document.id}
                      className="flex flex-col gap-3 rounded-[16px] border border-[#e3ecf8] bg-[#fcfeff] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-[#f1f6ff] text-[#4c61b5]">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-medium text-[#33469c]">
                            {displayName}
                          </p>
                          <p className="mt-1 text-[12px] text-[#8e9cbc]">
                            {document.description}
                          </p>
                          <p className="mt-2 text-[12px] text-[#93a0bc]">
                            {document.available ? "Available" : "Not available yet"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[#5c6cb0]">
                        {isRegistrationFormDocument ? (
                          <button
                            type="button"
                            onClick={() => setShowNetRegPreview(true)}
                            className="rounded-lg bg-[#eef6ff] px-4 py-1.5 text-[12px] font-medium text-[#4b7bec] transition-colors hover:bg-[#dfeeff]"
                          >
                            Export
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleDocumentDownload(document, displayName)}
                              className="grid h-9 w-9 place-items-center rounded-full border border-[#dce7f7]"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDocumentView(document, displayName)}
                              className="grid h-9 w-9 place-items-center rounded-full border border-[#dce7f7]"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>


                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[18px] border border-[#dbe7f8] bg-[#fbfdff] p-4 shadow-[0_12px_32px_rgba(22,43,120,0.04)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#33469c]">
                    {booking.checklistSummary.title}
                  </h2>
                  <p className="mt-2 text-[13px] text-[#8e9cbc]">
                    {booking.checklistSummary.summary.totalSections} sections,{" "}
                    {booking.checklistSummary.summary.totalItems} items
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={!rawFlowData}
                    onClick={() => setShowChecklistPreview(true)}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-[12px] px-4 text-[14px] font-semibold transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${checklistPreview.buttonClassName}`}
                  >
                    <Eye className="h-4 w-4" />
                    <span>{checklistPreview.label}</span>
                  </button>
                </div>
              </div>

              {booking.checklistSummary.download.reason && !booking.checklistSummary.download.reason.toLowerCase().includes("not implemented") ? (
                <p className="mt-3 text-[13px] text-[#8e9cbc]">
                  {booking.checklistSummary.download.reason}
                </p>
              ) : null}

              <div className="mt-4 space-y-4">
                {displayChecklistSections.map((section) => {
                  const isExpanded = expandedSections.includes(section.id);
                  const previewCount =
                    section.rows.length <= 2 ? section.rows.length : 2;
                  const visibleRows = isExpanded
                    ? section.rows
                    : section.rows.slice(0, previewCount);

                  return (
                    <div
                      key={section.id}
                      className="overflow-hidden rounded-[18px] border border-[#e0e9f6] bg-[#fbfdff]"
                    >
                      <div className="flex flex-col gap-2 border-b border-[#e8eef8] bg-[#fcfeff] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-[16px] font-medium text-[#4051a6]">
                          {section.title}
                        </h3>
                        <span
                          className={`rounded-[8px] px-3 py-1 text-[12px] font-medium ${getToneClasses(section.status.tone).soft}`}
                        >
                          {section.status.label}
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <div className="min-w-[640px]">
                          <div className="grid grid-cols-[72px_1.6fr_0.6fr_0.6fr] gap-3 bg-[#f3f8fe] px-4 py-3 text-[13px] font-semibold text-[#6a78a4]">
                            <div>No.</div>
                            <div>Criterion</div>
                            <div>Knowledge</div>
                            <div>Experience</div>
                          </div>

                          {visibleRows.map((row) => (
                            <div
                              key={row.id}
                              className="grid grid-cols-[72px_1.6fr_0.6fr_0.6fr] gap-3 border-t border-dashed border-[#e5ecf7] px-4 py-3 text-[14px] text-[#4e5d8d]"
                            >
                              <div>{row.no}</div>
                              <div>{row.criterion}</div>
                              <div>
                                {row.knowledge ? (
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1 text-[12px] font-medium ${getToneClasses(row.knowledge.tone).soft}`}
                                  >
                                    <Check className="h-3 w-3" />
                                    {row.knowledge.label}
                                  </span>
                                ) : (
                                  <span className="text-[12px] text-[#b0bbd5]">Pending</span>
                                )}
                              </div>
                              <div>
                                {row.experience ? (
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1 text-[12px] font-medium ${getToneClasses(row.experience.tone).soft}`}
                                  >
                                    <Check className="h-3 w-3" />
                                    {row.experience.label}
                                  </span>
                                ) : (
                                  <span className="text-[12px] text-[#b0bbd5]">Pending</span>
                                )}
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>

                      {section.rows.length > previewCount ? (
                        <button
                          type="button"
                          onClick={() => toggleSection(section.id)}
                          className="w-full border-t border-[#eef3fa] px-4 py-3 text-center text-[13px] font-medium text-[#5d6cb1] transition hover:bg-[#f8fbff]"
                        >
                          {isExpanded
                            ? "Show less"
                            : `View all ${section.rows.length} items`}
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Regular preview modal */}
      {preview ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12214d]/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-[760px] rounded-[20px] border border-[#d7e5f8] bg-[#fbfdff] shadow-[0_24px_60px_rgba(18,33,77,0.18)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#e7eef8] px-5 py-4">
              <div>
                <h3 className="text-[20px] font-semibold text-[#33469c]">
                  {preview.title}
                </h3>
                <p className="mt-1 text-[13px] text-[#8d9abc]">
                  {preview.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="grid h-10 w-10 place-items-center rounded-full text-[#4454aa] transition hover:bg-[#f4f8ff]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-5">
              <div className="rounded-[16px] border border-[#e3ecf8] bg-[#f8fbff] p-4">
                <pre className="whitespace-pre-wrap text-[14px] leading-7 text-[#45548c]">
                  {preview.content}
                </pre>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showChecklistPreview && rawFlowData ? (
        <ChecklistPreviewModal
          isOpen={showChecklistPreview}
          onClose={() => setShowChecklistPreview(false)}
          templateId={checklistPreview.templateId}
          booking={booking}
          candidate={realCandidate}
          flowData={checklistFlowData}
          courseData={rawCourseData}
          title={checklistPreview.title}
        />
      ) : null}

      {/* NET Registration Preview Modal */}
      {showNetRegPreview ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12214d]/40 p-4 backdrop-blur-[4px]">
          <div className="flex h-full max-h-[90vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-[24px] border border-[#d7e5f8] bg-[#fbfdff] shadow-[0_32px_80px_rgba(18,33,77,0.25)]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e7eef8] bg-white px-6 py-4 border-t border-t-[#dbe7f8] sm:border-t-0">
              <div>
                <h3 className="text-[20px] font-bold text-[#1e2b5e] sm:text-[22px]">
                  {netRegStatic.documentMeta.title}
                </h3>
                <p className="text-[13px] text-[#718096] sm:text-[14px]">
                  Previewing filled registration data from backend
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    openUrl(
                      appendPdfCandidateParams(
                        `/api/pdf/am2?template=net-registration-form&courseId=${booking.course.id}&fileName=NET_Registration_Form_${booking.bookingNumber}.pdf`,
                        realCandidate
                      )
                    );
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[linear-gradient(90deg,#48cfff_0%,#0ba8dd_100%)] px-3 text-[13px] font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-95 sm:h-11 sm:px-5 sm:text-[14px]"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export to PDF</span>
                  <span className="sm:hidden">Export</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNetRegPreview(false)}
                  className="grid h-10 w-10 place-items-center rounded-xl bg-[#f7fafc] text-[#4a5568] transition hover:bg-[#edf2f7] hover:text-[#2d3748] sm:h-11 sm:w-11"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-[#eef2f6]">
              <div className="mx-auto w-full">
                <div className="bg-white p-0">
                  <div className="am2-pdf" style={{ minHeight: 'auto', padding: '20px 0' }}>
                    <div className="am2-pdf__document" style={{ width: '100%', maxWidth: '210mm', margin: '0 auto' }}>
                      <NetRegistrationFormTemplate
                        documentMeta={netRegStatic.documentMeta}
                        formPages={netRegStatic.formPages}
                        data={regData}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
