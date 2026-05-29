import type { ProviderExecutionLog } from "@ai-tp/core";

export function ProviderLogSummary({ logs }: { logs: ProviderExecutionLog[] }) {
  return (
    <article className="panel">
      <h2>Provider Logs</h2>
      <p>{logs.length} calls</p>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            {log.providerType}: {log.status}
          </li>
        ))}
      </ul>
    </article>
  );
}
