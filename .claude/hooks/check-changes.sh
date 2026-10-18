#!/usr/bin/env bash
# Hook UserPromptExpansion cho /commit-to-pr: nếu không có thay đổi nào thì chặn
# ngay (exit 2) để model không bị gọi. Thông báo ở stderr được hiển thị cho người dùng.
cat >/dev/null  # bỏ qua JSON đầu vào từ stdin

if ! out=$(git status --porcelain 2>/dev/null); then
  exit 0  # không phải git repo hoặc git lỗi: để skill tự xử lý
fi

if [ -z "$out" ]; then
  echo "commit-to-pr: không có thay đổi nào để commit (working tree sạch)." >&2
  exit 2
fi
exit 0
