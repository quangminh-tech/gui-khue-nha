# Gửi Khuê Nhã 1.7.4 — sửa lĩnh vực trùng và CSS

## Hai lỗi đã sửa

**Lĩnh vực trùng:** menu trước đây dùng Set trên chuỗi nguyên văn. Các tên CÔNG TY có khoảng trắng cuối, NBSP, khoảng trắng kép, chữ thường, ký tự ẩn hoặc dạng Unicode khác có thể hiển thị thành hai mục giống nhau. Bản này dùng cùng một cách chuẩn hóa cho menu, bộ lọc, báo cáo, ô chọn lĩnh vực và dữ liệu khi lưu.

Chỉ gom tên lĩnh vực tương đương, không gộp/xóa công việc. ID, việc cha/con, checklist, link tài liệu, ghi chú và trạng thái được giữ nguyên. Không bỏ dấu tiếng Việt để tránh gộp hai tên khác nhau. Khi tải dữ liệu, giao diện tự gom tên; khi lưu công việc thành công, backend ghi tên đã chuẩn hóa vào database. Không cần xóa MongoDB hoặc nhập lại dữ liệu.

**CSS:** phần CSS mới cho cây chọn việc cha/nút lĩnh vực đã bị ghi nhầm vào app.css ở thư mục gốc, trong khi AppShell chỉ import features/app/app.css. Bản này đưa toàn bộ style vào đúng file đang được sử dụng và build lại apps/web/dist. Có khoảng cách, thụt nhánh, tên và mô tả tách dòng, nút chọn có khung, vùng cây cuộn riêng. Màu dùng biến giao diện hiện tại, không cố định màu tối.

## Cập nhật

1. Tải GuiKhueNha-1.7.4-FullProject.zip, giải nén.
2. Chép nội dung thư mục GuiKhueNha vào repository trên Mac. Giữ nguyên .git, .env và keystore riêng của bạn. Không mang node_modules/build từ bản cũ sang.
3. Commit và Push GitHub; nếu có thay đổi remote thì Fetch/Pull trước, không force push.
4. Render → gui-khue-nha → Manual Deploy → Deploy latest commit. Dockerfile Path: ./Dockerfile.render, Root Directory trống. Giữ nguyên biến môi trường DB/OAuth/APP_ENCRYPTION_KEY.
5. Chờ Live, mở https://gui-khue-nha.onrender.com/api/config. `release` phải là **1.7.4**.
6. Trên Mac tải lại trang bằng Command+Shift+R. Trong Android đóng/mở lại app rồi cài **GuiKhueNha-1.7.4-release.apk** bằng lựa chọn Cập nhật. Không gỡ app cũ, không xóa dữ liệu app.

APK dùng cùng package vn.nhipviec.mobile và cùng chứng thư ký đã dùng, tăng versionCode lên 11. Nếu máy báo không thể cập nhật vì chữ ký hoặc phiên bản, giữ app cũ và gửi thông báo để kiểm tra.

**Quan trọng:** cần deploy source mới lên Render. Chỉ cài APK mới sẽ không thay CSS/giao diện đang được tải từ máy chủ cũ.

## Thử lại

- Sidebar và bộ lọc chỉ có một mục CÔNG TY dù dữ liệu cũ có các biến thể khoảng trắng/Unicode.
- Chọn mục đó vẫn thấy các việc thuộc mọi biến thể trước đây.
- Mở một việc → Chỉnh sửa: các nút lĩnh vực tách rõ; tên việc cha và thông tin phụ tách dòng; mở/thu cây được; chọn cha rồi lưu vẫn giữ việc con.
- Nhập ` công ty ` rồi lưu: dùng lại lĩnh vực CÔNG TY đã có, không tạo mục mới.
- Nhập một tên lĩnh vực thực sự khác: vẫn tạo được lĩnh vực mới.
- Các tính năng lưu link không cần dấu +, sửa/gỡ link, Calendar, widget, đăng nhập và sổ tay local của 1.7.3 được giữ lại.

Chạy Mac: `bash RUN-MAC.sh` để dùng bản build sẵn; `bash RUN-MAC.sh dev` để sửa source. Chi tiết Drive/Google Picker và kết nối giữ nguyên ở HUONG-DAN-1.7.3.md.

## Kiểm tra đã thực hiện

- TypeScript, build web, bộ kiểm thử ứng dụng: qua.
- Bổ sung test tên trùng có NBSP/Unicode/ký tự ẩn/chữ thường; không mất ID/cha-con/checklist/link; ô chọn chỉ còn một mục: qua.
- Test đọc trực tiếp CSS trong apps/web/dist/assets, kiểm tra các selector và khai báo layout mới thực sự được đưa vào bản build: qua.
- Android assembleRelease, chứng thư ký, metadata và zipalign: qua.
- Chưa kiểm tra hiển thị trên điện thoại/browser thật trong phiên này; test tương tác dùng React renderer, Google/Mongo dùng mock. Chưa push GitHub hay deploy Render của bạn.
