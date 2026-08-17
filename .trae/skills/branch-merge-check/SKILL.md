---
name: "branch-merge-check"
description: "Checks whether all branch changes are fully merged into the target branch before completing a merge. Invoke when merging branches, syncing worktrees, or when user reports '页面不是最新' / '版本不对' / 分支合并 / 同步分支. MUST be invoked before declaring a merge complete."
---

# Branch Merge Check

This skill ensures that **all historical changes from a source branch are fully reflected in the target branch** after a merge, preventing the silent-loss-of-content bug that occurs when:

1. A merge is done via squash/单边提交 — only the final state is preserved, intermediate commit diffs are lost.
2. A large entry file (e.g., `index.html` with an inline app) is replaced wholesale — the replacement discards in-flight edits that lived only inside the replaced file.
3. A worktree branch was fast-forwarded but the working tree still serves stale code from a Vite/webpack cache.
4. The "latest version" of a page/feature lives only in a later commit of the source branch, but the merge stopped at an earlier commit.
5. **Style/参数 丢失** — 同一个组件类名在源分支与目标分支都有定义，但参数（宽度/字号/padding/边框/圆角/颜色等）不同。git 合并成功后目标分支仍保留自己的旧参数，源分支调整过的参数没有传播过来。

## When to Invoke

Invoke this skill **immediately** in any of these situations:

- User asks to merge a branch / 合并分支 / 同步分支 / 合并 worktree
- User reports 页面不是最新 / 版本不对 / 缺少功能 / 不是最新版本 after a merge
- User asks to check whether a branch's history is fully merged
- Before declaring a merge "complete" or "done"

**Do NOT** just run `git merge` and call it done. Always run the verification checklist below.

## Verification Checklist (run all 6 steps)

### Step 1 — Identify the source branch's own commits

```bash
git log <source-branch> --oneline --not <merge-base-or-parent>
```

This lists every commit that exists on the source branch but NOT on the parent. These are the commits whose diffs must all appear in the target after merge. **Record the commit SHAs.**

### Step 2 — For each commit, extract the intended change

For each SHA from Step 1:

```bash
git show --stat <SHA>           # which files changed
git show <SHA> -- <file>        # full diff for a specific file
git show <SHA>:<file>           # full content of the file at that commit (the "latest version" if it's the tip)
```

**Key insight**: if a commit's message says "调整XXX" / "优化XXX" / "fix XXX", that commit is a *delta on top of an earlier version*. A squash merge that only carries the file's final bytes into the target will lose the *intent* of the delta if the target's copy of that file was rewritten for another reason.

### Step 3 — Compare against the target branch's current state

For each file that changed in the source branch:

```bash
diff <target>/<file> <source-branch>:<file>   # or
git diff <target> <source-branch> -- <file>
```

If the diff is non-empty **after** the merge, the merge did NOT fully propagate the source branch's content. Investigate why:
- Was the file rewritten on the target for an unrelated reason (e.g., UI refactor)? → Manually port the source's edits onto the new version of the file.
- Was the merge a squash that pre-dated the source's latest commit? → Re-merge with `--no-ff` to preserve history, or cherry-pick the missing commit.

**特别注意：样式/参数 级别的差异**。即使整个文件存在，git 也会因"两边都改了同一行"或"目标分支版本更新"而保留目标的旧参数。必须逐个类名/属性对比。典型场景：
- 弹窗 Modal 宽度（720 vs 800）、按钮尺寸（default vs large）
- 卡片网格列数（repeat(3,1fr) vs auto-fit minmax）、padding（32px 16px vs 48px 24px）、border（1px #e8e8e8 vs 2px #f0f0f0）、圆角（8px vs 12px）
- 字号（16px 500 vs 28px bold）、颜色（#999 vs #666）
- hover 阴影（0 2px 8px vs 0 4px 12px）

修复方法：直接以源分支 tip 的值为准，覆盖目标分支对应属性。

### Step 4 — Check for "entry file rewrite" data loss

This is the most common silent bug. If the target branch **replaced** a large entry file (e.g., swapped `index.html` from an inline-app to a Vite stub), any *content edits* that the source branch made *inside* the old entry file are lost — even if `git merge` reports success.

Detection:
```bash
git log --oneline <target> -- index.html           # look for "rewrite"/"重写"/"standard entry" commits
git show <source-tip>:index.html | grep -n "<feature-specific-text>"   # e.g., the new config page's fields
grep -n "<feature-specific-text>" <target>/index.html                  # will be empty if lost
```

If lost: extract the latest version of the lost content from `git show <source-tip>:<file>` and port it into the corresponding `src/` file (the Vite-era replacement).

### Step 5 — Sync worktrees and clear caches

After the target is verified correct:

1. For each worktree of the source branch: `cd <worktree>` then `git merge <target>` (fast-forward is fine — target is now ahead).
2. Restart the dev server with `--force` to bust the Vite/webpack dependency cache:
   ```bash
   rm -rf node_modules/.vite
   vite --force --port <port>
   ```
   Old `?v=<hash>` query strings in cached modules will be invalidated, forcing the browser to re-fetch.
3. Hard-refresh the browser (Cmd+Shift+R) or verify via `curl http://localhost:<port>/src/<file>` that the served source contains the new content.

### Step 6 — Functional confirmation against the source's plan doc

If the source branch has a plan/design doc (e.g., `.trae/documents/*.md`), re-read it and tick each required field/page/interaction against the live target code. Do not rely on "git says merged" alone — confirm the actual bytes.

## Common Failure Patterns (memorize these)

| Pattern | Symptom | Fix |
|---|---|---|
| Squash merge | `git log` shows 1 commit instead of N; later commits' deltas lost | Re-merge with `--no-ff`, or cherry-pick missing SHAs |
| Entry file rewrite | `index.html` was replaced; inline app's latest page lost | Port lost content into `src/` files |
| Worktree stale | Branch worktree still serves old commit | `git merge <target>` inside worktree |
| Vite cache | Code correct, browser shows old UI | `vite --force` + hard refresh |
| "Latest version" only in tip | Merge stopped at an earlier SHA | `git merge <source-tip>` to fast-forward to tip |
| Plan doc vs code drift | Feature listed in `.trae/documents/*.md` but missing in code | Read plan, implement missing pieces |
| **样式参数漂移** | 同名 class 在两边都有定义，但 padding/字号/边框/圆角/颜色不同；git 报告合并成功但 UI 仍是旧参数 | 以源分支 tip 为准逐属性覆盖；逐个类名 diff `git show <source-tip>:<less>` vs target |

## Output Contract

After running the checklist, report to the user:

1. **Source branch commits**: list each SHA + message + files changed
2. **Merge status**: fully merged / partially merged / not merged
3. **Any lost content**: what was lost, why, and how it was recovered
4. **Worktree sync status**: each worktree's HEAD after sync
5. **Cache cleared**: dev server restarted with `--force`, browser hard-refresh recommended
6. **Functional check**: each plan-doc item ticked off against live code

Do NOT declare "done" until all 6 steps pass.
