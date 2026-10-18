# Quy tắc PR / MR

**Title và body PR viết bằng tiếng Anh** (giữ nguyên tên các section bên dưới). Nếu repo có `.github/pull_request_template.md` thì dùng làm khung và áp dụng các chuẩn dưới đây bên trong nó.

**Chuẩn chất lượng:** người khác chỉ đọc description cũng hiểu được thay đổi, và về nguyên tắc có thể implement hoặc review mà chưa cần mở diff.

## Title
Theo quy tắc commit (`type(scope): subject`, <= 72 ký tự). PR nhiều commit thì tóm tắt thay đổi tổng thể.

## Body
```
## Summary
Một hai câu: PR này làm gì.

## Why
Vấn đề hoặc nhu cầu phía sau. Gắn issue (`Closes #N`) nếu có.

## What changed
Các thay đổi hành vi chính, module/file liên quan và quan hệ giữa chúng, quyết định thiết kế,
breaking change. Gom theo chủ đề, không liệt kê file một cách máy móc.

## How to test
Các bước tái hiện được cho reviewer: setup, lệnh, input, kết quả mong đợi.
Các kiểm tra tự động đã thực sự chạy (test, lint, build) kèm kết quả thật.

## Screenshots
(chỉ khi UI thay đổi) <dán ảnh trước/sau>
```

## Quy tắc
- **Why** được suy ra từ issue, tên branch và hội thoại. Nếu vẫn chưa rõ, hỏi người dùng một câu trước khi chốt.
- **How to test** không bao giờ ghi kiểm tra chưa chạy. Nếu chưa chạy gì, nói rõ và liệt kê các bước thủ công.
- Chỉ thêm **Screenshots** khi có file UI thay đổi (`.tsx`, `.vue`, `.css`, `.html`, ...); để placeholder cho người dùng dán ảnh.
- Mặc định tạo **draft** PR, base là default branch của repo, trừ khi người dùng nói khác.
