# Gửi Khuê Nhã 1.1 — Region Edition

## Giao diện
Giữ dashboard tối theo ảnh tham chiếu: hero phong cảnh/nhân vật, 4 chỉ số, danh sách ngày, vòng tiến độ, cảnh báo deadline, mục tiêu và việc nhỏ. Zhongli/Morax → Liyue/Nham; Venti → Mondstadt/Phong; Raiden/Ei → Inazuma/Lôi; Nahida → Sumeru/Thảo; Furina → Fontaine/Thủy; Paimon → Teyvat. Minh họa fan art, biểu tượng SVG theo vùng, không phải sản phẩm chính thức. Ảnh WebP đóng gói sẵn, không base64, không cần dịch vụ ảnh trả phí. Chọn trong Cài đặt rồi Lưu.

## Tiến độ
Việc không con: đã hoàn thành = 100%; còn mở và có checklist = số bước xong / tổng bước; không checklist = % nhập tay 0–99. Checklist đủ bước hiển thị 100% nhưng chờ xác nhận trạng thái. Việc lớn = trung bình % các việc nhỏ ở cấp cuối, trọng số bằng nhau. Tiến độ tổng = trung bình các việc cấp cuối/độc lập, không đếm trùng việc lớn. Số hoàn thành dựa vào trạng thái, có thể khác % tiến độ. Trạng thái việc lớn tự tổng hợp từ trạng thái con. Việc lặp mới đặt lại checklist và % tay. Dữ liệu cũ không có manualProgress được đọc là 0.

Deadline dùng ngày + giờ Việt Nam (UTC+7); quá hạn nếu thời điểm đã qua và việc chưa xong; sắp hạn là 24 giờ tới. Dashboard cảnh báo việc con trễ hoặc vượt deadline cha. Thêm công việc không con trước, sau đó Thêm việc nhỏ để trở thành mục tiêu.

## Popup và âm thanh web
Nhắc trước theo từng việc; giá trị 0 nghĩa là tắt nhắc. Chỉ hoạt động khi trang đang mở, kiểm tra mỗi 15 giây; trình duyệt có thể hạn chế tab nền. Khi mở lại chỉ nhắc bù trong 10 phút. Bộ nhớ chống nhắc trùng trong phiên, reload có thể nhắc lại. Chạm trang hoặc Nghe thử để cho phép âm thanh. Giờ yên lặng dùng múi giờ Việt Nam, hai mốc bằng nhau là tắt. Xem thử popup dùng bản cài đặt đang chỉnh, nhắc tự động dùng cài đặt đã Lưu. Có mở việc, hoãn 5 phút, xác nhận hoàn thành. Ba giai điệu tổng hợp riêng lấy cảm hứng không khí game, không phải bản ghi chính thức.

## Màn hình chính điện thoại
Source Android có AppWidget và local notification theo bản chụp được gửi bằng nút trong Cài đặt. Không tự cập nhật nền từ Mongo/Google. Cần build APK, cài và cấp quyền; chưa biên dịch hay chạy thiết bị trong môi trường bàn giao. Đọc apps/android/README.md. Web popup không xuất hiện ngoài app; iPhone chưa có widget native.

## Dữ liệu và triển khai
Bản demo hosted tiếp tục dùng D1 và tài khoản ChatGPT; giữ nguyên dữ liệu/quyền truy cập và lịch dọn mỗi 90 ngày (xóa việc đã hoàn thành hơn 10 ngày). App local demo lưu trên thiết bị, cần đăng nhập và lưu để dùng trực tuyến. MongoDB/Render, Google OAuth/Drive/Calendar và Gemini là source cấu hình riêng, chưa kết nối dịch vụ thật trong phiên này. Không có key thật trong source, không tự đăng ký gói tính phí. Mức miễn phí của nhà cung cấp có hạn mức và có thể thay đổi.

## Kiểm tra
Các kiểm tra logic: tiến độ lồng nhau, nhập tay, reset lặp, deadline chính xác theo giờ, yên lặng qua nửa đêm, bản chụp Android không chứa link/ghi chú/key; các kiểm tra cũ về retention, links, phân quyền HTTP, AI mock và Pomodoro được giữ. Android XML/audio kiểm tra cấu trúc, không thay thế Gradle/device test.
