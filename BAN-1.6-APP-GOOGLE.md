# Gửi Khuê Nhã 1.6 — sổ tay trong app, Google quay về app

## Đã xác định trên máy chủ ngày 10/11/2026

https://gui-khue-nha.onrender.com/api/health trả status=ready, storage=mongodb, googleConfigured=false.
/api/config báo thiếu GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET. DB và APP_ENCRYPTION_KEY đã có.
Đây là lỗi thiếu cấu hình Google. Ảnh launcher 1.4 không chứng minh Android bị crash; muốn xác định crash cần logcat. Bản 1.4 dùng Custom Tabs cho cả workspace nên khiến bạn cảm giác app thoát ra trình duyệt.

## Bản này thay đổi gì?

- APK 1.6.0, versionCode 6, mở thẳng workspace trong WebView nội bộ; các nút kỹ thuật chuyển vào bánh răng Android.
- Google xác thực bằng Custom Tabs/trình duyệt hệ thống. Sau cấp quyền có nút “Trở về Gửi Khuê Nhã”. Không nhúng trang đăng nhập Google trong WebView, không giả user agent.
- Mỗi người tự chọn Google của mình. Dữ liệu Mongo và quyền Drive/Calendar vẫn gắn theo tài khoản đó.
- Backend phát mã một lần, 2 phút, ràng buộc SHA256 verifier của app; app kiểm tra state rồi POST đổi mã. Session HttpOnly được tạo trực tiếp trong WebView. Không chuyển access token, refresh token hoặc session qua deep link.
- Logo giữ nguyên; không nhúng URI Mongo, khóa mã hóa hoặc Google secret trong APK. Cùng chứng chỉ ký bản cũ nên có thể cập nhật đè.
- Giữ thay đổi Web1.5: tài khoản mới trống, demo chỉ khi chủ động chọn; không xóa dữ liệu thật đã có.
- Widget/nhắc Android vẫn là snapshot gửi thủ công từ Cài đặt. Chưa có đồng bộ nền tự động hoặc chế độ làm việc offline đầy đủ.

## Làm theo thứ tự này

### 1. Cập nhật source trên GitHub và Render

Giải nén GuiKhueNha-1.6-FullProject.zip. Copy nội dung thư mục GuiKhueNha vào repository gui-khue-nha đang dùng. Giữ file .env riêng và key ký riêng; không đưa chúng lên GitHub. Đừng chỉ cập nhật APK: backend cũ chưa hiểu mã quay về app.

Tại thư mục repo trên Mac:

```bash
git status
git add apps/api apps/android apps/web/dist scripts/test-google-connect.mjs package.json README.md BAN-1.6-APP-GOOGLE.md
git diff --cached --stat
git commit -m "Open workspace in app and add secure Google mobile handoff"
git push origin main
```

Nếu bạn chỉnh file khác thì kiểm tra và add riêng. Render service dùng Docker, Dockerfile Path = ./Dockerfile.render, Docker Context = ., Root Directory để trống. File Dockerfile.render có trong gói này. Render dùng frontend build sẵn apps/web/dist. Đợi auto-deploy hoặc Manual Deploy → Deploy latest commit. Không tạo dịch vụ mới hay database mới.

### 2. Tạo Google OAuth một lần cho app

Mở https://console.cloud.google.com/ và chọn/tạo project của app.

1. APIs & Services → Library: bật Google Drive API và Google Calendar API; nếu cần chọn ảnh/tệp bằng cửa sổ Picker thì bật thêm Google Picker API.
2. Google Auth Platform → Branding: đặt tên Gửi Khuê Nhã, email hỗ trợ và email nhà phát triển của bạn.
3. Audience: chọn External cho tài khoản Gmail cá nhân. Khi còn Testing, thêm email của cả hai người vào Test users. Đây là giới hạn thử nghiệm Google, không phải app hard-code hai email. Mở rộng người dùng sau cần xử lý trạng thái xuất bản/xác minh theo yêu cầu Google. Refresh token ở chế độ Testing có thể hết hạn sau 7 ngày với các quyền này; cần kết nối lại.
4. Data Access: cấu hình các scope openid, email, profile, https://www.googleapis.com/auth/drive.file, https://www.googleapis.com/auth/calendar.events.
5. Clients → Create client → loại **Web application**. Bản này dùng backend OAuth, không phải client Android/Firebase.
6. Authorized redirect URIs: nhập CHÍNH XÁC:

```
https://gui-khue-nha.onrender.com/auth/google/callback
```

Không nhập guikhuenha://auth vào ô Google redirect. Google quay về backend HTTPS; backend mới đưa người dùng về app.
Nếu dùng Picker, Authorized JavaScript origins thêm https://gui-khue-nha.onrender.com.
7. Lưu Client ID và Client Secret riêng. Bạn tự dán vào Render, không cần gửi mật khẩu/secret trong chat.

Tài liệu chính thức: https://developers.google.com/identity/protocols/oauth2/web-server
Chính sách Google về trình duyệt nhúng: https://developers.google.com/identity/protocols/oauth2/policies#browsers

### 3. Thêm Environment Variables trên Render

Render → service gui-khue-nha → Environment → Edit:

| Key | Value |
| --- | --- |
| APP_ORIGIN | https://gui-khue-nha.onrender.com |
| GOOGLE_CLIENT_ID | Client ID vừa tạo, thường kết thúc .apps.googleusercontent.com |
| GOOGLE_CLIENT_SECRET | Client Secret của cùng client đó |
| MONGODB_URI | Giữ URI đúng đang chạy |
| MONGODB_DB | Giữ nhipviec như hiện tại |
| APP_ENCRYPTION_KEY | Giữ khóa hiện có, không tự thay khi đang có dữ liệu mã hóa |

Save, rebuild/redeploy. Không đặt các secret dưới biến VITE_. APK chỉ biết URL Render; không chứa các biến này.
Kiểm tra:

- /api/health: googleConfigured phải true.
- /api/config: mobileAuthVersion phải 1; setup.missing phải là [] khi đã cấu hình đầy đủ bốn biến bắt buộc.

Nếu googleConfigured vẫn false thì chưa cấu hình đúng service hoặc chưa deploy. Nếu không có mobileAuthVersion:1 thì server còn source cũ, đừng thử APK mới trước khi cập nhật xong.

Picker là phần bổ sung, tách khỏi đăng nhập: thêm GOOGLE_PICKER_API_KEY và GOOGLE_CLOUD_PROJECT_NUMBER từ cùng Google project. API key giới hạn HTTP referrers tại https://gui-khue-nha.onrender.com/* và API restrictions cho Google Picker API; Project Number là số, không phải Project ID dạng chữ. Picker chưa cấu hình không đồng nghĩa login Google bị lỗi. Link Docs/Sheets/PDF/website vẫn là tài liệu liên kết, không upload file lên Mongo.

### 4. Cài APK và thử

1. Cài GuiKhueNha-1.6.0-release.apk đè bản trước; tên package vn.nhipviec.mobile, cùng chữ ký. Không cần gỡ app, không cần xóa MongoDB.
2. Mở app: phải vào giao diện sổ tay, không còn màn hình nhiều nút như ảnh 1.4.
3. Chọn Kết nối Google. Trình duyệt hệ thống mở, chọn tài khoản và cấp quyền. Đây là hành vi đúng cho xác thực Google.
4. Sau Google trả về, bấm **Trở về Gửi Khuê Nhã** trong vòng 2 phút. Android chuyển về app, backend tạo phiên trong WebView và tải sổ tay.
5. Tạo một việc thật, đóng/mở lại kiểm tra còn dữ liệu. Máy người thứ hai đăng nhập Google khác và kiểm tra sổ tay riêng.
6. Nếu muốn widget/nhắc: bật quyền thông báo qua bánh răng Android; trong Cài đặt sổ tay dùng Gửi việc sang bản Android, nhận snapshot rồi ghim widget. Sửa công việc xong cần gửi lại snapshot.

Google/Docs/Sheets hoặc website ngoài có thể mở bằng trình duyệt hoặc ứng dụng tương ứng. Workspace quản lý việc ở trong app. App dạng hybrid dùng WebView, chưa phải giao diện native offline.

## Khi lỗi

- “Chưa cấu hình Google OAuth”: kiểm tra hai biến thiếu ở trên.
- redirect_uri_mismatch: sửa đúng URI callback, đúng client và APP_ORIGIN, không thêm dấu / cuối APP_ORIGIN.
- access_denied khi Testing: thêm email vào Test users và kiểm tra chính sách tài khoản Google/Workspace.
- Phiên quay về app hết hạn/không khớp: bắt đầu từ nút Google TRONG APK, không từ tab Chrome cũ, chỉ hoàn thành một lượt đăng nhập và bấm quay về trong 2 phút.
- Chrome vào được nhưng app chưa đăng nhập: kiểm tra server có mobileAuthVersion:1, cài đúng APK1.6 và dùng nút Trở về app. Cookie Chrome không tự chia sẻ sang WebView; bản này có handoff riêng.
- Mạng lỗi: đợi Render Free khởi động, bấm ↻; không xóa DB.
- Nếu thật sự app biến mất: gửi ảnh lỗi hoặc logcat có AndroidRuntime/FATAL EXCEPTION, bỏ thông tin riêng. Ảnh launcher không đủ xác định nguyên nhân crash.

## Build lại trên Mac

Cài JDK17, Android Studio, SDK35, build-tools35.0.0. Root web build nếu bạn sửa frontend:

```bash
npm run build
cd apps/android
./gradlew :app:assembleDebug
```

Release cần các biến KN_KEYSTORE_PATH, KN_KEYSTORE_PASSWORD, KN_KEY_PASSWORD, KN_KEY_ALIAS=khue-nha từ bản sao lưu ký riêng của bạn rồi chạy ./gradlew :app:assembleRelease. Không tạo key mới nếu muốn cập nhật đè bản đang cài. APK nằm ở apps/android/app/build/outputs/apk/release/app-release.apk. GitHub Actions android-release.yml cũng hỗ trợ build bằng GitHub Secrets. Không chứa key/mật khẩu ký trong gói source này.

## Giới hạn xác minh

Đã build web, typecheck, kiểm thử logic HTTP/OAuth với provider và Mongo giả lập; đã build release Android, kiểm tra chữ ký APK. Các kiểm thử handoff gồm state, verifier, code chỉ dùng một lần, hết hạn, HttpOnly; không phải đăng nhập Google thật.
Chưa chạy trên điện thoại/emulator, chưa xác minh đăng nhập Google thật hoặc widget trên máy người dùng. Live Render vẫn thiếu GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET tại thời điểm kiểm tra. Bản này chưa được push/deploy vào tài khoản GitHub/Render của bạn.
