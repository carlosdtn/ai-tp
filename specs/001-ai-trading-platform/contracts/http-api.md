# Contract: Dashboard HTTP/API Surface

The dashboard may use route handlers, server actions, or an internal API surface,
but the behavioral contract is the same: web adapters call application services
and return validated view data.

## Watchlists

- `GET /watchlists`: list watchlists
- `POST /watchlists`: create watchlist
- `GET /watchlists/{id}`: inspect watchlist with instruments
- `POST /watchlists/{id}/instruments`: add instrument
- `DELETE /watchlists/{id}/instruments/{instrumentId}`: remove instrument

## Recommendation Workflows

- `POST /recommendation-runs`: start simulated recommendation run for a watchlist
- `GET /recommendation-runs/{id}`: inspect run status and trace ids

## Recommendations

- `GET /recommendations`: list/filter recommendations
- `GET /recommendations/{id}`: inspect full audit detail

## Provider Logs

- `GET /provider-logs`: list/filter provider execution logs by workflow,
  recommendation, provider type, status, or trace id

## Journal

- `GET /journal`: list/filter journal entries
- `POST /journal`: create journal entry linked to instrument, recommendation, or
  paper outcome

## Response Rules

- Recommendation detail responses include explanation, score, confidence, risk
  assessment, source references, provider ids, provider log summaries, timestamps,
  and trace id.
- All paper simulations and recommendations are labeled paper-only.
- Invalid provider responses and rejected risk assessments are visible as audit
  outcomes, not hidden server failures.
- Live trading attempts return a rejected operation result, never a simulated
  success.
