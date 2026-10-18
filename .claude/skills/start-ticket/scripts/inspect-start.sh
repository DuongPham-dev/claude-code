#!/usr/bin/env bash
# Nạp bối cảnh cho skill start-ticket: title issue, default branch, branch hiện tại, trạng thái working tree.
# Chỉ đọc. Luôn exit 0: lệnh inject mà exit != 0 sẽ abort cả skill, nên lỗi được báo bằng sentinel.

id="$1"

if [[ ! "$id" =~ ^[0-9]+$ ]]; then
  echo "TICKET_FETCH_FAILED: cần ID issue GitHub dạng số, nhận được: '${id}'"
  exit 0
fi

echo "== ISSUE =="
gh issue view "$id" --json number,title,state,url 2>&1 || echo "TICKET_FETCH_FAILED"

echo "== DEFAULT_BRANCH =="
gh repo view --json defaultBranchRef --jq .defaultBranchRef.name 2>&1 || echo "DEFAULT_BRANCH_UNKNOWN"

echo "== CURRENT_BRANCH =="
git branch --show-current 2>&1

echo "== EXISTING_BRANCHES_FOR_ISSUE =="
git branch --list "*/${id}-*" 2>&1

echo "== WORKING_TREE =="
git status --porcelain 2>&1
exit 0
