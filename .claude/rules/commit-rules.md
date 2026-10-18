# Quy tắc commit

Commit message viết bằng tiếng Anh (phần giải thích cho người dùng thì tiếng Việt).

```
type(scope): subject
```

- **type**: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `build`, `ci`, `chore`, `revert`.
- **scope**: module/khu vực bị đổi (vd `auth`, `api`); bỏ qua nếu thay đổi toàn repo.
- **subject**: thể mệnh lệnh ("add", không phải "added"), chữ thường, không dấu chấm cuối, <= 72 ký tự.
- **body**: tùy chọn, chỉ khi cần giải thích *vì sao*.
- Mỗi commit là một thay đổi logic.
