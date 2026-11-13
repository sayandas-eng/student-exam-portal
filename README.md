# Student Examination Portal (starter build)

A private Flask + SQLite examination portal. Students cannot register. Admin imports student credentials and question sheets through the dashboard.

## Run locally

1. Install Python 3.10+.
2. Open a terminal in this folder and create a virtual environment:
   - Windows: `py -m venv .venv` then `.venv\\Scripts\\activate`
   - macOS/Linux: `python3 -m venv .venv` then `source .venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Set environment variables before first run:
   - Windows PowerShell: `$env:ADMIN_USERNAME="teacher"; $env:ADMIN_PASSWORD="use-a-strong-password"; $env:SECRET_KEY="a-long-random-secret"`
   - macOS/Linux: `export ADMIN_USERNAME=teacher ADMIN_PASSWORD='use-a-strong-password' SECRET_KEY='a-long-random-secret'`
5. Start: `python app.py`
6. Open `http://127.0.0.1:5000`.

The admin account is initialized from `ADMIN_USERNAME` and `ADMIN_PASSWORD` the first time the database is created. Keep `portal.db` private and back it up.

## Excel templates

### Students workbook
First worksheet, first row headers exactly:

| username | password |
|---|---|
| student01 | temporary-password |

Passwords are converted to secure hashes during import. Do not email or publish the source workbook.

### Questions workbook
First worksheet, first row headers:

`question`, `type`, `option_a`, `option_b`, `option_c`, `option_d`, `answer`, `marks`

Supported types: `mcq`, `fill`, `text`. For MCQs, `answer` must exactly match the correct option text. For fill questions, it must match the expected answer. `text` questions are intended for manual grading. Example rows:

| question | type | option_a | option_b | option_c | option_d | answer | marks |
|---|---|---|---|---|---|---|---|
| 2 + 2 = ? | mcq | 3 | 4 | 5 | 6 | 4 | 1 |
| Capital of France? | fill | | | | | Paris | 2 |
| Explain photosynthesis. | text | | | | | | 5 |

Importing creates a draft. Publish it from the admin dashboard when ready.

## Important limitations before real exams

- This is a starter implementation, not a certified high-stakes exam system. Test thoroughly with dummy accounts before using it with students.
- A normal browser page cannot stop a student from using another device, taking a photo, or opening tools outside the browser. The app records tab-hidden/window-blur events but cannot guarantee lockdown.
- The timer is checked by the server on answer saves and page loads. The client countdown is a display. For production, add a server-side scheduled expiry worker and robust reconnection handling.
- This starter currently supports one published exam at a time in the student view. Add per-student exam assignment and scheduling before using multiple simultaneous exam groups.
- The review period is included in the timer display, but answer edits are currently blocked once the answering deadline passes. Decide whether review should permit editing and adjust the API accordingly.
- Add HTTPS, secure production cookies, CSRF protection, rate limiting, database backups, audit retention, and a production WSGI server before public deployment.
- Admin grading for written questions is available on the attempt detail page. Confirm the grading workflow and result calculations with test cases.
