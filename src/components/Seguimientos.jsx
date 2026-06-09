import { PhoneCall } from "lucide-react";
import { followups } from "../data.js";

export default function Seguimientos() {
  return (
    <>
      <div className="section-toolbar">
        <h2>Seguimientos</h2>
        <button className="primary-button" type="button"><PhoneCall />Agendar</button>
      </div>
      <div className="timeline">
        {followups.map((item) => (
          <article className="timeline-item" key={`${item.title}-${item.date}`}>
            <time>{item.date}</time>
            <div>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
