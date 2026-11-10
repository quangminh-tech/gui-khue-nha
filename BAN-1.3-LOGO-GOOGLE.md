# Gửi Khuê Nhã 1.3 — logo và Google Connect

## Bản bàn giao này

Toàn bộ source frontend React/Vite, backend Node/MongoDB, project Android và web bundle đã build. APK versionName 1.3.0, versionCode4, dùng cùng khóa ký bản1.2.0 để có thể cập nhật đè. Không cần đưa key ký, URI MongoDB hoặc OAuth secret vào public/APK.

Workspace công việc vẫn mở qua Android Custom Tabs; widget và nhắc cục bộ là native. Chưa có native offline workspace hoặc tự sync thông báo nền từ MongoDB. Không nói rằng chỉ có file APK là đã có backend online: cần URL Render được cấu hình và MongoDB/Google hoạt động.

## Logo ảnh bạn gửi nằm ở đâu

| Vị trí | File / tác dụng |
| --- | --- |
| Ảnh gốc duy nhất | `public/brand/logo-source.png` — đúng ảnh đã gửi, giữ nguyên nội dung |
| Logo web | `public/brand/logo-app.webp` — sidebar và trang báo lỗi Google |
| Favicon | `public/brand/favicon.png` |
| Icon cài web/PWA | `public/brand/icon-192.png`, `icon-512.png`, `apple-touch-icon.png` |
| Ảnh launcher Android | `apps/android/app/src/main/res/drawable-nodpi/brand_logo.webp` |
| Icon màn hình chính | Android `res/mipmap-mdpi` đến `mipmap-xxxhdpi` |
| Adaptive icon | `res/mipmap-anydpi-v26/ic_launcher.xml`, `ic_launcher_round.xml` |
| Manifest Android | `android:icon=@mipmap/ic_launcher`, `roundIcon=@mipmap/ic_launcher_round` |

`public/` không tự trở thành launcher icon của APK. Web và Android có đường dẫn tài nguyên riêng; bản này đã đồng bộ sẵn. Ảnh chân dung dùng làm logo/launcher; biểu tượng thông báo nhỏ là hình bướm đơn sắc vì Android hiển thị icon thông báo theo dạng mask. Nền/chibi Genshin trong dashboard giữ nguyên.

Khi muốn đổi logo: thay `public/brand/logo-source.png`, chạy `bash scripts/sync-logo.sh` (cần ImageMagick), build lại web và APK. Có thể dùng Android Studio > Image Asset để tạo icon Android nếu không có ImageMagick. Chỉ thay file trên Render sẽ đổi web, không đổi launcher icon của APK đã cài; cần APK mới cùng chữ ký và versionCode cao hơn. Một số launcher cache icon, có thể cần khởi động lại launcher/điện thoại sau cập nhật.

## Các nút kết nối Google

- Trang chính: nút ở thanh trên và khung dữ liệu demo.
- Cài đặt: thẻ Google Drive & Calendar có trạng thái riêng của từng quyền.
- APK launcher: nút **Kết nối Google**, mở backend của URL Render bạn đã nhập.

Flow thực tế: `/auth/google?next=connect` → chọn tài khoản Google → callback tạo phiên đăng nhập → chuyển tiếp `/auth/google?mode=connect` → đồng ý quyền Drive/Calendar → về sổ tay. Google có thể hiện hai lượt xác nhận. Đăng nhập không tự đồng nghĩa đã cấp quyền Drive/Calendar. Người dùng có thể từ chối một phần; UI chỉ đánh dấu quyền được Google trả về. Khi đã đăng nhập, bước grant phải dùng cùng tài khoản, không được thay account giữa chừng.

Backend dùng cookie HttpOnly, state, PKCE và callback cố định; không cho next tùy ý/open redirect. Token mã hóa bằng APP_ENCRYPTION_KEY trong MongoDB. Nút không bao giờ yêu cầu nhập mật khẩu Google. Nếu chưa cấu hình OAuth, nút vẫn hiện nhưng mở hướng dẫn, không tạo trạng thái kết nối giả. `/api/config` chỉ trả boolean/tên biến còn thiếu, không trả giá trị secret.

## Chạy Mac

Sau giải nén, vào thư mục `GuiKhueNha`:

```sh
bash RUN-MAC.sh
```

Mở http://localhost:3000 để thử bản build không cần cài dependency. Google thật chưa hoạt động ở chế độ này.

Chạy source:

```sh
bash RUN-MAC.sh dev
```

Hoặc cài dependencies bằng phiên bản pnpm trong package.json, tạo `.env` từ `.env.example` rồi:

```sh
npm run dev
```

Lệnh mặc định giờ chạy Vite + Node API, không chạy Vinext/Sites. Frontend3000, API3001. Local OAuth callback là `http://localhost:3000/auth/google/callback`; APP_ORIGIN cùng origin. Chạy production bundle tại một cổng cần APP_ORIGIN đúng cổng đó.

```sh
npm run build
npm start
```

Các file framework/Sites cũ giữ để tham khảo; không dùng làm backend MongoDB chính. File nhận diện Site cũ không đưa vào gói phát hành này.

## Deploy Render và kết nối thật

Đọc HUONG-DAN-TRIEN-KHAI.md. Docker runtime dùng Node24, API dependencies lockfile và web build sẵn `apps/web/dist`. Khi sửa UI, chạy `npm run build` trước khi commit/push. Trên Render dùng Dockerfile.render, Free, health `/api/health`.

Tối thiểu cần APP_ORIGIN, MONGODB_URI, MONGODB_DB=nhipviec, APP_ENCRYPTION_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET. Để Picker hoạt động cần GOOGLE_PICKER_API_KEY và GOOGLE_CLOUD_PROJECT_NUMBER; bật Drive/Picker/Calendar APIs. Authorized redirect URI chính xác: `https://DOMAIN-RENDER-CUA-BAN/auth/google/callback`. Không có dấu / cuối trong APP_ORIGIN.

Trong OAuth Testing, thêm tài khoản thử ở Google Cloud. Source không hardcode hai email. Mỗi tài khoản đăng nhập có owner riêng trong DB. Không chia sẻ mật khẩu database cho người dùng app. Không gửi secret trong chat hoặc commit .env. Bản này không đọc/nhúng file atlas-credentials.env của cuộc trao đổi khác vào APK/source.

Calendar hiện sync thủ công một chiều task → lịch chính; mở từng việc → Lưu → Đồng bộ vào Google Calendar. Không phải đồng bộ hai chiều tự động. Drive chỉ chọn/lưu link file trong task, không upload file. Gemini chỉ gọi khi đã thêm key, chọn model và bật gửi câu hỏi; không cần AI để dùng todo.

## Cài APK cập nhật

1. Đưa source mới lên Render, kiểm tra `/api/health` báo MongoDB ready và googleConfigured=true.
2. Cài `GuiKhueNha-1.3.0-release.apk` đè bản1.2.0 bằng cùng chữ ký.
3. Mở app, nhập/kiểm tra URL Render, bấm Kết nối Google.
4. Sau khi đăng nhập/cấp quyền, tạo việc, reload và thử tài khoản thứ hai.
5. Cấp quyền thông báo, gửi snapshot từ Cài đặt và thêm widget nếu cần.

Khóa ký vẫn là gói backup đã giao ở bản1.2. Không cần key mới. Không gỡ app chỉ để đổi icon nếu Android cho cập nhật đè. Đổi server sẽ xóa snapshot nhắc cục bộ để tránh nhầm dữ liệu. Đổi account trong web không tự xóa snapshot native; gửi lại hoặc xóa bản nhắc.

## Kiểm tra và giới hạn

TypeScript, build web, bộ kiểm tra app và flow OAuth với provider/database giả lập đã qua. Mock flow kiểm tra hai bước login/consent, PKCE/state, chặn đổi tài khoản, redirect cố định, trạng thái từng quyền và token mã hóa. Có kiểm tra browser cho logo, nút Google và dialog thiếu cấu hình. APK release build/lint/signature được kiểm tra riêng trong ANDROID-BUILD-RESULT.txt.

Chưa có tài khoản Render/Atlas/Google runtime thực tế của người dùng trong phiên này, nên chưa chứng minh live login/DB/Picker/Calendar/Gemini đã chạy. Chưa cài thử APK trên điện thoại thật. Kiểm tra build và mock không thay thế kiểm thử dịch vụ và thiết bị thật.
