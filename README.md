# Gửi Khuê Nhã 1.7.7

Bản full kế thừa 1.7.6, thêm ngày bắt đầu–deadline, lịch lặp ngày/tuần/tháng/năm/tùy chỉnh và hiển thị trên lịch tháng/ngày. Mỗi lần có checklist riêng; sửa/xóa theo phạm vi lần này, từ lần này hoặc toàn chuỗi. Đọc HUONG-DAN-1.7.7.md và cập nhật Render trước APK.

- Frontend React/Vite: features/app, components, lib; build sẵn apps/web/dist.
- Backend Node24/MongoDB: apps/api/src. Sổ tay local không bắt buộc Google.
- Engine ngày/lặp: shared/scheduling.mjs, dùng chung web/API/snapshot Android.
- Google đồng bộ từng lần trong cửa sổ 30 ngày trước–60 ngày tới, tối đa 40 lần đẩy/lượt; không dùng RRULE gốc Google.
- Android hybrid: apps/android. Package vn.nhipviec.mobile, versionCode14; JDK17, SDK35, AGP8.9.1, Gradle8.11.1.
- Kiểm tra: npx tsc --noEmit; npm run build; npm run test:app.
- Mac: bash RUN-MAC.sh hoặc bash RUN-MAC.sh dev.

Không gỡ app/xóa dữ liệu để cập nhật. Giữ .env, APP_ENCRYPTION_KEY và khóa ký cũ riêng. Xem KIEM-TRA-1.7.7.md cho phạm vi kiểm thử. Tài liệu 1.7.6 trở về trước là lịch sử.
