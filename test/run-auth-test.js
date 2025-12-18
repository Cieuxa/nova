const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

(async function main() {
  try {
    // Use canonical auth.clean.js for testing
    const authPath = path.resolve(__dirname, '..', 'scripts', 'auth.clean.js');
    const authCode = fs.readFileSync(authPath, 'utf8');

    // Minimal HTML with elements expected by auth.js
    const html = `<!doctype html><html><head></head><body>
      <div id="user-avatar"></div>
      <div id="user-name"></div>
      <div id="avatar-placeholder"></div>
      <div id="sidebar-name"></div>
      <div id="welcome-title"></div>
      <input id="first-name" />
      <input id="last-name" />
      <input id="email" />
      <button id="logout-btn">Logout</button>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable', url: 'http://localhost/profil.html' });
    const { window } = dom;

    // Provide a console so auth.js logs don't crash
    window.console = console;

    // Emulate localStorage (jsdom provides it)

    // Evaluate auth.js in the jsdom window
    window.eval(authCode);

    // Simulate a "registration" by writing the canonical keys that upstream code would write
    const testUser = { email: 'test@example.com', firstName: 'Jean', lastName: 'Dupont', mails: [], files: [] };
    window.localStorage.setItem('ns_users', JSON.stringify([testUser]));
    window.localStorage.setItem('ns_current_user', JSON.stringify(testUser));

    // Wait briefly for DOMContentLoaded handlers in auth.js to run
    await new Promise(r => setTimeout(r, 200));

    // Access the exposed AuthService
    const AuthService = window.AuthService;
    if (!AuthService) throw new Error('AuthService not exposed');

    // Check isLoggedIn
    if (!AuthService.isLoggedIn()) throw new Error('AuthService reports not logged in after setting ns_current_user');

    // getCurrentUser should return a normalized user
    const cur = AuthService.getCurrentUser();
    if (!cur || cur.email !== 'test@example.com') throw new Error('getCurrentUser returned unexpected value: ' + JSON.stringify(cur));

    // Check UI update performed by NovaAuth.updateUserUI if present
    if (window.NovaAuth && typeof window.NovaAuth.updateUserUI === 'function') {
      // Call it explicitly to ensure it runs
      window.NovaAuth.updateUserUI(cur);
      const avatar = window.document.getElementById('user-avatar').textContent.trim();
      if (!avatar) throw new Error('updateUserUI failed to set avatar initials');
    }

    // Now logout
    AuthService.logout();
    if (AuthService.isLoggedIn()) throw new Error('AuthService still reports logged in after logout');

    // Ensure keys removed from storage
    const remaining = ['ns_current_user', 'nova_current_user', 'novaUser'].map(k => window.localStorage.getItem(k));
    if (remaining.some(v => v !== null)) throw new Error('Some session keys remain after logout: ' + JSON.stringify(remaining));

    console.log('TEST OK: create → detect → UI update → logout flow passed');
    process.exit(0);
  } catch (err) {
    console.error('TEST FAIL:', err && err.stack || err);
    process.exit(2);
  }
})();
