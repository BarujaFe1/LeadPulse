import { formatDue } from "@/lib/format";
import type { FollowUpTask } from "@/types";

type Props = { tasks: FollowUpTask[] };

function badgeClass(priority: FollowUpTask["priority"]): string {
  if (priority === "critical") return "danger";
  if (priority === "high") return "hot";
  return "warn";
}

export function FollowUpRadar({ tasks }: Props) {
  return (
    <section className="panel" aria-labelledby="followup-title">
      <h2 id="followup-title">Radar de follow-up</h2>
      {tasks.length === 0 ? (
        <p className="muted empty-state">Nenhuma tarefa aberta neste snapshot.</p>
      ) : (
        tasks.map((task) => (
          <div className="task-row" key={task.id}>
            <div className="task-top">
              <strong>{task.lead_name}</strong>
              <span className={`badge ${badgeClass(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            <div className="muted">{task.title}</div>
            <div className="muted">Due: {formatDue(task.due_at)}</div>
          </div>
        ))
      )}
    </section>
  );
}
