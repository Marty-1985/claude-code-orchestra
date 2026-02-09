# Gemini Delegation Rule

**Gemini CLI is your external information and multimodal specialist.**

## Role Change (Opus 4.6)

> **重要**: Claude 自身が 1M トークンのコンテキストを持つため、コードベース分析は Claude が直接行う。
> Gemini の役割は「外部情報の取得」と「マルチモーダル処理」に特化した。

| Task | Before (Opus 4.5) | After (Opus 4.6) |
|------|-------------------|-------------------|
| コードベース分析 | Gemini | **Claude 直接** |
| ライブラリ調査 | Gemini | Gemini (外部Web検索) |
| 最新ドキュメント検索 | Gemini | Gemini (Google Search) |
| マルチモーダル | Gemini | Gemini (変更なし) |
| 設計判断 | Codex | Codex (変更なし) |

## Context Management

| 状況 | 推奨方法 |
|------|----------|
| 短い質問・短い回答 | 直接呼び出しOK |
| ライブラリ調査 | サブエージェント経由（出力が大きい場合） |
| マルチモーダル処理 | サブエージェント経由 |
| Agent Teams 内での調査 | Teammate が直接呼び出し |

## About Gemini

Gemini CLI excels at:
- **Google Search grounding** — Access latest information, official docs
- **Multimodal processing** — Video, audio, PDF analysis
- **Web research** — Library comparison, best practices, API specs

**Gemini does NOT excel at** (use Claude/Codex instead):
- Codebase analysis (Claude has 1M context now)
- Design decisions (Codex)
- Debugging (Codex)
- Code implementation (Claude)

## When to Consult Gemini

ALWAYS consult Gemini for:

1. **External information** - Latest docs, library updates, API specs
2. **Library research** - Comparison, best practices, known issues
3. **Multimodal tasks** - Video, audio, PDF content extraction

### Trigger Phrases (User Input)

| Japanese | English |
|----------|---------|
| 「調べて」「リサーチして」「調査して」 | "Research" "Investigate" "Look up" |
| 「このPDF/動画/音声を見て」 | "Analyze this PDF/video/audio" |
| 「最新のドキュメントを確認して」 | "Check the latest documentation" |
| 「〜について情報を集めて」 | "Gather information about X" |

## When NOT to Consult

Skip Gemini for:

- **コードベース分析** → Claude が 1M コンテキストで直接読む
- Design decisions → Codex
- Debugging → Codex
- Code implementation → Claude
- Simple file operations → Claude

## How to Consult

### In Agent Teams (Preferred for /startproject)

Researcher Teammate が Gemini を直接呼び出し、Architect Teammate と双方向通信する。

### Subagent Pattern (For standalone research)

```
Task tool parameters:
- subagent_type: "general-purpose"
- run_in_background: true (for parallel work)
- prompt: |
    Research: {topic}

    gemini -p "{research question}" 2>/dev/null

    Save full output to: .claude/docs/research/{topic}.md
    Return CONCISE summary (5-7 bullet points).
```

### Direct Call (Short Questions Only)

```bash
gemini -p "Brief question" 2>/dev/null
```

## CLI Commands Reference

```bash
# External research
gemini -p "{question}" 2>/dev/null

# Multimodal
gemini -p "{prompt}" < /path/to/file.pdf 2>/dev/null

# JSON output
gemini -p "{question}" --output-format json 2>/dev/null
```

**Note**: `--include-directories .` is no longer needed for codebase analysis — Claude handles this directly.

## Language Protocol

1. Ask Gemini in **English**
2. Receive response in **English**
3. Subagent/Teammate summarizes and saves full output
4. Main reports to user in **Japanese**

<!--
# Gemini 委任ルール

**Gemini CLI は外部情報とマルチモーダル処理の専門家。**

## 役割変更（Opus 4.6）

Claude が 1M コンテキストを持つため、コードベース分析は Claude が直接行う。Gemini は外部情報取得とマルチモーダル処理に特化。

## コンテキスト管理

短い質問は直接、ライブラリ調査やマルチモーダル処理はサブエージェント経由、Agent Teams では Teammate が直接呼び出す。

## Gemini について

Gemini CLI が得意なこと：
- **Google Search 連携** — 最新情報・公式ドキュメント取得
- **マルチモーダル処理** — 動画/音声/PDF解析
- **Webリサーチ** — ライブラリ比較、ベストプラクティス、API仕様

**Gemini が得意でないこと**（Claude/Codex を使う）：
- コードベース分析（Claude）
- 設計判断（Codex）
- デバッグ（Codex）
- 実装（Claude）

## Gemini へ相談するタイミング

1. **外部情報** - 最新ドキュメント、ライブラリ更新、API仕様
2. **ライブラリ調査** - 比較、ベストプラクティス、既知の問題
3. **マルチモーダル** - 動画/音声/PDFの内容抽出

### トリガーフレーズ

「調べて」「リサーチして」「PDF/動画/音声を見て」「最新ドキュメント確認」など。

## 相談しない場合

- コードベース分析 → Claude
- 設計判断 → Codex
- デバッグ → Codex
- 実装 → Claude
- 単純なファイル操作 → Claude

## 相談方法

### Agent Teams

Researcher が Gemini を直接呼び出し、Architect と双方向通信。

### サブエージェントパターン

Taskツールの `prompt` に調査内容を指定し、結果は `.claude/docs/research/{topic}.md` に保存、要約を返す。

### 直接呼び出し

短い質問は `gemini -p` を使う。

## CLIコマンド参照

外部調査、マルチモーダル、JSON出力の例を示す。

**注**: `--include-directories .` は不要（コードベース分析は Claude が担当）。

## 言語プロトコル

1. Geminiへの質問は英語
2. 応答も英語
3. サブエージェント/Teammate が要約と保存
4. ユーザーには日本語で報告
-->
