진주성 비밀노트 v3 - Supabase 연결 버전

[중요]
1. config.js를 메모장으로 엽니다.
2. SUPABASE_PUBLISHABLE_KEY의 "sb_publishable_5_I_q1nIrBbVxvP1mvfnvg_JFdTITzu" 부분을
   Supabase에서 복사한 sb_publishable_... 키로 교체합니다.
3. sb_secret_... 키는 절대로 넣지 마세요.
4. 저장합니다.
5. index.html, style.css, script.js, config.js 네 파일을 GitHub 저장소 루트에 업로드하고 Commit changes 합니다.

기능:
- 팀 생성 기록 -> Supabase teams
- 현장 사진 -> Supabase Storage mission-photos
- 미션 답안/정답/사진경로/제출시각 -> mission_submissions
- 진행상황은 학생 기기에도 localStorage로 보존

주의:
- 현재 문제는 테스트용 임시 문제입니다.
- 교사용 관리자 화면은 다음 단계에서 추가할 수 있습니다.
