import TickCell from "@/components/pdf/TickCell";

const scaleOptions = ["limited", "adequate", "extensive", "unsure"];

export default function ChecklistRow({ item }) {
  if (item.kind === "group") {
    return (
      <tr className="am2-pdf__row am2-pdf__row--group">
        <td className="am2-pdf__group-cell" colSpan={9}>
          {item.text}
        </td>
      </tr>
    );
  }

  return (
    <tr className="am2-pdf__row">
      <td className="am2-pdf__question-cell">
        <div className="am2-pdf__question-layout">
          <span className="am2-pdf__question-number">{item.number}</span>
          <span className="am2-pdf__question-text">{item.text}</span>
        </div>
      </td>

      {scaleOptions.map((option) => (
        <TickCell
          key={`${item.id}-knowledge-${option}`}
          selected={item.knowledge === option}
        />
      ))}

      {scaleOptions.map((option) => (
        <TickCell
          key={`${item.id}-experience-${option}`}
          selected={item.experience === option}
        />
      ))}
    </tr>
  );
}
