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
```
## アカウント設定
```
gcloud auth list
gcloud config set account `ACCOUNT`
```