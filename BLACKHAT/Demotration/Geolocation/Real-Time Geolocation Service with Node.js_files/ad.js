var text='Your Site\'s Slow! A2 Hosting\'s Blazing Fast SSDs Can Help! Try Our SwiftServers!';var link='http://adn.fusionads.net/click?creative_id=690&publisher_id=184&792123599427.1523';function include_fusion_ad() { var fa = document.getElementById('fusion_ad');var fe = document.createElement('span');fe.className += 'fusionentire';var fli = document.createElement('a');fli.href = link;fli.title = text;fli.target='_top';var fi = document.createElement('img');fi.src = 'http://adn.fusionads.net/creatives/690-165082-1364829691.jpg';fi.className += 'fusionimg';fi.alt = text;fi.border = '0';fi.height='100';fi.width='130'; var flt = document.createElement('a');flt.href = link;flt.className += 'fusiontext';flt.innerHTML = text;flt.title = text;flt.target='_top';fli.appendChild(fi);fe.appendChild(fli);fe.appendChild(flt);fa.insertBefore(fe, fa.childNodes[0]); } try { include_fusion_ad(); } catch(err) { window.onload = include_fusion_ad; }