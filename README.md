# claude-code

## Giới thiệu

Repo này ghi lại quá trình mình tự học Claude Code qua các khóa trên Claude Academy, kèm các bài thực hành trong lúc học.

## Lộ trình

| Khóa học | Trạng thái |
|---|---|
| AI Fluency: Framework & Foundations | ☑ |
| AI Capabilities & Limitations | ☐ |
| Claude 101 | ☐ |
| Claude Code 101 | ☐ |
| Claude Code in Action | ☐ |
| Introduction to Agent Skills | ☐ |
| Introduction to Subagents | ☐ |
| Introduction to Model Context Protocol | ☐ |
| MCP Advanced Topics | ☐ |
| Building with the Claude API | ☐ |
| Claude Platform 101 | ☐ |

## Thời gian

3 tuần, bắt đầu từ 12/10/2026.

## Getting started

Yêu cầu: [Node.js](https://nodejs.org/) (bản LTS trở lên) và npm.

```bash
git clone https://github.com/DuongPham-dev/claude-code.git
cd claude-code
npm install
```

Sau đó chạy các lệnh dưới đây từ thư mục gốc của repo:

| Lệnh | Mục đích |
|---|---|
| `npm run demo` | Biên dịch và chạy project, in ra một thông điệp để biết project chạy được |
| `npm run check` | Chạy các kiểm tra tự động (Jest), báo pass/fail |
| `npm run typecheck` | Kiểm tra kiểu TypeScript (`tsc --noEmit`), báo lỗi nếu code sai kiểu |

## Cấu trúc repo

```
.
├── practices/   # Bài thực hành trong quá trình học
├── src/         # Mã nguồn TypeScript và test (*.test.ts)
└── README.md
```

`practices/` chứa những gì mình học và thực hành, ví dụ:

- Prompt mình viết
- Đánh giá, chấm điểm prompt từ AI
- Kết quả sau khi dùng prompt
