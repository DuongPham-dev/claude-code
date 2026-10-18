# #6 — Run the project and its checks from the terminal

- **Nguồn:** https://github.com/DuongPham-dev/claude-code/issues/6
- **Labels / Assignee:** `enabler`, `priority: must` / chưa gán
- **Ngày phân tích:** 2026-10-18
- **Trạng thái:** Đã làm rõ
- **Issue liên kết:** #5 — Epic "Personal todo list management": #6 là ticket đầu tiên (Must), không UI, dữ liệu giữ trong bộ nhớ.

## Tóm tắt
Người học muốn khởi động project TypeScript và chạy các kiểm tra từ terminal (không UI) để các ticket sau có cách demo và kiểm chứng lặp lại được. Chưa có hành vi todo nào.

## What it asks
- Mục tiêu: chạy project và các kiểm tra hoàn toàn từ terminal.
- Business rules: BR-1 viết bằng TypeScript; BR-2 mọi thao tác qua terminal, không UI.
- Acceptance criteria:
  - AC-1: checkout mới, làm theo README thì project sẵn sàng chạy, không cần sửa tay.
  - AC-2: một lệnh "demo" chạy thành công và in ra một thông điệp nhìn thấy được.
  - AC-3: một lệnh "check" chạy kiểm tra tự động, báo pass/fail, có ít nhất một sample check pass.
  - AC-4: khi code có lỗi kiểu, lệnh "type check" báo lỗi đó.
  - AC-5: README liệt kê ba lệnh và mục đích từng lệnh.
- Phạm vi: getting-started và ba lệnh. Ngoài phạm vi: hành vi todo, CI, deployment.

## Chỗ mơ hồ / mâu thuẫn / thiếu
- **Mâu thuẫn:** không có.
- **Mơ hồ:** chưa rõ "check" có bao gồm type check không (đã làm rõ, xem câu 1).
- **Quy mô ticket:** một mục tiêu, không cần tách.

## Clarifying questions
### Blocker
Không có.
### Nên làm rõ
1. Ba lệnh demo / check / type check là độc lập, hay "check" gồm cả type check? — *Đề xuất:* ba lệnh độc lập.

## Out of scope (đề xuất)
- Mọi hành vi todo (#7–#15), CI, deployment.
- Lint, format, build/đóng gói, hot-reload.
- Hỗ trợ nhiều hệ điều hành/phiên bản runtime.

## Bước tiếp theo
Lập plan: `plan-ticket 6`.

## Câu trả lời
Phản hồi bổ sung của người dùng sau khi phân tích (2026-10-18):
- Chỉ cần cấu hình TypeScript và Jest, giữ đơn giản. Không thêm công cụ khác.
- Các lệnh chạy dưới dạng `run` command (hiểu là script chạy bằng `npm run <tên>`; tên cụ thể do plan quyết định).
- Một số nội dung trong bản phân tích đầu là thừa, đã lược bỏ: các câu hỏi về môi trường/OS, hình dạng entry point cho #14 và cách thể hiện pass/fail (mặc định theo Jest/tsc), cùng các mục out-of-scope không cần thiết.
- Câu 1: chưa trả lời rõ; mặc định ba lệnh độc lập (check = Jest, type check = tsc).
