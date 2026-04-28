export default function PdfPageWrapper({
  children,
  pageNumber,
  footerCode,
  footerDate,
  pageClassName = "",
  hideFooter = false,
}) {
  return (
    <article className={`am2-pdf__page ${pageClassName}`.trim()}>
      <div className="am2-pdf__page-inner">{children}</div>

      {!hideFooter ? (
        <footer className="am2-pdf__footer">
          <span>{footerCode}</span>
          <span>{pageNumber}</span>
          <span>{footerDate}</span>
        </footer>
      ) : null}
    </article>
  );
}
