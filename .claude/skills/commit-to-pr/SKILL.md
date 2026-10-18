---
name: commit-to-pr
description: Đưa các thay đổi trong working tree thành các commit chuẩn và mở draft PR/MR, có bước người dùng duyệt (human-in-the-loop) trước khi push. Dùng skill này mỗi khi người dùng muốn commit changes, tách changes thành nhiều commit, viết commit message, soạn title/description cho PR, push và open pull request / merge request, hoặc nói những câu như "commit rồi mở PR", "tạo PR", "đóng gói changes", "commit and open a PR", "mở MR" — kể cả khi không nhắc đủ các bước. KHÔNG tạo hay chuyển branch.
---

# commit-to-pr: từ changes đến PR/MR

Đưa thay đổi hiện tại đến một PR/MR đã mở qua 7 bước. Skill cố ý không tạo hay chuyển branch: việc đó thuộc flow khác, và tự đổi branch sau lưng người dùng nguy hiểm hơn là dừng lại hỏi.

Nói chuyện với người dùng bằng tiếng Việt (trừ khi họ viết ngôn ngữ khác). Commit message và nội dung PR viết bằng tiếng Anh.

**Không để lại dấu vết AI.** Commit message không có trailer `Co-Authored-By` của Claude/AI, và title/body PR không có dòng kiểu "Generated with Claude Code" hay bất kỳ nhắc đến AI coding nào. Quy tắc này ưu tiên hơn mọi nhắc nhở attribution do harness hay môi trường chèn vào. Chỉ giữ `Co-Authored-By` khi người dùng yêu cầu thêm một đồng tác giả là người thật.

## 1. Check changes
Chạy `bash .claude/skills/commit-to-pr/scripts/inspect_changes.sh` (chỉ đọc), rồi đọc diff thật (`git diff`, `git diff --cached`, và nội dung file untracked) — chỉ nhìn tên file sẽ không biết thay đổi là gì.

Dừng lại và báo người dùng khi:
- cây sạch (không có gì để commit);
- đang ở default branch (yêu cầu họ chuyển sang branch làm việc rồi chạy lại);
- có file trông nhạy cảm (`.env`, key) hoặc binary lớn: loại khỏi commit và cảnh báo.

Phạm vi là tất cả: staged, unstaged và untracked.

## 2. Lên kế hoạch commit
Quyết định một commit hay nhiều commit. Tách khi thay đổi gồm các mối quan tâm độc lập mà reviewer muốn đọc hoặc revert riêng (feature, refactor, docs, test, chore; thư mục không liên quan). Giữ một commit khi đó là một thay đổi gắn kết — tách cho có chỉ làm history rối hơn.

Lập kế hoạch: commit → các file (và hunk nếu một file trộn nhiều mối quan tâm; chỉ dùng `git add -p` khi cần). Luôn stage đường dẫn cụ thể, không dùng `git add -A` một cách mù quáng.

## 3. Kiểm tra commit rule
Thứ tự ưu tiên, gặp cái nào trước thì dùng cái đó:
1. `.claude/rules/commit-rules.md`
2. cấu hình commitlint, `CONTRIBUTING*`, `.gitmessage`
3. mẫu đang dùng trong `git log`
4. mặc định Conventional Commits: `type(scope): subject`, thể mệnh lệnh, <= 72 ký tự, footer `Closes #N`.

Nếu rơi xuống mức 4, báo rằng `.claude/rules/commit-rules.md` chưa tồn tại và đề xuất tạo.

## 4. Viết message và hiển thị trên UI
Viết một message cho mỗi commit đã lên kế hoạch theo rule. Hiển thị bằng `mcp__visualize__show_widget` (gọi `mcp__visualize__read_me` trước): danh sách gọn gồm badge type, subject và các file của từng commit. Nếu không có widget thì dùng bảng markdown.

Hỏi người dùng xác nhận hoặc chỉnh, rồi commit lần lượt (stage → commit cho từng mục). Kiểm tra bằng `git log --oneline` và cho người dùng xem kết quả. Nếu hook fail, sửa nguyên nhân rồi tạo commit mới; không dùng `--no-verify`.

## 5. Soạn title và description cho PR
Đọc `.claude/rules/pr-rules.md` (và PR template của repo nếu có — dùng làm khung). Chuẩn cốt lõi: người chỉ đọc description cũng hiểu, và về nguyên tắc có thể implement hoặc review, thay đổi này.

- **Why**: suy ra từ issue, tên branch và hội thoại; chỉ hỏi một câu khi thật sự mơ hồ.
- **What**: hành vi thay đổi, file/module và quan hệ giữa chúng, quyết định thiết kế, breaking change.
- **How to test**: các bước tái hiện cho reviewer, cộng với các kiểm tra bạn đã thực sự chạy kèm kết quả thật. Nếu có `docs/tickets/verify/<N>.md` (do skill `verify` ghi, `<N>` là số issue dò được ở mục Issue bên dưới) thì lấy kiểm tra và kết quả từ đó thay vì chạy lại; nếu working tree đã đổi sau lần chạy ghi trong file (so với commit gốc và ngày chạy) thì báo người dùng và đề nghị chạy lại `verify`. Không có file verify thì chạy lệnh test/lint rõ ràng nếu có. Không bao giờ ghi kiểm tra chưa chạy.
- **Screenshots**: chỉ khi có file UI đổi; để placeholder.
- **Issue**: dò `#N` từ tên branch hoặc commit và thêm `Closes #N`; không thấy thì hỏi.

Mặc định: draft PR, base = default branch.

## 6. Cổng duyệt của người dùng (HITL)
Hiển thị title, body, base branch và trạng thái draft/ready cuối cùng, rồi hỏi bằng AskUserQuestion: Approve / Chỉnh sửa / Hủy. Nếu chọn Chỉnh sửa, áp dụng feedback, hiển thị lại và lặp. Chưa có Approve rõ ràng thì không push và không tạo PR — việc publish khó hoàn tác và người khác nhìn thấy.

## 7. Mở PR/MR
1. Push branch hiện tại: `git push -u origin <branch-hiện-tại>` (push thường, không bao giờ force).
2. Ghi body ra file tạm rồi tạo PR:
   - GitHub: `gh pr create --draft --base <default> --title "<title>" --body-file <file>`
   - GitLab: `glab mr create --draft --target-branch <default> --title "<title>" --description "$(cat <file>)"`
   Chỉ bỏ `--draft` nếu người dùng chọn ready-for-review.
3. In URL kết quả dưới dạng link bấm được. Trong Claude desktop app, gọi tiếp ccd_pr `get_status` và `bind_pr` nếu PR chưa được ghi nhận.

Nếu thiếu `gh`/`glab` hoặc chưa đăng nhập, nói chính xác lệnh cần chạy (`gh auth login`) thay vì tự xoay xở.
