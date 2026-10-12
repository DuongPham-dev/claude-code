# Context
Tạo project Next.js tên [tên] trong [thư mục hiện tại / thư mục mới].
Đây là project thực hành Claude Code của mình.

# Output
- Next.js bản mới nhất, App Router, cấu trúc src/
- TypeScript, quản lý package bằng pnpm
- Các option khác (linter, Tailwind, import alias): [chỉ định cụ thể]
  hoặc: bạn tự chọn, nhưng liệt kê lựa chọn và lý do trước khi chạy
- Không commit, mình sẽ tự commit

# Workflow
1. Tra version Next.js mới nhất trên trang chính thức; kiểm tra Node và pnpm trên máy có đáp ứng yêu cầu không
2. Báo lại version + các option sẽ dùng, chờ mình xác nhận
3. Init project
4. Chạy `pnpm build`, sau đó chạy dev server để kiểm tra trang load được, rồi dừng server

# Performance
- Dừng lại hỏi mình: trước khi init, khi gặp option chưa được nêu ở trên, và trước khi ghi đè hoặc xóa file
- Báo kết quả ngắn gọn: version đã dùng, lệnh đã chạy, có lỗi hoặc cảnh báo gì