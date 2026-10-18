# Khung file plan

Dùng đúng thứ tự section dưới đây. Viết tiếng Việt, giữ nguyên tên file, lệnh, thuật ngữ kỹ thuật. Plan phải đủ để một agent khác implement mà không cần hỏi lại. Bỏ section nào thật sự không có nội dung (ghi "Không có") thay vì độn chữ.

```markdown
# Plan #<id> — <tiêu đề ticket>

- **Ticket:** <URL hoặc "Không có URL">
- **Phân tích:** docs/tickets/analyze/<id>-<intent>.md
- **Branch:** <tên branch hiện tại>
- **Ngày lập:** <YYYY-MM-DD>
- **Trạng thái:** Chờ duyệt | Đã duyệt

## Mục tiêu
Một–hai câu: sau khi xong, hành vi nào đổi và đổi thế nào (theo ticket và các câu trả lời).

## Nguyên nhân gốc (bug)
Giả thuyết đã được kiểm chứng bằng đọc code: chỗ nào gây lỗi và vì sao. Ghi `file:dòng`. Nếu chưa chắc, nói rõ mức độ chắc chắn và cách xác nhận.

## Cách tái hiện
Các bước/lệnh/input cụ thể làm lỗi xuất hiện, và kết quả sai quan sát được. Đây là đầu vào cho test fail đầu tiên.

## Các bước thực hiện
Đánh số, mỗi bước nhỏ, kiểm tra được:
1. **Test fail tái hiện bug** — file test, case, kỳ vọng. (luôn là bước đầu)
2. **<thay đổi code>** — file/hàm, thay đổi gì, vì sao.
3. ...

## File ảnh hưởng
| File | Thay đổi |
|---|---|
| `path/to/file` | ... |

## Test sẽ thêm / sửa
Case nào, ở file nào, khẳng định điều gì. Kèm lệnh chạy riêng test này.

## Rủi ro và điểm cần lưu ý
Hành vi có thể bị ảnh hưởng ngoài ý muốn, compat, migration, hiệu năng.

## Ngoài phạm vi
Thứ có vẻ liên quan nhưng không làm trong ticket này (kế thừa từ "Out of scope" của file phân tích).

## Câu hỏi còn mở
(Chỉ khi còn điều chưa rõ sau khi đọc code; hỏi người dùng trước khi duyệt.)
```
