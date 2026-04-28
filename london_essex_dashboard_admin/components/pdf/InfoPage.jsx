import PdfPageWrapper from "@/components/pdf/PdfPageWrapper";

export default function InfoPage({ documentMeta, infoPage }) {
  return (
    <PdfPageWrapper
      pageNumber={2}
      footerCode={documentMeta.footerCode}
      footerDate={documentMeta.footerDate}
      pageClassName="am2-pdf__page--info"
    >
      <section className="am2-pdf__info-section">
        {infoPage.notice ? (
          <div className="am2-pdf__notice-box">
            {infoPage.notice.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        <h2 className="am2-pdf__info-title">{infoPage.heading}</h2>

        {infoPage.paragraphs.map((paragraph) => (
          <p key={paragraph} className="am2-pdf__info-paragraph">
            {paragraph}
          </p>
        ))}

        {infoPage.bulletGroups.map((group) => (
          <ul key={group.title} className="am2-pdf__info-list">
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ))}

        <div className="am2-pdf__summary-list">
          {infoPage.sectionSummary.map((item) => (
            <div key={item.code} className="am2-pdf__summary-row">
              <strong>{item.code}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="am2-pdf__info-section am2-pdf__info-section--usage">
        <h2 className="am2-pdf__info-title">{infoPage.usageHeading}</h2>

        {infoPage.usageParagraphs.map((paragraph) => (
          <p key={paragraph} className="am2-pdf__info-paragraph">
            {paragraph}
          </p>
        ))}
      </section>
    </PdfPageWrapper>
  );
}
