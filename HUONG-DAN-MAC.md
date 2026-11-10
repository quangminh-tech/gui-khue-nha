# Gửi Khuê Nhã — chạy thử trên Mac

Gói gồm mã nguồn frontend/backend/Android và bản web build sẵn. Dùng trên Mac Apple Silicon hoặc Intel có phiên bản macOS được Node.js hỗ trợ. Khuyến nghị Node.js 24 LTS. Môi trường bàn giao kiểm tra bằng Linux + Node 24; chưa chạy trên máy Mac thật.

## 1. Cài Node.js một lần

Vào https://nodejs.org/en/download, chọn Node.js 24 LTS và macOS Installer (.pkg), cài như ứng dụng bình thường. Nếu chọn bản nén binary, chọn ARM64 cho M1/M2/M3/M4 hoặc x64 cho Intel. Mở lại Terminal rồi chạy:

```sh
node -v
```

Nên thấy `v24.x.x`. Mã nguồn yêu cầu ít nhất Node 22.18. Nếu macOS quá cũ khiến bộ cài từ chối, cần nâng cấp macOS lên phiên bản được hỗ trợ trước; không cần cài Homebrew chỉ để thử app này.

## 2. Giải nén rồi mở Terminal

Giải nén `GuiKhueNha-Android-Render-Source.zip`. Thư mục bên trong tên `GuiKhueNha`, có file `RUN-MAC.sh`. Nếu để trong Downloads:

```sh
cd ~/Downloads/GuiKhueNha
bash RUN-MAC.sh
```

Nếu giải nén ở chỗ khác: gõ `cd ` (có dấu cách), kéo thư mục GuiKhueNha từ Finder vào Terminal rồi Enter; tiếp theo gõ `bash RUN-MAC.sh`.

Khi Terminal báo sẵn sàng, mở **http://localhost:3000** bằng Chrome hoặc Safari. Giữ cửa sổ Terminal mở khi dùng. Dừng bằng **Control+C**. Lần sau chạy lại hai lệnh trên. Không mở `index.html` trực tiếp bằng Finder.

Bản demo dùng web đã build sẵn, không cần `npm install`, pnpm, Docker, MongoDB, đăng nhập hay API key. File `MO-APP.command` là lối mở tùy chọn; nếu Finder chặn, dùng lệnh Terminal ở trên.

## 3. Những gì thử được

- Mặc định Liyue–Zhongli/Morax. Cài đặt → nhân vật → Lưu cài đặt để đổi cảnh và biểu tượng vùng.
- Dashboard việc lớn/nhỏ, % tiến độ, deadline, quá hạn, báo cáo.
- Tạo/sửa việc, checklist, ghi chú, ưu tiên, lịch lặp; dán link Sheets/Docs/Slides/PDF/website vào task.
- Lịch trong app, Pomodoro, cỡ chữ và bố cục.
- Cài đặt → Popup & âm thanh → Nghe thử / Xem thử popup. Nhắc tự động cần trang mở và hết giờ yên lặng. Chạm trang trước để trình duyệt cho phát âm thanh.
- Chatbot: bật trợ lý, chọn Báo cáo mẫu, Lưu. Đây là báo cáo theo quy tắc, không gọi Gemini.

Dữ liệu mẫu và thay đổi demo nằm trong localStorage của đúng trình duyệt + địa chỉ/cổng đang dùng. Reload vẫn còn, xóa dữ liệu trình duyệt sẽ mất. Xuất JSON trong Cài đặt nếu cần giữ bản sao. Bản demo không ghi MongoDB và không đồng bộ giữa hai người. Dùng `localhost` nhất quán; `127.0.0.1` hoặc cổng khác có kho localStorage khác.

Google Drive/Calendar thật và Gemini API chưa hoạt động trong chế độ demo. Có thể dán link, mở trang tạo lịch Google và tự Lưu sự kiện. Không có upload tài liệu. Nhạc chuông tổng hợp riêng lấy cảm hứng không khí game, không phải bản ghi Genshin chính thức.

## 4. Chạy mã nguồn để sửa giao diện/backend (tùy chọn)

Cần Internet để cài dependency lần đầu:

```sh
bash RUN-MAC.sh dev
```

Lệnh này dùng pnpm đúng phiên bản trong project, tạo `.env` từ mẫu nếu chưa có, chạy Vite cổng 3000 và Node API cổng 3001. Nếu đã có `node_modules` nhưng cài lỗi, chạy lại:

```sh
npx --yes pnpm@11.25.0 install --frozen-lockfile
bash RUN-MAC.sh dev
```

Dừng bản demo bằng Control+C trước khi chạy dev. Không dùng `npm run dev` hoặc `npm run install:ci` cho cách chạy Mac này: đó là đường chạy bản hosted, có helper phục vụ Linux. Mở http://localhost:3000; sửa frontend trong `features/app`, `features/notifications`, `components`, `lib`. Backend trong `apps/api/src`. Không sửa file bundle trong `apps/web/dist`.

Muốn cập nhật lại demo build sẵn sau khi sửa:

```sh
npx --yes pnpm@11.25.0 run build:web
bash RUN-MAC.sh
```

## 5. Kết nối MongoDB/Google sau khi thử giao diện

Đọc `docs/START-HERE.md`, `docs/MONGODB-DESIGN.md`, `.env.example`. Điền MongoDB Atlas, khóa mã hóa và OAuth của chính bạn trong `.env`, rồi chạy chế độ dev. Không đặt URI Mongo hoặc secret vào frontend. Khi OAuth ở chế độ Testing, Google có thể yêu cầu thêm tài khoản thử trong Google Cloud. Mỗi người đăng nhập có workspace riêng; không hardcode hai email.

Bản hosted demo và bản Mac này không tự chuyển dữ liệu sang MongoDB. Cần cấu hình/kiểm thử kết nối thật trước khi dùng chính thức. Các gói miễn phí có hạn mức, không cam kết miễn phí vô hạn.

## 6. Lỗi thường gặp

- `node: command not found`: cài Node rồi mở Terminal mới.
- `No such file or directory`: chưa cd đúng thư mục; kéo thư mục vào Terminal như bước 2.
- `EADDRINUSE` / cổng 3000 bận:
  ```sh
  DEMO_PORT=3010 bash RUN-MAC.sh
  ```
  rồi mở http://localhost:3010 (kho dữ liệu demo riêng do khác cổng).
- `Permission denied`: dùng `bash RUN-MAC.sh`, không cần sudo.
- Trắng trang: xem lỗi Terminal, kiểm tra giải nén đủ thư mục `apps/web/dist`, mở bằng HTTP thay vì file://.
- Mất dữ liệu khi đổi trình duyệt/cổng: quay lại đúng địa chỉ và trình duyệt cũ; chưa có đồng bộ DB ở bản demo.

## 7. APK và điện thoại

Mac dùng bản web để thử. Android source trong `apps/android`, hướng dẫn build bằng Android Studio/GitHub Actions tại `apps/android/README.md`. Không có APK biên dịch sẵn trong gói này. Widget và thông báo Android là source chưa chạy thiết bị; cần cài APK và gửi bản việc thủ công từ Cài đặt. Popup web chỉ xuất hiện trong app, không phải popup ngoài màn hình chính iPhone/Android.
