# Personal data retention

User-authorized rule: delete only tasks with status `done` whose valid `completedAt` date is strictly older than 10 calendar days in Asia/Ho_Chi_Minh. Keep incomplete tasks, missing/invalid completion dates and cyclic links. Delete ALL eligible completed tasks, including parents. Reparent surviving children to the nearest retained ancestor or to the root. The cutoff is computed by the server. Do not delete Google Calendar events, wallpaper preferences, the account, or the Site. Removed tasks are also removed from derived statistics. The JSON export is manual; do not retain deleted task contents in cleanup logs.

Cleanup cadence: once every 90 days, not daily. Do not purge on normal saves or page reads.

## Unattended run

1. Resolve the linked Site through Sites `get_site`. Verify it is still owned by the user and owner-private (exactly one owner allowed, no groups, no external visitors). If this has changed, stop without invoking maintenance and report the access change.
2. Use the returned current `current_live_url` and `siwc_bypass_bearer_token`. Send that token only to that Site in the `OAI-Sites-Authorization: Bearer …` header. It is service access validated by platform dispatch, not a signed-in visitor identity. Never put it into files, source, prompts or user output. If the supported access value is absent, stop; do not mint/rotate credentials or use browser login.
3. GET `/api/maintenance/retention` for a bounded dry-run summary.
4. POST the same path with `Content-Type: application/json` and body `{"action":"purge-completed-10-days"}`. This owner-private shared maintenance writer cleans the personal Site's workspace records. Do not use another URL or change the policy/cutoff. It uses compare-and-update versions to avoid overwriting concurrent edits.
5. GET again; verify `remainingEligible` is zero. On a concurrent-edit 409, reread then retry at most once. The cleanup is idempotent. Other failures must be reported, without republishing or changing data through another route.
6. Keep successful no-op runs quiet. Report failures that require user action. Report only counts, never deleted task contents or credentials.

The writer relies on this Site's owner-private platform access boundary. Before changing the Site to shared/public, disable this schedule and add suitable authenticated service authorization to the maintenance endpoint.
