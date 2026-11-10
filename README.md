# Gửi Khuê Nhã 1.7.3

Bản 1.7.3 sửa lưu link trực tiếp khi bấm Lưu công việc, hiện URL và tài liệu việc con, chọn việc cha theo cây, chọn/nhập lĩnh vực. Cần cập nhật source trên Render rồi cài APK. Đọc **HUONG-DAN-1.7.3.md**.

- Frontend React/Vite: features/app, components, lib; build sẵn apps/web/dist.
- Backend Node24/MongoDB: apps/api/src. Mongo dùng khi kết nối tài khoản, không bắt buộc cho sổ tay local.
- Android hybrid: apps/android. Workspace trong WebView, Google OAuth ngoài browser, nhận cookie qua HTTP riêng.
- JDK17, SDK35, AGP8.9.1, Gradle8.11.1. Package vn.nhipviec.mobile, versionCode10.
- npm run build; npx tsc --noEmit; npm run test:app.
- Mac: bash RUN-MAC.sh hoặc bash RUN-MAC.sh dev.

Không gỡ app/xóa dữ liệu để cập nhật. Giữ .env, APP_ENCRYPTION_KEY và key ký cũ riêng; không có secrets trong source. Xem KIEM-TRA-1.7.3.md cho phạm vi kiểm thử và giới hạn. Các BAN-1.x cũ là tài liệu lịch sử; hướng dẫn 1.7.3 là hướng dẫn cập nhật hiện tại.