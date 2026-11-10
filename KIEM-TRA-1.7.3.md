# Kiểm tra Gửi Khuê Nhã 1.7.3

Ngày: 10/11/2026. Input: GuiKhueNha-1.7.2-FullProject(1).zip.

- npx tsc --noEmit: PASS.
- npm run build: PASS; apps/web/dist được làm mới và đi kèm source.
- npm run test:app: PASS. Các test cũ về Pomodoro, tài liệu, retention, HTTP, OAuth/mobile handoff, recovery, Calendar/widget, guest storage và task detail vẫn qua.
- scripts/test-task-documents.mjs: PASS — flush link/checklist, URL an toàn, sửa/trùng/giới hạn, Drive file ID, tài liệu việc con không copy, schema, cây cha-con, lĩnh vực.
- scripts/test-task-editor-interaction.mjs: PASS — tương tác React thực hiện nhập link → Lưu không bấm + → schema/lưu local → mở lại; lỗi lưu không đóng và giữ draft; chọn cây/đổi cha giữ subtree; lĩnh vực mới; sửa/gỡ; mở chủ sở hữu tài liệu con.
- Android Gradle :app:assembleRelease: PASS, JDK17/SDK35/AGP8.9.1.
- apksigner verify: PASS; SHA256 chứng thư khớp bản trước: 11869aec45550e8070c26c87f95b8e0c0d9889d88d71a5d9e64414abe8de0bd6.
- zipalign -c -P 16 4: PASS.
- aapt metadata: vn.nhipviec.mobile, versionCode10, versionName1.7.3.
- SHA256 APK: 2e7abfff494a1ab065a16129b9d24fe0474a3d8c0b97b96b0e3c7d27dd4e3257.

Giới hạn: kiểm thử tương tác dùng React renderer và storage giả lập, không phải điện thoại/browser thật. Browser headless không khởi động được trong môi trường này. Google/Mongo dùng mock trong tests; không truy cập dữ liệu cá nhân. Chưa deploy Render hay cài trên điện thoại thật. Chỉ kiểm tra endpoint config công khai của Render: còn release1.7.2 và googlePickerConfigured=false. Nút Picker cần cấu hình thật và thử trên từng thiết bị sau deploy.
