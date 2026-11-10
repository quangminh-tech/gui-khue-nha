# Kiểm tra bàn giao — 10/11/2026

## Đã xác minh

- Giao diện quản lý việc đã build bằng Vite; bản demo Region Edition đã kiểm tra trước đó trên desktop và khung điện thoại, gồm đổi Liyue/Inazuma và popup.
- Bản phát hành giữ nguyên frontend đã build; Render dùng payload nhẹ với đúng dependencies API (MongoDB driver + Zod), không cần thư viện build UI lúc chạy.
- Smoke test payload tương đương Docker runtime trên Node24: trang chính/ảnh/bundle, API health, từ chối người chưa đăng nhập và từ chối ghi khác Origin. Không có Docker daemon để build/run image Docker thực tế trong phiên này.
- ServerAddress: chấp nhận HTTPS origin, chuẩn hóa host, từ chối HTTP, user/password trong URL, đường dẫn, query, fragment và cổng ngoài443.
- Các kiểm tra logic ở bản nền đã qua: checklist/% nhập tay/tiến độ việc lớn, lặp việc, deadline theo UTC+7, giờ yên lặng, retention 90 ngày/hoàn thành hơn10 ngày, liên kết tài liệu, Pomodoro, schema, mã hóa key và AI mock.
- Source được đóng gói không có .env, Mongo URI, API key, mật khẩu ký APK hoặc node_modules. Khóa ký backup giao riêng.

## Chưa xác minh bằng dịch vụ/thiết bị thật

- Không có tài nguyên MongoDB Atlas/Render/Google OAuth của người dùng được cung cấp nên chưa chạy kết nối DB, đăng nhập, Google Picker/Calendar/Gemini live.
- Chưa cài/chạy APK trên điện thoại Android thật hoặc emulator. Cần kiểm tra quyền, widget, giờ nhắc, reboot, tiết kiệm pin, trình duyệt và hai tài khoản như hướng dẫn triển khai.
- Không có Play Store listing, Play Protect reputation hoặc bảo đảm hoạt động trên mọi hãng máy.

Gradle assembleRelease và lintVitalRelease đã thành công; APK release 1.3.0 versionCode4 được ký RSA3072, apksigner xác minh v1/v2 và zipalign kiểm tra thành công. Kết quả chi tiết trong ANDROID-BUILD-RESULT.txt. Không suy ra kiểm thử runtime từ việc compile thành công.


Bản1.3: đã qua mock OAuth flow 2 bước, CSRF/state/PKCE, từ chối đổi tài khoản, trạng thái quyền và token mã hóa. Browser desktop/mobile kiểm tra logo, CTA Google, dialog chưa cấu hình và thẻ trong Cài đặt. Logo ảnh gốc đã đồng bộ public + Android mipmap/adaptive. Cùng chứng thư bản1.2, không tạo key mới. TypeScript và các kiểm tra app hiện hành đã qua. Chưa gọi dịch vụ Google/Atlas/Render thật trong phiên này.


Android1.4: versionCode5, default Render origin và nút kiểm tra health. Build/lint/signature/zipalign và kiểm tra địa chỉ HTTPS đã qua. Chưa chạy thiết bị thật. GET public /api/health từ môi trường bàn giao hết timeout100giây, không kết luận service lỗi và chưa xác minh Mongo/Google live.


Web1.5: typecheck/build/test qua. Browser xác nhận signed-out bắt đầu0việc, nút tạo hướng dẫn login, mẫu chỉ qua nút opt-in và thoát mẫu trở về0việc. Existing workspace được giữ theo test; không có live Mongo/Google credentials để kiểm tra account thật trong phiên này. Android1.4 không thay đổi, không build APK mới.
