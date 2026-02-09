# settings.json 日本語訳

このファイルは `.gemini/settings.json` の内容を日本語で説明したもの（設定自体には影響しない）。

## model

- `name`: 使用モデル名（`gemini-3-pro-preview`）

## context

- `fileName`: 参照するファイル名（`GEMINI.md`, `AGENTS.md`）
- `discoveryMaxDirs`: 探索する最大ディレクトリ数
- `fileFiltering`:
  - `respectGitIgnore`: `.gitignore` を尊重
  - `respectGeminiIgnore`: `.geminiignore` を尊重

## tools

- `sandbox`: サンドボックス無効
- `autoAccept`: 自動承認無効

## experimental

- `skills`: スキル機能を有効化
- `enableAgents`: エージェント機能を有効化

## skills

- `disabled`: 無効化スキルのリスト（空なら無効なし）
