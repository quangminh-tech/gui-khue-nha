# Gửi Khuê Nhã — Android 1.3 release

Nhập URL HTTPS Render ở màn hình launcher rồi mở sổ tay. Workspace chạy bằng Custom Tabs, không phải WebView OAuth. Widget và local notifications dùng snapshot bạn gửi thủ công từ Cài đặt; không có sync nền tự động. Nhắc có thể trễ do tiết kiệm pin. Không có client native offline đầy đủ.

Đọc HUONG-DAN-TRIEN-KHAI.md ở gốc repo để cấu hình backend và cài APK. BAO-CAO-KIEM-TRA.md ghi kết quả build/kiểm tra thực tế, chưa có kiểm thử điện thoại thật.

## Build trên Mac

Cài Android Studio, SDK 35 + build tools 35.0.0, JDK17. Mở apps/android để sync. Nếu có wrapper, dùng ./gradlew; nếu chưa có, dùng Gradle8.11.1 chạy gradle wrapper --gradle-version 8.11.1. Đặt ANDROID_HOME tới SDK trên máy bạn.

Debug: ./gradlew :app:assembleDebug. Release: khai báo KN_KEYSTORE_PATH, KN_KEYSTORE_PASSWORD, KN_KEY_PASSWORD, KN_KEY_ALIAS=khue-nha trong môi trường riêng rồi ./gradlew :app:assembleRelease. Không ghi mật khẩu vào source. Giữ nguyên key ký và tăng versionCode cho lần sau. GitHub workflow Build signed Android APK nhận signing qua Secrets; không có key thật trong repository.

APK: app/build/outputs/apk/release/app-release.apk. Có thể dùng apksigner verify --verbose --print-certs để kiểm tra chữ ký. Widget có bản chụp tối đa30 việc, cập nhật thủ công, quyền thông báo Android13+, nhắc cục bộ inexact. Cần kiểm tra trên thiết bị: nhập URL, login, 2 tài khoản, deep link, widget, quiet hours, reboot, snooze, force stop và xóa snapshot.


Bản1.3 có ảnh logo ở drawable-nodpi/brand_logo.webp và icon launcher mipmap/adaptive. Launcher có nút Kết nối Google mở /auth/google?next=connect trên server đã chọn. Xem BAN-1.3-LOGO-GOOGLE.md.
