# Kiểm tra 1.7.5

TypeScript, build web và test:app: PASS. Tests dùng React renderer/SSR và mock Google/Mongo, không phải tích hợp tài khoản/điện thoại thật. Test mới scripts/test-release175.mjs, scripts/test-delete-transaction.mjs và cases bổ sung test-calendar-widget.mjs. Android assembleRelease, signature match gốc, zipalign và metadata versionCode12 được xác minh. Chưa deploy Render hoặc cài trên máy thật. Xem HUONG-DAN-1.7.5.md cho cách thử lại.
