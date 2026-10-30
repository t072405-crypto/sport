#!/usr/bin/env node
// Runs `expo start --tunnel` and restarts it if it crashes.
// Expo's tunnel exits the whole dev server on a brief network/DNS hiccup
// (e.g. "getaddrinfo ENOTFOUND ...on.expo.app"); this brings it back.
// Usage: npm run tunnel        (stop with Ctrl+C)
const { spawn } = require('node:child_process');

const RESTART_DELAY_MS = 3000;
// One command string (not an args array) so Node doesn't warn about shell + args (DEP0190).
const command = ['npx', 'expo', 'start', '--tunnel', '--port', '8082', ...process.argv.slice(2)].join(' ');
let stopping = false;

process.on('SIGINT', () => {
  stopping = true;
});

function start() {
  const child = spawn(command, { stdio: 'inherit', shell: true });
  child.on('exit', (code) => {
    if (stopping || code === 0) process.exit(code ?? 0);
    console.log(
      `\n[dev-tunnel] Expo stopped (exit code ${code}). Restarting in ${RESTART_DELAY_MS / 1000}s…` +
        '\n[dev-tunnel] The tunnel address may change: scan the new QR code.\n',
    );
    setTimeout(start, RESTART_DELAY_MS);
  });
}

start();
