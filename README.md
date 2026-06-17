# 🚀 tomatoM4to Chat (Technical Documentation)

본 프로젝트는 JWT 인증, MongoDB 영속성, 그리고 Socket.io를 활용한 실시간 멘션 기능을 포함한 모단한 채팅 애플리케이션입니다.

---

## 1. API Endpoints

| Method | Endpoint | Description | Middleware |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | 로그인 페이지 (Home) | - |
| **POST** | `/` | 로그인 처리 | - |
| **GET** | `/register` | 회원가입 페이지 | - |
| **POST** | `/register` | 회원가입 처리 | - |
| **GET** | `/logout` | 로그아웃 (쿠키 삭제) | - |
| **GET** | `/rooms` | 채팅방 목록 조회 | `checkLogin` |
| **POST** | `/rooms` | 새로운 채팅방 생성 | `checkLogin` |
| **GET** | `/rooms/:id` | 특정 채팅방 입장 및 메시지 조회 | `checkLogin` |
| **DELETE** | `/rooms/:id` | 채팅방 삭제 (방장 전용) | `checkLogin` |
| **GET** | `/profile` | 내 프로필 및 채팅 기록 조회 | `checkLogin` |
| **PUT** | `/profile/password` | 비밀번호 변경 | `checkLogin` |
| **DELETE** | `/profile` | 계정 탈퇴 (연쇄 삭제) | `checkLogin` |
| **PUT** | `/profile/message/:id` | 내 메시지 수정 | `checkLogin` |
| **DELETE** | `/profile/message/:id` | 내 메시지 삭제 | `checkLogin` |
| **GET** | `/notifications` | 내 멘션 알림 목록 조회 | `checkLogin` |

---

## 2. MongoDB Schema

### 👤 User (`userModel.js`)
*   `username`: String (Unique, Alphanumeric, 3-15 chars)
*   `password`: String (Hashed via Bcrypt)

### 🏠 Room (`roomModel.js`)
*   `name`: String (Unique, 2-20 chars)
*   `owner`: ObjectId (ref: User)

### 💬 Message (`messageModel.js`)
*   `room`: ObjectId (ref: Room)
*   `sender`: ObjectId (ref: User)
*   `content`: String (Message text)
*   `timestamps`: CreatedAt, UpdatedAt

### 🔔 Notification (`notificationModel.js`)
*   `recipient`: ObjectId (ref: User)
*   `sender`: ObjectId (ref: User)
*   `room`: ObjectId (ref: Room)
*   `messageContent`: String
*   `isRead`: Boolean (Default: false)

---

## 3. Controller

*   **loginController**: 로그인/회원가입 폼 렌더링, `password-validator`를 이용한 유효성 검사, JWT 발급 및 쿠키 설정.
*   **roomController**: 방 목록 조회, 방 생성/삭제 권한 검증 및 데이터 처리.
*   **profileController**: 사용자 채팅 이력 집계, 비밀번호 변경(Bcrypt 대조), 계정 탈퇴 시 관련 데이터(메시지, 알림, 방) 연쇄 삭제 처리.
*   **notificationController**: 자신에게 온 멘션 목록 조회, 읽음 상태 업데이트 및 개별 알림 삭제 처리.

---

## 4. Middleware

*   **checkLogin.js**: 쿠키의 JWT 토큰을 검증하고 `req.user`에 사용자 정보를 주입. 미인증 시 로그인 페이지로 리다이렉트.
*   **errorHandler.js**: 애플리케이션 전역 에러 핸들러. Mongoose 중복 키 에러 및 유효성 검사 에러를 처리하며, `flash` 메시지와 함께 이전 페이지로 안전하게 리다이렉트.

---

## 5. Router

*   `loginRouter.js`: 인증 관련 엔드포인트 그룹화.
*   `roomRouter.js`: `/rooms` 경로 하위의 방 관리 기능 그룹화.
*   `profileRouter.js`: `/profile` 경로 하위의 개인 설정 기능 그룹화.
*   `notificationRouter.js`: `/notifications` 경로 하위의 알림 기능 그룹화.

---

## 6. Socket (Real-time)

*   **Events**:
    *   `registerUser`: 접속 시 유저 ID를 받아 개별 알림 룸(`user_ID`)에 조인.
    *   `joinRoom`: 특정 채팅방 룸에 조인.
    *   `chatMessage`: 메시지 수신 시 DB 저장 -> 멘션(`@username`) 파싱 -> 대상 유저에게 실시간 알림 송신 -> 해당 룸 전체에 메시지 브로드캐스트.
    *   `newNotification`: 멘션 발생 시 수신자에게 실시간 토스트 알림 트리거.

---

## 7. EJS 구성 (Views)

*   **Layouts**: `include/_header.ejs` (네비게이션 및 소켓 리스너), `include/_footer.ejs` (GitHub 링크 및 JS 번들), `include/_alerts.ejs` (공통 알림창).
*   **Pages**:
    *   `home.ejs`, `register.ejs`: 인증 화면.
    *   `rooms.ejs`: 카드 형태의 방 목록 및 생성 폼.
    *   `room.ejs`: 실시간 채팅 인터페이스 및 메시지 버블.
    *   `profile.ejs`: 탭 구조의 채팅 기록 및 계정 설정.
    *   `notifications.ejs`: 멘션 히스토리 목록.
otifications.ejs`: 멘션 히스토리 목록.
