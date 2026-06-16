# 🚀 tomatoM4to Chat (Real-time Chat App)

본 프로젝트는 기존의 단순 CRUD 애플리케이션을 대규모 리팩토링하여 구현한 **JWT 기반의 실시간 채팅 서비스**입니다. Socket.io를 활용한 실시간 통신, MongoDB를 이용한 데이터 영속성, 그리고 사용자 경험을 극대화한 현대적인 UI/UX를 특징으로 합니다.

---

## 1. 프로젝트 개요 (Overview)

*   **목적**: 안정적인 실시간 소통 환경 제공 및 사용자 간 인터랙션(멘션/알림) 강화
*   **핵심 가치**: 보안(JWT), 실시간성(WebSocket), 확장성(NoSQL), 직관성(Bootstrap 5)
*   **개발 기간**: 2026년 6월 (리팩토링 프로젝트)

---

## 2. 주요 기능 (Key Features)

### 🔐 인증 및 보안 (Authentication)
*   **JWT 기반 로그인**: 쿠키를 이용한 안전한 토큰 관리.
*   **강력한 보안 정책**: `password-validator`를 이용한 비밀번호 복잡성 검사 및 `bcrypt` 단방향 해싱 저장.
*   **접근 제어**: 로그인 여부에 따른 라우팅 보호 및 리다이렉션 처리.

### 💬 실시간 채팅 (Real-time Chat)
*   **채팅방 관리**: 누구나 방을 생성할 수 있으며, 방장(개설자)은 방을 삭제할 수 있는 권한 부여.
*   **Socket.io 통합**: 별도의 새로고침 없이 실시간 메시지 송수신.
*   **영구 저장**: 모든 대화 내용은 MongoDB에 저장되어 추후 재접속 시에도 확인 가능.

### 🔔 멘션 및 알림 시스템 (Mentions & Notifications)
*   **사용자 언급**: `@username` 형식을 통해 특정 사용자를 호출.
*   **실시간 토스트 알림**: 언급된 사용자에게 즉각적인 Bootstrap Toast 알림 전송.
*   **내비게이션 배지**: 읽지 않은 알림 개수를 실시간으로 표시하는 Badge 시스템.

### 👤 프로필 및 활동 관리 (Account Management)
*   **내 채팅 기록**: 내가 작성한 모든 메시지를 한눈에 확인하고 수정/삭제(CRUD).
*   **계정 설정**: 현재 비밀번호 확인을 통한 안전한 비밀번호 변경 및 계정 영구 탈퇴 기능.

---

## 3. 기술 스택 (Technical Stack)

| 구분 | 기술 |
| :--- | :--- |
| **Backend** | Node.js, Express.js (v5.2.1) |
| **Database** | MongoDB (Atlas), Mongoose (v9.4.1) |
| **Real-time** | Socket.io (v4.8.1) |
| **Frontend** | EJS (v6.0.1), Bootstrap 5.3, Font Awesome 6 |
| **Auth** | JSON Web Token (v9.0.3), Bcrypt (v6.0.0) |
| **Environment** | Dotenv, Express-session, Connect-flash |

---

## 4. 데이터베이스 설계 (Data Schema)

### User (사용자)
- `username`: 유니크한 아이디 (영문, 숫자, _ 허용)
- `password`: 암호화된 비밀번호

### Room (채팅방)
- `name`: 방 이름 (유니크)
- `owner`: 개설자 (User 참조)

### Message (메시지)
- `room`: 소속 방 (Room 참조)
- `sender`: 작성자 (User 참조)
- `content`: 메시지 내용

### Notification (알림)
- `recipient`: 수신자 (User 참조)
- `sender`: 발신자 (User 참조)
- `messageContent`: 언급된 원문 내용
- `isRead`: 읽음 여부 (Boolean)

---

## 5. 설치 및 실행 (Installation)

### 로컬 환경 설정
1. 저장소 클론: `git clone <repository-url>`
2. 패키지 설치: `npm install`
3. `.env` 파일 설정:
   ```env
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_random_secret_key
   PORT=3000
   ```
4. 서버 실행: `npm run dev` (Nodemon 기반)

### 배포 (Deployment - Render/Heroku)
*   본 프로젝트는 `process.env.PORT`를 지원하므로 클라우드 환경에서 포트 충돌 없이 작동합니다.
*   배포 시 환경 변수(`MONGO_URI`, `JWT_SECRET`)를 대시보드에 반드시 등록해야 합니다.

---

## 6. 에러 핸들링 및 예외 처리

*   **중앙 집중식 에러 핸들러**: 모든 컨트롤러의 에러는 `middleware/errorHandler.js`에서 통합 처리됩니다.
*   **사용자 피드백**: 중복 ID, 잘못된 비밀번호, 권한 부족 등의 에러는 리다이렉트 후 **Bootstrap Alert**를 통해 한국어로 안내됩니다.
*   **안전한 리다이렉트**: `Referer` 헤더 감지를 통해 `Cannot GET /back` 오류를 원천 차단합니다.

---

## 7. 라이선스 및 오픈소스

*   **License**: ISC
*   **Repository**: [GitHub 저장소 바로가기](https://github.com/tomatoM4to/Express-example-code)

---
*© 2026 tomatoM4to Chat Project - All Rights Reserved.*
