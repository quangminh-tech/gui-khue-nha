> Bản 1.2: ưu tiên HUONG-DAN-TRIEN-KHAI.md ở gốc repo cho Render và APK. Dockerfile mới dùng web bundle build sẵn. Các mô tả APK chưa build dưới đây thuộc phiên bản trước; xem BAO-CAO-KIEM-TRA.md hiện hành.

# Gửi Khuê Nhã — bắt đầu ở đây

Đây là project todo cá nhân, không có phân công/nhóm và không khóa cứng hai email. Mỗi người đăng nhập có dữ liệu riêng. Có hai cách chạy **cùng một frontend**:

1. **Demo Sites:** Vinext/Worker + D1 có sẵn của demo cũ. Dữ liệu mẫu có thể thử trên thiết bị. Google Drive/Calendar chưa cấu hình ở bản demo này. Gemini có route proxy, dùng key tạm trong bộ nhớ phiên và cần đăng nhập Site khi gọi thật.
2. **Tự triển khai:** Vite frontend + Node backend + MongoDB Atlas, dùng `Dockerfile.render`. Có source Google OAuth, Google Picker, thumbnail ảnh riêng tư, đồng bộ một task vào Calendar và Gemini key mã hóa. Cần biến môi trường của chính bạn. Chưa kết nối Atlas/OAuth/Gemini thật trong phiên bàn giao.

Không có file APK đã build. `apps/android` là shell Custom Tab online và workflow build Android; có source widget và nhắc cục bộ theo bản chụp thủ công; chưa đồng bộ nền/push server. Chưa thay đổi audience của demo cũ.

## Thử ngay trên demo

- Hôm nay: tạo việc, xem tiến độ, mở báo cáo.
- Công việc: lọc/tìm, danh sách hoặc bảng, mở việc lớn, thêm việc nhỏ.
- Chi tiết task: checklist, ghi chú, ưu tiên, hạn, lặp hàng ngày/tuần và link tài liệu ngay trong task.
- Cài đặt: đổi tên, chủ đề/nhân vật, cỡ chữ, độ gọn, thứ tự, ngày đầu tuần.
- Cài đặt → Chatbot & API AI → Bật nút hỏi trợ lý → Nhà cung cấp “Báo cáo mẫu” → **Lưu cài đặt** → nút Hỏi trợ lý. Không cần key, không gọi mô hình AI.
- Tập trung: Pomodoro có nghỉ ngắn/dài, chu kỳ, âm lượng và mẫu cấu hình. Bộ đếm giữ khi chuyển màn trong app, chưa bảo đảm chạy nền sau khi đóng trang.

Dữ liệu mẫu lưu localStorage riêng của trình duyệt, không phải MongoDB đã kết nối. Khi có dữ liệu tài khoản thật, frontend dùng API; lỗi version trả 409 và không ghi đè dữ liệu cũ.

## Chạy toàn bộ local

Node >=22.18 và Corepack/pnpm theo package.json. Trên Windows/Mac/Linux:

```sh
corepack enable
corepack pnpm install --frozen-lockfile
```

Copy `.env.example` thành `.env`. Chưa có tài khoản ngoài vẫn chạy demo được. Sau đó:

```sh
corepack pnpm run dev:full
```

Mở `http://localhost:3000`. Frontend port 3000 proxy `/api` và `/auth` tới backend port 3001. `APP_ORIGIN=http://localhost:3000`. Không mở port 3001 làm trang đăng nhập trong cấu hình local này vì Origin/callback phải thống nhất.

Build và chạy chung một server:

```sh
corepack pnpm run build:web
# sửa APP_ORIGIN=http://localhost:3001 nếu chạy trực tiếp cổng này
corepack pnpm run start:api
```

Không có MongoDB: `/api/health` trả `demo-only`, các endpoint dữ liệu riêng tư trả 401. Không tự tạo tài khoản giả cho production.

## Cấu hình MongoDB Atlas

Tạo project và Free cluster trong Atlas. Tạo DB user `readWrite` trên DB `nhipviec`, thêm IP máy/Render vào Network Access. Lấy URI driver rồi đặt `MONGODB_URI`, `MONGODB_DB=nhipviec`. Không đưa URI vào biến `VITE_*`, frontend hay APK.

Backend tự tạo các index được khai báo trong `apps/api/src/store.mjs`. Tasks lưu thành document riêng; checklist và links nhúng trong task. Settings lưu trong workspace. Snapshot workspace ghi bằng MongoDB transaction, vì vậy môi trường MongoDB cần replica set (Atlas có replica set; standalone mongod local cần cấu hình replica set).

## Cấu hình Google

Trong Google Cloud project của bạn:

1. Tạo OAuth consent screen; dùng project test cho kiểm thử. Google có thể yêu cầu test users khi consent screen ở Testing; đây là giới hạn từ Google, app không hardcode email. Với người dùng ngoài test list cần chuẩn bị trạng thái xuất bản/verification phù hợp.
2. Bật Google Drive API, Google Picker API và Google Calendar API.
3. Tạo OAuth client loại Web. Authorized redirect URI chính xác: `<APP_ORIGIN>/auth/google/callback`. Local là `http://localhost:3000/auth/google/callback`.
4. Điền `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
5. Tạo browser API key cho Picker, giới hạn HTTP referrers theo domain của app và giới hạn API phù hợp; đặt `GOOGLE_PICKER_API_KEY`. Key Picker là key dùng phía trình duyệt; khác OAuth client secret, không dùng key server toàn quyền.
6. `GOOGLE_CLOUD_PROJECT_NUMBER` là số project, không phải project ID dạng chữ.
7. Tạo `APP_ENCRYPTION_KEY` 32 byte ngẫu nhiên mã hóa base64. Đây chỉ là chuỗi khóa cấu hình, **không lưu ảnh base64**:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Đăng nhập chỉ xin `openid email profile`. Người dùng vào Cài đặt → Kết nối Google mới xin thêm `drive.file` và `calendar.events`. Google có thể yêu cầu verification cho phạm vi nhạy cảm. Khi consent screen ở Testing, refresh token có thể hết hạn sau 7 ngày với các quyền mở rộng; kết nối lại khi cần.

Chọn file trong từng task qua Picker. App lưu file ID và metadata trong task; Google giữ file gốc. Thumbnail chỉ lấy từ các file user đã chọn; backend kiểm tra owner và quyền trước khi đọc. Không công khai file. Chưa có album upload hoặc đồng bộ toàn bộ Drive.

Calendar: lưu task trước, bấm đồng bộ trong task. Sự kiện lưu vào lịch chính, ID xác định từ owner+task để retry không tạo trùng. Đây là **đồng bộ thủ công một chiều app → Calendar**, chưa hai chiều/webhook, chưa tự đồng bộ mỗi lần sửa. Xóa task không xóa sự kiện Google đã tạo.

## Bật Gemini

Cài đặt → bật trợ lý → chọn Gemini → chọn model hoặc nhập model ID → thêm key → Lưu cài đặt. Gói API do Google AI Studio quản lý; app không mua gói. Tên model phải còn khả dụng cho key của bạn.

Trên Node/Mongo, key được AES-256-GCM mã hóa với APP_ENCRYPTION_KEY rồi lưu collection ai_keys theo owner. Không trả key lại client, không cho vào JSON backup. Trên demo Sites, key chỉ giữ trong bộ nhớ trang và gửi qua HTTPS tới route AI khi user hỏi; không lưu localStorage.

Context mặc định tắt. Bật chia sẻ thì gửi tối đa 40 công việc: title/status/due/priority/checklist. Không gửi ghi chú, nội dung file, ảnh, OAuth token. Backend Node lấy context từ workspace đã xác thực, không tin owner client gửi lên. Chat chỉ đọc/gợi ý, không có tool sửa/xóa task. Chat history chỉ trong phiên mở app.

Giới hạn lượt theo user/ngày ở Node sử dụng increment có điều kiện trong MongoDB; một lượt gọi thất bại cũng có thể tiêu thụ lượt server. Giới hạn ở demo là trong phiên, không thay thế quota/billing của nhà cung cấp. Đặt hạn mức API tại Google để kiểm soát chi phí.

## Deploy Render

Đẩy repo riêng của bạn lên GitHub, tạo Render Web Service từ Dockerfile.render hoặc render.yaml. Frontend và API được serve cùng origin để dùng cookie HttpOnly, không cần CORS public. Điền mọi env trong .env.example bằng dashboard Render, APP_ORIGIN là HTTPS domain thật của service. Thêm các dải outbound IP của Render vào Atlas, cập nhật Google redirect URI/referrer.

Không có tài khoản Render/Atlas của bạn được tạo hay deploy trong phiên bàn giao. Free tier có giới hạn và backend có thể ngủ; không hứa realtime/push liên tục hoặc miễn phí vô hạn. Không chạy cron chỉ trong process Node đang ngủ.

## Dọn 90 ngày

Sites vẫn giữ automation hiện có, không tạo lịch mới. Node có endpoint POST `/api/maintenance/retention`, xác thực `Authorization: Bearer <MAINTENANCE_TOKEN>` và JSON `{"action":"purge-completed-10-days"}`. Gắn một scheduler bên ngoài; có thể gọi hằng ngày nhưng backend chỉ dọn khi cách lần thành công trước ít nhất 90 ngày. Backend khởi tạo mốc bắt đầu khi DB được kết nối lần đầu; lượt dọn đầu tiên chỉ đến hạn sau 90 ngày. Sau đó mỗi đợt cách lần thành công trước ít nhất 90 ngày. Có lock chống hai lượt đồng thời, reparent các việc con còn giữ.

Không dùng TTL cho tasks. TTL chỉ dùng cho phiên đăng nhập, OAuth state và bộ đếm AI tạm. Khi dọn, task/checklist/ghi chú/links trong task rời khỏi DB; file gốc Google không thay đổi. Báo cáo chỉ tính việc còn giữ.

## Kiểm tra và Android

```sh
node node_modules/typescript/bin/tsc --noEmit
corepack pnpm run test:app
corepack pnpm run build:web
```

Tests thực tế: business rules, Pomodoro, retention, link/schema, encryption, mocked Gemini và HTTP chưa đăng nhập. Chưa kiểm thử MongoDB transaction/Google consent/Drive/Calendar/Gemini live vì thiếu tài khoản và secret ngoài. Sau cấu hình phải kiểm thử với hai tài khoản, đảm bảo tài khoản A không truy cập task/file/key của B.

Android: xem `apps/android/README.md`; thay URL Site bằng APP_ORIGIN Render của bạn trước khi build. Debug APK từ workflow chưa được tạo trong phiên này. Để phát hành ổn định cần release keystore riêng và kiểm thử đăng nhập/link/giờ nền trên điện thoại.

Có sẵn workflow `.github/workflows/retention.yml`: chạy kiểm tra hằng ngày lúc 03:10 Việt Nam, backend chỉ xóa khi đủ 90 ngày. Chỉ gửi request khi bạn đã tự cấu hình GitHub secrets `RETENTION_APP_ORIGIN` và `RETENTION_TOKEN`. Chưa có secrets thì workflow không gửi gì. Đây chưa phải lịch đã được kích hoạt trên tài khoản GitHub của bạn; repo Sites không thực thi GitHub Actions.

Nguồn API tham khảo: https://developers.google.com/identity/protocols/oauth2/web-server ; https://developers.google.com/identity/protocols/oauth2 ; https://developers.google.com/workspace/drive/api/guides/api-specific-auth ; https://developers.google.com/workspace/drive/api/reference/rest/v3/files ; https://ai.google.dev/api . Giữ APP_ENCRYPTION_KEY ổn định và riêng tư; đổi/mất khóa thì các token/key đã mã hóa cần được kết nối/nhập lại.

Docker có hai stage: build frontend và runtime Node gọn. Runtime chỉ cài MongoDB driver + Zod; không mang toàn bộ React/Vinext/build tools vào container phục vụ API. Hiện không có Docker daemon để build image trong phiên bàn giao; frontend build và Node HTTP đã được chạy trực tiếp.


Bản 1.1: đọc REGION-EDITION.md cho giao diện theo vùng, quy tắc phần trăm và giới hạn nhắc việc. Android: apps/android/README.md là tài liệu hiện hành.
