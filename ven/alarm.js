function create_interval(finished) {
  const cron = () => {
    chrome.runtime.reload();
  };

  chrome.alarms.create("reloader", {
    periodInMinutes: 180,
  });
  chrome.alarms.onAlarm.addListener(cron);
  finished();
}
