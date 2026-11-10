# Gửi Khuê Nhã 1.4 — máy chủ đã đặt sẵn

APK đặt sẵn origin `https://gui-khue-nha.onrender.com`. Không cần nhúng MONGODB_URI, mật khẩu DB, APP_ENCRYPTION_KEY hoặc Google client secret vào APK. Backend Render mới là nơi dùng các cấu hình đó để nối Atlas và OAuth Google.

## Cài và kết nối

1. Cài GuiKhueNha-1.4.0-release.apk lên Android6+; cùng chữ ký với1.2/1.3 để cập nhật đè. Chưa kiểm thử cài trên thiết bị thật trong phiên này.
2. Màn hình app hiển thị máy chủ trên. Bản cài mới hoặc chưa lưu origin sẽ dùng địa chỉ này ngay. Nếu đã lưu một server khác ở bản cũ, lựa chọn đó được giữ: bấm Nhập/đổi địa chỉ Render, dán đúng URL trên rồi lưu. Đổi server sẽ xóa snapshot nhắc cũ trên máy, dữ liệu MongoDB không bị xóa.
3. Bấm **Kiểm tra kết nối Render / DB**. App gọi GET /api/health (không gửi mật khẩu), cho biết Render/MongoDB đã sẵn sàng và Google đã có cấu hình hay chưa. Render Free có thể khởi động chậm, app chờ phản hồi tối đa khoảng90giây sau khi kết nối.
4. Bấm **Kết nối Google**. Chưa có cấu hình Google trên Render thì chưa đăng nhập được chỉ bằng việc cài APK. Khi cấu hình đủ, trình duyệt sẽ mở luồng chọn tài khoản và cấp quyền.
5. Tạo một task thử, tải lại và kiểm tra cùng account trên thiết bị khác. Dữ liệu mỗi account phải tách riêng.

APK tiếp tục dùng Android Custom Tabs để hiển thị workspace online. Widget và lịch nhắc cục bộ dùng snapshot thủ công từ Cài đặt. Không có client native offline đầy đủ hoặc sync snapshot nền tự động.

## Cấu hình chính xác trên Render

| KEY | VALUE |
| --- | --- |
| APP_ORIGIN | https://gui-khue-nha.onrender.com |
| MONGODB_URI | URI Atlas với database user/password thật; chỉ điền trên Render |
| MONGODB_DB | nhipviec |
| APP_ENCRYPTION_KEY | Khóa mã hóa app đã tạo; giữ ổn định |
| GOOGLE_CLIENT_ID | OAuth client loại Web |
| GOOGLE_CLIENT_SECRET | Secret của cùng client |
| GOOGLE_PICKER_API_KEY | Browser key của Picker, nếu chọn tài liệu từ Drive |
| GOOGLE_CLOUD_PROJECT_NUMBER | Số project Google Cloud, nếu dùng Picker |
| MAINTENANCE_TOKEN | Token riêng cho dọn dữ liệu theo lịch |

Google Cloud → OAuth client loại **Web application**:

- Authorized JavaScript origin: `https://gui-khue-nha.onrender.com`
- Authorized redirect URI: `https://gui-khue-nha.onrender.com/auth/google/callback`
- Nếu OAuth consent đang Testing: thêm account thử ở Test users của Google Cloud. Source không hardcode email.
- Muốn Drive/Calendar: bật Drive API, Picker API, Calendar API và cấp scope bằng nút Kết nối Google trong app. Key Picker giới hạn referrer `https://gui-khue-nha.onrender.com/*`.

Không cần gửi bất kỳ mật khẩu/key thật nào để build APK. Để hỗ trợ lỗi, chỉ cần public URL, JSON /api/health hoặc /api/config không có secrets, và log đã che dữ liệu bí mật.

## Ý nghĩa kết quả kiểm tra

- status=ready, storage=mongodb: backend đã ping được MongoDB tại thời điểm kiểm tra.
- googleConfigured=true: các trường cấu hình cần thiết đã có trên backend, KHÔNG chứng minh credentials đúng hoặc user đã cấp quyền. Cần bấm kết nối và thử thực tế.
- googleConfigured=false: kiểm tra Google client ID/secret, encryption key và Mongo URI trên Render.
- HTTP lỗi / timeout: có thể server chưa deploy, đang cold start, mạng hoặc DB lỗi. Kiểm tra Logs Render. Không thể sửa backend bằng cách chỉ cài lại APK.

## Cập nhật source

Thay đổi Android nằm ở MainActivity.java, ServerAddress.java và versionCode5/versionName1.4.0. Không thay schema DB hoặc Google OAuth ở bản này. Dùng cùng signing backup đã giao trước để build các lần sau; không commit key. Source bao gồm hướng dẫn MongoDB/Render đầy đủ ở HUONG-DAN-TRIEN-KHAI.md và branding/Google ở BAN-1.3-LOGO-GOOGLE.md.

Bản này chỉ có URL công khai của server trong code. Không đọc hoặc nhúng dữ liệu đăng nhập Atlas/Google của bạn vào source. Không tự thay environment variables trên Render.
