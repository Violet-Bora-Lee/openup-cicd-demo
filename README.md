# openup-cicd-demo

> 2026-05-07 Open UP × 고려대 입문형 강의 — **블록 2 실습용 데모 레포**
>
> "AI와 사람이 함께 만든 코드를, AI로 검증·자동화하는 흐름"

작은 TypeScript 추론 API. `POST /predict` 로 features 배열을 받아 가짜 점수와 라벨을 돌려줍니다.

이 레포는 강의 **블록 2 (55–95분)** 의 따라치기 실습 대상입니다.

---

## 0. 강의 시작 전 점검 (1분)

- ✅ 본인 GitHub 계정 (없다면 [github.com/signup](https://github.com/signup))
- ✅ 노트북 + 브라우저
- (선택) 로컬 git, Node.js 20+ — **없어도 모든 실습은 GitHub 웹 UI에서 가능합니다**

---

## 1. Fork (3분)

1. 우측 상단 **Fork** 버튼 클릭
2. 본인 계정으로 fork
3. fork된 레포의 **Actions** 탭 클릭
4. "I understand my workflows, go ahead and enable them" → **Enable**
   - 이 단계를 빠뜨리면 워크플로가 실행되지 않습니다.

---

## 2. 코드 한 바퀴 (3분, 강사 화면)

| 파일 | 역할 |
|---|---|
| `src/predict.ts` | 가짜 추론 함수 — features 가중평균 → sigmoid → score/label |
| `src/validate.ts` | 입력 검증 — 배열인가, 길이 1~10인가, 모두 number 인가 |
| `src/app.ts` | Express 앱 — `/health`, `POST /predict`, 에러 핸들러 |
| `tests/*.test.ts` | Jest 테스트 — 단위(predict, validate) + 통합(app + supertest) |
| `.github/workflows/ci.yml` | **이번 실습의 주인공** — push/PR 시 lint + test 자동 실행 |

---

## 3. 첫 push, 초록불 받기 (10분)

### 3-1. 작은 변경 만들기

GitHub 웹 UI에서 다음 파일을 엽니다:

`src/predict.ts`

연필 아이콘(✏️) 클릭. 아래 줄을 찾으세요:

```ts
const WEIGHTS = [0.4, 0.3, 0.2, 0.1];
```

다음과 같이 변경합니다:

```ts
const WEIGHTS = [0.5, 0.3, 0.15, 0.05];
```

### 3-2. Commit

페이지 우측 상단 **Commit changes** 클릭 → 메시지 입력 (예: `tweak weights`) → **Commit changes**.

### 3-3. CI 결과 확인

**Actions** 탭으로 이동. 새 워크플로 실행이 보입니다.

- 노란색 ⏳ : 실행 중 (1~2분 소요)
- ✅ 초록색 : 성공
- ❌ 빨간색 : 실패

초록불이 뜨면 **AI가 만들었든 사람이 만들었든, 그 코드가 검증 게이트를 통과한 것**입니다. 이 게이트는 여러분이 직접 정의한 테스트입니다.

---

## 4. 일부러 깨뜨리기 (10분)

이번엔 의도적으로 테스트가 깨지도록 만들어 봅니다.

`tests/predict.test.ts` 를 GitHub 웹 UI에서 엽니다. 다음 부분을 찾으세요:

```ts
it('returns positive label when weighted sum is high', () => {
  const result = predict({ features: [10, 10, 10, 10] });
  expect(result.label).toBe('positive');
```

이 줄을:

```ts
  expect(result.label).toBe('negative');
```

으로 바꿉니다 (positive → negative).

Commit. Actions 탭으로 가서 **빨간불** 을 확인합니다.

> 🛑 **이게 핵심입니다.**
> AI가 자동 생성한 코드를 push해도, 사람이 미리 정의한 테스트가 어긋나면 게이트는 막힙니다.
> "검증 자체"는 AI가 못 만듭니다 — **무엇을 검증할지 결정하는 것은 사람의 몫**입니다. 이게 휴먼인더루프(Human-in-the-Loop)의 본질입니다.

---

## 5. 다시 고쳐서 초록불 (5분)

방금 바꾼 줄을 원래대로 되돌립니다 (`negative` → `positive`).

Commit. Actions 탭에서 다시 초록불 확인.

---

## 6. (강사 시연) Copilot CLI 로 고치기 (블록 1·2 연결)

블록 1에서 본 흐름의 변형:

1. 강사 노트북에서 `gh copilot suggest "이 jest 실패 메시지를 분석하고 어떤 줄이 잘못됐는지 알려줘"`
2. CLI 출력 → 강사가 사람의 시각으로 검토 → 적용 여부 판단
3. push → 초록불

> 휴먼인더루프 한 줄 요약:
> **"AI가 코드를 쓰는 시대일수록, 무엇을 검증할지 사람이 더 명확하게 정의해야 한다."**

---

## 7. 로컬에서 돌리고 싶다면 (선택)

```bash
git clone https://github.com/<본인계정>/openup-cicd-demo.git
cd openup-cicd-demo
npm install
npm test           # 17 tests passed
npm run dev        # http://localhost:3000
```

다른 터미널에서:

```bash
curl -X POST http://localhost:3000/predict \
  -H 'Content-Type: application/json' \
  -d '{"features": [1, 2, 3, 4]}'
```

---

## 강의 자료

- 강의 사이트: (강의 시작 전 별도 안내)
- Open UP 입문형 프로그램: https://www.oss.kr/

## 라이선스

MIT — 학습 목적의 데모 레포입니다.
