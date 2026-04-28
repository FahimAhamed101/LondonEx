export default function TickCell({ selected }) {
  return (
    <td className="am2-pdf__tick-cell">
      <span className={`am2-pdf__tick-box${selected ? " is-selected" : ""}`}>
        {selected ? "\u2713" : ""}
      </span>
    </td>
  );
}
