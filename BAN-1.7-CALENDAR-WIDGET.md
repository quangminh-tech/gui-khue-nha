# Gửi Khuê Nhã 1.7 — Calendar, widget và checklist

## Bốn thay đổi

1. Calendar hai chiều: vào Lịch → Bật đồng bộ hai chiều. App sẽ đọc lịch chính Google của tài khoản và xuất công việc độc lập/việc con sang lịch đó. Thay đổi tên, ghi chú, ngày và giờ được cập nhật hai chiều. Không còn chỉ gửi từng việc theo một chiều. Lưu ý bật lần đầu sẽ đưa các việc đang chờ trong app lên lịch chính và nhập sự kiện trong cửa sổ nêu dưới đây.
2. Widget tự lấy dữ liệu: không còn bắt buộc bấm gửi snapshot. APK dùng phiên đăng nhập của chính người dùng để lấy danh sách nhỏ từ backend; không chứa khóa Mongo hay token Google. Hiện tối đa3 việc chưa hoàn thành, đến hạn hôm nay HOẶC ưu tiên Cao HOẶC quá hạn. Ưu tiên việc khẩn/quá hạn, rồi theo hạn gần nhất. Ngày tính theo Việt Nam.
3. Bấm công việc mở màn hình xem. Có checkbox cho từng bước, lưu ngay sau tick. Không tự mở tất cả ô sửa. Bấm Chỉnh sửa mới hiện form đầy đủ. Công việc mới vẫn mở form để nhập. Với việc lớn có việc con, tiến độ lấy từ việc con; mở việc con để tick checklist tương ứng.
4. Xóa có xác nhận số việc con. Xóa công việc cùng checklist, ghi chú và liên kết trong đó. Không có thùng rác. File gốc trên Drive/Docs/Sheets/website không bị xóa.

## Cập nhật đúng thứ tự

1. Giải nén source1.7; thay source repo gui-khue-nha hiện tại, giữ các secrets và file .env riêng.
2. Commit/push lên main. Render dùng Dockerfile.render như trước, Root Directory trống, Docker Context = .; chờ deploy bản mới. Frontend apps/web/dist đã build sẵn trong gói.
3. Mở https://gui-khue-nha.onrender.com/api/config: phải có calendarSyncVersion:1 và widgetSyncVersion:1. GoogleConfigured vẫn phải true. Nếu chưa có hai trường này thì Render chưa chạy source mới.
4. Google Cloud project Gui Khue Nha → APIs & Services / API et services → Library / Bibliothèque → tìm **Google Calendar API** → Enable / Activer. Đây là API cần bật để đọc/ghi lịch. Giữ Client ID/Secret/callback cũ. Nếu tài khoản đã cấp calendar.events thì không cần client mới; nếu báo thiếu quyền, Kết nối Google và cấp lại.
5. Cài GuiKhueNha-1.7.0-release.apk đè bản1.6, cùng package và chứng chỉ, versionCode7. Không cần gỡ app hoặc xóa MongoDB.
6. Mở app một lần để APK nhận cookie hiện tại và tải widget. Nếu hết phiên thì đăng nhập lại Google. Widget đã ghim sẽ tự cập nhật; nếu launcher chưa vẽ lại, gỡ riêng widget rồi ghim lại bằng bánh răng Android. Không cần gỡ APK.
7. Vào Lịch → Bật đồng bộ hai chiều. Xem Lần cuối hoặc lỗi ngay trên thẻ. Nút Đồng bộ ngay dùng để thử ngay sau khi đổi lịch ở Google. Tắt đồng bộ giữ nguyên công việc và sự kiện đang có.

Mac: như bản trước, bash RUN-MAC.sh dev và http://localhost:3000, callback local cần http://localhost:3000/auth/google/callback. Không commit .env. Nếu dùng DB production thì dữ liệu local cũng là dữ liệu thật.

## Phạm vi Calendar rõ ràng

- Calendar chính (primary) của từng người; không dùng chung lịch giữa hai tài khoản.
- Nhập Google trong 30 ngày trước đến 180 ngày tới. Lịch đã gắn công việc vẫn được kiểm tra riêng nếu bị chuyển ra ngoài khoảng này. Tối đa20 trang, 250 mục/trang; quá giới hạn hoặc sổ tay vượt2000 việc thì báo lỗi trước khi ghi dữ liệu nhập.
- Tự kiểm tra mỗi60giây khi giao diện mở/hiện, sau lưu và khi quay lại app; có nút Đồng bộ ngay. Không có webhook realtime, không hứa đồng bộ khi Render ngủ hoặc app bị đóng. Widget nền tải dữ liệu Mongo đã lưu; không tự kéo Google ở nền.
- Giờ hiển thị theo Asia/Ho_Chi_Minh. Sự kiện cả ngày giữ tính chất cả ngày trên Google, app hiển thị09:00; giữ độ dài sự kiện khi app đổi giờ/ngày.
- Checklist, quan hệ cha/con, link tài liệu và tiến độ ở app. Google Calendar không có checkbox hoàn thành task tương đương. Không sửa cấu trúc việc con chỉ vì sửa một sự kiện.
- Sự kiện lặp từ Google được đọc thành các lần xuất hiện trong khoảng nhập; việc chỉnh các lần lặp/chuỗi thực hiện ở Google. Chiều app→Google hỗ trợ sự kiện đơn. Việc lặp của app tiếp tục sinh việc theo cơ chế app.
- Nếu cả app và Google sửa cùng trường giữa hai lần sync, bản Google được ưu tiên cho tên/ghi chú/ngày/giờ; checklist app được giữ. ETag If-Match chặn ghi đè thay đổi Google xảy ra giữa lượt sync, lượt tiếp theo đọc lại.
- Trùng sự kiện được hạn chế bằng ID xác định và bảng liên kết riêng theo owner. Đã nhận biết các sự kiện app tạo từ bản một chiều cũ bằng ID cũ.

## Quy tắc xóa

| Thao tác | Kết quả |
| --- | --- |
| Xóa việc lớn trong app | Xóa cả việc con, checklist/ghi chú/link trong các việc đó sau xác nhận |
| Xóa một checklist ở chế độ chỉnh sửa | Xóa bước đó khi lưu, không xóa cả công việc |
| Tick checklist ở màn hình xem | Chỉ đổi trạng thái bước và tiến độ; không xóa gì |
| Xóa task có sự kiện do app tạo | Nếu bật hai chiều, xóa sự kiện đó ở lần sync tiếp theo; ETag không khớp thì giữ và thử đọc lại |
| Xóa task nhập từ Google | Gỡ task khỏi app và đánh dấu ngừng nhập lại sự kiện đó; giữ sự kiện gốc trên Google |
| Xóa sự kiện đã gắn task ở Google | Giữ task/checklist/ghi chú trong app, gỡ liên kết và gắn nhãn Lịch đã xóa; không tự tạo lại sự kiện đó |
| Tắt đồng bộ | Không xóa dữ liệu hai bên |
| File Drive/Docs/Sheets/ảnh/website | Chỉ gỡ liên kết khi xóa task, không xóa file gốc |

Bản1.7 chưa có nút khôi phục liên kết đã gỡ, bộ chọn lịch phụ hoặc thùng rác. Muốn giữ bản sao trước khi xóa, dùng Xuất JSON trong Cài đặt.

## Widget và nhắc Android

- Lấy dữ liệu khi mở/quay lại app, sau thay đổi được lưu và khoảng60giây khi đang mở.
- JobScheduler xin cập nhật nền khoảng15phút, có mạng; Android/Doze/tiết kiệm pin và Render Free có thể trì hoãn. Không phải cam kết đúng15phút.
- Mỗi dòng widget mở đúng chi tiết việc đó. Widget nhỏ hơn hiển thị ít dòng. Mở app để có bản mới khi thiếu mạng hoặc cache cũ.
- Nhắc cục bộ vẫn dùng danh sách tối đa30 việc và giờ yên lặng. Cần quyền thông báo Android13+. Không yêu cầu quyền báo thức chính xác; nhắc có thể trễ. Thủ công Gửi bản nhắc vẫn là phương án dự phòng.
- Logout/hết phiên sẽ xóa cache khi APK nhận phản hồi hoặc lần lấy dữ liệu tiếp theo; không xóa DB.

## Kiểm tra đã làm và giới hạn

- Build React/Vite và TypeScript.
- Các test sẵn có: Pomodoro, tài liệu, retention, dữ liệu app, HTTP/OAuth và one-time mobile handoff.
- Bộ test mới với Google/Mongo giả lập: nhập, xuất, sửa hai chiều, idempotence, giữ checklist, xung đột/412, xóa an toàn, cả ngày, phân tách owner và widget hôm nay/ưu tiên/quá hạn/ngày Việt Nam.
- SSR kiểm tra task cũ mở view+checkbox, chỉ task mới có form, Calendar không phụ thuộc Picker.
- Build Android release, xác minh APK cùng chứng chỉ ký và alignment.
- Chưa thử Google Calendar thật hoặc APK/widget trên điện thoại thật. Thử Chromium headless không chạy được do môi trường chặn socket; không coi SSR là kiểm thử thao tác trên điện thoại.
- Gói này chưa được push/deploy lên GitHub/Render của bạn; cần cập nhật như trên. Không có secrets hoặc khóa ký trong source.

Tài liệu chính thức: https://developers.google.com/workspace/calendar/api/guides/version-resources ; https://developer.android.com/develop/background-work/background-tasks/persistent/getting-started/define-work

## Bốn bạn đồng hành mới

Mavuika — Natlan/Hỏa; Columbina — Nod-Krai/Nguyệt·Thủy; Anastasya (Tsaritsa) — Snezhnaya/Băng; Rhinedottir / Naberius — chủ đề giả kim/Sự sống. Giữ đủ sáu lựa chọn cũ, tổng10. Mỗi lựa chọn có chibi, nền, màu nhấn, biểu tượng và nhãn widget. Chọn trong Cài đặt rồi Lưu cài đặt. Không thay đổi công việc khi đổi nhân vật.

Thông tin đối chiếu10/11/2026: https://genshin.hoyoverse.com/en/news/detail/127626 ; https://genshin.hoyoverse.com/en/character/snezhnaya?char=15 ; https://www.hoyolab.com/article/47339559 ; https://www.hoyolab.com/article/39895957 . Hình trong app là fan art, không phải asset chính thức hoặc cam kết tạo hình chính xác. Chủ đề Sự sống không bị gán nhầm thành nguyên tố Thảo.

Asset mới nhẹ: public/chibi-extra-atlas.webp khoảng506KB và public/extra-regions.webp khoảng300KB. Chúng được phục vụ từ web Render, không nhúng nguyên bộ ảnh vào APK. Chi tiết prompt/nguồn ở docs/ASSETS-1.7.md.
