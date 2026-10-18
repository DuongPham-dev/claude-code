#!/usr/bin/env bash
# Nạp ticket GitHub cho skill analyze-ticket (dynamic context).
# Luôn exit 0: lệnh inject mà exit != 0 sẽ abort cả skill, nên lỗi được báo bằng sentinel.

id="$1"

if [[ ! "$id" =~ ^[0-9]+$ ]]; then
  echo "TICKET_FETCH_FAILED: cần ID issue GitHub dạng số, nhận được: '${id}'"
  exit 0
fi

gh issue view "$id" --json number,title,body,labels,assignees,comments,url 2>&1 || echo "TICKET_FETCH_FAILED"
exit 0
