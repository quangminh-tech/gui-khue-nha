> Bản1.3: xem BAN-1.3-LOGO-GOOGLE.md cho logo APK và nút Google mới; root npm run dev/build đã chuyển sang Vite + Node.

# Gửi Khuê Nhã — cài APK, MongoDB Atlas và Render

Bản 1.3 cho sử dụng cá nhân, mỗi người đăng nhập Google và có dữ liệu riêng. Không cần tạo 2 email trong source. Các bước dưới đây tự tạo tài nguyên trên tài khoản của bạn; source không chứa URI, mật khẩu hoặc OAuth secret thật.

## A. Tạo MongoDB Atlas Free

1. Vào https://cloud.mongodb.com, tạo tài khoản hoặc đăng nhập. Tạo Project tên `GuiKhueNha`.
2. Chọn Create / Build a Database → **Free / M0**. Kiểm tra rõ Free trước khi xác nhận, không chọn Flex/Dedicated trả phí.
3. Provider AWS; chọn Singapore nếu có Free tại vùng đó; nếu không, chọn Free ở vùng gần và dùng vùng Render tương ứng. Tên cluster: `khue-nha`.
4. Security → Database Access (giao diện mới có thể là Database & Network Access) → Add New Database User → Password. Username `khue_nha_app`; tự tạo mật khẩu mạnh và lưu riêng. User này KHÁC tài khoản đăng nhập Atlas, cũng không phải hai người dùng app.
5. Quyền: Add Specific Privileges → role `readWrite` cho database `nhipviec` (mọi collection trong DB đó). Không cần Atlas Admin hay quyền mọi database.
6. Network Access → Add IP Address → Add My Current IP Address nếu muốn kết nối từ Mac. Khi có service Render, thêm các CIDR outbound của Render ở bước C. Không cần mở `0.0.0.0/0`.
7. Cluster → Connect → Drivers → Node.js → copy URI. Mẫu (không phải thông tin thật):

```text
mongodb+srv://khue_nha_app:<MAT_KHAU_DA_URL_ENCODE>@<HOST_CUA_ATLAS>/nhipviec?retryWrites=true&w=majority
```

Thay đúng mật khẩu và hostname được Atlas cấp. Ký tự đặc biệt trong mật khẩu phải percent-encode khi đưa vào URI. Không đưa URI lên GitHub hoặc gửi ảnh chứa URI. Nếu không biết encode, dùng mật khẩu ngẫu nhiên dài chỉ gồm chữ/số để tránh lỗi cú pháp.

Không phải tự viết SQL hay import schema. Backend tự tạo collection/index khi khởi động và ghi dữ liệu. `nhipviec` là tên DB do `MONGODB_DB` chọn; Atlas sẽ hiện các collection sau khi app chạy/ghi lần đầu. Không dùng SQLite/local JSON làm dữ liệu chính thức trên Render.

Free Atlas hiện có 0,5 GB, tối đa 500 kết nối; app dùng pool tối đa 10 kết nối. Hợp với dữ liệu text của app nhỏ, không lưu file ảnh/PDF/base64. Free cluster có thể tạm dừng sau thời gian không hoạt động; theo dõi trang Usage và xuất sao lưu khi cần. Không cam kết miễn phí vô hạn hoặc SLA.

## B. Đưa source lên GitHub private từ Mac

Giải nén project, mở Terminal trong thư mục `GuiKhueNha` có `Dockerfile.render`, `render.yaml`, `apps`, `package.json`.

Trên GitHub tạo repository **Private**, ví dụ `gui-khue-nha`; không thêm README lúc tạo repo trống. Sau đó chạy từng lệnh (thay URL repo bằng repo của bạn):

```sh
git init
git add .
git commit -m "Gui Khue Nha Android release"
git branch -M main
git remote add origin https://github.com/TEN_GITHUB/gui-khue-nha.git
git push -u origin main
```

GitHub sẽ yêu cầu xác thực trên máy của bạn. Không dùng mật khẩu GitHub cũ thay token; có thể dùng GitHub Desktop nếu dễ hơn. Kiểm tra repo có `apps/web/dist/index.html` và `apps/api/package-lock.json`. Bản này cố ý commit web bundle để Render build nhẹ. Source đã ignore `.env`, node_modules, keystore và Android build cache. **Không đẩy gói backup ký APK hoặc file mật khẩu lên repo, kể cả private.**

Chưa cần Node, pnpm hay Docker trên Mac nếu chỉ đẩy source đã build sẵn lên Render.

## C. Tạo Web Service Render Free

1. Vào https://dashboard.render.com, đăng nhập → New → **Web Service**.
2. Kết nối GitHub và chọn repository private vừa tạo.
3. Thiết lập:

| Mục | Giá trị |
| --- | --- |
| Name | tên duy nhất, ví dụ `gui-khue-nha-<ten-ban>` |
| Branch | `main` |
| Region | Singapore nếu có, ưu tiên gần Atlas |
| Language / Runtime | **Docker** |
| Root Directory | để trống nếu Dockerfile ở gốc repo |
| Dockerfile Path | `./Dockerfile.render` |
| Docker Build Context | gốc repo / `.` |
| Instance Type | **Free** |
| Docker Command | để trống, dùng CMD trong Dockerfile |
| Health Check Path | `/api/health` |

Không tạo Static Site cho backend. Không cần tạo PostgreSQL, Redis hay persistent disk. Dockerfile này dùng Node 24, cài dependencies API từ lockfile, lấy giao diện build sẵn; không chạy helper Linux/Vinext hay cài toàn bộ frontend trên Render.

4. Mở Environment, thêm `MONGODB_URI`, `MONGODB_DB=nhipviec`, `APP_ENCRYPTION_KEY`, `APP_ORIGIN`. URL được Render cấp sẽ dạng `https://ten-thuc-te.onrender.com`; copy đúng URL của service, không dùng URL mẫu trong tài liệu. `APP_ORIGIN` không có dấu `/` cuối.
5. Tạo 2 chuỗi riêng trên Mac bằng Node (nếu chưa có Node, cài Node 24 LTS từ nodejs.org):

```sh
node scripts/generate-config.mjs
```

Copy `APP_ENCRYPTION_KEY` và `MAINTENANCE_TOKEN` vào ô Environment riêng tương ứng. Đây là khóa cấu hình, không phải ảnh base64. Không đưa output lên GitHub. **Giữ APP_ENCRYPTION_KEY ổn định**: đổi mất khóa cũ sẽ không giải mã được token Google/Gemini đã lưu.
6. Nếu chưa thấy URL trước lần deploy đầu, tạo service trước rồi copy URL, bổ sung APP_ORIGIN và redeploy. Khi chưa có OAuth, app có thể ở demo-only cho phần đăng nhập.
7. Vào service → **Connect → Outbound**, copy toàn bộ IP ranges (CIDR). Vào Atlas → Network Access → Add IP Address và thêm từng CIDR đó. Đây là IP của backend, không phải IP điện thoại. Thêm IP Mac chỉ khi cần kết nối DB từ Mac.
8. Save / Deploy. Nếu lần đầu fail vì chưa allow IP, sau khi thêm CIDR chọn Manual Deploy → Deploy latest commit.

## D. Google login — bắt buộc để lưu workspace cá nhân

Chỉ có MongoDB + Render chưa đủ đăng nhập: app sử dụng Google OAuth. Drive/Calendar xin thêm quyền sau trong Cài đặt.

1. Vào https://console.cloud.google.com, tạo project `GuiKhueNha`.
2. Google Auth Platform → Branding / Audience / Data Access: đặt tên app, support email và developer email của bạn. Audience **External**, giai đoạn **Testing** để dùng cá nhân.
3. Trong Test users thêm hai email của người dùng thử. Đây là danh sách do Google quản lý trong giai đoạn Testing, không khóa email trong source. Nếu muốn mở cho nhiều người, phải xem điều kiện Publishing/Verification của Google.
4. Clients → Create Client → **Web application**. Không chọn Android client: APK dùng trình duyệt và OAuth callback trên backend.
5. Authorized JavaScript origins: đúng origin Render.
6. Authorized redirect URI: đúng URL dưới đây, thay domain bằng URL service thật:

```text
https://TEN-THUC-TE.onrender.com/auth/google/callback
```

7. Copy Client ID và Client Secret vào Render Environment rồi Save / Redeploy.

| Biến Render | Điền gì | Cần lúc nào |
| --- | --- | --- |
| `APP_ORIGIN` | URL HTTPS Render, không `/` cuối | Luôn |
| `MONGODB_URI` | URI Atlas với user/password đã điền | Luôn |
| `MONGODB_DB` | `nhipviec` | Luôn |
| `APP_ENCRYPTION_KEY` | Chuỗi 32 byte do script tạo | Luôn |
| `GOOGLE_CLIENT_ID` | Client ID loại Web của Google | Đăng nhập |
| `GOOGLE_CLIENT_SECRET` | Secret cùng OAuth client | Đăng nhập |
| `GOOGLE_PICKER_API_KEY` | Browser key có giới hạn referrer | Chọn file trong Drive |
| `GOOGLE_CLOUD_PROJECT_NUMBER` | Số project Google, không phải tên project | Chọn file trong Drive |
| `MAINTENANCE_TOKEN` | Chuỗi độc lập do script tạo | Dọn dữ liệu tự động |

Không phải điền `PORT` trên Render: nền tảng tự cấp PORT, backend đọc biến đó và listen `0.0.0.0`. Không đặt các secret vào biến `VITE_*` hoặc APK.

Để dùng Drive/Calendar:
- APIs & Services → Library → bật **Google Drive API**, **Google Picker API**, **Google Calendar API**.
- Data Access cấu hình các scope `openid`, `email`, `profile`, `drive.file`, `calendar.events` theo consent. App chỉ xin thông tin đăng nhập lúc login; nút Kết nối Google mới xin quyền Drive/Calendar.
- Credentials → API key cho Picker: Application restrictions = Websites/HTTP referrers; cho phép `https://TEN-THUC-TE.onrender.com/*`; giới hạn API theo Google Picker API / Drive API cần dùng. Key này được gửi trình duyệt cho Picker; không dùng server key toàn quyền.
- Project Settings → copy **Project number** vào GOOGLE_CLOUD_PROJECT_NUMBER.
- Trong app → Cài đặt → Kết nối Google → cấp quyền bằng cùng tài khoản đang đăng nhập.

Trong giai đoạn OAuth Testing, Google có thể yêu cầu kết nối lại khi refresh token hết hạn (thường 7 ngày với quyền mở rộng). Calendar hiện đồng bộ thủ công một chiều: lưu việc rồi nhấn Đồng bộ vào Google Calendar để tạo/cập nhật sự kiện trên lịch chính. Chưa tự đọc thay đổi ngược từ Google. Các link file được chọn/gắn trong từng task, không upload file lên server.

## E. Xác nhận backend đã sẵn sàng

Mở `https://URL-RENDER-CUA-BAN/api/health`. Kỳ vọng:

```json
{"status":"ready","storage":"mongodb","googleConfigured":true}
```

`demo-only` hoặc `googleConfigured:false` nghĩa là cấu hình chưa đầy đủ, chưa coi là đã liên kết xong. Sau đó mở trang app trên trình duyệt Mac → Đăng nhập Google. Chọn Bắt đầu trống hoặc Lưu mẫu khi chưa có workspace. Tạo việc thử, reload, mở lại bằng cùng tài khoản trên máy khác để kiểm tra dữ liệu. Tài khoản thứ hai phải không thấy việc tài khoản thứ nhất.

## F. Cài APK trên Android

1. Tải file `GuiKhueNha-1.3.0-release.apk` về điện thoại Android. Không cài APK lên iPhone hay Mac.
2. Mở file, cho phép trình duyệt/ứng dụng Files cài ứng dụng từ nguồn này nếu Android hỏi. Đây là bản cài trực tiếp, không phải Play Store; ứng dụng chưa có uy tín Play Protect như app phát hành rộng rãi. Không tắt Play Protect toàn máy nếu gặp cảnh báo; đọc kỹ cảnh báo và nguồn file.
3. Mở **Gửi Khuê Nhã** → **Nhập / đổi địa chỉ Render** → dán URL thật (`https://...onrender.com`) → Lưu.
4. Nhấn **Mở sổ tay cá nhân** → đăng nhập Google của chính người dùng. APK dùng Chrome/Custom Tabs để hiển thị workspace; điện thoại cần trình duyệt và Internet.
5. Cấp quyền thông báo; trong web app Cài đặt → Popup & âm thanh → **Gửi việc sang bản Android**, xác nhận tên/số việc. Sau đó quay về app launcher → **Ghim widget màn hình chính** hoặc nhấn giữ màn hình chính → Widgets.
6. Khi sửa/xóa/hoàn thành việc, gửi lại bản nhắc để widget và lịch nhắc cục bộ cập nhật. Bản nhắc là snapshot thủ công tối đa 30 việc, không tự sync nền. Nếu đổi tài khoản web trên cùng điện thoại, xóa bản nhắc cũ hoặc gửi bản mới; đăng xuất web không tự xóa snapshot native. Đổi URL máy chủ trong native sẽ xóa snapshot cũ.

Thông báo cục bộ dùng lịch inexact, có thể trễ do tiết kiệm pin/Doze/force stop. Giờ yên lặng theo Việt Nam; không xin quyền overlay hoặc exact alarm. Đây không phải popup nổi mọi lúc trên ứng dụng khác. Nhạc chuông được tổng hợp riêng, không phải âm thanh Genshin chính thức. Nhân vật/ảnh là fan art; app này dành cho cá nhân.

Bản APK release có chữ ký để cài/cập nhật; chưa thử cài trên thiết bị Android thật trong môi trường bàn giao. Không coi việc build APK là đã kiểm thử đăng nhập Google/MongoDB hoặc nhắc trên từng hãng máy.

## G. Giữ khóa ký và cập nhật APK

Gói `GuiKhueNha-Signing-Backup.zip` giao riêng chứa keystore và thông tin ký. Tải giữ riêng ít nhất hai bản; không upload GitHub hay chia sẻ với người cài app. Khi mất key, bản APK mới không thể cập nhật đè bản cũ bằng chữ ký khác. Debug APK cũ cùng package nhưng khác chữ ký có thể phải gỡ trước; gỡ app xóa bản nhắc native, dữ liệu trên MongoDB vẫn còn.

Trong GitHub repository → Settings → Secrets and variables → Actions, thêm secret KN_KEYSTORE_BASE64 (bytes keystore encode base64), KN_KEYSTORE_PASSWORD, KN_KEY_PASSWORD. Alias `khue-nha`. Dùng workflow **Build signed Android APK**. Tăng `versionCode` trong apps/android/app/build.gradle ở mỗi lần cập nhật. Không hardcode password vào build.gradle.

Trên Mac có Android Studio/JDK17/SDK35/Gradle8.11.1, đọc apps/android/README.md. Gradle wrapper được tạo nếu có trong source; dùng ./gradlew thay gradle. Bản app không cần URI DB hoặc key ký trên điện thoại người dùng.

## H. Dọn dữ liệu đúng quy tắc

Backend chỉ xóa **mọi việc đã hoàn thành hơn 10 ngày**, kèm checklist/ghi chú/link của việc đó; giữ việc chưa xong và file gốc Drive. Chu kỳ purge được backend chặn **90 ngày/lần**, không xóa hàng ngày. Các việc con còn sống được giữ/reparent theo logic retention.

Workflow `.github/workflows/retention.yml` kiểm tra mỗi ngày, nhưng chỉ purge khi hết 90 ngày. Trong GitHub Actions secrets thêm RETENTION_APP_ORIGIN (URL Render) và RETENTION_TOKEN (đúng MAINTENANCE_TOKEN trên Render); bật workflow nếu repo mới chưa cho schedule chạy. Không cần Render Cron trả phí. GitHub schedule có thể trễ/không chạy nếu bị tắt; xem Actions để theo dõi. Không công khai token. Dữ liệu app tự dọn không thay thế việc sao lưu.

## I. Hạn mức miễn phí và các lỗi thường gặp

Render Free ngủ sau 15 phút không có truy cập, mở lại có thể mất khoảng một phút. Backend ngủ không phải lịch nhắc native đã import; còn web popup cần trang đang mở. Render Free không có ổ đĩa bền vững, DB phải ở Atlas. Render có hạn mức giờ/bandwidth/build; xem Usage, không tự nâng plan hoặc thêm dịch vụ tính phí. Provider khuyến nghị Free cho hobby/testing, không có bảo đảm vận hành 24/7. App cá nhân nhỏ có thể dùng theo hạn mức này.

| Lỗi | Kiểm tra |
| --- | --- |
| Render báo MongoDB connection failed | Atlas user/password, URI encode, cluster đang chạy, CIDR outbound đã allow |
| Build không thấy package-lock.json | Đã đẩy apps/api/package-lock.json vào GitHub chưa |
| Docker COPY apps/web/dist failed | Đã commit bundle chưa, .dockerignore có unignore dist chưa |
| App hiện demo-only | Thiếu MONGODB_URI hoặc chưa đăng nhập; xem /api/health |
| Google redirect_uri_mismatch | APP_ORIGIN, callback Google và URL thật phải giống chính xác |
| Google access_denied | Tài khoản nằm trong Test users khi consent đang Testing, quyền app đã cấu hình |
| Lưu task lỗi 403 | APP_ORIGIN không đúng origin thực tế hoặc thừa dấu / cuối |
| Picker bị chặn | APIs đã bật, browser key/referrer/project number đúng, cùng tài khoản đang dùng |
| APK mở app cũ | Kiểm tra URL trong launcher, không dùng URL demo ChatGPT; nâng versionCode + cùng chữ ký |
| Không có thông báo | Quyền Android/kênh âm thanh/quiet hours, đã gửi snapshot chưa, giờ nhắc phải còn ở tương lai |

## Nguồn chính thức kiểm tra ngày 10/11/2026

- Atlas Free: https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/
- Atlas limits: https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/
- DB users: https://www.mongodb.com/docs/atlas/security-add-mongodb-users/
- Render Docker: https://render.com/docs/docker
- Render Free: https://render.com/docs/free
- Render outbound IP: https://render.com/docs/outbound-ip-addresses
- Google OAuth: https://developers.google.com/identity/protocols/oauth2/web-server
- Google Picker: https://developers.google.com/workspace/drive/picker/guides/overview
