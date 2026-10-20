# #8 — Add a task to my list

- **Nguồn:** https://github.com/DuongPham-dev/claude-code/issues/8
- **Labels / Assignee:** user-story, priority: must / chưa có assignee
- **Ngày phân tích:** 2026-10-20
- **Trạng thái:** Đang chờ làm rõ
- **Issue liên kết:** #7 — Keep a collection of tasks during a session (task có id duy nhất, title, status done/not-done, thời gian tạo; giữ theo thứ tự tạo; chỉ trong bộ nhớ; "Adding via user operations" thuộc #8). #5 — epic cha (chỉ được nhắc, không đọc). #15 — lưu xuống đĩa (nằm ngoài phạm vi, chỉ được nhắc trong #7).

## Tóm tắt
Chủ danh sách todo muốn thêm một task bằng title để không quên việc. Đây là thao tác cốt lõi: không có nó thì danh sách không có nội dung.

## What it asks
- Mục tiêu: thêm một task vào danh sách bằng một title.
- Hành vi mong muốn (business rules):
  - BR-1: title bắt buộc, phải có ít nhất một ký tự không phải khoảng trắng.
  - BR-2: khoảng trắng đầu/cuối title bị bỏ qua.
  - BR-3: task mới luôn ở trạng thái "not done".
  - BR-4: người thêm nhận lại task vừa được tạo.
- Acceptance criteria:
  - AC-1: danh sách rỗng, thêm "Buy milk" → danh sách có đúng một task "Buy milk", status "not done".
  - AC-2: thêm "  Buy milk  " → title lưu là "Buy milk".
  - AC-3: title rỗng hoặc chỉ có khoảng trắng → không thêm task, trả lỗi rõ ràng nói title là bắt buộc.
  - AC-4: hai task cùng title → cả hai được giữ như hai task riêng.
  - AC-5: thêm thành công → nhận lại task mới, gồm cả identifier.
- Ràng buộc/phạm vi được nêu: In scope là thêm một task. Out of scope là sửa task và import nhiều task. Không có UI, thao tác chạy từ terminal. Dữ liệu chỉ nằm trong bộ nhớ trong một lần chạy. Phụ thuộc #7 (collection đã tồn tại). Priority: Must.

## Chỗ mơ hồ / mâu thuẫn / thiếu
- **Mâu thuẫn:** Không có mâu thuẫn giữa các AC. Ticket không có comment.
- **Mơ hồ:**
  - "Title" không nêu độ dài tối đa (ticket tự liệt kê là open question) (xem câu 1).
  - "Khoảng trắng" không nói có gồm tab, xuống dòng, hay khoảng trắng Unicode ngoài dấu cách hay không (xem câu 2).
  - "Clear error saying the title is required" không nói hình thức lỗi: thông điệp chính xác, mã thoát của lệnh, hay đầu ra ở đâu (xem câu 3).
  - "Exercised from the terminal" không nói thao tác thêm được gọi bằng cách nào (lệnh CLI hay chỉ qua hàm/API nội bộ) (xem câu 3).
  - Khoảng trắng bên trong title (ví dụ "Buy   milk") không được nhắc: giữ nguyên hay không chưa rõ (xem câu 2).
- **Thiếu:**
  - Không có AC cho title quá dài, vì chưa có giới hạn.
  - Không nói title vắng mặt hẳn (null/không truyền) xử lý ra sao so với chuỗi rỗng (xem câu 4).
  - Không nói "creation time" của task (đã định nghĩa ở #7) có nằm trong task trả về hay không; AC-5 chỉ nói "including its identifier".
- **Quy mô ticket:** Vừa đủ, một việc duy nhất.

## Clarifying questions
Viết sao cho gửi thẳng được cho PM/reporter.
### Blocker
Không có. Ticket đủ rõ để bắt đầu với các giả định mặc định bên dưới.

### Nên làm rõ
1. Có giới hạn độ dài tối đa của title không? — *Vì sao cần:* nếu có, cần thêm quy tắc kiểm tra và thông điệp lỗi; nếu không, một title cực dài vẫn được chấp nhận. *Lựa chọn:* A) không giới hạn / B) giới hạn N ký tự (xin con số N) và từ chối khi vượt. *Đề xuất:* A cho bản đầu, vì ticket chưa yêu cầu.
2. "Khoảng trắng" cần cắt/kiểm tra gồm những gì, và khoảng trắng bên trong title có được giữ nguyên? — *Vì sao cần:* quyết định "\t", "\n" hay khoảng trắng Unicode có tính là rỗng/được cắt hay không. *Lựa chọn:* A) mọi ký tự whitespace chuẩn của ngôn ngữ, chỉ cắt đầu/cuối, giữ nguyên bên trong / B) chỉ dấu cách. *Đề xuất:* A.
3. Lỗi "title is required" cần thể hiện thế nào khi chạy từ terminal, và thao tác thêm được gọi ra sao? — *Vì sao cần:* ảnh hưởng thiết kế giao diện của thao tác thêm và cách kiểm thử. *Lựa chọn:* A) hàm/API nội bộ ném lỗi có thông điệp rõ ràng, chưa có lệnh CLI / B) thêm lệnh CLI in lỗi và thoát với mã khác 0. *Đề xuất:* A, vì ticket ghi "no UI" và không đòi lệnh CLI.
4. Title thiếu hẳn (không truyền / null) có xử lý như title rỗng, tức cùng lỗi "title is required"? — *Vì sao cần:* tránh hai kiểu lỗi khác nhau cho cùng một lỗi người dùng. *Đề xuất:* có, cùng lỗi.

### Nice-to-have
5. Duplicate title được phép đúng không (ticket tự nêu ở Open questions, AC-4 giả định có)? — *Đề xuất:* xác nhận có, giữ nguyên AC-4.
6. Task trả về có đầy đủ các trường đã định nghĩa ở #7 (id, title, status, creation time), hay chỉ cần id và title? — *Đề xuất:* trả về toàn bộ task.

## Out of scope (đề xuất)
- Sửa task, import nhiều task (ticket đã nêu rõ).
- Lưu xuống đĩa (#15), UI.
- Xóa task, đánh dấu done, tìm kiếm/lọc.
- Giới hạn số lượng task trong danh sách.
- Chuẩn hóa title khác ngoài cắt khoảng trắng đầu/cuối (đổi hoa/thường, gộp khoảng trắng).

## Bước tiếp theo
Không có câu Blocker; có thể lập plan ngay với các đề xuất mặc định, đồng thời gửi các câu "Nên làm rõ" cho PM. Sau đó: plan → implement.

## Câu trả lời
(Điền khi người dùng trả lời, theo số câu; giữ lại khi phân tích lại.)
