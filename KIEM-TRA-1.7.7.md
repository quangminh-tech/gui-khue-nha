# Kiểm tra 1.7.7

PASS: npx tsc --noEmit; npm run build; npm run test:app; Gradle :app:assembleRelease.

Test scheduling: daily/weekday/weekly/monthly/yearly/custom; COUNT/UNTIL; month-end/leap; virtual idempotence; independent checklist; instance/all/future edit/delete; template edit keeps history; valid parents; ranges; retention exclusions; Android generated IDs.

Test React UI: real form monthly range/count save; full local App; every affected month cell/agenda day shows span and recurrence; month navigation resets selected day. Regression suite: documents/domain/tree CSS, custom reminders, Pomodoro, auth recovery, local storage, Calendar conflict/deletion, transactional outbox and owner isolation.

APK: vn.nhipviec.mobile, versionName1.7.7, versionCode14. apksigner verifies original certificate SHA256 11869aec45550e8070c26c87f95b8e0c0d9889d88d71a5d9e64414abe8de0bd6. zipalign verifies alignment.

No browser/device or real Google/Mongo integration test. No remote push/deployment. Follow HUONG-DAN-1.7.7.md for rolling Calendar bounds, legacy recurrence conversion and update order.
