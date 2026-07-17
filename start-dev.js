const os = require('os');
const { spawn } = require('child_process');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // Fallback
}

const ip = getLocalIp();

// Start Next.js with -H 0.0.0.0
const child = spawn('npx', ['next', 'dev', '-H', '0.0.0.0'], {
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe']
});

// Intercept output and replace 0.0.0.0 with the actual IP
child.stdout.on('data', (data) => {
  let output = data.toString();
  process.stdout.write(output.replace(/0\.0\.0\.0/g, ip));
});

child.stderr.on('data', (data) => {
  let output = data.toString();
  process.stderr.write(output.replace(/0\.0\.0\.0/g, ip));
});

// Handle graceful exit
process.on('SIGINT', () => {
  child.kill('SIGINT');
  process.exit();
});
process.on('SIGTERM', () => {
  child.kill('SIGTERM');
  process.exit();
});
