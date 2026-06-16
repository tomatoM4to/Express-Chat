- [Node.js](https://nodejs.org/) (LTS 버전 권장)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (로컬 MongoDB 실행용)

##  1. 의존성 설치

```bash
npm install
```

## 2. MongoDB 세팅 (Docker)

프로젝트에 포함된 `docker-compose.yml` 파일을 사용하여 로컬에 MongoDB를 띄웁니다.

```bash
docker-compose up -d
```

이 명령어는 다음과 같은 설정으로 MongoDB 컨테이너를 실행합니다:
- **Port:** 27017
- **Username:** admin
- **Password:** secret

## 3. 환경 변수 설정 (.env)
`~/root/.env` 생성

```env
MONGO_URI=mongodb://admin:secret@localhost:27017/myContacts?authSource=admin
```

## 서버 실행 (개발 모드)

```bash
npm run dev
```

