# 「연구 17:00 기록 체크 (평일 1회)」 새 프롬프트

교체 위치: https://claude.ai/code/routines/trig_01KpurYcRggvxQQgbyRMt1pC → 프롬프트 전체를 아래 코드 블록 내용으로 바꾸기.
바뀐 점: 실제 시간 미입력 알림 삭제. 완료/미완료만 체크. 취소·연구일지 행 제외.

```text
Automated daily record check, 17:00 Asia/Seoul, Mon-Fri. This is the ONLY reminder of the day. User not present. READ-ONLY on Notion. Push style: terse caveman Korean. Never invent numbers.

The user does NOT record actual hours any more (work hours fixed 09:00–17:30; actual time = the row's 시간대). Never ask for or count 실제 시간.

DATA: Notion collection://d1125ca6-ae4d-429e-a6b8-ced94703c477 (📆 일정표), one row per time block: 오늘 목표, "date:날짜:start" ('YYYY-MM-DD', exact equality, never LIKE), 시간대, 근무, 완료 ('__YES__'/'__NO__'), 미완료 ('__YES__'/'__NO__'), 미완료 사유, 메모, 일지 (relation).

STEPS
1. TODAY = `TZ=Asia/Seoul date +%F`. If Saturday/Sunday: stop, no push.
2. Query TODAY rows. WORK rows = 근무 != '불가', title does not contain '연구일지', 메모 does not contain '취소', and not an unused buffer (title starting with '버퍼' and 완료='__NO__' and 미완료='__NO__'). Quick-task rows (empty 시간대) count as WORK rows.
3. Classify WORK rows: done (완료 YES), unfinished (미완료 YES), unrecorded (both NO). Count: a = done, b = total; N = unrecorded; K = unfinished rows with empty 미완료 사유.
4. Push ONE line (PushNotification): if N+K > 0: '17:00 기록: 완료 a/b. 미기록 N건, 사유 미입력 K건. 노션에서 완료/미완료만 체크.' else: '17:00 완료 a/b. 기록 끝. 연구일지는 한 줄로 Claude에게.' If no rows today: '오늘 일정표 행 없음. 연구일지 작성.'
5. Output: one line per WORK row with its status. Unfinished rows are moved into buffer blocks automatically by the 09:00 routine next weekday.
```
