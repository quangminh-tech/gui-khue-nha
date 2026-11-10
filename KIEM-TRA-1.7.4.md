# Kiểm tra 1.7.4

TypeScript, web build và test:app qua. Test mới scripts/test-project-layout.mjs qua: tên lĩnh vực tương đương được gộp, tên khác dấu giữ riêng, không đổi ID/cha-con/checklist/link; migration ổn định khi chạy lại; editor options/chips không lặp; CSS thực tế của bản build có layout cây, hàng, nút lĩnh vực và tài liệu. Android assembleRelease qua, chữ ký khớp bản trước, zipalign và versionCode11/versionName1.7.4 qua. Chưa kiểm tra browser/điện thoại thật; Google/Mongo tests dùng mock; chưa deploy.
