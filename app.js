/* ═══════════════════════════════════════════
Cannot DNM — app.js
═══════════════════════════════════════════ */

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
