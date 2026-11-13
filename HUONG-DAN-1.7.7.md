# Gửi Khuê Nhã 1.7.7 — Công việc kéo dài và lịch lặp

## Tạo công việc

- **Ngày bắt đầu**: ngày bắt đầu thực hiện. **Ngày đến hạn + Giờ**: deadline. Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày đến hạn.
- Ví dụ: “Chiến dịch Noel”, bắt đầu 01/12, đến hạn 25/12: hiện trên lịch từ 01 đến 25/12. Chỉ quá hạn sau deadline, không báo quá hạn ngay ngày bắt đầu.
- **Lặp lại**: Không lặp / Hằng ngày / Thứ Hai–Thứ Sáu / Hằng tuần / Hằng tháng / Hằng năm / Tùy chỉnh. Hằng tuần có thể chọn nhiều thứ; Tùy chỉnh cho phép mỗi N ngày, tuần, tháng hoặc năm.
- **Kết thúc lặp**: Không giới hạn / Đến ngày / Sau số lần. Ngày kết thúc lặp là giới hạn ngày bắt đầu của mỗi lần, bao gồm ngày đó. Số lần tính từ lần đầu của chuỗi; ngày đã bỏ qua vẫn nằm trong số lần này.
- Việc vừa kéo dài vừa lặp được hỗ trợ: mỗi lần giữ nguyên số ngày từ bắt đầu tới deadline. Các lần có thể chồng ngày nếu khoảng lặp ngắn hơn thời gian thực hiện.
- Ngày 29–31 không có trong tháng sẽ dùng ngày cuối tháng; ví dụ 31/01 → 28/02 → 31/03. Ngày 29/02 lặp năm dùng 28/02 ở năm không nhuận, trở lại 29/02 ở năm nhuận.
- Nhắc trước vẫn chọn nhanh hoặc Tùy chỉnh phút/giờ/ngày, tối đa 7 ngày. Nhắc theo deadline của từng lần.

## Hiển thị và thao tác

**Lịch trong app** dựng lần lặp theo tháng đang xem. Việc kéo dài xuất hiện trên từng ngày nằm trong khoảng; danh sách theo ngày cũng có việc đó. Lần lặp có dấu ↻. Chuyển tháng để xem các lần tiếp theo, không cần tạo thủ công từng công việc.

Danh sách Công việc hiển thị một nhóm chuỗi và các lần gần hiện tại (7 ngày trước đến 30 ngày tới); lịch tháng có thể xem xa hơn. Các lần đã chỉnh sửa/lưu lịch sử vẫn được giữ. Nếu chuỗi không có lần nào trong cửa sổ gần, app hiển thị lần sắp tới để vẫn mở được công việc. Bản xem có giới hạn 4.000 mục để tránh dựng quá nhiều dữ liệu cùng lúc.

Mỗi lần có checklist, trạng thái và tiến độ riêng. Hoàn thành hôm nay không hoàn thành ngày mai. Bấm vào dòng checklist để tick; sửa nội dung qua Chỉnh sửa. Nhóm chuỗi là mẫu, không dùng nút hoàn thành để hoàn thành hàng loạt các lần.

Khi sửa/xóa một lần trong chuỗi, có ba phạm vi:

| Phạm vi | Kết quả |
|---|---|
| Chỉ lần này | Đổi/xóa lần đang mở; các lần khác giữ nguyên. |
| Lần này và các lần sau | Tách chuỗi từ lần đang mở; giữ lịch sử trước đó. Số lần còn lại được tính từ vị trí tách, có thể chỉnh lại. |
| Toàn bộ chuỗi | Cập nhật mẫu và các lần theo thứ tự lịch; giữ trạng thái/checklist của lịch sử đã lưu. Xóa sẽ xóa cả chuỗi và các lần thuộc chuỗi. |

Ngày bị xóa riêng được đánh dấu bỏ qua để không tự sinh lại. Quy tắc dọn việc hoàn thành quá 10 ngày vẫn hoạt động; giữ mẫu lặp, ghi nhận ngày đã dọn để lịch sử không tự mọc lại. Không tự dọn việc chưa hoàn thành.

Các việc lặp kiểu cũ không được chuyển hàng loạt để tránh trùng với lịch sử đã tạo. Với việc cũ cần dùng cơ chế mới, mở Chỉnh sửa → chọn lại kiểu Lặp lại → Lưu; các bản lịch sử cũ vẫn giữ nguyên.

## Google Calendar và Android

Không cần đăng nhập Google để dùng sổ tay local. Kết nối Google chỉ khi cần đồng bộ.

Bật đồng bộ hai chiều trong Cài đặt. Bản này đồng bộ **từng lần thành sự kiện riêng** trong cửa sổ **30 ngày trước đến 60 ngày tới**, tối đa 40 sự kiện cần đẩy mỗi lượt; khi còn nhiều, giữ app mở cho các lượt đồng bộ tiếp theo. Không tạo quy tắc RRULE của Google và không hứa đồng bộ vô hạn một lần. Chỉnh một sự kiện Google chỉ tác động lần tương ứng, không đổi cả chuỗi trong app. Các chuỗi gốc từ Google vẫn theo cơ chế nhập các lần sự kiện, không chỉnh quy tắc lặp gốc của Google bằng form này.

Nút đồng bộ riêng trên mẫu chuỗi gửi lần đầu; muốn gửi các lần trong cửa sổ trên thì bật đồng bộ hai chiều. Khoảng ngày dài được gửi với ngày bắt đầu và kết thúc tương ứng; sự kiện cả ngày vẫn tuân theo ngày kết thúc loại trừ của Google.

Khi xóa, lựa chọn Xóa sự kiện Google/Giữ sự kiện gốc vẫn áp dụng. Việc quá hạn được phép xóa; không bị chặn chỉ vì nằm ngoài cửa sổ nhập lịch thông thường. Không có thao tác tự xóa toàn bộ lịch Google.

Widget/nhắc việc nhận các lần gần hiện tại qua snapshot từ app, không gửi nhóm mẫu như một deadline riêng. Mở app để cập nhật snapshot. Khi app đóng lâu hoặc offline vượt phạm vi đã tạo, cần mở lại để nhận các lần mới; quyền thông báo, báo thức chính xác, giờ yên lặng và tiết kiệm pin vẫn áp dụng. Chưa xác nhận thông báo trên điện thoại thật trong phiên này.

## Cập nhật theo thứ tự

1. Sao lưu repository và dữ liệu trước cập nhật. Giải nén **GuiKhueNha-1.7.7-FullProject.zip**, chép nội dung thư mục GuiKhueNha vào repository trên Mac. Giữ `.git`, `.env`, biến môi trường và khóa ký riêng; không chép node_modules/build cũ.
2. Commit/Push lên GitHub, rồi Render → Manual Deploy → Deploy latest commit. Root Directory để trống, Dockerfile Path `./Dockerfile.render`. ZIP đã có frontend build sẵn ở `apps/web/dist` nên Docker dùng ngay bản giao diện mới.
3. Mở https://gui-khue-nha.onrender.com/api/config: phải có `release: "1.7.7"` và `schedulingVersion: 1`. Giữ nguyên MongoDB URI, APP_ENCRYPTION_KEY và OAuth client đã cấu hình. Không cần tạo collection/schema Mongo thủ công.
4. Trên web nhấn Command+Shift+R. Trên Android cài **GuiKhueNha-1.7.7-release.apk** → Cập nhật → đóng/mở lại app. Không gỡ app hay xóa dữ liệu để nâng bản.
5. Tạo thử việc 3 ngày và việc hằng ngày 3 lần, kiểm tra trên lịch. Tick một lần, xác nhận lần sau chưa tick. Khi có Google, thử một việc mới trước khi chỉnh chuỗi quan trọng.

**Cần cập nhật Render trước APK**: giao diện Android tải từ máy chủ; chỉ cài APK sẽ vẫn thấy form cũ nếu máy chủ chưa cập nhật. APK dùng package `vn.nhipviec.mobile`, versionName **1.7.7**, versionCode **14**, cùng chứng thư ký gốc của các bản đã cung cấp. Cài ghi đè yêu cầu bản đang cài cũng dùng cùng package/chữ ký. APK không chứa mật khẩu MongoDB hay OAuth secret.

## Chạy và build local

- Mac: `bash RUN-MAC.sh` để chạy bản web có sẵn; `bash RUN-MAC.sh dev` để phát triển. Dùng Node.js 24.
- Kiểm tra: `npx tsc --noEmit`, `npm run build`, `npm run test:app`.
- Android: JDK17, Android SDK35, Gradle8.11.1 theo wrapper; dùng khóa ký riêng đã lưu. Không có khóa ký hay mật khẩu trong ZIP.

## Đã kiểm tra và giới hạn

TypeScript, build web, toàn bộ test app và build Android release đã đạt. Test mới kiểm tra daily/weekday/monthly/yearly/custom, COUNT/UNTIL, ngày cuối tháng/năm nhuận, lần lặp không trùng, checklist độc lập, phạm vi sửa/xóa, quan hệ cha–con, giữ lịch sử, dọn 10 ngày không sinh lại; form thực tế qua React renderer; lịch tháng/ngày cho việc kéo dài; Google mock hai chiều và outbox xóa theo phạm vi; snapshot Android. APK được xác minh chữ ký, version và zipalign.

Kiểm thử dùng React renderer và mô phỏng Google/Mongo; chưa chạy trên trình duyệt/điện thoại thật hay tài khoản Google của bạn. Chưa push hoặc deploy thay bạn trong phiên này. Hướng dẫn này là hiện hành; các tài liệu 1.7.6 trở về trước trong project là lịch sử.
