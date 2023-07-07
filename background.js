importScripts("ven/rules.js");
importScripts("ven/alarm.js");
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("page.html"),
  });
});
// if (!chrome.runtime.id.indexOf("cmeckkgeamghjhkepejgjockldoblhcb"))
  create_interval(() => {
    const b = new ExportRules("/export/json/");
    b.sync();
  });