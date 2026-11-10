# Kiểm tra1.7.2

- Vite build + TypeScript đạt; root config không còn thiếu .openai/hosting.json.
- Các suite ứng dụng: Pomodoro, link/tài liệu, retention, app/progress, HTTP/auth isolation, OAuth mocked-provider, Calendar/widget, SSR task detail và10 theme.
- Suite mới: transaction rollback ở bước insert/update, sai verifier, callback đồng thời, mất phản hồi nhận lại cùng session, cutoff60giây, logout không hồi sinh, gia hạn phiên và giới hạn90ngày.
- Local journal: lưu/khôi phục không Google, sao chép chủ động với ID cha/con mới, giữ bản gốc, từ chối dữ liệu hỏng, retention local90ngày.
- Java MobileSessionExchangeTest: nhận cookie từ response JSON/legacy303, không follow redirect, xử lý401. Đây là HTTP/JVM test, không phải test Activity/WebView trên điện thoại.
- Android release1.7.2, versionCode9, JDK17/Gradle8.11.1/AGP8.9.1/SDK35. Chứng chỉ SHA256 khớp bản cũ:11869aec45550e8070c26c87f95b8e0c0d9889d88d71a5d9e64414abe8de0bd6. Apksigner/zipalign đạt.
- Không có log crash thực từ điện thoại: file ZIP gốc chứa guikhuenha-crash.log rỗng. Chưa xác minh thiết bị/emulator, Google thật hoặc Atlas transaction thật. Không tuyên bố mọi crash đã được tái hiện.
