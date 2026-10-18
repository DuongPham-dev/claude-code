# Plan #7 — Keep a collection of tasks during a session

- **Ticket:** https://github.com/DuongPham-dev/claude-code/issues/7
- **Phân tích:** docs/tickets/analyze/7-keep-session-task-collection.md
- **Branch:** feat/7-session-task-collection
- **Ngày lập:** 2026-10-18
- **Trạng thái:** Đã duyệt

## Mục tiêu
Thêm định nghĩa `Task` (id, title, done, createdAt) và một kho `TaskList` trong bộ nhớ, giữ task theo thứ tự chèn, mỗi lần chạy bắt đầu rỗng. Đây là feature mới, chưa có hành vi nào bị đổi. Các quyết định đã chốt: id không bao giờ dùng lại và là chuỗi UUID; `createdAt` là ISO-8601 UTC; thứ tự theo thứ tự chèn; title không bị validate ở #7 (việc của #8); danh sách và task trả về là bản sao.

## Nguyên nhân gốc (bug)
Không áp dụng (feature). Hiện trạng đã đọc: `src/` chỉ có `index.ts`, `message.ts`, `message.test.ts` (demo message), chưa có khái niệm task nào. Project dùng TypeScript `strict`, `module: commonjs`, target ES2022 (`tsconfig.json`), test bằng Jest + ts-jest, `roots: src` (`jest.config.js`), test đặt cạnh code dạng `*.test.ts`, mô tả bằng `describe`/`it` (`src/message.test.ts`).

## Cách tái hiện
Không áp dụng (feature). Hành vi mới được thể hiện bằng test ở bước 1.

## Các bước thực hiện
1. **Test thể hiện hành vi mới** — tạo `src/task.test.ts` với các case ở mục "Test sẽ thêm", chạy `npx jest src/task.test.ts` và thấy fail (chưa có `./task`).
2. **Định nghĩa kiểu `Task`** — tạo `src/task.ts`, export `interface Task { readonly id: string; readonly title: string; readonly done: boolean; readonly createdAt: string }` (BR-1).
3. **Cài đặt `TaskList`** — trong `src/task.ts`, export `class TaskList` giữ mảng `Task[]` private:
   - `add(title: string): Task`: thao tác lưu nội bộ tối thiểu (câu trả lời 5), không validate title (câu 3). Tạo task với `id = randomUUID()` (import từ `node:crypto`; câu 1, 2), `done = false` (BR-2), `createdAt = new Date().toISOString()` (câu 4), đẩy vào cuối mảng (BR-4), trả về bản sao.
   - `list(): readonly Task[]`: trả mảng mới chứa bản sao từng task, giữ thứ tự chèn (câu 6, AC-4).
   - Không có state ở mức module, nên mỗi `new TaskList()` là một danh sách rỗng (BR-5, AC-1).
4. **Chạy kiểm tra** — `npm run check` và `npm run typecheck` phải pass, gồm cả test cũ `message.test.ts`.
5. **Cập nhật README** — thêm `src/task.ts` vào mô tả cấu trúc nếu cần; chỉ ghi những gì có thật.

## File ảnh hưởng
| File | Thay đổi |
|---|---|
| `src/task.ts` | Mới: `Task`, `TaskList` (`add`, `list`) |
| `src/task.test.ts` | Mới: test cho AC-1..4 và các quy tắc đã chốt |
| `README.md` | Tùy chọn: ghi chú ngắn về module task |

`src/index.ts` và `src/message.ts` không đổi.

## Test sẽ thêm / sửa
File `src/task.test.ts`, `describe("TaskList")`:
- **AC-1:** `new TaskList().list()` trả `[]`.
- **AC-2 / BR-1, BR-2:** sau `add("Buy milk")`, task có `id` là chuỗi không rỗng, `title === "Buy milk"`, `done === false`, `createdAt` parse được và `new Date(createdAt).toISOString() === createdAt`.
- **AC-3 / BR-3:** thêm hai task, `id` khác nhau.
- **AC-4 / BR-4:** thêm A rồi B, `list().map(t => t.title)` bằng `["A", "B"]`, kể cả khi thêm liên tiếp (thứ tự theo thứ tự chèn, không theo timestamp).
- **Bản sao (câu 6):** sửa mảng trả về từ `list()` (ví dụ `push`, `reverse`) rồi gọi `list()` lần nữa, danh sách vẫn nguyên; sửa task trả về từ `add` không làm đổi task trong kho.
- **BR-5:** hai `TaskList` khác nhau không chia sẻ dữ liệu.
- **Không validate title (câu 3):** `add("")` vẫn tạo task (ghi lại ranh giới với #8).

Lệnh chạy riêng: `npx jest src/task.test.ts`. Chạy toàn bộ: `npm run check`.

## Rủi ro và điểm cần lưu ý
- `createdAt` lấy từ `new Date()` nên test không so sánh giá trị cụ thể, chỉ kiểm tra định dạng.
- Sao chép nông là đủ vì mọi trường của `Task` là kiểu nguyên thủy; nếu sau này thêm trường kiểu tham chiếu thì phải đổi cách sao chép.
- "Không bao giờ dùng lại id" được đảm bảo bằng UUID ngẫu nhiên, không bằng bộ đếm; #7 chưa có thao tác xóa nên chưa thể kiểm chứng trực tiếp ca "xóa rồi thêm".
- `add` là thao tác nội bộ tối thiểu; #8 sẽ bọc lại và thêm validate, nên giữ chữ ký đơn giản để #8 dễ tái dùng.
- #15 sẽ cần nạp lại task với id/createdAt có sẵn; #7 chưa làm, tránh thiết kế thừa.

## Ngoài phạm vi
- Thao tác thêm có validate title cho người dùng (#8).
- Lưu xuống đĩa và nạp lại (#15).
- Xóa, sửa, đánh dấu hoàn thành task.
- UI, đa người dùng, lọc/sắp xếp khác thứ tự tạo, due date, priority, tag.
- Thay đổi `src/index.ts` để demo task trên terminal.

## Câu hỏi còn mở
Không có.
