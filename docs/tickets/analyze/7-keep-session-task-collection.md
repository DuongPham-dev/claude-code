# #7 — Keep a collection of tasks during a session

- **Nguồn:** https://github.com/DuongPham-dev/claude-code/issues/7
- **Labels / Assignee:** `user-story`, `priority: must` / chưa gán
- **Ngày phân tích:** 2026-10-18
- **Trạng thái:** Đã làm rõ
- **Issue liên kết:**
  - #5 — Epic "Personal todo list management": không có UI, chủ sở hữu thao tác qua các operation gọi từ terminal.
  - #6 — (đã đóng) chạy project và các check từ terminal, dùng TypeScript.
  - #8 — (mở) thêm task qua thao tác của người dùng, có quy tắc validate title.
  - #15 — (mở) lưu task qua các lần chạy; khi load phải giữ nguyên id, title, status, creation time và thứ tự.

## Tóm tắt
Ticket muốn có định nghĩa một task và nơi giữ các task trong bộ nhớ trong một lần chạy, làm nền tảng cho mọi tính năng khác của todo list.

## What it asks
- Mục tiêu: các task được giữ cùng nhau trong một danh sách khi app đang chạy để thao tác trên cả danh sách. Priority: Must.
- Hành vi mong muốn (business rules):
  - BR-1: task có id duy nhất, title, trạng thái done/not-done, thời điểm tạo.
  - BR-2: task mới luôn là not done.
  - BR-3: không có hai task trong cùng danh sách dùng chung id.
  - BR-4: task được giữ theo thứ tự tạo.
  - BR-5: dữ liệu chỉ tồn tại khi app chạy; lần chạy mới bắt đầu với danh sách rỗng.
- Acceptance criteria:
  - AC-1: lần chạy mới, danh sách rỗng.
  - AC-2: task đã lưu hiển thị id, title, status "not done", creation time.
  - AC-3: hai task đã lưu có id khác nhau.
  - AC-4: lưu A rồi B thì đọc danh sách thấy A trước B.
- Ràng buộc/phạm vi được nêu:
  - In scope: định nghĩa task và việc giữ trong bộ nhớ.
  - Out of scope: thêm task qua thao tác người dùng (#8), lưu xuống đĩa (#15).
  - Không có UI, thao tác từ terminal; phụ thuộc #6.

## Chỗ mơ hồ / mâu thuẫn / thiếu
- **Mâu thuẫn:** Không có mâu thuẫn trực tiếp. BR-5 (không lưu bền) khác #15 nhưng #15 là ticket sau, mở rộng chứ không đối nghịch.
- **Mơ hồ:**
  - Ticket tự nêu câu hỏi mở về việc dùng lại id sau khi xóa task, trong khi chưa có thao tác xóa nào được nêu, còn BR-3 chỉ nói "trong cùng danh sách" (xem câu 1).
  - Kiểu/định dạng của id không được nêu; #15 yêu cầu id giữ nguyên qua save/load (xem câu 2).
  - "Creation time" chưa rõ định dạng, độ chính xác, múi giờ; AC-4 dựa vào thứ tự chứ không dựa vào thời gian nên hai task có thể trùng thời điểm (xem câu 4).
  - Danh sách được "inspect/read" bằng cách nào từ terminal chưa rõ (xem câu 5).
- **Thiếu:**
  - Không có quy tắc nào cho title ở ticket này (rỗng, độ dài); #8 lo validate nhưng chưa rõ định nghĩa task ở #7 có phải từ chối title không hợp lệ (xem câu 3).
  - Chưa có thao tác nào để lưu task cho tới khi có #8, trong khi AC-2/3/4 cần lưu task để kiểm chứng (xem câu 5).
  - Chưa nêu người gọi có được sửa trực tiếp danh sách/task đã lưu hay không (xem câu 6).
- **Quy mô ticket:** Vừa phải, không cần tách.

## Clarifying questions
### Blocker
Không có. Phần cốt lõi đã rõ và các câu dưới đây đều có mặc định an toàn.

### Nên làm rõ
1. Id có được dùng lại sau khi task bị xóa không? — *Vì sao cần:* ảnh hưởng cách sinh id; đổi sau này sẽ ảnh hưởng #15. *Lựa chọn:* A. không bao giờ dùng lại / B. có thể dùng lại. *Đề xuất:* A.
2. Id có kiểu gì? — *Vì sao cần:* #15 phải lưu và nạp lại đúng id. *Lựa chọn:* A. chuỗi không mang ý nghĩa (ví dụ UUID) / B. số tăng dần. *Đề xuất:* A.
3. Việc kiểm tra title (không rỗng, bỏ khoảng trắng đầu/cuối) chỉ thuộc #8 hay #7 cũng phải làm? — *Vì sao cần:* tránh làm trùng hoặc bỏ sót. *Lựa chọn:* A. chỉ #8 / B. cả hai. *Đề xuất:* A.
4. Creation time dùng định dạng nào, và thứ tự dựa vào thời điểm tạo hay thứ tự chèn? — *Vì sao cần:* hai task tạo cùng lúc vẫn phải đúng thứ tự (AC-4). *Lựa chọn:* A. thời điểm ISO-8601 UTC, thứ tự theo thứ tự chèn / B. thứ tự theo timestamp. *Đề xuất:* A.
5. Khi chưa có #8, kiểm chứng AC-2/3/4 bằng cách nào? — *Vì sao cần:* quyết định #7 có cần một thao tác lưu tối thiểu hay chỉ kiểm thử trực tiếp. *Lựa chọn:* A. thao tác lưu nội bộ tối thiểu, chỉ dùng cho test/terminal, #8 bọc lại / B. đợi #8. *Đề xuất:* A.

### Nice-to-have
6. Danh sách trả về cho người gọi có nên là bản sao (không sửa trực tiếp được) không? — *Vì sao cần:* bảo vệ BR-3 và BR-4. *Lựa chọn:* A. trả bản sao / B. trả tham chiếu. *Đề xuất:* A.

## Out of scope (đề xuất)
- Thêm task qua thao tác người dùng và validate title (#8, theo ticket).
- Lưu xuống đĩa và nạp lại (#15, theo ticket).
- Xóa, sửa, đánh dấu hoàn thành task.
- UI, đa người dùng, lọc/sắp xếp khác thứ tự tạo, due date, priority, tag (epic #5).

## Bước tiếp theo
Sau khi trả lời các câu hỏi (không có câu Blocker): lập plan → implement.

## Câu trả lời
1. Không bao giờ dùng lại id.
2. Id là chuỗi không mang ý nghĩa (ví dụ UUID).
3. Validate title chỉ thuộc #8; #7 không từ chối title nào.
4. Creation time ISO-8601 UTC; thứ tự danh sách theo thứ tự chèn.
5. Thao tác lưu nội bộ tối thiểu chỉ dùng cho test/terminal; #8 bọc lại.
6. Danh sách trả về là bản sao.
