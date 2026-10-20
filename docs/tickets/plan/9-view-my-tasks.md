# Plan #9 — View my tasks

- **Ticket:** https://github.com/DuongPham-dev/claude-code/issues/9
- **Phân tích:** docs/tickets/analyze/9-view-my-tasks.md
- **Branch:** fix/9-view-my-tasks
- **Ngày lập:** 2026-10-20
- **Trạng thái:** Đã duyệt

## Mục tiêu
Cho `TaskList` khả năng xem task: `list()` nhận filter tùy chọn (`"all"` mặc định, `"done"`, `"not-done"`) và trả task theo thứ tự tạo; thêm `get(id)` tra cứu một task, ném lỗi "task not found" khi không có. Mọi thao tác chỉ đọc, không đổi danh sách (BR-3, AC-7). Feature mới, hành vi hiện có của `list()` không đổi khi không truyền filter.

Giả định (file phân tích không có Blocker, dùng đề xuất mặc định; **người duyệt xác nhận khi duyệt plan**):
- Câu 1: filter không hợp lệ → ném lỗi liệt kê giá trị hợp lệ.
- Câu 2: id rỗng/sai định dạng cùng lỗi "task not found" (id là chuỗi bất kỳ, so khớp chính xác).
- Câu 3: chỉ cung cấp thao tác trả dữ liệu, không quy định định dạng in terminal; `src/index.ts` không đổi.
- Câu 4: tạo dữ liệu bằng #7 (+#8); task `done` dựng trực tiếp trong test (xem Câu hỏi còn mở).
- Câu 5: filter ra rỗng → trả mảng rỗng, không lỗi.

## Nguyên nhân gốc (bug)
Không áp dụng (feature). Hiện trạng đã đọc: `src/task.ts` (từ #7) có `Task`, và `TaskList` với `add(title)` và `list()` (không tham số, trả bản sao theo thứ tự chèn). Chưa có filter hay tra cứu theo id. Project TypeScript `strict`, Jest + ts-jest, test cạnh code (`src/task.test.ts`, `describe`/`it`), lệnh `npm run check` / `npm run typecheck`.

## Cách tái hiện
Không áp dụng (feature). Hành vi mới được thể hiện bằng test ở bước 1.

## Các bước thực hiện
1. **Test thể hiện hành vi mới** — thêm các case ở mục "Test sẽ thêm" vào `src/task.test.ts`; chạy `npx jest src/task.test.ts` và thấy fail (chưa có filter, `get`, `TaskNotFoundError`).
2. **Kiểu filter và lỗi** — trong `src/task.ts` export `type TaskFilter = "all" | "done" | "not-done"` và `class TaskNotFoundError extends Error` (message `Task not found: <id>`, `name` đặt rõ).
3. **Mở rộng `list`** — `list(filter: TaskFilter = "all"): readonly Task[]`: lọc `this.tasks` theo `done` rồi trả bản sao, giữ thứ tự chèn. Filter ngoài ba giá trị → ném `Error` liệt kê giá trị hợp lệ (kiểm tra lúc chạy, vì gọi từ terminal/JS có thể truyền chuỗi bất kỳ).
4. **Thêm `get(id: string): Task`** — tìm theo `id` chính xác, trả bản sao; không thấy → ném `TaskNotFoundError`.
5. **Cách dựng task `done` cho test** — thêm tham số constructor tùy chọn `constructor(initial: readonly Task[] = [])` nạp bản sao task có sẵn (để test tạo task `done`; cũng phục vụ #15 sau này). Xem Câu hỏi còn mở.
6. **Chạy kiểm tra** — `npm run check` và `npm run typecheck` phải pass, gồm cả test cũ.
7. **README** — chỉ thêm ghi chú ngắn nếu README đang mô tả module task; không thì bỏ qua.

## File ảnh hưởng
| File | Thay đổi |
|---|---|
| `src/task.ts` | Thêm `TaskFilter`, `TaskNotFoundError`, tham số `filter` cho `list`, `get`, constructor nhận danh sách ban đầu |
| `src/task.test.ts` | Thêm test AC-1..7 |
| `README.md` | Tùy chọn |

**Nguy cơ conflict với ticket #8 (merge trước #9):** #8 cũng sửa `src/task.ts` (validate/trim title trong hoặc quanh `add`) và `src/task.test.ts` (test thêm task), ngay sát `list()` mà #9 sửa. Dự kiến conflict văn bản ở hai file này, dễ giải quyết vì khác nhau về nội dung: giữ nguyên phần `add` của #8, giữ phần `list`/`get`/constructor của #9. Cách giảm: sau khi #8 merge vào main, đồng bộ branch này với main trước khi implement (hoặc rebase) để tránh giải quyết conflict ở cuối. Nếu #8 đổi chữ ký/kiểu trả về của `add` hoặc đổi `Task`, test của #9 dùng `add` phải cập nhật theo. `src/index.ts` và `src/message.ts` không đổi.

## Test sẽ thêm / sửa
File `src/task.test.ts`, `describe("TaskList viewing")` với danh sách gồm 3 task (A not done, B done, C not done, theo thứ tự đó):
- **AC-1:** `list()` và `list("all")` trả A, B, C đúng thứ tự.
- **AC-2:** `list("done")` chỉ trả B.
- **AC-3:** `list("not-done")` trả A, C theo thứ tự.
- **AC-4:** `new TaskList().list()` và mọi filter đều trả `[]`, không ném lỗi.
- **Filter ra rỗng:** danh sách chỉ có task chưa xong, `list("done")` trả `[]`.
- **Filter không hợp lệ:** `list("bogus" as TaskFilter)` ném lỗi.
- **AC-5:** `get(id)` của task đã lưu trả task bằng nhau (`toEqual`).
- **AC-6:** `get("missing")` ném `TaskNotFoundError` với message chứa id; id rỗng cũng vậy.
- **AC-7 / BR-3:** chụp `list()` trước, gọi `list` mọi filter và `get`, rồi `list()` lại thì bằng nhau; sửa mảng/task trả về không đổi kho.

Lệnh chạy riêng: `npx jest src/task.test.ts`. Chạy toàn bộ: `npm run check`.

## Rủi ro và điểm cần lưu ý
- Đổi chữ ký `list()` bằng tham số mặc định nên tương thích ngược với #7.
- Tên giá trị filter (`"done"`, `"not-done"`) là quyết định của plan, ánh xạ từ "done only"/"not done only"; có thể đổi nếu người duyệt muốn tên khác.
- Constructor mới mở lối nạp task có sẵn; không validate, chỉ phục vụ test và #15.
- Conflict với #8 như đã nêu.

## Ngoài phạm vi
- Sắp xếp theo trường khác, tìm kiếm theo text (ticket nêu).
- Thêm/sửa/xóa task, đổi trạng thái done (ticket khác).
- Định dạng in ra terminal, thay đổi `src/index.ts`, lưu đĩa, UI, phân trang.

## Câu hỏi còn mở
- Chấp nhận thêm tham số constructor để dựng task `done` trong test không? Hiện chưa có thao tác đánh dấu done, nên đây là cách ít xâm lấn nhất; phương án khác là chờ ticket đổi trạng thái.
