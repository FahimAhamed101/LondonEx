import ChecklistRow from "@/components/pdf/ChecklistRow";

export default function SectionTable({ section }) {
  return (
    <section className="am2-pdf__section-block">
      <h2 className="am2-pdf__section-title">
        {section.title}
        {section.duration ? <span> ({section.duration})</span> : null}
      </h2>

      {section.subtitle ? (
        <p className="am2-pdf__section-intro">{section.subtitle}</p>
      ) : null}

      {section.description ? (
        <p className="am2-pdf__section-copy">{section.description}</p>
      ) : null}

      <table className="am2-pdf__table">
        <colgroup>
          <col className="am2-pdf__col-question" />
          <col className="am2-pdf__col-box" span="8" />
        </colgroup>

        <thead>
          <tr className="am2-pdf__table-banner-row">
            <th rowSpan="2" className="am2-pdf__table-banner-corner" />
            <th colSpan="8" className="am2-pdf__table-banner-text">
              For each item please tick one box in the Knowledge section and one
              box in the Experience section
            </th>
          </tr>
          <tr className="am2-pdf__table-group-row">
            <th colSpan="4">
              <span className="am2-pdf__table-group-label">Knowledge</span>
            </th>
            <th colSpan="4">
              <span className="am2-pdf__table-group-label">Experience</span>
            </th>
          </tr>
          <tr className="am2-pdf__table-headings-row">
            <th />
            <th>Limited</th>
            <th>Adequate</th>
            <th>Extensive</th>
            <th>Unsure</th>
            <th>Limited</th>
            <th>Adequate</th>
            <th>Extensive</th>
            <th>Unsure</th>
          </tr>
        </thead>

        <tbody>
          {section.items.map((item) => (
            <ChecklistRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </section>
  );
}
