# Web1.5 — bắt đầu bằng sổ tay trống, dùng APK1.4 hiện có

## Vì sao bản trước vẫn hiện mẫu?

Frontend trước khởi tạo bằng appDemo và khi chưa đăng nhập còn đọc bản demo trong localStorage. Tài khoản mới chưa có workspace cũng giữ trạng thái demo. Đây là dữ liệu frontend, không phải APK tự chứa database hay người dùng khác chia sẻ Drive. APK mở web trên Render, nên cài lại APK mà Render còn bundle cũ thì vẫn thấy mẫu.

## Bản đã sửa

- Khởi tạo bằng sổ tay trống, chưa đăng nhập hiển thị 0việc và nút Google.
- Không tự đọc lại kho demo cũ ở mỗi lần mở.
- Tài khoản mới trả data=null bắt đầu trống; lấy tên Google khi API /api/me sẵn sàng.
- Tài khoản có workspace vẫn lấy dữ liệu hiện có; không xóa việc trong MongoDB.
- Chưa đăng nhập không tạo/lưu công việc chính thức. Có thể chủ động chọn Xem thử dữ liệu mẫu.
- Mẫu là phiên xem thử riêng, thay đổi chỉ lưu trên thiết bị vào một key riêng. Bỏ nút Lưu mẫu lên tài khoản; không được dùng demo để ghi đè workspace online.
- Thoát mẫu/tải lại sẽ lấy workspace tài khoản hoặc trở về sổ tay trống. Không tự import mẫu vào DB.

Nếu trước đây đã bấm Lưu mẫu và các task mẫu đã lưu thành dữ liệu trong MongoDB, bản sửa vẫn giữ chúng vì không thể tự phân biệt với việc thật bạn đã chỉnh. Hãy xuất sao lưu và xóa những task mẫu không cần ngay trong tài khoản của bạn. Không có thao tác xóa toàn DB hoặc xóa việc của account khác trong bản cập nhật này.

## Bạn cần làm gì ngay

1. Giải nén source1.5, cập nhật nội dung vào repo gui-khue-nha đang deploy. Giữ thư mục .git của repo và file .env riêng; không commit secret.
2. Source đã có apps/web/dist build sẵn. Dockerfile.render hiện tại dùng bundle này, không cần sửa environment variables hay đổi DB chỉ vì cập nhật mẫu.
3. Commit và push main từ thư mục repo trên Mac:

```sh
git add .
git commit -m "Start personal workspace empty; make demo opt-in"
git push origin main
```

4. Render thường tự deploy khi push; nếu tắt auto-deploy, chọn Manual Deploy → Deploy latest commit. Đợi service Live.
5. Mở lại https://gui-khue-nha.onrender.com hoặc tải lại trang bên trong APK. Chưa đăng nhập phải thấy 0việc, không còn danh sách mẫu tự hiện.
6. Cấu hình Google OAuth một lần trên Render, rồi mỗi người bấm Kết nối Google bằng account của mình. Tạo task thử, reload và kiểm tra cùng account trên thiết bị khác.

## Không cần build lại APK để sửa mẫu

Dùng APK1.4 hiện có (mặc định https://gui-khue-nha.onrender.com). Giao diện task là web do Render phục vụ; bản này sửa web. Chỉ cần build/cập nhật APK khi đổi icon/launcher/widget/local notification/native code. Source Android vẫn versionName1.4.0/versionCode5 và cùng signing key trước đó; đây không phải APK1.5 mới.

Nếu muốn tự build APK trên Mac: Android Studio → mở apps/android → SDK35/JDK17. Debug: ./gradlew :app:assembleDebug. Release: khai báo key ký qua biến môi trường theo apps/android/README.md rồi ./gradlew :app:assembleRelease, dùng đúng key cũ và tăng versionCode cho lần native update mới. Không đưa URI MongoDB hoặc Google secret vào APK.

## Điều kiện để lưu thật

Render phải nối Atlas, /api/health trả status=ready và storage=mongodb. APP_ORIGIN=https://gui-khue-nha.onrender.com. Cần Google OAuth client loạiWeb, GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET, APP_ENCRYPTION_KEY ổn định. Redirect URI: https://gui-khue-nha.onrender.com/auth/google/callback. Chưa cấu hình OAuth thì chỉ bấm nút chưa đủ đăng nhập; thiếu cấu hình sẽ hiện hướng dẫn.

Mỗi account có workspace/Drive/Calendar riêng. MongoDB và Render là hạ tầng dùng chung nhưng backend lấy owner từ session; không lấy owner người khác từ form. Google Client ID/Secret là cấu hình của app, không phải một tài khoản Google dùng chung.

## Kiểm tra đã thực hiện

TypeScript và build web thành công. Toàn bộ test app qua, thêm kiểm tra empty new account/data=null, giữ nguyên existing account. Browser: khởi động0task, chặn tạo task khi chưa login, chọn mẫu mới thấy dữ liệu, thoát mẫu về0task. Các test Google dùng provider/database giả lập, chưa chứng minh Google live hay MongoDB live trên tài khoản của bạn. Không chạy cài lại APK hoặc thiết bị thật vì native không thay đổi.
