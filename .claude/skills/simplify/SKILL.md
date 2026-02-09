---
name: simplify
description: Simplify and refactor code while preserving functionality and library constraints.
disable-model-invocation: true
---

# Simplify Code

Simplify and refactor $ARGUMENTS.

## Simplification Principles

1. **Single Responsibility** - 1 function = 1 thing
2. **Short Functions** - Target under 20 lines
3. **Shallow Nesting** - Early return, depth ≤ 2
4. **Clear Naming** - Clear enough to not need comments
5. **Type Hints Required** - On all functions

## Steps

### 1. Analyze Target Code

- Read the file(s) to understand current structure
- Identify complexity hotspots (deep nesting, long functions)
- List functions/classes to simplify

### 2. Check Library Constraints

- Identify libraries used in target code
- Check constraints in `.claude/docs/libraries/`
- Web search for unclear library behaviors

### 3. Plan Refactoring

For each complexity issue:
- What change to make
- Why it improves readability
- Verify it doesn't break library usage

### 4. Execute Refactoring

Apply changes following these patterns:

**Early Return:**
```python
# Before
def process(value):
    if value is not None:
        if value > 0:
            return do_something(value)
    return None

# After
def process(value):
    if value is None:
        return None
    if value <= 0:
        return None
    return do_something(value)
```

**Extract Function:**
```python
# Before
def main():
    # 50 lines of mixed concerns
    ...

# After
def main():
    data = load_data()
    result = process_data(data)
    save_result(result)
```

### 5. Verify with Tests

```bash
uv run pytest -v
```

## Notes

- Always preserve library features/constraints
- Web search for unclear points
- Don't change behavior (refactoring only)
- Run tests after each significant change

<!--
name: simplify
description: 既存コードを簡潔に整理するリファクタリング用スキル。

概要: 振る舞いを変えずに可読性を高める。機能は維持し、複雑さを減らす。

ガイド:
- ライブラリの仕様や制約は保持する
- 不明点はWeb検索
- 挙動変更は避ける（リファクタのみ）
- 大きな変更ごとにテストを実行
-->
