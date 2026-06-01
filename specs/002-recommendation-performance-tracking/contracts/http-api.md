# Contract: Performance Dashboard/API Surface

## Recommendation Outcome Detail

- `GET /recommendations/{id}/outcomes`: list immutable outcome evaluations for a recommendation
- `POST /recommendations/{id}/outcomes`: create a paper-only outcome evaluation

## Performance Summary

- `GET /performance`: show aggregate performance metrics

## Response Rules

- Outcome detail includes classification, return, policy, snapshots, evaluator,
  source references, timestamps, and trace id.
- Summary includes evaluated count, unresolved count, win rate, loss rate,
  neutral rate, and average return.
- Views must label all metrics as paper-trading performance.
