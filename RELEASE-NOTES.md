# 1.7.3

- Save flushes pending document URL/checklist; failed saves retain draft.
- Explicit URL, type/source, open/copy/edit/remove, child-owned document aggregation.
- Hierarchical parent selection retains current parent, excludes self/descendants.
- Existing project/domain choices plus free entry.
- Picker loader timeout/retry and accurate missing-configuration hint.
- Android versionCode10, same package/signing certificate; prebuilt web refreshed.

# Gửi Khuê Nhã 1.2 — Android Release

Bản Android được chuẩn bị để cài trực tiếp ngoài Play Store. Nhập URL máy chủ Render trong app; không hardcode URL Site demo riêng tư. Giao diện công việc vẫn là web responsive mở bằng Android Custom Tabs, dùng phiên đăng nhập trình duyệt. Widget và lịch nhắc cục bộ là native. Đây không phải client native offline đầy đủ.

Frontend giữ giao diện Liyue–Morax theo ảnh: vùng thay theo nhân vật, % task/goal, dashboard deadline, checklist, tài liệu trong task, Pomodoro, báo cáo và Gemini tùy chọn. Source Node/MongoDB dùng OAuth Google, mỗi người có workspace riêng.

Render dùng Dockerfile nhẹ, chỉ cài dependencies API và dùng frontend đã build trong apps/web/dist. Không cần build Vinext/Worker hoặc pnpm trên Render. Sau khi sửa UI, phải build:web rồi commit bundle mới. Đọc HUONG-DAN-TRIEN-KHAI.md trước khi đưa lên GitHub.

Không có URI MongoDB, Google secret hay key ký Android trong source. Bản sao key ký được giao riêng, phải giữ riêng tư để phát hành cập nhật cùng chữ ký. APK chưa được thử trên điện thoại thật trong môi trường bàn giao; xem BAO-CAO-KIEM-TRA.md để biết những kiểm tra đã chạy.
