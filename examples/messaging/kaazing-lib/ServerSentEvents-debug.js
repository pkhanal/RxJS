/**
 * Copyright (c) 2007-2013, Kaazing Corporation. All rights reserved.
 */

var browser=null;
if(typeof (ActiveXObject)!="undefined"){
if(navigator.userAgent.indexOf("MSIE 10")!=-1){
browser="chrome";
}else{
browser="ie";
}
}else{
if(navigator.userAgent.indexOf("Trident/7")!=-1&&navigator.userAgent.indexOf("rv:11")!=-1){
browser="chrome";
}else{
if(Object.prototype.toString.call(window.opera)=="[object Opera]"){
browser="opera";
}else{
if(navigator.vendor.indexOf("Apple")!=-1){
browser="safari";
if(navigator.userAgent.indexOf("iPad")!=-1||navigator.userAgent.indexOf("iPhone")!=-1){
browser.ios=true;
}
}else{
if(navigator.vendor.indexOf("Google")!=-1){
if((navigator.userAgent.indexOf("Android")!=-1)&&(navigator.userAgent.indexOf("Chrome")==-1)){
browser="android";
}else{
browser="chrome";
}
}else{
if(navigator.product=="Gecko"&&window.find&&!navigator.savePreferences){
browser="firefox";
}else{
throw new Error("couldn't detect browser");
}
}
}
}
}
}
switch(browser){
case "ie":
(function(){
if(document.createEvent===undefined){
var _1=function(){
};
_1.prototype.initEvent=function(_2,_3,_4){
this.type=_2;
this.bubbles=_3;
this.cancelable=_4;
};
document.createEvent=function(_5){
if(_5!="Events"){
throw new Error("Unsupported event name: "+_5);
}
return new _1();
};
}
document._w_3_c_d_o_m_e_v_e_n_t_s_createElement=document.createElement;
document.createElement=function(_6){
var _7=this._w_3_c_d_o_m_e_v_e_n_t_s_createElement(_6);
if(_7.addEventListener===undefined){
var _8={};
_7.addEventListener=function(_9,_a,_b){
_7.attachEvent("on"+_9,_a);
return addEventListener(_8,_9,_a,_b);
};
_7.removeEventListener=function(_c,_d,_e){
return removeEventListener(_8,_c,_d,_e);
};
_7.dispatchEvent=function(_f){
return dispatchEvent(_8,_f);
};
}
return _7;
};
if(window.addEventListener===undefined){
var _10=document.createElement("div");
var _11=(typeof (postMessage)==="undefined");
window.addEventListener=function(_12,_13,_14){
if(_11&&_12=="message"){
_10.addEventListener(_12,_13,_14);
}else{
window.attachEvent("on"+_12,_13);
}
};
window.removeEventListener=function(_15,_16,_17){
if(_11&&_15=="message"){
_10.removeEventListener(_15,_16,_17);
}else{
window.detachEvent("on"+_15,_16);
}
};
window.dispatchEvent=function(_18){
if(_11&&_18.type=="message"){
_10.dispatchEvent(_18);
}else{
window.fireEvent("on"+_18.type,_18);
}
};
}
function addEventListener(_19,_1a,_1b,_1c){
if(_1c){
throw new Error("Not implemented");
}
var _1d=_19[_1a]||{};
_19[_1a]=_1d;
_1d[_1b]=_1b;
};
function removeEventListener(_1e,_1f,_20,_21){
if(_21){
throw new Error("Not implemented");
}
var _22=_1e[_1f]||{};
delete _22[_20];
};
function dispatchEvent(_23,_24){
var _25=_24.type;
var _26=_23[_25]||{};
for(var key in _26){
if(_26.hasOwnProperty(key)&&typeof (_26[key])=="function"){
try{
_26[key](_24);
}
catch(e){
}
}
}
};
})();
break;
case "chrome":
case "android":
case "safari":
if(typeof (window.postMessage)==="undefined"&&typeof (window.dispatchEvent)==="undefined"&&typeof (document.dispatchEvent)==="function"){
window.dispatchEvent=function(_28){
document.dispatchEvent(_28);
};
var addEventListener0=window.addEventListener;
window.addEventListener=function(_29,_2a,_2b){
if(_29==="message"){
document.addEventListener(_29,_2a,_2b);
}else{
addEventListener0.call(window,_29,_2a,_2b);
}
};
var removeEventListener0=window.removeEventListener;
window.removeEventListener=function(_2c,_2d,_2e){
if(_2c==="message"){
document.removeEventListener(_2c,_2d,_2e);
}else{
removeEventListener0.call(window,_2c,_2d,_2e);
}
};
}
break;
case "opera":
var addEventListener0=window.addEventListener;
window.addEventListener=function(_2f,_30,_31){
var _32=_30;
if(_2f==="message"){
_32=function(_33){
if(_33.origin===undefined&&_33.uri!==undefined){
var uri=new URI(_33.uri);
delete uri.path;
delete uri.query;
delete uri.fragment;
_33.origin=uri.toString();
}
return _30(_33);
};
_30._$=_32;
}
addEventListener0.call(window,_2f,_32,_31);
};
var removeEventListener0=window.removeEventListener;
window.removeEventListener=function(_35,_36,_37){
var _38=_36;
if(_35==="message"){
_38=_36._$;
}
removeEventListener0.call(window,_35,_38,_37);
};
break;
}
function URI(str){
str=str||"";
var _3a=0;
var _3b=str.indexOf("://");
if(_3b!=-1){
this.scheme=str.slice(0,_3b);
_3a=_3b+3;
var _3c=str.indexOf("/",_3a);
if(_3c==-1){
_3c=str.length;
str+="/";
}
var _3d=str.slice(_3a,_3c);
this.authority=_3d;
_3a=_3c;
this.host=_3d;
var _3e=_3d.indexOf(":");
if(_3e!=-1){
this.host=_3d.slice(0,_3e);
this.port=parseInt(_3d.slice(_3e+1),10);
if(isNaN(this.port)){
throw new Error("Invalid URI syntax");
}
}
}
var _3f=str.indexOf("?",_3a);
if(_3f!=-1){
this.path=str.slice(_3a,_3f);
_3a=_3f+1;
}
var _40=str.indexOf("#",_3a);
if(_40!=-1){
if(_3f!=-1){
this.query=str.slice(_3a,_40);
}else{
this.path=str.slice(_3a,_40);
}
_3a=_40+1;
this.fragment=str.slice(_3a);
}else{
if(_3f!=-1){
this.query=str.slice(_3a);
}else{
this.path=str.slice(_3a);
}
}
};
(function(){
var _41=URI.prototype;
_41.toString=function(){
var sb=[];
var _43=this.scheme;
if(_43!==undefined){
sb.push(_43);
sb.push("://");
sb.push(this.host);
var _44=this.port;
if(_44!==undefined){
sb.push(":");
sb.push(_44.toString());
}
}
if(this.path!==undefined){
sb.push(this.path);
}
if(this.query!==undefined){
sb.push("?");
sb.push(this.query);
}
if(this.fragment!==undefined){
sb.push("#");
sb.push(this.fragment);
}
return sb.join("");
};
var _45={"http":80,"ws":80,"https":443,"wss":443};
URI.replaceProtocol=function(_46,_47){
var _48=_46.indexOf("://");
if(_48>0){
return _47+_46.substr(_48);
}else{
return "";
}
};
})();
var postMessage0=(function(){
var _49=new URI((browser=="ie")?document.URL:location.href);
var _4a={"http":80,"https":443};
if(_49.port==null){
_49.port=_4a[_49.scheme];
_49.authority=_49.host+":"+_49.port;
}
var _4b=_49.scheme+"://"+_49.authority;
var _4c="/.kr";
if(typeof (postMessage)!=="undefined"){
return function(_4d,_4e,_4f){
if(typeof (_4e)!="string"){
throw new Error("Unsupported type. Messages must be strings");
}
if(_4f==="null"){
_4f="*";
}
switch(browser){
case "ie":
case "opera":
case "firefox":
setTimeout(function(){
_4d.postMessage(_4e,_4f);
},0);
break;
default:
_4d.postMessage(_4e,_4f);
break;
}
};
}else{
function MessagePipe(_50){
this.sourceToken=toPaddedHex(Math.floor(Math.random()*(Math.pow(2,32)-1)),8);
this.iframe=_50;
this.bridged=false;
this.lastWrite=0;
this.lastRead=0;
this.lastReadIndex=2;
this.lastSyn=0;
this.lastAck=0;
this.queue=[];
this.escapedFragments=[];
};
var _51=MessagePipe.prototype;
_51.attach=function(_52,_53,_54,_55,_56,_57){
this.target=_52;
this.targetOrigin=_53;
this.targetToken=_54;
this.reader=_55;
this.writer=_56;
this.writerURL=_57;
try{
this._lastHash=_55.location.hash;
this.poll=pollLocationHash;
}
catch(permissionDenied){
this._lastDocumentURL=_55.document.URL;
this.poll=pollDocumentURL;
}
if(_52==parent){
dequeue(this,true);
}
};
_51.detach=function(){
this.poll=function(){
};
delete this.target;
delete this.targetOrigin;
delete this.reader;
delete this.lastFragment;
delete this.writer;
delete this.writerURL;
};
_51.poll=function(){
};
function pollLocationHash(){
var _58=this.reader.location.hash;
if(this._lastHash!=_58){
process(this,_58.substring(1));
this._lastHash=_58;
}
};
function pollDocumentURL(){
var _59=this.reader.document.URL;
if(this._lastDocumentURL!=_59){
var _5a=_59.indexOf("#");
if(_5a!=-1){
process(this,_59.substring(_5a+1));
this._lastDocumentURL=_59;
}
}
};
_51.post=function(_5b,_5c,_5d){
bridgeIfNecessary(this,_5b);
var _5e=1000;
var _5f=escape(_5c);
var _60=[];
while(_5f.length>_5e){
var _61=_5f.substring(0,_5e);
_5f=_5f.substring(_5e);
_60.push(_61);
}
_60.push(_5f);
this.queue.push([_5d,_60]);
if(this.writer!=null&&this.lastAck>=this.lastSyn){
dequeue(this,false);
}
};
function bridgeIfNecessary(_62,_63){
if(_62.lastWrite<1&&!_62.bridged){
if(_63.parent==window){
var src=_62.iframe.src;
var _65=src.split("#");
var _66=null;
var _67=document.getElementsByTagName("meta");
for(var i=0;i<_67.length;i++){
if(_67[i].name=="kaazing:resources"){
alert("kaazing:resources is no longer supported. Please refer to the Administrator's Guide section entitled \"Configuring a Web Server to Integrate with Kaazing Gateway\"");
}
}
var _69=_4b;
var _6a=_69.toString()+_4c+"?.kr=xsp&.kv=10.05";
if(_66){
var _6b=new URI(_69.toString());
var _65=_66.split(":");
_6b.host=_65.shift();
if(_65.length){
_6b.port=_65.shift();
}
_6a=_6b.toString()+_4c+"?.kr=xsp&.kv=10.05";
}
for(var i=0;i<_67.length;i++){
if(_67[i].name=="kaazing:postMessageBridgeURL"){
var _6c=_67[i].content;
var _6d=new URI(_6c);
var _6e=new URI(location.toString());
if(!_6d.authority){
_6d.host=_6e.host;
_6d.port=_6e.port;
_6d.scheme=_6e.scheme;
if(_6c.indexOf("/")!=0){
var _6f=_6e.path.split("/");
_6f.pop();
_6f.push(_6c);
_6d.path=_6f.join("/");
}
}
postMessage0.BridgeURL=_6d.toString();
}
}
if(postMessage0.BridgeURL){
_6a=postMessage0.BridgeURL;
}
var _70=["I",_69,_62.sourceToken,escape(_6a)];
if(_65.length>1){
var _71=_65[1];
_70.push(escape(_71));
}
_65[1]=_70.join("!");
setTimeout(function(){
_63.location.replace(_65.join("#"));
},200);
_62.bridged=true;
}
}
};
function flush(_72,_73){
var _74=_72.writerURL+"#"+_73;
_72.writer.location.replace(_74);
};
function fromHex(_75){
return parseInt(_75,16);
};
function toPaddedHex(_76,_77){
var hex=_76.toString(16);
var _79=[];
_77-=hex.length;
while(_77-->0){
_79.push("0");
}
_79.push(hex);
return _79.join("");
};
function dequeue(_7a,_7b){
var _7c=_7a.queue;
var _7d=_7a.lastRead;
if((_7c.length>0||_7b)&&_7a.lastSyn>_7a.lastAck){
var _7e=_7a.lastFrames;
var _7f=_7a.lastReadIndex;
if(fromHex(_7e[_7f])!=_7d){
_7e[_7f]=toPaddedHex(_7d,8);
flush(_7a,_7e.join(""));
}
}else{
if(_7c.length>0){
var _80=_7c.shift();
var _81=_80[0];
if(_81=="*"||_81==_7a.targetOrigin){
_7a.lastWrite++;
var _82=_80[1];
var _83=_82.shift();
var _84=3;
var _7e=[_7a.targetToken,toPaddedHex(_7a.lastWrite,8),toPaddedHex(_7d,8),"F",toPaddedHex(_83.length,4),_83];
var _7f=2;
if(_82.length>0){
_7e[_84]="f";
_7a.queue.unshift(_80);
}
if(_7a.resendAck){
var _85=[_7a.targetToken,toPaddedHex(_7a.lastWrite-1,8),toPaddedHex(_7d,8),"a"];
_7e=_85.concat(_7e);
_7f+=_85.length;
}
flush(_7a,_7e.join(""));
_7a.lastFrames=_7e;
_7a.lastReadIndex=_7f;
_7a.lastSyn=_7a.lastWrite;
_7a.resendAck=false;
}
}else{
if(_7b){
_7a.lastWrite++;
var _7e=[_7a.targetToken,toPaddedHex(_7a.lastWrite,8),toPaddedHex(_7d,8),"a"];
var _7f=2;
if(_7a.resendAck){
var _85=[_7a.targetToken,toPaddedHex(_7a.lastWrite-1,8),toPaddedHex(_7d,8),"a"];
_7e=_85.concat(_7e);
_7f+=_85.length;
}
flush(_7a,_7e.join(""));
_7a.lastFrames=_7e;
_7a.lastReadIndex=_7f;
_7a.resendAck=true;
}
}
}
};
function process(_86,_87){
var _88=_87.substring(0,8);
var _89=fromHex(_87.substring(8,16));
var _8a=fromHex(_87.substring(16,24));
var _8b=_87.charAt(24);
if(_88!=_86.sourceToken){
throw new Error("postMessage emulation tampering detected");
}
var _8c=_86.lastRead;
var _8d=_8c+1;
if(_89==_8d){
_86.lastRead=_8d;
}
if(_89==_8d||_89==_8c){
_86.lastAck=_8a;
}
if(_89==_8d||(_89==_8c&&_8b=="a")){
switch(_8b){
case "f":
var _8e=_87.substr(29,fromHex(_87.substring(25,29)));
_86.escapedFragments.push(_8e);
dequeue(_86,true);
break;
case "F":
var _8f=_87.substr(29,fromHex(_87.substring(25,29)));
if(_86.escapedFragments!==undefined){
_86.escapedFragments.push(_8f);
_8f=_86.escapedFragments.join("");
_86.escapedFragments=[];
}
var _90=unescape(_8f);
dispatch(_90,_86.target,_86.targetOrigin);
dequeue(_86,true);
break;
case "a":
if(_87.length>25){
process(_86,_87.substring(25));
}else{
dequeue(_86,false);
}
break;
default:
throw new Error("unknown postMessage emulation payload type: "+_8b);
}
}
};
function dispatch(_91,_92,_93){
var _94=document.createEvent("Events");
_94.initEvent("message",false,true);
_94.data=_91;
_94.origin=_93;
_94.source=_92;
dispatchEvent(_94);
};
var _95={};
var _96=[];
function pollReaders(){
for(var i=0,len=_96.length;i<len;i++){
var _99=_96[i];
_99.poll();
}
setTimeout(pollReaders,20);
};
function findMessagePipe(_9a){
if(_9a==parent){
return _95["parent"];
}else{
if(_9a.parent==window){
var _9b=document.getElementsByTagName("iframe");
for(var i=0;i<_9b.length;i++){
var _9d=_9b[i];
if(_9a==_9d.contentWindow){
return supplyIFrameMessagePipe(_9d);
}
}
}else{
throw new Error("Generic peer postMessage not yet implemented");
}
}
};
function supplyIFrameMessagePipe(_9e){
var _9f=_9e._name;
if(_9f===undefined){
_9f="iframe$"+String(Math.random()).substring(2);
_9e._name=_9f;
}
var _a0=_95[_9f];
if(_a0===undefined){
_a0=new MessagePipe(_9e);
_95[_9f]=_a0;
}
return _a0;
};
function postMessage0(_a1,_a2,_a3){
if(typeof (_a2)!="string"){
throw new Error("Unsupported type. Messages must be strings");
}
if(_a1==window){
if(_a3=="*"||_a3==_4b){
dispatch(_a2,window,_4b);
}
}else{
var _a4=findMessagePipe(_a1);
_a4.post(_a1,_a2,_a3);
}
};
postMessage0.attach=function(_a5,_a6,_a7,_a8,_a9,_aa){
var _ab=findMessagePipe(_a5);
_ab.attach(_a5,_a6,_a7,_a8,_a9,_aa);
_96.push(_ab);
};
var _ac=function(_ad){
var _ae=new URI((browser=="ie")?document.URL:location.href);
var _af;
var _b0={"http":80,"https":443};
if(_ae.port==null){
_ae.port=_b0[_ae.scheme];
_ae.authority=_ae.host+":"+_ae.port;
}
var _b1=unescape(_ae.fragment||"");
if(_b1.length>0){
var _b2=_b1.split(",");
var _b3=_b2.shift();
var _b4=_b2.shift();
var _b5=_b2.shift();
var _b6=_ae.scheme+"://"+document.domain+":"+_ae.port;
var _b7=_ae.scheme+"://"+_ae.authority;
var _b8=_b3+"/.kr?.kr=xsc&.kv=10.05";
var _b9=document.location.toString().split("#")[0];
var _ba=_b8+"#"+escape([_b6,_b4,escape(_b9)].join(","));
if(typeof (ActiveXObject)!="undefined"){
_af=new ActiveXObject("htmlfile");
_af.open();
try{
_af.parentWindow.opener=window;
}
catch(domainError){
if(_ad){
_af.domain=_ad;
}
_af.parentWindow.opener=window;
}
_af.write("<html>");
_af.write("<body>");
if(_ad){
_af.write("<script>CollectGarbage();document.domain='"+_ad+"';</"+"script>");
}
_af.write("<iframe src=\""+_b8+"\"></iframe>");
_af.write("</body>");
_af.write("</html>");
_af.close();
var _bb=_af.body.lastChild;
var _bc=_af.parentWindow;
var _bd=parent;
var _be=_bd.parent.postMessage0;
if(typeof (_be)!="undefined"){
_bb.onload=function(){
var _bf=_bb.contentWindow;
_bf.location.replace(_ba);
_be.attach(_bd,_b3,_b5,_bc,_bf,_b8);
};
}
}else{
var _bb=document.createElement("iframe");
_bb.src=_ba;
document.body.appendChild(_bb);
var _bc=window;
var _c0=_bb.contentWindow;
var _bd=parent;
var _be=_bd.parent.postMessage0;
if(typeof (_be)!="undefined"){
_be.attach(_bd,_b3,_b5,_bc,_c0,_b8);
}
}
}
window.onunload=function(){
try{
var _c1=window.parent.parent.postMessage0;
if(typeof (_c1)!="undefined"){
_c1.detach(_bd);
}
}
catch(permissionDenied){
}
if(typeof (_af)!=="undefined"){
_af.parentWindow.opener=null;
_af.open();
_af.close();
_af=null;
CollectGarbage();
}
};
};
postMessage0.__init__=function(_c2,_c3){
var _c4=_ac.toString();
_c2.URI=URI;
_c2.browser=browser;
if(!_c3){
_c3="";
}
_c2.setTimeout("("+_c4+")('"+_c3+"')",0);
};
postMessage0.bridgeURL=false;
postMessage0.detach=function(_c5){
var _c6=findMessagePipe(_c5);
for(var i=0;i<_96.length;i++){
if(_96[i]==_c6){
_96.splice(i,1);
}
}
_c6.detach();
};
if(window!=top){
_95["parent"]=new MessagePipe();
function initializeAsTargetIfNecessary(){
var _c8=new URI((browser=="ie")?document.URL:location.href);
var _c9=_c8.fragment||"";
if(document.body!=null&&_c9.length>0&&_c9.charAt(0)=="I"){
var _ca=unescape(_c9);
var _cb=_ca.split("!");
if(_cb.shift()=="I"){
var _cc=_cb.shift();
var _cd=_cb.shift();
var _ce=unescape(_cb.shift());
var _cf=_4b;
if(_cc==_cf){
try{
parent.location.hash;
}
catch(permissionDenied){
document.domain=document.domain;
}
}
var _d0=_cb.shift()||"";
switch(browser){
case "firefox":
location.replace([location.href.split("#")[0],_d0].join("#"));
break;
default:
location.hash=_d0;
break;
}
var _d1=findMessagePipe(parent);
_d1.targetToken=_cd;
var _d2=_d1.sourceToken;
var _d3=_ce+"#"+escape([_cf,_cd,_d2].join(","));
var _d4;
_d4=document.createElement("iframe");
_d4.src=_d3;
_d4.style.position="absolute";
_d4.style.left="-10px";
_d4.style.top="10px";
_d4.style.visibility="hidden";
_d4.style.width="0px";
_d4.style.height="0px";
document.body.appendChild(_d4);
return;
}
}
setTimeout(initializeAsTargetIfNecessary,20);
};
initializeAsTargetIfNecessary();
}
var _d5=document.getElementsByTagName("meta");
for(var i=0;i<_d5.length;i++){
if(_d5[i].name==="kaazing:postMessage"){
if("immediate"==_d5[i].content){
var _d7=function(){
var _d8=document.getElementsByTagName("iframe");
for(var i=0;i<_d8.length;i++){
var _da=_d8[i];
if(_da.style["KaaPostMessage"]=="immediate"){
_da.style["KaaPostMessage"]="none";
var _db=supplyIFrameMessagePipe(_da);
bridgeIfNecessary(_db,_da.contentWindow);
}
}
setTimeout(_d7,20);
};
setTimeout(_d7,20);
}
break;
}
}
for(var i=0;i<_d5.length;i++){
if(_d5[i].name==="kaazing:postMessagePrefix"){
var _dc=_d5[i].content;
if(_dc!=null&&_dc.length>0){
if(_dc.charAt(0)!="/"){
_dc="/"+_dc;
}
_4c=_dc;
}
}
}
setTimeout(pollReaders,20);
return postMessage0;
}
})();
var XDRHttpDirect=(function(){
var id=0;
function XDRHttpDirect(_de){
this.outer=_de;
};
var _df=XDRHttpDirect.prototype;
_df.open=function(_e0,_e1){
var _e2=this;
var xhr=this.outer;
xhr.responseText="";
var _e4=2;
var _e5=0;
var _e6=0;
this._method=_e0;
this._location=_e1;
if(_e1.indexOf("?")==-1){
_e1+="?.kac=ex&.kct=application/x-message-http";
}else{
_e1+="&.kac=ex&.kct=application/x-message-http";
}
this.location=_e1;
var xdr=this.xdr=new XDomainRequest();
var _e8=function(e){
try{
var _ea=xdr.responseText;
if(_e4<=2){
var _eb=_ea.indexOf("\r\n\r\n");
if(_eb==-1){
return;
}
var _ec=_ea.indexOf("\r\n");
var _ed=_ea.substring(0,_ec);
var _ee=_ed.match(/HTTP\/1\.\d\s(\d+)\s([^\r\n]+)/);
xhr.status=parseInt(_ee[1]);
xhr.statusText=_ee[2];
var _ef=_ec+2;
_e6=_eb+4;
var _f0=_ea.substring(_ef,_eb).split("\r\n");
xhr._responseHeaders={};
for(var i=0;i<_f0.length;i++){
var _f2=_f0[i].split(":");
xhr._responseHeaders[_f2[0].replace(/^\s+|\s+$/g,"")]=_f2[1].replace(/^\s+|\s+$/g,"");
}
_e5=_e6;
_e4=xhr.readyState=3;
if(typeof (_e2.onreadystatechange)=="function"){
_e2.onreadystatechange(xhr);
}
}
var _f3=xdr.responseText.length;
if(_f3>_e5){
xhr.responseText=_ea.slice(_e6);
_e5=_f3;
if(typeof (_e2.onprogress)=="function"){
_e2.onprogress(xhr);
}
}else{
}
}
catch(e1){
_e2.onload(xhr);
}
};
xdr.onprogress=_e8;
xdr.onerror=function(e){
xhr.readyState=0;
if(typeof (xhr.onerror)=="function"){
xhr.onerror(xhr);
}
};
xdr.onload=function(e){
if(_e4<=3){
_e8(e);
}
reayState=xhr.readyState=4;
if(typeof (xhr.onreadystatechange)=="function"){
xhr.onreadystatechange(xhr);
}
if(typeof (xhr.onload)=="function"){
xhr.onload(xhr);
}
};
xdr.open("POST",_e1);
};
_df.send=function(_f6){
var _f7=this._method+" "+this.location.substring(this.location.indexOf("/",9),this.location.indexOf("&.kct"))+" HTTP/1.1\r\n";
for(var i=0;i<this.outer._requestHeaders.length;i++){
_f7+=this.outer._requestHeaders[i][0]+": "+this.outer._requestHeaders[i][1]+"\r\n";
}
var _f9=_f6||"";
if(_f9.length>0||this._method.toUpperCase()==="POST"){
var len=0;
for(var i=0;i<_f9.length;i++){
len++;
if(_f9.charCodeAt(i)>=128){
len++;
}
}
_f7+="Content-Length: "+len+"\r\n";
}
_f7+="\r\n";
_f7+=_f9;
this.xdr.send(_f7);
};
_df.abort=function(){
this.xdr.abort();
};
return XDRHttpDirect;
})();
var XMLHttpBridge=(function(){
var _fb=new URI((browser=="ie")?document.URL:location.href);
var _fc={"http":80,"https":443};
if(_fb.port==null){
_fb.port=_fc[_fb.scheme];
_fb.authority=_fb.host+":"+_fb.port;
}
var _fd={};
var _fe={};
var _ff=0;
function XMLHttpBridge(_100){
this.outer=_100;
};
var _101=XMLHttpBridge.prototype;
_101.open=function(_102,_103){
var id=register(this);
var pipe=supplyPipe(this,_103);
pipe.attach(id);
this._pipe=pipe;
this._method=_102;
this._location=_103;
this.outer.readyState=1;
this.outer.status=0;
this.outer.statusText="";
this.outer.responseText="";
var _106=this;
setTimeout(function(){
_106.outer.readyState=1;
onreadystatechange(_106);
},0);
};
_101.send=function(_107){
doSend(this,_107);
};
_101.abort=function(){
var pipe=this._pipe;
if(pipe!==undefined){
pipe.post(["a",this._id].join(""));
pipe.detach(this._id);
}
};
function onreadystatechange(_109){
if(typeof (_109.onreadystatechange)!=="undefined"){
_109.onreadystatechange(_109.outer);
}
switch(_109.outer.readyState){
case 3:
if(typeof (_109.onprogress)!=="undefined"){
_109.onprogress(_109.outer);
}
break;
case 4:
if(_109.outer.status<100||_109.outer.status>=500){
if(typeof (_109.onerror)!=="undefined"){
_109.onerror(_109.outer);
}
}else{
if(typeof (_109.onprogress)!=="undefined"){
_109.onprogress(_109.outer);
}
if(typeof (_109.onload)!=="undefined"){
_109.onload(_109.outer);
}
}
break;
}
};
function fromHex(_10a){
return parseInt(_10a,16);
};
function toPaddedHex(_10b,_10c){
var hex=_10b.toString(16);
var _10e=[];
_10c-=hex.length;
while(_10c-->0){
_10e.push("0");
}
_10e.push(hex);
return _10e.join("");
};
function register(_10f){
var id=toPaddedHex(_ff++,8);
_fe[id]=_10f;
_10f._id=id;
return id;
};
function doSend(_111,_112){
if(typeof (_112)!=="string"){
_112="";
}
var _113=_111._method.substring(0,10);
var _114=_111._location;
var _115=_111.outer._requestHeaders;
var _116=toPaddedHex(_111.outer.timeout,4);
var _117=(_111.outer.onprogress!==undefined)?"t":"f";
var _118=["s",_111._id,_113.length,_113,toPaddedHex(_114.length,4),_114,toPaddedHex(_115.length,4)];
for(var i=0;i<_115.length;i++){
var _11a=_115[i];
_118.push(toPaddedHex(_11a[0].length,4));
_118.push(_11a[0]);
_118.push(toPaddedHex(_11a[1].length,4));
_118.push(_11a[1]);
}
_118.push(toPaddedHex(_112.length,8),_112,toPaddedHex(_116,4),_117);
_111._pipe.post(_118.join(""));
};
function supplyPipe(_11b,_11c){
var uri=new URI(_11c);
var _11e=(uri.scheme!=null&&uri.authority!=null);
var _11f=_11e?uri.scheme:_fb.scheme;
var _120=_11e?uri.authority:_fb.authority;
if(_120!=null&&uri.port==null){
_120=uri.host+":"+_fc[_11f];
}
var _121=_11f+"://"+_120;
var pipe=_fd[_121];
if(pipe!==undefined){
if(!("iframe" in pipe&&"contentWindow" in pipe.iframe&&typeof pipe.iframe.contentWindow=="object")){
pipe=_fd[_121]=undefined;
}
}
if(pipe===undefined){
var _123=document.createElement("iframe");
_123.style.position="absolute";
_123.style.left="-10px";
_123.style.top="10px";
_123.style.visibility="hidden";
_123.style.width="0px";
_123.style.height="0px";
var _124=new URI(_121);
_124.query=".kr=xs";
_124.path="/";
_123.src=_124.toString();
function post(_125){
this.buffer.push(_125);
};
function attach(id){
var _127=this.attached[id];
if(_127===undefined){
_127={};
this.attached[id]=_127;
}
if(_127.timerID!==undefined){
clearTimeout(_127.timerID);
delete _127.timerID;
}
};
function detach(id){
var _129=this.attached[id];
if(_129!==undefined&&_129.timerID===undefined){
var _12a=this;
_129.timerID=setTimeout(function(){
delete _12a.attached[id];
var xhr=_fe[id];
if(xhr._pipe==pipe){
delete _fe[id];
delete xhr._id;
delete xhr._pipe;
}
postMessage0(pipe.iframe.contentWindow,["d",id].join(""),pipe.targetOrigin);
},0);
}
};
pipe={"targetOrigin":_121,"iframe":_123,"buffer":[],"post":post,"attach":attach,"detach":detach,"attached":{count:0}};
_fd[_121]=pipe;
function sendInitWhenReady(){
var _12c=_123.contentWindow;
if(!_12c){
setTimeout(sendInitWhenReady,20);
}else{
postMessage0(_12c,"I",_121);
}
};
pipe.handshakeID=setTimeout(function(){
_fd[_121]=undefined;
pipe.post=function(_12d){
_11b.readyState=4;
_11b.status=0;
onreadystatechange(_11b);
};
if(pipe.buffer.length>0){
pipe.post();
}
},30000);
document.body.appendChild(_123);
if(typeof (postMessage)==="undefined"){
sendInitWhenReady();
}
}
return pipe;
};
function onmessage(_12e){
var _12f=_12e.origin;
var _130={"http":":80","https":":443"};
var _131=_12f.split(":");
if(_131.length===2){
_12f+=_130[_131[0]];
}
var pipe=_fd[_12f];
if(pipe!==undefined&&pipe.iframe!==undefined&&_12e.source==pipe.iframe.contentWindow){
if(_12e.data=="I"){
clearTimeout(pipe.handshakeID);
var _133;
while((_133=pipe.buffer.shift())!==undefined){
postMessage0(pipe.iframe.contentWindow,_133,pipe.targetOrigin);
}
pipe.post=function(_134){
postMessage0(pipe.iframe.contentWindow,_134,pipe.targetOrigin);
};
}else{
var _133=_12e.data;
if(_133.length>=9){
var _135=0;
var type=_133.substring(_135,_135+=1);
var id=_133.substring(_135,_135+=8);
var _138=_fe[id];
if(_138!==undefined){
switch(type){
case "r":
var _139={};
var _13a=fromHex(_133.substring(_135,_135+=2));
for(var i=0;i<_13a;i++){
var _13c=fromHex(_133.substring(_135,_135+=4));
var _13d=_133.substring(_135,_135+=_13c);
var _13e=fromHex(_133.substring(_135,_135+=4));
var _13f=_133.substring(_135,_135+=_13e);
_139[_13d]=_13f;
}
var _140=fromHex(_133.substring(_135,_135+=4));
var _141=fromHex(_133.substring(_135,_135+=2));
var _142=_133.substring(_135,_135+=_141);
switch(_140){
case 301:
case 302:
case 307:
var _143=_139["Location"];
var _144=_12e.origin;
if(typeof (_138.outer.onredirectallowed)==="function"){
if(!_138.outer.onredirectallowed(_144,_143)){
return;
}
}
var id=register(_138);
var pipe=supplyPipe(_138,_143);
pipe.attach(id);
_138._pipe=pipe;
_138._method="GET";
_138._location=_143;
_138._redirect=true;
break;
case 403:
_138.outer.status=_140;
onreadystatechange(_138);
break;
default:
_138.outer._responseHeaders=_139;
_138.outer.status=_140;
_138.outer.statusText=_142;
break;
}
break;
case "p":
var _145=parseInt(_133.substring(_135,_135+=1));
if(_138._id===id){
_138.outer.readyState=_145;
var _146=fromHex(_133.substring(_135,_135+=8));
var _147=_133.substring(_135,_135+=_146);
if(_147.length>0){
_138.outer.responseText+=_147;
}
onreadystatechange(_138);
}else{
if(_138._redirect){
_138._redirect=false;
doSend(_138,"");
}
}
if(_145==4){
pipe.detach(id);
}
break;
case "e":
if(_138._id===id){
_138.outer.status=0;
_138.outer.statusText="";
_138.outer.readyState=4;
onreadystatechange(_138);
}
pipe.detach(id);
break;
case "t":
if(_138._id===id){
_138.outer.status=0;
_138.outer.statusText="";
_138.outer.readyState=4;
if(typeof (_138.ontimeout)!=="undefined"){
_138.ontimeout();
}
}
pipe.detach(id);
break;
}
}
}
}
}else{
}
};
window.addEventListener("message",onmessage,false);
return XMLHttpBridge;
})();
var XMLHttpRequest0=(function(){
var _148=new URI((browser=="ie")?document.URL:location.href);
var _149={"http":80,"https":443};
if(_148.port==null){
_148.port=_149[_148.scheme];
_148.authority=_148.host+":"+_148.port;
}
function onreadystatechange(_14a){
if(typeof (_14a.onreadystatechange)!=="undefined"){
_14a.onreadystatechange();
}
};
function onprogress(_14b){
if(typeof (_14b.onprogress)!=="undefined"){
_14b.onprogress();
}
};
function onerror(_14c){
if(typeof (_14c.onerror)!=="undefined"){
_14c.onerror();
}
};
function onload(_14d){
if(typeof (_14d.onload)!=="undefined"){
_14d.onload();
}
};
function XMLHttpRequest0(){
this._requestHeaders=[];
this.responseHeaders={};
this.withCredentials=false;
};
var _14e=XMLHttpRequest0.prototype;
_14e.readyState=0;
_14e.responseText="";
_14e.status=0;
_14e.statusText="";
_14e.timeout=0;
_14e.onreadystatechange;
_14e.onerror;
_14e.onload;
_14e.onprogress;
_14e.onredirectallowed;
_14e.open=function(_14f,_150,_151){
if(!_151){
throw new Error("Asynchronous is required for cross-origin XMLHttpRequest emulation");
}
switch(this.readyState){
case 0:
case 4:
break;
default:
throw new Error("Invalid ready state");
}
var _152=this;
this._method=_14f;
this._location=_150;
this.readyState=1;
this.status=0;
this.statusText="";
this.responseText="";
var xhr;
var _154=new URI(_150);
if(_154.port==null){
_154.port=_149[_154.scheme];
_154.authority=_154.host+":"+_154.port;
}
if(browser=="ie"&&typeof (XDomainRequest)!=="undefined"&&_154.scheme==_148.scheme&&!this.withCredentials){
xhr=new XDRHttpDirect(this);
}else{
if(_154.scheme==_148.scheme&&_154.authority==_148.authority){
try{
xhr=new XMLHttpBridge(this);
}
catch(e){
xhr=new XMLHttpBridge(this);
}
}else{
xhr=new XMLHttpBridge(this);
}
}
xhr.onload=onload;
xhr.onprogress=onprogress;
xhr.onreadystatechange=onreadystatechange;
xhr.onerror=onerror;
xhr.open(_14f,_150);
this.xhr=xhr;
setTimeout(function(){
if(_152.readyState>1){
return;
}
if(_152.readyState<1){
_152.readyState=1;
}
onreadystatechange(_152);
},0);
};
_14e.setRequestHeader=function(_155,_156){
if(this.readyState!==1){
throw new Error("Invalid ready state");
}
this._requestHeaders.push([_155,_156]);
};
_14e.send=function(_157){
if(this.readyState!==1){
throw new Error("Invalid ready state");
}
var _158=this;
setTimeout(function(){
if(_158.readyState>2){
return;
}
if(_158.readyState<2){
_158.readyState=2;
}
onreadystatechange(_158);
},0);
this.xhr.send(_157);
};
_14e.abort=function(){
this.xhr.abort();
};
_14e.getResponseHeader=function(_159){
if(this.status==0){
throw new Error("Invalid ready state");
}
var _15a=this._responseHeaders;
return _15a[_159];
};
_14e.getAllResponseHeaders=function(){
if(this.status==0){
throw new Error("Invalid ready state");
}
return this._responseHeaders;
};
return XMLHttpRequest0;
})();
var coverNativeSSE=true;
if(coverNativeSSE||typeof (window.EventSource)==="undefined"){
var EventSource=(function(){
function EventSource(_15b){
this.lastEventId=null;
this.immediate=false;
this.retry=3000;
var _15c=new URI(_15b);
var _15d={"http":80,"https":443};
if(_15c.port==null){
_15c.port=_15d[_15c.scheme];
_15c.authority=_15c.host+":"+_15c.port;
}
this.origin=_15c.scheme+"://"+_15c.authority;
this.location=_15b;
this.lineQueue=[];
this.xhr=null;
this.reconnectTimer=null;
var _15e=this;
setTimeout(function(){
_connect(_15e,false);
},0);
};
var _15f=EventSource.prototype;
_15f.readyState=0;
_15f.onopen=function(){
};
_15f.onmessage=function(_160){
};
_15f.onerror=function(){
};
_15f.disconnect=function(){
if(this.readyState!==2){
_disconnect(this);
}
};
function _connect(_161,_162,_163){
if(_161.reconnectTimer!==null){
_161.reconnectTimer=null;
}
var _164=new URI(_161.location);
if(_163===undefined){
_163=[];
}
if(_161.lastEventId!==null){
_163.push(".ka="+this.lastEventId);
}
if(_161.location.indexOf("&.kb=")===-1&&_161.location.indexOf("?.kb=")===-1){
_163.push(".kb=512");
}
switch(browser){
case "ie":
case "safari":
_163.push(".kp=256");
break;
case "firefox":
_163.push(".kp=1025");
_163.push(String(Math.random()).substring(2));
break;
case "android":
_163.push(".kp=4096");
_163.push(".kbp=4096");
break;
}
if(_163.length>0){
if(_164.query===undefined){
_164.query=_163.join("&");
}else{
_164.query+="&"+_163.join("&");
}
}
var xhr=_161.xhr=new XMLHttpRequest0();
var _166={"xhr":xhr,"position":0};
if(_161.location.indexOf(".ki=p")==-1||_161.location.indexOf("https://")==0){
xhr.onprogress=function(){
setTimeout(function(){
_process(_161,_166);
},0);
};
}
xhr.onload=function(){
_process(_161,_166);
if(_161.xhr==_166.xhr&&_161.readyState!=2){
_reconnect(_161);
}
};
xhr.onerror=function(){
if(_161.readyState!=2){
_disconnect(_161);
_error(_161);
}
};
xhr.ontimeout=function(){
if(_161.readyState!=2){
_disconnect(_161);
_error(_161);
}
};
xhr.onreadystatechange=function(){
if(!_162){
if(xhr.readyState>=3){
_161.readyState=1;
if(typeof (_161.onopen)==="function"){
_161.onopen();
}
xhr.onreadystatechange=function(){
};
}
}
};
xhr.open("GET",_164.toString(),true);
xhr.send(null);
if(_161.location.indexOf(".ki=p")==-1){
setTimeout(function(){
if(xhr.readyState<3&&_161.readyState<2){
_connect(_161,false,new Array(".ki=p"));
}
},3000);
}
};
function _disconnect(_167){
if(_167.reconnectTimer!==null){
clearTimeout(_167.reconnectTimer);
_167.reconnectTimer=null;
}
_167.lineQueue=[];
_167.lastEventId=null;
_167.location=null;
_167.readyState=2;
if(_167.xhr!==null){
_167.xhr.onprogress=function(){
};
_167.xhr.onload=function(){
};
_167.xhr.onerror=function(){
};
_167.xhr.onreadystatechange=function(){
};
_167.xhr.abort();
}
};
function _reconnect(_168){
_168.readyState=0;
if(_168.location!==null){
var _169=_168.retry;
var _16a=_168.immediate;
if(_16a){
_168.immediate=false;
_169=0;
}else{
_error(_168);
}
if(_168.readyState==0){
_168.reconnectTimer=setTimeout(function(){
_connect(_168,_16a);
},_169);
}
}
};
var _16b=/[^\r\n]+|\r\n|\r|\n/g;
function _process(_16c,_16d){
var _16e=_16d.xhr.responseText;
var _16f=_16e.slice(_16d.position);
var _170=_16f.match(_16b)||[];
var _171=_16c.lineQueue;
var _172="";
while(_170.length>0){
var _173=_170.shift();
switch(_173.charAt(0)){
case "\r":
case "\n":
_16d.position+=_172.length+_173.length;
if(_172===""){
_dispatch(_16c);
}else{
_171.push(_172);
_172="";
}
break;
default:
_172=_173;
break;
}
}
};
function _dispatch(_174){
var data="";
var name="message";
var _177=_174.lineQueue;
while(_177.length>0){
var line=_177.shift();
var _179=null;
var _17a="";
var _17b=line.indexOf(":");
if(_17b==-1){
_179=line;
_17a="";
}else{
if(_17b===0){
continue;
}else{
_179=line.slice(0,_17b);
var _17c=_17b+1;
if(line.charAt(_17c)==" "){
_17c++;
}
_17a=line.slice(_17c);
}
}
switch(_179){
case "event":
name=_17a;
break;
case "id":
_174.lastEventId=_17a;
break;
case "retry":
_17a=parseInt(_17a,10);
if(!isNaN(_17a)){
_174.retry=_17a;
}
break;
case "data":
if(data.length>0){
data+="\n";
}
data+=_17a;
break;
case "location":
if(_17a!=""){
_174.location=_17a;
}
break;
case "reconnect":
_174.immediate=true;
break;
default:
break;
}
}
if(data.length>0||(name.length>0&&name!="message")){
var e=document.createEvent("Events");
e.initEvent(name,true,true);
e.lastEventId=_174.lastEventId;
e.data=data;
e.origin=_174.origin;
if(e.source!==null){
e.source=null;
}
if(typeof (_174.onmessage)==="function"){
_174.onmessage(e);
}
}
};
function _error(_17e){
var e=document.createEvent("Events");
e.initEvent("error",true,true);
if(typeof (_17e.onerror)==="function"){
_17e.onerror(e);
}
};
return EventSource;
})();
}else{
window.EventSource=(function(){
var _180={};
var _181={};
var _182=0;
function EventSource(_183){
this.readyState=0;
var id=register(this);
var pipe=supplyPipe(this,_183);
pipe.attach(id);
var _186=["c",id,toPaddedHex(_183.length,4),_183].join("");
pipe.post(_186);
this._id=id;
this._pipe=pipe;
};
var _187=EventSource.prototype;
_187.disconnect=function(){
var pipe=this._pipe;
if(pipe!==undefined){
pipe.post(["a",this._id].join(""));
pipe.detach(this._id);
}
this.readyState=2;
};
function register(_189){
var id=toPaddedHex(_182++,8);
_181[id]=_189;
_189._id=id;
return id;
};
function supplyPipe(_18b,_18c){
var uri=new URI(_18c);
var _18e=(uri.scheme!=null&&uri.authority!=null);
var _18f=_18e?uri.scheme:locationURI.scheme;
var _190=_18e?uri.authority:locationURI.authority;
if(_190!=null&&uri.port==null){
_190=uri.host+":"+defaultPorts[_18f];
}
var _191=_18f+"://"+_190;
var pipe=_180[_191];
if(pipe===undefined){
var _193=document.createElement("iframe");
_193.style.position="absolute";
_193.style.left="-10px";
_193.style.top="10px";
_193.style.visibility="hidden";
_193.style.width="0px";
_193.style.height="0px";
var _194=new URI(_191);
_194.query=".kr=xse&.kv=10.05";
_194.path="/";
_193.src=_194.toString();
function post(_195){
this.buffer.push(_195);
};
function attach(id){
var _197=this.attached[id];
if(_197===undefined){
_197={};
this.attached[id]=_197;
}
if(_197.timerID!==undefined){
clearTimeout(_197.timerID);
delete _197.timerID;
}
};
function detach(id){
var _199=this.attached[id];
if(_199!==undefined&&_199.timerID===undefined){
var _19a=this;
_199.timerID=setTimeout(function(){
delete _19a.attached[id];
postMessage0(pipe.iframe.contentWindow,["d",id].join(""),pipe.targetOrigin);
},10000);
}
};
pipe={"targetOrigin":_191,"iframe":_193,"buffer":[],"post":post,"attach":attach,"detach":detach,"attached":{count:0}};
_180[_191]=pipe;
function sendInitWhenReady(){
var _19b=_193.contentWindow;
if(!_19b){
setTimeout(sendInitWhenReady,20);
}else{
postMessage0(_19b,"I",_191);
}
};
pipe.handshakeID=setTimeout(function(){
_180[_191]=undefined;
pipe.post=function(_19c){
_18b.readyState=4;
_18b.status=0;
onreadystatechange(_18b);
};
if(pipe.buffer.length>0){
pipe.post();
}
},30000);
document.body.appendChild(_193);
sendInitWhenReady();
}
return pipe;
};
function onmessage(_19d){
var _19e=_19d.origin;
var _19f={"http":":80","https":":443"};
var _1a0=_19e.split(":");
if(_1a0.length===2){
_19e+=_19f[_1a0[0]];
}
var pipe=_180[_19e];
if(pipe!==undefined&&pipe.iframe!==undefined&&_19d.source==pipe.iframe.contentWindow){
if(_19d.data=="I"){
clearTimeout(pipe.handshakeID);
var _1a2;
while((_1a2=pipe.buffer.shift())!==undefined){
postMessage0(pipe.iframe.contentWindow,_1a2,pipe.targetOrigin);
}
pipe.post=function(_1a3){
postMessage0(pipe.iframe.contentWindow,_1a3,pipe.targetOrigin);
};
}else{
var _1a2=_19d.data;
if(_1a2.length>=9){
var _1a4=0;
var type=_1a2.substring(_1a4,_1a4+=1);
var id=_1a2.substring(_1a4,_1a4+=8);
var _1a7=_181[id];
if(_1a7!==undefined){
switch(type){
case "D":
var _1a8=fromHex(_1a2.substring(_1a4,_1a4+=4));
var name=_1a2.substring(_1a4,_1a4+=_1a8);
var _1aa=fromHex(_1a2.substring(_1a4,_1a4+=4));
var data=_1a2.substring(_1a4,_1a4+=_1aa);
if(data.length>0||(name.length>0&&name!="message")){
var e=document.createEvent("Events");
e.initEvent(name,true,true);
e.lastEventId=_1a7.lastEventId;
e.data=data;
e.origin=_1a7.origin;
if(typeof (_1a7.onmessage)==="function"){
_1a7.onmessage(e);
}
}
break;
case "O":
_1a7.readyState=1;
_1a7.onopen();
break;
case "E":
if(_1a7._id===id){
_1a7.onerror();
}
break;
}
}
}
}
}else{
}
};
function fromHex(_1ad){
return parseInt(_1ad,16);
};
function toPaddedHex(_1ae,_1af){
var hex=_1ae.toString(16);
var _1b1=[];
_1af-=hex.length;
while(_1af-->0){
_1b1.push("0");
}
_1b1.push(hex);
return _1b1.join("");
};
window.addEventListener("message",onmessage,false);
return EventSource;
})();
}
