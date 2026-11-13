# Gửi Khuê Nhã 1.7.5 — sửa theo source bạn gửi ngày 14/11/2026

## 1. Pomodoro đổi theo nhân vật

Pomodoro nhận nhân vật hiện tại từ cài đặt, không gắn cứng Zhongli. Chibi cạnh đồng hồ và màu bộ đếm đổi ngay theo lựa chọn. Cả 10 nhân vật được hỗ trợ. Tắt Hiện bạn đồng hành chibi trong cài đặt Pomodoro vẫn ẩn nhân vật. Paimon ở góc nhắc nhỏ vẫn là mascot riêng.

## 2. Bấm cả dòng checklist

Dòng checklist là một nút checkbox có vùng bấm toàn chiều ngang, cao tối thiểu 48px. Bấm ô, chữ hoặc khoảng trống trong dòng đều tick. Nhấn Enter/Space cũng hoạt động. Đang lưu sẽ khóa thao tác; bấm nhanh không gửi hai lần. Lưu lỗi giữ trạng thái trước và hiện thông báo. Việc có việc con vẫn mở việc con để tick, không cộng checklist cha vào tiến độ.

## 3. Nhân vật sự sống hai màu mắt

Thay ảnh Rhinedottir chibi bằng ảnh độc lập, một mắt vàng và một mắt đỏ. Dùng chung trên trang chủ, lựa chọn nhân vật và Pomodoro. Ảnh WebP trong public/rhinedottir-heterochromia.webp, nền trong suốt, khoảng 201 KB. Đây là fan art được chỉnh theo ảnh hiện có, không tuyên bố là ảnh chính thức.

## 4. Xóa sự kiện Calendar, kể cả việc quá hạn

Khi xóa công việc có tài khoản Google, hộp xác nhận có lựa chọn **Xóa cả sự kiện Google đã liên kết**:

- Bật: xóa việc/checklist/ghi chú và yêu cầu xóa sự kiện tương ứng. Áp dụng cả sự kiện quá hạn, sự kiện do app tạo và sự kiện đã nhập từ Google. Không phụ thuộc cửa sổ nhập lịch 30 ngày trước/180 ngày tới.
- Tắt: chỉ xóa trong app, giữ sự kiện Google và không nhập lại sự kiện đó vào cùng sổ tay ở lần đồng bộ sau.
- Xóa việc cha áp dụng cho việc đó và toàn bộ hậu duệ đang được xác nhận. Không xóa file gốc Drive hoặc sự kiện không liên quan. Với lịch lặp nhập vào, chỉ thao tác sự kiện/occurrence đã liên kết, không tự xóa cả chuỗi.

Lựa chọn mặc định bật khi đã kết nối Calendar. Kiểm tra trước khi xác nhận vì xóa trên Google là thay đổi thật, có thể tác động sự kiện có khách mời.

Yêu cầu xóa được ghi cùng giao dịch xóa việc vào collection calendar_deletions. Nếu lưu việc thất bại sẽ không còn yêu cầu xóa lịch. Nếu mất mạng/quyền Google, yêu cầu được giữ để thử lại. Nếu Google vừa sửa sự kiện, lần xóa nhận xung đột sẽ giữ yêu cầu thay vì ghi đè mù.

App thử xử lý ngay sau khi xóa. Nếu còn treo: vào **Lịch → Thử lại xóa lịch đã yêu cầu**. Đồng bộ hai chiều đang bật cũng xử lý lại khi app mở. Máy chủ Render Free ngủ không có nghĩa công việc tự bị mất. Chưa có dịch vụ chạy nền liên tục để cam kết xử lý đúng lúc app đóng.

Nút đồng bộ một việc nay ghi liên kết Calendar và dùng sự kiện đã liên kết, tránh tạo bản sao cho việc nhập từ Google. Mốc nhắc trước cũng được đưa vào Calendar. Với các việc cũ từng gửi lên Google bằng nút đơn lẻ, yêu cầu xóa có thể tìm ID sự kiện do app tạo trước đây ngay cả khi thiếu bản ghi liên kết. Không dò/xóa sự kiện theo tên gần giống.

**Nếu xóa sự kiện trực tiếp trên Google:** app vẫn giữ công việc, checklist và ghi chú, gắn nhãn Lịch đã xóa và không tự tạo lại sự kiện. Muốn xóa cả công việc thì xóa rõ trong app. Đây là cách bảo toàn dữ liệu công việc, không phải tự xóa tất cả việc quá hạn.

## 5. Nhắc việc và thời gian tùy chỉnh trong ảnh

- Task → Chỉnh sửa → Nhắc trước → Tùy chỉnh: nhập số phút, tối đa 10080 phút (7 ngày).
- Cài đặt → Nhắc trước mặc định: nhập số phút tùy ý; 0 là tắt nhắc cho việc mới.
- Snapshot Android ưu tiên việc còn hạn; không để 30 việc rất cũ chiếm hết chỗ của việc cần nhắc sắp tới. Widget vẫn hiển thị hôm nay/khẩn/quá hạn riêng.
- Android hỏi quyền thông báo một lần khi đã có việc cần nhắc. Đã từ chối thì mở tiện ích Android hoặc Cài đặt hệ thống để bật lại.
- Mở nút tiện ích Android ở thanh trên app → **Bật quyền thông báo**, sau đó **Cho phép nhắc đúng giờ**. Khi được cấp quyền báo thức, app dùng báo thức chính xác; chưa cấp thì dùng báo thức gần đúng.
- Sau khi mở lại app/khởi động lại máy/cập nhật app, các bản nhắc đã lưu được lên lịch lại. Việc đã thông báo có dấu nhận để tránh phát lại mỗi lần làm mới.
- Giờ yên lặng vẫn được tôn trọng. Tạo việc thử ngoài khoảng giờ yên lặng, bật thông báo cho app/kênh nhắc việc, mở app để nhận snapshot rồi đóng và chờ.

Không thể cam kết thông báo đúng từng giây trên mọi máy. Force-stop, quyền bị thu hồi, pin hạn chế của hãng, kênh thông báo bị tắt hoặc dữ liệu local chưa nhận snapshot đều có thể ảnh hưởng. Pomodoro vẫn là bộ đếm khi app mở; bản này không biến Pomodoro thành timer nền có foreground service.

## 6. Cập nhật source và APK

1. Giải nén GuiKhueNha-1.7.5-FullProject.zip.
2. Chép nội dung GuiKhueNha vào repository trên Mac. Giữ .git, .env và khóa ký của bạn; không chép node_modules/build cũ.
3. Commit, Push lên GitHub rồi Render → Manual Deploy → Deploy latest commit. Dockerfile Path ./Dockerfile.render, Root Directory trống. Không đổi DB hoặc APP_ENCRYPTION_KEY.
4. Mở https://gui-khue-nha.onrender.com/api/config và kiểm tra release=1.7.5, calendarSyncVersion=2, widgetSyncVersion=2.
5. Tải lại trang trên Mac bằng Command+Shift+R. Cài APK 1.7.5 bằng lựa chọn **Cập nhật**, không gỡ app/xóa dữ liệu.
6. APK có package vn.nhipviec.mobile, versionCode12, cùng chứng thư ký gốc. Nếu báo khác chữ ký hoặc phiên bản, giữ app cũ và gửi thông báo; không gỡ vội.

Không cần sửa thủ công schema MongoDB. Collection mới được tạo lúc lưu yêu cầu xóa. Quyền DB readWrite hiện có cần cho phép ghi collection này. Backend giữ thông tin bí mật, APK không chứa MongoDB URI/client secret/khóa mã hóa.

Cần cập nhật cả Render và APK: giao diện/Calendar nằm trên Render; quyền và lịch nhắc Android nằm trong APK.

Mac: `bash RUN-MAC.sh` chạy bản build sẵn; `bash RUN-MAC.sh dev` chạy source; Node.js 24 LTS. Kiểm tra: `npx tsc --noEmit`, `npm run build`, `npm run test:app`.

## 7. Thử nghiệm nên làm sau cập nhật

- Chọn Raiden, Nahida hoặc Rhinedottir → Góc tập trung: ảnh và màu đổi. Rhinedottir có mắt vàng/đỏ ở cả trang chủ và góc tập trung.
- Mở việc con → bấm chữ và khoảng trống trong dòng checklist → lưu/mở lại. Bấm nhanh chỉ một lần thay đổi.
- Tạo một sự kiện thử trên Google, đồng bộ vào app; đặt ngày quá hạn; xóa việc và bật Xóa cả sự kiện → kiểm tra Google. Thử một sự kiện khác với tùy chọn tắt → sự kiện Google còn, app không nhập lại.
- Thử ngắt mạng lúc xóa → mở lại mạng → Lịch → Thử lại xóa lịch đã yêu cầu.
- Tạo việc đến hạn sau 10 phút, nhắc trước 2 phút, ngoài giờ yên lặng. Cấp quyền Android, chờ app nhận dữ liệu rồi đóng app để kiểm tra thông báo thực tế.

## 8. Phạm vi kiểm tra

Đã kiểm tra TypeScript/build web, các bộ test cũ và test bổ sung: 10 nhân vật Pomodoro, màu theo nhân vật, asset mắt khác màu, vùng checklist toàn dòng/khóa bấm nhanh/lưu lỗi, phút nhắc tùy chỉnh, hàng chờ xóa lịch quá hạn khi đồng bộ tắt, retry xung đột, không xóa lịch người khác, rollback giao dịch và việc mới không bị việc quá hạn che mất. Google/Mongo dùng mock. APK build và xác minh chữ ký/zipalign/metadata riêng.

Chưa đăng nhập Drive/Calendar thật hoặc cài thử lên điện thoại của bạn; chưa push GitHub/deploy Render. Cần chạy các kiểm tra thực tế ở mục 7 sau cập nhật.

Đối chiếu API: https://developers.google.com/workspace/calendar/api/guides/version-resources ; https://developer.android.com/develop/background-work/services/alarms ; https://developer.android.com/develop/ui/views/notifications/notification-permission
