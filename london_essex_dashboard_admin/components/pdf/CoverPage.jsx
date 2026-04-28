import PdfPageWrapper from "@/components/pdf/PdfPageWrapper";

function ClipboardIllustration() {
  return (
    <div className="am2-pdf__clipboard">
      <div className="am2-pdf__clipboard-clip" />
      <div className="am2-pdf__clipboard-board">
        <div className="am2-pdf__clipboard-paper">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="am2-pdf__clipboard-list-row">
              <span className="am2-pdf__clipboard-check">&#10003;</span>
              <div className="am2-pdf__clipboard-lines">
                <span />
                <span />
                <span />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CoverPage({ documentMeta, cover, candidate }) {
  return (
    <PdfPageWrapper
      pageNumber={1}
      footerCode={documentMeta.footerCode}
      footerDate={documentMeta.footerDate}
      pageClassName="am2-pdf__page--cover"
    >
      <div className="am2-pdf__cover-hero">
        <ClipboardIllustration />

        <div className="am2-pdf__cover-panel">
          <div className="am2-pdf__cover-title-block">
            {cover.titleLines.map((line) => (
              <h1 key={line}>{line}</h1>
            ))}
          </div>

          <div className="am2-pdf__cover-divider" />

          <div className="am2-pdf__cover-exam">
            <strong>{cover.examCode}</strong>
            <p>{cover.examAudience}</p>
            <p>{cover.examQualification}</p>
          </div>

          <p className="am2-pdf__cover-note">{cover.completionNotice}</p>
        </div>
      </div>

      <div className="am2-pdf__cover-bottom">
        <div className="am2-pdf__cover-fields">
          {[
            ["Candidate Name:", candidate.name],
            ["NI Number*:", candidate.niNumber],
            ["Candidate ULN (Unique Learner Number):", candidate.uln],
          ].map(([label, value]) => (
            <div key={label} className="am2-pdf__cover-field">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}

          <p className="am2-pdf__cover-footnote">
            * or PPS/Social Security number for candidates from Channel Islands/ROI
          </p>
          <p className="am2-pdf__cover-slogan">{cover.slogan}</p>
        </div>

        <div className="am2-pdf__cover-logo">
          <div className="am2-pdf__cover-logo-mark">
            <span />
            <span />
            <span />
          </div>
          <div className="am2-pdf__cover-logo-text">NET</div>
        </div>
      </div>
    </PdfPageWrapper>
  );
}
