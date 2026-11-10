# Kiểm tra 1.7

npm run test:app đạt toàn bộ bộ test, gồm Calendar hai chiều với Google/Mongo giả lập, conditional-write412, idempotence, xóa/gỡ liên kết an toàn, widget theo ngày Việt Nam và SSR màn hình xem/checklist. Bốn character mới có theme và được schema backend chấp nhận. npm run build và npx tsc --noEmit đạt.

Android assembleRelease và lintVital đạt, versionCode7/versionName1.7.0; xác minh cùng chứng chỉ ký bản1.6 và zip alignment trước đóng gói. API và widget dùng cookie của từng tài khoản, không có secrets trong APK/sourcezip.

Không chạy được Chromium headless do quyền socket môi trường. Không có kiểm thử tương tác trình duyệt/thiết bị Android thật hoặc Google provider thật. Không mô tả SSR/mock thành kiểm thử end-to-end. Source/APK chưa tự deploy vào repo/Render người dùng. Cần cập nhật cả hai và bật Google Calendar API trước khi thử thực tế.
