---
name: context-loader
description: ALWAYS activate this skill at the start of every task. Load project context from .claude/ directory including coding rules, design decisions, and documentation before executing any task.
---

# Context Loader Skill

## Purpose

Load shared project context from `.claude/` directory to ensure Codex CLI has the same knowledge as Claude Code.

## When to Activate

**ALWAYS** - This skill must run at the beginning of every task to load project context.

## Workflow

### Step 1: Load Coding Rules

Read all files in `.claude/rules/`:

```
.claude/rules/
├── coding-principles.md   # Simplicity, single responsibility, early return
├── dev-environment.md     # uv, ruff, ty, pytest requirements
├── language.md            # Think in English, respond in Japanese
├── security.md            # Secrets, validation, SQLi/XSS prevention
├── testing.md             # TDD, AAA pattern, 80% coverage
└── codex-delegation.md    # (skip - not relevant for Codex itself)
```

### Step 2: Load Design Documentation

Read `.claude/docs/DESIGN.md` for:
- Architecture decisions
- Implementation patterns
- Library choices and constraints
- TODO items and open questions

### Step 3: Check Library Documentation

If the task involves specific libraries, read relevant files from:
```
.claude/docs/libraries/
```

### Step 4: Execute Task

With the loaded context, execute the requested task following:
- Coding principles from rules
- Design decisions from DESIGN.md
- Library constraints from docs

## Key Rules to Remember

After loading, always follow these principles:

1. **Simplicity first** - Choose readable code over complex
2. **Single responsibility** - One function/class does one thing
3. **Type hints required** - All functions need annotations
4. **Use uv** - Never use pip directly
5. **Security** - No hardcoded secrets, validate input, parameterize SQL

## Language Protocol

- **Thinking/Reasoning**: English
- **Code**: English (variables, functions, comments)
- **User communication**: Japanese (when reporting back through Claude Code)

## Output

After loading context, briefly confirm:
- Rules loaded
- Design document status
- Ready to execute task

<!--
name: context-loader
description: 毎タスク開始時に必ず使う。`.claude/` のルール・設計・ドキュメントを読み込み、Codex CLI が同じ前提で動けるようにする。

# コンテキストローダースキル

## 目的

`.claude/` から共有コンテキストを読み込み、Codex CLI が Claude Code と同じ知識で作業できるようにする。

## いつ使うか

**常に** — すべてのタスク開始時に実行する。

## ワークフロー

### ステップ1: コーディングルール読み込み

`.claude/rules/` の各ファイルを読む。

### ステップ2: 設計ドキュメント読み込み

`.claude/docs/DESIGN.md` を読み、設計判断・実装パターン・制約・TODO を把握する。

### ステップ3: ライブラリ文書確認

必要に応じて `.claude/docs/libraries/` を読む。

### ステップ4: タスク実行

読み込んだルールと設計判断に従ってタスクを実行する。

## 主要ルール

1. シンプルさ優先
2. 単一責任
3. 型ヒント必須
4. pip ではなく uv
5. セキュリティ重視

## 言語プロトコル

思考/推論は英語、コードも英語、ユーザーへの報告は日本語（Claude Code が翻訳）。

## 出力

読み込み後に「ルール読み込み済み」「設計文書の状態」「準備完了」を簡潔に報告する。
-->
