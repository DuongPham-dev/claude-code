# Plan #6 — Run the project and its checks from the terminal

- **Ticket:** https://github.com/DuongPham-dev/claude-code/issues/6
- **Phân tích:** docs/tickets/analyze/6-run-project-checks-terminal.md
- **Branch:** fix/6-run-project-checks-terminal
- **Ngày lập:** 2026-10-18
- **Trạng thái:** Đã duyệt

## Mục tiêu
Repo (hiện chưa có project nào, chỉ có README và `.claude/`) có một project TypeScript tối giản với ba script `npm run`: `demo` (chạy và in thông điệp), `check` (Jest, báo pass/fail), `typecheck` (`tsc --noEmit`, báo lỗi kiểu). README hướng dẫn từ checkout mới đến chạy được ba lệnh. Chỉ dùng TypeScript và Jest.

## Nguyên nhân gốc (bug)
Không áp dụng: đây là enabler, greenfield. Đã xác nhận bằng đọc repo: không có `package.json`, `tsconfig`, `.gitignore`, mã nguồn nào. Môi trường: Node v26.10.0, npm 11.19.1.

## Cách tái hiện
Hiện trạng: `npm run demo` / `check` / `typecheck` đều lỗi vì không có `package.json`. Đây là "kết quả sai" cần chuyển sang đạt.

## Các bước thực hiện
1. **Test fail trước** — tạo `src/message.test.ts`: `getDemoMessage()` trả chuỗi không rỗng chứa `"todo"` (tên `message.ts` chưa tồn tại nên test fail ở bước này). Chạy được sau bước 2 (cần Jest) để thấy fail rồi mới thêm code.
2. **Khởi tạo project** — `package.json` (private, scripts bên dưới), devDependencies: `typescript`, `jest`, `ts-jest`, `@types/jest`, `@types/node`. Chạy `npm install` để sinh `package-lock.json`. Scripts:
   - `demo`: `tsc && node dist/index.js`
   - `check`: `jest`
   - `typecheck`: `tsc --noEmit`
3. **Cấu hình TS** — `tsconfig.json`: `strict: true`, `target` ES2022, `module` commonjs, `rootDir` `src`, `outDir` `dist`, `include` `["src"]`.
4. **Cấu hình Jest** — `jest.config.js`: preset `ts-jest`, `testEnvironment` `node`, `roots` `["<rootDir>/src"]` (không quét `dist`).
5. **Code tối thiểu** — `src/message.ts` export `getDemoMessage()` trả thông điệp (vd `"Todo project is ready"`); `src/index.ts` gọi và `console.log`. Test ở bước 1 chuyển sang pass.
6. **`.gitignore`** — `node_modules/`, `dist/`.
7. **README** — thêm mục "Getting started" (yêu cầu Node, `npm install`) và bảng ba lệnh `npm run demo|check|typecheck` kèm mục đích; cập nhật cây thư mục ở "Cấu trúc repo".
8. **Kiểm tra AC-4** — thêm tạm một lỗi kiểu (vd gán `number` cho biến `string`) vào `src/`, chạy `npm run typecheck` thấy báo lỗi và exit code khác 0, rồi gỡ lỗi đó.

## File ảnh hưởng
| File | Thay đổi |
|---|---|
| `package.json`, `package-lock.json` | Mới: scripts và devDependencies |
| `tsconfig.json` | Mới: cấu hình TS strict |
| `jest.config.js` | Mới: ts-jest, roots `src` |
| `src/message.ts`, `src/index.ts` | Mới: hàm thông điệp và entry point |
| `src/message.test.ts` | Mới: sample check |
| `.gitignore` | Mới: bỏ `node_modules/`, `dist/` |
| `README.md` | Thêm Getting started và ba lệnh |

## Test sẽ thêm / sửa
`src/message.test.ts`: `getDemoMessage()` trả chuỗi không rỗng chứa `"todo"`. Chạy riêng: `npx jest src/message.test.ts`.

## Rủi ro và điểm cần lưu ý
- Phiên bản `jest`/`ts-jest`/`typescript` phải tương thích nhau và với Node 26; kiểm tra bằng cách chạy thật cả ba lệnh trên checkout sạch (xóa `node_modules` rồi `npm install`).
- `demo` biên dịch ra `dist/` trước khi chạy (không thêm `ts-node`/`tsx` để đúng ràng buộc "chỉ TS + Jest").
- `ts-jest` là thành phần bắt buộc để Jest chạy TS, không tính là công cụ ngoài phạm vi.
- Dự án đặt ở gốc repo; `practices/` giữ nguyên cho bài học.

## Ngoài phạm vi
Mọi hành vi todo (#7–#15), CI, deployment, lint/format, build/đóng gói, hỗ trợ nhiều hệ điều hành/phiên bản runtime.

## Câu hỏi còn mở
Không có. Câu 1 của file phân tích dùng mặc định: ba lệnh độc lập.

## Ghi chú lệch plan
- `typescript` được ghim ở `^6` (6.0.3) thay vì bản mới nhất (7.0.2) vì `ts-jest` 29.4.15 không hỗ trợ TypeScript 7.
- `tsconfig.json` thêm `"types": ["jest", "node"]` vì TypeScript 6 không còn tự nạp `@types/*`.
