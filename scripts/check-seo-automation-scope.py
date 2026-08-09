#!/usr/bin/env python3
"""Reject control-plane changes from autonomous SEO branches."""

from __future__ import annotations

import os
import subprocess
import sys


PREFIX = "seo/agentsight-"
ALLOWED_GITHUB_PATHS = {
    ".github/seo-data/status.md",
    ".github/seo-data/plan.md",
    ".github/seo-data/block.md",
    ".github/seo-data/promotion.md",
    ".github/seo-skills",
}
PROTECTED_EXACT = {
    ".gitmodules",
    ".gitattributes",
    ".gitignore",
    "AGENTS.md",
    "scripts/check-seo-automation-scope.py",
}


def git(*args: str) -> str:
    result = subprocess.run(
        ["git", *args],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    return result.stdout.strip()


def allowed(path: str) -> bool:
    if path in PROTECTED_EXACT:
        return False
    if path.startswith(".agents/"):
        return False
    if path.startswith(".github/seo-data/daily/"):
        return True
    if path in ALLOWED_GITHUB_PATHS:
        return True
    if path.startswith(".github/"):
        return False
    return True


def main() -> int:
    branch = os.environ.get("SEO_AUTOMATION_BRANCH", "")
    if not branch.startswith(PREFIX):
        print(f"SEO scope guard skipped for branch {branch!r}")
        return 0

    base = os.environ.get("SEO_BASE_REF", "origin/main")
    merge_base = git("merge-base", base, "HEAD")
    changed = [
        line
        for line in git("diff", "--name-only", f"{merge_base}...HEAD").splitlines()
        if line
    ]
    denied = [path for path in changed if not allowed(path)]

    print(f"SEO scope guard checked {len(changed)} changed path(s)")
    if denied:
        print("autonomous SEO branch changed protected control-plane paths:", file=sys.stderr)
        for path in denied:
            print(f"  - {path}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
