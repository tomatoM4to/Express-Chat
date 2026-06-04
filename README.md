# Contact Management API

KNU Web Framework 수업 예제코드

## 프로젝트 구조

```text
.
├── app.js
├── config/
│   └── dbConnect.js
├── controllers/
│   └── contactController.js
├── middleware/
│   └── errorHandler.js
├── models/
│   └── contactModel.js
├── routers/
│   └── contactRouter.js
├── docker-compose.yml
├── package.json
└── .env
```

## 시작하기 전 준비사항

- [Node.js](https://nodejs.org/) (LTS 버전 권장)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (로컬 MongoDB 실행용)

## 설치 및 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. MongoDB 세팅 (Docker)

프로젝트에 포함된 `docker-compose.yml` 파일을 사용하여 로컬에 MongoDB를 띄웁니다.

```bash
docker-compose up -d
```

이 명령어는 다음과 같은 설정으로 MongoDB 컨테이너를 실행합니다:
- **Port:** 27017
- **Username:** admin
- **Password:** secret

### 3. 환경 변수 설정 (.env)

프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 입력합니다.

```env
MONGO_URI=mongodb://admin:secret@localhost:27017/contacts?authSource=admin
```

## 서버 실행 (개발 모드)

```bash
npm run dev
```

서버가 성공적으로 실행되면 터미널에 다음과 같은 메시지가 출력됩니다:
- `MongoDB connected successfully`
- `Server is running on port 3000`
