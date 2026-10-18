---
name: implement-plan
argument-hint: "[số issue]"
description: Implement một ticket theo plan đã duyệt (docs/tickets/plan/<id>-*.md) — viết test fail tái hiện bug trước, rồi sửa code theo từng bước của plan, dừng và hỏi khi lệch plan. Dùng skill này mỗi khi người dùng nói "implement ticket N", "làm theo plan", "bắt đầu code issue N", "fix bug theo plan", "plan duyệt rồi, làm đi" — kể cả khi họ không nhắc chữ "implement". Sửa code trong working tree; không commit, không push, không mở PR.
---

# Implement Plan

Thực hiện plan đã được người dùng duyệt. Người dùng theo dõi diff trong diff pane và có thể comment vào từng hunk để chỉnh hướng — mỗi thay đổi nên đủ nhỏ và rõ ý để đọc diff được.

Nói chuyện với người dùng bằng tiếng Việt.

**Phạm vi:** chỉ sửa code và test trong working tree theo plan. Không commit, không push, không tạo/chuyển branch, không mở PR, không sửa `.gitignore`. Chạy test để kiểm tra bước vừa làm là được; chạy bộ kiểm tra đầy đủ và ghi kết quả thuộc `verify`.

## Quy trình

### 1. Kiểm tra đầu vào
- Nhận **ID số** của issue; thiếu hoặc sai → hỏi lại.
- Đọc `docs/tickets/plan/<id>-*.md`.
  - **Không có** → đề nghị `plan-ticket <id>` trước. Không tự nghĩ ra plan.
  - **Trạng thái không phải "Đã duyệt"** → dừng, nói plan chưa được duyệt, hỏi có muốn duyệt/tiếp tục không.
- Đang ở default branch → dừng, gợi ý `start-ticket <id>`; sửa code trực tiếp trên default branch là việc khó dọn.
- Chạy `git status --porcelain`. Có thay đổi dang dở không thuộc ticket → báo người dùng trước khi sửa tiếp, vì sau này diff sẽ lẫn.

### 2. Test fail trước
Thực hiện bước đầu của plan: viết test tái hiện bug (hoặc thể hiện hành vi mới), chạy riêng test đó và **xác nhận nó fail đúng lý do** mong đợi. Cho người dùng thấy output fail.
- Test pass ngay → plan sai hoặc bug đã được sửa; dừng và báo, không sửa code tiếp.
- Test fail vì lý do khác (lỗi cú pháp, thiếu import) → sửa test cho đến khi fail đúng lý do.

### 3. Làm từng bước theo plan
Với mỗi bước còn lại: sửa đúng các file plan nêu, chạy test liên quan để thấy chuyển từ fail sang pass, rồi báo ngắn gọn bước vừa xong (file nào, đổi gì). Tái dùng hàm/tiện ích plan đã chỉ ra, không viết mới khi đã có.

Giữ diff nhỏ và tập trung: không refactor "tiện tay", không sửa file ngoài plan, không đổi format hàng loạt.

### 4. Lệch plan thì dừng và hỏi
Dừng ngay, nêu lý do và hỏi bằng AskUserQuestion khi gặp một trong các trường hợp:
- Plan giả định điều không đúng với code thực tế (hàm không tồn tại, nguyên nhân gốc khác).
- Cần sửa file hoặc làm việc nằm ngoài "File ảnh hưởng" / "Ngoài phạm vi" của plan.
- Một bước không thể làm như plan mô tả.

Lựa chọn đưa cho người dùng: *cập nhật plan rồi tiếp tục* (ghi thay đổi vào file plan), *quay lại plan cũ*, hoặc *dừng hẳn*. Không tự ý vượt plan.

### 5. Hunk comment và chỉ đạo của người dùng
Comment của người dùng trên hunk, hoặc yêu cầu chỉnh trong chat, là **chỉ đạo**: áp dụng ngay vào đúng chỗ đó rồi chạy lại test liên quan. Nếu chỉ đạo mâu thuẫn với plan, áp dụng chỉ đạo và ghi lại điểm lệch vào file plan (mục "Ghi chú lệch plan", tạo nếu chưa có) để các bước sau và `commit-to-pr` biết.

### 6. Báo cáo và dừng
Tóm tắt: các bước đã làm, file đã đổi, test đã chạy và kết quả thật, điểm lệch plan (nếu có). Gợi ý bước tiếp theo là `verify <id>`. Không tự commit hay chạy bước đó.
