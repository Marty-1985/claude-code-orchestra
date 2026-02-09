# Security Rules

Security checklist to always verify when writing code.

## Secrets Management

### Never Do

- Hardcode API keys or passwords
- Log sensitive information
- Commit `.env` files

### Required

```python
# Good: Get from environment variables
import os
API_KEY = os.environ["API_KEY"]

# Good: With existence check
API_KEY = os.environ.get("API_KEY")
if not API_KEY:
    raise ValueError("API_KEY environment variable is required")
```

## Input Validation

Always validate external input:

```python
from pydantic import BaseModel, EmailStr, Field

class UserInput(BaseModel):
    email: EmailStr
    age: int = Field(ge=0, le=150)
    name: str = Field(min_length=1, max_length=100)
```

## SQL Injection Prevention

```python
# Bad: String concatenation
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")

# Good: Parameterized query
cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
```

## XSS Prevention

- Escape user input before embedding in HTML
- Enable template engine auto-escaping

## Error Messages

```python
# Bad: Too detailed (gives attackers information)
raise Exception(f"Database connection failed: {connection_string}")

# Good: Minimal information
raise Exception("Database connection failed")
# Details go to logs (logs are private)
logger.error(f"Database connection failed: {connection_string}")
```

## Dependencies

- Regular vulnerability checks: `pip-audit`, `safety`
- Remove unused dependencies
- Pin versions (`==` over `>=`)

## Code Review Checklist

- [ ] No hardcoded secrets
- [ ] External input is validated
- [ ] SQL queries are parameterized
- [ ] Error messages are not too detailed
- [ ] Logs don't contain sensitive information

<!--
# セキュリティルール

コードを書く際に常に確認すべきセキュリティチェックリスト。

## 秘密情報の管理

### してはいけないこと

- APIキーやパスワードのハードコード
- 機密情報のログ出力
- `.env` ファイルのコミット

### 必須事項

環境変数から取得し、存在チェックを行う。

## 入力検証

外部入力は常に検証する。

## SQLインジェクション対策

文字列結合ではなく、パラメータ化クエリを使う。

## XSS対策

- HTMLへ埋め込む前にユーザー入力をエスケープ
- テンプレートの自動エスケープを有効化

## エラーメッセージ

詳細すぎる情報は出さず、詳細はログへ。

## 依存関係

- 脆弱性チェックを定期的に実施
- 未使用依存の削除
- バージョンは固定（`>=`より`==`を優先）

## コードレビューのチェックリスト

ハードコードされた秘密情報がなく、入力検証やSQLパラメータ化ができているかを確認する。
-->
