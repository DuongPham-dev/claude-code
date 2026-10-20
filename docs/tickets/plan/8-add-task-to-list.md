# Plan #8 — Add a task to my list

- **Ticket:** https://github.com/DuongPham-dev/claude-code/issues/8
- **Phân tích:** docs/tickets/analyze/8-add-task-to-list.md
- **Branch:** fix/8-add-task-to-list
- **Ngày lập:** 2026-10-20
- **Trạng thái:** Đã duyệt

## Mục tiêu
Biến `TaskList.add(title)` (hiện là thao tác nội bộ tối thiểu, không validate) thành thao tác thêm task cho người dùng: cắt khoảng trắng đầu/cuối title, từ chối title rỗng hoặc chỉ có khoảng trắng bằng lỗi rõ ràng "title is required", cho phép title trùng, trả về task vừa tạo (có id). Giả định mặc định cho các câu "Nên làm rõ" của file phân tích (chưa có câu trả lời, không có Blocker):
- Câu 1: không giới hạn độ dài title.
- Câu 2: dùng `String.prototype.trim()` (mọi whitespace chuẩn), chỉ cắt đầu/cuối, giữ nguyên khoảng trắng bên trong.
- Câu 3: không thêm lệnh CLI; lỗi là `Error` ném từ hàm với thông điệp `Title is required`.
- Câu 4: title không phải chuỗi (null/undefined) cũng ném cùng lỗi.
- Câu 5, 6: title trùng được phép; task trả về là toàn bộ `Task` (id, title, done, createdAt).

## Nguyên nhân gốc (bug)
Không áp dụng (feature). Hiện trạng đã đọc:
- `src/task.ts:13-22` — `add(title)` lưu nguyên title, không trim, không validate, đã tạo `id` (UUID), `done = false`, `createdAt`, và trả bản sao. Phần BR-3, BR-4 (nhận lại task), AC-1, AC-4, AC-5 thực tế đã được đáp ứng từ #7; còn thiếu BR-1, BR-2, AC-2, AC-3.
- `src/task.test.ts:79` — test `"does not validate the title"` ghi lại ranh giới với #8 và sẽ phải đổi vì mâu thuẫn với AC-3.
- `src/index.ts` chỉ in demo message; không có điểm vào terminal cho task.
- Project: TypeScript `strict`, Jest + ts-jest, test cạnh code `*.test.ts`; lệnh `npm run check` (jest), `npm run typecheck`.

## Cách tái hiện
Không áp dụng (feature). Với code hiện tại: `new TaskList().add("  Buy milk  ").title` trả `"  Buy milk  "` (sai AC-2), và `add("   ")` tạo task thay vì lỗi (sai AC-3).

## Các bước thực hiện
1. **Test thể hiện hành vi mới** — trong `src/task.test.ts`, thêm các case ở mục "Test sẽ thêm / sửa", thay test `"does not validate the title"` bằng các case AC-3; chạy `npx jest src/task.test.ts` và thấy fail đúng các case trim/validate.
2. **Validate và chuẩn hóa title trong `add`** — `src/task.ts`: trước khi tạo task, `const trimmed = typeof title === "string" ? title.trim() : ""`; nếu `trimmed === ""` thì `throw new Error("Title is required")`; dùng `trimmed` làm title. Giữ nguyên phần id/done/createdAt/trả bản sao. Có thể export một `TitleRequiredError extends Error` để test và caller phân biệt được lỗi (chỉ nếu giúp test rõ ràng; mặc định dùng `Error` đơn giản).
3. **Không đụng tới dedupe** — không thêm kiểm tra trùng title (AC-4); id UUID đã phân biệt các task.
4. **Chạy kiểm tra** — `npm run check` và `npm run typecheck` phải pass, gồm `message.test.ts`.
5. **README** — nếu README mô tả module task, cập nhật ngắn gọn hành vi `add` (chỉ ghi điều có thật).

## File ảnh hưởng
| File | Thay đổi |
|---|---|
| `src/task.ts` | `add`: trim, validate, ném lỗi `Title is required` |
| `src/task.test.ts` | Thêm test AC-1..5; thay test "does not validate the title" |
| `README.md` | Tùy chọn: ghi chú hành vi `add` |

`src/index.ts`, `src/message.ts` không đổi.

## Test sẽ thêm / sửa
File `src/task.test.ts`, trong `describe("TaskList")`:
- **AC-1 / BR-3:** danh sách rỗng, `add("Buy milk")` → `list()` có đúng một task, `title === "Buy milk"`, `done === false`.
- **AC-2 / BR-2:** `add("  Buy milk  ").title === "Buy milk"` và task lưu trong `list()` cũng vậy; tab/newline đầu cuối cũng bị cắt; khoảng trắng bên trong giữ nguyên (`"Buy  milk"`).
- **AC-3 / BR-1:** `add("")`, `add("   ")`, `add("\t\n")` đều ném lỗi `Title is required`, và `list()` vẫn rỗng. Thêm một case cho giá trị không phải chuỗi (ép kiểu `undefined as unknown as string`).
- **AC-4:** hai lần `add("Buy milk")` → `list()` có hai task, id khác nhau.
- **AC-5 / BR-4:** giá trị trả về của `add` có `id` là chuỗi không rỗng và bằng task tương ứng trong `list()`.
- **Sửa:** xóa/đổi test `"does not validate the title"` (src/task.test.ts:79) cho khớp AC-3.

Chạy riêng: `npx jest src/task.test.ts`. Chạy toàn bộ: `npm run check`.

## Rủi ro và điểm cần lưu ý
- Đổi hành vi của `add`: bất kỳ caller nào truyền title rỗng sẽ bắt đầu bị lỗi. Hiện chỉ có test dùng `add`; `index.ts` không gọi.
- Worktree 9 đang làm song song, merge sau #8; nếu ticket 9 cũng sửa `src/task.ts` / `src/task.test.ts` thì có thể xung đột. Cách giảm: sửa tối thiểu `add` và chỉ đụng các test cần đổi; ticket 9 rebase lên sau.
- Thông điệp lỗi cố định `Title is required` để test bám vào; đổi chữ sẽ vỡ test.
- `trim()` của JS cắt cả whitespace Unicode (vd NBSP); chấp nhận theo giả định câu 2.
- Chưa có giới hạn độ dài (câu 1); nếu PM chọn giới hạn thì cần thêm một quy tắc và test.

## Ngoài phạm vi
- Sửa task, import nhiều task (theo ticket).
- Lệnh CLI / UI để gọi `add` từ terminal (nếu PM chọn B ở câu 3, làm ở ticket riêng hoặc cập nhật plan).
- Lưu xuống đĩa (#15), xóa/đánh dấu done, lọc/tìm kiếm.
- Chuẩn hóa title khác (đổi hoa/thường, gộp khoảng trắng), giới hạn số task.

## Câu hỏi còn mở
Không có Blocker. Các giả định mặc định (không giới hạn độ dài, `trim()`, lỗi là `Error`, không CLI) đang chờ PM xác nhận; nếu người duyệt muốn khác thì chỉnh trước khi implement.
