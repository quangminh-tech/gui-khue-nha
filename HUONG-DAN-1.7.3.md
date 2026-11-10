# Gửi Khuê Nhã 1.7.3 — Tài liệu, cây công việc và lĩnh vực

## Ba thay đổi chính

1. **Tài liệu:** dán URL rồi bấm **Lưu công việc** là lưu luôn, không cần bấm dấu +. Dấu + vẫn dùng để thêm nhiều link trước khi lưu. Tên có thể để trống; nhận diện Sheets, Docs, Slides, PDF, PPTX theo URL hoặc chọn loại thủ công. Có tên, URL đầy đủ, nguồn, nút mở/sao chép/sửa/gỡ. Tìm và lọc theo loại hoặc Drive.
2. **Việc cha:** thay danh sách phẳng bằng cây mở/thu từng nhánh. Hiện đường dẫn cha đang chọn. Không tự đổi cha khi mở hoặc tìm; chỉ đổi khi bấm chọn. Chặn chính nó và toàn bộ hậu duệ; đổi cha giữ nguyên các việc con. Tìm trong cây là tùy chọn, hỗ trợ không dấu.
3. **Lĩnh vực:** chọn nhanh từ các tên đã dùng hoặc nhập tên mới, tối đa 80 ký tự. Tên mới được thêm vào danh sách khi lưu thành công. Bỏ trống sẽ lưu là Cá nhân. Tạo việc con vẫn lấy lĩnh vực của việc cha làm mặc định; sửa lĩnh vực một việc không tự đổi lĩnh vực các việc khác.

Màn hình xem việc lớn có tùy chọn hiện tài liệu trong việc con. Tài liệu được ghi rõ việc sở hữu và bấm để mở đúng việc con; không nhân bản link vào việc cha. Bấm tên việc vẫn mở màn hình xem/checklist, chỉ bấm Chỉnh sửa mới mở form.

## Vì sao trước đây bấm Lưu mà không có tài liệu?

Ô nhập URL trước đây chưa được ghép vào task; chỉ dấu + mới thêm vào task.links. Nút Lưu bỏ qua ô đang nhập. Bản này ghép link và bước checklist đang nhập vào dữ liệu trước khi lưu. Nếu URL không hợp lệ hoặc lưu thất bại, cửa sổ giữ lại nội dung và báo lỗi. Link trùng trong cùng một việc được gộp; mỗi việc tối đa 30 link.

Ứng dụng lưu metadata: id, tên, URL, loại, Drive file id khi chọn bằng Picker. File gốc nằm ở Drive/website. **Gỡ chỉ gỡ liên kết khỏi công việc, không xóa file trên Google Drive.** Sửa/gỡ trong form phải bấm Lưu công việc; Hủy không ghi thay đổi.

## Cập nhật đúng thứ tự: Render rồi APK

APK tải giao diện từ máy chủ. Chỉ cài APK mới mà Render vẫn chạy source cũ thì giao diện vẫn còn lỗi cũ.

1. Sao lưu dữ liệu bằng chức năng xuất JSON trong Cài đặt và giữ bản sao thư mục source hiện tại. Giữ riêng .env và khóa ký Android cũ.
2. Giải nén **GuiKhueNha-1.7.3-FullProject.zip**.
3. Chép nội dung thư mục GuiKhueNha vào repository đang dùng trên Mac. Giữ thư mục .git của repository, .env và keystore riêng; không chép node_modules/build từ bản cũ.
4. GitHub Desktop: kiểm tra thay đổi rồi Commit và Push. Nếu remote có commit mới, Fetch/Pull và xử lý xung đột trước; không force push.
5. Render → web service **gui-khue-nha** → Manual Deploy → Deploy latest commit. Giữ runtime Docker, Root Directory trống, Dockerfile Path **./Dockerfile.render**. Gói Free vẫn dùng được trong giới hạn của Render.
6. Giữ các biến môi trường MongoDB/OAuth/APP_ENCRYPTION_KEY đang hoạt động. **Không tạo lại database, không đổi khóa mã hóa chỉ vì nâng phiên bản.** Giữ APP_ORIGIN=https://gui-khue-nha.onrender.com, không có dấu / cuối.
7. Chờ service Live. Mở https://gui-khue-nha.onrender.com/api/config và kiểm tra `release` là **1.7.3**.
8. Tải **GuiKhueNha-1.7.3-release.apk** vào điện thoại, bấm cài **Cập nhật**. Không gỡ bản cũ, không xóa dữ liệu ứng dụng.

APK dùng package `vn.nhipviec.mobile`, versionName 1.7.3, versionCode 10, cùng chứng thư ký của các bản trước trong bộ project này. Android chỉ cho cài đè khi app cũ có cùng package/chữ ký và mã phiên bản phù hợp. Nếu báo xung đột chữ ký hoặc không cho cập nhật, giữ nguyên app cũ và chụp thông báo để kiểm tra; đừng gỡ vội vì sổ tay local nằm trên máy.

MongoDB URI, mật khẩu DB, Google client secret và khóa mã hóa chỉ đặt ở backend/Render. Không đặt chúng trong APK.

## Chọn từ Google Drive: cần thêm cấu hình máy chủ

Lúc kiểm tra máy chủ hiện tại, OAuth đã cấu hình nhưng `googlePickerConfigured=false`. Vì vậy đăng nhập Google thành công chưa đủ để bật cửa sổ chọn file. **Dán URL trực tiếp vẫn dùng được, kể cả không đăng nhập.** Link private chỉ mở được khi tài khoản mở có quyền vào file; app không tự đổi quyền chia sẻ.

Nếu muốn nút **Chọn từ Google Drive** hoạt động:

1. Mở https://console.cloud.google.com/ và chọn **đúng project đang chứa Google OAuth client của app**.
2. APIs & Services / API et services → Library / Bibliothèque. Tìm và bật **Google Drive API** và **Google Picker API**. Google Calendar API là API khác, bật Calendar không tự bật hai API này.
3. Credentials / Identifiants → Create credentials / Créer des identifiants → **API key / Clé API**. Tạo key dùng cho Picker, không dùng Google OAuth client secret hay key Gemini thay thế.
4. Mở cấu hình key: Application restrictions → Websites. Thêm cả `https://gui-khue-nha.onrender.com/*` và `https://docs.google.com/*`. Khi chạy dev có Picker, thêm origin local thực tế. API restrictions: chọn Google Picker API và Google Drive API.
5. Google Cloud → Project settings/Project info: lấy **Project number / Numéro du projet**, là dãy số; không lấy project ID dạng gui-khue-nha.
6. Render → Environment, thêm:

| Key | Value |
| --- | --- |
| GOOGLE_PICKER_API_KEY | API key vừa tạo cho Picker |
| GOOGLE_CLOUD_PROJECT_NUMBER | Project number của cùng project OAuth |

7. Save, rebuild/redeploy rồi xem `/api/config`: `googlePickerConfigured=true`. Giá trị true chỉ xác nhận có đủ biến; không xác minh key/API restrictions đúng. Nếu Picker vẫn báo developer key invalid, kiểm tra các API, hai website restrictions, project number cùng project và các khoảng trắng khi dán.
8. App → Cài đặt → kết nối/cấp quyền **Drive** cho đúng tài khoản. Mỗi người dùng Drive riêng. Sau đó mở việc → Chỉnh sửa → Chọn từ Google Drive → chọn file → Lưu công việc.

Không bật upload trong Picker; chỉ chọn file đã có. Với URL dán tay, tên file không tự được lấy từ Drive; nhập tên dễ nhớ hoặc app tạo nhãn. Link Drive dạng chung có thể không cho biết định dạng PDF/PPTX, vì vậy có bộ chọn loại thủ công.

Tài liệu Google đối chiếu ngày 10/11/2026: https://developers.google.com/workspace/drive/picker/guides/web-picker

## Chạy thử trên Mac

Cài Node.js 24 LTS, mở Terminal trong thư mục GuiKhueNha:

```bash
bash RUN-MAC.sh
```

Mở địa chỉ script in ra để dùng bản build sẵn, không bắt buộc MongoDB hay Google cho sổ tay local.

Muốn sửa code và chạy cả frontend/backend:

```bash
bash RUN-MAC.sh dev
```

Script cài pnpm/dependency khi cần, tạo `.env` từ `.env.example`; frontend http://localhost:3000, backend http://localhost:3001. Để Mongo/OAuth trống nếu chỉ thử local. Nếu thử đăng nhập Google trên local phải thêm `http://localhost:3000/auth/google/callback` vào OAuth Web client và đặt APP_ORIGIN trùng origin local.

Kiểm tra source:

```bash
npx tsc --noEmit
npm run test:app
npm run build
```

Build Android trên Mac: JDK17, Android SDK35, Gradle wrapper đi kèm. Dùng khóa ký cũ qua KN_KEYSTORE_PATH, KN_KEYSTORE_PASSWORD, KN_KEY_ALIAS, KN_KEY_PASSWORD (không commit). Xem apps/android/README.md và workflow .github/workflows/android-release.yml. GitHub Actions cần giữ nguyên signing secrets để các APK sau tiếp tục cài đè.

## Thử lại ba lỗi sau cập nhật

- Mở một việc con → Chỉnh sửa → dán link Docs → bấm Lưu ngay, không bấm + → mở lại → thấy URL → tải lại app/trang → URL vẫn còn.
- Mở việc lớn → bật Hiện cả tài liệu trong việc con → thấy link và tên việc con → bấm để vào đúng việc. Thử sửa/gỡ link rồi lưu, xác nhận file Drive vẫn còn.
- Mở việc con → kiểm tra đường dẫn việc cha → mở cây, chọn đúng nhánh → lưu → các việc con bên dưới vẫn giữ nguyên. Không tìm thấy chính nó/hậu duệ trong cây chọn.
- Chọn lĩnh vực cũ, lưu; nhập lĩnh vực mới, lưu; tạo việc khác và chọn lại tên mới.
- Chưa cấu hình Picker: app báo đúng lý do, dán URL vẫn lưu được. Cấp quyền Drive và cấu hình Picker xong mới kiểm tra duyệt file thực tế.

## Phạm vi đã kiểm tra

TypeScript, build web, bộ kiểm thử ứng dụng, kiểm thử tương tác React cho lưu link không bấm +/lưu lỗi/mở lại/đổi cha/sửa-gỡ link/lĩnh vực, schema và lưu local đều qua. Android assembleRelease qua; chữ ký khớp khóa trước; zipalign qua. Kiểm thử Google/Calendar/MongoDB dùng mock provider/database, không thay thế kiểm tra với tài khoản thật.

Chưa cài trên điện thoại thật trong phiên này; chưa truy cập dữ liệu MongoDB hay Drive cá nhân để kiểm tra tích hợp. Không tự push GitHub hoặc deploy Render. Source và APK sẵn để bạn cập nhật theo các bước trên.
