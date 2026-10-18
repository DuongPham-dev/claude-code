#!/usr/bin/env bash
# Dò lệnh test/lint/build của repo cho skill verify (chỉ đọc, không chạy gì).
# Luôn exit 0. In ra từng nguồn tìm thấy để skill chọn lệnh; không đoán thay skill.

echo "== PACKAGE_JSON_SCRIPTS =="
if [ -f package.json ]; then
  node -e 'const s=(require("./package.json").scripts)||{};for(const k of Object.keys(s))console.log(k+": "+s[k])' 2>/dev/null \
    || grep -A30 '"scripts"' package.json
else
  echo "(không có package.json)"
fi

echo "== LOCKFILE =="
ls pnpm-lock.yaml yarn.lock package-lock.json bun.lockb bun.lock 2>/dev/null || echo "(không có lockfile Node)"

echo "== MAKEFILE_TARGETS =="
if [ -f Makefile ]; then
  grep -E '^(test|lint|build|check|typecheck)[A-Za-z0-9_-]*:' Makefile || echo "(không có target phổ biến)"
else
  echo "(không có Makefile)"
fi

echo "== PYTHON =="
for f in pyproject.toml pytest.ini tox.ini setup.cfg; do [ -f "$f" ] && echo "$f"; done
[ -z "$(ls pyproject.toml pytest.ini tox.ini setup.cfg 2>/dev/null)" ] && echo "(không có cấu hình Python)"

echo "== OTHER =="
for f in go.mod Cargo.toml pom.xml build.gradle build.gradle.kts composer.json Gemfile; do [ -f "$f" ] && echo "$f"; done
[ -z "$(ls go.mod Cargo.toml pom.xml build.gradle build.gradle.kts composer.json Gemfile 2>/dev/null)" ] && echo "(không có)"

echo "== CI_WORKFLOWS =="
ls .github/workflows 2>/dev/null || echo "(không có .github/workflows)"
exit 0
