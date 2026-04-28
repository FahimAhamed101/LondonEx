import PdfPageWrapper from "@/components/pdf/PdfPageWrapper";

function ImportantBanner({ title, body }) {
  return (
    <div className="am2-pdf__important-banner">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function SignatureBox({ fields, note, values = {} }) {
  return (
    <div className="am2-pdf__signature-box">
      {fields.map((field) => (
        <div key={field} className="am2-pdf__signature-row">
          <span>{field}</span>
          <div className="am2-pdf__signature-content">
            {values[field] ? (
              <img 
                src={values[field]} 
                alt={field} 
                className="am2-pdf__signature-img"
                style={{ maxHeight: '40px', objectFit: 'contain' }}
              />
            ) : null}
          </div>
        </div>
      ))}

      {note ? <p className="am2-pdf__signature-note">{note}</p> : null}
    </div>
  );
}

function NetMiniLogo() {
  return (
    <div className="am2-pdf__mini-logo">
      <div className="am2-pdf__mini-logo-mark">
        <span />
        <span />
        <span />
      </div>
      <div className="am2-pdf__mini-logo-text">NET</div>
    </div>
  );
}

export default function DeclarationPage({
  page,
  pageNumber,
  footerCode,
  footerDate,
}) {
  return (
    <PdfPageWrapper
      pageNumber={pageNumber}
      footerCode={footerCode}
      footerDate={footerDate}
      pageClassName="am2-pdf__page--declaration"
    >
      {page.banner ? (
        <ImportantBanner title={page.banner.title} body={page.banner.body} />
      ) : null}

      {page.dateField ? (
        <div className="am2-pdf__date-field-box">
          <span>{page.dateField}</span>
        </div>
      ) : null}

      {page.sections.map((section) => (
        <section key={section.title} className="am2-pdf__declaration-section">
          <h2>{section.title}</h2>

          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {section.emphasis ? <strong>{section.emphasis}</strong> : null}

          {section.signatureFields ? (
            <SignatureBox
              fields={section.signatureFields}
              note={section.signatureNote}
              values={page.signatureValues || section.signatureValues || {}}
            />
          ) : null}
        </section>
      ))}

      {page.submission ? (
        <section className="am2-pdf__submission-section">
          <div>
            <h2>{page.submission.title}</h2>

            {page.submission.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <NetMiniLogo />
        </section>
      ) : null}

      {page.privacyNotice ? (
        <div className="am2-pdf__privacy-box">
          <strong>{page.privacyNotice.title}</strong>
          <p>{page.privacyNotice.body}</p>
        </div>
      ) : null}
    </PdfPageWrapper>
  );
}
