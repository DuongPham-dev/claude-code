# Khung file phân tích ticket

Dùng đúng thứ tự section dưới đây. Viết tiếng Việt; bỏ section nào thật sự không có nội dung (ghi "Không có") thay vì độn chữ. Chỉ dựa vào nội dung ticket, không đưa đường dẫn file hay suy đoán về code.

```markdown
# #<id> — <tiêu đề ticket>

- **Nguồn:** <URL issue thật, hoặc "Không có URL" nếu nội dung được dán>
- **Labels / Assignee:** <...>
- **Ngày phân tích:** <YYYY-MM-DD>
- **Trạng thái:** Đang chờ làm rõ | Đã làm rõ
- **Issue liên kết:** <#N — tóm tắt một dòng; hoặc "Không có">

## Tóm tắt
Một–hai câu: ticket muốn đạt điều gì và vì sao (theo ticket).

## What it asks
Những gì ticket (kể cả comments) nêu **tường minh**. Yêu cầu nào đến từ comment thì ghi rõ.
- Mục tiêu: ...
- Hành vi mong muốn: ...
- Acceptance criteria: ...
- Ràng buộc/phạm vi được nêu: ...

## Chỗ mơ hồ / mâu thuẫn / thiếu
Nhận định ngắn, không viết thành câu hỏi; chỗ cần hỏi thì ghi `(xem câu N)`.
- **Mâu thuẫn:** ...
- **Mơ hồ:** ...
- **Thiếu:** ...
- **Quy mô ticket:** (chỉ khi ticket gộp nhiều việc độc lập)

## Clarifying questions
Viết sao cho gửi thẳng được cho PM/reporter.
### Blocker
1. <câu hỏi> — *Vì sao cần:* ... *Lựa chọn:* A / B. *Đề xuất:* A.
### Nên làm rõ
2. ...
### Nice-to-have
3. ...

## Out of scope (đề xuất)
Những thứ có vẻ liên quan nhưng ticket không đòi, nên không làm trong ticket này.

## Bước tiếp theo
Sau khi trả lời các câu Blocker: lập plan → implement.

## Câu trả lời
(Điền khi người dùng trả lời, theo số câu; giữ lại khi phân tích lại.)
```
