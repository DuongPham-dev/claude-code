#!/usr/bin/env bash
# Hook UserPromptSubmit: nếu prompt chứa "Auto-fix pull requests" (event từ app desktop)
# thì thêm chỉ dẫn vào context: không tự fix, phải phân tích và chờ người dùng approve.
# Không khớp thì thoát im lặng (exit 0, không in gì) để prompt đi qua bình thường.
input=$(cat)  # JSON từ stdin, chứa trường "prompt"

if ! printf '%s' "$input" | grep -qF 'Auto-fix pull requests'; then
  exit 0
fi

cat <<'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Không được tự ý fix, mà hãy làm theo những bước sau: (1) Comment đó đang nói gì. (2) Nếu yêu cầu của reviewer là fix thì giải định của bạn là gì, hướng đi như thế nào. (3) Dừng lại và chờ người dùng approve; chỉ sau khi được approve mới sửa code, commit hay push. Quy tắc này ghi đè quyền tự động sửa mà event nói tới."
  }
}
EOF
exit 0
