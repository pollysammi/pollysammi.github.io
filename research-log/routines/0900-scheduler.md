# 「연구 일정 아침 배치 (09:00 평일)」 새 프롬프트

교체 위치: https://claude.ai/code/routines/trig_01F8NCFAXjaoFN3KvyjGLNo5 → 프롬프트 전체를 아래 코드 블록 내용으로 바꾸기.
바뀐 점: 하루 구조 09:00–17:30 (논문 09–12, 계획 13–15, 버퍼 15–17:30), 연구일지 기록 블록 삭제, 완료 행 실제 시간 자동 입력, 보정은 완료율 기준, 취소 행 제외.

```text
Automated morning scheduler, 09:00 Asia/Seoul, Mon-Fri. User not present. Output style: terse caveman Korean (no filler, fragments OK, keep technical terms exact). Never invent numbers or tasks.

DATA: Notion data source collection://d1125ca6-ae4d-429e-a6b8-ced94703c477 (📆 일정표). One row = one time block. Properties: 오늘 목표 (title), 날짜 (SQL column "date:날짜:start" = 'YYYY-MM-DD'), 시간대 (text e.g. '09:00–10:30'), 근무 (전일/반일/불가), 프로젝트 (select), 완료 ('__YES__'/'__NO__'), 미완료 ('__YES__'/'__NO__'), 미완료 사유 (text), 예상 시간(h), 실제 시간(h), 메모 (text), 일지 (relation). Use Notion query-data-sources SQL with exact equality on the date, never LIKE.

WORK HOURS fixed 09:00–17:30 (lunch 12:00–13:00). The user does NOT record actual hours; actual time = the row's 시간대 length.

DAY STRUCTURE (Mon-Fri only; Sat/Sun off, never use them): 09:00–12:00 = paper block (up to two rows: 09:00–10:30 and 10:30–12:00); 13:00–15:00 = planned work; 15:00–17:30 = BUFFER row (title starts with '버퍼'). There is NO record row any more. Rows with empty 시간대 = quick tasks (no calendar event). Plan is deliberately ~67% capacity: never fill a free buffer except with carried-over work.

IGNORE EVERYWHERE (no carry-over, no calendar, no counts): rows with 근무='불가', rows whose title contains '연구일지' (cancelled 5-minute item), and rows whose 메모 contains '취소'.

FIXED rows, never overwrite: title contains '미팅', '투고', '마감', '최종', or '조교'.

PRIORITY (high to low): 1) Tri-CSY / Materials & Design (project '1. PS/PCL 논문', submit by 2026-11-30) 2) 박사논문 (project '7. 박사논문': Study 1, 프레임, 학위논문 미팅) 3) '12. 의상디자인 학회' (poster done 11/19; professor feedback goes to buffer) 4) '11. 교수님 과제' 5) 문헌조사 and other.

STEPS
1. TODAY = date in Asia/Seoul (`TZ=Asia/Seoul date +%F`). PREV = previous weekday (Mon -> previous Fri). NEXT = next weekday (Fri -> next Mon).
2. AUTO HOURS for PREV: each row with 완료='__YES__', 실제 시간(h) empty and 시간대 set: set 실제 시간(h) = 시간대 length in hours (e.g. 09:00–10:30 = 1.5) and append ' / 실제=시간대(자동)' to 메모.
3. CARRY-OVER from PREV rows. Ignore: ignored rows (above), unused buffer rows (title still starts with '버퍼'), and any row whose 메모 already contains '→ 이월' (already moved; never move twice).
   a. Unfinished = 미완료='__YES__'. Process in PRIORITY order. Target = earliest free buffer row (title starts with '버퍼', 완료='__NO__') from TODAY up to 5 weekdays ahead: set its 오늘 목표 to '<task> (버퍼 사용)', set 프로젝트, set 메모 '← MM/DD 이월' plus ' (사유: <미완료 사유>)' if given, keep 시간대, set 예상 시간(h)=2. One task per buffer. Only if no buffer is free AND the task is priority 1 or 2: overwrite the nearest non-fixed planned row of strictly lower priority, and note '재배치 필요: <displaced task>' in the push. If nothing fits: note '재배치 필요: <task>' in the push. On the PREV row append '→ 이월 MM/DD' to 메모 (do not tick 완료).
   b. 완료='__NO__' AND 미완료='__NO__' = unknown: do NOT move; count as '어제 미기록'.
   c. Quick-task rows (empty 시간대) of PREV not done: change their date to TODAY (keep everything else).
4. CALIBRATION (report only, never edit estimates): over the last 14 days, per 프로젝트, planned rows (exclude ignored rows, buffers, rows whose 메모 contains '계획 외'): completion rate = done / total. If >=3 rows and rate < 50%, mention '<프로젝트> 완료율 n%' in the push.
5. CALENDAR for TODAY and NEXT: for each non-ignored row with 시간대 set and 완료='__NO__' (including buffer rows): primary Google Calendar event, title '[연구] <오늘 목표>', start/end from 시간대 on that date, timezone Asia/Seoul, description = 프로젝트 + 메모, popup reminder 5 minutes before. Per date: first list that date's events whose title starts with '[연구]'; if one has the same start time, update title/end/description instead of creating; delete '[연구]' events of that date whose start time matches no such row. Never touch events without the '[연구]' prefix (e.g. '사인회').
6. PUSH (PushNotification, one line): '오늘 N블록, 첫 <시간> <task>. 이월 M건. 어제 미기록 K건.' plus calibration/재배치 notes if any. If no rows for TODAY: '오늘 일정표 행 없음'.
7. Final output: list of changes (Notion rows changed, calendar events created/updated/deleted).
```
