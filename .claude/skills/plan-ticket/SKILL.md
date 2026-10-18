---
name: plan-ticket
argument-hint: "[số issue]"
allowed-tools: Bash(gh issue view *), Bash(git branch *), Bash(git log *), Bash(git status *)
description: Lập plan implement cho một ticket dựa trên file phân tích đã có (docs/tickets/analyze/<id>-*.md) — đọc codebase, tìm nguyên nhân gốc, xác định file ảnh hưởng, cách tái hiện, test cần thêm, rủi ro — ghi ra docs/tickets/plan/ theo khuôn cố định rồi vào plan mode cho người dùng duyệt. Dùng skill này mỗi khi người dùng nói "lập plan cho ticket N", "plan issue N", "lên kế hoạch fix bug này", "map ticket vào code", "sau analyze thì làm gì" — kể cả khi họ không nhắc chữ "plan". Chỉ đọc code và ghi file plan; không sửa code, không commit.
---

# Plan Ticket

Biến file phân tích ticket thành plan implement cụ thể. `analyze-ticket` cố ý **không đọc codebase**; skill này nhận phần đó: map yêu cầu vào code, tìm nguyên nhân gốc, quyết định sẽ sửa gì và test gì. Plan là cổng duyệt của người dùng trước khi viết code.

Nói chuyện với người dùng bằng tiếng Việt.

**Phạm vi:** đọc file phân tích, đọc codebase, ghi một file plan trong `docs/tickets/plan/`, rồi vào plan mode. Không sửa code, không tạo/chuyển branch, không commit. Duyệt plan xong thì dừng; implement thuộc `implement-plan`.

## Quy trình

### 1. Kiểm tra đầu vào
- Skill nhận **ID số** của issue. Thiếu hoặc không phải số → hỏi lại ID, không đoán.
- Tìm `docs/tickets/analyze/<id>-*.md`.
  - **Không có** → nói rõ và đề nghị chạy `analyze-ticket <id>` trước. Không tự phân tích thay.
  - **Có** → đọc toàn bộ, đặc biệt mục *Câu trả lời* và *Out of scope*.
- Nếu *Trạng thái* là "Đang chờ làm rõ" và còn câu **Blocker** chưa có đáp án → dừng, liệt kê các câu đó, nhờ người dùng trả lời. Chưa đủ thông tin thì plan chỉ là đoán.
- Đang ở default branch → cảnh báo một dòng và gợi ý `start-ticket <id>`; không tự chuyển branch. Người dùng vẫn có thể muốn lập plan trước, nên không chặn.

### 2. Đọc codebase để map vào code
Dựa trên yêu cầu và câu trả lời đã chốt:
- Tìm điểm vào liên quan (route, hàm, module) và lần theo luồng chạy đến chỗ lỗi hoặc chỗ cần thêm.
- Ưu tiên tái dùng hàm/tiện ích sẵn có, không đề xuất viết mới khi đã có thứ phù hợp. Ghi đường dẫn.
- Tìm test hiện có quanh vùng đó (framework, vị trí, cách đặt tên, lệnh chạy) để test mới theo cùng kiểu.
- Với bug: xác định **nguyên nhân gốc** bằng cách đọc code, ghi `file:dòng`. Chưa chắc thì nói rõ mức độ chắc chắn và cách xác nhận, đừng viết như đã chắc.

Phạm vi lớn hoặc chưa rõ vùng nào → dùng subagent Explore để tìm, đừng đọc lan man.

### 3. Soạn plan
Đọc `references/template.md` rồi viết theo đúng khung. Quy tắc:
- Bước **đầu tiên** của "Các bước thực hiện" luôn là test fail tái hiện bug (bug) hoặc test thể hiện hành vi mới (feature).
- Mỗi bước nhỏ, kiểm tra được, nêu rõ file và thay đổi.
- Không mở rộng ngoài ticket. Điều có vẻ liên quan nhưng ticket không đòi → "Ngoài phạm vi".
- Còn điều thực sự chưa rõ sau khi đọc code → ghi vào "Câu hỏi còn mở" và hỏi người dùng trước khi vào bước duyệt.

### 4. Ghi file
Đường dẫn: `docs/tickets/plan/<ticket-id>-<ticket-intent>.md`, dùng **cùng `<ticket-intent>`** với file phân tích để hai file đi cặp. Tạo thư mục nếu chưa có.

**Nếu file plan cùng `<ticket-id>` đã tồn tại**, đọc nó rồi dùng AskUserQuestion hỏi: *Cập nhật* (giữ phần đã duyệt nếu còn đúng), *Tạo bản mới* (tên khác, giữ file cũ), *Hủy*. Không ghi đè im lặng.

File là tài liệu làm việc cục bộ; người dùng tự thêm `docs/tickets/` vào `.gitignore`. Skill không sửa `.gitignore`; chỉ nhắc một dòng cuối báo cáo nếu thư mục chưa bị ignore (`git check-ignore docs/tickets/plan`).

### 5. Vào plan mode để duyệt
Gọi `EnterPlanMode` (nạp qua ToolSearch nếu chưa có) nếu chưa ở plan mode, tóm tắt plan cho người dùng, rồi dùng `ExitPlanMode` để xin duyệt. Không hỏi "plan ổn chưa?" bằng văn bản.

- **Duyệt** → đổi *Trạng thái* trong file thành "Đã duyệt", báo đường dẫn file và gợi ý `implement-plan <id>`. Không tự implement.
- **Yêu cầu chỉnh** → sửa file plan theo feedback, trình lại.
