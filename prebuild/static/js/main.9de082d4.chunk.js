(this["webpackJsonpeine-panel"]=this["webpackJsonpeine-panel"]||[]).push([[0],{253:function(e,n,t){},254:function(e,n,t){"use strict";t.r(n);var a,r=t(0),i=t.n(r),c=t(32),s=t.n(c),o=t(8),d=t(9),l=t(47),p=t(15),u=t(19),b=t(58),j=t(152),x=t(11),h="GET_BOT_PUBLIC_INFO",O="SET_BOT_PUBLIC_INFO",f="GET_BOT_ACCOUNT_INFO",g="SET_BOT_ACCOUNT_INFO",m="DO_LOGIN",v="SET_LOGIN_SUCCESS",w="SET_LOGIN_FAILED",E="TOGGLE_SHOW_PROFILE_CARD",S="UPDATE_RECENT_MESSAGE_LIST",y="CLEAR_UNREAD_TAG",k="SET_CONVERSATION_TARGET",_="UPDATE_MESSAGE_RECORD",I="\ud83c\udfa9  Eine Framework",N="1.0.0",A="https://github.com/kirainmoe/eine";!function(e){e[e.NOT_LOGIN=0]="NOT_LOGIN",e[e.LOGIN_SUCCESS=1]="LOGIN_SUCCESS",e[e.LOGIN_FAILED=2]="LOGIN_FAILED"}(a||(a={}));var T=function(){var e,n=localStorage.getItem("eine_expire"),t=+new Date,a=n&&Number(n)>t,r={uid:a&&(e=localStorage.getItem("eine_uid"))?Number(e):null,username:a?localStorage.getItem("eine_username"):null,authorization:a?localStorage.getItem("eine_authorization"):null,expire:Number(n)};return r.uid&&r.username&&r.authorization||(r={uid:null,username:null,authorization:null,expire:0}),r}(),M=Object(x.a)(Object(x.a)({botName:"Eine",loginStatus:a.NOT_LOGIN,loginErrorCode:0,loginErrorMessage:""},T),{},{qq:0,profile:null,friends:[],groups:[]});var C,F,L,G={messageRecords:{}};!function(e){e.UNKNOWN="UNKNOWN",e.MALE="MALE",e.FEMALE="FEMALE"}(C||(C={})),function(e){e.OWNER="OWNER",e.MEMBER="MEMBER",e.ADMINISTRATOR="ADMINISTRATOR"}(F||(F={})),function(e){e.FRIEND_MESSAGE="FriendMessage",e.GROUP_MESSAGE="GroupMessage",e.TEMP_MESSAGE="TempMessage",e.STRANGER_MESSAGE="StrangerMessage",e.OTHER_CLIENT_MESSAGE="OtherClientMessage"}(L||(L={}));var R=[L.FRIEND_MESSAGE,L.GROUP_MESSAGE,L.TEMP_MESSAGE,L.STRANGER_MESSAGE],z={showProfileCard:!1,recentMessages:{},currentConversationType:L.FRIEND_MESSAGE,currentConversationTarget:0};var P=Object(b.b)({bot:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:M,n=arguments.length>1?arguments[1]:void 0;switch(n.type){case O:return Object(x.a)(Object(x.a)({},e),n.payload);case v:return localStorage.setItem("eine_uid",n.uid),localStorage.setItem("eine_username",n.username),localStorage.setItem("eine_authorization",n.authToken),localStorage.setItem("eine_expire",n.expire),Object(x.a)(Object(x.a)({},e),{},{uid:n.uid,username:n.username,authorization:n.authToken,expire:n.expire,loginStatus:a.LOGIN_SUCCESS,loginErrorCode:0,loginErrorMessage:""});case w:return Object(x.a)(Object(x.a)({},e),{},{loginStatus:a.LOGIN_FAILED,loginErrorCode:n.code,loginErrorMessage:n.message});case m:return Object(x.a)(Object(x.a)({},e),{},{loginStatus:a.NOT_LOGIN});case g:return Object(x.a)(Object(x.a)({},e),{},{qq:n.payload.qq,profile:n.payload.profile,friends:n.payload.friendList,groups:n.payload.groupList});default:return e}},ui:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:z,n=arguments.length>1?arguments[1]:void 0,t={};switch(n.type){case E:return Object(x.a)(Object(x.a)({},e),{},{showProfileCard:!e.showProfileCard});case S:return t[n.id]={id:n.id,name:n.name,avatar:n.avatar,priority:+new Date,timestamp:+new Date,lastMessageStr:n.messageStr,isRead:n.id===e.currentConversationTarget,sourceType:n.sourceType,sender:n.sender},Object(x.a)(Object(x.a)({},e),{},{recentMessages:Object(x.a)(Object(x.a)({},e.recentMessages),t)});case y:return(t={})[n.id]=Object(x.a)(Object(x.a)({},e.recentMessages[n.id]),{},{isRead:!0}),Object(x.a)(Object(x.a)({},e),{},{recentMessages:Object(x.a)(Object(x.a)({},e.recentMessages),t)});case k:return Object(x.a)(Object(x.a)({},e),{},{currentConversationType:n.conversationType,currentConversationTarget:n.target});default:return e}},record:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:G,n=arguments.length>1?arguments[1]:void 0,t={};switch(n.type){case _:return t[n.target]=[].concat(e.messageRecords[n.target]?e.messageRecords[n.target].slice(-100):[],[{type:n.sourceType,sender:n.sender,messageChain:n.messageChain,time:+new Date}]),Object(x.a)(Object(x.a)({},e),{},{messageRecords:Object(x.a)(Object(x.a)({},e.messageRecords),t)});default:return e}}}),D=t(26),q=t.n(D),U=t(52),H=t(56),B=t(41),W=t.n(B),J=function(e,n,t,a){return{type:v,uid:e,username:n,authToken:t,expire:a}},K=function(e,n){return{type:w,code:e,message:n}},X={botAccountInfo:"/api/account_info",botPublicInfo:"/api/public_info",install:"/api/install",login:"/api/login"},V=q.a.mark(Z),Q=q.a.mark(Y);function Z(e){var n,t,a,r,i,c,s;return q.a.wrap((function(o){for(;;)switch(o.prev=o.next){case 0:return o.prev=0,o.next=3,Object(H.b)(W.a.post,X.login,{username:e.username,password:e.password});case 3:if(0!==(n=o.sent).data.code){o.next=11;break}return t=n.data.payload,a=t.uid,r=t.username,i=t.authToken,c=t.expire,o.next=9,Object(H.c)(J(a,r,i,c));case 9:o.next=13;break;case 11:return o.next=13,Object(H.c)(K(n.data.code,n.data.message));case 13:o.next=21;break;case 15:if(o.prev=15,o.t0=o.catch(0),!((s=o.t0.response).status>=400)){o.next=21;break}return o.next=21,Object(H.c)(K(s.data?s.data.code:s.status,s.data?s.data.message:""));case 21:case"end":return o.stop()}}),V,null,[[0,15]])}function Y(){return q.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(H.d)(m,Z);case 2:case"end":return e.stop()}}),Q)}var $=t(150),ee=q.a.mark(ae),ne=q.a.mark(re),te=q.a.mark(ie);function ae(){var e;return q.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,Object(U.b)(W.a.get,X.botPublicInfo);case 2:if(0!==(e=n.sent).data.code){n.next=6;break}return n.next=6,Object(U.c)((t=e.data.payload.botName,{type:O,payload:{botName:t}}));case 6:case"end":return n.stop()}var t}),ee)}function re(e){var n,t;return q.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,Object(U.b)(W.a.get,"".concat(X.botAccountInfo,"?uid=").concat(e.uid),{headers:{authorization:e.authorization}});case 3:return n=a.sent,a.next=6,Object(U.c)((r=n.data.payload,{type:g,payload:r}));case 6:a.next=12;break;case 8:a.prev=8,a.t0=a.catch(0),t=a.t0.response,$.b.error("\u83b7\u53d6\u8d26\u53f7\u4fe1\u606f\u5931\u8d25\uff1a".concat(t.data?t.data.message:t.status));case 12:case"end":return a.stop()}var r}),ne,null,[[0,8]])}function ie(){return q.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(U.d)(h,ae);case 2:return e.next=4,Object(U.d)(f,re);case 4:case"end":return e.stop()}}),te)}var ce=q.a.mark(se);function se(){return q.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(U.a)([ie(),Y()]);case 2:case"end":return e.stop()}}),ce)}var oe=Object(j.a)(),de=Object(b.d)(P,Object(b.a)(oe));oe.run(se);var le,pe,ue,be,je,xe,he,Oe=de,fe=t(69),ge=t(94),me=t.n(ge),ve=t(264),we=t(263),Ee=t(265),Se=t(149),ye=t(3),ke=d.a.div(le||(le=Object(o.a)(["\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n"]))),_e=d.a.div(pe||(pe=Object(o.a)(["\n  width: 500px;\n  max-width: 80vw;\n"]))),Ie=d.a.div(ue||(ue=Object(o.a)(["\n  margin: 40px 0;\n  text-align: center;\n"]))),Ne=d.a.p(be||(be=Object(o.a)(["\n  margin: 20px 0;\n  font-size: 12px;\n  color: #999;\n"])));function Ae(e){var n=ve.a.Item,t=Object(u.c)((function(e){return e.bot})).botName,a=Object(p.f)(),r=function(){var e=Object(fe.a)(q.a.mark((function e(n){var t,r,i,c;return q.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.username,r=n.password,i=n.magic_token,e.next=3,W.a.post(X.install,{username:t,password:me()(r),magic_token:i}).catch((function(e){var n=e.response;return n.data?$.b.error("\u521d\u59cb\u5316\u5931\u8d25\uff0c\u670d\u52a1\u5668\u8fd4\u56de\u72b6\u6001\u7801\u4e3a ".concat(n.data.code,"\uff0c\u539f\u56e0\uff1a").concat(400===n.data.code?n.data.errors.map((function(e){return e.msg})).join(", "):n.data.message)):$.b.error("\u521d\u59cb\u5316\u5931\u8d25\uff0c\u670d\u52a1\u5668\u8fd4\u56de\u72b6\u6001\u7801\u4e3a ".concat(n.status)),null}));case 3:(c=e.sent)&&c.data&&($.b.success("\u521d\u59cb\u5316\u3001\u521b\u5efa\u7528\u6237\u6210\u529f\uff01"),setTimeout((function(){return a.push("/login")}),3e3));case 5:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}();return Object(ye.jsx)(ke,{className:"eine-install-page",children:Object(ye.jsxs)(_e,{children:[Object(ye.jsxs)(we.a,{title:"\ud83c\udfa9 Welcome to ".concat(t,"!"),children:[Object(ye.jsx)("p",{children:"\u521d\u6b21\u8fdb\u5165\u540e\u53f0\uff0c\u9700\u8981\u521b\u5efa Master \u7528\u6237\u3002"}),Object(ye.jsxs)(ve.a,{name:"install-form",onFinish:r,children:[Object(ye.jsx)(n,{name:"username",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u7528\u6237\u540d\uff01"}],children:Object(ye.jsx)(Ee.a,{placeholder:"\u7528\u6237\u540d"})}),Object(ye.jsx)(n,{name:"password",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5bc6\u7801\uff01"}],children:Object(ye.jsx)(Ee.a.Password,{placeholder:"\u5bc6\u7801"})}),Object(ye.jsx)(n,{name:"magic_token",rules:[{required:!0,message:"\u8bf7\u8f93\u5165 Magic Token\uff01"}],children:Object(ye.jsx)(Ee.a,{placeholder:"Magic Token"})}),Object(ye.jsx)(Ne,{children:"Tips: \u4f60\u53ef\u4ee5\u5728\u8fd0\u884c Eine \u7684\u63a7\u5236\u53f0\u4e2d\u627e\u5230 Magic Token. \u5b83\u662f\u4e00\u4e2a\u957f\u5ea6\u4e3a 10 \u4e2a\u5b57\u7b26\u7684\u968f\u673a\u5b57\u6bcd\u6216\u6570\u5b57\u3002"}),Object(ye.jsx)(n,{wrapperCol:{offset:10,span:16},children:Object(ye.jsx)(Se.a,{type:"primary",htmlType:"submit",children:"\u521b\u5efa\u7528\u6237"})})]})]}),Object(ye.jsxs)(Ie,{children:["Powered by ",Object(ye.jsx)("a",{href:A,children:I})," v",N]})]})})}var Te=ve.a.Item,Me=d.a.div(je||(je=Object(o.a)(["\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n"]))),Ce=d.a.div(xe||(xe=Object(o.a)(["\n  width: 500px;\n  max-width: 80vw;\n"]))),Fe=d.a.div(he||(he=Object(o.a)(["\n  margin: 40px 0;\n  text-align: center;\n"])));function Le(e){var n=Object(u.c)((function(e){return e.bot})),t=n.botName,i=n.loginStatus,c=n.loginErrorMessage,s=n.loginErrorCode,o=Object(u.b)(),d=Object(p.f)();return Object(r.useEffect)((function(){i===a.LOGIN_FAILED&&$.b.error("\u767b\u5f55\u5931\u8d25\uff0c\u539f\u56e0\uff1a".concat(c," (").concat(s,")")),i===a.LOGIN_SUCCESS&&($.b.success("\u767b\u5f55\u6210\u529f\uff01"),d.push("/panel"))}),[i,s,c,d]),Object(ye.jsx)(Me,{children:Object(ye.jsxs)(Ce,{children:[Object(ye.jsx)(we.a,{title:"\u767b\u5f55 ".concat(t," \u7ba1\u7406\u540e\u53f0"),children:Object(ye.jsxs)(ve.a,{name:"user-login",onFinish:function(e){var n=e.username,t=e.password;o(function(e,n){return{type:m,username:e,password:n}}(n,me()(t)))},children:[Object(ye.jsx)(Te,{name:"username",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u7528\u6237\u540d\uff01"}],children:Object(ye.jsx)(Ee.a,{placeholder:"\u7528\u6237\u540d"})}),Object(ye.jsx)(Te,{name:"password",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5bc6\u7801\uff01"}],children:Object(ye.jsx)(Ee.a.Password,{placeholder:"\u5bc6\u7801"})}),Object(ye.jsxs)("p",{children:[Object(ye.jsx)(Se.a,{type:"link",style:{padding:0},children:"\u91cd\u8bbe\u767b\u5f55\u51ed\u636e"}),Object(ye.jsx)(Se.a,{type:"primary",htmlType:"submit",style:{float:"right"},children:"\u767b\u5f55"})]})]})}),Object(ye.jsxs)(Fe,{children:["Powered by ",Object(ye.jsx)("a",{href:A,children:I})," ",N]})]})})}var Ge,Re,ze=t(258),Pe=t(259),De=t(260),qe=t(261),Ue=function(e){return"http://q.qlogo.cn/g?b=qq&s=100&nk=".concat(e)},He=function(e){return"http://p.qlogo.cn/gh/".concat(e,"/").concat(e,"/0")},Be=t(256),We=t(257);!function(e){e.SOURCE="Source",e.QUOTE="Quote",e.AT="At",e.AT_ALL="AtAll",e.FACE="Face",e.PLAIN="Plain",e.IMAGE="Image",e.FLASH_IMAGE="FlashImage",e.VOICE="Voice",e.XML="Xml",e.JSON="Json",e.APP="App",e.POKE="Poke",e.DICE="Dice",e.MUSIC_SHARE="MusicShare",e.FORWARD_MESSAGE="ForwardMessage",e.FILE="File",e.PRELOAD="Preload"}(Ge||(Ge={})),function(e){e.POKE="Poke",e.SHOW_LOVE="ShowLove",e.LIKE="Like",e.HEARTBROKEN="Heartbroken",e.SIX_SIX_SIX="SixSixSix",e.FANG_DA_ZHAO="FangDaZhao"}(Re||(Re={}));var Je,Ke,Xe,Ve,Qe,Ze,Ye,$e,en,nn,tn,an,rn,cn,sn=function(e){if("string"===typeof e)return e;if(e.type)switch(e.type){case Ge.AT:return"@".concat(e.display);case Ge.AT_ALL:return"@\u5168\u4f53\u6210\u5458";case Ge.FACE:return"[\u8868\u60c5]";case Ge.PLAIN:return e.text;case Ge.IMAGE:return"[\u56fe\u7247]";case Ge.FLASH_IMAGE:return"[\u95ea\u7167]";case Ge.VOICE:return"[\u8bed\u97f3]";case Ge.XML:return"[XML]";case Ge.JSON:return"[JSON]";case Ge.APP:return"[\u5c0f\u7a0b\u5e8f]";case Ge.POKE:return"[\u9b54\u6cd5\u8868\u60c5]";case Ge.DICE:return"[\u9ab0\u5b50]";case Ge.MUSIC_SHARE:return"[\u97f3\u4e50] ".concat(e.title," - ").concat(e.summary);case Ge.FILE:return"[\u6587\u4ef6] ".concat(e.name);default:return""}return e.toString?e.toString():""},on=function(e){return e.map((function(e){return sn(e)})).filter((function(e){return e.length>0})).join(" ")},dn=function(){return{type:E}},ln=function(e,n,t){var a="GroupMessage"===e?n.group.name:n.remark?n.remark:n.nickname,r="GroupMessage"===e?He(n.group.id):Ue(n.id),i="GroupMessage"===e?n.group.id:n.id,c=on(t);return"GroupMessage"===e&&(c="".concat(n.memberName,": ").concat(c)),{type:S,id:i,name:a,avatar:r,messageStr:c,sourceType:e,sender:n}},pn=d.a.div(Je||(Je=Object(o.a)(["\n  width: 100vw;\n  height: 100vh;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 30;\n"]))),un=d.a.div(Ke||(Ke=Object(o.a)(["\n  width: 350px;\n  position: fixed;\n  left: 90px;\n  top: 20px;\n  box-shadow: 0px -1px 2px\t-2px rgba(0, 0, 0, 0.16), 0px -3px\t6px\t0px rgba(0, 0, 0, 0.12), 0px 5px\t12px\t4px rgba(0, 0, 0, 0.09);\n  text-align: left;\n  z-index: 35;\n  background: #fff;\n"]))),bn=d.a.div(Xe||(Xe=Object(o.a)(["\n  height: 35%;\n  padding: 30px 20px;\n  background: #5781f3;\n  display: flex;\n  align-items: center;\n"]))),jn=d.a.img(Ve||(Ve=Object(o.a)(["\n  width: 75px;\n  height: 75px;\n  border-radius: 50%;\n  border: 2px solid #fff;  \n"]))),xn=d.a.div(Qe||(Qe=Object(o.a)(["\n  display: inline-block;\n  margin-left: 20px;\n"]))),hn=d.a.p(Ze||(Ze=Object(o.a)(["\n  font-size: 24px;\n  color: #fff;\n  font-weight: 500;\n  margin: 10px 0 5px 0;\n"]))),On=d.a.p(Ye||(Ye=Object(o.a)(["\n  font-size: 14px;\n  color: #fff;\n  margin: 5px 0 10px 0;\n"]))),fn=d.a.div($e||($e=Object(o.a)(["\n  border-bottom: 1px solid #eee;\n  padding: 14px 10px 14px 10px;\n  text-overflow: ellipsis;\n  white-space: none;\n  overflow: hidden;\n  span { color: #000; margin-left: 10px; }\n  svg { padding-top: 4px; }\n"]))),gn=d.a.div(en||(en=Object(o.a)(["\n  padding: 14px 10px 14px 10px;\n  cursor: pointer;\n  transition: .2s ease-out;\n  :hover { background: #e4e4e5; }\n  span { color: #000; margin-left: 10px; }\n  svg { padding-top: 4px; }\n"])));function mn(e){var n=Object(u.c)((function(e){return e.bot})),t=n.qq,a=n.profile,r=n.botName,i=Object(u.b)();return Object(ye.jsx)(pn,{onClick:function(e){i(dn())},children:Object(ye.jsxs)(un,{onClick:function(e){e.stopPropagation()},children:[Object(ye.jsxs)(bn,{children:[Object(ye.jsx)(jn,{src:Ue(t),alt:"avatar"}),Object(ye.jsxs)(xn,{children:[Object(ye.jsx)(hn,{children:a?a.nickname:null}),Object(ye.jsxs)(On,{children:["BOT \u540d\u79f0\uff1a",r]})]})]}),Object(ye.jsxs)(fn,{children:[Object(ye.jsx)(Be.a,{theme:"filled",size:"16",fill:"#90959d"}),Object(ye.jsx)("span",{children:a?a.sign:null})]}),Object(ye.jsxs)(gn,{onClick:function(){$.b.info("\u6b63\u5728\u9000\u51fa\u5f53\u524d\u8d26\u53f7\u2026\u2026"),localStorage.removeItem("eine_uid"),localStorage.removeItem("eine_username"),localStorage.removeItem("eine_authorization"),localStorage.removeItem("eine_expire"),setTimeout((function(){return window.location.href="/login"}),1e3)},children:[Object(ye.jsx)(We.a,{theme:"filled",size:"16",fill:"#90959d"}),Object(ye.jsx)("span",{children:"\u9000\u51fa\u767b\u5f55"})]})]})})}var vn=d.a.div(nn||(nn=Object(o.a)(["\n  width: 80px;\n  height: 100vh;\n  position: fixed;\n  left: 0;\n  top: 0;\n  background: #eff0f1;\n  border-right: 1px solid #d0d1d3;\n  padding: 20px 0;\n  text-align: center;\n  z-index: 20;\n"]))),wn=d.a.img(tn||(tn=Object(o.a)(["\n  width: 50px;\n  height: 50px;\n  border-radius: 50%;\n  margin-bottom: 20px;\n  cursor: pointer;\n"]))),En=d.a.p(an||(an=Object(o.a)(["\n  font-size: 12px;\n  margin: 0px;\n  color: #90959d;\n"]))),Sn=Object(d.a)(l.c)(rn||(rn=Object(o.a)(["\n  display: block;\n  padding: 10px 0;\n  transition: .2s background ease-out;\n  border-left: 4px solid transparent;\n  :hover {\n    background: #dee0e1;\n  }\n  &.active {\n    background: #dee0e1;\n    border-left: 4px solid #2F88FF;\n  }\n  &.active > p {\n    color: #2F88FF;\n  }\n  &.active.message svg path:first-child,  &.active.setting svg path:first-child {\n    fill: #2F88FF;\n    stroke: #2F88FF;\n  }\n  &.active.friends svg path {\n    fill: #2F88FF;\n    stroke: #2F88FF;\n  }\n  &.active.groups svg circle  {\n    fill: #2F88FF;\n    stroke: #2F88FF;\n  }\n  &.active.groups svg path {\n    stroke: #2F88FF;\n  }\n"]))),yn=d.a.div(cn||(cn=Object(o.a)(["\n  width: 80px;\n  position: absolute;\n  bottom: 20px;\n  text-align: center;\n"])));function kn(e){var n=Object(u.c)((function(e){return e.bot})).qq,t=Object(u.c)((function(e){return e.ui})).showProfileCard,a=Object(u.b)();return Object(ye.jsxs)(vn,{className:"eine-navigator",children:[Object(ye.jsxs)("div",{className:"eine-navigator__avatar",children:[Object(ye.jsx)(wn,{src:Ue(n),alt:"User Avatar",referrerPolicy:"no-referrer",onClick:function(){return a(dn())}}),Object(ye.jsxs)(Sn,{to:"/panel/message",className:"message",children:[Object(ye.jsx)(ze.a,{theme:"filled",size:"32",fill:"#90959d"}),Object(ye.jsx)(En,{children:"\u6d88\u606f"})]}),Object(ye.jsxs)(Sn,{to:"/panel/friends",className:"friends",children:[Object(ye.jsx)(Pe.a,{theme:"filled",size:"32",fill:"#90959d"}),Object(ye.jsx)(En,{children:"\u597d\u53cb"})]}),Object(ye.jsxs)(Sn,{to:"/panel/groups",className:"groups",children:[Object(ye.jsx)(De.a,{theme:"filled",size:"32",fill:"#90959d"}),Object(ye.jsx)(En,{children:"\u7fa4\u7ec4"})]}),Object(ye.jsxs)(Sn,{to:"/panel/setting",className:"setting",children:[Object(ye.jsx)(qe.a,{theme:"filled",size:"32",fill:"#90959d"}),Object(ye.jsx)(En,{children:"\u8bbe\u7f6e"})]})]}),Object(ye.jsx)(yn,{children:Object(ye.jsx)("a",{href:A,children:"\ud83c\udfa9 Eine"})}),t&&Object(ye.jsx)(mn,{})]})}var _n,In,Nn,An,Tn,Mn,Cn,Fn=function(e,n,t,a){return{type:_,sourceType:e,target:n,sender:t,messageChain:a}},Ln=null,Gn=void 0,Rn=function(e){var n;try{n=JSON.parse(e)}catch(c){console.error(c)}if("AuthSuccess"===n.type)return Gn=n.token,void console.log("[ws] Auth success, token = ",Gn);if("RefreshToken"===n.type)return Gn=n.token,void console.log("[ws] Refresh token, token = ",Gn);if(R.includes(n.type)){var t=n,a=t.type,r=t.sender,i=t.messageChain;return Oe.dispatch(ln(a,r,i)),void Oe.dispatch(Fn(a,"GroupMessage"===a?r.group.id:r.id,r,i))}},zn=function(e){if(!Ln)return!1;"string"!==typeof e?Ln.send(JSON.stringify(Object(x.a)(Object(x.a)({},e),{},{token:Gn}))):Ln.send(e)},Pn=t(75),Dn=t.n(Pn),qn=d.a.div(_n||(_n=Object(o.a)(["\n  width: 300px;\n  height: 100vh;\n  position: fixed;\n  left: 80px;\n  top: 0px;\n  border-right: 1px solid #dededf;\n  z-index: 10;\n"]))),Un=Object(d.a)(l.c)(In||(In=Object(o.a)(['\n  padding: 20px 15px;\n  display: flex;\n  cursor: pointer;\n  transition: .2s all ease-out;\n  position: relative;\n  :hover { background: #dee0e3; }\n  &.active { background: #f5f6f7; }\n  &.unread::before {\n    content: "";\n    position: absolute;\n    display: inline-block;\n    width: 8px;\n    height: 8px;\n    background: #f00;\n    border-radius: 50%;\n    left: 50px;\n    top: 20px;\n    z-index: 15;\n  }\n']))),Hn=d.a.img(Nn||(Nn=Object(o.a)(["\n  width: 45px;\n  height: 45px;\n  border-radius: 50%;\n  position: relative;\n"]))),Bn=d.a.div(An||(An=Object(o.a)(["\n  width: 100%;\n  margin: 0 10px;\n  overflow: hidden;\n  p { margin: 0; }\n"]))),Wn=d.a.p(Tn||(Tn=Object(o.a)(["\n  width: calc(100% - 25px);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: #000;\n"]))),Jn=d.a.p(Mn||(Mn=Object(o.a)(["\n  width: 100%;\n  color: #888;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n"]))),Kn=d.a.span(Cn||(Cn=Object(o.a)(["\n  position: absolute;\n  right: 10px;\n  top: 20px;\n  color: #888;\n"])));function Xn(e){var n=Object(u.c)((function(e){return e.ui})).recentMessages,t=Object(u.b)();return Object(ye.jsx)(qn,{children:Object.values(n).sort((function(e,n){return n.priority-e.priority})).map((function(e,n){var a=e.sourceType.replace("Message","").toLowerCase(),r="GroupMessage"===e.sourceType?e.sender.group.id:e.sender.id;return Object(ye.jsxs)(Un,{to:"/panel/message/".concat(a,"/").concat(r),className:e.isRead?"read":"unread",onClick:function(){var n,a,r;t((n=e.id,{type:y,id:n})),t((a=e.sourceType,r=e.id,{type:k,conversationType:a,target:r}))},children:[Object(ye.jsx)(Hn,{src:e.avatar,alt:"avatar"}),Object(ye.jsxs)(Bn,{children:[Object(ye.jsx)(Wn,{children:e.name}),Object(ye.jsx)(Jn,{children:e.lastMessageStr}),Object(ye.jsx)(Kn,{children:Dn()(e.timestamp).format("HH:mm")})]})]},n)}))})}var Vn,Qn,Zn,Yn,$n,et,nt,tt,at,rt=t(78),it=t(262),ct=(t(250),d.a.div(Vn||(Vn=Object(o.a)(["\n  max-width: 50%;\n  margin: 20px 10px 0 10px;\n  display: flex;\n  &.same {\n    margin: 0;\n  }\n  &.same .container {\n    margin-left: 60px;\n    margin-top: 0;\n    padding: 0;\n  }\n  &.same .content {\n    border-radius: 5px 5px 5px 5px ;\n  }\n"])))),st=d.a.img(Qn||(Qn=Object(o.a)(["\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n"]))),ot=d.a.div(Zn||(Zn=Object(o.a)(["\n  width: 100%;\n  margin-left: 10px;\n"]))),dt=d.a.div(Yn||(Yn=Object(o.a)(["\n  color: #888;\n"]))),lt=d.a.span($n||($n=Object(o.a)(["\n  margin-left: 10px;\n  color: #ddd;\n"]))),pt=d.a.div(et||(et=Object(o.a)(["\n  padding: 10px 15px;\n  margin-top: 5px;\n  width: auto;\n  display: inline-block;\n  background: #eff0f1;\n  border-radius: 0px 5px 5px 5px ;\n"]))),ut=d.a.img(nt||(nt=Object(o.a)(["\n  max-width: 100%;\n  display: block;\n"]))),bt=d.a.span(tt||(tt=Object(o.a)(["\n  color: #2f5ed3;\n"]))),jt=function(e){var n=[];return e.forEach((function(e,t){if("string"!==typeof e)switch(e.type){case Ge.PLAIN:return n.push(Object(ye.jsx)("span",{children:e.text},t));case Ge.IMAGE:return n.push(Object(ye.jsx)(ut,{src:e.url,alt:e.imageId,referrerPolicy:"no-referrer"},t));case Ge.AT:return n.push(Object(ye.jsxs)(bt,{children:["@",e.target]},t));case Ge.AT_ALL:return n.push(Object(ye.jsx)(bt,{children:"@\u5168\u4f53\u6210\u5458"},t));case Ge.FACE:return n.push(Object(ye.jsx)("span",{children:"[\u8868\u60c5]"},t))}else n.push(Object(ye.jsx)("span",{children:e},t))})),n};function xt(e){return Object(ye.jsxs)(ct,{className:"".concat(e.id===e.lastId?"same":""),children:[e.id!==e.lastId&&Object(ye.jsx)(st,{src:Ue(e.id),alt:e.name}),Object(ye.jsxs)(ot,{className:"container",children:[e.id!==e.lastId&&Object(ye.jsxs)(dt,{children:[e.showTag&&Object(ye.jsx)("span",{children:e.name}),Object(ye.jsx)(lt,{children:Dn()(e.time).locale("zh-cn").fromNow()})]}),Object(ye.jsx)(pt,{className:"content",children:jt(e.messageChain)})]})]})}var ht,Ot,ft,gt,mt,vt,wt,Et,St=d.a.textarea(at||(at=Object(o.a)(["\n  width: calc(100% - 60px);\n  height: 44px;\n  padding: 10px;\n  border: 1px solid #dededf;\n  outline: 0;\n  margin: 10px 30px;\n  border-radius: 5px;\n  resize: none;\n"])));function yt(e){var n=i.a.createRef(),t=e.uid,a=e.authorization,r=e.target,c=e.type,s=e.name;return Object(ye.jsx)(St,{placeholder:"\u53d1\u9001\u7ed9 ".concat(e.name),onKeyDown:function(e){if("Enter"===e.key){e.preventDefault();var i=e.target.value;if(!i.length)return;W.a.post("/api/send_text",{uid:t,authorization:a,text:i,target:r,type:c}).then((function(e){n.current&&(n.current.value="");var t={id:Oe.getState().bot.qq,memberName:Oe.getState().bot.profile.nickname,nickname:s,group:{name:s,id:r}},a=[{type:Ge.PLAIN,text:i}];Oe.dispatch(Fn(c,r,t,a)),Oe.dispatch(ln(c,Object(x.a)(Object(x.a)({},t),{},{id:r}),a))}))}},ref:n})}var kt,_t,It,Nt,At,Tt,Mt,Ct=d.a.div(ht||(ht=Object(o.a)(["\n  width: calc(100vw - 380px);\n  position: fixed;\n  left: 380px;\n"]))),Ft=d.a.div(Ot||(Ot=Object(o.a)(["\n  padding: 20px 30px;\n  display: flex;\n  border-bottom: 1px solid #dededf;\n"]))),Lt=d.a.img(ft||(ft=Object(o.a)(["\n  width: 45px;\n  height: 45px;\n  border-radius: 50%;\n"]))),Gt=d.a.div(gt||(gt=Object(o.a)(["\n  width: 100%;\n  margin-left: 10px;\n"]))),Rt=d.a.p(mt||(mt=Object(o.a)(["\n  font-size: 16px;\n  font-weight: bold;\n  margin: 0;\n"]))),zt=d.a.p(vt||(vt=Object(o.a)(["\n  width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  margin: 0;\n  color: #90959d;\n  svg { margin-right: 5px; }\n"]))),Pt=d.a.span(wt||(wt=Object(o.a)(["\n  padding: 0 10px;\n"]))),Dt=d.a.div(Et||(Et=Object(o.a)(["\n  padding: 5px 25px;\n  height: calc(90vh - 60px);\n  overflow: auto;\n"])));function qt(e){var n=Object(u.c)((function(e){return e.bot})),t=n.groups,a=n.uid,c=n.authorization,s=Object(u.c)((function(e){return e.record})).messageRecords,o=Number(e.match.params.id),d=t.filter((function(e){return e.id===o})),l=Object(r.useState)(d.length?d[0]:null),p=Object(rt.a)(l,2),b=p[0],j=p[1],x=Object(r.useState)(null),h=Object(rt.a)(x,2),O=h[0],f=h[1],g=i.a.createRef(),m=Object(r.useMemo)((function(){if(s[o]){var e=function(e,n){if("GroupMessage"===n)return e.memberName;var t=e;return t.remark||t.nickname};return s[o].map((function(n,t){return Object(ye.jsx)(xt,{id:n.sender.id,name:e(n.sender,n.type),time:n.time,type:n.type,messageChain:n.messageChain,showTag:!0,lastId:t>0?s[o][t-1].sender.id:-1},t)}))}}),[o,s]);return Object(r.useEffect)((function(){Object(fe.a)(q.a.mark((function e(){var n;return q.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.filter((function(e){return e.id===o})),e.next=3,W.a.get("/api/group_info?uid=".concat(a,"&groupId=").concat(o),{headers:{authorization:c}}).then((function(e){return f(e.data.payload)}));case 3:j(n.length?n[0]:null);case 4:case"end":return e.stop()}}),e)})))()}),[t,o,a,c]),Object(r.useEffect)((function(){var e;g.current&&(g.current.scrollTop=null===(e=g.current)||void 0===e?void 0:e.scrollHeight)}),[o,s]),b?Object(ye.jsxs)(Ct,{children:[Object(ye.jsxs)(Ft,{children:[Object(ye.jsx)(Lt,{src:He(b.id),alt:b.name}),Object(ye.jsxs)(Gt,{children:[Object(ye.jsx)(Rt,{children:b&&b.name}),Object(ye.jsxs)(zt,{children:[Object(ye.jsxs)("span",{children:[Object(ye.jsx)(Pe.a,{theme:"filled",size:"12",fill:"#90959d"}),Object(ye.jsx)("span",{children:O&&O.members.length})]}),Object(ye.jsx)(Pt,{children:"|"}),Object(ye.jsxs)("span",{children:[Object(ye.jsx)(it.a,{theme:"filled",size:"12",fill:"#90959d"}),Object(ye.jsx)("span",{children:O&&O.announcement})]})]})]})]}),Object(ye.jsx)(Dt,{ref:g,children:m}),Object(ye.jsx)(yt,{uid:a,authorization:c,name:b.name,type:L.GROUP_MESSAGE,target:b.id})]}):null}var Ut,Ht,Bt,Wt,Jt,Kt=d.a.div(kt||(kt=Object(o.a)(["\n  width: calc(100vw - 380px);\n  position: fixed;\n  left: 380px;\n"]))),Xt=d.a.div(_t||(_t=Object(o.a)(["\n  padding: 20px 30px;\n  display: flex;\n  border-bottom: 1px solid #dededf;\n"]))),Vt=d.a.img(It||(It=Object(o.a)(["\n  width: 45px;\n  height: 45px;\n  border-radius: 50%;\n"]))),Qt=d.a.div(Nt||(Nt=Object(o.a)(["\n  width: 100%;\n  margin-left: 10px;\n"]))),Zt=d.a.p(At||(At=Object(o.a)(["\n  font-size: 16px;\n  font-weight: bold;\n  margin: 0;\n"]))),Yt=d.a.p(Tt||(Tt=Object(o.a)(["\n  width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  margin: 0;\n  color: #90959d;\n  svg { margin-right: 5px; }\n"]))),$t=d.a.div(Mt||(Mt=Object(o.a)(["\n  padding: 5px 25px;\n  height: calc(90vh - 60px);\n  overflow: auto;\n"])));function ea(e){var n=Object(u.c)((function(e){return e.bot})),t=n.friends,a=n.uid,c=n.authorization,s=Object(u.c)((function(e){return e.record})).messageRecords,o=e.match.params.id,d=t.filter((function(e){return e.id===Number(o)})),l=Object(r.useState)(d.length?d[0]:null),p=Object(rt.a)(l,2),b=p[0],j=p[1],x=i.a.createRef(),h=Object(r.useMemo)((function(){if(s[o]){var e=function(e,n){var t=e;return t.remark||t.nickname};return s[o].map((function(n,t){return Object(ye.jsx)(xt,{id:n.sender.id,name:e(n.sender,n.type),time:n.time,type:n.type,showTag:!1,messageChain:n.messageChain,lastId:t>0?s[o][t-1].sender.id:-1},t)}))}}),[o,s]);return Object(r.useEffect)((function(){Object(fe.a)(q.a.mark((function e(){return q.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,W.a.get("/api/friend_info?uid=".concat(a,"&friendId=").concat(o),{headers:{authorization:c}}).then((function(e){0===e.data.code&&j(Object.assign({},b,e.data.payload))}));case 2:case"end":return e.stop()}}),e)})))()}),[t,o,a,c]),b?Object(ye.jsxs)(Kt,{children:[Object(ye.jsxs)(Xt,{children:[Object(ye.jsx)(Vt,{src:Ue(o),alt:b.nickname}),Object(ye.jsxs)(Qt,{children:[Object(ye.jsx)(Zt,{children:b.remark?b.remark:b.nickname}),Object(ye.jsx)(Yt,{children:b.sign})]})]}),Object(ye.jsx)($t,{ref:x,children:h}),Object(ye.jsx)(yt,{uid:a,authorization:c,name:b.nickname?b.nickname:b.remark,type:L.FRIEND_MESSAGE,target:o})]}):null}var na,ta,aa,ra,ia,ca=d.a.div(Ut||(Ut=Object(o.a)(["\n  width: 300px;\n  height: 100vh;\n  position: fixed;\n  left: 80px;\n  top: 0px;\n  border-right: 1px solid #dededf;\n  z-index: 10;\n  overflow-y: auto;\n"]))),sa=Object(d.a)(l.b)(Ht||(Ht=Object(o.a)(["\n  width: 100%;\n  display: flex;\n  padding: 20px 10px;\n  color: #000;\n  &:hover {\n    background: #dededf;\n    transition: .2s all ease-out;\n    cursor: pointer;\n  }\n"]))),oa=d.a.img(Bt||(Bt=Object(o.a)(["\n  width: 50px;\n  height: 50px;\n  display: block;\n  border-radius: 50%;\n"]))),da=d.a.div(Wt||(Wt=Object(o.a)(["\n  width: calc(100% - 70px);\n  height: 50px;\n  padding: 0 20px;\n  font-size: 16px;\n  line-height: 50px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n"]))),la=d.a.div(Jt||(Jt=Object(o.a)(["\n  text-align: center;\n  padding: 15px 0;\n  border-bottom: 1px solid #dededf;\n"])));function pa(e){var n=Object(u.c)((function(e){return e.bot})).friends,t=Object(r.useMemo)((function(){return n?n.map((function(e,n){return Object(ye.jsxs)(sa,{to:"/panel/message/friend/".concat(e.id),children:[Object(ye.jsx)(oa,{src:Ue(e.id),alt:e.nickname}),Object(ye.jsx)(da,{children:e.remark?e.remark:e.nickname})]},n)})):null}),[n]);return Object(ye.jsxs)(ca,{children:[Object(ye.jsx)(la,{children:"\u8054\u7cfb\u4eba"}),t]})}var ua,ba=d.a.div(na||(na=Object(o.a)(["\n  width: 300px;\n  height: 100vh;\n  position: fixed;\n  left: 80px;\n  top: 0px;\n  border-right: 1px solid #dededf;\n  z-index: 10;\n  overflow-y: auto;\n"]))),ja=Object(d.a)(l.b)(ta||(ta=Object(o.a)(["\n  width: 100%;\n  display: flex;\n  padding: 20px 10px;\n  color: #000;\n  &:hover {\n    background: #dededf;\n    transition: .2s all ease-out;\n    cursor: pointer;\n  }\n"]))),xa=d.a.img(aa||(aa=Object(o.a)(["\n  width: 50px;\n  height: 50px;\n  display: block;\n  border-radius: 50%;\n"]))),ha=d.a.div(ra||(ra=Object(o.a)(["\n  width: calc(100% - 70px);\n  height: 50px;\n  padding: 0 20px;\n  font-size: 16px;\n  line-height: 50px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  \n"]))),Oa=d.a.div(ia||(ia=Object(o.a)(["\n  text-align: center;\n  padding: 15px 0;\n  border-bottom: 1px solid #dededf;\n"])));function fa(e){var n=Object(u.c)((function(e){return e.bot})).groups,t=Object(r.useMemo)((function(){return n?n.map((function(e,n){return Object(ye.jsxs)(ja,{to:"/panel/message/group/".concat(e.id),children:[Object(ye.jsx)(xa,{src:He(e.id),alt:e.name}),Object(ye.jsx)(ha,{children:e.name})]},n)})):null}),[n]);return Object(ye.jsxs)(ba,{children:[Object(ye.jsx)(Oa,{children:"\u7fa4\u7ec4"}),t]})}function ga(e){var n=Object(u.c)((function(e){return e.bot})),t=n.uid,a=n.authorization,i=Object(u.b)(),c=Object(p.f)();return Object(r.useEffect)((function(){null!==t&&null!==a?(i(function(e,n){return{type:f,uid:e,authorization:n}}(t,a)),function(e,n,t){(Ln=new WebSocket(e)).addEventListener("open",(function(){return zn({type:"authenticate",uid:n,authorization:t})})),Ln.addEventListener("message",(function(e){return Rn(e.data)}))}("".concat(window.location.protocol.startsWith("https")?"wss":"ws","://").concat(window.location.host,"/ws"),t,a)):c.push("/login")}),[t,a,i,c]),Object(ye.jsxs)("div",{className:"eine-panel",children:[Object(ye.jsx)(kn,{}),Object(ye.jsx)(p.b,{path:"/panel",exact:!0,children:Object(ye.jsx)(p.a,{to:"/panel/message"})}),Object(ye.jsx)(p.b,{path:"/panel/message",component:Xn}),Object(ye.jsx)(p.b,{path:"/panel/message/group/:id",component:qt}),Object(ye.jsx)(p.b,{path:"/panel/message/friend/:id",component:ea}),Object(ye.jsx)(p.b,{path:"/panel/friends",component:pa}),Object(ye.jsx)(p.b,{path:"/panel/groups",component:fa})]})}var ma=d.a.div(ua||(ua=Object(o.a)(["\n  width: 100vw;\n  height: 100vh;\n"])));function va(){return Object(r.useEffect)((function(){Oe.dispatch({type:h})}),[]),Object(ye.jsx)(ma,{className:"eine-app",children:Object(ye.jsx)(u.a,{store:Oe,children:Object(ye.jsxs)(l.a,{children:[Object(ye.jsx)(p.b,{path:"/",exact:!0,children:Object(ye.jsx)(p.a,{to:"/panel"})}),Object(ye.jsx)(p.b,{path:"/install",component:Ae}),Object(ye.jsx)(p.b,{path:"/login",component:Le}),Object(ye.jsx)(p.b,{path:"/panel",component:ga})]})})})}t(251),t(252),t(253);s.a.render(Object(ye.jsx)(va,{}),document.getElementById("root"))}},[[254,1,2]]]);
//# sourceMappingURL=main.9de082d4.chunk.js.map