// line below is min version of TimeMe.js, License

/*Copyright (c) 2017 Jason Zissman
Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function(){var e,t;e=this,t=function(){var r={startStopTimes:{},idleTimeoutMs:3e4,currentIdleTimeMs:0,checkStateRateMs:250,active:!1,idle:!1,currentPageName:"default-page-name",timeElapsedCallbacks:[],userLeftCallbacks:[],userReturnCallbacks:[],trackTimeOnElement:function(e){var t=document.getElementById(e);t&&(t.addEventListener("mouseover",function(){r.startTimer(e)}),t.addEventListener("mousemove",function(){r.startTimer(e)}),t.addEventListener("mouseleave",function(){r.stopTimer(e)}),t.addEventListener("keypress",function(){r.startTimer(e)}),t.addEventListener("focus",function(){r.startTimer(e)}))},getTimeOnElementInSeconds:function(e){var t=r.getTimeOnPageInSeconds(e);return t||0},startTimer:function(e,t){if(e||(e=r.currentPageName),void 0===r.startStopTimes[e])r.startStopTimes[e]=[];else{var n=r.startStopTimes[e],i=n[n.length-1];if(void 0!==i&&void 0===i.stopTime)return}r.startStopTimes[e].push({startTime:t||new Date,stopTime:void 0}),r.active=!0},stopAllTimers:function(){for(var e=Object.keys(r.startStopTimes),t=0;t<e.length;t++)r.stopTimer(e[t])},stopTimer:function(e){e||(e=r.currentPageName);var t=r.startStopTimes[e];void 0!==t&&0!==t.length&&(void 0===t[t.length-1].stopTime&&(t[t.length-1].stopTime=new Date),r.active=!1)},getTimeOnCurrentPageInSeconds:function(){return r.getTimeOnPageInSeconds(r.currentPageName)},getTimeOnPageInSeconds:function(e){return void 0===r.getTimeOnPageInMilliseconds(e)?void 0:r.getTimeOnPageInMilliseconds(e)/1e3},getTimeOnCurrentPageInMilliseconds:function(){return r.getTimeOnPageInMilliseconds(r.currentPageName)},getTimeOnPageInMilliseconds:function(e){var t=r.startStopTimes[e];if(void 0!==t){for(var n=0,i=0;i<t.length;i++){var s=t[i].startTime,o=t[i].stopTime;void 0===o&&(o=new Date),n+=o-s}return Number(n)}},getTimeOnAllPagesInSeconds:function(){for(var e=[],t=Object.keys(r.startStopTimes),n=0;n<t.length;n++){var i=t[n],s=r.getTimeOnPageInSeconds(i);e.push({pageName:i,timeOnPage:s})}return e},setIdleDurationInSeconds:function(e){var t=parseFloat(e);if(!1!==isNaN(t))throw{name:"InvalidDurationException",message:"An invalid duration time ("+e+") was provided."};return r.idleTimeoutMs=1e3*e,this},setCurrentPageName:function(e){return r.currentPageName=e,this},resetRecordedPageTime:function(e){delete r.startStopTimes[e]},resetAllRecordedPageTimes:function(){for(var e=Object.keys(r.startStopTimes),t=0;t<e.length;t++)r.resetRecordedPageTime(e[t])},resetIdleCountdown:function(){r.idle&&r.triggerUserHasReturned(),r.idle=!1,r.currentIdleTimeMs=0},callWhenUserLeaves:function(e,t){this.userLeftCallbacks.push({callback:e,numberOfTimesToInvoke:t})},callWhenUserReturns:function(e,t){this.userReturnCallbacks.push({callback:e,numberOfTimesToInvoke:t})},triggerUserHasReturned:function(){if(!r.active)for(var e=0;e<this.userReturnCallbacks.length;e++){var t=this.userReturnCallbacks[e],n=t.numberOfTimesToInvoke;(isNaN(n)||void 0===n||0<n)&&(t.numberOfTimesToInvoke-=1,t.callback())}r.startTimer()},triggerUserHasLeftPage:function(){if(r.active)for(var e=0;e<this.userLeftCallbacks.length;e++){var t=this.userLeftCallbacks[e],n=t.numberOfTimesToInvoke;(isNaN(n)||void 0===n||0<n)&&(t.numberOfTimesToInvoke-=1,t.callback())}},callAfterTimeElapsedInSeconds:function(e,t){r.timeElapsedCallbacks.push({timeInSeconds:e,callback:t,pending:!0})},checkState:function(){for(var e=0;e<r.timeElapsedCallbacks.length;e++)r.timeElapsedCallbacks[e].pending&&r.getTimeOnCurrentPageInSeconds()>r.timeElapsedCallbacks[e].timeInSeconds&&(r.timeElapsedCallbacks[e].callback(),r.timeElapsedCallbacks[e].pending=!1);!1===r.idle&&r.currentIdleTimeMs>r.idleTimeoutMs?(r.idle=!0,r.triggerUserHasLeftPage()):r.currentIdleTimeMs+=r.checkStateRateMs},visibilityChangeEventName:void 0,hiddenPropName:void 0,listenForVisibilityEvents:function(){void 0!==document.hidden?(r.hiddenPropName="hidden",r.visibilityChangeEventName="visibilitychange"):void 0!==document.mozHidden?(r.hiddenPropName="mozHidden",r.visibilityChangeEventName="mozvisibilitychange"):void 0!==document.msHidden?(r.hiddenPropName="msHidden",r.visibilityChangeEventName="msvisibilitychange"):void 0!==document.webkitHidden&&(r.hiddenPropName="webkitHidden",r.visibilityChangeEventName="webkitvisibilitychange"),document.addEventListener(r.visibilityChangeEventName,function(){document[r.hiddenPropName]?r.triggerUserHasLeftPage():r.triggerUserHasReturned()},!1),window.addEventListener("blur",function(){r.triggerUserHasLeftPage()}),window.addEventListener("focus",function(){r.triggerUserHasReturned()}),document.addEventListener("mousemove",function(){r.resetIdleCountdown()}),document.addEventListener("keyup",function(){r.resetIdleCountdown()}),document.addEventListener("touchstart",function(){r.resetIdleCountdown()}),window.addEventListener("scroll",function(){r.resetIdleCountdown()}),setInterval(function(){r.checkState()},r.checkStateRateMs)},websocket:void 0,websocketHost:void 0,setUpWebsocket:function(e){if(window.WebSocket&&e){var t=e.websocketHost;try{r.websocket=new WebSocket(t),window.onbeforeunload=function(){r.sendCurrentTime(e.appId)},r.websocket.onopen=function(){r.sendInitWsRequest(e.appId)},r.websocket.onerror=function(e){console&&console.log("Error occurred in websocket connection: "+e)},r.websocket.onmessage=function(e){console&&console.log(e.data)}}catch(e){console&&console.error("Failed to connect to websocket host.  Error:"+e)}}return this},websocketSend:function(e){r.websocket.send(JSON.stringify(e))},sendCurrentTime:function(e){var t={type:"INSERT_TIME",appId:e,timeOnPageMs:r.getTimeOnCurrentPageInMilliseconds(),pageName:r.currentPageName};r.websocketSend(t)},sendInitWsRequest:function(e){var t={type:"INIT",appId:e};r.websocketSend(t)},initialize:function(e){var t=r.idleTimeoutMs||30,n=r.currentPageName||"default-page-name",i=void 0,s=void 0;e&&(t=e.idleTimeoutInSeconds||t,n=e.currentPageName||n,i=e.websocketOptions,s=e.initialStartTime),r.setIdleDurationInSeconds(t).setCurrentPageName(n).setUpWebsocket(i).listenForVisibilityEvents(),r.startTimer(void 0,s)}};return r},"undefined"!=typeof module&&module.exports?module.exports=t():"function"==typeof define&&define.amd?define([],function(){return e.TimeMe=t()}):e.TimeMe=t()}).call(this);


// 把userleftcallback的r.stopAllTimers()拿掉了！有修！這樣才能處理popup打開不要停這件事

var is_current_site_addicted = false;

// set current_tab_active_or_not = true沒差，因為這個變數只在userleaves的時候會用到，也就是說只有兩種可能
// 1. user用”command + click“的方式打開這頁，此時雖然這tab不是active，但這個變數要用到一定是user到了這個tab又離開，所以一定已經被修正過了
// 2. user reload page的話，background的onActivated不會被觸發，此時這預設為true就可以確保user要leaves的時候不出錯
var current_tab_active_or_not = false;
var update_ms = 10;
var timeout_in_seconds;
var popup_is_opened = false;
var active_tabId;
var t = null;


function updateClock() {
  chrome.runtime.sendMessage({type: "elapsed_time", time: TimeMe.getTimeOnCurrentPageInSeconds().toFixed(2)});
  console.log(TimeMe.getTimeOnCurrentPageInSeconds());

}


TimeMe.callWhenUserLeaves(function (){

  console.log('what');

  if (!popup_is_opened){
    console.log("The user is not currently viewing the page!");
    unfire();
    TimeMe.stopAllTimers();
  }
  else {
    console.log("ㄋㄋㄋ");
    unfire();
    console.log(current_tab_active_or_not);
    if (current_tab_active_or_not){
      console.log('blablabla');
      fire();
    }
    else {
      console.log('lalala');
      TimeMe.stopAllTimers();
    }
  }
  // 因為idle也是call這個userleaves，獨立處理！
  if (TimeMe.idle === true) {
    unfire();
    TimeMe.stopAllTimers();
  }

});

// Executes every time a user returns
// 原本：在UserLeaves時unfire，然後在UserReturns時fire，但因為popup的關係，在UserLeaves不一定會unfire，所以要複雜一點，在UserReturns也要unfire。
TimeMe.callWhenUserReturns(function(){
	console.log("The user has come back!");
    unfire();
    fire();
});

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    switch(message.keep_going) {
    case "true":
        popup_is_opened = true;
        break;
      case "false":
        popup_is_opened = false;
        break;
    }

    switch(message.start_timer){
      case true:
        if (!TimeMe.active) {
           is_current_site_addicted = true;
          TimeMe.initialize({
            currentPageName: "my-home-page", // current page
            idleTimeoutInSeconds: message.idletime // seconds
            });

          timeout_in_seconds = Math.round(message.timeout*60);
          TimeMe.callAfterTimeElapsedInSeconds(timeout_in_seconds, timeoutEvent);


          if (current_tab_active_or_not) {
           fire();
          }
          else {
            TimeMe.stopAllTimers();
          }
          break;
        }
    }

    if (message.ask_background_for_tabId === "come on") {
      active_tabId = message.active_tabId;
      chrome.runtime.sendMessage({what_is_my_tabId: "answer me", my_i: message.your_i});
    }
    if (message.your_tabId) {
      current_tab_active_or_not = message.your_tabId === active_tabId;
      console.log(current_tab_active_or_not);
    }

    if (message.query === "is_current_site_addicted") {
      sendResponse({answer: is_current_site_addicted});
    }
  }
);

// 處理popup close
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "port_close") {
    port.onDisconnect.addListener(function() {
      popup_is_opened = false;
      console.log("WWWWW");
      unfire();
    });
  }
});


function fire() {
  if (popup_is_opened){
  updateClock();
  t = setInterval(updateClock,update_ms);
  }
}

function unfire() {
  if (t){
    clearInterval(t);
    t = null; // 設成null之後就可以判斷到底clear了沒
  }
}

window.addEventListener('blur', function () {
  console.log('?QSAFDSDFASDF')
});

// 開場直接問我現在是不是activate
chrome.runtime.sendMessage({am_i_currently_active: "answer me"}, function (response) {
  current_tab_active_or_not = response.answer;
  console.log(current_tab_active_or_not);
});

function timeoutEvent() {
  // alert('???????asdfasdf');
  var answer = confirm ("Time's up! Stop wasting your time on this site!");
  if (answer) {
    alert ("I'm so proud of you.\nI will close this tab for you.");
    chrome.runtime.sendMessage({close_this_tab: true});
  }
  else
    alert ("You Are So Disappointing.\nI will remind you another timeout from now.");
    // TimeMe.timeElapsedCallbacks = [];
    TimeMe.callAfterTimeElapsedInSeconds(TimeMe.getTimeOnCurrentPageInSeconds() + timeout_in_seconds, timeoutEvent);
}