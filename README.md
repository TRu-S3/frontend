# 環境構築
## bun
```
bun install
```

## docker
```
docker build -t nextjs-docker .
docker run -p 3000:3000 nextjs-docker
```

# GCP
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