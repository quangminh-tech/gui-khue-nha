# Kiểm tra bản 1.6

- npm run test:app: đạt các bộ kiểm tra Pomodoro, tài liệu, retention, app, HTTP và Google OAuth (mock provider/database).
- Mobile handoff: kiểm tra state/challenge, browser consent, không đưa token Google/session vào HTML quay về, sai verifier bị từ chối không tiêu thụ mã, mã dùng một lần, mã hết hạn, cookie HttpOnly.
- npm run build: đạt.
- npx tsc --noEmit: đạt.
- node --check: index.mjs, google.mjs, mobile-auth.mjs đạt.
- Android: Gradle :app:assembleRelease; xác minh APK signature và alignment, cùng certificate SHA256 11869aec45550e8070c26c87f95b8e0c0d9889d88d71a5d9e64414abe8de0bd6.
- APK versionName1.6.0, versionCode6, package vn.nhipviec.mobile, minSDK23, targetSDK35.
- URL server mặc định https://gui-khue-nha.onrender.com; không nhúng DB/password/key.

Live server ngày10/11/2026: status ready, storage mongodb, googleConfigured false; /api/config thiếu GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET. Source mới chưa deploy vào repo/Render của chủ app.
Chưa chạy emulator/điện thoại, chưa xác minh login Google thật, hai tài khoản thật, process restoration hoặc widget/nhắc thực tế. Không có logcat crash từ điện thoại; ảnh launcher không đủ kết luận crash.
