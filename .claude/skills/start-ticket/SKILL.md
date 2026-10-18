---
name: start-ticket
argument-hint: "[số issue]"
allowed-tools: Bash(bash *inspect-start.sh* *), Bash(gh issue view *), Bash(gh repo view *), Bash(git branch *), Bash(git status *), Bash(git fetch *), Bash(git switch *), Bash(git checkout *)
description: Tạo branch làm việc cho một ticket GitHub (fix/<id>-<slug>) từ default branch, trước khi analyze/plan/implement. Dùng skill này mỗi khi người dùng nói "bắt đầu ticket N", "start ticket", "tạo branch cho issue N", "làm issue N", "chuyển sang branch làm ticket", hoặc đang đứng ở main/master mà muốn bắt đầu một ticket — kể cả khi họ không nhắc chữ "branch". Chỉ tạo và chuyển sang branch mới; không commit, không push, không sửa code.
---

# Start Ticket

Tạo branch làm việc cho ticket để các bước sau (`analyze-ticket` → `plan-ticket` → `implement-plan` → `verify` → `commit-to-pr`) có chỗ đứng. `commit-to-pr` cố ý không tạo branch và sẽ dừng nếu đang ở default branch, nên skill này là bước đầu của luồng.

Nói chuyện với người dùng bằng tiếng Việt. Tên branch bằng tiếng Anh.

**Phạm vi:** chỉ tạo và chuyển sang branch mới từ default branch. Không commit, không push, không stash, không sửa code, không xóa branch.

## Quy trình

### 1. Lấy bối cảnh
**Bối cảnh** (đã được nạp sẵn trước khi bạn đọc skill này, không cần chạy lại):

!`bash "${CLAUDE_SKILL_DIR}/scripts/inspect-start.sh" "$0"`

- Có `TICKET_FETCH_FAILED` (thiếu/sai ID, chưa đăng nhập `gh`, issue không tồn tại): nói rõ lỗi, hỏi lại ID. Không đoán tên branch từ lời người dùng.
- `DEFAULT_BRANCH_UNKNOWN`: hỏi người dùng default branch, không đoán.

### 2. Dừng nếu không an toàn
Dừng và báo, không tự xử lý:
- **Working tree bẩn** (mục `WORKING_TREE` có nội dung): liệt kê các file, nói chuyển branch có thể mang theo hoặc làm mất thay đổi; để người dùng tự commit/stash rồi chạy lại.
- **Đã có branch cho issue này** (mục `EXISTING_BRANCHES_FOR_ISSUE`): nêu tên branch, hỏi chuyển sang branch đó hay tạo mới với tên khác. Không ghi đè.
- **Issue đã đóng** (`state` = CLOSED): báo và hỏi có tiếp tục không.

### 3. Đặt tên branch
`fix/<id>-<slug>`:
- `<id>`: số issue.
- `<slug>`: kebab-case **tiếng Anh**, không dấu, khoảng 3–5 từ, tóm ý định từ title (dịch sang tiếng Anh nếu cần). Ví dụ: `fix/123-login-rate-limit`.
- Tiền tố `fix/` là mặc định. Nếu label hoặc title cho thấy rõ đây là feature/chore/docs thì dùng `feat/`, `chore/`, `docs/` tương ứng.

### 4. Tạo branch
1. `git fetch origin <default>` để branch xuất phát là bản mới nhất.
2. `git switch -c <tên-branch> origin/<default>`.
3. Kiểm tra bằng `git branch --show-current`.

Nếu fetch hoặc switch lỗi, báo nguyên văn lỗi và dừng.

### 5. Báo cáo và dừng
Cho người dùng biết: tên branch, branch xuất phát, title issue. Gợi ý bước tiếp theo là `analyze-ticket <id>`. Không tự chạy bước đó.
