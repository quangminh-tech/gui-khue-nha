# Kiểm tra 1.7.6

TypeScript/build web: PASS. Bộ test:app và test-reminder-custom.mjs kiểm tra tương tác task/settings, preset→custom→unit conversion→save→restore; phút/giờ/ngày, số lẻ, giá trị không hợp lệ, tắt nhắc, schema/Calendar/Android cùng số phút; CSS mới có trong bản build. Native assembleRelease: PASS, metadata versionCode13/versionName1.7.6, chữ ký khớp gốc, zipalign PASS. Chưa kiểm tra điện thoại/tài khoản Google thật, chưa deploy.
