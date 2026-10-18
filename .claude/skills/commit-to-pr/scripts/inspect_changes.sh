#!/usr/bin/env bash
# Read-only snapshot of the repo state for the commit-to-pr skill.
set -u

section() { printf '\n== %s ==\n' "$1"; }

section "branch"
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
echo "current: $branch"
default=$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's#^origin/##')
[ -z "$default" ] && default=$(git remote show origin 2>/dev/null | sed -n 's/.*HEAD branch: //p')
echo "default: ${default:-unknown}"
upstream=$(git rev-parse --abbrev-ref '@{u}' 2>/dev/null || echo "none")
echo "upstream: $upstream"
[ "$branch" = "$default" ] && echo "WARNING: on default branch"

section "remote"
url=$(git remote get-url origin 2>/dev/null || echo none)
echo "$url"
case "$url" in
  *github.com*) echo "host: github (use gh)";;
  *gitlab*) echo "host: gitlab (use glab)";;
  *) echo "host: unknown";;
esac

section "status"
git status -sb

section "diff --stat (staged)"
git diff --cached --stat
section "diff --stat (unstaged)"
git diff --stat
section "untracked"
git ls-files --others --exclude-standard

section "sensitive-looking files"
{ git diff --cached --name-only; git diff --name-only; git ls-files --others --exclude-standard; } \
  | grep -Ei '(^|/)(\.env[^/]*|.*\.(pem|key|p12|pfx)|id_rsa.*|credentials.*)$' || echo "none"

section "rule files"
found=$(ls .claude/rules/commit-rules.md .claude/rules/pr-rules.md commitlint.config.* .commitlintrc* CONTRIBUTING* .gitmessage \
   .github/pull_request_template.md .github/PULL_REQUEST_TEMPLATE.md 2>/dev/null)
echo "${found:-none}"

section "recent commits (style)"
git log --oneline -10 2>/dev/null

section "cli auth"
if command -v gh >/dev/null 2>&1; then gh auth status 2>&1 | head -3; else echo "gh not installed"; fi
