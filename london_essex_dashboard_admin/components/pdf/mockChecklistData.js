const am2ChecklistData = {
  templateId: "am2-checklist",
  documentMeta: {
    title: "AM2 Checklist",
    previewLabel: "AM2 PDF Preview",
    footerCode: "AM2",
    footerDate: "05.25",
  },
  cover: {
    titleLines: [
      "Readiness for",
      "Assessment:",
      "Candidate",
      "Self-Assessment",
      "Checklist",
    ],
    examCode: "AM2",
    examAudience: "For those taking",
    examQualification: "Level 3 NVQ (C&G 2357 / EAL 1605)",
    completionNotice:
      "To be completed by candidate, employer and training provider",
    slogan: "By the industry, for the industry",
  },
  candidate: {
    name: "Harvey Collins",
    niNumber: "QQ 12 34 56 C",
    uln: "1234567890",
  },
  infoPage: {
    heading: "Important Information",
    paragraphs: [
      "Completing this checklist is a compulsory part of the AM2 gateway process. It helps all parties to thoroughly review whether an individual has the required knowledge and experience to undertake the test. If gaps are identified, additional training or experience is recommended.",
      "The checklist should be completed by the candidate, with input from their employer and training provider. Experience shows that a three-way discussion is the most effective way of doing this.",
      "Bear in mind that you are unlikely to be sufficiently prepared to pass the assessment if you cannot confidently tick at least \"Adequate\" for every statement in terms of both Knowledge and Practical Experience.",
      "The AM2 Electrotechnical Assessment of Occupational Competence is designed for those who wish to practise either as an installation electrician, or as a maintenance electrician. It demonstrates they have the level of competence expected by the industry in the following key occupational areas:",
      "In accordance with the installation specification and the relevant statutory and non-statutory regulations, candidates will be expected to install, terminate, connect, inspect, test and commission:",
      "The assessment covers the following sections:",
    ],
    bulletGroups: [
      {
        title: "competence",
        items: [
          "Risk assessments and health and safety",
          "Safe isolation",
          "The interpretation of specifications, drawings and diagrams",
          "Planning and preparing to install, terminate and connect identified wiring systems",
          "Installing, terminating and connecting identified wiring systems",
          "Inspection, testing and certification",
          "Fault diagnosis and correction of electrical faults",
          "The understanding and application of industry recognised procedures, working practices and the requirements of statutory and non-statutory regulations.",
        ],
      },
      {
        title: "installations",
        items: [
          "A three-phase distribution board and sub-circuit",
          "A three-phase Direct-on-Line Motor circuit",
          "Single phase lighting and power circuits",
          "A central heating/sustainable energy system",
          "A safety services circuit and device",
          "A data-cabling system.",
        ],
      },
    ],
    sectionSummary: [
      { code: "Section A1:", label: "Safe Isolation and Risk Assessment" },
      { code: "Sections A2-A5:", label: "Composite Installation" },
      { code: "Section B:", label: "Inspection, Testing and Certification" },
      { code: "Section C:", label: "Safe Isolation of Circuits" },
      { code: "Section D:", label: "Fault Diagnosis and Rectification" },
      { code: "Section E:", label: "Assessment of Applied Knowledge" },
    ],
    usageHeading: "Using this Checklist",
    usageParagraphs: [
      "Please work through Sections A-E in this document and tick the boxes that best suit the candidate's knowledge and experience in each area. Remember that you are unlikely to be sufficiently prepared to pass the assessment if you cannot confidently tick at least \"Adequate\" for every statement in terms of both Knowledge and Practical Experience.",
      "If there are areas of concern, an action plan should be produced to help the candidate achieve the required standard before submitting the gateway application.",
      "The completed, signed document is a compulsory gateway check to confirm readiness for assessment before the assessment can be booked. It must be submitted to NET as part of the Request for Assessment.",
      "Candidates enrolled on Level 3 NVQ (2357/1604/1605) should not take the AM2 until all other qualification units are complete. AM2 is stipulated as the final unit before claim. If they are attempting to undertake the AM2 earlier it is unlikely they will have the sufficient skills, knowledge and experience to successfully complete the assessment.",
    ],
  },
  sectionPages: [
    {
      id: "section-a1",
      title: "Section A1: Safe Isolation and Risk Assessment",
      duration: "45 mins",
      subtitle:
        "To demonstrate occupational competence candidates will be expected to:",
      items: [
        {
          id: "a1-1",
          number: 1,
          text: "Carry out and document an assessment of risk",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "a1-2",
          number: 2,
          text: "Carry out safe isolation in the correct sequence",
          knowledge: "adequate",
          experience: "extensive",
        },
      ],
    },
    {
      id: "section-a2a5-page-1",
      title: "Sections A2-A5: Composite Installation",
      duration: "8.5 hours",
      subtitle:
        "This section has areas where candidates will need to demonstrate occupational competence in accordance with statutory and non-statutory regulations and approved industry working practices.",
      items: [
        {
          id: "a2-1",
          number: 1,
          text: "Interpretation of specifications and technical data",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "a2-2",
          number: 2,
          text: "Selection of protective devices",
          knowledge: "adequate",
          experience: "limited",
        },
        {
          id: "a2-3",
          number: 3,
          text: "Install protective equipotential bonding",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "a2-4",
          number: 4,
          text: "Install and terminate PVC singles cable",
          knowledge: "extensive",
          experience: "adequate",
        },
        {
          id: "a2-5",
          number: 5,
          text: "Install and terminate PVC/PVC multi-core & cpc cable",
          knowledge: "adequate",
          experience: "extensive",
        },
        {
          id: "a2-6",
          number: 6,
          text: "Install and terminate SY multi-flex cable",
          knowledge: "limited",
          experience: "adequate",
        },
        {
          id: "a2-7",
          number: 7,
          text: "Install and terminate heat-resistant flex",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "a2-8",
          number: 8,
          text: "Install and terminate XLPE SWA",
          knowledge: "adequate",
          experience: "limited",
        },
        {
          id: "a2-9",
          number: 9,
          text: "Install and terminate data-cable",
          knowledge: "unsure",
          experience: "limited",
        },
        {
          id: "a2-10",
          number: 10,
          text: "Install and terminate FP200 type cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "a2-11",
          number: 11,
          text: "Protective devices in a TP&N distribution board",
          knowledge: "extensive",
          experience: "adequate",
        },
      ],
    },
    {
      id: "section-a2a5-page-2",
      title: "Sections A2-A5: Composite Installation (8.5 hours) - continued",
      items: [
        {
          id: "a2-12",
          number: 12,
          text: "Install a two-way and intermediate lighting circuit in PVC/PVC multi-core cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "a2-13",
          number: 13,
          text: "Install a BS 1363 13A socket outlet ring circuit in PVC singles cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "a2-14",
          number: 14,
          text: "Install a carbon monoxide detector safety service circuit in FP200 type cable",
          knowledge: "adequate",
          experience: "limited",
        },
        {
          id: "a2-15",
          number: 15,
          text: "Install data outlets circuit in Cat. 5 cable",
          knowledge: "adequate",
          experience: "limited",
        },
        {
          id: "a2-16",
          number: 16,
          text: "Install a BS EN 60309 16A T P & N socket outlet in XLPE SWA cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "a2-17",
          number: 17,
          text: "Install protective equipotential bonding to gas and water services",
          knowledge: "extensive",
          experience: "adequate",
        },
        {
          id: "a2-18",
          number: 18,
          text: "Connect a 3-phase direct on line motor circuit in SY cable",
          knowledge: "adequate",
          experience: "unsure",
        },
        {
          id: "a2-19",
          number: 19,
          text: "Install an S Plan central heating and hot water system with a solar thermal sustainable energy element utilising heat resistant flexible cable and PVC singles cable",
          knowledge: "limited",
          experience: "unsure",
        },
      ],
    },
    {
      id: "section-b",
      title: "Section B: Inspection, Testing and Certification",
      duration: "3.5 hours",
      subtitle:
        "In this area candidates will be expected to follow practices and procedures that take into account electrically sensitive equipment. To demonstrate occupational competence candidates will be expected to:",
      items: [
        {
          id: "b-1",
          number: 1,
          text: "Work according to best practice as required by Health and Safety legislation",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "b-2",
          number: 2,
          text: "Ensure the installation is correctly isolated before commencing the inspection and test activity",
          knowledge: "adequate",
          experience: "extensive",
        },
        {
          id: "b-3",
          number: 3,
          text: "Carry out a visual inspection of the installation in accordance with BS 7671 and IET Guidance Note 3",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "b-4",
          number: 4,
          text: "Continuity of protective conductors",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "b-5",
          number: 5,
          text: "Continuity of ring final circuit conductors",
          knowledge: "adequate",
          experience: "limited",
        },
        {
          id: "b-6",
          number: 6,
          text: "Insulation resistance",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "b-7",
          number: 7,
          text: "Polarity",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "b-8",
          number: 8,
          text: "Earth fault-loop impedance (EFLI)",
          knowledge: "limited",
          experience: "adequate",
        },
        {
          id: "b-9",
          number: 9,
          text: "Prospective fault current (PFC)",
          knowledge: "limited",
          experience: "adequate",
        },
        {
          id: "b-10",
          number: 10,
          text: "Check for phase sequence and phase rotation",
          knowledge: "adequate",
          experience: "unsure",
        },
        {
          id: "b-11",
          number: 11,
          text: "Functional testing",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "b-12",
          number: 12,
          text: "Verify that the test results obtained conform to the values required by BS 7671 and IET Guidance Note 3",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "b-13",
          number: 13,
          text: "Complete an electrical installation certificate, schedule of inspections and schedule of test results using the model forms as illustrated in Appendix 6 of BS 7671",
          knowledge: "adequate",
          experience: "limited",
        },
      ],
    },
    {
      id: "section-cd",
      sections: [
        {
          id: "section-c",
          title: "Section C: Safe Isolation of Circuits",
          duration: "30 mins",
          subtitle:
            "To demonstrate occupational competence candidates will be expected to:",
          items: [
            {
              id: "c-1",
              number: 1,
              text: "Carry out safe isolation in the correct sequence on a single-phase circuit",
              knowledge: "adequate",
              experience: "adequate",
            },
            {
              id: "c-2",
              number: 2,
              text: "Carry out safe isolation in the correct sequence on a three-phase circuit",
              knowledge: "adequate",
              experience: "adequate",
            },
            {
              id: "c-3",
              number: 3,
              text: "Carry out safe isolation in the correct sequence on a three-phase installation",
              knowledge: "adequate",
              experience: "extensive",
            },
          ],
        },
        {
          id: "section-d",
          title: "Section D: Fault Diagnosis and Rectification",
          duration: "2 hours",
          subtitle:
            "To demonstrate occupational competence candidates will be expected to:",
          items: [
            {
              id: "d-1",
              number: 1,
              text: "Work according to best practice as required by Health and Safety legislation",
              knowledge: "adequate",
              experience: "adequate",
            },
            {
              id: "d-2",
              number: 2,
              text: "Correctly identify and use tools, equipment and test instruments that are fit for purpose",
              knowledge: "adequate",
              experience: "adequate",
            },
            {
              id: "d-3",
              number: 3,
              text: "Carry out checks and preparations that must be completed prior to undertaking fault diagnosis",
              knowledge: "adequate",
              experience: "limited",
            },
            {
              id: "d-4",
              number: 4,
              text: "Identify faults from fault symptom information given by the assessor",
              knowledge: "adequate",
              experience: "unsure",
            },
            {
              id: "d-5",
              number: 5,
              text: "State and record how the identified faults can be rectified",
              knowledge: "adequate",
              experience: "adequate",
            },
          ],
        },
      ],
    },
    {
      id: "section-e",
      title: "Section E: Assessment of Applied Knowledge",
      duration: "1 hour",
      subtitle:
        "This assessment will last for one hour and be in the form of a computerised multiple-choice test. Candidates will be expected to answer 30 questions and will be assessed on their application of knowledge associated with:",
      items: [
        {
          id: "e-1",
          number: 1,
          text: "Health and Safety",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "e-2",
          number: 2,
          text: "BS 7671: Requirements for Electrical Installations",
          knowledge: "adequate",
          experience: "limited",
        },
        {
          id: "e-3",
          number: 3,
          text: "Building Regulations",
          knowledge: "adequate",
          experience: "limited",
        },
        {
          id: "e-4",
          number: 4,
          text: "Inspection, Testing and Fault Finding",
          knowledge: "adequate",
          experience: "adequate",
        },
      ],
    },
  ],
  declarationPages: [
    {
      id: "declaration-training-candidate",
      banner: {
        title: "Important:",
        body: "All learners must take an independent assessment at the end of their training to confirm that they have achieved occupational competence. This is a formal declaration to confirm readiness of the learner for assessment. It must only be completed when each person signing is fully satisfied that all requirements are complied with. AM2 should be taken as the final unit within the NVQ, after all other units have been completed",
      },
      dateField: "Date candidate was registered on the NVQ:",
      sections: [
        {
          title: "Training Provider Declaration of Readiness for Assessment",
          paragraphs: [
            "As the candidate's training provider, I formally confirm that they have completed and achieved all other units within the qualification. In my opinion the candidate is able to consistently demonstrate a minimum of \"adequate\" in each of these areas set out in the checklist and and no further training or experience in any area is required.",
          ],
          emphasis:
            "By signing below, I formally confirm that the candidate is ready for assessment.",
          signatureFields: [
            "Training Provider Signature:",
            "Print Name:",
            "Date:",
          ],
          signatureNote:
            "NET will only accept dated signatures within 6 months of the gateway application.",
        },
        {
          title: "Candidate Declaration of Readiness for Assessment",
          paragraphs: [
            "As the candidate, I formally confirm that I believe I am consistently demonstrating a minimum of \"adequate\" in every area of Knowledge and Skill detailed in this checklist and that I do not require additional training or experience in any area to become occupationally competent.",
            "I understand that if I am undertaking the Level 3 NVQ (2357/1604/1605), the AM2 is designed to be the final unit of this qualification. I confirm that I have not been asked to take the AM2 before I have completed all the other units as it is unlikely I will have the sufficient skills, knowledge and experience to successfully complete the assessment.",
          ],
          emphasis:
            "By signing below, I formally confirm that I am ready for assessment.",
          signatureFields: [
            "Candidate Signature:",
            "Print Name:",
            "Date:",
          ],
          signatureNote:
            "NET will only accept dated signatures within 6 months of the gateway application.",
        },
      ],
    },
    {
      id: "declaration-employer-submission",
      banner: {
        title: "Important:",
        body: "All learners must take an independent assessment at the end of their training to confirm that they have achieved occupational competence. This is a formal declaration to confirm readiness of the learner for assessment. It must only be completed when each person signing is fully satisfied that all requirements are complied with. AM2 should be taken as the final unit within the NVQ, after all other units have been completed",
      },
      sections: [
        {
          title: "ECS Gold Card information",
          paragraphs: [
            "Please note: If you plan to make an ECS Gold Card application, before taking the AM2 you should check whether your current technical qualifications meet the requirements for an ECS card - visit the ECS website for more information https://www.ecscard.org.uk/card-types/Electrotechnical/Installation-Electrician",
          ],
        },
        {
          title: "Employer Declaration of Readiness for Assessment",
          paragraphs: [
            "As the candidate's employer, I am fully satisfied that they are consistently demonstrating a minimum of \"adequate\" in every area of Knowledge and Skill detailed in this checklist. No further learning or experience in any area is required. I confirm that all other units within the qualification have been achieved.",
          ],
          emphasis:
            "By signing below, I formally confirm that my candidate is ready for assessment.",
          signatureFields: [
            "Employer Signature:",
            "Print Name:",
            "Date:",
          ],
          signatureNote:
            "NET will only accept dated signatures within 6 months of the gateway application.",
        },
      ],
      submission: {
        title: "Submitting this Checklist",
        paragraphs: [
          "Once you have completed and signed the checklist please submit it to your chosen assessment centre for gateway approval. Checklists sent to the NET head office will not be reviewed and will be destroyed in line with our data protection and privacy policy.",
          "Please ensure the whole document is submitted. Documents with missing pages will not be accepted.",
        ],
      },
      privacyNotice: {
        title: "PRIVACY NOTICE:",
        body: "NET and the Assessment Centre you attend are both Data Controllers for the purposes of Data Protection Law. Where applicable they will jointly hold your rights. Information that you include in this form is necessary for the completion of your assessment and will only be shared between the Controllers for this purpose or their professional or legal obligations. In accordance with our terms and conditions, all units of the assessment must be completed within 24 months of commencement. We are required to retain a photograph of you to enable the verification of your identity. Specifically, photographs are retained for either 6 months after you pass the assessment, or 6 months after the 24 month period has expired. Other data is kept in accordance with our data retention policy. For full details of NET's policy on Data Protection please visit www.netservices.org.uk or be viewed at your assigned Assessment Centre.",
      },
    },
  ],
};

const am2eFullChecklistData = {
  templateId: "net-am2e-full-candidate-checklist",
  documentMeta: {
    title: "AM2E Full Checklist",
    previewLabel: "AM2E Full Checklist Preview",
    footerCode: "AM2E Full Checklist",
    footerDate: "03.26",
  },
  cover: {
    titleLines: [
      "Readiness for",
      "Assessment:",
      "Candidate",
      "Self-Assessment",
      "Checklist",
    ],
    examCode: "AM2E",
    examAudience: "Full Checklist",
    examQualification: "(for those who don't already hold AM2)",
    completionNotice:
      "To be completed by candidate and if applicable the employer and training provider/certificate issuer",
    slogan: "By the industry, for the industry",
  },
  candidate: {
    name: "Harvey Collins",
    niNumber: "QQ 12 34 56 C",
    uln: "1234567890",
  },
  infoPage: {
    notice: {
      paragraphs: [
        "This checklist should only be completed if you have not already passed the AM2 in the past and you need to complete the full AM2E assessment.",
        "If you have already passed the AM2 previously, you will need to complete the AM2E Supplementary Unit Checklist.",
      ],
    },
    heading: "Important Information",
    paragraphs: [
      "Completing this checklist is a compulsory part of the AM2E gateway process. It helps all parties to thoroughly review whether an individual has the required knowledge and experience to undertake the test. If gaps are identified, additional training or experience is recommended.",
      "The checklist should be completed by the candidate, with input from their employer (or other nominated person) and training provider. If you are self-employed, you may wish to get the confirmatory signature from someone else who can confirm your work, such as a colleague you've worked with or an assessor if you belong to a Competent Persons Scheme.",
      "Bear in mind that you are unlikely to be sufficiently prepared to pass the assessment if you cannot confidently tick at least \"Adequate\" for every statement in terms of both Knowledge and Practical Experience.",
      "The AM2E Assessment is designed for those who wish to practise either as an installation electrician, or as a maintenance electrician. It demonstrates they have the level of competence expected by the industry in the following key occupational areas:",
      "In accordance with the installation specification and the relevant statutory and non-statutory regulations, candidates will be expected to install, terminate, connect, inspect, test and commission:",
      "The assessment covers the following sections:",
    ],
    bulletGroups: [
      {
        title: "competence",
        items: [
          "Risk assessments and health and safety",
          "Safe isolation",
          "The interpretation of specifications, drawings and diagrams",
          "Planning and preparing to install, terminate and connect identified wiring systems",
          "Installing, terminating and connecting identified wiring systems",
          "Inspection, testing and certification",
          "Fault diagnosis and correction of electrical faults",
          "The understanding and application of industry recognised procedures, working practices and the requirements of statutory and non-statutory regulations.",
        ],
      },
      {
        title: "installations",
        items: [
          "A three-phase distribution board and sub-circuit",
          "A three-phase Direct-on-Line Motor circuit",
          "Single phase lighting and power circuits",
          "A central heating/sustainable energy system",
          "A safety services circuit and device",
          "A data-cabling system.",
        ],
      },
    ],
    sectionSummary: [
      { code: "Section A1:", label: "Safe Isolation and Risk Assessment" },
      { code: "Sections A2-A6:", label: "Composite Installation" },
      { code: "Section B:", label: "Inspection, Testing and Certification" },
      { code: "Section C:", label: "Safe Isolation of Circuits" },
      { code: "Section D:", label: "Fault Diagnosis and Rectification" },
      { code: "Section E:", label: "Assessment of Applied Knowledge" },
    ],
    usageHeading: "Using this Checklist",
    usageParagraphs: [
      "Please work through Sections A to E in this document and tick the boxes that best suit the candidate's knowledge and experience in each area. Remember that you are unlikely to be sufficiently prepared to pass the assessment if you cannot confidently tick at least \"Adequate\" for every statement in terms of both Knowledge and Practical Experience.",
      "If there are areas of concern, an action plan should be produced to help the candidate achieve the required standard before submitting the gateway application.",
      "The completed, signed document is a compulsory gateway check to confirm readiness for assessment before the assessment can be booked. It must be submitted to NET as part of the Request for Assessment.",
    ],
  },
  sectionPages: [
    {
      id: "am2e-section-a1",
      title: "Section A1: Safe Isolation and Risk Assessment",
      duration: "45 mins",
      subtitle:
        "To demonstrate occupational competence candidates will be expected to:",
      items: [
        {
          id: "am2e-a1-1",
          number: 1,
          text: "Carry out and document an assessment of risk",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a1-2",
          number: 2,
          text: "Carry out safe isolation in the correct sequence",
          knowledge: "adequate",
          experience: "adequate",
        },
      ],
    },
    {
      id: "am2e-section-a2a6-page-1",
      title: "Sections A2-A6: Composite Installation",
      duration: "10 hours",
      subtitle:
        "This section has areas where candidates will need to demonstrate occupational competence in accordance with statutory and non-statutory regulations and approved industry working practices.",
      items: [
        {
          id: "am2e-a2-1",
          number: 1,
          text: "Interpretation of specifications and technical data",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-2",
          number: 2,
          text: "Selection of protective devices",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-3",
          number: 3,
          text: "Install protective equipotential bonding",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-4",
          number: 4,
          text: "Install and terminate PVC singles cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-5",
          number: 5,
          text: "Install and terminate PVC/PVC multi-core & cpc cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-6",
          number: 6,
          text: "Install and terminate SY multi-flex cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-7",
          number: 7,
          text: "Install and terminate heat-resistant flex",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-8",
          number: 8,
          text: "Install and terminate XLPE SWA",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-9",
          number: 9,
          text: "Install and terminate data-cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-10",
          number: 10,
          text: "Install and terminate FP200 type cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-11",
          number: 11,
          text: "Forming and install 20mm metal conduit",
          knowledge: "adequate",
          experience: "adequate",
        },
      ],
    },
    {
      id: "am2e-section-a2a6-page-2",
      title: "Sections A2-A6: Composite Installation (10 hours) - continued",
      items: [
        {
          id: "am2e-a2-12",
          number: 12,
          text: "Forming and installing 20mm PVC conduit",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-13",
          number: 13,
          text: "Install protective devices in a TP&N distribution board",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-14",
          number: 14,
          text: "Install a two-way and intermediate lighting circuit in PVC/PVC multi-core cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-15",
          number: 15,
          text: "Install a BS 1363 13A socket outlet ring circuit in PVC singles cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-16",
          number: 16,
          text: "Install a carbon monoxide detector safety service circuit in FP200 type cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-17",
          number: 17,
          text: "Install data outlets circuit in Cat. 5 cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-18",
          number: 18,
          text: "Install a BS EN 60309 16A T P & N socket outlet in XLPE SWA cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-19",
          number: 19,
          text: "Install protective equipotential bonding to gas and water services",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-20",
          number: 20,
          text: "Connect a 3-phase direct on line motor circuit in SY cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-a2-21",
          number: 21,
          text: "Install an S Plan central heating and hot water system with a solar thermal sustainable energy element utilising heat resistant flexible cable and PVC singles cable",
          knowledge: "adequate",
          experience: "adequate",
        },
      ],
    },
    {
      id: "am2e-section-b",
      title: "Section B: Inspection, Testing and Certification",
      duration: "3.5 hours",
      subtitle:
        "In this area candidates will be expected to follow practices and procedures that take into account electrically sensitive equipment. To demonstrate occupational competence, candidates will be expected to:",
      items: [
        {
          id: "am2e-b-1",
          number: 1,
          text: "Work according to best practice as required by Health and Safety legislation",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-b-2",
          number: 2,
          text: "Ensure the installation is correctly isolated before commencing the inspection and test activity",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-b-3",
          number: 3,
          text: "Carry out a visual inspection of the installation in accordance with BS 7671 and IET Guidance Note 3",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-b-4",
          number: 1,
          text: "Continuity of protective conductors",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-b-5",
          number: 2,
          text: "Continuity of ring final circuit conductors",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-b-6",
          number: 3,
          text: "Insulation resistance",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-b-7",
          number: 4,
          text: "Polarity",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-b-8",
          number: 5,
          text: "Earth fault-loop impedance (EFLI)",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-b-9",
          number: 6,
          text: "Prospective fault current (PFC)",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-b-10",
          number: 7,
          text: "Check for phase sequence and phase rotation",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-b-11",
          number: 8,
          text: "Functional testing",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-b-12",
          number: "",
          text: "Verify that the test results obtained conform to the values required by BS 7671 and IET Guidance Note 3",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-b-13",
          number: "",
          text: "Complete an electrical installation certificate, schedule of inspections and schedule of test results using the model forms as illustrated in Appendix 6 of BS 7671",
          knowledge: "adequate",
          experience: "adequate",
        },
      ],
    },
    {
      id: "am2e-section-cd",
      sections: [
        {
          id: "am2e-section-c",
          title: "Section C: Safe Isolation of Circuits",
          duration: "30 mins",
          subtitle:
            "To demonstrate occupational competence candidates will be expected to:",
          items: [
            {
              id: "am2e-c-1",
              number: "",
              text: "Carry out safe isolation in the correct sequence on a single-phase circuit",
              knowledge: "adequate",
              experience: "adequate",
            },
            {
              id: "am2e-c-2",
              number: "",
              text: "Carry out safe isolation in the correct sequence on a three-phase circuit",
              knowledge: "adequate",
              experience: "adequate",
            },
            {
              id: "am2e-c-3",
              number: "",
              text: "Carry out safe isolation in the correct sequence on a three-phase installation",
              knowledge: "adequate",
              experience: "adequate",
            },
          ],
        },
        {
          id: "am2e-section-d",
          title: "Section D: Fault Diagnosis and Rectification",
          duration: "2 hours",
          subtitle:
            "To demonstrate occupational competence candidates will be expected to:",
          items: [
            {
              id: "am2e-d-1",
              number: "",
              text: "Work according to best practice as required by Health and Safety legislation",
              knowledge: "adequate",
              experience: "adequate",
            },
            {
              id: "am2e-d-2",
              number: "",
              text: "Correctly identify and use tools, equipment and test instruments that are fit for purpose",
              knowledge: "adequate",
              experience: "adequate",
            },
            {
              id: "am2e-d-3",
              number: "",
              text: "Carry out checks and preparations that must be completed prior to undertaking fault diagnosis",
              knowledge: "adequate",
              experience: "adequate",
            },
            {
              id: "am2e-d-4",
              number: "",
              text: "Identify faults from 'fault symptom' information given by the assessor",
              knowledge: "adequate",
              experience: "adequate",
            },
            {
              id: "am2e-d-5",
              number: "",
              text: "State and record how the identified faults can be rectified",
              knowledge: "adequate",
              experience: "adequate",
            },
          ],
        },
      ],
    },
    {
      id: "am2e-section-e",
      title: "Section E: Assessment of Applied Knowledge",
      duration: "1 hour",
      subtitle:
        "This assessment will last for one hour and be in the form of a computerised multiple-choice test. Candidates will be expected to answer 30 questions and will be assessed on their application of knowledge associated with:",
      items: [
        {
          id: "am2e-e-1",
          number: "",
          text: "Health and Safety",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-e-2",
          number: "",
          text: "BS 7671: Requirements for Electrical Installations",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-e-3",
          number: "",
          text: "Building Regulations",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2e-e-4",
          number: "",
          text: "Inspection, Testing and Fault Finding",
          knowledge: "adequate",
          experience: "adequate",
        },
      ],
    },
  ],
  declarationPages: [
    {
      id: "am2e-declaration-candidate-training",
      sections: [
        {
          title: "Candidate Declaration of Readiness for Assessment",
          paragraphs: [
            "As the candidate, I formally confirm that I believe I am consistently demonstrating a minimum of \"adequate\" in every area of Knowledge and Skill detailed in this checklist and that I do not require additional training or experience in any area to become occupationally competent.",
          ],
          emphasis:
            "By signing below, I formally confirm that I am ready to undertake the AM2E Assessment.",
          signatureFields: [
            "Candidate Signature:",
            "Print Name:",
            "Date:",
          ],
          signatureNote:
            "NET will only accept dated signatures within 6 months of the gateway application.",
        },
        {
          title: "Training Provider Declaration of Readiness for Assessment (if applicable)",
          paragraphs: [
            "As the candidate's training provider, I formally confirm that the candidate has the full range of Knowledge and Skills specified within this checklist. In my opinion the candidate is able to consistently demonstrate a minimum of \"adequate\" in each of these areas and no further training or experience in any area is required. I confirm that all specified qualifications have been achieved and certificates submitted before assessment.",
          ],
          emphasis:
            "By signing below, I formally confirm that the candidate is ready to undertake the AM2E Assessment.",
          signatureFields: [
            "Training Provider Signature:",
            "Print Name:",
            "Date:",
          ],
          signatureNote:
            "NET will only accept dated signatures within 6 months of the gateway application.",
        },
      ],
    },
    {
      id: "am2e-declaration-employer-submission",
      sections: [
        {
          title: "Employer / Nominated Person Declaration of Readiness for Assessment (if applicable)",
          paragraphs: [
            "As the candidate's employer or nominated person, I am fully satisfied that they are consistently demonstrating a minimum of \"adequate\" in every area of Knowledge and Skill detailed in this checklist and is therefore occupationally competent. No further learning or experience in any area is required.",
          ],
          emphasis:
            "By signing below, I formally confirm that the candidate is ready to undertake the AM2E Assessment.",
          signatureFields: [
            "Signature:",
            "Print Name:",
            "Date:",
            "Position:",
            "Company:",
          ],
          signatureNote:
            "NET will only accept dated signatures within 6 months of the gateway application.",
        },
      ],
      submission: {
        title: "Submitting this Checklist",
        paragraphs: [
          "Once you have completed and signed the checklist please submit it to your chosen assessment centre for gateway approval. Checklists sent to the NET head office will not be reviewed and will be destroyed in line with our data protection and privacy policy.",
          "Please ensure the whole document is submitted. Documents with missing pages will not be accepted.",
        ],
      },
      privacyNotice: {
        title: "PRIVACY NOTICE:",
        body: "NET and the Assessment Centre you attend are both Data Controllers for the purposes of Data Protection Law. Where applicable they will jointly uphold your rights. Information that you include in this form is necessary for the completion of your assessment and will only be shared between the Controllers for this purpose or for legal obligations. In accordance with our terms and conditions, all units of the assessment must be completed within 24 months of commencement. We are required to retain a photograph of you to enable the verification of your identity. Specifically, photographs are retained for either 6 months after you pass the assessment, or 6 months after the 24 month period has expired. Other data is kept in accordance with our data retention policy.",
      },
    },
  ],
};

const am2eV1ChecklistData = {
  templateId: "am2e-v1-checklist",
  documentMeta: {
    title: "AM2E v1 Full Checklist",
    previewLabel: "AM2E v1 Checklist Preview",
    footerCode: "AM2E v1 Full Checklist",
    footerDate: "02.25",
  },
  cover: {
    titleLines: [
      "Readiness for",
      "Assessment:",
      "Candidate",
      "Self-Assessment",
      "Checklist",
    ],
    examCode: "AM2E v1",
    examAudience: "Full Checklist",
    examQualification: "(for those who don't already hold AM2)",
    completionNotice:
      "To be completed by candidate, training provider and employer/nominated person",
    slogan: "By the industry, for the industry",
  },
  candidate: {
    name: "Harvey Collins",
    niNumber: "QQ 12 34 56 C",
    uln: "1234567890",
  },
  infoPage: {
    notice: {
      paragraphs: [
        "This checklist should only be completed if you have not already passed the AM2 in the past and you need to complete the full AM2E v1 assessment. The AM2E v1 is applicable to all those registered on the Experienced Worker Assessment qualification after 4th September 2023.",
        "If you have already passed the AM2 previously, you will need to complete the AM2E Supplementary Unit Checklist.",
      ],
    },
    heading: "Important Information",
    paragraphs: [
      "Completing this checklist is a compulsory part of the AM2E v1 gateway process. It helps all parties to thoroughly review whether an individual has the required knowledge and experience to undertake the test. If gaps are identified, additional training or experience is recommended.",
      "The checklist should be completed by the candidate, with input from their employer (or other nominated person) and training provider. If you are self employed, you may wish to get the confirmatory signature from someone else who can confirm your work, such as a colleague you've worked with or an assessor if you belong to a Competent Persons Scheme.",
      "Bear in mind that you are unlikely to be sufficiently prepared to pass the assessment if you cannot confidently tick at least \"Adequate\" for every statement in terms of both Knowledge and Practical Experience.",
      "The AM2E v1 Assessment has been revised from the original AM2E to align with the new apprenticeship standards assessment, with additional circuits and knowledge requirements added. The assessment has been designed for those who wish to practise either as an installation electrician, or as a maintenance electrician. It demonstrates they have the level of competence expected by the industry in the following key occupational areas:",
      "In accordance with the installation specification and the relevant statutory and non-statutory regulations, candidates will be expected to install, terminate, connect, inspect, test and commission:",
      "The assessment covers the following sections:",
    ],
    bulletGroups: [
      {
        title: "competence",
        items: [
          "Risk assessments and health and safety",
          "Safe isolation",
          "The interpretation of specifications, drawings and diagrams",
          "Planning and preparing to install, terminate and connect identified wiring systems",
          "Installing, terminating and connecting identified wiring systems",
          "Inspection, testing and certification",
          "Fault diagnosis and correction of electrical faults",
          "The understanding and application of industry recognised procedures, working practices and the requirements of statutory and non-statutory regulations.",
        ],
      },
      {
        title: "installations",
        items: [
          "A three-phase distribution board and sub-circuit",
          "A three-phase Direct-on-Line Motor circuit with remote start and stop",
          "A three phase Electric Vehicle charging supply",
          "Single phase lighting and power circuits including emergency lighting",
          "A central heating/sustainable energy system",
          "A safety services circuit and device",
          "A data-cabling system.",
        ],
      },
    ],
    sectionSummary: [
      { code: "Section A1:", label: "Safe Isolation and Risk Assessment" },
      { code: "Sections A2-A6:", label: "Composite Installation" },
      { code: "Section B:", label: "Inspection, Testing and Certification" },
      { code: "Section C:", label: "Safe Isolation of Circuits" },
      { code: "Section D:", label: "Fault Diagnosis and Rectification" },
      { code: "Section E:", label: "Assessment of Applied Knowledge" },
    ],
    usageHeading: "Using this Checklist",
    usageParagraphs: [
      "Please work through Sections A to E in this document and tick the boxes that best suit the candidate's knowledge and experience in each area. Remember that you are unlikely to be sufficiently prepared to pass the assessment if you cannot confidently tick at least \"Adequate\" for every statement in terms of both Knowledge and Practical Experience.",
      "If there are areas of concern, an action plan should be produced to help the candidate achieve the required standard before submitting the gateway application.",
      "The completed, signed document is a compulsory gateway check to confirm readiness for assessment before the assessment can be booked. It must be submitted to NET as part of the Request for Assessment.",
    ],
  },
  sectionPages: [
    {
      id: "am2ev1-section-a1",
      title: "Section A1: Safe Isolation and Risk Assessment",
      duration: "45 mins",
      subtitle:
        "To demonstrate occupational competence candidates will be expected to:",
      items: [
        {
          id: "am2ev1-a1-1",
          number: 1,
          text: "Carry out and document an assessment of risk",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a1-2",
          number: 2,
          text: "Carry out safe isolation in the correct sequence considering any separate energy systems",
          knowledge: "adequate",
          experience: "adequate",
        },
      ],
    },
    {
      id: "am2ev1-section-a2a6-page-1",
      title: "Sections A2-A6: Composite Installation",
      duration: "10.5 hours",
      subtitle:
        "This section has areas where candidates will need to demonstrate occupational competence in accordance with statutory and non-statutory regulations and approved industry working practices.",
      items: [
        {
          id: "am2ev1-a2-1",
          number: 1,
          text: "Interpretation of specifications and technical data",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-2",
          number: 2,
          text: "Selection of protective devices, single pole and triple pole",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-3",
          number: 3,
          text: "Install protective equipotential bonding",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-4",
          number: 4,
          text: "Install and terminate PVC singles cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-5",
          number: 5,
          text: "Install and terminate PVC/PVC multi-core & cpc cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-6",
          number: 6,
          text: "Install and terminate SY multi-flex cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-7",
          number: 7,
          text: "Install and terminate heat-resistant flex",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-8",
          number: 8,
          text: "Install and terminate XLPE SWA",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-9",
          number: 9,
          text: "Install and terminate data-cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-10",
          number: 10,
          text: "Install and terminate FP200 type cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-11",
          number: 11,
          text: "Form and install metal conduit systems",
          knowledge: "adequate",
          experience: "adequate",
        },
      ],
    },
    {
      id: "am2ev1-section-a2a6-page-2",
      title: "Sections A2-A6: Composite Installation (10 hours) - continued",
      items: [
        {
          id: "am2ev1-a2-12",
          number: 12,
          text: "Form and install PVC conduit systems",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-13",
          number: 13,
          text: "Install protective devices in a TP&N distribution board",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-14",
          number: 14,
          text: "Install a two-way, intermediate and key switch for various lighting circuits in PVC/PVC multi-core cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-15",
          number: 15,
          text: "Install a BS 1363 13A socket outlet ring circuit using PVC singles cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-16",
          number: 16,
          text: "Install a carbon monoxide detector safety service circuit in FP200 type cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-17",
          number: 17,
          text: "Install data outlets circuit in Cat. 5 cable",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-18",
          number: 18,
          text: "Install a BS EN 60309 20A T P & N supply in XLPE SWA cable for electric vehicle pillar",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-19",
          number: 19,
          text: "Install protective equipotential bonding to gas and water services",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-20",
          number: 20,
          text: "Connect a 3-phase direct on line motor circuit in SY cable with remote start stop function using PVC singles",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-a2-21",
          number: 21,
          text: "Install an S Plan central heating and hot water system with a solar thermal sustainable energy element utilising heat resistant flexible cable and PVC singles cable",
          knowledge: "adequate",
          experience: "adequate",
        },
      ],
    },
    {
      id: "am2ev1-section-b",
      title: "Section B: Inspection, Testing and Certification",
      duration: "3.5 hours",
      subtitle:
        "In this area candidates will be expected to follow practices and procedures that take into account electrically sensitive equipment. To demonstrate occupational competence candidates will be expected to:",
      items: [
        {
          id: "am2ev1-b-1",
          number: "",
          text: "Work according to best practice as required by Health and Safety legislation",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-b-2",
          number: "",
          text: "Ensure the installation is correctly isolated before commencing the inspection and test activity taking into account any renewable sources",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-b-3",
          number: "",
          text: "Carry out a visual inspection of the installation in accordance with BS 7671 and IET Guidance Note 3",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-b-group-1",
          kind: "group",
          text: "Complete the following tests on the installation in accordance with BS 7671 and IET Guidance Note 3:",
        },
        {
          id: "am2ev1-b-4",
          number: 1,
          text: "Continuity of protective conductors",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-b-5",
          number: 2,
          text: "Continuity of ring final circuit conductors",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-b-6",
          number: 3,
          text: "Insulation resistance",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-b-7",
          number: 4,
          text: "Polarity",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-b-8",
          number: 5,
          text: "Earth fault-loop impedance (EFLI)",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-b-9",
          number: 6,
          text: "Prospective fault current (PFC)",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-b-10",
          number: 7,
          text: "Check for phase sequence and phase rotation",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-b-11",
          number: 8,
          text: "Functional testing",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-b-12",
          number: "",
          text: "Verify that the test results obtained conform to the values required by BS 7671 and IET Guidance Note 3",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-b-13",
          number: "",
          text: "Complete an electrical installation certificate, schedule of inspections and schedule of test results using the model forms as illustrated in Appendix 6 of BS 7671",
          knowledge: "adequate",
          experience: "adequate",
        },
      ],
    },
    {
      id: "am2ev1-section-cd",
      sections: [
        {
          id: "am2ev1-section-c",
          title: "Section C: Safe Isolation of Circuits",
          duration: "30 mins",
          subtitle:
            "To demonstrate occupational competence candidates will be expected to:",
          items: [
            {
              id: "am2ev1-c-1",
              number: "",
              text: "Carry out safe isolation in the correct sequence on a single-phase circuit",
              knowledge: "adequate",
              experience: "adequate",
            },
            {
              id: "am2ev1-c-2",
              number: "",
              text: "Carry out safe isolation in the correct sequence on a three-phase circuit",
              knowledge: "adequate",
              experience: "adequate",
            },
            {
              id: "am2ev1-c-3",
              number: "",
              text: "Carry out safe isolation in the correct sequence on a three-phase installation",
              knowledge: "adequate",
              experience: "adequate",
            },
          ],
        },
        {
          id: "am2ev1-section-d",
          title: "Section D: Fault Diagnosis and Rectification",
          duration: "2 hours",
          subtitle:
            "To demonstrate occupational competence candidates will be expected to:",
          items: [
            {
              id: "am2ev1-d-1",
              number: "",
              text: "Work according to best practice as required by Health and Safety legislation",
              knowledge: "adequate",
              experience: "adequate",
            },
            {
              id: "am2ev1-d-2",
              number: "",
              text: "Correctly select and use tools, equipment and test instruments.",
              knowledge: "adequate",
              experience: "adequate",
            },
            {
              id: "am2ev1-d-3",
              number: "",
              text: "Carry out checks and preparations that must be completed prior to undertaking fault diagnosis",
              knowledge: "adequate",
              experience: "adequate",
            },
            {
              id: "am2ev1-d-4",
              number: "",
              text: "Identify faults from 'fault symptom' information.",
              knowledge: "adequate",
              experience: "adequate",
            },
            {
              id: "am2ev1-d-5",
              number: "",
              text: "State and record how the identified faults can be rectified",
              knowledge: "adequate",
              experience: "adequate",
            },
          ],
        },
      ],
    },
    {
      id: "am2ev1-section-e",
      title: "Section E: Assessment of Applied Knowledge",
      duration: "1.5 hours",
      subtitle:
        "This assessment will last for 1.5 hours and be in the form of a computerised multiple-choice test. Candidates will be expected to answer over 40 questions and will be assessed on their application of knowledge associated with:",
      items: [
        {
          id: "am2ev1-e-1",
          number: "",
          text: "Health and Safety",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-e-2",
          number: "",
          text: "BS 7671: Requirements for Electrical Installations including any current amendments",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-e-3",
          number: "",
          text: "Building Regulations",
          knowledge: "adequate",
          experience: "adequate",
        },
        {
          id: "am2ev1-e-4",
          number: "",
          text: "Inspection, Testing and Fault Finding",
          knowledge: "adequate",
          experience: "adequate",
        },
      ],
    },
  ],
  declarationPages: [
    {
      id: "am2ev1-declaration-training-candidate",
      banner: {
        title: "Important:",
        body: "This is a formal declaration to confirm readiness of the candidate for assessment. It must only be completed when each person signing is fully satisfied that all requirements are complied with.",
      },
      sections: [
        {
          title: "Training Provider Declaration of Readiness for Assessment",
          paragraphs: [
            "As the candidate's training provider, I formally confirm that the candidate has the full range of Knowledge and Skills specified within this checklist. In my opinion the candidate is able to consistently demonstrate a minimum of \"adequate\" in each of these areas and no further training or experience in any area is required. I confirm that all specified qualifications have been achieved and certificates submitted before assessment.",
          ],
          emphasis:
            "By signing below, I formally confirm that the candidate is ready to undertake the AM2E v1 Assessment.",
          signatureFields: [
            "Training Provider Signature:",
            "Print Name:",
            "Date:",
          ],
          signatureNote:
            "NET will only accept dated signatures within 6 months of the gateway application.",
        },
        {
          title: "Candidate Declaration of Readiness for Assessment",
          paragraphs: [
            "As the candidate, I formally confirm that I believe I am consistently demonstrating a minimum of \"adequate\" in every area of Knowledge and Skill detailed in this checklist and that I do not require additional training or experience in any area to become occupationally competent.",
          ],
          emphasis:
            "By signing below, I formally confirm that I am ready to undertake the AM2E v1 Assessment.",
          signatureFields: [
            "Candidate Signature:",
            "Print Name:",
            "Date:",
          ],
          signatureNote:
            "NET will only accept dated signatures within 6 months of the gateway application.",
        },
      ],
    },
    {
      id: "am2ev1-declaration-employer-submission",
      banner: {
        title: "Important:",
        body: "This is a formal declaration to confirm readiness of the candidate for assessment. It must only be completed when each person signing is fully satisfied that all requirements are complied with.",
      },
      sections: [
        {
          title: "Employer / Nominated Person Declaration of Readiness for Assessment",
          paragraphs: [
            "As the candidate's employer or nominated person, I am fully satisfied that they are consistently demonstrating a minimum of \"adequate\" in every area of Knowledge and Skill detailed in this checklist and is therefore occupationally competent. No further learning or experience in any area is required.",
          ],
          emphasis:
            "By signing below, I formally confirm that the candidate is ready to undertake the AM2E v1 Assessment.",
          signatureFields: [
            "Signature:",
            "Print Name:",
            "Date:",
            "Position:",
            "Company:",
          ],
          signatureNote:
            "NET will only accept dated signatures within 6 months of the gateway application.",
        },
      ],
      submission: {
        title: "Submitting this Checklist",
        paragraphs: [
          "Once you have completed and signed the checklist please submit it to your chosen assessment centre for gateway approval. Checklists sent to the NET head office will not be reviewed and will be destroyed in line with our data protection and privacy policy.",
          "Please ensure the whole document is submitted. Documents with missing pages will not be accepted.",
        ],
      },
      privacyNotice: {
        title: "PRIVACY NOTICE:",
        body: "NET and the Assessment Centre you attend are both Data Controllers for the purposes of Data Protection Law. Where applicable they will jointly uphold your rights. Information that you include in this form is necessary for the completion of your assessment and will only be shared between the Controllers for this purpose or for legal obligations. In accordance with our terms and conditions, all units of the assessment must be completed within 24 months of commencement. We are required to retain a photograph of you to enable the verification of your identity. Specifically, photographs are retained for either 6 months after you pass the assessment, or 6 months after the 24 month period has expired. Other data is kept in accordance with our data retention policy.",
      },
    },
  ],
};

const templates = {
  "am2-checklist": am2ChecklistData,
  "am2e-v1-checklist": am2eV1ChecklistData,
  "net-am2e-full-candidate-checklist": am2eFullChecklistData,
};

export function getChecklistTemplateData(templateId = "am2-checklist") {
  return templates[templateId] || templates["am2-checklist"];
}

export function getMockChecklistData(templateId = "am2-checklist") {
  return getChecklistTemplateData(templateId);
}

export default am2ChecklistData;
