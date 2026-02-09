---
name: context-loader
description: Load project context from .claude/ directory at the start of every task. This ensures Gemini CLI has the same coding rules, design decisions, and library constraints as Claude Code.
---

# Context Loader Skill for Gemini

## Purpose

Load shared project context from `.claude/` directory to ensure Gemini CLI operates with the same knowledge as Claude Code and Codex CLI.

## When to Activate

**ALWAYS** - This skill should run at the beginning of research or analysis tasks.

## Workflow

### Step 1: Load Coding Rules

Read relevant files from `.claude/rules/`:

```
.claude/rules/
├── coding-principles.md   # Simplicity, single responsibility, early return
├── dev-environment.md     # uv, ruff, ty, pytest requirements
├── language.md            # Think in English, respond in Japanese
├── security.md            # Secrets, validation, SQLi/XSS prevention
└── testing.md             # TDD, AAA pattern, 80% coverage
```

### Step 2: Load Design Documentation

Read `.claude/docs/DESIGN.md` for:
- Architecture decisions
- Implementation patterns
- Library choices and constraints

### Step 3: Check Library Documentation

If the task involves specific libraries, read relevant files from:
```
.claude/docs/libraries/
```

### Step 4: Execute Research Task

With the loaded context, execute the requested research/analysis following:
- Project coding principles
- Existing design decisions
- Library constraints

## Key Rules to Remember

1. **Simplicity first** - Recommend readable solutions over complex
2. **Type hints required** - Suggest typed code
3. **Use uv** - Reference uv for package management
4. **Security** - Highlight security considerations

## Language Protocol

- **Thinking/Reasoning**: English
- **Code examples**: English (variables, functions, comments)
- **Output**: Structured markdown, suitable for documentation

## Output Guidelines

When providing research results:
- Structure with clear headings
- Include code examples when relevant
- Cite sources from web search
- Note constraints relevant to this project
- Save comprehensive findings to `.claude/docs/research/`

<!--
name: context-loader
description: 毎タスク開始時に `.claude/` からコンテキストを読み込み、Gemini CLI が同じルールと設計判断で動けるようにする。

# Gemini 用コンテキストローダー

## 目的

`.claude/` から共有コンテキストを読み込み、Gemini CLI が Claude Code と同じ知識で調査/分析できるようにする。

## いつ使うか

**常に** — 調査・分析タスクの開始時に実行する。

## ワークフロー

### ステップ1: コーディングルール読み込み

`.claude/rules/` の関連ファイルを読む。

### ステップ2: 設計ドキュメント読み込み

`.claude/docs/DESIGN.md` を読んで設計判断を把握する。

### ステップ3: ライブラリ文書確認

必要に応じて `.claude/docs/libraries/` を読む。

### ステップ4: 調査/分析の実行

読み込んだルール・設計判断・制約に従って調査を行う。

## 主要ルール

1. シンプルさ優先
2. 型ヒント推奨
3. pip ではなく uv
4. セキュリティ重視

## 言語プロトコル

思考/推論は英語、コード例は英語、出力は文書向けの構造化マークダウン。

## 出力ガイドライン

見出しを整理し、必要に応じてコード例を入れ、Web検索の出典を示し、制約を明記し、結果を `.claude/docs/research/` に保存する。
-->
