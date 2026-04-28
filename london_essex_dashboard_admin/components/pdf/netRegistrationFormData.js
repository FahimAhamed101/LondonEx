const netRegistrationFormData = {
  templateId: "net-registration-form",
  documentMeta: {
    title: "NET Candidate Registration Form",
    previewLabel: "NET Registration Form Preview",
    footerCode: "NET",
    footerDate: "v04.26",
    footerCenter: "\u00a9 National Electrotechnical Training",
    slogan: "By the industry, for the industry",
  },
  formPages: [
    {
      title: "NET Candidate Registration Form",
      intro:
        "Once this form is completed please return it to your assessment centre. All fields are mandatory.",
      policyText: "To view how NET uses candidate data please view our Privacy Policy at",
      policyLink: "www.netservices.org.uk/policies",
      assessmentRows: [
        ["AM2", "AM2S v1.0", "AM2S v1.1 / 1.2", "AM2SN", "AM2E"],
        ["AM2E v1.1", "AM2D", "AM2ED", "Cable Jointing"],
      ],
      fundingOptions: [
        { label: "England 16-18 Apprenticeship funded" },
        { label: "England 19+ Apprenticeship funded" },
        {
          label: "Other Funding Method",
          note: "(i.e. Apprentices outside of England)",
        },
      ],
      awardingOptions: ["City & Guilds", "EAL", "N/A"],
    },
    {
      employerFields: ["Address 1", "Address 2", "Address 3", "Address 4"],
      employerFinalNote: {
        prefix: "If you have no employer or are self-employed please put",
        highlight: "SELF EMPLOYED or N/A",
      },
      trainingProviderNote:
        "(Please enter the details of the training provider or college where you gained the qualifications to enable you to apply for this assessment. This section is mandatory. Please complete all fields.)",
      providerFields: ["Address 1", "Address 2", "Address 3", "Address 4"],
      privacy: {
        title: "PRIVACY NOTICE:",
        body: "NET and the Assessment Centre you attend are both Data Controllers for the purposes of Data Protection Law. Where applicable they will jointly uphold your rights. Information that you include in this form is necessary for the completion of your assessment and will only be shared between the Controllers for this purpose or their professional or legal obligations. In accordance with our terms and conditions, all units of the assessment must be completed within 24 months of commencement. We are required to retain a photograph of you to enable the verification of your identity. Specifically, photographs are retained for either 6 months after you pass the assessment, or 6 months after the 24 month period has expired. Other data is kept in accordance with our data retention policy. For full details of NET's policy on Data Protection please visit www.netservices.org.uk or the website of your assigned Assessment Centre.",
      },
    },
  ],
};

export function getNetRegistrationFormData() {
  return netRegistrationFormData;
}

export default netRegistrationFormData;
