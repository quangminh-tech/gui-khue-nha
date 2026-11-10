# Gửi Khuê Nhã1.7.2

Đọc **HUONG-DAN-1.7.2.md** để cập nhật cả Render và APK. Bản mới sửa nhận phiên Google, có sổ tay thật lưu trên máy không cần Google, widget local và tài khoản, Calendar hai chiều tùy chọn. Không tự trộn dữ liệu local vào tài khoản.

- Frontend React/Vite: features/app, components, lib; build sẵn apps/web/dist.
- Backend Node24/MongoDB: apps/api/src. Mongo dùng khi kết nối tài khoản, không bắt buộc cho sổ tay local.
- Android hybrid: apps/android. Workspace trong WebView, Google OAuth ngoài browser, nhận cookie qua HTTP riêng.
- JDK17, SDK35, AGP8.9.1, Gradle8.11.1. Package vn.nhipviec.mobile, versionCode9.
- npm run build; npx tsc --noEmit; npm run test:app.
- Mac: bash RUN-MAC.sh hoặc bash RUN-MAC.sh dev.

Không gỡ app/xóa dữ liệu để cập nhật. Giữ .env, APP_ENCRYPTION_KEY và key ký cũ riêng; không có secrets trong source. Xem KIEM-TRA-1.7.2.md cho phạm vi kiểm thử và giới hạn. Các BAN-1.x cũ là tài liệu lịch sử; hướng dẫn1.7.2 thay thế phần auth/lưu local/build.
