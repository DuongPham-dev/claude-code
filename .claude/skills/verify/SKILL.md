---
name: verify
argument-hint: "[số issue]"
description: Chạy các kiểm tra tự động của repo (test, lint, typecheck, build) cho thay đổi của một ticket và ghi kết quả thật vào docs/tickets/verify/<id>.md để commit-to-pr đưa vào mục "How to test" của PR. Dùng skill này mỗi khi người dùng nói "chạy test", "verify ticket N", "kiểm tra lại trước khi tạo PR", "test đã pass chưa", "chạy lint và build" sau khi implement — kể cả khi họ chỉ nói "xong rồi, kiểm tra đi". Chỉ chạy kiểm tra và ghi file kết quả; không sửa code, không commit.
---

# Verify

Chạy các kiểm tra tự động của repo và ghi lại **kết quả thật**. Đây là cổng giữa `implement-plan` và `commit-to-pr`: mục "How to test" của PR không được ghi kiểm tra chưa chạy, nên kết quả phải đến từ lần chạy thật ở đây.

Nói chuyện với người dùng bằng tiếng Việt.

**Phạm vi:** chạy lệnh kiểm tra và ghi một file trong `docs/tickets/verify/`. **Không sửa code**, không tự sửa test hay lint cho pass, không commit, không push. Kiểm tra fail thì dừng và báo; việc sửa thuộc `implement-plan`.

## Quy trình

### 1. Dò lệnh kiểm tra
**Nguồn lệnh của repo** (đã được nạp sẵn trước khi bạn đọc skill này, chỉ đọc):

!`bash "${CLAUDE_SKILL_DIR}/scripts/detect-checks.sh"`

Từ đó chọn lệnh **test, lint, typecheck, build** mà repo thực sự có. Quy tắc:
- Dùng đúng package manager theo lockfile (pnpm/yarn/npm/bun); không đoán.
- Ưu tiên script đã có trong `package.json`/`Makefile`/CI workflow hơn lệnh tự nghĩ ra. Cần chắc thì đọc workflow trong `.github/workflows` để xem CI chạy gì.
- Không có lệnh nào cho loại kiểm tra nào đó → ghi "Không có", đừng tự dựng.
- Không tìm được lệnh test nào → dừng, hỏi người dùng lệnh đúng. Không bỏ qua rồi báo "ổn".

### 2. Xác định phạm vi
Nếu có file plan `docs/tickets/plan/<id>-*.md`, đọc mục "Test sẽ thêm / sửa" để chạy riêng các test mới **trước**, rồi chạy bộ kiểm tra đầy đủ của repo. Nhận **ID số** của issue; thiếu hoặc sai → hỏi lại. Không có file plan vẫn chạy được, ghi "Không có plan" ở phần phạm vi.

### 3. Chạy
Chạy lần lượt: test riêng của ticket → test đầy đủ → lint → typecheck → build (loại nào có). Với mỗi lệnh ghi lại: lệnh chính xác, exit code, thời lượng nếu thấy, và phần output đủ để hiểu kết quả (tóm tắt số pass/fail; khi fail thì trích lỗi). Chạy lệnh chạy lâu ở nền khi cần và chờ kết thúc.

Không lọc kết quả cho đẹp: test bị skip, cảnh báo, hoặc lệnh không chạy được đều phải ghi đúng như thấy.

### 4. Ghi file
Đường dẫn: `docs/tickets/verify/<ticket-id>.md`, tạo thư mục nếu chưa có. Viết tiếng Việt, giữ nguyên lệnh và output:

```markdown
# Verify #<id>

- **Branch:** <branch hiện tại>
- **Commit gốc:** <git rev-parse --short HEAD>
- **Ngày chạy:** <YYYY-MM-DD>
- **Kết quả tổng:** Pass | Fail | Một phần

## Kiểm tra đã chạy
| Loại | Lệnh | Kết quả |
|---|---|---|
| Test (ticket) | `...` | pass 3/3 |
| Test (đầy đủ) | `...` | pass 120, fail 0, skip 2 |
| Lint | `...` | ... |
| Typecheck | `...` | Không có |
| Build | `...` | ... |

## Chi tiết lỗi
(Chỉ khi có fail: trích lỗi đủ để hiểu.)

## Kiểm tra thủ công đề xuất
(Các bước tái hiện cho reviewer, lấy từ "Cách tái hiện" của plan nếu có. Chỉ là đề xuất, chưa chạy.)
```

Nếu file cùng `<ticket-id>` đã tồn tại thì đây là lần chạy mới: ghi đè là đúng vì kết quả cũ hết giá trị, nhưng nhắc rõ trong báo cáo. Kết quả file luôn phản ánh lần chạy **mới nhất** trên working tree hiện tại.

File là tài liệu làm việc cục bộ; người dùng tự thêm `docs/tickets/` vào `.gitignore`. Skill không sửa `.gitignore`; chỉ nhắc một dòng cuối báo cáo nếu thư mục chưa bị ignore (`git check-ignore docs/tickets/verify`).

### 5. Báo cáo và dừng
- **Pass hết:** báo đường dẫn file, tóm tắt, gợi ý `commit-to-pr`.
- **Có fail:** liệt kê kiểm tra nào fail kèm lỗi chính, dừng. Không sửa code, không gợi ý bỏ qua. Hỏi người dùng có muốn quay lại `implement-plan` để sửa không.
