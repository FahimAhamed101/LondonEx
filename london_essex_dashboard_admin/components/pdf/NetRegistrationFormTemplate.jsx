import PdfPageWrapper from "@/components/pdf/PdfPageWrapper";

function NetBrandMark({ compact = false }) {
  return (
    <div
      className={`am2-pdf__net-brand${compact ? " am2-pdf__net-brand--compact" : ""}`}
    >
      <div className="am2-pdf__net-brand-mark">
        <span />
        <span />
        <span />
      </div>
      <div className="am2-pdf__net-brand-text">NET</div>
    </div>
  );
}

function FormBox({ className = "", checked = false, children }) {
  return (
    <span className={`am2-pdf__form-box ${className}${checked ? " am2-pdf__form-box--checked" : ""}`.trim()}>
      {checked ? "X" : children}
    </span>
  );
}

function FormLine({ className = "", value = "" }) {
  return (
    <span className={`am2-pdf__form-line ${className}${value ? " am2-pdf__form-line--filled" : ""}`.trim()}>
      {value}
    </span>
  );
}


function InlineField({ label, lineClassName = "", note, value = "" }) {
  return (
    <div className="am2-pdf__inline-field">
      <span className="am2-pdf__inline-label">
        {label}
        {note ? <em>{note}</em> : null}
      </span>
      <FormLine className={lineClassName} value={value} />
    </div>
  );
}

function SectionFrame({ title, note, children, outlined = false }) {
  return (
    <section
      className={`am2-pdf__reg-section${outlined ? " am2-pdf__reg-section--outlined" : ""}`}
    >
      <div className="am2-pdf__reg-section-heading">
        <strong>{title}</strong>
        {note ? <span>{note}</span> : null}
      </div>
      {children}
    </section>
  );
}

function AssessmentRow({ items, selectedValue }) {
  return (
    <div className="am2-pdf__assessment-row">
      {items.map((item) => (
        <div key={item} className="am2-pdf__assessment-item">
          <span>{item}</span>
          <FormBox checked={selectedValue === item} />
        </div>
      ))}
    </div>
  );
}

function RegistrationFooter({ documentMeta }) {
  return (
    <div className="am2-pdf__reg-footer">
      <span className="am2-pdf__reg-footer-slogan">{documentMeta.slogan}</span>
      <span>{documentMeta.footerCenter}</span>
      <span>{documentMeta.footerDate}</span>
    </div>
  );
}

function FormPageOne({ documentMeta, page, data }) {
  const personal = data?.personalDetails || {};
  const assessment = data?.assessmentDetails || {};
  
  // Helper to format DOB from YYYY-MM-DD to [D, D, M, M, YYYY]
  const dob = personal.dateOfBirth ? personal.dateOfBirth.split("-") : ["", "", ""];
  const dobDay = dob[2] || "";
  const dobMonth = dob[1] || "";
  const dobYear = dob[0] || "";

  return (
    <PdfPageWrapper
      pageClassName="am2-pdf__page--registration"
      hideFooter
    >
      <div className="am2-pdf__reg-page">
        <div className="am2-pdf__reg-header">
          <div>
            <h1 className="am2-pdf__reg-title">{page.title}</h1>
            <p className="am2-pdf__reg-copy">{page.intro}</p>
            <p className="am2-pdf__reg-copy am2-pdf__reg-copy--policy">
              {page.policyText} <strong>{page.policyLink}</strong>
            </p>
          </div>

          <NetBrandMark />
        </div>

        <SectionFrame
          title="Type of assessment"
          note="(Please tick)"
          outlined
        >
          <AssessmentRow items={page.assessmentRows[0]} selectedValue={assessment.assessmentType} />
          <AssessmentRow items={page.assessmentRows[1]} selectedValue={assessment.assessmentType} />
        </SectionFrame>

        <SectionFrame
          title="Candidate details"
          note="(Please complete all fields)"
        >
          <div className="am2-pdf__reg-grid am2-pdf__reg-grid--candidate-top">
            <InlineField label="Title" lineClassName="am2-pdf__line--short" value={personal.title} />
            <InlineField label="First Name" value={personal.firstName} />
          </div>

          <div className="am2-pdf__reg-row">
            <InlineField label="Last Name" value={personal.lastName} />
          </div>

          <div className="am2-pdf__reg-grid am2-pdf__reg-grid--candidate-meta">
            <div className="am2-pdf__dob-field">
              <span className="am2-pdf__inline-label">
                Date Of Birth
                <em>(DD / MM / YYYY)</em>
              </span>
              <div className="am2-pdf__dob-boxes">
                <FormBox value={dobDay[0]}>{dobDay[0]}</FormBox>
                <FormBox value={dobDay[1]}>{dobDay[1]}</FormBox>
                <span className="mx-0.5">/</span>
                <FormBox value={dobMonth[0]}>{dobMonth[0]}</FormBox>
                <FormBox value={dobMonth[1]}>{dobMonth[1]}</FormBox>
                <span className="mx-0.5">/</span>
                <FormBox className="am2-pdf__form-box--wide" value={dobYear}>{dobYear}</FormBox>
              </div>
            </div>

            <InlineField
              label="NI Number"
              note="(or PPS/Social Security number for candidates from Channel Islands/ROI)"
              value={personal.niNumber}
            />
          </div>

          <div className="am2-pdf__reg-grid am2-pdf__reg-grid--two-col">
            <InlineField label="Email" value={personal.email} />
            <InlineField label="Mobile Number" value={personal.mobileNumber} />
          </div>

          <div className="am2-pdf__reg-row">
            <InlineField label="Address 1" value={personal.address1} />
          </div>

          <div className="am2-pdf__reg-row">
            <InlineField label="Address 2" value={personal.address2} />
          </div>

          <div className="am2-pdf__reg-grid am2-pdf__reg-grid--town">
            <InlineField label="Town" value={personal.town} />
            <InlineField label="Postcode" value={personal.postcode} />
          </div>
        </SectionFrame>

        <SectionFrame title="Apprentice" note="(Please tick)">
          <div className="am2-pdf__reg-grid am2-pdf__reg-grid--apprentice">
            <div className="am2-pdf__choice-group">
              <div className="am2-pdf__choice-item">
                <span>Yes</span>
                <FormBox checked={assessment.isApprentice === true} />
              </div>
              <div className="am2-pdf__choice-item">
                <span>No</span>
                <FormBox checked={assessment.isApprentice === false} />
              </div>
            </div>

            <InlineField label="U.L.N." value={assessment.uln} />
          </div>

          <div className="am2-pdf__funding-block">
            <div className="am2-pdf__reg-section-heading am2-pdf__reg-section-heading--inner">
              <strong>Funding</strong>
              <span>(Please tick)</span>
            </div>

            <div className="am2-pdf__funding-grid">
              {page.fundingOptions.map((item) => (
                <div key={item.label} className="am2-pdf__funding-item">
                  <div>
                    <span>{item.label}</span>
                    {item.note ? <em>{item.note}</em> : null}
                  </div>
                  <FormBox checked={assessment.fundingMethod === item.label} />
                </div>
              ))}
            </div>
          </div>

          <div className="am2-pdf__awarding-block">
            <div className="am2-pdf__reg-section-heading am2-pdf__reg-section-heading--inner">
              <strong>Awarding Body</strong>
              <span>(Please tick)</span>
            </div>

            <div className="am2-pdf__awarding-row">
              {page.awardingOptions.map((item) => (
                <div key={item} className="am2-pdf__choice-item">
                  <span>{item}</span>
                  <FormBox checked={assessment.awardingBody === item} />
                </div>
              ))}
              <InlineField
                label="Other"
                note="(Please specify)"
                lineClassName="am2-pdf__line--medium"
                value={!page.awardingOptions.includes(assessment.awardingBody) ? assessment.awardingBody : ""}
              />
            </div>
          </div>

          <div className="am2-pdf__adjustment-row">
            <div className="am2-pdf__adjustment-question">
              <strong>Does the candidate require any reasonable adjustments?</strong>
              <span>(Please tick)</span>
            </div>

            <div className="am2-pdf__choice-group">
              <div className="am2-pdf__choice-item">
                <span>Yes</span>
                <FormBox checked={assessment.requiresAdjustments === true} />
              </div>
              <div className="am2-pdf__choice-item">
                <span>No</span>
                <FormBox checked={assessment.requiresAdjustments === false} />
              </div>
            </div>

            <p className="am2-pdf__adjustment-note">
              If Yes, the Reasonable Adjustments Request Form must be submitted and
              evidence provided. See the separate form and policy at{" "}
              <strong>www.netservices.org.uk/policies</strong>
            </p>
          </div>

          <div className="am2-pdf__rpl-row">
            <div className="am2-pdf__adjustment-question">
              <strong>Recognition of Prior Learning</strong>
              <span>(Please tick)</span>
            </div>

            <div className="am2-pdf__choice-group">
              <div className="am2-pdf__choice-item">
                <span>Yes</span>
                <FormBox checked={assessment.priorLearning === true} />
              </div>
              <div className="am2-pdf__choice-item">
                <span>No</span>
                <FormBox checked={assessment.priorLearning === false} />
              </div>
            </div>
          </div>
        </SectionFrame>

        <RegistrationFooter documentMeta={documentMeta} />
      </div>
    </PdfPageWrapper>
  );
}

function OrganizationBlock({ title, note, fields, finalNote, data }) {
  return (
    <SectionFrame title={title} note={note}>
      <div className="am2-pdf__reg-row">
        <InlineField label="Company Name" value={data?.companyName} />
      </div>

      <div className="am2-pdf__reg-row">
        <InlineField label="Email" value={data?.email} />
      </div>

      <div className="am2-pdf__reg-grid am2-pdf__reg-grid--two-col">
        <InlineField label="Contact Name" value={data?.contactName} />
        <InlineField label="Contact Number" value={data?.contactNumber} />
      </div>

      <div className="am2-pdf__reg-row">
        <InlineField label="Address 1" value={data?.address1} />
      </div>
      <div className="am2-pdf__reg-row">
        <InlineField label="Address 2" value={data?.address2} />
      </div>
      <div className="am2-pdf__reg-row">
        <InlineField label="Address 3" value={data?.address3} />
      </div>
      <div className="am2-pdf__reg-row">
        <InlineField label="Address 4" value={data?.address4} />
      </div>

      <div className="am2-pdf__reg-grid am2-pdf__reg-grid--town">
        <InlineField label="Town" value={data?.town} />
        <InlineField label="Postcode" value={data?.postcode} />
      </div>

      {finalNote ? (
        <div className="am2-pdf__reg-grid am2-pdf__reg-grid--employer-note">
          <p className="am2-pdf__employer-note">
            {finalNote.prefix} <strong>{finalNote.highlight}</strong>
          </p>
          <FormLine />
        </div>
      ) : null}
    </SectionFrame>
  );
}

function FormPageTwo({ documentMeta, page, data }) {
  return (
    <PdfPageWrapper
      pageClassName="am2-pdf__page--registration"
      hideFooter
    >
      <div className="am2-pdf__reg-page am2-pdf__reg-page--second">
        <OrganizationBlock
          title="Current Employer"
          note="(Please complete all fields)"
          fields={page.employerFields}
          finalNote={page.employerFinalNote}
          data={data?.employerDetails}
        />

        <OrganizationBlock
          title="Training Provider/Certificate Issuer"
          note={page.trainingProviderNote}
          fields={page.providerFields}
          data={data?.trainingProviderDetails}
        />

        <div className="am2-pdf__reg-privacy">
          <strong>{page.privacy.title}</strong> {page.privacy.body}
          <div className="mt-4 flex items-center gap-4">
            <strong>Privacy confirmation saved:</strong>
            <FormBox checked={data?.privacyConfirmation} />
          </div>
        </div>

        <RegistrationFooter documentMeta={documentMeta} />
      </div>
    </PdfPageWrapper>
  );
}

export default function NetRegistrationFormTemplate({ documentMeta, formPages, data }) {
  return (
    <main className="am2-pdf">
      <div className="am2-pdf__document">
        <FormPageOne documentMeta={documentMeta} page={formPages[0]} data={data} />
        <FormPageTwo documentMeta={documentMeta} page={formPages[1]} data={data} />
      </div>
    </main>
  );
}

