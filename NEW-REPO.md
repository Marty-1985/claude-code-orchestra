# ① 元リポジトリをclone
git clone -b <ブランチ名> --single-branch https://github.com/you/original.git <ディレクトリ名>
cd <ディレクトリ名>

# ② 対象ブランチに切り替え
git checkout <ブランチ名>

# ③ remoteを削除
git remote remove origin

# ④ 新リポジトリを登録
git remote add origin https://github.com/you/new-repo.git

# ⑤ mainにリネーム
git branch -M main

# ⑥ push
git push -u origin main
