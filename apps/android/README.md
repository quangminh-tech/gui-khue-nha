# Android 1.6.0 — versionCode 6

Workspace chạy trong WebView nội bộ. Google OAuth và tài liệu ngoài dùng trình duyệt hệ thống; người dùng bấm Trở về Gửi Khuê Nhã để hoàn tất phiên trong app. Đọc BAN-1.6-APP-GOOGLE.md ở gốc repo và cập nhật backend trước khi cài APK.

MainActivity chặn /auth/google và bắt đầu browser OAuth bằng state + SHA256 verifier. Backend trả mã 2 phút vào deep link; app kiểm tra state rồi WebView.postUrl đổi mã lấy HttpOnly session cookie. Không dùng JavaScript bridge, không giả user agent và không nhập Google password trong WebView.

Build Mac: JDK17, SDK35 + build-tools35.0.0, Gradle wrapper8.11.1. Đặt ANDROID_HOME theo SDK trên máy. Chạy ./gradlew :app:assembleDebug trong apps/android. Release dùng KN_KEYSTORE_PATH, KN_KEYSTORE_PASSWORD, KN_KEY_PASSWORD, KN_KEY_ALIAS=khue-nha và ./gradlew :app:assembleRelease. Giữ cùng chứng chỉ để cập nhật đè. Không có key ký thật trong source; GitHub workflow hỗ trợ Secrets.

APK: app/build/outputs/apk/release/app-release.apk. Widget và nhắc cục bộ dùng snapshot người dùng gửi từ Cài đặt; tối đa30 việc, không sync nền tự động, nhắc inexact có thể trễ do Android. Thử trên thiết bị thật: Google login/return/cancel, hai tài khoản, process recreation, Back, cookie sau đóng mở, tài liệu ngoài, snapshot/widget/notification/reboot. Bản build thành công chưa thay thế các kiểm tra thiết bị này.
