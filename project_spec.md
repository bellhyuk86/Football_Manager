# ⚽ Tactify FC — 프로젝트 기획 명세서
> 동호회 축구팀 관리 웹 앱 | Next.js + PostgreSQL

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 대상 사용자 | 동호회 축구팀 (감독, 코치, 선수) |
| 플랫폼 | 웹 (Next.js) |
| 프론트엔드 | Next.js (App Router), TypeScript, SASS, Zustand, React Hook Form |
| 백엔드 | Express, TypeScript, Prisma ORM |
| DB | PostgreSQL |
| ID 전략 | UUID (모든 테이블 PK) |
| 인증 방식 | JWT 토큰 (아이디/비밀번호 로그인, 소셜 로그인은 추후 추가 예정) |

---

## 2. 권한 구조

3단계 권한으로 구성: **감독 / 코치 / 선수**

| 기능 | 감독 | 코치 | 선수 |
|---|:---:|:---:|:---:|
| 선수 등록 / 수정 / 삭제 | ✅ | ✅ | ❌ |
| 포메이션 등록 / 편집 | ✅ | ✅ | ❌ |
| 스케줄 등록 / 수정 | ✅ | ✅ | ❌ |
| 선수 / 포메이션 / 스케줄 조회 | ✅ | ✅ | ✅ |
| 팀원 권한 변경 | ✅ | ❌ | ❌ |
| 팀 정보 수정 | ✅ | ❌ | ❌ |
| 팀원 초대 (초대코드 발급) | ✅ | ✅ | ❌ |

---

## 3. 페이지별 기능 명세

### 3-1. 로그인 페이지

- 아이디 / 비밀번호 로그인 (소셜 로그인은 추후 개발 예정)
- 비밀번호 입력 시 Caps Lock 활성화 여부를 화면에 표시
- 아이디 기억하기 기능

#### 아이디 찾기 모달
- 이름 + 이메일 입력 → 일치하는 아이디 표시 (일부 마스킹 처리, 예: `li**lee`)

#### 비밀번호 찾기 모달
- 아이디 + 이메일 입력 → 비밀번호 재설정 링크 발송
- 링크 클릭 시 비밀번호 재설정 페이지로 이동 (별도 페이지)

---

### 3-2. 회원가입 페이지

#### 입력 필드
- 이름, 아이디 (영문+숫자 조합, 중복 불가), 이메일 (인증 수단으로만 사용), 비밀번호, 비밀번호 확인
- 역할 선택: 감독 / 코치 / 선수 (단일 선택)

#### 역할에 따른 동적 필드

| 역할 | 추가 입력 필드 | 동작 |
|---|---|---|
| 감독 | 팀명 입력 input 표시 | 가입 완료 시 새 팀 생성 + 초대코드 자동 발급 |
| 코치 / 선수 | 초대코드 입력 input 표시 | 코드 유효성 검증 후 해당 팀에 자동 소속 |

#### 가입 완료 처리
- 감독: 팀 생성 완료 모달에 초대코드를 노출하여 팀원에게 공유 가능하게 처리
- 코치 / 선수: "정상 가입되었습니다" 모달 → 확인 클릭 → Home 이동
- 유효하지 않은 초대코드 입력 시 에러 메시지 노출

---

### 3-3. Home 페이지

- 인터랙티브 소개 페이지로 확정 (다크 + 스포티 분위기)
- 스크롤 진입 시 각 섹션이 슬라이드인 애니메이션으로 등장
- 비로그인 사용자 대상 앱 소개 및 가입 유도 페이지

#### 섹션 구성 (총 4개)

| 순서 | 섹션명 | 주요 내용 |
|---|---|---|
| 1 | Hero | 피치 그래픽, 메인 카피, 시작하기 / 로그인 CTA 버튼 |
| 2 | 선수 관리 | 기능 4개 카드 (포지션 필터, 6각형 능력치 차트, 권한 관리, 미가입 선수 등록) |
| 3 | 포메이션 | 4단계 플로우 카드 (출전명단 등록 → 경기장 배치 → 드로잉 → 저장 & 스케줄 연동) |
| 4 | CTA | 초대코드 예시 노출, 팀 만들기 버튼 |

#### 공통 GNB (비로그인)
- 로고(Tactify FC), 기능 / 포메이션 / 스케줄 앵커 링크, 시작하기 버튼
- 로그인 후 접근 시 `/players`로 리다이렉트

---

### 3-4. 선수 등록 페이지

- 선수 등록 기능 (선수명, 포지션, 능력치 입력)
- 선수 리스트를 카드 형태로 표시
- 포지션별 필터링 기능
- 능력치 시각화: 6각형 레이더 차트 (확정)
  - 항목: 속도(speed), 슛(shooting), 패스(passing), 드리블(dribbling), 수비(defending), 체력(physical)
  - 범위: 각 0~100
  - 선수 카드 및 마이페이지 내 선수 정보 섹션에 동일하게 적용
- 선수 수정 및 삭제 기능
- 권한: 감독 / 코치만 등록·수정·삭제 가능, 선수는 조회만 가능

---

### 3-5. 포메이션 등록 페이지

#### 레이아웃 구성
- 좌측: 선수 리스트 패널 (탭: 출전명단 / 포메이션)
- 우측: 경기장 영역 (드래그 앤 드롭으로 선수 배치)

#### 출전명단 탭
- 선발선수 / 교체선수 두 영역으로 구성
- 출전선수 등록 시 모달 오픈 → 포지션별 선수 목록 표시 → 체크박스로 선택
- 등록된 출전선수는 자동으로 선발선수 영역에 배치
- 선발 ↔ 교체 이동은 드래그 앤 드롭으로 처리

#### 경기장 영역
- 선수를 드래그해서 경기장 위에 위치 지정
- 편집 모드: 펜 버튼 클릭 시 직접 드로잉 가능 (선, 그림, 텍스트 작성)
- 캡처 버튼: 경기장 영역만 캡처하여 저장
- 편집 / 캡처 버튼은 경기장 영역 상단에 위치

#### 포메이션 저장
- 저장 시 필수값: 포메이션 제목, 경기 날짜
- 저장된 포메이션은 선수 등록 페이지의 "포메이션 리스트" 탭에서 조회
- 권한: 감독 / 코치만 편집 및 저장 가능

---

### 3-6. 스케줄 관리 페이지

- 달력 UI로 일정 관리
- 날짜 클릭 시 모달 오픈: 일정 제목, 경기 시간, 경기장, 기타사항 입력
- 저장된 일정 클릭 시 해당 날짜의 포메이션 리스트도 함께 표시
- 포메이션 클릭 시 별도 모달에서 포메이션 상세 조회
- 일정 상세 내용은 달력 하단 또는 우측에 위치
- 권한: 감독 / 코치만 등록·수정 가능, 선수는 조회만 가능

---

### 3-7. 마이페이지

#### 기본 프로필
- 이름, 아이디, 이메일, 프로필 사진
- 소속 팀명, 역할(권한) 표시
- 비밀번호 변경

#### 나의 선수 정보 (선수 권한)
- 선수 등록 페이지에서 등록된 내 선수 카드 바로 보기
- 내 능력치 확인

#### 팀 관리 (감독 권한)
- 초대코드 확인 및 재발급
- 팀원 목록 조회 및 권한 변경
- 팀 정보 수정 (팀명 등)

#### 공통
- 로그아웃
- 회원 탈퇴

---

## 4. 초대코드 플로우

- 초대코드 형식: `FC-XXXXXX` (랜덤 6자리 영문/숫자 조합)
- 감독 가입 완료 시 자동 발급
- 마이페이지 → 팀 관리에서 언제든지 확인 가능 (감독만)
- 보안 필요 시 재발급 가능 (기존 코드 즉시 무효화)
- 유효하지 않은 코드 입력 시 회원가입 불가 + 에러 메시지 표시

---

## 5. 데이터 모델링 (PostgreSQL)

> 모든 테이블의 PK는 UUID 형태 (`@default(uuid())`)로 생성됩니다.

### 5-1. teams
| 컬럼명 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | UUID | PK, DEFAULT uuid() | 고유 식별자 |
| name | VARCHAR(100) | NOT NULL | 팀명 |
| invite_code | VARCHAR(20) | UNIQUE, NOT NULL | 초대코드 (FC-XXXXXX) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT now() | 생성일 |
| updated_at | TIMESTAMP | NOT NULL, AUTO UPDATE | 수정일 |

---

### 5-2. users
| 컬럼명 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | UUID | PK, DEFAULT uuid() | 고유 식별자 |
| team_id | UUID | FK(teams.id), NULL | 소속 팀 |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 아이디 (영문+숫자) |
| name | VARCHAR(50) | NOT NULL | 실명 |
| email | VARCHAR(100) | UNIQUE, NOT NULL | 이메일 (인증 수단) |
| password | VARCHAR(255) | NOT NULL | 암호화된 비밀번호 |
| role | ENUM('manager','coach','player') | NOT NULL | 권한 |
| provider | VARCHAR(20) | DEFAULT 'local' | 로그인 방식 (소셜 로그인 확장 대비) |
| profile_image | VARCHAR(255) | NULL | 프로필 사진 경로 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT now() | 가입일 |
| updated_at | TIMESTAMP | NOT NULL, AUTO UPDATE | 수정일 |

---

### 5-3. players
| 컬럼명 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | UUID | PK, DEFAULT uuid() | 고유 식별자 |
| team_id | UUID | FK(teams.id), NOT NULL | 소속 팀 |
| user_id | UUID | FK(users.id), UNIQUE, NULL | 연결된 유저 (미가입 선수는 NULL) |
| name | VARCHAR(50) | NOT NULL | 선수명 |
| position | ENUM('GK','DF','MF','FW') | NOT NULL | 포지션 |
| speed | SMALLINT | NOT NULL DEFAULT 50 | 속도 (0~100) |
| shooting | SMALLINT | NOT NULL DEFAULT 50 | 슛 (0~100) |
| passing | SMALLINT | NOT NULL DEFAULT 50 | 패스 (0~100) |
| dribbling | SMALLINT | NOT NULL DEFAULT 50 | 드리블 (0~100) |
| defending | SMALLINT | NOT NULL DEFAULT 50 | 수비 (0~100) |
| physical | SMALLINT | NOT NULL DEFAULT 50 | 체력 (0~100) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT now() | 등록일 |
| updated_at | TIMESTAMP | NOT NULL, AUTO UPDATE | 수정일 |

---

### 5-4. formations
| 컬럼명 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | UUID | PK, DEFAULT uuid() | 고유 식별자 |
| team_id | UUID | FK(teams.id), NOT NULL | 소속 팀 |
| created_by | UUID | FK(users.id), NOT NULL | 작성자 |
| title | VARCHAR(100) | NOT NULL | 포메이션 제목 |
| match_date | DATE | NOT NULL | 경기 날짜 |
| placement_data | JSON | NOT NULL | 선수 배치 + 드로잉 데이터 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT now() | 생성일 |
| updated_at | TIMESTAMP | NOT NULL, AUTO UPDATE | 수정일 |

`placement_data` JSON 구조 예시:
```json
{
  "players": [
    { "player_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "x": 45.2, "y": 30.1 },
    { "player_id": "c3d4e5f6-a7b8-9012-cdef-123456789012", "x": 20.0, "y": 60.5 }
  ],
  "drawing": [
    { "type": "line", "points": [[10,20],[30,40]], "color": "#ff0000" },
    { "type": "text", "x": 50, "y": 50, "content": "압박!" }
  ]
}
```

---

### 5-5. formation_players
| 컬럼명 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | UUID | PK, DEFAULT uuid() | 고유 식별자 |
| formation_id | UUID | FK(formations.id), NOT NULL, ON DELETE CASCADE | 포메이션 |
| player_id | UUID | FK(players.id), NOT NULL | 선수 |
| type | ENUM('starter','substitute') | NOT NULL | 선발 / 교체 구분 |

---

### 5-6. schedules
| 컬럼명 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | UUID | PK, DEFAULT uuid() | 고유 식별자 |
| team_id | UUID | FK(teams.id), NOT NULL | 소속 팀 |
| created_by | UUID | FK(users.id), NOT NULL | 작성자 |
| title | VARCHAR(100) | NOT NULL | 일정 제목 |
| match_date | DATE | NOT NULL | 경기 날짜 |
| match_time | TIME | NULL | 경기 시간 |
| location | VARCHAR(200) | NULL | 경기장 |
| note | TEXT | NULL | 기타사항 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT now() | 생성일 |
| updated_at | TIMESTAMP | NOT NULL, AUTO UPDATE | 수정일 |

---

### 5-7. 테이블 관계 요약

```
teams
 ├── users (team_id)
 ├── players (team_id)
 │    └── users (user_id, NULL 허용)
 ├── formations (team_id)
 │    ├── formation_players (formation_id)
 │    │    └── players (player_id)
 │    └── users (created_by)
 └── schedules (team_id)
      └── users (created_by)
```

---

### 5-8. 확장성 고려 사항

| 향후 기능 | 대응 방식 |
|---|---|
| 소셜 로그인 추가 | users.provider 컬럼으로 대응 가능 |
| 경기 결과 기록 | schedules에 score 컬럼 추가 또는 match_results 테이블 추가 |
| 선수 출전 기록 통계 | formation_players 기반으로 집계 쿼리 가능 |
| 다중 팀 소속 | users ↔ teams 중간 테이블(user_teams)로 확장 가능 |
| 공지사항 / 채팅 | notices, messages 테이블 독립 추가 |

---

## 6. API 설계

### 기본 규칙
- Base URL: `/api`
- 인증: JWT 토큰 방식 (Authorization 헤더)
- 권한 표기: 🔓 비로그인 가능 / 🔒 로그인 필요 / 👑 감독만 / 🎯 감독·코치만

---

### 6-1. 인증 (Auth)

| 메서드 | 엔드포인트 | 권한 | 설명 |
|---|---|:---:|---|
| POST | `/api/auth/register` | 🔓 | 회원가입 |
| POST | `/api/auth/login` | 🔓 | 로그인 |
| POST | `/api/auth/logout` | 🔒 | 로그아웃 |
| POST | `/api/auth/find-username` | 🔓 | 아이디 찾기 (이름 + 이메일) |
| POST | `/api/auth/find-password` | 🔓 | 비밀번호 재설정 메일 발송 |
| PATCH | `/api/auth/reset-password` | 🔓 | 비밀번호 재설정 (토큰 검증) |

---

### 6-2. 팀 (Teams)

| 메서드 | 엔드포인트 | 권한 | 설명 |
|---|---|:---:|---|
| GET | `/api/teams/me` | 🔒 | 내 팀 정보 조회 |
| PATCH | `/api/teams/me` | 👑 | 팀 정보 수정 (팀명 등) |
| GET | `/api/teams/me/invite-code` | 👑 | 초대코드 조회 |
| PATCH | `/api/teams/me/invite-code` | 👑 | 초대코드 재발급 |
| POST | `/api/teams/verify-invite-code` | 🔓 | 초대코드 유효성 검증 (회원가입 시) |

---

### 6-3. 유저 (Users)

| 메서드 | 엔드포인트 | 권한 | 설명 |
|---|---|:---:|---|
| GET | `/api/users/me` | 🔒 | 내 프로필 조회 |
| PATCH | `/api/users/me` | 🔒 | 내 프로필 수정 (이름, 프로필 사진) |
| PATCH | `/api/users/me/password` | 🔒 | 비밀번호 변경 |
| DELETE | `/api/users/me` | 🔒 | 회원 탈퇴 |
| GET | `/api/users/team-members` | 🔒 | 팀원 목록 조회 |
| PATCH | `/api/users/:id/role` | 👑 | 팀원 권한 변경 |

---

### 6-4. 선수 (Players)

| 메서드 | 엔드포인트 | 권한 | 설명 |
|---|---|:---:|---|
| GET | `/api/players` | 🔒 | 선수 목록 조회 (포지션 필터 가능) |
| POST | `/api/players` | 🎯 | 선수 등록 |
| GET | `/api/players/:id` | 🔒 | 선수 상세 조회 |
| PATCH | `/api/players/:id` | 🎯 | 선수 수정 |
| DELETE | `/api/players/:id` | 🎯 | 선수 삭제 |

Request/Response 예시:
```json
// POST /api/players Request
{
  "name": "김철수",
  "position": "MF",
  "speed": 80,
  "shooting": 70,
  "passing": 85,
  "dribbling": 75,
  "defending": 60,
  "physical": 78
}

// Response 201
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "teamId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "userId": null,
  "name": "김철수",
  "position": "MF",
  "speed": 80,
  "shooting": 70,
  "passing": 85,
  "dribbling": 75,
  "defending": 60,
  "physical": 78,
  "createdAt": "2026-04-02T00:00:00Z"
}
```

---

### 6-5. 포메이션 (Formations)

| 메서드 | 엔드포인트 | 권한 | 설명 |
|---|---|:---:|---|
| GET | `/api/formations` | 🔒 | 포메이션 목록 조회 |
| POST | `/api/formations` | 🎯 | 포메이션 저장 |
| GET | `/api/formations/:id` | 🔒 | 포메이션 상세 조회 |
| PATCH | `/api/formations/:id` | 🎯 | 포메이션 수정 |
| DELETE | `/api/formations/:id` | 🎯 | 포메이션 삭제 |
| GET | `/api/formations?match_date=YYYY-MM-DD` | 🔒 | 날짜별 포메이션 조회 (스케줄 연동) |

Request/Response 예시:
```json
// POST /api/formations Request
{
  "title": "4-3-3 압박 전술",
  "match_date": "2026-04-10",
  "placement_data": {
    "players": [
      { "player_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "x": 45.2, "y": 10.0 },
      { "player_id": "c3d4e5f6-a7b8-9012-cdef-123456789012", "x": 20.0, "y": 40.0 }
    ],
    "drawing": [
      { "type": "line", "points": [[10,20],[30,40]], "color": "#ff0000" },
      { "type": "text", "x": 50, "y": 50, "content": "압박!" }
    ]
  },
  "players": [
    { "player_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "type": "starter" },
    { "player_id": "c3d4e5f6-a7b8-9012-cdef-123456789012", "type": "substitute" }
  ]
}
```

---

### 6-6. 스케줄 (Schedules)

| 메서드 | 엔드포인트 | 권한 | 설명 |
|---|---|:---:|---|
| GET | `/api/schedules` | 🔒 | 스케줄 목록 조회 |
| POST | `/api/schedules` | 🎯 | 스케줄 등록 |
| GET | `/api/schedules/:id` | 🔒 | 스케줄 상세 조회 (해당 날짜 포메이션 포함) |
| PATCH | `/api/schedules/:id` | 🎯 | 스케줄 수정 |
| DELETE | `/api/schedules/:id` | 🎯 | 스케줄 삭제 |

Response 예시:
```json
// GET /api/schedules/:id
{
  "id": "d4e5f6a7-b8c9-0123-defg-456789012345",
  "title": "FC 한강전",
  "matchDate": "2026-04-10",
  "matchTime": "14:00",
  "location": "잠실 운동장",
  "note": "집합 시간 13:00",
  "formations": [
    { "id": "e5f6a7b8-c9d0-1234-efgh-567890123456", "title": "4-3-3 압박 전술" },
    { "id": "f6a7b8c9-d0e1-2345-fghi-678901234567", "title": "수비 전술" }
  ]
}
```

---

## 7. UI/UX 설계 (페이지 구조 & 라우팅)

### 7-1. Next.js 라우팅 구조 (App Router)

```
app/
├── (public)/                        # 비로그인 접근 가능
│   ├── page.tsx                     # / → Home (소개 페이지)
│   ├── login/
│   │   └── page.tsx                 # /login → 로그인
│   ├── register/
│   │   └── page.tsx                 # /register → 회원가입
│   └── reset-password/
│       └── page.tsx                 # /reset-password → 비밀번호 재설정
│
└── (private)/                       # 로그인 필요
    ├── layout.tsx                   # 공통 레이아웃 (GNB, 사이드바 등)
    ├── players/
    │   └── page.tsx                 # /players → 선수 목록 + 포메이션 리스트 탭
    ├── formations/
    │   └── page.tsx                 # /formations → 포메이션 등록/편집
    ├── schedules/
    │   └── page.tsx                 # /schedules → 스케줄 관리 (달력)
    └── mypage/
        └── page.tsx                 # /mypage → 마이페이지
```

---

### 7-2. 페이지별 접근 권한

| URL | 페이지 | 비로그인 | 선수 | 코치 | 감독 |
|---|---|:---:|:---:|:---:|:---:|
| `/` | Home | ✅ | ✅ | ✅ | ✅ |
| `/login` | 로그인 | ✅ | - | - | - |
| `/register` | 회원가입 | ✅ | - | - | - |
| `/reset-password` | 비밀번호 재설정 | ✅ | - | - | - |
| `/players` | 선수 목록 | ❌ | ✅ | ✅ | ✅ |
| `/formations` | 포메이션 | ❌ | ✅ | ✅ | ✅ |
| `/schedules` | 스케줄 | ❌ | ✅ | ✅ | ✅ |
| `/mypage` | 마이페이지 | ❌ | ✅ | ✅ | ✅ |

> 비로그인 상태에서 `/players`, `/formations`, `/schedules`, `/mypage` 접근 시 `/login`으로 리다이렉트

---

### 7-3. 페이지별 레이아웃 구성

#### 공통 레이아웃 (로그인 후)

**GNB (상단 Global Navigation Bar)**
- 좌측: 로고 (Tactify FC)
- 우측: 사용자 프로필 (아바타 + 이름) / 마이페이지 버튼 / 로그아웃 버튼

**사이드바 (좌측 고정)**
- 페이지 이동 메뉴 목록
  - 선수 (`/players`)
  - 포메이션 (`/formations`)
  - 스케줄 (`/schedules`)

#### / — Home (소개 페이지)
- 비로그인 전용 인터랙티브 소개 페이지 (로그인 상태면 `/players` 리다이렉트)
- 스크롤 진입 시 섹션별 슬라이드인 애니메이션 적용
- GNB: 로고, 앵커 링크(기능·포메이션·스케줄), 시작하기 버튼
- Section 1 (Hero): 피치 그래픽, 메인 카피, 시작하기 / 로그인 버튼
- Section 2 (선수 관리): 4개 기능 카드 그리드
- Section 3 (포메이션): 4단계 플로우 카드
- Section 4 (CTA): 초대코드 예시 + 팀 만들기 버튼

#### /login — 로그인
- 아이디 / 비밀번호 입력
- 아이디 기억하기 체크박스
- 아이디 찾기 / 비밀번호 찾기 링크 → 각각 모달 오픈
- 회원가입 링크

#### /register — 회원가입
- 역할 선택 (감독 / 코치 / 선수)
- 이름, 아이디, 이메일, 비밀번호, 비밀번호 확인 입력
- 역할에 따라 동적 필드 표시 (팀명 or 초대코드)
- 가입 완료 모달

#### /players — 선수 목록
- 상단 탭: 선수 리스트 / 포메이션 리스트
- 선수 리스트 탭
  - 포지션 필터 (전체 / GK / DF / MF / FW)
  - 선수 카드 그리드
  - 선수 등록 버튼 (감독·코치만 노출)
- 포메이션 리스트 탭
  - 저장된 포메이션 카드 목록

#### /formations — 포메이션 등록/편집
- 좌측 패널
  - 탭: 출전명단 / 포메이션
  - 출전명단 탭: 선발선수 / 교체선수 영역
  - 출전선수 추가 버튼 → 모달 오픈
- 우측 경기장 영역
  - 상단 버튼: 펜(드로잉 모드), 캡처
  - 선수 드래그 앤 드롭 배치
  - 드로잉 레이어 (펜 모드 활성화 시)
- 하단 저장 버튼 → 포메이션 제목, 경기 날짜 입력 후 저장

#### /schedules — 스케줄 관리
- 달력 UI (월별 뷰)
- 날짜 클릭 시 모달 오픈 (일정 등록/조회)
- 달력 하단 또는 우측: 선택된 날짜의 일정 상세 + 포메이션 리스트
- 포메이션 클릭 시 포메이션 상세 모달

#### /mypage — 마이페이지
- 기본 프로필 섹션 (이름, 아이디, 이메일, 프로필 사진, 비밀번호 변경)
- 나의 선수 정보 섹션 (선수 권한일 경우만 노출)
- 팀 관리 섹션 (감독 권한일 경우만 노출)
  - 초대코드 확인 및 재발급
  - 팀원 목록 및 권한 변경
  - 팀 정보 수정
- 로그아웃 / 회원 탈퇴

---

## 8. 미정 / 추후 결정 필요 항목

| 항목 | 현황 |
|---|---|
| 소셜 로그인 | 추후 개발 예정 |
