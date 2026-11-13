# Gửi Khuê Nhã 1.7.6 — Nhắc trước tùy chỉnh

Bản full kế thừa 1.7.5, bổ sung bộ chọn thời gian nhắc trước dùng chung cho Công việc và Cài đặt.

## Dùng ngay trong công việc

1. Mở công việc → Chỉnh sửa.
2. Ô **Nhắc trước** → chọn mục cuối **Tùy chỉnh…**.
3. Nhập số lượng và chọn **Phút / Giờ / Ngày**.
4. Bấm **Lưu công việc**. Mở lại để kiểm tra.

Ví dụ: 37 phút, 2 giờ, 1,5 giờ (tương đương 90 phút), 2 ngày. Dùng dấu thập phân mà bàn phím số của máy hỗ trợ. Dòng dưới ô nhập hiển thị thời gian thực tế và số phút được lưu.

Vẫn có các lựa chọn nhanh: Không nhắc, 5 phút, 15 phút, 30 phút, 1 giờ, 1 ngày. Chọn Không nhắc để tắt. Trong chế độ Tùy chỉnh, để trống, số âm, 0, nhỏ hơn một phút, thời gian không tương đương số phút nguyên hoặc quá 7 ngày sẽ báo lỗi và chặn lưu.

Giới hạn: tối thiểu 1 phút, tối đa 7 ngày (10080 phút), độ chính xác một phút. Có thể dùng số lẻ ở đơn vị giờ/ngày khi kết quả là số phút nguyên.

## Mặc định cho việc mới

Cài đặt → Cá nhân & công việc → **Nhắc trước mặc định** → Tùy chỉnh… → nhập thời gian → **Lưu cài đặt**.

Giá trị này được dùng khi tạo việc mới. Các việc đã có vẫn giữ thời gian riêng. Muốn đổi một việc cũ thì sửa trực tiếp việc đó.

## Lưu và đồng bộ

App lưu số phút vào trường reminder/defaultReminder đã có, không cần đổi cấu trúc MongoDB. Calendar và Android nhận cùng số phút, không bị nhầm giờ/ngày. Không có file hoặc API key nào phải nhập thêm.

Khi mở lại, thời gian được dựng từ số phút đã lưu: 120 phút hiển thị 2 giờ, 2880 phút hiển thị 2 ngày; 90 phút có thể hiển thị 90 phút. Nếu trùng lựa chọn nhanh, app có thể hiển thị lựa chọn nhanh tương ứng. Đơn vị nhập ban đầu không được lưu riêng, nhưng giá trị thời gian được giữ nguyên.

Calendar chỉ nhận thay đổi sau khi đồng bộ việc/đồng bộ hai chiều; Android nhận snapshot sau khi app cập nhật dữ liệu. Quyền thông báo, quyền báo thức, giờ yên lặng và hạn chế pin vẫn áp dụng như 1.7.5. Nhắc trước có thể đã trôi qua nếu nhập cho một deadline quá gần hoặc đã quá hạn; app không tạo ngược một thông báo đúng thời điểm trong quá khứ.

## Cập nhật

1. Giải nén **GuiKhueNha-1.7.6-FullProject.zip**, chép nội dung GuiKhueNha vào repository trên Mac. Giữ .git, .env và khóa ký riêng. Không mang node_modules/build cũ sang.
2. Commit/Push GitHub rồi Render → Manual Deploy → Deploy latest commit. Giữ Dockerfile Path `./Dockerfile.render`, Root Directory trống, giữ nguyên biến môi trường.
3. Mở https://gui-khue-nha.onrender.com/api/config và kiểm tra `release` là **1.7.6**.
4. Trên Mac nhấn Command+Shift+R. Trên Android cài **GuiKhueNha-1.7.6-release.apk** bằng lựa chọn **Cập nhật**, rồi đóng/mở lại app.
5. Không gỡ app hoặc xóa database để nâng phiên bản.

Nếu vẫn chỉ thấy 6 lựa chọn như ảnh cũ, kiểm tra bước 3: giao diện được tải từ Render nên chỉ cài APK sẽ không cập nhật được menu trên máy chủ cũ.

APK: package vn.nhipviec.mobile, versionName1.7.6, versionCode13; dùng đúng chứng thư ký gốc của các bản trước. Chưa push/deploy tự động trong phiên này.

Mac: `bash RUN-MAC.sh` để dùng bản build sẵn; `bash RUN-MAC.sh dev` để sửa source. Dùng Node.js 24 LTS. Kiểm tra: `npx tsc --noEmit`, `npm run build`, `npm run test:app`.

## Phạm vi kiểm tra

TypeScript, build web, bộ test cũ và test mới cho preset → Tùy chỉnh → nhập phút/giờ/ngày → lưu → schema → mở lại; giá trị trống/âm/quá giới hạn; tùy chỉnh mặc định; Calendar/Android cùng số phút; CSS custom có trong bản build. APK đã build và kiểm tra chữ ký, metadata, zipalign.

Kiểm thử dùng React renderer và mô phỏng Calendar/Mongo, chưa cài trên điện thoại thật hoặc kiểm tra tài khoản Google của bạn. Thử một việc mới ngoài giờ yên lặng để xác nhận thông báo sau cập nhật.
