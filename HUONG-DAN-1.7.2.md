# Gửi Khuê Nhã 1.7.2 — sửa đăng nhập và dùng không cần Google

## Dùng app không bắt buộc Google

Mở app là có thể tạo việc lớn/nhỏ, tick checklist, xem lịch công việc/dashboard, dùng Pomodoro, lưu cài đặt, chọn10 nhân vật và gắn link tài liệu. Khi chưa kết nối Google, sổ tay thật được lưu trong localStorage của giao diện trên máy, riêng với bản demo. Nhãn trên thanh trên cùng là “Lưu trên máy”. Widget/nhắc Android nhận bản dữ liệu local tự động, không gọi API yêu cầu Google. Đây không phải bản demo và không tự nạp dữ liệu mẫu.

Lưu trên máy KHÔNG phải chế độ offline hoàn chỉnh: APK hiện dùng giao diện trên Render, cần mạng để tải giao diện khi chưa có cache. Không gỡ app/xóa dữ liệu Android hoặc dữ liệu trang web nếu chưa Xuất JSON vì thao tác đó có thể xóa sổ tay local. Cài cập nhật đè giữ dữ liệu ứng dụng; không phải thao tác gỡ/cài mới.

Google là tùy chọn: kết nối để dùng Calendar/Drive và sổ tay tài khoản trên MongoDB. Khi kết nối sau khi đã tạo việc local, app hiện lựa chọn sao chép vào tài khoản hoặc giữ riêng. Không tự trộn. Khi sao chép, tạo ID mới và giữ quan hệ cha/con; bản local gốc vẫn giữ. “Giữ riêng trên máy” không nhập vào tài khoản; sổ tay đang hiển thị lúc đã đăng nhập là sổ tay tài khoản. Đăng xuất trong Cài đặt để trở lại sổ tay local. Không tự chuyển toàn bộ dữ liệu tài khoản sang thiết bị khi logout.

Gemini không bắt buộc đăng nhập Google: dùng API key của chính bạn trong Cài đặt; ở chế độ local key chỉ nằm trong bộ nhớ phiên, gửi trực tiếp đến Gemini khi hỏi, cần nhập lại sau khi mở lại. Khi có tài khoản, dùng cơ chế lưu key mã hóa trên backend như trước. Có lựa chọn không gửi dữ liệu công việc cho AI; dữ liệu chỉ gửi nếu bật chia sẻ tác vụ.

Dọn dữ liệu local: khi mở lại sổ tay, nếu đủ90ngày từ đợt kiểm tra trước thì xóa việc hoàn thành hơn10ngày bằng cùng quy tắc retention; giữ việc chưa xong, ngày lỗi và quan hệ con được bảo vệ. Bản tài khoản giữ cơ chế maintenance backend đã có.

## Cách cập nhật

1. Xuất bản sao JSON trong app trước khi cập nhật nếu đã có công việc quan trọng.
2. Giải nén GuiKhueNha-1.7.2-FullProject.zip. Copy đầy đủ nội dung thư mục GuiKhueNha vào repository gui-khue-nha hiện tại trên Mac, giữ .git của repo, .env và khóa ký riêng. Không chỉ copy thư mục apps/api: frontend, shared, lib và Android đều thay đổi.
3. Từ thư mục repository:

```bash
git status
git add apps features shared lib scripts docs package.json vite.config.ts README.md HUONG-DAN-1.7.2.md KIEM-TRA-1.7.2.md .github .gitignore
git diff --cached --stat
git commit -m "Fix mobile Google session recovery and allow local journal without login"
git push origin main
```

Kiểm tra danh sách trước commit, không stage .env, key ký hoặc log có dữ liệu riêng. Trong GitHub giao diện web cũng có thể upload source; nhớ cả file cấu hình Android gốc và module app, đây là hai file khác nhau.

4. Render: giữ service cũ, Dockerfile Path=./Dockerfile.render, Context=., Root Directory trống. Auto-deploy hoặc Manual Deploy → Deploy latest commit. Gói source có frontend apps/web/dist build sẵn.
5. Mở https://gui-khue-nha.onrender.com/api/config: phải thấy release:"1.7.2" và mobileAuthVersion:2. commit hiển thị12 ký tự đầu của RENDER_GIT_COMMIT nếu có. Đừng dựa chỉ vào tên file APK để xác nhận backend mới.
6. Cài GuiKhueNha-1.7.2-release.apk ĐÈ bản cũ. Package vn.nhipviec.mobile, versionName1.7.2, versionCode9. Không gỡ bản cũ, không xóa dữ liệu ứng dụng, không xóa DB. App sử dụng cùng chứng chỉ ký các APK đã giao trước.
7. Mở app để cập nhật widget. Thử tạo một việc khi chưa đăng nhập, đóng/mở app, kiểm tra việc còn. Sau đó mới thử Google nếu cần đồng bộ.

Nếu Android từ chối cài do khác chữ ký, KHÔNG gỡ app để ép cài vì có thể mất local. Bản APK này ký bằng key backup gốc; nếu bản đang cài được ký bằng key khác trong GitHub Secrets, cần dùng đúng key của bản đó để build. Nếu trên điện thoại đã có versionCode lớn hơn9, cần tăng mã phiên bản phù hợp trước build.

## Google: kết nối một lần rồi mở app bình thường

Mở app → Kết nối Google → chọn Gmail → cấp quyền → Trở về Gửi Khuê Nhã. Chỉ đăng nhập Google bằng trình duyệt hệ thống. Không nhập Google password trong WebView.

Liên kết bàn giao hiệu lực10phút; nó không phải thời hạn đăng nhập app. Sau khi đã vào được app, mở app từ icon để dùng tiếp, không mở lại liên kết Chrome cũ.

Phiên app lưu bằng cookie HttpOnly/Secure trong WebView. Phiên có thời hạn30ngày và được gia hạn khi khởi động hợp lệ, tối đa90ngày từ lúc tạo phiên. Đăng xuất sẽ thu hồi phiên. Không có cam kết đăng nhập vĩnh viễn: Google có thể thu hồi quyền hoặc yêu cầu xác thực lại. Nếu OAuth còn Testing, refresh token Drive/Calendar có thể hết hạn sau7ngày; quyền Google và phiên app là hai việc riêng.

Không tạo lại MongoDB hay OAuth client. Giữ GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APP_ORIGIN đúng và APP_ENCRYPTION_KEY hiện có. Không đổi khóa mã hóa tùy tiện vì token Google/keyAI cũ đang mã hóa bằng khóa đó.

Calendar hai chiều vẫn bật riêng ở trang Lịch, cần Google Calendar API đã Enable. Quy tắc cửa sổ30ngày trước/180ngày tới, xóa/gỡ liên kết và sự kiện lặp theo BAN-1.7-CALENDAR-WIDGET.md vẫn áp dụng.

## Đã sửa các lỗi nào?

- Liên kết không hợp lệ lúc mở app từ trạng thái tắt vẫn có sổ tay và hộp phục hồi, không để màn hình trống.
- Trao đổi mã lấy cookie bằng HTTP riêng; không dùng WebView.postUrl làm bước xác lập phiên. Chỉ tải sổ tay sau CookieManager xác nhận đã nhận cookie.
- Giữ verifier/state đến khi lưu cookie thành công. Lưu trạng thái chờ xuống private preferences trước khi mở browser. Chặn callback trùng lúc đang xử lý; bấm lại liên kết hoàn tất chỉ mở sổ tay.
- Backend transaction tạo session và đánh dấu mã bàn giao cùng nhau. Khi lỗi mạng làm mất phản hồi, cùng mã+verifier được thử nhận lại cùng phiên trong60giây; không tạo thêm phiên. Sau cửa sổ này hoặc sau logout sẽ từ chối, không hồi sinh session.
- WebView chính và popup đều có xử lý renderer chết. Dọn popup khi Activity đóng. Không tự tải lại vô hạn nếu renderer liên tiếp lỗi; hiện màn hình phục hồi native.
- Widget không đăng ký lại cùng job mỗi lần capture; lỗi lập lịch không được làm hỏng giao diện Google. Có chế độ widget local riêng, chọn lại việc hôm nay/khẩn cấp theo ngày Việt Nam khi widget làm mới.
- Sửa Android root build.gradle thành khai báo AGP8.9.1 apply false; cấu hình app ở app/build.gradle, dùng Gradle8.11.1/JDK17/SDK35.
- Sửa root Vite config không còn phụ thuộc .openai/hosting.json không có trong ZIP; đồng bộ phiên bản và kiểm tra chữ ký/metadata trong workflow GitHub Actions.

## Khi kết nối gặp lỗi

Nếu có hộp “Liên kết đã hết hạn/đã dùng”: chọn Vào sổ tay nếu đã đăng nhập. Nếu chưa có phiên chọn Đăng nhập mới. Không cần xóa app hoặc DB. Khi lỗi mạng có nút Thử nhận lại; liên kết quá cũ cần bắt đầu lượt Google mới.

Nếu app vẫn thực sự bị Android đóng: cập nhật Chrome/Android System WebView, sau đó lấy log ngay sau lần lỗi:

```bash
adb logcat -b crash -d > guikhuenha-crash.log
```

Không gửi mật khẩu/secret hoặc URL callback còn mã vào chat. File crash.log trong ZIP bạn gửi trước đó là0byte, không có stack trace để chứng minh nguyên nhân crash trên máy.

## Chạy Mac/build lại

Node>=22.18, nên Node24. Xem giao diện/lưu trên máy: bash RUN-MAC.sh rồi http://localhost:3000; bản này không bắt buộc Google để tạo việc thật trên máy. Chế độ portable chỉ phục vụ web build và không có API tài khoản thật.

Phát triển: bash RUN-MAC.sh dev; .env theo .env.example nếu cần Mongo/Google. Callback local http://localhost:3000/auth/google/callback. Frontend npm run build. Kiểm tra npm run test:app và npx tsc --noEmit.

Android: JDK17 + SDK35, cd apps/android rồi ./gradlew :app:assembleDebug. Release cần biến KN_KEYSTORE_PATH, KN_KEYSTORE_PASSWORD, KN_KEY_PASSWORD, KN_KEY_ALIAS riêng; ./gradlew :app:assembleRelease. Source không chứa private key/password ký. Có workflow GitHub build release bằng Secrets đang dùng.

## Giới hạn xác minh

Đã build web/typecheck/test và build APK ký, kiểm chứng chứng chỉ gốc, alignment. Có kiểm thử Java HTTP nhận cookie/no-redirect và test phục hồi transaction/session với DB giả lập. Chưa chạy trên điện thoại/emulator hoặc đăng nhập Google thật; chưa kiểm thử Mongo transaction trên Atlas thật. Không coi build/SSR/mock là kiểm thử thiết bị thật. Chưa tự push/deploy lên GitHub/Render của bạn.
