(function(){
  var wn = window, dc = document;
  var bdashHost = "//analytics.fs-bdash.com";
  var b64char = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+-";
  var act_vt = '';

  var Utils = {};
  Utils.toString64 = function(n){var str64 = ""; while(n > 0){str64 = b64char.charAt(n % 64) + str64;n = Math.floor(n / 64);} return str64;};
  Utils.encodeURL = function(s){
    if(typeof(encodeURIComponent) === 'function'){return encodeURIComponent(s).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");}
    else{return escape(s);}
  };
  Utils.isObject = function(a){return ("[object Object]" === Object.prototype.toString.apply(a));};
  Utils.isString = function(a){return ("[object String]" === Object.prototype.toString.apply(a));};
  Utils.isArray = function(a){return ("[object Array]" === Object.prototype.toString.apply(a));};
  Utils.isFunction = function(a){return ("[object Function]" === Object.prototype.toString.apply(a));};
  Utils.contains = function(a,b){for(var i=0;i<a.length;i++)if(b===a[i])return true;return false;};
  Utils.capitalizeFirstLetter = function(a){return a.charAt(0).toUpperCase() + a.slice(1);};
  Utils.makeRandomNumber = function(m){return Math.round(Math.random() * m);};
  Utils.addListener = function(a,e,f){if(a.attachEvent){a.attachEvent('on' + e, f);}else if(a.addEventListener){a.addEventListener(e, f, false);}};
  //Utils.removeListner = function(a,e,f){if(a.detachEvent){a.detachEvent('on' + e, f);} else if(a.removeEventLister){a.removeEventLister(e, f, false);}};
  var Status = new function(){
    var flags = [];
    this.set = function(a){flags[a] = true;};
    this.get = function(){
      var b = [];
      for(var i = 0; i < flags.length; i++){flags[i] && (b[Math.floor(i/6)] = b[Math.floor(i/6)] | 1<<(i%6));}
      for(var j = 0; j < b.length; j++){b[i] = b64char.charAt(b[j]||0);}
      return b.join("");
    };
  }();
  var getReferrer = function(){
    var m = dc.location.search.match(/_bdsr_referrer=([^&#]*)([&#].+)?$/);
    var ref = m ? m[1] : dc.referrer;
    return ref;
  };
  var Device = {};
  Device.getMonitorResolution = function(){return [wn.screen.width, wn.screen.height].join("x");};
  Device.getWindowSize = function(){var w = (wn.innerWidth) ? wn.innerWidth : dc.documentElement.clientWidth, h = (wn.innerHeight) ? wn.innerHeight : dc.documentElement.clientHeight;return [w, h].join("x");};
  Device.getFlashVersion = function(){
    var navi = wn.navigator, ver, ao;
    try{
      if(navi.plugins && navi.plugins.length){
        for(var i = 0; i < navi.plugins.length && !ver; i++){
          var p = navi.plugins[i];
          (-1 < p.description.indexOf("Shockwave Flash")) && (ver = p.description);
        }
      }
      if(!ver){
        ao = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"), ver = ao.GetVariable("$ver");
      }
      if(!ver){
        ao = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), ao.AllowScriptAccess = "always", ver = ao.GetVariable("$ver");
      }
      if(!ver){
        ao = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), ver = ao.GetVariable("$ver");
      }
    } catch(e){}
    ver && (ver = ver.match(/[\d]+/g).join("."));
    return ver;
  };
  Device.getJavaEnabled = function(){return (Utils.isFunction(wn.navigator.javaEnabled)&&wn.navigator.javaEnabled())?1:0;};
  Device.getLanguage = function(){return (wn.navigator.language||wn.navigator.browserLanguage||"").toLowerCase();};
  function getGclid(){var q=dc.location.search;if(q.indexOf('gclid=')>=0){var m=q.match(/^(.*)gclid=([^&#]+)([&#].+)?/);return m?m[2]:"";}}
  var SplitRun = new function(){
    var m = dc.location.search.match(/_bdsr_id=([^:]+):(\d+):?([^:]+)?:?([^&#]+)?([&#].+)?$/);
    this.getCode = function(){
      if(m){
        return m[1];
      } else {
        var cks = Cookie.getValues('spritrun_cd');
        return cks ? cks[0] : '';
      }
    };
    this.getPattern = function(){
      if(m){
        return m[2];
      } else {
        var cks = Cookie.getValues('spritrun_pattern');
        return cks ? cks[0] : '';
      }
    };
    this.getVariation = function(){
      if(m){
        return m[3];
      } else {
        var cks = Cookie.getValues('split_run_variation');
        return cks ? cks[0] : '';
      }
    };
    this.getTimestamp = function(){
      if(m){
        return m[4];
      } else {
        return '';
      }
    };
  };

  var Beacon = new function(){
    var getApiUrl = function(){
      var p = "https:" === dc.location.protocol ? "https:" : "http:";
      return (p + bdashHost + "/trackings/create");
    };
    var sendByImg = function(q, f){
      var im = new Image(1, 1);
      im.src = getApiUrl() + "?" + q;
      im.onload = im.onerror = function(){im.onload = im.onerror = null;f();};
    };
    var sendByXMLReq = function(q, f){
      if(!wn.XMLHttpRequest)return false;
      var req = new wn.XMLHttpRequest();
      if(!("withCredentials"in req))return false;
      req.open("POST", getApiUrl(), true);
      req.withCredentials = true;
      req.setRequestHeader("Content-Type","text/plain");
      req.onreadystatechange = function(){4 === req.readyState && (f(), req = null);};
      req.send(q);
      return true;
    };
    var sendByXDomReq = function(q, f){
      if(!wn.XDomainRequest){return false;};
      var req = new wn.XDomainRequest();
      req.open("POST", getApiUrl());
      req.onerror = function(){f();};
      req.onload = f;
      req.send(q);
      return true;
    };
    this.send = function(q, f){
      f = f || function(){};
      if(2036 >= q.length){
        sendByImg(q, f);
      } else if(4096 >= q.length && (0 > wn.navigator.userAgent.indexOf("Firefox") || [].reduce)){
      /* q.length should be 8192 but tentatively set to 4096 in view of server load */
      /*} else if(8192 >= q.length && (0 > wn.navigator.userAgent.indexOf("Firefox") || [].reduce)){*/
      /*  sendByXMLReq(q, f) || sendByXDomReq(q, f) || f();*/
      }
    };
  }();
  var Cookie = {};
  Cookie.getValues = function(n){
    var vals = [], cks = dc.cookie.split(";");
    var r = new RegExp("^\\s*" + n + "=\\s*(.*)\\s*$");
    for(var i = 0; i < cks.length; i++){
      var m = cks[i].match(r);
      m && (vals.push(m[1]));
    }
    return vals;
  };
  Cookie.set = function(n, v, e, d, p){
    var nc = n + "=" + v + ";";
    e && (nc += "expires=" + (new Date((new Date()).getTime() + e)).toUTCString() + ";");
    d && (nc += "domain=" + d + ";");
    p && (nc += "path=" + (p || "/") + ";");
    var bc = dc.cookie;
    dc.cookie = nc;
    if(dc.cookie !==  bc) return true;
    var vals = Cookie.getValues(n);
    for(var i = 0; i < vals.length; i++){
      if(v === vals[i]) return true;
    }
    return false;
  };
  Cookie.filterByDomainLevel = function(v, l){
    var d = [], e = [], g;
    for(var i = 0; i < v.length; i++){
      var val = v[i];
      if(val.domainLevel === l)d.push(val);
      else if(undefined === g || val.domainLevel < g){e=[val];g=val.domainLevel;}
      else if(val.domainLevel === g)e.push(val);
    }
    return 0 < d.length ? (Status.set(5),d):(Status.set(6),e);
  };
  var Linker = {};
  Linker.linkDomains = function(a, p){
    function isSelfLink(h){return h === dc.location.hostname;}
    function isIncluded(a, h){for(var i = 0; i < a.length; i++){if(0 <= h.indexOf(a[i]))return true;}return false;}
    function isExe(h){return h&&h.match(/\.exe$/);}
    function getLinkerQuery(p, h){
      var hwl = h, m = hwl.match(/(.*)([?&#])(?:_bdld=[^&#]*)(?:&?)(.*)/);
      m && (3 <= m.length) && (hwl = m[1] + (m[3] ? m[2] + m[3] : ""));
      var pp = hwl.indexOf("/"), qp = hwl.indexOf("?", (0 > pp ? 0 : pp)), hp = hwl.indexOf("#", (0 > qp ? 0 : qp)), query = ((0 > qp) ? "?" : "&" ) + "_bdld=" + p;
      return ((0 > hp) ? hwl + query : hwl.substr(0, hp) + query + hwl.substr(hp));
    }
    function addLinkerToForm(p, f){
      if(!f.getAttribute('action')) return false;
      var m = f.method.toUpperCase();
      if("GET" === m){
        var c = f.childNodes || [];
        for(var i = 0; i < c.length; i++){
          if("_bdld" === c[i].name){Status.set(21);c[i].setAttribute("value", p);return;}
        }
        Status.set(22);
        var e = dc.createElement('input');
        e.setAttribute("type", "hidden");
        e.setAttribute("name", "_bdld");
        e.setAttribute("value", p);
        f.appendChild(e);
      } else if("POST" === m){
        Status.set(23);
        f.setAttribute('action', getLinkerQuery(p, f.getAttribute('action')));
      }
    }
    var linkDomainForLink = (function(){
      return function(e){
        try{
          var et = e.target || e.srcElement;
          for(var i = 0; et && et.nodeName && !(et.nodeName.match(/^(a|area)$/i) && et.href) && i < 100; i++){
            et = et.parentNode;
          }
          if(et && /^https?:$/.test(et.protocol) && !isSelfLink(et.hostname) && isIncluded(a, et.hostname) && !isExe(et.href)){
            Status.set(19);
            et.href = getLinkerQuery(p, et.href);
          }
        }catch(ex){}
      };
    })();
    var linkDomainForForm = (function(){
      return function(e){
        var et = e.target || e.srcElement;
        if(et && et.getAttribute('action')){
          var m = et.getAttribute('action').match(/^https?:\/\/([^\/:]+)/);
          if(m && !isSelfLink(m[1]) && isIncluded(a, m[1])){Status.set(20);addLinkerToForm(p, et);};
        }
      };
    })();
    Utils.addListener(dc, 'mousedown', linkDomainForLink);
    Utils.addListener(dc, 'keyup', linkDomainForLink);
    Utils.addListener(dc, 'touchstart', linkDomainForLink);
    for(var i = 0; i < dc.forms.length; i++){
      Utils.addListener(dc.forms[i], "submit", linkDomainForForm);
    }
  };
  Linker.getIdFromLinker = function(){
    if(dc.referrer){
      var m = dc.location.href.match(/[?&#]_bdld=([^&#]*)/);
      return m && m[1] ? m[1] : "";
    }
  };
  Linker.removeIdFromUrl = function() {
    try {
      if (!Utils.isObject(wn.bdashFlags)||!wn.bdashFlags.removeBdld) return;
      var p = dc.location.href;
      var m = p.match(/(.*)([?&])(?:_bdld=[^&#]*)(?:&?)(.*)/);
      if (m && 3 <= m.length) {
        p = m[1] + (m[3] ? m[2] + m[3] : "");
      }
      if (Utils.isFunction(history.replaceState)) {
        history.replaceState('','',p);
        TrackController.tracker.set("location", dc.location.href);
      }
    } catch(e) {}
  };
  var Event = {};
  Event.getTarget = function(e, t){
    function getNodeName(et){
      if(!et.nodeName){return "";}
      if(et.nodeName.match(/^(a|area|button|img)$/i)){return et.nodeName;}
      else if(et.nodeName.toUpperCase() === "INPUT" && (et.type.toUpperCase() === "BUTTON" || et.type.toUpperCase() === "SUBMIT")){return "BUTTON";}
      else {return "";}
    }
    var et = e.srcElement || e.target;
    var aet = {}, tgt = [];
    if(t > 0){
      for(var i = 0; et && i < t; i++){
        aet.ndNm = aet.ndNm || getNodeName(et);
        aet.id = aet.id || et.id;
        aet.nm = aet.nm || et.name;
        aet.cls = aet.cls || et.className;
        aet.href = aet.href || et.href;
        aet.src = aet.src || et.src;
        if(aet.ndNm && aet.id && aet.nm && aet.cls && aet.href && aet.src){
          Status.set(16);
          break;
        }
        et = et.parentElement;
      }
    }else{
      aet = et;
    }
    if(aet && aet.ndNm){
      Status.set(17);
      tgt.push("nodeName:" + aet.ndNm);
      aet.id && tgt.push("id:" + aet.id);
      aet.nm && tgt.push("name:" + aet.nm);
      aet.cls && tgt.push("class:" + aet.cls);
      aet.href && tgt.push("href:" + aet.href);
      aet.src && tgt.push("src:" + aet.src);
    }
    return tgt.join(";");
  };
  Event.getPoint = function(e){return [e.pageX, e.pageY].join("x");};
  var Library = {
    sha256:function(B){function r(a,c,b){var f=0,e=[0],g="",h=null,g=b||"UTF8";if("UTF8"!==g&&"UTF16"!==g)throw"encoding must be UTF8 or UTF16";if("HEX"===c){if(0!==a.length%2)throw"srcString of HEX type must be in byte increments";h=u(a);f=h.binLen;e=h.value;}else if("ASCII"===c||"TEXT"===c)h=v(a,g),f=h.binLen,e=h.value;else if("B64"===c)h=w(a),f=h.binLen,e=h.value;else throw"inputFormat must be HEX, TEXT, ASCII, or B64";this.getHash=function(a,c,b,g){var h=null,d=e.slice(),l=f,m;3===arguments.length?"number"!==
        typeof b&&(g=b,b=1):2===arguments.length&&(b=1);if(b!==parseInt(b,10)||1>b)throw"numRounds must a integer >= 1";switch(c){case "HEX":h=x;break;case "B64":h=y;break;default:throw"format must be HEX or B64";}if("SHA-224"===a)for(m=0;m<b;m++)d=q(d,l,a),l=224;else if("SHA-256"===a)for(m=0;m<b;m++)d=q(d,l,a),l=256;else throw"Chosen SHA variant is not supported";return h(d,z(g));};this.getHMAC=function(a,b,c,h,k){var d,l,m,n,A=[],s=[];d=null;switch(h){case "HEX":h=x;break;case "B64":h=y;break;default:throw"outputFormat must be HEX or B64";
        }if("SHA-224"===c)l=64,n=224;else if("SHA-256"===c)l=64,n=256;else throw"Chosen SHA variant is not supported";if("HEX"===b)d=u(a),m=d.binLen,d=d.value;else if("ASCII"===b||"TEXT"===b)d=v(a,g),m=d.binLen,d=d.value;else if("B64"===b)d=w(a),m=d.binLen,d=d.value;else throw"inputFormat must be HEX, TEXT, ASCII, or B64";a=8*l;b=l/4-1;l<m/8?(d=q(d,m,c),d[b]&=4294967040):l>m/8&&(d[b]&=4294967040);for(l=0;l<=b;l+=1)A[l]=d[l]^909522486,s[l]=d[l]^1549556828;c=q(s.concat(q(A.concat(e),a+f,c)),a+n,c);return h(c,
        z(k));};}function v(a,c){var b=[],f,e=[],g=0,h;if("UTF8"===c)for(h=0;h<a.length;h+=1)for(f=a.charCodeAt(h),e=[],2048<f?(e[0]=224|(f&61440)>>>12,e[1]=128|(f&4032)>>>6,e[2]=128|f&63):128<f?(e[0]=192|(f&1984)>>>6,e[1]=128|f&63):e[0]=f,f=0;f<e.length;f+=1)b[g>>>2]|=e[f]<<24-g%4*8,g+=1;else if("UTF16"===c)for(h=0;h<a.length;h+=1)b[g>>>2]|=a.charCodeAt(h)<<16-g%4*8,g+=2;return{value:b,binLen:8*g};}function u(a){var c=[],b=a.length,f,e;if(0!==b%2)throw"String of HEX type must be in byte increments";for(f=0;f<
        b;f+=2){e=parseInt(a.substr(f,2),16);if(isNaN(e))throw"String of HEX type contains invalid characters";c[f>>>3]|=e<<24-f%8*4;}return{value:c,binLen:4*b};}function w(a){var c=[],b=0,f,e,g,h,k;if(-1===a.search(/^[a-zA-Z0-9=+\/]+$/))throw"Invalid character in base-64 string";f=a.indexOf("=");a=a.replace(/\=/g,"");if(-1!==f&&f<a.length)throw"Invalid '=' found in base-64 string";for(e=0;e<a.length;e+=4){k=a.substr(e,4);for(g=h=0;g<k.length;g+=1)f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(k[g]),
        h|=f<<18-6*g;for(g=0;g<k.length-1;g+=1)c[b>>2]|=(h>>>16-8*g&255)<<24-b%4*8,b+=1;}return{value:c,binLen:8*b};}function x(a,c){var b="",f=4*a.length,e,g;for(e=0;e<f;e+=1)g=a[e>>>2]>>>8*(3-e%4),b+="0123456789abcdef".charAt(g>>>4&15)+"0123456789abcdef".charAt(g&15);return c.outputUpper?b.toUpperCase():b;}function y(a,c){var b="",f=4*a.length,e,g,h;for(e=0;e<f;e+=3)for(h=(a[e>>>2]>>>8*(3-e%4)&255)<<16|(a[e+1>>>2]>>>8*(3-(e+1)%4)&255)<<8|a[e+2>>>2]>>>8*(3-(e+2)%4)&255,g=0;4>g;g+=1)b=8*e+6*g<=32*a.length?b+
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h>>>6*(3-g)&63):b+c.b64Pad;return b;}function z(a){var c={outputUpper:!1,b64Pad:"="};try{a.hasOwnProperty("outputUpper")&&(c.outputUpper=a.outputUpper),a.hasOwnProperty("b64Pad")&&(c.b64Pad=a.b64Pad);}catch(b){}if("boolean"!==typeof c.outputUpper)throw"Invalid outputUpper formatting option";if("string"!==typeof c.b64Pad)throw"Invalid b64Pad formatting option";return c;}function k(a,c){return a>>>c|a<<32-c;}function I(a,c,b){return a&
        c^~a&b;}function J(a,c,b){return a&c^a&b^c&b;}function K(a){return k(a,2)^k(a,13)^k(a,22);}function L(a){return k(a,6)^k(a,11)^k(a,25);}function M(a){return k(a,7)^k(a,18)^a>>>3;}function N(a){return k(a,17)^k(a,19)^a>>>10;}function O(a,c){var b=(a&65535)+(c&65535);return((a>>>16)+(c>>>16)+(b>>>16)&65535)<<16|b&65535;}function P(a,c,b,f){var e=(a&65535)+(c&65535)+(b&65535)+(f&65535);return((a>>>16)+(c>>>16)+(b>>>16)+(f>>>16)+(e>>>16)&65535)<<16|e&65535;}function Q(a,c,b,f,e){var g=(a&65535)+(c&65535)+(b&
        65535)+(f&65535)+(e&65535);return((a>>>16)+(c>>>16)+(b>>>16)+(f>>>16)+(e>>>16)+(g>>>16)&65535)<<16|g&65535;}function q(a,c,b){var f,e,g,h,k,q,r,C,u,d,l,m,n,A,s,p,v,w,x,y,z,D,E,F,G,t=[],H,B=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,
        3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];d=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428];f=[1779033703,3144134277,1013904242,
        2773480762,1359893119,2600822924,528734635,1541459225];if("SHA-224"===b||"SHA-256"===b)l=64,A=16,s=1,G=Number,p=O,v=P,w=Q,x=M,y=N,z=K,D=L,F=J,E=I,d="SHA-224"===b?d:f;else throw"Unexpected error in SHA-2 implementation";a[c>>>5]|=128<<24-c%32;a[(c+65>>>9<<4)+15]=c;H=a.length;for(m=0;m<H;m+=A){c=d[0];f=d[1];e=d[2];g=d[3];h=d[4];k=d[5];q=d[6];r=d[7];for(n=0;n<l;n+=1)t[n]=16>n?new G(a[n*s+m],a[n*s+m+1]):v(y(t[n-2]),t[n-7],x(t[n-15]),t[n-16]),C=w(r,D(h),E(h,k,q),B[n],t[n]),u=p(z(c),F(c,f,e)),r=q,q=k,k=
        h,h=p(g,C),g=e,e=f,f=c,c=p(C,u);d[0]=p(c,d[0]);d[1]=p(f,d[1]);d[2]=p(e,d[2]);d[3]=p(g,d[3]);d[4]=p(h,d[4]);d[5]=p(k,d[5]);d[6]=p(q,d[6]);d[7]=p(r,d[7])}if("SHA-224"===b)a=[d[0],d[1],d[2],d[3],d[4],d[5],d[6]];else if("SHA-256"===b)a=d;else throw"Unexpected error in SHA-2 implementation";return a;}"function"===typeof define&&typeof define.amd?define(function(){return r;}):"undefined"!==typeof exports?"undefined"!==typeof module&&module.exports?module.exports=exports=r:exports=r:B.jsSHA=r}
  };
  Library.execute = function(lib,a){
    Library.require(lib);
    switch(lib){
      case "sha256":
        for(var p in a){
          if(a.hasOwnProperty(p) && Utils.isArray(a[p])){
            var s = "";
            for(var i = 0; i < a[p].length; i++) s += a[p][i];
            var sha = new jsSHA(s, "TEXT");
            var h = sha.getHash("SHA-256", "HEX", 1);
            TrackController.tracker.set(p, h);
          }
        }
        break;
    }
  };
  Library.require = function(a){
    if(!TrackController.libraries.get(a)){
      TrackController.libraries.newParam(a, null, Library[a](wn));
      //var n = a + ".js";
      //var p = "https:" === dc.location.protocol ? "https:" : "http:";
      //var src = p + bdashHost + "/library/" + n;
      //this.load(src, a);
    }
  };
  //Library.load = function(a,b){
  //  if(a){
  //    var c = dc.createElement("script");
  //    c.type = "text/javascript", c.src = a, c.id = b;// c.async = true;
  //    var d = dc.getElementsByTagName("script")[0];
  //    d.parentNode.insertBefore(c,d);
  // }
  //};
  var QueryParameter = function(n,v){this.name = n;this.value = v;};
  var Map = function(){this.keys = [];this.base = {};this.hit = {};};
  Map.prototype.newParam = function(n, p, v, f){
    var qp = new QueryParameter(p, v);
    !Utils.contains(this.keys, n) && this.keys.push(n);
    f ? this.hit[n] = qp : this.base[n] = qp;
  };
  Map.prototype.set = function(k, v, f){f ? this.hit[k] = v : this.base[k] = v;};
  Map.prototype.get = function(k){return this.base[k] || this.hit[k];};
  Map.prototype.clear = function(){this.hit = {};};
  Map.prototype.query = function(){var q = [];for(var i = 0; i < this.keys.length; i++){var prm = this.get(this.keys[i]);prm && prm.name && prm.value && q.push(prm.name + "=" + Utils.encodeURL(prm.value));}return q.join("&");};
  function checkPreview(){return ("preview" === wn.navigator.loadPurpose)?false:true;}
  function checkProtocol(){var p = dc.location.protocol; return ("http:" !== p && "https:" !== p)?false:true;}
  function validateAccountId(t){return /^BD-([A-Z0-9]{6})-(\d+)$/.test(t.get("accountId"));}
  var Filter = function(){this.list = [];};
  Filter.prototype.add = function(f){this.list.push(f);};
  Filter.prototype.exec = function(t){for(var i=0;i<this.list.length;i++){if(false===this.list[i](t)){return false;}}return true;};
  var Handler = function(){};
  Handler.prototype.sendReady = function(e,t){};
  Handler.prototype.sendEvent = function(e,t){
    e = e || wn.event;
    var et = Event.getTarget(e, 10);
    if(et){
      Status.set(18);
      t.send({type:'event', eventTarget:et, eventAction:e.type, eventPoint:Event.getPoint(e)});
    }
  };
  Handler.prototype.sendUnload = function(e,t){
    e = e || wn.event;
    t.send({type:'unload', eventTarget:Event.getTarget(e, 0), eventAction:e.type});
  };
  var Tracker = function(a){
    this.prm = new Map();
    this.prm.newParam("accountId", "ac", a['id']);
    this.prm.newParam("visitorId", "vt");
    this.prm.newParam("cookieName", "cn", "_bdck");
    this.prm.newParam("cookieDomain", "cd", dc.domain || "");
    this.prm.newParam("cookiePath", "cp", "/");
    this.prm.newParam("cookieExpires", "ce", 63072000000);
    this.prm.newParam("referrer", "rf", getReferrer());
    this.prm.newParam("location", "ln", dc.location.href);
    this.prm.newParam("pageTitle", "pt", dc.title);
    this.prm.newParam("monitorColor", "mc", wn.screen.colorDepth);
    this.prm.newParam("monitorResolution", "mr", Device.getMonitorResolution());
    this.prm.newParam("windowSize", "ws", Device.getWindowSize());
    this.prm.newParam("encoding", "en", dc.characterSet || dc.charset);
    this.prm.newParam("flashVersion", "fv", Device.getFlashVersion());
    this.prm.newParam("javaEnabled", "je", Device.getJavaEnabled());
    this.prm.newParam("language", "lg", Device.getLanguage());
    this.prm.newParam("hitType", "ht", undefined);
    this.prm.newParam("hitOrder", "ho", 0);
    this.prm.newParam("linkerParam", "lp");
    this.prm.newParam("linkedDomain", "ld", dc.domain || "");
    this.prm.newParam("customerId", "cid");
    this.prm.newParam("customerName", "cnm");
    this.prm.newParam("customerGender", "cgd");
    this.prm.newParam("customerBirth", "cbt");
    this.prm.newParam("customerAge", "cag");
    this.prm.newParam("customerEmail", "cml");
    this.prm.newParam("customerTel", "ctl");
    this.prm.newParam("customerZip", "czp");
    this.prm.newParam("customerAddr", "cad");
    this.prm.newParam("customerOrganization", "coz");
    this.prm.newParam("customerRole", "crl");
    this.prm.newParam("customerLabel", "clb");
    this.prm.newParam("customerValue", "cvl");
    this.prm.newParam("relationalKey", "rky");
    this.prm.newParam("cryptVersion", "cryv")
    this.prm.newParam("callTrackingNumber", "ctn");
    this.prm.newParam("gclid", "gclid", getGclid());
    this.prm.newParam("splitRunCode", "srcde", SplitRun.getCode());
    this.prm.newParam("splitRunPattern", "srptn", SplitRun.getPattern());
    this.prm.newParam("splitRunVariation", "srvar", SplitRun.getVariation());
    this.prm.newParam("itemCode", "itmcde", "");
    this.prm.newParam("itemName", "itmnme", "");
    this.prm.newParam("itemPrice", "itmprc", 0);
    this.prm.newParam("tagException", "ex", "");
    this.prm.newParam("status", "st", "");
    this.prm.newParam("tagVersion", "v", "4.0.0");
    var h = new Handler();
    this.prm.newParam("sendReady", null, h.sendReady);
    this.prm.newParam("sendEvent", null, h.sendEvent);
    this.prm.newParam("sendUnload", null, h.sendUnload);
    this.filter = new Filter();
    this.filter.add(checkPreview);
    this.filter.add(checkProtocol);
    this.filter.add(validateAccountId);
    Status.set(0);
  };
  Tracker.prototype.get = function(k){
    var p = this.prm.get(k);
    return p && (p.value || "");
  };
  Tracker.prototype.set = function(k, v){
    var p = this.prm.get(k);
    if(p){
      p.value = v;
      this.prm.set(k, p);
    }else{
      var customItems = ['customTrackingProperty:ctp','customTrackingValue:ctv','customSessionProperty:csp','customSessionValue:csv','customVisitorProperty:cvp','customVisitorValue:cvv'];
      for(var i = 0; i < customItems.length; i++){
        var ci = customItems[i].split(":");
        var r = new RegExp(ci[0] + "(\\d+)");
        var m = r.exec(k);
        m && this.prm.newParam(m[0], ci[1] + m[1], v);
      }
    }
  };
  Tracker.prototype.setCrypt = function(a){
    var CT = ["RSA","AES"];
    var ckey = a.ckey, ctype = a.ctype, params = a.params;
    var isLibLoaded = (ctype == CT[0] && !!wn.JSEncrypt) || (ctype == CT[1] && !!wn.CryptoJS);
    if (!ckey || !isLibLoaded) return;
    for (var k in params) {
      if (!params[k]) {
        this.set(k, params[k]);
        continue;
      }
      try {
        if (ctype == CT[0]) {
          var rsa = new wn.JSEncrypt();
          rsa.setPublicKey(ckey);
          var encrypted = rsa.encrypt(params[k]);
          if (encrypted) {
            this.set(k, encrypted);
          }
        } else {
          this.set(k, wn.CryptoJS.AES.encrypt(params[k], ckey));
        }
      } catch(e) {}
    }
  }
  Tracker.prototype.send = function(a){
    var hitProp = {
      pageview:['page:pg'],
      unload:['eventTarget:et', 'eventAction:ea'],
      event:['eventTarget:et', 'eventAction:ea', 'eventPoint:ep'],
      ready:[],
      social:['socialNetwork:sn', 'socialAction:sa', 'socialTarget:st']
    };
    if(a.type){
      this.set("hitType", a.type);
      this.set("hitOrder", this.get("hitOrder")*1 + 1);
      this.set("status", Status.get());
      var props = hitProp[a.type];
      for(var i = 0; i < props.length; i++){
        var prms = props[i].split(":");
        a.hasOwnProperty(prms[0]) && this.prm.newParam(prms[0], prms[1], a[prms[0]], true);
      }
      try{
        if(this.filter.exec(this)){
          Beacon.send(this.prm.query());
        } else {
          Status.set(14);
        }
      } catch(ex){
        Status.set(15);
      } finally{
        this.prm.clear();
      }
    }
  };
  Tracker.prototype.getCookieValue = function(){
    var lvl = this.get("cookieDomain").split(".").length;
    var vid = this.get("visitorId");
    return ["BD", vid, lvl].join(".");
  };
  Tracker.prototype.setSessionCookie = function(){
    var cd = this.get("cookieDomain"), cn = this.get("cookieName"), ce = this.get("cookieExpires"), cp = this.get("cookiePath");
    var dmns = cd.split(".");
    for(var i = dmns.length - 1; i >= 0; i--){
      var subDmn = dmns.slice(i).join(".");
      this.set("cookieDomain", subDmn);
      if(Cookie.set(cn, this.getCookieValue(), ce, subDmn, cp)){Status.set(10); return true;}
    }
    this.set("cookieDomain", "failed"), Status.set(11);
    return false;
  };
  Tracker.prototype.createVisitorId = function(){
    var n = Utils.toString64(Utils.makeRandomNumber(0xffffffff)*1), t = Utils.toString64((new Date()).getTime()*1);
    return [n, t].join(".");
  };
  Tracker.prototype.keepSession = function(){
    var vid, vals = Cookie.getValues(this.get("cookieName")), dmn = this.get("cookieDomain");
    if(vals.length > 0){
      var vvals = [], dmns = dmn.split(".");
      for(var i = 0; !vid && i < vals.length; i++){
        var m = vals[i].match(/^BD\.(.+)\.(.+)\.(\d+)$/);
        if(m){vvals.push({domainLevel:m[3] * 1, visitorId:[m[1], m[2]].join(".")});}
      }
      if(1 === vvals.length){Status.set(2), vid = vvals[0].visitorId;}
      else if(0 === vvals.length){Status.set(3);}
      else{
        Status.set(4);
        var dlvl = dmns && dmns.length, dfvals = dlvl && Cookie.filterByDomainLevel(vvals, dlvl);
        vid = dfvals[0] && (Status.set(7), dfvals[0].visitorId);
      }
    } else{
      Status.set(8);
    }
    var lp = Linker.getIdFromLinker();
    Linker.removeIdFromUrl();
    vid = lp ? (Status.set(9), lp) : vid;
    vid = vid || (Status.set(1), this.createVisitorId());
    this.set("visitorId", vid);
    /* visitor_id for activity log */
    act_vt = vid;
    this.setSessionCookie();
  };
  Tracker.prototype.addDocumentOnClick = function(){
    var handler = (function(t){
      return function(e){
        var f = t.get("sendEvent");
        f(e,t);
      };
    })(this);
    Utils.addListener(dc, 'click', handler);
  };
  Tracker.prototype.addDocumentOnMouseDown = function(){
    var handler = (function(t){
      return function(e){
        var f = t.get("sendEvent");
        f(e,t);
      };
    })(this);
    Utils.addListener(dc, 'mousedown', handler);
  };
  Tracker.prototype.addOnload = function(){
    var handler = (function(t){
      return function(e){
        var f = t.get("sendReady");
        f(e,t);
      };
    })(this);
    Utils.addListener(wn, 'load', handler);
  };
  Tracker.prototype.addBeforeUnload = function(){
    var handler = (function(t){
      return function(e){
        var f = t.get("sendUnload");
        f(e,t);
      };
    })(this);
    Utils.addListener(wn, 'beforeunload', handler);
  };
  Tracker.prototype.addEvent = function(a){
    var handler = (function(t){
      return function(e){
        a.handler(e,t);
      };
    })(this);
    Utils.addListener(a.target, a.event, handler);
  };
  Tracker.prototype.require = function(){

  };
  /*
   * Activity用
   */
  Tracker.prototype.setActivity = function(key, val){
    var type = Object.prototype.toString.call(val).slice(8, -1);
    switch(key){
      case 'action':
        ActivityController.setKeyValue(type, 'act_type', val);
        break;
      case 'vt':
        ActivityController.setKeyValue(type, 'vt', val);
        break;
      case 'cid':
        ActivityController.setKeyValue(type, 'cid', val);
        break;
      case 'ctype':
        ActivityController.setKeyValue(type, 'ctype', val);
        break;
      case 'act_params':
        ActivityController.setActionParams(type, val);
        break;
    }
  };
  Tracker.prototype.sendActivity = function(a){
    if(!ActivityController.sendData['act_type'])return;
    var im = new Image(1, 1);
    var p = "https:" === dc.location.protocol ? "https:" : "http:";
    path = p + bdashHost + '/' + ActivityController.sendData['ac'] + "/activities/create";
    im.src = path + "?" + ActivityController.makeQueryString();
    return true;
  };
  Tracker.prototype.addOnloadActivity = function(){
    var handler = (function(t){
      return function(e){
        var elms = [];
        var divs = dc.getElementsByTagName('div');
        var sections = dc.getElementsByTagName('section');
        var uls = dc.getElementsByTagName('ul');
        Array.prototype.push.apply(elms, divs);
        Array.prototype.push.apply(elms, sections);
        Array.prototype.push.apply(elms, uls);
        var recommends = [];
        for(var i=0; i<elms.length; i++) {
          if (elms[i].getAttribute('bdr_r_id')) {
            recommends.push({bdr_r_id: elms[i].getAttribute('bdr_r_id')});
          }
        }
        if (recommends.length > 0) {
          t.setActivity('action', 'bdr_view');
          t.setActivity('act_params', recommends);
          t.sendActivity();
        }
      };
    })(this);
    Utils.addListener(wn, 'load', handler);
  };
  Tracker.prototype.addDocumentOnMouseDownActivity = function(){
    var handler = (function(t){
      return function(e){
        var r_id = '',
        target,
        tagname = '',
        href = '';
        // イベント取得
        if (e.target) {
          target = e.target;
        } else if (e.srcElement) {
          // IE用
          target = e.srcElement;
        }
        if (target) {
          elem = target;
          loop_count = 0;
          a_flg = false;
          while (loop_count < 30) {
            if (elem == null || elem == undefined) {
              break;
            }
            if (elem.tagName == 'A') {
              a_flg = true;
              href = elem.href;
            }
            if (a_flg == true) {
              if (elem.getAttribute('bdr_r_id')) {
                r_id = elem.getAttribute('bdr_r_id');
                break;
              }
            }
            elem = elem.parentElement;
            loop_count++;
          }
        }
        if(r_id) {
          act_params = {bdr_r_id: r_id, href: href};
          t.setActivity('action', 'bdr_click');
          t.setActivity('act_params', act_params);
          t.sendActivity();
        }
      };
    })(this);
    Utils.addListener(dc, 'mousedown', handler);
  };

  var TrackController = new function(){
    this.tracker = {};
    this.libraries = new Map();
    this.queue = [];
  };
  TrackController.create = function(a){
    TrackController.tracker = new Tracker(a);
    TrackController.tracker.keepSession();
    TrackController.tracker.addOnload();
    TrackController.tracker.addBeforeUnload();
    if(a['autoEvent'] !== 'disabled'){Status.set(12);TrackController.tracker.addDocumentOnClick();}
    var da = a['domains'];
    if(da && Utils.isArray(da)){
      Status.set(13);
      TrackController.tracker.set("linkerParam", TrackController.tracker.get("visitorId"));
      TrackController.tracker.set("linkedDomain", dc.domain);
      Linker.linkDomains(da, TrackController.tracker.get("linkerParam"));
    }
  };
  //TrackController.process = function(t,a){
  //  TrackController.queue.push({type:t, arg:a});
  //  var c = true, li = 0, q = TrackController.queue;
  //  for(var i = 0; i < q.length && c; i++){
  //    c = TrackController.execute(q[i]);
  //    li = i + 1;
  //  }
  //  TrackController.queue = q.slice(li);
  //};
  TrackController.execute = function(t, a){
    var type = t, arg = a;
    if(Utils.isString(type) && Utils.isObject(arg)){
      switch(type){
        case "create": arg['id'] && TrackController.create(arg); break;
        case "require": Library.require(a); break;
        case "set": for(var p in arg){arg.hasOwnProperty(p) && TrackController.tracker.set(p, arg[p]);} break;
        case "setCrypt": TrackController.tracker.setCrypt(arg); break;
        case "get": return TrackController.tracker.get(arg);break;
        case "sha256": return Library.execute("sha256", arg); break;
        case "customer": for(var cp in arg){arg.hasOwnProperty(cp) && TrackController.tracker.set("customer"+ Utils.capitalizeFirstLetter(cp), arg[cp]);} break;
        case "addEvent": TrackController.tracker.addEvent(arg); break;
        case "send": TrackController.tracker.send(arg); break;
      }
    } else if(type === "call" && Utils.isFunction(a)){
      a.call(TrackController.tracker);
    }

    return true;
  };

  var ActivityController = new function(a){
    this.sendData = {
     "ac" : '',
     "vt" : "abcdefgh",
     "cid" : "12345678",
     "ctype" : "1",
     "act_type" : "",
     "act_params" : []
    };
    this.setKeyValue = function(type, key, v) {
      var res = '';
      switch(type){
        case 'NodeList':
          if (v.length > 0) {
            res = v[0].value;
          }
          break;
        case 'String':
          res = v;
          break;
      }
      ActivityController.sendData[key] = res;
    };
    this.setActionParams = function(type, val) {
      ActivityController.sendData['act_params'] = [];
      switch(type){
        case 'Object':
          ActivityController.sendData['act_params'].push(val);
          break;
        case 'Array':
          for (i=0; i<val.length; i++) {
            ActivityController.sendData['act_params'].push(val[i]);
          }
          break;
      }
    };
    this.makeQueryString = function() {
      query = [];
      for (var key in ActivityController.sendData) {
        if(key === 'act_params'){continue;}
        query.push(key + "=" + Utils.encodeURL(ActivityController.sendData[key]));
      }
      for (var i=0; i<ActivityController.sendData['act_params'].length; i++) {
        pre = "act_params[" + i + "]";
        for (var key in ActivityController.sendData['act_params'][i]) {
          query.push(pre + "[" + key + "]=" + Utils.encodeURL(ActivityController.sendData['act_params'][i][key]));
        }
      }
      return query.join("&");
    };
  };

  ActivityController.create = function(a){
    ActivityController.activity = new Tracker(a);
    ActivityController.sendData['ac'] = a['id'];
    ActivityController.sendData['vt'] = act_vt;
    ActivityController.activity.addOnload();
    ActivityController.activity.addOnloadActivity();
    if(a['autoEvent'] !== 'disabled'){ActivityController.activity.addDocumentOnMouseDownActivity();}
  };

  ActivityController.execute = function(t, a) {
    var type = t,
    arg = a;
    switch(type){
      case "create": arg['id'] && ActivityController.create(a); break;
      case "set": for(var p in arg){arg.hasOwnProperty(p) && ActivityController.activity.set(p, arg[p]);} break;
    }
  };

  (function(){
    var cmds = wn.bdash.queue,
    act_cmds = wn.bdashActivity.queue;

    if(!wn.bdashFlags){wn.bdashFlags={}};
    wn.bdash = TrackController.execute;
    wn.bdashActivity = ActivityController.execute;
    wn.bdashLib = Library.execute;
    for(var i = 0; i < cmds.length; i++){
      TrackController.execute(cmds[i][0], cmds[i][1]);
    }
    for(var i = 0; i < act_cmds.length; i++){
      ActivityController.execute(act_cmds[i][0], act_cmds[i][1]);
    }
  })();
})();
