---
name: update-design
description: Explicitly update DESIGN.md with decisions from the current conversation. Use when you want to force a design document update.
disable-model-invocation: true
---

# Update Design Document

Record/update project design and implementation decisions in `.claude/docs/DESIGN.md` based on conversation content.

> **Note**: This skill explicitly invokes the same workflow as the `design-tracker` skill.
> Use this when you want to force a design document update.

## Workflow

1. Read existing `.claude/docs/DESIGN.md`
2. Extract decisions/information from the conversation
3. Update the appropriate section
4. Add entry to Changelog with today's date

## Section Mapping

| Topic | Section |
|-------|---------|
| Goals, purpose | Overview |
| Structure, components | Architecture |
| Design patterns | Implementation Plan > Patterns |
| Library choices | Implementation Plan > Libraries |
| Decision rationale | Implementation Plan > Key Decisions |
| Future work | TODO |
| Unresolved issues | Open Questions |

## Update Format

When updating, add to the appropriate section:

```markdown
### Key Decisions

#### {Decision Title} ({Date})

**Context**: {Why this decision was needed}
**Decision**: {What was decided}
**Rationale**: {Why this option was chosen}
```

## Changelog Entry

Always add to Changelog:

```markdown
## Changelog

### {Date}
- {Brief description of what was recorded}
```

## Language

- Document content: English (technical), Japanese OK for descriptions
- User communication: Japanese

If $ARGUMENTS provided, focus on recording that content.

<!--
name: update-design
description: 現在の会話内容に基づき DESIGN.md を明示的に更新する。設計ドキュメントを強制更新したいときに使う。
disable-model-invocation: true

# 設計ドキュメント更新

会話内容から設計/実装の意思決定を `.claude/docs/DESIGN.md` に記録・更新する。

> **注**: `design-tracker` スキルと同じワークフローを明示的に実行する。

## ワークフロー

1. 既存の DESIGN.md を読む
2. 会話から意思決定/情報を抽出する
3. 該当セクションを更新する
4. 今日の日付で Changelog に追記する

## セクション対応表

| 話題 | セクション |
|------|------------|
| 目的・狙い | Overview |
| 構造・構成要素 | Architecture |
| 設計パターン | Implementation Plan > Patterns |
| ライブラリ選択 | Implementation Plan > Libraries |
| 決定理由 | Implementation Plan > Key Decisions |
| 今後の作業 | TODO |
| 未解決事項 | Open Questions |

## 更新フォーマット

意思決定を追記する際のテンプレートを示す。

## Changelog 追記

日付ごとに簡潔な記録を追加する。

## 言語

- 文書内容: 技術的には英語、説明は日本語でも可
- ユーザーへの報告: 日本語

引数 $ARGUMENTS がある場合は、その内容の記録に集中する。
-->
