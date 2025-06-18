# 環境構築
## local
```
npm install
npm run dev
```

# GCPにログイン
```
gcloud auth application-default login
gcloud config set project <project_id>
```

## アカウント設定
```
gcloud auth list
gcloud config set account `ACCOUNT`
```

## 確認
```
gcloud config list
```

## docker
※基本localではnpm i, npm run devで良い
```
docker build -t nextjs-docker .
docker run -p 3000:3000 nextjs-docker
```