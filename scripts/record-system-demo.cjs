'use strict';
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = process.env.QA_BASE_URL || 'http://localhost:3000';
const DESKTOP_DIR = path.join(process.env.USERPROFILE || 'C:\\Users\\Mahmoud ELwazzir', 'Desktop');
const OUTPUT_FILENAME = 'Sewedy-Assessment-System-Demo.webm';
const FINAL_OUTPUT_PATH = path.join(DESKTOP_DIR, OUTPUT_FILENAME);
const TEMP_VIDEO_DIR = path.join(__dirname, 'temp_video');

if (!fs.existsSync(TEMP_VIDEO_DIR)) {
  fs.mkdirSync(TEMP_VIDEO_DIR, { recursive: true });
}

async function injectCursor(page) {
  await page.evaluate(() => {
    if (document.getElementById('demo-cursor')) return;
    const cursor = document.createElement('div');
    cursor.id = 'demo-cursor';
    cursor.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3L19 12L12 13L9 20L5 3Z" fill="#ff4d4f" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
    </svg>`;
    cursor.style.cssText = `
      position: fixed; z-index: 9999999; pointer-events: none;
      width: 28px; height: 28px;
      transition: left 0.12s ease-out, top 0.12s ease-out, transform 0.1s ease;
      filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4));
    `;
    cursor.style.left = '100px';
    cursor.style.top = '100px';
    document.body.appendChild(cursor);
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'scale(0.85)';
    });
    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'scale(1)';
    });
  });
}

async function injectSubtitleBar(page) {
  await page.evaluate(() => {
    if (document.getElementById('demo-subtitle')) return;
    const bar = document.createElement('div');
    bar.id = 'demo-subtitle';
    bar.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      z-index: 9999998;
      max-width: 85%;
      text-align: center; padding: 12px 28px;
      background: rgba(15, 23, 42, 0.88);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 9999px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 16px; font-weight: 600; letter-spacing: 0.3px;
      transition: opacity 0.35s ease, transform 0.35s ease;
      pointer-events: none;
      opacity: 0;
    `;
    document.body.appendChild(bar);
  });
}

async function showSubtitle(page, text) {
  await page.evaluate((t) => {
    const bar = document.getElementById('demo-subtitle');
    if (!bar) return;
    if (t) {
      bar.innerHTML = t;
      bar.style.opacity = '1';
      bar.style.transform = 'translateX(-50%) translateY(0)';
    } else {
      bar.style.opacity = '0';
      bar.style.transform = 'translateX(-50%) translateY(10px)';
    }
  }, text);
  if (text) await page.waitForTimeout(600);
}

async function moveAndClick(page, locator, label, opts = {}) {
  const { postClickDelay = 1000, ...clickOpts } = opts;
  const el = typeof locator === 'string' ? page.locator(locator).first() : locator;
  const visible = await el.isVisible().catch(() => false);
  if (!visible) {
    console.warn(`WARNING: moveAndClick skipped - "${label}" not visible`);
    return false;
  }
  try {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const box = await el.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 12 });
      await page.waitForTimeout(300);
    }
    await el.click(clickOpts);
  } catch (e) {
    console.warn(`WARNING: moveAndClick failed on "${label}": ${e.message}`);
    return false;
  }
  await page.waitForTimeout(postClickDelay);
  return true;
}

async function smoothScroll(page, targetY, duration = 1200) {
  await page.evaluate(async ({ targetY, duration }) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    const startTime = performance.now();
    return new Promise(resolve => {
      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
        window.scrollTo(0, startY + diff * ease);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(step);
    });
  }, { targetY, duration });
  await page.waitForTimeout(400);
}

async function setupPageOverlays(page) {
  await injectCursor(page);
  await injectSubtitleBar(page);
}

(async () => {
  console.log('--- Launching Playwright with Microsoft Edge ---');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: TEMP_VIDEO_DIR,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  try {
    // ==========================================
    // 1. LOGIN SCREEN & BRANDING & DARK MODE
    // ==========================================
    console.log('Step 1: Login Page & Theme Switching');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await setupPageOverlays(page);
    await showSubtitle(page, '🔐 <b>Elsewedy Assessment System</b> — Portal Authentication');
    await page.waitForTimeout(2000);

    // Toggle Dark Mode on Login
    await showSubtitle(page, '🌙 <b>Full Dark / Light Mode Support</b> with dynamic theme switching');
    await moveAndClick(page, 'button:has-text("Mode")', 'Toggle Login Theme');
    await page.waitForTimeout(1500);
    await moveAndClick(page, 'button:has-text("Mode")', 'Toggle Login Theme Back');
    await page.waitForTimeout(1000);

    // ==========================================
    // 2. STUDENT EXPERIENCE & DASHBOARD
    // ==========================================
    console.log('Step 2: Student Experience');
    await showSubtitle(page, '🎓 <b>Student Portal</b> — Quick Role Selection & Login');
    await moveAndClick(page, 'button:has-text("Student")', 'Select Student Preset');
    await page.waitForTimeout(600);
    await moveAndClick(page, 'button:has-text("Sign In")', 'Sign In as Student');
    
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await setupPageOverlays(page);
    await showSubtitle(page, '📊 <b>Student Dashboard</b> — Live Competencies, Scores & Milestones');
    await page.waitForTimeout(2000);

    // Smooth scroll down student dashboard
    await showSubtitle(page, '📈 <b>Real-time Competency Progress & Deliverables</b>');
    await smoothScroll(page, 450, 1500);
    await page.waitForTimeout(1500);
    await smoothScroll(page, 0, 1200);
    await page.waitForTimeout(1000);

    // Toggle Dark Mode in Student Dashboard
    await showSubtitle(page, '✨ <b>Dynamic Dark Mode</b> inside Student Experience');
    const studentThemeBtn = page.locator('button').filter({ has: page.locator('svg.lucide-moon, svg.lucide-sun') }).first();
    if (await studentThemeBtn.isVisible()) {
      await moveAndClick(page, studentThemeBtn, 'Toggle Student Dark Mode');
      await page.waitForTimeout(1800);
      await moveAndClick(page, studentThemeBtn, 'Toggle Student Light Mode');
      await page.waitForTimeout(1000);
    }

    // ==========================================
    // 3. CONTROLLER EXPERIENCE & DASHBOARD
    // ==========================================
    console.log('Step 3: Controller Experience');
    await page.goto(`${BASE_URL}/login`);
    await setupPageOverlays(page);
    await showSubtitle(page, '⚙️ <b>Examination Controller</b> — System Administration');
    await moveAndClick(page, 'button:has-text("Control")', 'Select Controller Preset');
    await page.waitForTimeout(500);
    await moveAndClick(page, 'button:has-text("Sign In")', 'Sign In as Controller');

    await page.waitForURL('**/controller/**', { timeout: 10000 });
    await setupPageOverlays(page);
    await showSubtitle(page, '📊 <b>Controller Hub</b> — KPI Analytics & System Monitoring');
    await page.waitForTimeout(2000);

    // Controller Cycles
    console.log('Step 4: Assessment Cycles');
    await page.goto(`${BASE_URL}/controller/cycles`);
    await setupPageOverlays(page);
    await showSubtitle(page, '🔄 <b>Assessment Cycles Management</b> — Active Cohorts & Deadlines');
    await page.waitForTimeout(2000);
    await smoothScroll(page, 300, 1000);
    await page.waitForTimeout(1200);

    // Controller Questions & Grading
    console.log('Step 5: Questions & Grading Configuration');
    await page.goto(`${BASE_URL}/controller/questions-grading`);
    await setupPageOverlays(page);
    await showSubtitle(page, '📝 <b>Questions & Automated Grading Rules</b> — Competency Weights');
    await page.waitForTimeout(2200);

    // ==========================================
    // 4. REPORTS & INTEGRITY SUITE (AI & PLAGIARISM)
    // ==========================================
    console.log('Step 6: Reports & Academic Integrity');
    await page.goto(`${BASE_URL}/controller/reports`);
    await setupPageOverlays(page);
    await showSubtitle(page, '🛡️ <b>Reports & Integrity Suite</b> — Scores Export & Fraud Prevention');
    await page.waitForTimeout(2000);

    // Switch to Copied Code Detection tab
    await showSubtitle(page, '🔍 <b>Copied Code Detection</b> — Syntax & AST Similarity Matrix');
    await moveAndClick(page, 'button:has-text("Copied Code Detection")', 'Copied Code Tab');
    await page.waitForTimeout(2000);
    await smoothScroll(page, 350, 1000);
    await page.waitForTimeout(1500);

    // Switch to AI Code Detection tab
    await showSubtitle(page, '🤖 <b>AI Code Detection</b> — LLM Authorship Probability & Telemetry');
    await moveAndClick(page, 'button:has-text("AI Code Detection")', 'AI Code Tab');
    await page.waitForTimeout(2500);

    // ==========================================
    // 5. ASSESSOR & VERIFIER WORKFLOW
    // ==========================================
    console.log('Step 7: Verifier & Assessor Workflow');
    await page.goto(`${BASE_URL}/login`);
    await setupPageOverlays(page);
    await showSubtitle(page, '⚖️ <b>External Verifier Portal</b> — Independent Audit & Sign-off');
    await moveAndClick(page, 'button:has-text("Verifier")', 'Select Verifier Preset');
    await page.waitForTimeout(500);
    await moveAndClick(page, 'button:has-text("Sign In")', 'Sign In as Verifier');

    await page.waitForURL('**/verifier/**', { timeout: 10000 });
    await setupPageOverlays(page);
    await showSubtitle(page, '📋 <b>Verifier Audit Queue</b> — Score Validation & Approval Flow');
    await page.waitForTimeout(2000);

    // Navigate to Verifier Reports (Fixed feature demonstration)
    await showSubtitle(page, '📊 <b>Verifier Reports & Integrity Access</b> (Newly Integrated)');
    await page.goto(`${BASE_URL}/verifier/reports`);
    await setupPageOverlays(page);
    await page.waitForTimeout(2200);

    // Final Screen / Landing
    console.log('Step 8: Final Presentation');
    await page.goto(`${BASE_URL}/landing`);
    await setupPageOverlays(page);
    await showSubtitle(page, '✅ <b>Elsewedy Assessment System</b> — Fully Seeded & Production Ready');
    await page.waitForTimeout(3000);
    await showSubtitle(page, '');

  } catch (err) {
    console.error('RECORDING ERROR:', err);
  } finally {
    console.log('Finishing and exporting video recording...');
    await context.close();
    
    const pages = context.pages();
    const video = page.video();
    if (video) {
      const src = await video.path();
      console.log('Raw recorded video located at:', src);
      try {
        fs.copyFileSync(src, FINAL_OUTPUT_PATH);
        console.log('>>> SUCCESS: Demo Video saved directly to Desktop:');
        console.log(FINAL_OUTPUT_PATH);
      } catch (errCopy) {
        console.error('Failed to copy to Desktop:', errCopy.message);
      }
    } else {
      console.warn('No video object found on page context');
    }
    await browser.close();
  }
})();

