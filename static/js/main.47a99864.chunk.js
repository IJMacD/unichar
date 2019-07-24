(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{1:function(e,t,n){e.exports={container:"style_container__3_DMp",input:"style_input__1YW7l",inOutContainer:"style_inOutContainer__3h3wy",inputContainer:"style_inputContainer__32pb4",outputContainer:"style_outputContainer__1PfUU",inputList:"style_inputList__3kt0A",inputChoice:"style_inputChoice__39L7a",selectedInput:"style_selectedInput__bIBmO",invalidInput:"style_invalidInput__2qTGo",output:"style_output__3pnKu",label:"style_label__l4NLQ",labelName:"style_labelName__jl-bL",char:"style_char__s_0jS",byte:"style_byte__37Hub",binaryByte:"style_binaryByte__1K0G0",bytePrefix:"style_bytePrefix__1gPwZ",byteData:"style_byteData__TnKXT",switchInput:"style_switchInput__3HbNV"}},16:function(e,t,n){e.exports=n(26)},21:function(e,t,n){},25:function(e,t,n){},26:function(e,t,n){"use strict";n.r(t);var a={};n.r(a),n.d(a,"raw",function(){return S}),n.d(a,"encoded",function(){return _}),n.d(a,"decimal",function(){return C}),n.d(a,"hex",function(){return N}),n.d(a,"utf8",function(){return w});var r=n(0),i=n.n(r),c=n(8),o=n.n(c),l=(n(21),n(5)),u=n.n(l),s=n(9),p=n(2),d=n(10),m=n(11),f=n(14),h=n(12),v=n(15),b=n(3),y=n.n(b),g=n(4),E=n.n(g),S={label:"Raw Characters",isValid:function(){return!0},parse:function(e){for(var t=String(e),n=[],a=0;a<t.length;a++){var r=t.codePointAt(a);n.push(r),r>65535&&a++}return n}},_={label:"Encoded String",isValid:function(){return!0},parse:function(e){return S.parse(E.a.decode(String(e)))}},C={label:"Code Point List (Decimal)",isValid:function(e){if(!/^[\d ]*$/.test(e))return!1;try{return C.parse(e).every(function(e){return e>=0&&e<1114112})}catch(t){return!1}},parse:function(e){return String(e).trim().replace(/ +/g," ").split(" ").map(function(e){return parseInt(e,10)})}},N={label:"Code Point List (Hexidecimal)",isValid:function(e){if(!/^ *((U\+)?[\da-f-]+,? *)*$/i.test(e))return!1;try{return N.parse(e).every(function(e){return e>=0&&e<1114112})}catch(t){return!1}},parse:function(e){return String(e).trim().replace(/[,\s]+/g," ").replace(/([\da-f]+)-([\da-f]+)/g,function(e,t,n){var a=parseInt(t,16),r=parseInt(n,16);if(a>=r)throw RangeError("Start must be less than end: ".concat(a," < ").concat(r));return Array(r-a+1).fill(0).map(function(e,t){return(t+a).toString(16)}).join(" ")}).split(" ").map(function(e){return e.replace(/^U\+/,"")}).map(function(e){return parseInt(e,16)})}},w={label:"UTF-8 Bytes",isValid:function(e){if(!/^[\da-f ,]*$/i.test(e))return!1;try{var t=String(e).replace(/[ ,]/g,"");if(t.length%2)return!1;for(var n=[],a=0;a<t.length;a+=2)n.push(parseInt(t.substr(a,2),16));var r=String.fromCharCode.apply(String,n);return y.a.decode(r),!0}catch(i){return!1}},parse:function(e){var t=String(e).replace(/ /g,"");if(t.length%2)return[];for(var n=[],a=0;a<t.length;a+=2)n.push(parseInt(t.substr(a,2),16));var r=n.map(function(e){return String.fromCharCode(e)}).join("");try{var i=y.a.decode(r);return Object(p.a)(i).map(function(e){return e.codePointAt(0)})}catch(c){return[]}}},I=n(1),j=n.n(I);function k(e){var t=String.fromCodePoint.apply(String,Object(p.a)(e.codepoints));return i.a.createElement("div",null,i.a.createElement("p",{className:j.a.label},"String",e.onSelect&&i.a.createElement("button",{className:j.a.switchInput,onClick:function(){return e.onSelect(t)}},"\u2794"),i.a.createElement("button",{className:j.a.switchInput,onClick:function(){return function(e){var t=document.createElement("textarea");t.value=e,document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)}(t)}},"\ud83d\udccb")),t)}function O(e){var t=E.a.encode(String.fromCodePoint.apply(String,Object(p.a)(e.codepoints)),{useNamedReferences:!0});return i.a.createElement("div",null,i.a.createElement("p",{className:j.a.label},"Encoded",e.onSelect&&i.a.createElement("button",{className:j.a.switchInput,onClick:function(){return e.onSelect(t)}},"\u2794")),t)}function P(e){var t=e.codepoints.map(function(e){return"U+".concat(e.toString(16))}).join(" ");return i.a.createElement("div",null,i.a.createElement("p",{className:j.a.label},"Code Points (",e.codepoints.length,")",e.onSelect&&i.a.createElement("button",{className:j.a.switchInput,onClick:function(){return e.onSelect(t)}},"\u2794")),e.codepoints.map(function(t,n){return i.a.createElement(V,{value:t,key:n,ucd:e.ucd})}))}function x(e){var t=Object(p.a)(y.a.encode(String.fromCodePoint.apply(String,Object(p.a)(e.codepoints)))).map(function(e){return e.charCodeAt(0).toString(16).padStart(2,"0")}).join(" "),n=y.a.encode(String.fromCodePoint.apply(String,Object(p.a)(e.codepoints))).length;return i.a.createElement("div",null,i.a.createElement("p",{className:j.a.label},"UTF-8 (",n," ",1===n?"byte":"bytes",")",e.onSelect&&i.a.createElement("button",{className:j.a.switchInput,onClick:function(){return e.onSelect(t)}},"\u2794")),e.codepoints.map(function(e,t){return i.a.createElement(L,{value:e,key:t})}))}function U(e){return i.a.createElement("div",null,i.a.createElement("div",{className:j.a.label},"UTF-8 Bits"),e.codepoints.map(function(e,t){return i.a.createElement(B,{value:e,key:t})}))}function V(e){if(isNaN(e.value))return null;var t=String.fromCodePoint(e.value),n=e.ucd?e.ucd.getName(t):"";return i.a.createElement("div",{className:j.a.char,title:n},i.a.createElement("p",null,t),i.a.createElement("span",{className:j.a.label},"U+",Number(e.value).toString(16).toUpperCase()),e.ucd&&i.a.createElement("span",{className:j.a.labelName},n))}function L(e){if(isNaN(e.value))return null;try{var t=Object(p.a)(y.a.encode(String.fromCodePoint(e.value))).map(function(e){return e.charCodeAt(0)});return i.a.createElement("div",{className:j.a.byte,style:{marginRight:4}},t.map(function(e,t){return i.a.createElement("span",{key:t},e.toString(16).padStart(2,"0"))}))}catch(n){return}}function B(e){if(isNaN(e.value))return null;try{var t=Object(p.a)(y.a.encode(String.fromCodePoint(e.value))).map(function(e){return e.charCodeAt(0)});return i.a.createElement("div",{className:j.a.byte+" "+j.a.binaryByte,style:{marginRight:4}},t.map(function(e,t,n){var a,r,c=e.toString(2).padStart(8,"0");return 1===n.length?(a=c.substr(0,1),r=c.substr(1)):0===t?(a=c.substr(0,n.length+1),r=c.substr(n.length+1)):(a=c.substr(0,2),r=c.substr(2)),i.a.createElement("span",{key:t},i.a.createElement("span",{className:j.a.bytePrefix},a),i.a.createElement("span",{className:j.a.byteData},r))}))}catch(n){return}}var D=n(13),A=(n(25),function(e){var t=e.ucd,n=e.onChoose,a=i.a.useState(""),r=Object(D.a)(a,2),c=r[0],o=r[1],l=c.length>=3?function(e,t){for(var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:20,a=[],r=new RegExp(t,"i"),i=0;i<e.characterNameList.length&&a.length<n;i++){var c=e.characterNameList[i];c&&r.test(c)&&a.push({codePoint:i,name:c})}return a}(t,c):[];return i.a.createElement("div",{className:"UCDSearch"},i.a.createElement("label",null,"Search ",i.a.createElement("input",{type:"search",value:c,onChange:function(e){return o(e.target.value)}})),i.a.createElement("ul",{className:"UCDSearch-list"},l.map(function(e){return i.a.createElement("li",{key:e.codePoint,onClick:function(){o(""),n(e.codePoint)}},e.name)})))});var R=function(e){function t(e){var n;return Object(d.a)(this,t),(n=Object(f.a)(this,Object(h.a)(t).call(this,e))).onChange=function(e){n.setValue(e.target.value)},n.state={value:T()||"",inputInterpretation:"raw",ucd:null},n}return Object(v.a)(t,e),Object(m.a)(t,[{key:"setValue",value:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.state.inputInterpretation;this.setState({value:e,inputInterpretation:n},function(){window.location.hash=e;var n=a[t.state.inputInterpretation];n.isValid(e)&&(document.title="".concat("Unichar"," - ").concat(String.fromCodePoint.apply(String,Object(p.a)(n.parse(e)))))})}},{key:"componentDidMount",value:function(){var e=Object(s.a)(u.a.mark(function e(){var t,a,r=this;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return window.addEventListener("hashchange",function(){var e=T();if(e!==r.state.value){var t=/^U\+[0-9a-f]+/i.test(e)?"hex":"raw";r.setState({value:e,inputInterpretation:t})}}),e.next=3,n.e(3).then(n.t.bind(null,28,7));case 3:t=e.sent,(a=t.default).getName("a"),this.setState({ucd:a});case 7:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this,t=this.state,n=t.value,r=t.inputInterpretation,c=t.ucd;if(!(r in a))return i.a.createElement("p",null,"Error: Bad input method chosen");var o=a[r],l=o.isValid(n),u=l?o.parse(n):[];return i.a.createElement("div",{className:j.a.container},i.a.createElement("input",{type:"text",value:n,onChange:this.onChange,className:j.a.input,style:{border:l?"":"1px solid #f33"}}),c&&i.a.createElement(A,{ucd:c,onChoose:function(t){return e.setState({value:n+String.fromCodePoint(t)})}}),i.a.createElement("div",{className:j.a.inOutContainer},i.a.createElement("div",{className:j.a.inputContainer},i.a.createElement("h2",{className:j.a.sectionHeader},"Input Interpretation"),i.a.createElement("ul",{className:j.a.inputList},Object.keys(a).map(function(t){try{var c=j.a.inputChoice,o=a[t],l=o.isValid(n);return l||(c+=" "+j.a.invalidInput),t===r&&(c+=" "+j.a.selectedInput),i.a.createElement("li",{key:t,className:c,onClick:l?function(){return e.setState({inputInterpretation:t})}:void 0},o.label,l&&i.a.createElement("p",null,String.fromCodePoint.apply(String,Object(p.a)(o.parse(n)))))}catch(u){return"Error decoding value"}}))),i.a.createElement("div",{className:j.a.outputContainer},i.a.createElement("h2",{className:j.a.sectionHeader},"Output"),l&&i.a.createElement("ul",{className:j.a.output},i.a.createElement("li",null,i.a.createElement(k,{codepoints:u,onSelect:"raw"!==r&&function(t){return e.setValue(t,"raw")}})),i.a.createElement("li",null,i.a.createElement(P,{codepoints:u,ucd:c,onSelect:"hex"!==r&&function(t){return e.setValue(t.toUpperCase(),"hex")}})),i.a.createElement("li",null,i.a.createElement(x,{codepoints:u,onSelect:"utf8"!==r&&function(t){return e.setValue(t,"utf8")}})),i.a.createElement("li",null,i.a.createElement(U,{codepoints:u})),i.a.createElement("li",null,i.a.createElement(O,{codepoints:u,onSelect:"encoded"!==r&&function(t){return e.setValue(t,"encoded")}}))))))}}]),t}(r.Component);function T(){var e=window.location.hash;return e?decodeURIComponent(e.substr(1)):""}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(i.a.createElement(R,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[16,1,2]]]);
//# sourceMappingURL=main.47a99864.chunk.js.map