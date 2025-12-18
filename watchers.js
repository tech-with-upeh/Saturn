const chokidar = require('chokidar');

const watcher = chokidar.watch('./app', {
  ignored: [
    '**/*.log',      // ignore logs
    '**/.git/**',    // ignore git folder
  ],
  persistent: true,
  usePolling: true,   // avoids ENOSPC
  interval: 100,
});
