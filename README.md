# Gửi Khuê Nhã — Web1.5, APK1.4

Đọc **BAN-WEB-1.5-KHONG-TU-NAP-MAU.md**: đã sửa mặc định sổ tay trống, mẫu chỉ mở theo lựa chọn và không lưu mẫu lên MongoDB. Cập nhật repo/Render, dùng APK1.4 hiện có; không cần build APK mới cho thay đổi web này.

# Gửi Khuê Nhã — Android1.4 đặt sẵn Render

Đọc **BAN-1.4-RENDER.md**. APK đặt sẵn https://gui-khue-nha.onrender.com và có nút Kiểm tra kết nối Render/DB. Cùng chữ ký bản1.3, không nhúng DB URI hoặc secret trong APK.

# Gửi Khuê Nhã — 1.3 Logo & Google Connect

Đọc **BAN-1.3-LOGO-GOOGLE.md** và **HUONG-DAN-TRIEN-KHAI.md**. Logo ảnh chân dung đã có trên web, favicon/PWA và launcher APK. Nút Kết nối Google có trên dashboard, Cài đặt và APK. Chưa có credentials thật trong source.

Chạy Mac: `bash RUN-MAC.sh`; sửa source: `bash RUN-MAC.sh dev` hoặc `npm run dev` sau khi cài dependency. Build: `npm run build`. Backend: `npm start`. Source React/Vite + Node/MongoDB + Android, Render dùng Dockerfile.render.

Đọc **HUONG-DAN-TRIEN-KHAI.md** để tạo MongoDB Atlas Free, deploy Render và cài APK. APK nhập URL Render trên điện thoại, không dùng URL demo riêng tư. Mỗi người đăng nhập Google và quản lý việc riêng.

- `apps/android`: launcher Android + Custom Tabs workspace + widget/nhắc cục bộ.
- `apps/api`: Node backend, MongoDB, Google OAuth/Drive/Calendar, Gemini tùy chọn.
- `features/app`, `components`, `lib`: frontend quản lý công việc.
- `apps/web/dist`: web build sẵn, được commit để Render deploy nhẹ.
- `Dockerfile.render`: image Node 24 chỉ cài API dependencies.
- `.github/workflows/android-release.yml`: build APK ký bằng GitHub Secrets của chủ app.
- `HUONG-DAN-MAC.md`: cách thử demo trên Mac (thư mục gói mới tên GuiKhueNha).
- `BAO-CAO-KIEM-TRA.md`: các kiểm tra đã thực hiện và giới hạn.

APK cài ngoài Play Store, chưa chạy kiểm thử thiết bị thật. Không coi bản build release là đã triển khai dịch vụ Google/Atlas/Render. Cần cấu hình riêng và kiểm tra 2 tài khoản trước khi dùng dữ liệu thật. Dùng Free phù hợp hobby/cá nhân, có hạn mức và thời gian ngủ.

Không commit `.env`, URI DB, Google secret, Gemini key hoặc khóa ký APK. Backup ký Android giao riêng, giữ riêng tư. Demo trên Mac vẫn chạy bằng `bash RUN-MAC.sh`; không cần MongoDB để thử giao diện.
