var links = [];
var links_backup = [];
var myURL = 'aaa';
var state = false; // on/off switch
var content_script_loaded = {};
var timeout = 5;
var idletime = 30;

// readme裡面記得提到，每個window都會有一個activeTab，不可避免，所以直接換window時原本的activeTab會繼續算時間，但會在過了idle time後終止，所以不用過於擔心！

// 同個網域下（比如都還在fb），不要重新inject，換網域就要
chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
  // 確認complete，就只load一次！
  if (changeInfo.status === 'complete') {
    // manifest內permission要有tabs，才能從tab得到url
    console.log(tab.url);
    // changeInfo.url只會在這次和上次有變動的時候顯示，也就是重新整理會undefine，所以不用它
    console.log(links);
    // 每次打開reload page都會重新從links list確認是不是match，所以先match又被remove的也可以handle
    links.some( (value, index, array) => {
        if (tab.url.match(value) != null) {
            chrome.tabs.sendMessage(tabId, {start_timer: true, timeout: timeout, idletime: idletime}, function (response) {});
            return true;
        }
    });

  }
});

var current_activate_id = null;
// 用來告知content script他的tab現在是不是active (原本不需要，但因為popup問題)
// onActivates will only fire when the activate tab in "a window" changes
chrome.tabs.onActivated.addListener( (activeInfo) => {
  console.log('someone active');
  current_activate_id = activeInfo.tabId;
  chrome.tabs.query({}, function(tabs) {
    for (var i=0; i<tabs.length; ++i) {
      chrome.tabs.sendMessage(tabs[i].id, {ask_background_for_tabId: "come on", your_i: i, active_tabId: current_activate_id}, function(response){
      });
    }
  });
});

// note "alert" will cause windows FocusChanged
chrome.windows.onFocusChanged.addListener( (windowId) => {
      console.log(windowId);
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    current_activate_id = tabs[0].id;
    chrome.tabs.query({}, function(tabs) {
      for (var i=0; i<tabs.length; ++i) {
        chrome.tabs.sendMessage(tabs[i].id, {ask_background_for_tabId: "come on", your_i: i,
          active_tabId: current_activate_id}, function(response){
        });
      }
    });
  });
}, {windowTypes: ['normal']});

// 設一個 var current_tab_time, 不斷更新當前tab的時間，給popup讀
var current_tab_time = 0;

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {

    if (message.type === "elapsed_time") {
      current_tab_time = message.time;
    }

    if (message.what_is_my_tabId === "answer me") {
      console.log(sender.tab.id);
      chrome.tabs.sendMessage(sender.tab.id, {your_tabId: sender.tab.id});
    }

    if (message.am_i_currently_active === "answer me") {
      sendResponse({answer: sender.tab.id===current_activate_id});

    }

    if (message.close_this_tab) {
      chrome.tabs.remove(sender.tab.id);
    }

  }
);