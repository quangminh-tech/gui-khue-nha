# Gửi Khuê Nhã 1.7

Đọc **BAN-1.7-CALENDAR-WIDGET.md** trước: Calendar hai chiều bật trong trang Lịch, widget tự lấy việc hôm nay/khẩn cấp, mở task để tick checklist trước rồi Chỉnh sửa riêng. Cập nhật cả Render và APK1.7.

Các hướng dẫn1.6 phía dưới mô tả cấu hình Google ban đầu; hành vi Calendar/widget/checklist được thay thế bởi1.7.

# Gửi Khuê Nhã 1.6

Đọc **BAN-1.6-APP-GOOGLE.md** để cập nhật GitHub/Render, tạo Google OAuth và cài APK. Cập nhật backend trước khi thử APK1.6: mobile handoff là route mới.

Android mở sổ tay trong WebView. Google xác thực ở Custom Tabs/trình duyệt hệ thống rồi người dùng bấm Trở về Gửi Khuê Nhã. Mã một lần gắn verifier giúp tạo phiên riêng trong WebView. Không nhúng trang đăng nhập Google vào WebView. Mỗi tài khoản có dữ liệu và quyền Drive/Calendar riêng.

- apps/android: Android hybrid + widget và nhắc cục bộ từ snapshot thủ công.
- apps/api: Node + MongoDB + Google OAuth + Drive/Calendar + Gemini tùy chọn.
- features/app, components, lib: React frontend, tài khoản mới bắt đầu trống; demo chủ động chọn.
- apps/web/dist: frontend build sẵn, được Dockerfile.render đóng gói cùng backend.
- .github/workflows/android-release.yml: build release qua GitHub signing secrets riêng.

Mac: `bash RUN-MAC.sh`; chỉnh frontend: `npm run dev`, build: `npm run build`; test: `npm run test:app`. Hướng dẫn build Android ở apps/android/README.md.

Source không chứa .env, key ký hoặc APK. Giữ APP_ENCRYPTION_KEY và chứng chỉ ký cũ. Không commit Mongo URI, Google Client Secret hay mật khẩu ký. Các BAN-1.3/1.4 và Web1.5 là ghi chú lịch sử; hướng dẫn 1.6 thay thế hành vi launcher cũ.

Đã build/test logic và chữ ký; chưa kiểm thử điện thoại thật hay đăng nhập Google thật. Render hiện cần cấu hình hai biến Google như hướng dẫn. Tài liệu cũ HUONG-DAN-TRIEN-KHAI.md hữu ích cho cấu hình chung; phần launcher/CustomTabs workspace đã được thay thế trong 1.6.
