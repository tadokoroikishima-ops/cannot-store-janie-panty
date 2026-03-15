/* ═══════════════════════════════════════════
Cannot DNM — app.js
═══════════════════════════════════════════ */

/* ── ログイン処理 ── */
function checkLogin() {
var input = document.getElementById(‘passInput’);
var err   = document.getElementById(‘loginError’);
if (!input) return;
var val = input.value;
if (val === ‘hillock7’) {
window.location.href = ‘market.html’;
} else {
err.textContent = ‘> ACCESS DENIED — INVALID CREDENTIALS’;
input.value = ‘’;
input.focus();
}
}

/* ── DOMロード後にイベント登録 ── */
document.addEventListener(‘DOMContentLoaded’, function() {

var btn   = document.getElementById(‘loginBtn’);
var input = document.getElementById(‘passInput’);

if (btn)   btn.addEventListener(‘click’, checkLogin);
if (input) input.addEventListener(‘keydown’, function(e) {
if (e.key === ‘Enter’) checkLogin();
});

});

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
