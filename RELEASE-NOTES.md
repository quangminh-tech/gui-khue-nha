# 1.7.7

- Shared bounded recurrence engine: daily/weekly/monthly/yearly/custom, weekdays, COUNT, UNTIL, exclusions, anchored month-end/leap-year clamping.
- Start/deadline date spans rendered on every affected month/day calendar date; next-month selection reset.
- Stable virtual occurrence IDs, independent checklist/status; this/future/all edits and deletions preserve stored history and valid parent relationships.
- Retention excludes removed completed occurrences from regeneration and preserves templates.
- Calendar individual-event rolling sync (past30/future60, 40 pushes/pass), per-instance pulls, legacy root-link migration and scoped transactional deletion outbox; Android snapshots expand upcoming occurrences.
- Android versionCode14; same package and signing certificate.
- React form/calendar and mock provider/storage regressions; no real device/Google-account run.

# 1.7.6

- Shared reminder preset/custom amount-unit control in task editor and settings.
- Minutes/hours/days with validation, whole-minute conversion, max7 days, explicit off.
- Invalid input blocks saving; saved minutes round-trip through schema, Calendar and native snapshot.
- Android versionCode13; same package and signing certificate.

# 1.7.5

- Dynamic Pomodoro companion and color; corrected Rhinedottir asset.
- Full-width accessible checkbox button with in-flight lock/error retention.
- Explicit delete/keep Calendar decision, atomic outbox with task deletion, legacy link registration, out-of-window delete and conditional retry.
- Custom reminder minutes and native future-alarm prioritization/notification permission/exact-alarm opt-in/delivery dedupe.
- Same Android package/signing key, versionCode12.

# 1.7.4

- Canonical domain names across menu/filter/editor/migration and Mongo writes. Whitespace, NBSP, zero-width, Unicode and case variants collapse; task identities and all contents retained.
- Parent tree/domain CSS moved from unused root file to active imported app stylesheet. Theme variables and layout preserved in prebuilt web release.
- Regression checks inspect the actual built CSS; Android versionCode11, same signing certificate.

# 1.7.3

- Save flushes pending document URL/checklist; failed saves retain draft.
- Explicit URL, type/source, open/copy/edit/remove, child-owned document aggregation.
- Hierarchical parent selection retains current parent, excludes self/descendants.
- Existing project/domain choices plus free entry.
- Picker loader timeout/retry and accurate missing-configuration hint.
- Android versionCode10, same package/signing certificate; prebuilt web refreshed.

# Gửi Khuê Nhã 1.2 — Android Release

Bản Android được chuẩn bị để cài trực tiếp ngoài Play Store. Nhập URL máy chủ Render trong app; không hardcode URL Site demo riêng tư. Giao diện công việc vẫn là web responsive mở bằng Android Custom Tabs, dùng phiên đăng nhập trình duyệt. Widget và lịch nhắc cục bộ là native. Đây không phải client native offline đầy đủ.

Frontend giữ giao diện Liyue–Morax theo ảnh: vùng thay theo nhân vật, % task/goal, dashboard deadline, checklist, tài liệu trong task, Pomodoro, báo cáo và Gemini tùy chọn. Source Node/MongoDB dùng OAuth Google, mỗi người có workspace riêng.

Render dùng Dockerfile nhẹ, chỉ cài dependencies API và dùng frontend đã build trong apps/web/dist. Không cần build Vinext/Worker hoặc pnpm trên Render. Sau khi sửa UI, phải build:web rồi commit bundle mới. Đọc HUONG-DAN-TRIEN-KHAI.md trước khi đưa lên GitHub.

Không có URI MongoDB, Google secret hay key ký Android trong source. Bản sao key ký được giao riêng, phải giữ riêng tư để phát hành cập nhật cùng chữ ký. APK chưa được thử trên điện thoại thật trong môi trường bàn giao; xem BAO-CAO-KIEM-TRA.md để biết những kiểm tra đã chạy.
