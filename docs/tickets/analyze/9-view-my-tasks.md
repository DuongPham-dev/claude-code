# #9 — View my tasks

- **Nguồn:** https://github.com/DuongPham-dev/claude-code/issues/9
- **Labels / Assignee:** user-story, priority: must / chưa có assignee
- **Ngày phân tích:** 2026-10-20
- **Trạng thái:** Đang chờ làm rõ
- **Issue liên kết:**
  - #7 — Giữ danh sách task trong bộ nhớ suốt một lần chạy (task có id duy nhất, title, status done/not done, thời gian tạo; giữ theo thứ tự tạo).
  - #8 — Thêm một task với title (trim khoảng trắng, title bắt buộc, task mới luôn not done, trả về task vừa tạo kèm id).
  - #5 — Epic cha (chỉ được nhắc, không đọc thêm).

## Tóm tắt
Chủ danh sách muốn xem các task của mình, có thể lọc theo trạng thái (tất cả / chỉ đã xong / chỉ chưa xong) và tra cứu một task theo id, để biết còn việc gì cần làm. Thao tác xem không được làm thay đổi danh sách.

## What it asks
- Mục tiêu: xem task để hành động và đánh giá tiến độ.
- Hành vi mong muốn:
  - BR-1: mặc định hiển thị tất cả task theo thứ tự tạo.
  - BR-2: có thể yêu cầu "all", "done only" hoặc "not done only".
  - BR-3: xem không bao giờ thay đổi task nào.
  - BR-4: có thể tra cứu một task theo identifier.
- Acceptance criteria:
  - AC-1: 3 task (2 chưa xong, 1 đã xong), không filter → thấy cả 3 theo thứ tự tạo.
  - AC-2: cùng danh sách, "done only" → chỉ task đã xong.
  - AC-3: cùng danh sách, "not done only" → 2 task chưa xong theo thứ tự tạo.
  - AC-4: danh sách rỗng → kết quả rỗng, không lỗi.
  - AC-5: task tồn tại, tra theo id → nhận đúng task đó.
  - AC-6: không có task nào có id đó → lỗi rõ ràng "task not found".
  - AC-7: xem/tra cứu không làm thay đổi gì trong danh sách.
- Ràng buộc/phạm vi được nêu:
  - In scope: liệt kê, lọc theo status, tra cứu một task.
  - Out of scope: sắp xếp theo trường khác, tìm kiếm theo text.
  - Phụ thuộc #7 và #8; không có UI, thao tác chạy từ terminal; dữ liệu chỉ nằm trong bộ nhớ của một lần chạy.
  - Priority: Must.

## Chỗ mơ hồ / mâu thuẫn / thiếu
- **Mâu thuẫn:** Không có.
- **Mơ hồ:**
  - Giá trị filter hợp lệ được gọi là "all", "done only", "not done only"; ticket không nói người dùng nhập đúng các chuỗi này hay dạng khác (xem câu 1).
  - Ticket không nói điều gì xảy ra khi filter không hợp lệ (xem câu 1).
  - "Identifier" chưa nói rõ kiểu/định dạng, nên "id không tồn tại" và "id sai định dạng/rỗng" có thể được hiểu khác nhau (xem câu 2).
  - "Thao tác từ terminal": chưa rõ cách người dùng gọi và định dạng hiển thị task (xem câu 3).
- **Thiếu:**
  - Không có acceptance criteria cho trường hợp filter trả về rỗng khi danh sách có task (ví dụ "done only" nhưng chưa task nào xong); AC-4 chỉ nói về danh sách rỗng hoàn toàn.
  - Nội dung/định dạng thông báo lỗi "task not found" chưa được xác định.
  - Phụ thuộc #8 được nêu, nhưng các AC của ticket này không cần chức năng thêm task; chưa rõ #8 phải xong trước khi ticket này kiểm thử được, hay chỉ cần dữ liệu có sẵn từ #7 (xem câu 4).
  - Ticket không nêu cách đổi trạng thái done/not done; các ví dụ "1 done" trong AC cần có dữ liệu như vậy từ nơi khác (xem câu 4).
- **Quy mô ticket:** Hợp lý — hai việc nhỏ cùng nhóm (liệt kê có lọc, tra cứu một task), không cần tách.

## Clarifying questions
### Blocker
Không có.

### Nên làm rõ
1. Filter được truyền vào thế nào và làm gì khi giá trị không hợp lệ? — *Vì sao cần:* ticket chỉ nêu ba tên "all", "done only", "not done only", chưa nói khi nhập sai thì sao. *Lựa chọn:* A) báo lỗi rõ ràng liệt kê giá trị hợp lệ; B) lặng lẽ coi như "all". *Đề xuất:* A.
2. Khi tra cứu theo id mà id rỗng hoặc sai định dạng, có coi là cùng lỗi "task not found" (AC-6) hay một lỗi khác? — *Vì sao cần:* AC-6 chỉ nói về id hợp lệ nhưng không tồn tại. *Lựa chọn:* A) cùng lỗi "task not found"; B) lỗi riêng cho id không hợp lệ. *Đề xuất:* A (đơn giản hơn).
3. Thao tác xem được gọi và hiển thị ra sao ở terminal (lệnh, tham số, định dạng mỗi task: id, title, status, thời gian tạo)? — *Vì sao cần:* ticket nói "không có UI, chạy từ terminal" nhưng không có hình thức cụ thể; ảnh hưởng cách kiểm thử. *Lựa chọn:* A) chỉ cần hàm/thao tác trả về dữ liệu, chưa quy định định dạng in; B) có định dạng in cụ thể. *Đề xuất:* A.
4. Dữ liệu "1 task done" trong AC-1..3 sẽ có từ đâu, khi ticket này không có thao tác đánh dấu done? Và #8 có phải xong trước khi ticket này coi là hoàn tất không? — *Vì sao cần:* quyết định cách chuẩn bị dữ liệu kiểm thử và thứ tự merge. *Lựa chọn:* A) dùng #7 + #8 để tạo task, task done được dựng trực tiếp trong test; B) chờ thao tác đổi trạng thái ở ticket khác. *Đề xuất:* A.

### Nice-to-have
5. Khi filter trả về rỗng dù danh sách có task, có cần thông báo gì khác ngoài kết quả rỗng không? — *Vì sao cần:* AC-4 chỉ nói về danh sách rỗng. *Đề xuất:* chỉ trả về kết quả rỗng, không lỗi.
6. Câu hỏi mở của ticket: filter có được mở rộng sang tìm kiếm theo text sau này không? — *Vì sao cần:* chỉ để quyết định có thiết kế chỗ mở rộng hay không. *Đề xuất:* không làm gì thêm bây giờ (đã nằm ngoài phạm vi).

## Out of scope (đề xuất)
- Sắp xếp theo trường khác ngoài thứ tự tạo; tìm kiếm theo text (ticket đã nêu).
- Thêm task (#8), đổi trạng thái done/not done, sửa hoặc xoá task.
- Lưu xuống đĩa, giao diện UI, phân trang.
- Hoàn thiện định dạng hiển thị đẹp trên terminal (nếu chưa được yêu cầu).

## Bước tiếp theo
Không có câu Blocker; có thể lập plan ngay với các đề xuất mặc định ở trên, ghi rõ chúng là giả định trong plan.

## Câu trả lời
(Điền khi người dùng trả lời, theo số câu; giữ lại khi phân tích lại.)
