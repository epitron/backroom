// window.onload = function(){
//   (function(){

//     var msg_div = document.getElementById('msgs');

//     function show(json) {
//       data = JSON.parse(json);
//       msg_div.innerHTML += '[' + data["time"] + '] &lt;' + data["nick"] + '&gt; ' + data["message"] + '<br />';
//     }

//     var ws       = new WebSocket('ws://' + window.location.host + window.location.pathname);
//     ws.onopen    = function()  { show('websocket opened'); };
//     ws.onclose   = function()  { show('websocket closed'); }
//     ws.onmessage = function(m) { console.log(m); show(m.data); };

//     var form_tag = document.getElementById('form');

//     var input     = document.getElementById('input');
//     // input.onclick = function(){ input.value = "" };
    
//     form_tag.onsubmit = function(){
//       ws.send(input.value);
//       input.value = "";
//       return false;
//     }

//   })();
// }

function setup_websockets() {
    var msg_div = document.getElementById('msgs');

    function show(msg) {
      msg_div.innerHTML += msg + '<br />';
    }

    function show_message(json) {
      msg_hash = JSON.parse(json);
      show('['+msg_hash["time"]+'] &lt;'+msg_hash["nick"]+'&gt; '+msg_hash["message"])
    }

    var ws       = new WebSocket('ws://' + window.location.host + window.location.pathname);
    ws.onopen    = function()  { show('websocket opened'); };
    ws.onclose   = function()  { show('websocket closed'); }
    ws.onmessage = function(m) { console.log(m); show(m.data); };

    var form_tag = document.getElementById('form');

    var input     = document.getElementById('input');
    // input.onclick = function(){ input.value = "" };
    input.focus();

    var nick = document.getElementById('nick');

    form_tag.onsubmit = function(){
      json = JSON.stringify({nick: nick.value, message: input.value});
      ws.send(json);
      input.value = "";
      return false;
    }
}