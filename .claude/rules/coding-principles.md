# Coding Principles

Core coding rules to always follow.

## Simplicity First

- Choose readable code over complex code
- Avoid over-abstraction
- Prioritize "understandable" over "working"

## Single Responsibility

- One function does one thing only
- One class has one responsibility only
- Target 200-400 lines per file (max 800)

## Early Return

```python
# Bad: Deep nesting
def process(value):
    if value is not None:
        if value > 0:
            return do_something(value)
    return None

# Good: Early return
def process(value):
    if value is None:
        return None
    if value <= 0:
        return None
    return do_something(value)
```

## Type Hints Required

All functions must have type annotations:

```python
def call_llm(
    prompt: str,
    model: str = "gpt-4",
    max_tokens: int = 1000
) -> str:
    ...
```

## Immutability

Create new objects instead of mutating existing ones:

```python
# Bad: Mutating existing object
data["new_key"] = value

# Good: Creating new object
new_data = {**data, "new_key": value}
```

## Naming Conventions

- **Variables/Functions**: snake_case (English)
- **Classes**: PascalCase (English)
- **Constants**: UPPER_SNAKE_CASE (English)
- **Meaningful names**: `user_count` over `x`

## No Magic Numbers

```python
# Bad
if retry_count > 3:
    ...

# Good
MAX_RETRIES = 3
if retry_count > MAX_RETRIES:
    ...

<!--
# コーディング原則

常に守るべきコアとなるコーディングルール。

## シンプルさ最優先

- 複雑なコードより読みやすいコードを選ぶ
- 過度な抽象化を避ける
- 「動く」より「理解できる」を優先する

## 単一責任

- 1つの関数は1つのことだけを行う
- 1つのクラスは1つの責任だけを持つ
- 1ファイルは200〜400行を目安（最大800行）

## 早期リターン

ネストを深くせず、条件に合わない場合は早めに戻る。

## 型ヒント必須

すべての関数に型注釈を付ける。

## 不変性

既存オブジェクトを直接変更せず、新しいオブジェクトを作る。

## 命名規則

- 変数/関数: 英語のスネークケース
- クラス: 英語のパスカルケース
- 定数: 英語の大文字スネークケース
- 意味のある名前を使う

## マジックナンバー禁止

数値リテラルではなく意味のある定数名を使う。
-->
```
