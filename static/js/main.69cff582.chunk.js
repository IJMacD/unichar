(this.webpackJsonpunichar=this.webpackJsonpunichar||[]).push([[1],{1:function(t,e,n){t.exports={container:"style_container__2xEoa",input:"style_input__3cuwL",inOutContainer:"style_inOutContainer__9cTJC",inputContainer:"style_inputContainer__1tyxa",outputContainer:"style_outputContainer__1i_DA",inputList:"style_inputList__g9TtZ",inputChoice:"style_inputChoice__a_abM",selectedInput:"style_selectedInput__1Wqc8",invalidInput:"style_invalidInput__2ERqI",output:"style_output__2nInZ",label:"style_label__1q7lj",labelName:"style_labelName__2GXPC",char:"style_char__3d4S7",byte:"style_byte__1Otr3",binaryByte:"style_binaryByte__2Q0TJ",bytePrefix:"style_bytePrefix__1a1Oz",byteData:"style_byteData__3RCep",switchInput:"style_switchInput__2Eixz",codePointList:"style_codePointList__vVxI2"}},22:function(t,e,n){},26:function(t,e,n){},27:function(t,e,n){"use strict";n.r(e);var r={};n.r(r),n.d(r,"raw",(function(){return O})),n.d(r,"encoded",(function(){return x})),n.d(r,"decimal",(function(){return C})),n.d(r,"hex",(function(){return S})),n.d(r,"escaped",(function(){return _})),n.d(r,"utf8",(function(){return w})),n.d(r,"binary",(function(){return N}));var a=n(0),i=n(3),c=n.n(i),o=n(12),s=n.n(o),u=(n(22),n(5)),l=n.n(u),d=n(9),p=n(2),f=n(13),h=n(14),b=n(16),j=n(15),m=n(4),v=n.n(m),g=n(7),y=n.n(g),O={label:"Raw Characters",isValid:function(){return!0},parse(t){for(var e=String(t),n=[],r=0;r<e.length;r++){var a=e.codePointAt(r);n.push(a),a>65535&&r++}return n},fromCodePoint(){return String.fromCharCode.apply(String,arguments)}},x={label:"Encoded String",isValid:function(){return!0},parse:t=>O.parse(y.a.decode(String(t))),fromCodePoint(){return y.a.encode(String.fromCodePoint.apply(String,arguments))}},C={label:"Code Point List (Decimal)",isValid(t){if(!/^[\d ]*$/.test(t))return!1;try{return C.parse(t).every((function(t){return t>=0&&t<1114112}))}catch(e){return!1}},parse:t=>String(t).trim().replace(/ +/g," ").split(" ").map((function(t){return parseInt(t,10)})),fromCodePoint(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return e.map((function(t){return t.toString(10)})).join(" ")}},S={label:"Code Point List (Hexidecimal)",isValid(t){try{return S.parse(t).every((function(t){return t>=0&&t<1114112}))}catch(e){return!1}},parse:t=>String(t).trim().replace(/[,\s]+/g," ").replace(/([\da-f]+)-([\da-f]+)/gi,(function(t,e,n){var r=parseInt(e,16),a=parseInt(n,16);if(r>=a)throw RangeError("Start must be less than end: ".concat(r," < ").concat(a));return Array(a-r+1).fill(0).map((function(t,e){return(e+r).toString(16)})).join(" ")})).split(" ").map((function(t){return t.replace(/^U\+/,"")})).map((function(t){return parseInt(t,16)})),fromCodePoint(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return e.map((function(t){return t.toString(16)})).join(" ")}},_={label:"Escaped Text",isValid(t){try{return this.parse(t).every((function(t){return t>=0&&t<1114112}))}catch(e){return!1}},parse(t){for(var e=[t],n=function(){var t=a[r];e=e.map((function(e){if("string"===typeof e){for(var n,r=[],a=0;n=t.exec(e);)n.index>a&&r.push(e.substring(a,n.index)),a=n.index+n[0].length,r.push(parseInt(n[1],16));return a<e.length&&r.push(e.substr(a)),r}return e})),e=P(e)},r=0,a=[/\\u{([0-9a-fA-F]+)}/g,/\\u([0-9a-fA-F]{4})/g,/\\U([0-9a-fA-F]{8})/g];r<a.length;r++)n();return e=e.map((function(t){return"string"===typeof t?Object(p.a)(t).map((function(t){return t.codePointAt(0)})):t})),P(e)},fromCodePoint(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return e.map((function(t){return t<65535?"\\u"+t.toString(16).padStart(4,"0"):"\\u{".concat(t.toString(16),"}")})).join(" ")}},w={label:"UTF-8 Bytes",isValid(t){if(t=t.replace(/\\x/g,""),!/^[\da-f ,]*$/i.test(t))return!1;try{var e=String(t).replace(/[ ,]/g,"");if(e.length%2)return!1;for(var n=[],r=0;r<e.length;r+=2)n.push(parseInt(e.substr(r,2),16));var a=String.fromCharCode.apply(String,n);return v.a.decode(a),!0}catch(i){return!1}},parse(t){var e=String(t).replace(/\\x/g,"").replace(/ /g,"");if(e.length%2)return[];for(var n=[],r=0;r<e.length;r+=2)n.push(parseInt(e.substr(r,2),16));var a=n.map((function(t){return String.fromCharCode(t)})).join("");try{var i=v.a.decode(a);return Object(p.a)(i).map((function(t){return t.codePointAt(0)}))}catch(c){return[]}},fromCodePoint:t=>Object(p.a)(v.a.encode(String.fromCodePoint.apply(String,Object(p.a)(t)))).map((function(t){return t.charCodeAt(0).toString(16).padStart(2,"0")})).join(" ")},N={label:"UTF-8 (Binary)",isValid(t){if(/[^01 ]/.test(t))return!1;var e=t.split(" ").map((function(t){return parseInt(t,2)})).map((function(t){return String.fromCharCode(t)})).join("");try{return v.a.decode(e),!0}catch(n){return!1}},parse(t){var e=t.trim().split(" ").map((function(t){return parseInt(t,2)})).map((function(t){return String.fromCharCode(t)})).join("");try{var n=v.a.decode(e);return Object(p.a)(n).map((function(t){return t.codePointAt(0)}))}catch(r){return[]}},fromCodePoint(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return e.map((function(t){return t.toString(2).padStart(8,"0")})).join(" ")}},P=function(t){var e;return(e=[]).concat.apply(e,Object(p.a)(t))},I=n(8),k=n(1),A=n.n(k);function V(t){var e=String.fromCodePoint.apply(String,Object(p.a)(t.codepoints));return Object(a.jsxs)("div",{children:[Object(a.jsxs)("p",{className:A.a.label,children:["String",t.onSelect&&Object(a.jsx)("button",{className:A.a.switchInput,onClick:function(){return t.onSelect(e)},children:"\u2794"}),Object(a.jsx)("button",{className:A.a.switchInput,onClick:function(){return function(t){var e=document.createElement("textarea");e.value=t,document.body.appendChild(e),e.select(),document.execCommand("copy"),document.body.removeChild(e)}(e)},children:"\ud83d\udccb"})]}),e]})}function U(t){var e=y.a.encode(String.fromCodePoint.apply(String,Object(p.a)(t.codepoints)),{useNamedReferences:!0});return Object(a.jsxs)("div",{children:[Object(a.jsxs)("p",{className:A.a.label,children:["Encoded",t.onSelect&&Object(a.jsx)("button",{className:A.a.switchInput,onClick:function(){return t.onSelect(e)},children:"\u2794"})]}),e]})}function E(t){var e=t.codepoints.map((function(t){return"U+".concat(t.toString(16))})).join(" "),r=c.a.useState(null),i=Object(I.a)(r,2),o=i[0],s=i[1];return c.a.useEffect((function(){n.e(0).then(n.t.bind(null,29,7)).then((function(t){var e=t.default;s(e)}))}),[]),Object(a.jsxs)("div",{className:A.a.codePointOutput,children:[Object(a.jsxs)("p",{className:A.a.label,children:["Code Points (",t.codepoints.length,")",t.onSelect&&Object(a.jsx)("button",{className:A.a.switchInput,onClick:function(){return t.onSelect(e)},children:"\u2794"})]}),Object(a.jsx)("div",{className:A.a.codePointList,children:t.codepoints.map((function(t,e){return Object(a.jsx)(T,{value:t,ucd:o},e)}))})]})}function L(t){var e=Object(p.a)(v.a.encode(String.fromCodePoint.apply(String,Object(p.a)(t.codepoints)))).map((function(t){return t.charCodeAt(0).toString(16).padStart(2,"0")})).join(" "),n=v.a.encode(String.fromCodePoint.apply(String,Object(p.a)(t.codepoints))).length;return Object(a.jsxs)("div",{children:[Object(a.jsxs)("p",{className:A.a.label,children:["UTF-8 (",n," ",1===n?"byte":"bytes",")",t.onSelect&&Object(a.jsx)("button",{className:A.a.switchInput,onClick:function(){return t.onSelect(e)},children:"\u2794"})]}),t.codepoints.map((function(t,e){return Object(a.jsx)(B,{value:t},e)}))]})}function R(t){return Object(a.jsxs)("div",{children:[Object(a.jsxs)("div",{className:A.a.label,children:["UTF-8 Bits",t.onSelect&&Object(a.jsx)("button",{className:A.a.switchInput,onClick:function(){var e;return t.onSelect((e=N).fromCodePoint.apply(e,Object(p.a)(t.codepoints)))},children:"\u2794"})]}),t.codepoints.map((function(t,e){return Object(a.jsx)(D,{value:t},e)}))]})}function T(t){if(isNaN(t.value))return null;var e=String.fromCodePoint(t.value),n=t.ucd?t.ucd.getName(e):"";return Object(a.jsxs)("div",{className:A.a.char,title:n,children:[Object(a.jsx)("p",{children:e}),Object(a.jsxs)("span",{className:A.a.label,children:["U+",Number(t.value).toString(16).toUpperCase()]}),t.ucd&&Object(a.jsx)("span",{className:A.a.labelName,children:n})]})}function B(t){if(isNaN(t.value))return null;try{var e=Object(p.a)(v.a.encode(String.fromCodePoint(t.value))).map((function(t){return t.charCodeAt(0)}));return Object(a.jsx)("div",{className:A.a.byte,style:{marginRight:4},children:e.map((function(t,e){return Object(a.jsx)("span",{children:t.toString(16).padStart(2,"0")},e)}))})}catch(n){return}}function D(t){if(isNaN(t.value))return null;try{var e=Object(p.a)(v.a.encode(String.fromCodePoint(t.value))).map((function(t){return t.charCodeAt(0)}));return Object(a.jsx)("div",{className:A.a.byte+" "+A.a.binaryByte,style:{marginRight:4},children:e.map((function(t,e,n){var r,i,c=t.toString(2).padStart(8,"0");return 1===n.length?(r=c.substr(0,1),i=c.substr(1)):0===e?(r=c.substr(0,n.length+1),i=c.substr(n.length+1)):(r=c.substr(0,2),i=c.substr(2)),Object(a.jsxs)("span",{children:[Object(a.jsx)("span",{className:A.a.bytePrefix,children:r}),Object(a.jsx)("span",{className:A.a.byteData,children:i})]},e)}))})}catch(n){return}}n(26);function W(t){var e=t.onChoose,r=Object(i.useState)(""),c=Object(I.a)(r,2),o=c[0],s=c[1],u=Object(i.useState)(null),p=Object(I.a)(u,2),f=p[0],h=p[1];Object(i.useEffect)((function(){o&&!f&&function(){j.apply(this,arguments)}()}),[f,o]);var b=o.length>=3?function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:100,r=[],a=[];if(!t)return[];try{for(var i=new RegExp(e,"i"),c=0;c<t.characterNameList.length&&r.length<n;c++){var o=t.characterNameList[c];o&&i.test(o)&&(r.push({codePoint:c,name:o}),a.push(c))}}catch(d){}if(r.length<n&&e.includes(" "))for(var s=e.toUpperCase().split(" "),u=function(e){var n=t.characterNameList[e];n&&s.every((function(t){return n.includes(t)}))&&!a.includes(e)&&r.push({codePoint:e,name:n})},l=0;l<t.characterNameList.length&&r.length<n;l++)u(l);return r}(f,o):[];return Object(a.jsxs)("div",{className:"UCDSearch",children:[Object(a.jsx)("input",{type:"search",value:o,onChange:function(t){return s(t.target.value)},placeholder:"Search"}),Object(a.jsx)("ul",{className:"UCDSearch-list",children:b.map((function(t){return Object(a.jsxs)("li",{onClick:function(){s(""),e(t.codePoint)},children:[t.name," ",String.fromCodePoint(t.codePoint)]},t.codePoint)}))})]});function j(){return(j=Object(d.a)(l.a.mark((function t(){var e,r;return l.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.e(0).then(n.t.bind(null,29,7));case 2:e=t.sent,(r=e.default).getName("a"),h(r);case 6:case"end":return t.stop()}}),t)})))).apply(this,arguments)}}var F="Unichar",H=function(t){Object(b.a)(n,t);var e=Object(j.a)(n);function n(t){var r;return Object(f.a)(this,n),(r=e.call(this,t)).onChange=function(t){r.setValue(t.target.value)},r.state=J(),r}return Object(h.a)(n,[{key:"setValue",value:function(t){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.state.format;this.setState({value:t,format:n},(function(){window.location.hash="".concat(n,":").concat(t);var a=r[e.state.format];a.isValid(t)&&(document.title="".concat(F," - ").concat(String.fromCodePoint.apply(String,Object(p.a)(a.parse(t)))))}))}},{key:"componentDidMount",value:function(){var t=Object(d.a)(l.a.mark((function t(){var e=this;return l.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:window.addEventListener("hashchange",(function(){e.setState(J())})),this.inputRef.focus();case 2:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"insertCodePoint",value:function(t){var e=this.state,n=e.value,a=e.format,i=r[a].fromCodePoint(t);"raw"===a?n+=i:"hex"===a||"decimal"===a||"utf8"===a?n+=" "+i:("encoded"===a||"escaped"===a)&&(n+=i),this.setValue(n)}},{key:"render",value:function(){var t=this,e=this.state,n=e.value,i=e.format;if(!(i in r))return Object(a.jsx)("p",{children:"Error: Bad input method chosen"});var c=r[i],o=c.isValid(n),s=o?c.parse(n):[];return Object(a.jsxs)("div",{className:A.a.container,children:[Object(a.jsx)("input",{type:"text",value:n,onChange:this.onChange,className:A.a.input,style:{border:o?"":"1px solid #f33"},ref:function(e){return t.inputRef=e}}),Object(a.jsx)(W,{onChoose:function(e){return t.insertCodePoint(e)}}),Object(a.jsxs)("div",{className:A.a.inOutContainer,children:[Object(a.jsxs)("div",{className:A.a.inputContainer,children:[Object(a.jsx)("h2",{className:A.a.sectionHeader,children:"Input Interpretation"}),Object(a.jsx)("ul",{className:A.a.inputList,children:Object.keys(r).map((function(e){try{var c=A.a.inputChoice,o=r[e],s=o.isValid(n);return s||(c+=" "+A.a.invalidInput),e===i&&(c+=" "+A.a.selectedInput),Object(a.jsxs)("li",{className:c,onClick:s?function(){return t.setValue(n,e)}:void 0,children:[o.label,s&&Object(a.jsx)("p",{children:String.fromCodePoint.apply(String,Object(p.a)(o.parse(n)))})]},e)}catch(u){return"Error decoding value"}}))})]}),Object(a.jsxs)("div",{className:A.a.outputContainer,children:[Object(a.jsx)("h2",{className:A.a.sectionHeader,children:"Code Points"}),o&&Object(a.jsx)(E,{codepoints:s,onSelect:"hex"===i?null:function(e){return t.setValue(e.toUpperCase(),"hex")}})]}),Object(a.jsxs)("div",{className:A.a.outputContainer,children:[Object(a.jsx)("h2",{className:A.a.sectionHeader,children:"Output"}),o&&Object(a.jsxs)("ul",{className:A.a.output,children:[Object(a.jsx)("li",{children:Object(a.jsx)(V,{codepoints:s,onSelect:"raw"===i?null:function(e){return t.setValue(e,"raw")}})}),Object(a.jsx)("li",{children:Object(a.jsx)(L,{codepoints:s,onSelect:"utf8"===i?null:function(e){return t.setValue(e,"utf8")}})}),Object(a.jsx)("li",{children:Object(a.jsx)(R,{codepoints:s,onSelect:"binary"===i?null:function(e){return t.setValue(e,"binary")}})}),Object(a.jsx)("li",{children:Object(a.jsx)(U,{codepoints:s,onSelect:"encoded"===i?null:function(e){return t.setValue(e,"encoded")}})})]})]})]})]})}}]),n}(i.Component);function J(){var t=window.location.hash;if(!t)return{value:""};var e=decodeURIComponent(t.substr(1)),n=/^([a-z0-9]+):/.exec(e);return n?{format:n[1],value:e.substr(n[0].length)}:{value:e,format:"raw"}}var q=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function z(t,e){navigator.serviceWorker.register(t).then((function(t){t.onupdatefound=function(){var n=t.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),e&&e.onUpdate&&e.onUpdate(t)):(console.log("Content is cached for offline use."),e&&e.onSuccess&&e.onSuccess(t)))})}})).catch((function(t){console.error("Error during service worker registration:",t)}))}s.a.render(Object(a.jsx)(H,{}),document.getElementById("root")),function(t){if("serviceWorker"in navigator){if(new URL("/unichar",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var e="".concat("/unichar","/service-worker.js");q?(!function(t,e){fetch(t).then((function(n){var r=n.headers.get("content-type");404===n.status||null!=r&&-1===r.indexOf("javascript")?navigator.serviceWorker.ready.then((function(t){t.unregister().then((function(){window.location.reload()}))})):z(t,e)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(e,t),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):z(e,t)}))}}()}},[[27,2,3]]]);
//# sourceMappingURL=main.69cff582.chunk.js.map