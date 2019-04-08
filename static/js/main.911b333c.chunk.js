(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{1:function(e,t,n){e.exports={container:"style_container__3_DMp",input:"style_input__1YW7l",inOutContainer:"style_inOutContainer__3h3wy",inputContainer:"style_inputContainer__32pb4",outputContainer:"style_outputContainer__1PfUU",inputList:"style_inputList__3kt0A",inputChoice:"style_inputChoice__39L7a",selectedInput:"style_selectedInput__bIBmO",invalidInput:"style_invalidInput__2qTGo",output:"style_output__3pnKu",label:"style_label__l4NLQ",char:"style_char__s_0jS",byte:"style_byte__37Hub",binaryByte:"style_binaryByte__1K0G0",switchInput:"style_switchInput__3HbNV"}},13:function(e,t,n){e.exports=n(22)},19:function(e,t,n){},22:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(6),c=n.n(i),u=(n(19),n(2)),o=n(4),l=n.n(o),s=n(7),p=n(8),m=n(9),d=n(11),f=n(10),v=n(12),h=n(3),y=n.n(h),g=n(1),_=n.n(g),E=function(e){function t(e){var n;return Object(p.a)(this,t),(n=Object(d.a)(this,Object(f.a)(t).call(this,e))).onChange=function(e){var t=e.target.value;n.setState({value:t})},n.state={value:"A",inputInterpretation:"raw",ucd:null},n}return Object(v.a)(t,e),Object(m.a)(t,[{key:"componentDidMount",value:function(){var e=Object(s.a)(l.a.mark(function e(){var t,a;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.e(3).then(n.t.bind(null,24,7));case 2:t=e.sent,a=t.default,this.setState({ucd:a});case 5:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this,t=this.state,n=t.value,a=t.inputInterpretation,i=t.ucd,c=b[a](n),u={raw:"Raw Characters",decimal:"Code Point List (Decimal)",hex:"Code Point List (Hexidecimal)",utf8:"UTF-8 Bytes"};if(!(a in S))return r.a.createElement("p",null,"Error: Bad input method chosen");var o=S[a](n);return r.a.createElement("div",{className:_.a.container},r.a.createElement("input",{type:"text",value:n,onChange:this.onChange,className:_.a.input,style:{border:c?"":"1px solid #f33"}}),r.a.createElement("div",{className:_.a.inOutContainer},r.a.createElement("div",{className:_.a.inputContainer},r.a.createElement("h2",{className:_.a.sectionHeader},"Input Interpretation"),r.a.createElement("ul",{className:_.a.inputList},Object.keys(u).map(function(t){var i=_.a.inputChoice,c=b[t](n);return c||(i+=" "+_.a.invalidInput),t===a&&(i+=" "+_.a.selectedInput),r.a.createElement("li",{key:t,className:i,onClick:c?function(){return e.setState({inputInterpretation:t})}:void 0},u[t],c&&r.a.createElement("p",null,S[t](n).map(function(e){return String.fromCodePoint(e)}).join("")))}))),r.a.createElement("div",{className:_.a.outputContainer},r.a.createElement("h2",{className:_.a.sectionHeader},"Output"),c&&r.a.createElement("ul",{className:_.a.output},r.a.createElement("li",null,r.a.createElement(w,{codepoints:o,onSelect:"raw"!==a&&function(t){return e.setState({inputInterpretation:"raw",value:t})}})),r.a.createElement("li",null,r.a.createElement(I,{codepoints:o,ucd:i,onSelect:"hex"!==a&&function(t){return e.setState({inputInterpretation:"hex",value:t})}})),r.a.createElement("li",null,r.a.createElement(k,{codepoints:o,onSelect:"utf8"!==a&&function(t){return e.setState({inputInterpretation:"utf8",value:t})}})),r.a.createElement("li",null,r.a.createElement(O,{codepoints:o}))))))}}]),t}(a.Component),b={raw:function(){return!0},decimal:function(e){if(!/^[\d ]*$/.test(e))return!1;try{return C(e).every(function(e){return e>=0&&e<1114112})}catch(t){return!1}},hex:function(e){if(!/^ *((U\+)?[\da-f]+ *)*$/i.test(e))return!1;try{return N(e).every(function(e){return e>=0&&e<1114112})}catch(t){return!1}},utf8:function(e){if(!/^[\da-f ]*$/i.test(e))return!1;try{var t=String(e).replace(/ /g,"");if(t.length%2)return!1;for(var n=[],a=0;a<t.length;a+=2)n.push(parseInt(t.substr(a,2),16));var r=String.fromCharCode.apply(String,n);return y.a.decode(r),!0}catch(i){return!1}}},S={raw:function(e){for(var t=String(e),n=[],a=0;a<t.length;a++){var r=t.codePointAt(a);n.push(r),r>65535&&a++}return n},decimal:C,hex:N,utf8:function(e){var t=String(e).replace(/ /g,"");if(t.length%2)return[];for(var n=[],a=0;a<t.length;a+=2)n.push(parseInt(t.substr(a,2),16));var r=n.map(function(e){return String.fromCharCode(e)}).join("");try{var i=y.a.decode(r),c=Object(u.a)(i).map(function(e){return e.codePointAt(0)});return c}catch(o){return[]}}};function C(e){return String(e).trim().replace(/ +/g," ").split(" ").map(function(e){return parseInt(e,10)})}function N(e){return String(e).trim().replace(/ +/g," ").split(" ").map(function(e){return e.replace(/^U\+/,"")}).map(function(e){return parseInt(e,16)})}function w(e){var t=String.fromCodePoint.apply(String,Object(u.a)(e.codepoints));return r.a.createElement("div",null,r.a.createElement("p",{className:_.a.label},"String",e.onSelect&&r.a.createElement("button",{className:_.a.switchInput,onClick:function(){return e.onSelect(t)}},"\u2794")),t)}function I(e){var t=e.codepoints.map(function(e){return"U+".concat(e.toString(16))}).join(" ");return r.a.createElement("div",null,r.a.createElement("p",{className:_.a.label},"Code Points (",e.codepoints.length,")",e.onSelect&&r.a.createElement("button",{className:_.a.switchInput,onClick:function(){return e.onSelect(t)}},"\u2794")),e.codepoints.map(function(t,n){return r.a.createElement(j,{value:t,key:n,ucd:e.ucd})}))}function k(e){var t=Object(u.a)(y.a.encode(String.fromCodePoint.apply(String,Object(u.a)(e.codepoints)))).map(function(e){return e.charCodeAt(0).toString(16).padStart(2,"0")}),n=y.a.encode(String.fromCodePoint.apply(String,Object(u.a)(e.codepoints))).length;return r.a.createElement("div",null,r.a.createElement("p",{className:_.a.label},"UTF-8 (",n," ",1===n?"byte":"bytes",")",e.onSelect&&r.a.createElement("button",{className:_.a.switchInput,onClick:function(){return e.onSelect(t)}},"\u2794")),e.codepoints.map(function(e,t){return r.a.createElement(P,{value:e,key:t})}))}function O(e){return r.a.createElement("div",null,r.a.createElement("div",{className:_.a.label},"UTF-8 Bits"),e.codepoints.map(function(e,t){return r.a.createElement(x,{value:e,key:t})}))}function j(e){if(isNaN(e.value))return null;var t=String.fromCodePoint(e.value),n=e.ucd?e.ucd.getName(t):"";return r.a.createElement("div",{className:_.a.char,title:n},r.a.createElement("p",null,t),r.a.createElement("span",{className:_.a.label},"U+",Number(e.value).toString(16).toUpperCase()))}function P(e){if(isNaN(e.value))return null;try{var t=Object(u.a)(y.a.encode(String.fromCodePoint(e.value))).map(function(e){return e.charCodeAt(0)});return r.a.createElement("div",{className:_.a.byte,style:{marginRight:4}},r.a.createElement("div",null,t.map(function(e,t){return r.a.createElement("span",{key:t},e.toString(16).padStart(2,"0"))})))}catch(n){return}}function x(e){if(isNaN(e.value))return null;try{var t=Object(u.a)(y.a.encode(String.fromCodePoint(e.value))).map(function(e){return e.charCodeAt(0)});return r.a.createElement("div",{className:_.a.byte+" "+_.a.binaryByte,style:{marginRight:4}},t.map(function(e,t){return r.a.createElement("span",{key:t},e.toString(2).padStart(8,"0"))}))}catch(n){return}}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(E,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[13,1,2]]]);
//# sourceMappingURL=main.911b333c.chunk.js.map