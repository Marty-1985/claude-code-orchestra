---
name: plan
description: Create a detailed implementation plan for a feature or task. Use when user wants to plan before coding.
disable-model-invocation: true
---

# Create Implementation Plan

Create an implementation plan for $ARGUMENTS.

## Planning Process

### 1. Requirements Analysis

First clarify:

- **Purpose**: What to achieve
- **Scope**: What to include, what to exclude
- **Constraints**: Technical, time, dependencies

### 2. Current State Investigation

Investigate the codebase:

```
- Related existing code
- Files affected
- Libraries/patterns to use
- Existing tests
```

### 3. Break Down Implementation Steps

Break into small steps:

1. Each step is independently testable
2. Consider dependency order
3. High-risk steps first

### 4. Output Format

```markdown
## Implementation Plan: {Title}

### Purpose
{1-2 sentences}

### Scope
- New files: {list}
- Modified files: {list}
- Dependencies: {list}

### Implementation Steps

#### Step 1: {Title}
- [ ] {Specific task}
- [ ] {Specific task}
**Verification**: {Completion criteria for this step}

#### Step 2: {Title}
...

### Risks & Considerations
- {Potential issues and mitigations}

### Open Questions
- {Items to clarify before implementation}
```

## Notes

- Plans should be at actionable granularity
- Include verification method for each step
- Ask questions at planning stage for unclear points
- Don't over-detail (adjust during implementation)

<!--
name: plan
description: 機能やタスクの詳細な実装計画を作る。コーディング前の計画が求められるときに使う。
disable-model-invocation: true

# 実装計画の作成

$ARGUMENTS に対する実装計画を作成する。

## 計画プロセス

### 1. 要件分析

- **目的**: 何を達成するか
- **スコープ**: 何を含め、何を除外するか
- **制約**: 技術・時間・依存関係

### 2. 現状調査

関連コード、影響ファイル、使うライブラリ/パターン、既存テストを確認する。

### 3. 実装ステップ分解

- 各ステップは単独で検証できる
- 依存順を考慮
- 高リスクを先に

### 4. 出力フォーマット

目的、スコープ、ステップ、リスク、未解決事項を含むテンプレートを示す。

## 注意

実行可能な粒度で計画し、各ステップの検証方法を含め、曖昧点は質問する。細かすぎる詳細は避ける。
-->
