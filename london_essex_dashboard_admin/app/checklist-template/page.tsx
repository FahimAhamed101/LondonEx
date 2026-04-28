import "@/components/pdf/checklist-pdf.css";
import ChecklistPdfTemplate from "@/components/pdf/ChecklistPdfTemplate";
import { getChecklistTemplateData } from "@/components/pdf/mockChecklistData";
import NetRegistrationFormTemplate from "@/components/pdf/NetRegistrationFormTemplate";
import { getNetRegistrationFormData } from "@/components/pdf/netRegistrationFormData";
import { API_BASE_URL } from "@/lib/api/api-config";

export default async function ChecklistTemplatePage({
  searchParams,
}: PageProps<"/checklist-template">) {
  const resolvedSearchParams = await searchParams;
  const fileName =
    typeof resolvedSearchParams.fileName === "string"
      ? resolvedSearchParams.fileName
      : undefined;
  const templateId =
    typeof resolvedSearchParams.template === "string"
      ? resolvedSearchParams.template
      : "am2-checklist";
  const autoDownload =
    resolvedSearchParams.download === "1" ||
    resolvedSearchParams.download === "true";
  const hideToolbar =
    resolvedSearchParams.pdf === "1" || resolvedSearchParams.pdf === "true";
  const courseId = 
    typeof resolvedSearchParams.courseId === "string"
      ? resolvedSearchParams.courseId
      : undefined;
  const candidateName =
    typeof resolvedSearchParams.candidateName === "string"
      ? resolvedSearchParams.candidateName
      : undefined;
  const candidateNiNumber =
    typeof resolvedSearchParams.niNumber === "string"
      ? resolvedSearchParams.niNumber
      : undefined;
  const candidateUln =
    typeof resolvedSearchParams.uln === "string"
      ? resolvedSearchParams.uln
      : undefined;
      
  const isNetRegistrationForm = templateId === "net-registration-form";

  let data = null;
  if (courseId) {
    try {
      let fetchPath = "";
      if (isNetRegistrationForm) {
        fetchPath = `/bookings/mock-registration-data?courseId=${courseId}`;
      } else if (templateId === "am2-checklist") {
        fetchPath = `/bookings/am2-checklist-flow?courseId=${courseId}`;
      } else if (templateId === "net-am2e-full-candidate-checklist" || templateId === "am2e-checklist") {
        fetchPath = `/bookings/am2e-checklist-flow?courseId=${courseId}`;
      } else if (templateId === "am2e-v1-checklist") {
        fetchPath = `/bookings/am2e-v1-checklist-flow?courseId=${courseId}`;
      }

      if (fetchPath) {
        const fetchUrl = `${API_BASE_URL}${fetchPath}`;
        const res = await fetch(fetchUrl, { cache: "no-store" });
        
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            if (isNetRegistrationForm) {
              const regFlow = json.data.registrationFlow;
              const regPersonal = regFlow?.candidate?.submission?.payloadTemplate?.personalDetails;
              const regAssessment = regFlow?.assessment?.submission?.payloadTemplate?.assessmentDetails;

              data = {
                personalDetails: {
                  title: regPersonal?.title || "N/A",
                  firstName: regPersonal?.firstName || candidateName?.split(" ")[0] || "N/A",
                  lastName: regPersonal?.lastName || candidateName?.split(" ").slice(1).join(" ") || "N/A",
                  dateOfBirth: regPersonal?.dateOfBirth || "N/A",
                  niNumber: regPersonal?.niNumber || candidateNiNumber || "N/A",
                  email: regPersonal?.email || "N/A",
                  mobileNumber: regPersonal?.mobileNumber || "N/A",
                  address1: regPersonal?.address1 || regPersonal?.addressLine1 || "N/A",
                  address2: regPersonal?.address2 || regPersonal?.addressLine2 || "N/A",
                  town: regPersonal?.town || "N/A",
                  postcode: regPersonal?.postcode || "N/A",
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
                                  regAssessment.assessmentType?.toUpperCase() || "N/A",
                } : { isApprentice: false, requiresAdjustments: false, priorLearning: false, assessmentType: "N/A" },
                employerDetails: regFlow?.employer?.submission?.payloadTemplate?.employerDetails ? {
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
                trainingProviderDetails: regFlow?.training?.submission?.payloadTemplate?.trainingProviderDetails ? {
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
                privacyConfirmation: regFlow?.privacy?.submission?.payloadTemplate?.privacyConfirmation || false,
              };
            } else {
              data = {
                ...json.data.flow,
                course: json.data.course,
                candidate: {
                  ...json.data.flow?.candidate,
                  name: candidateName,
                  niNumber: candidateNiNumber,
                  uln: candidateUln || json.data.flow?.candidate?.uln,
                },
              };
            }
          }
        } else {
          console.error(`Failed to fetch data for ${templateId}: ${res.status} ${res.statusText}`);
        }
      }
    } catch (e) {
      console.error(`Error fetching data for ${templateId}:`, e);
    }
  }

  if (isNetRegistrationForm) {
    return <NetRegistrationFormTemplate {...getNetRegistrationFormData()} data={data} />;
  }

  return (
    <ChecklistPdfTemplate
      {...getChecklistTemplateData(templateId)}
      templateId={templateId}
      initialFileName={fileName}
      autoDownload={autoDownload}
      hideToolbar={hideToolbar}
      data={data}
      candidate={{
        ...getChecklistTemplateData(templateId).candidate,
        name: candidateName || getChecklistTemplateData(templateId).candidate.name,
        niNumber:
          candidateNiNumber || getChecklistTemplateData(templateId).candidate.niNumber,
        uln: candidateUln || getChecklistTemplateData(templateId).candidate.uln,
      }}
    />
  );
}
