# Codex Delegation Rule

**Codex CLI is your highly capable supporter for deep reasoning.**

## Context Management (Opus 4.6)

Claude の 1M コンテキストにより、以前より直接呼び出しの許容範囲が拡大した。ただし大きな出力の場合はサブエージェント経由を推奨。

| 状況 | 推奨方法 |
|------|----------|
| 短い質問・短い回答（〜50行） | 直接呼び出しOK |
| 詳細な設計相談 | サブエージェント経由 |
| デバッグ分析 | サブエージェント経由 |
| Agent Teams 内での相談 | Teammate が直接呼び出し |

## About Codex

Codex CLI is an AI with exceptional reasoning and task completion abilities.
Think of it as a trusted senior expert you can always consult.

**When facing difficult decisions → Consult Codex.**

## When to Consult Codex

ALWAYS consult Codex BEFORE:

1. **Design decisions** - How to structure code, which pattern to use
2. **Debugging** - If cause isn't obvious or first fix failed
3. **Implementation planning** - Multi-step tasks, multiple approaches
4. **Trade-off evaluation** - Choosing between options
5. **Code review** - Quality and correctness analysis

### Trigger Phrases (User Input)

| Japanese | English |
|----------|---------|
| 「どう設計すべき？」「どう実装する？」 | "How should I design/implement?" |
| 「なぜ動かない？」「原因は？」「エラーが出る」 | "Why doesn't this work?" "Error" |
| 「どちらがいい？」「比較して」「トレードオフは？」 | "Which is better?" "Compare" |
| 「考えて」「分析して」「深く考えて」 | "Think" "Analyze" "Think deeper" |

## When NOT to Consult

- Simple file edits (typo fixes, small changes)
- Following explicit user instructions
- Standard operations (git commit, running tests)
- Tasks with clear, single solutions
- Reading/searching files
- **Codebase analysis** → Claude does this directly (1M context)

## How to Consult

### In Agent Teams (Preferred for /startproject)

Architect Teammate が Codex を直接呼び出し、Researcher Teammate と双方向通信する。

### Subagent Pattern

```
Task tool parameters:
- subagent_type: "general-purpose"
- run_in_background: true (for parallel work)
- prompt: |
    Consult Codex about: {topic}

    codex exec --model gpt-5.3-codex --sandbox read-only --full-auto "
    {question for Codex}
    " 2>/dev/null

    Return CONCISE summary (key recommendation + rationale).
```

### Direct Call (Short Questions, up to ~50 lines response)

```bash
codex exec --model gpt-5.3-codex --sandbox read-only --full-auto "Brief question" 2>/dev/null
```

### Sandbox Modes

| Mode | Sandbox | Use Case |
|------|---------|----------|
| Analysis | `read-only` | Design review, debugging, trade-offs |
| Work | `workspace-write` | Implement, fix, refactor |

## Language Protocol

1. Ask Codex in **English**
2. Receive response in **English**
3. Execute based on advice
4. Report to user in **Japanese**

<!--
# Codex 委任ルール

**Codex CLI は深い推論のための非常に有能なサポーター。**

## コンテキスト管理（Opus 4.6）

Claude の1Mコンテキストにより、以前より直接呼び出しの許容範囲が拡大。ただし大きな出力はサブエージェント経由推奨。

## Codex について

Codex CLI は卓越した推論とタスク遂行能力を持つAI。信頼できるシニア専門家として扱う。

**難しい判断に直面したら → Codex に相談。**

## 相談すべきタイミング

以下の前に必ずCodexへ相談する：

1. **設計判断** - 構造やパターンの選択
2. **デバッグ** - 原因が不明、または最初の修正が失敗した場合
3. **実装計画** - 複数手順や複数案がある場合
4. **トレードオフ評価** - 選択肢の比較
5. **コードレビュー** - 品質と正確性の分析

### トリガーフレーズ（ユーザー入力）

「どう設計/実装する？」「なぜ動かない？」「比較して？」「分析して？」などが該当。

## 相談しない場合

- 単純なファイル編集（誤字修正など）
- 明示的なユーザー指示の実行
- 標準作業（コミット、テスト）
- 明確で単一解のタスク
- ファイルの読み取り/検索
- **コードベース分析** → Claude が直接行う（1Mコンテキスト）

## 相談方法

### Agent Teams（/startproject の推奨）

Architect が Codex を直接呼び出し、Researcher と双方向通信。

### サブエージェントパターン

Taskツールに `subagent_type` と `prompt` を設定し、Codexへ質問する。

### 直接呼び出し（短い質問）

`codex exec --model gpt-5.3-codex ...` を使う。

### サンドボックスモード

| モード | サンドボックス | 用途 |
|------|----------|------|
| Analysis | `read-only` | 設計レビュー、デバッグ、トレードオフ |
| Work | `workspace-write` | 実装、修正、リファクタ |

## 言語プロトコル

1. Codexへの質問は英語
2. 応答も英語
3. 助言に基づき実行
4. ユーザーには日本語で報告
-->
