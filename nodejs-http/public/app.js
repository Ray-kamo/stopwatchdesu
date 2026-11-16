'use strict';

const StopwatchModule = (function () {
  let status = 'idle';
  let intervalId = null;
  let startTime = 0;
  let elapsedMs = 0;

  function pad(num) {
    return String(num).padStart(2, '0');
  }

  function formatTime(totalMs) {
    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const centiseconds = Math.floor((totalMs % 1000) / 10); // 1/100秒（2桁）
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
  }

  return {
    start(onUpdate) {
      if (status === 'running') return;
      status = 'running';
      startTime = Date.now() - elapsedMs;
      intervalId = setInterval(() => {
        elapsedMs = Date.now() - startTime;
        onUpdate(formatTime(elapsedMs), status);
      }, 10);
      onUpdate(formatTime(elapsedMs), status);
    },
    stop(onUpdate) {
      if (status !== 'running') return;
      status = 'paused';
      clearInterval(intervalId);
      elapsedMs = Date.now() - startTime;
      onUpdate(formatTime(elapsedMs), status);
    },
    reset(onUpdate) {
      status = 'idle';
      clearInterval(intervalId);
      elapsedMs = 0;
      onUpdate(formatTime(elapsedMs), status);
    }
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const btnStart = document.getElementById('btnStart');
  const btnStop = document.getElementById('btnStop');
  const btnReset = document.getElementById('btnReset');

  const updateUI = (timeStr, status) => {
    display.textContent = timeStr;
    btnStart.disabled = (status === 'running');
    btnStop.disabled = (status !== 'running');
    btnReset.disabled = (status === 'idle');
  };

  btnStart.addEventListener('click', () => StopwatchModule.start(updateUI));
  btnStop.addEventListener('click', () => StopwatchModule.stop(updateUI));
  btnReset.addEventListener('click', () => StopwatchModule.reset(updateUI));
});
