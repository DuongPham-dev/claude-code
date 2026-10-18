---
name: analyze-ticket
argument-hint: "[số issue]"
allowed-tools: Bash(bash *fetch-ticket.sh* *), Bash(gh issue view *)
description: Phân tích thuần một ticket (GitHub/GitLab issue) thành tài liệu markdown trước khi lập plan hay code — gồm ticket yêu cầu gì, chỗ nào mơ hồ/mâu thuẫn/thiếu, và các câu hỏi cần làm rõ. Chỉ đọc nội dung ticket (body, comments, issue liên kết), không đọc codebase. Dùng skill này mỗi khi người dùng nói "phân tích ticket", "analyze issue #123", "đọc giúp ticket", "ticket này đòi gì", "làm rõ yêu cầu issue", "bắt đầu làm issue N", hoặc đưa số/URL issue và muốn hiểu trước khi implement — kể cả khi họ không nhắc chữ "analyze". Chỉ tạo file phân tích trong docs/tickets/analyze/, không sửa code, không commit.
---

# Analyze Ticket

Biến một issue thành tài liệu phân tích để người và agent hiểu đúng việc cần làm **trước khi** lập plan hoặc viết code. Ưu tiên số một là **hiểu đúng ticket**; danh sách câu hỏi gửi PM/reporter và đầu vào cho bước plan là hệ quả của việc đó. Skill dừng ở việc hiểu và hỏi, chưa làm.

**Phạm vi:** chỉ phân tích nội dung ticket. **Không đọc codebase**, không suy ra module/file bị ảnh hưởng — việc map vào code thuộc bước plan. Chỉ tạo/cập nhật một file markdown trong `docs/tickets/analyze/`. Không sửa code, không sửa `.gitignore`, không commit, không mở PR. Sau khi ghi file, dừng lại chờ người dùng trả lời câu hỏi.

## Quy trình

### 1. Lấy ticket
**Dữ liệu ticket** (đã được nạp sẵn trước khi bạn đọc skill này, không cần chạy lại `gh`):

!`bash "${CLAUDE_SKILL_DIR}/scripts/fetch-ticket.sh" "$0"`

Skill chỉ nhận **ID số** của GitHub issue.

- Phần trên là JSON ticket (title, body, labels, assignees, comments, url) → dùng luôn.
- Phần trên có `TICKET_FETCH_FAILED` (thiếu/sai ID, chưa đăng nhập `gh`, sai repo, issue không tồn tại):
  - Người dùng đã dán nội dung ticket trong chat → dùng nội dung đó.
  - Còn lại → nói rõ lỗi (dòng lỗi của `gh` nằm ngay trên sentinel), hỏi ID issue hoặc đề nghị dán nội dung ticket. Không đoán.

Đọc cả **comments** — yêu cầu thường được chỉnh sửa hoặc thu hẹp ở đó.

**Issue liên kết:** nếu body/comments nhắc issue khác (`#N`), đọc **một cấp** và chỉ tóm tắt title + ý chính để làm bối cảnh. Không đọc đệ quy theo chuỗi liên kết. Nếu không đọc được (không có CLI, nội dung dán), chỉ liệt kê số issue.

### 2. What it asks — ticket nói gì một cách tường minh
Chỉ ghi những gì ticket (kể cả comments) nêu rõ: mục tiêu, hành vi mong muốn, acceptance criteria, ràng buộc được nhắc, phạm vi được nêu. Trích đúng ý, không thêm suy diễn. Khi comments chỉnh sửa hoặc thu hẹp body, ghi theo yêu cầu mới nhất và nói rõ nó đến từ comment.

### 3. Chỗ mơ hồ / mâu thuẫn / thiếu
Chỉ dựa vào nội dung ticket, liệt kê:
- **Mâu thuẫn:** giữa body và comments, giữa các acceptance criteria, hoặc với issue liên kết.
- **Mơ hồ:** từ/cụm có nhiều cách hiểu (ví dụ "nhanh hơn", "dễ dùng") dẫn tới hướng làm khác nhau.
- **Thiếu:** không có acceptance criteria, không rõ đối tượng/phạm vi, không rõ định nghĩa hoàn thành.

Mỗi mục là một nhận định ngắn, không viết thành câu hỏi; câu hỏi nằm ở bước 4 và chỉ tham chiếu `(xem câu N)` để file không nhắc hai lần. Không bịa chi tiết về hệ thống mà ticket không nói.

**Ticket quá lớn:** nếu ticket gộp nhiều việc độc lập, nêu rõ trong mục này và thêm một câu hỏi có nên tách không. Không tự tách ticket.

### 4. Draft clarifying questions
Chỉ hỏi những gì thật sự mơ hồ hoặc có nhiều cách hiểu dẫn tới hướng làm khác nhau. Không hỏi điều đã có trong ticket. Câu hỏi phải gửi thẳng được cho PM/reporter, không cần ngữ cảnh code. Số câu tùy ticket — ticket rõ thì ít hoặc không có, đừng độn cho đủ số.

Mỗi câu nên: nêu ngắn gọn vì sao cần biết, và (nếu được) đưa sẵn lựa chọn + đề xuất mặc định để người trả lời chỉ cần chọn. Nhóm theo mức độ:
- **Blocker** — ticket mơ hồ ở chỗ cốt lõi và không có mặc định an toàn; không trả lời thì không thể bắt đầu đúng hướng. Ticket đã rõ thì có thể không có câu Blocker nào.
- **Nên làm rõ** — có thể bắt đầu với giả định, nhưng rủi ro làm lại.
- **Nice-to-have** — chi tiết nhỏ, có mặc định hợp lý.

### 5. Out of scope (đề xuất)
Những thứ có vẻ liên quan nhưng ticket không đòi, nên không làm trong ticket này. Chỉ suy từ nội dung ticket.

### 6. Ghi file
Đường dẫn: `docs/tickets/analyze/<ticket-id>-<ticket-intent>.md`

- `<ticket-id>`: số issue (ví dụ `123`).
- `<ticket-intent>`: slug kebab-case **tiếng Anh**, không dấu, khoảng 3–5 từ, tóm ý định của ticket từ tiêu đề (ví dụ `add-login-rate-limit`). Dịch tiêu đề sang tiếng Anh nếu cần.
- Ví dụ: `docs/tickets/analyze/123-add-login-rate-limit.md`

Tạo thư mục nếu chưa có. Với dòng **Nguồn**, chỉ ghi URL khi có thật (lấy từ `gh`, hoặc người dùng đưa); nếu nội dung chỉ được dán vào thì ghi "Không có URL", không tự dựng URL từ tên repo.

**Nếu file cùng `<ticket-id>` đã tồn tại**, đọc nó rồi dùng AskUserQuestion hỏi trước khi ghi, với 3 lựa chọn: *Cập nhật* (đề xuất — giữ nguyên mục "Câu trả lời" đã có), *Tạo bản mới* (đặt tên khác, giữ file cũ), *Hủy*. Chưa có câu trả lời thì chưa ghi gì. Không ghi đè im lặng — file cũ có thể chứa câu trả lời của người dùng.

Nội dung viết bằng **tiếng Việt**, giữ thuật ngữ kỹ thuật và tên lệnh bằng nguyên văn. Dùng khung trong `references/template.md` (đọc file này trước khi viết).

**Git:** file này là tài liệu làm việc cục bộ; người dùng tự thêm `docs/tickets/analyze/` vào `.gitignore` một lần. Skill không sửa `.gitignore`; chỉ nhắc một dòng ở cuối báo cáo nếu thư mục chưa bị ignore (kiểm tra bằng `git check-ignore docs/tickets/analyze`).

### 7. Báo cáo và dừng
Cho người dùng biết đường dẫn file, tóm tắt 2–3 dòng, và liệt kê các câu **Blocker** để họ trả lời ngay. Không tự bước sang lập plan hay implement; gợi ý đó là bước tiếp theo sau khi câu hỏi được giải đáp.

### 8. Khi người dùng trả lời
Khi người dùng trả lời các câu hỏi trong chat, ghi câu trả lời vào mục **Câu trả lời** của file (theo số câu), đổi **Trạng thái** thành "Đã làm rõ" nếu mọi câu Blocker đã có đáp án, rồi dừng. Vẫn không tự chuyển sang plan hay code.
