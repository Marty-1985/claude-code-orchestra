# settings.json 日本語訳

このファイルは `.claude/settings.json` の内容を日本語で説明したもの（設定自体には影響しない）。

## 全体

- `$schema`: 設定ファイルのスキーマURL
- `language`: 日本語
- `effortLevel`: high（高い努力レベル）
- `fastMode`: false（高速モード無効）
- `alwaysThinkingEnabled`: true（常に思考を有効化）

## hooks

各イベントで実行するフック（コマンド）を定義：

- `UserPromptSubmit`: ユーザー入力送信時に `agent-router.py` を実行
- `PreToolUse`:
  - Edit/Write 前に `check-codex-before-write.py` を実行
  - WebSearch/WebFetch 前に `suggest-gemini-research.py` を実行
- `TeammateIdle`: チームメイトが待機状態になったらタスク確認を促す
- `TaskCompleted`: タスク完了後に CLI ツールログ記録
- `PreCompact`: コンテキスト圧縮前に追加情報を出力
- `PostToolUse`:
  - Task 後に `check-codex-after-plan.py` を実行
  - Bash 後に `error-to-codex.py` と `post-test-analysis.py` と `log-cli-tools.py`
  - Edit/Write 後に `lint-on-save.py` と `post-implementation-review.py`

## permissions

許可/拒否する操作を定義。広範な Read/Edit/Write/Glob/Grep などを許可し、
秘密情報（`.env`、鍵、認証情報）や危険な削除操作を拒否。

## env

環境変数の設定：

- `EDITOR`: `code --wait`
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`: `1`（Agent Teams 有効）
- `CLAUDE_CODE_SUBAGENT_MODEL`: `claude-opus-4-6`
