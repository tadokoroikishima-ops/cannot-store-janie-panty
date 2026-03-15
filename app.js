/* ═══════════════════════════════════════════
Cannot DNM — app.js
fetch不使用・DOM直接操作のみ
═══════════════════════════════════════════ */

/* ── ログインチェック ── */
function checkLogin() {
var val = document.getElementById(‘passInput’).value;
if (val === ‘hillock7’) {
window.location.href = ‘market.html’;
} else {
var err = document.getElementById(‘loginError’);
err.textContent = ‘> ACCESS DENIED — INVALID CREDENTIALS’;
document.getElementById(‘passInput’).value = ‘’;
document.getElementById(‘passInput’).focus();
/* エラー時に赤く点滅 */
err.style.animation = ‘none’;
setTimeout(function() { err.style.animation = ‘’; }, 10);
}
}

/* ── Enterキー対応 ── */
function handleLoginKey(e) {
if (e.key === ‘Enter’) checkLogin();
}

/* ── メッセージ送信（モック） ── */
function sendMsg() {
var input = document.getElementById(‘msgInput’);
if (input && input.value.trim()) {
input.value = ‘’;
input.placeholder = ‘MESSAGE ENCRYPTED & QUEUED…’;
setTimeout(function() {
input.placeholder = ‘TYPE ENCRYPTED MESSAGE TO VENDOR…’;
}, 3000);
}
}
