import { STAGE_LABEL } from "@/lib/format";
import type { FunnelStage } from "@/types";

type Props = { funnel: FunnelStage[] };

export function FunnelPanel({ funnel }: Props) {
  const funnelMax = Math.max(...funnel.map((stage) => stage.count), 1);

  return (
    <section className="panel" aria-labelledby="funnel-title">
      <h2 id="funnel-title">Funil simples</h2>
      <div className="funnel" role="list">
        {funnel.map((stage) => (
          <div className="funnel-bar" role="listitem" key={stage.stage}>
            <span>{STAGE_LABEL[stage.stage] ?? stage.stage}</span>
            <div
              className="bar-track"
              aria-hidden="true"
            >
              <div
                className="bar-fill"
                style={{ width: `${(stage.count / funnelMax) * 100}%` }}
              />
            </div>
            <strong aria-label={`${stage.count} leads`}>
              {stage.count}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}
