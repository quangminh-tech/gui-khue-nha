# MongoDB và ranh giới dữ liệu

Backend thực thi nằm trong apps/api/src. Demo Sites vẫn dùng D1, không giả định có MongoDB qua biến môi trường trong Worker (MongoDB driver không dùng trực tiếp ở runtime Sites).

| Collection | Khóa/index | Nội dung |
|---|---|---|
| users | _id = Google sub | Email, tên, selectedFiles (chỉ ID, tối đa 2000) |
| workspaces | _id = owner | Version, settings, members; resources cũ để tương thích |
| tasks | unique(owner,id), owner/status/due, owner/parentId, owner/completedAt | Task, parentId, checklist nhúng, links nhúng, repeat |
| sessions | _id = SHA256(random cookie); TTL expiresAt | owner, thời hạn phiên |
| oauth_states | _id = hash(state); TTL expiresAt | PKCE verifier, owner/mode, scopes, thời hạn |
| google_credentials | _id = owner | Access/refresh token mã hóa, scope, expiry |
| ai_keys | _id = owner | Gemini key mã hóa; không có GET trả plaintext |
| ai_usage | _id = owner:day, TTL expiresAt | Bộ đếm hạn mức gửi AI |
| maintenance | _id policy | lastRunAt, leaseUntil, số task đã dọn |

Task document mẫu:

```json
{"owner":"google-sub","id":"uuid","parentId":null,"title":"Chuẩn bị báo cáo","description":"Ghi chú riêng","project":"Cá nhân","assignee":"","due":"2026-11-10","time":"09:00","priority":"Cao","status":"doing","completedAt":null,"reminder":15,"repeat":"weekly","tags":[],"checklist":[{"id":"uuid-c","text":"Kiểm tra số liệu","done":false}],"links":[{"id":"uuid-l","title":"Bảng số liệu","url":"https://docs.google.com/spreadsheets/d/…","kind":"sheet","driveFileId":"selected-file-id"}]}
```

Backend nhận snapshot để giữ tương thích frontend; từng task được ghi thành document riêng trong transaction. Không có Mongo foreign key: service kiểm tra ID trùng, parent không tồn tại, chu trình, resource reference cũ; mọi thao tác DB có owner lấy từ session, không lấy owner từ request body. Không tạo nhóm/assignee UI. Giới hạn 2000 task, 100 checklist/task, 30 link/task, 10 tag/task. Không có file blob/base64 trong tasks.

Version tăng trong cùng transaction. Hai thiết bị lưu cùng version chỉ một bên thành công; bên kia nhận 409, không âm thầm ghi đè. Hiện chưa có patch từng task, pagination server hoặc merge xung đột. Hai người ít dữ liệu phù hợp, mở rộng lớn nên chuyển API từng task và pagination.

Tiến độ việc lớn = số leaf con đã hoàn thành / tổng leaf. Trạng thái parent cập nhật từ các con. Hoàn thành leaf qua nút chính đánh dấu đủ checklist; hoàn thành việc lặp tạo một bản todo kỳ kế tiếp, không tạo lại khi bấm hoàn thành lần hai trên bản done.

Di chuyển từ D1: export JSON trong Settings → dry-run `scripts/import-mongo.mjs` → người dùng đăng nhập Google vào app Render → lấy id của chính họ từ /api/me → import --apply vào workspace đang trống. Script từ chối ghi đè workspace đã tồn tại. Không tự chuyển tài khoản ChatGPT sang Google bằng cách đoán email; không migrate API keys/tokens. Dữ liệu legacy resources được UI migrate thành links trong task; có thể còn metadata legacy để tương thích trong backup cũ.
