---
name: feedback_no-preview
description: User verifies UI changes themselves, no need to run preview or screenshot
metadata:
  type: feedback
---

Do not run preview verification after UI changes. The user checks the result themselves in the browser.

**Why:** User preference — they open the page manually and verify visually.
**How to apply:** Skip all preview_start, preview_screenshot, preview_eval steps after edits. Just make the change and report what was done.
