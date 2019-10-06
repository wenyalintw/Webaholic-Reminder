function deleteRow(tar, tbody) {
  var index = tar.parentElement.rowIndex;
  // -2 since there is a 表頭
  document.getElementById("mytbody").deleteRow(index-2);

  updateSites(tbody);

  reindex(tbody);

}

function newaddrow(tbody, site_regex, mode) {

  var row;
  switch (mode) {
    case "add site":
      row = tbody.insertRow(tbody.rows.length);
      break;
    case "load site":
      row = tbody.insertRow(0);
      break;

  }
  var cell_index = row.insertCell(0);
  var cell_site_regex = row.insertCell(1);
  var cell_delete_icon = row.insertCell(2);

  cell_index.className = "cell_index";
  cell_site_regex.className = "cell_site_regex";
  cell_delete_icon.className = "cell_delete_icon";

  cell_index.innerHTML = tbody.rows.length;
  cell_site_regex.innerHTML = `<span class="site">${site_regex}</span>`;
  cell_delete_icon.innerHTML = '<i class="button delete">delete</i>';
  cell_delete_icon.addEventListener('click', ()=>deleteRow(cell_delete_icon, tbody));


}

function reindex(tbody) {
  for (var r = 0; r < tbody.rows.length; r++) {
    tbody.rows[r].cells[0].innerHTML = r+1;
  }
}


function addRow() {
  var site_regex = document.getElementById('siteInput');
  if (siteInput.value === "") {
    alert("Please key In regex of site.");
    return;
  }
  var tbody = document.getElementById("mytbody");
  newaddrow(tbody, site_regex.value, "add site");
  siteInput.value = "";
  updateSites(tbody);
  reindex(tbody);
  // scroll to last row
  tbody.rows[tbody.rows.length-1].scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
}

function updateSites(tbody) {
  var sites = tbody.getElementsByClassName('site');
  bg.links=[];
  Array.from(sites).forEach((site) => {
    console.log(site.textContent);
    // bg.links.push(site.textContent);
    bg.links.unshift(site.textContent);
  });
  console.log(bg.links);

  // also save to backup
  bg.links_backup = bg.links;
}

function loadSites(){
  var tbody = document.getElementById("mytbody");
  bg.links.forEach((value, index, array) => {
    newaddrow(tbody, value, "load site");
  });
  reindex(tbody);
}



function onswitch() {
  bg.state = this.checked;
  if (bg.state) {
    // two situation: (1) restore from backup (2) nothing change, which means links is same as backup already
    bg.links = bg.links_backup;
  }
  else {
    // 關閉的時候把bg的links清空，這樣就不會有任何配對了
    bg.links = [];
  }
}


function timeset() {

  var timeout = Number(document.getElementById("timeout").value);
  var idletime = Number(document.getElementById("idletime").value);

  // after Number() conversion, non-number input will result as NaN
  // NaN is viewed as false in condition expression
  if ( timeout && idletime) {
    bg.timeout = timeout;
    bg.idletime = idletime;
  }
  else {
    alert("Values need to be \"NUMBER\".");
  }
}


function update_message() {
  // popup open
  // 用lastFocusedWindow instead of currentWindow
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {

    if (bg.state) {
      document.getElementById("turnedoff").innerHTML = "";
      // send message to check if current site is on the list
      chrome.tabs.sendMessage(tabs[0].id, {query: "is_current_site_addicted"}, function (response) {
        // use response to control要顯示的是哪一行
        switch (response.answer) {
          case true:
            document.getElementById("congratulations").innerHTML = "";
            setInterval(() => {
              document.getElementById("sec").textContent = bg.current_tab_time;
            }, 10);
            break;
          case false:
            document.getElementById("time_spent").innerHTML = "";
            break;
        }
      });
    }
    else {
      document.getElementById("congratulations").innerHTML = "";
      document.getElementById("time_spent").innerHTML = "";
      document.getElementById("main").innerHTML = "";
    }
    // send message to keep timer going
    chrome.tabs.sendMessage(tabs[0].id, {keep_going:"true"}, function(response){});
    var port = chrome.tabs.connect(tabs[0].id, {name: "port_close"});
  });


}


function transitionEndEventName () {
    var i,
        undefined,
        el = document.createElement('div'),
        transitions = {
            'transition':'transitionend',
            'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };

    for (i in transitions) {
        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
            return transitions[i];
        }
    }

}

// 宣告變數時順練直接先呼叫一次transitionEndEventName，先執行一次記錄所有transitionEnd之類的
var transitionEnd = transitionEndEventName();
document.getElementById("slider").addEventListener(transitionEnd, () => {
  location.reload();
});

// https://ithelp.ithome.com.tw/articles/10188558
// https://crxdoc-zh.appspot.com/extensions/tabs
// chrome.tabs.getSelected(null, getSelectedTab);
// note：對content用tabs，對background用runtime
var bg = chrome.extension.getBackgroundPage();
document.getElementById('addButton').addEventListener('click', addRow);
document.getElementById('timeButton').addEventListener('click', timeset);
document.getElementById('checkbox').addEventListener('click', onswitch);
update_message();
loadSites();
document.getElementById("checkbox").checked = bg.state;
document.getElementById("timeout").value = bg.timeout;
document.getElementById("idletime").value = bg.idletime;