/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3=globalThis,e$6=t$3.ShadowRoot&&(void 0===t$3.ShadyCSS||t$3.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$5=new WeakMap;let n$4 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$6&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$5.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$5.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$4("string"==typeof t?t:t+"",void 0,s$2),i$5=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$4(o,t,s$2)},S$1=(s,o)=>{if(e$6)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$3.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$6?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$4,defineProperty:e$5,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$4,getPrototypeOf:n$3}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$4(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$5(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$3(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$4(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,i$3=t=>t,s$1=t$2.trustedTypes,e$4=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$3=`lit$${Math.random().toFixed(9).slice(2)}$`,n$2="?"+o$3,r$2=`<${n$2}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$4?e$4.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$3+x):s+o$3+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$3),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$3)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$3),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$2)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$3,t+1));)d.push({type:7,index:l}),t+=o$3.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$3(t).nextSibling;i$3(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$2.litHtmlPolyfillSupport;B?.(S,k),(t$2.litHtmlVersions??=[]).push("3.3.3");const D$1=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;let i$2 = class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D$1(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}};i$2._$litElement$=true,i$2["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i$2});const o$2=s.litElementPolyfillSupport;o$2?.({LitElement:i$2});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o$1={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o$1,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n$1(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n$1({...r,state:true,attribute:false})}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$3=(e,t,c)=>(c.configurable=true,c.enumerable=true,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,c),c);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function e$2(e,r){return (n,s,i)=>{const o=t=>t.renderRoot?.querySelector(e)??null;return e$3(n,s,{get(){return o(this)}})}}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1},e$1=t=>(...e)=>({_$litDirective$:t,values:e});let i$1 = class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const e=e$1(class extends i$1{constructor(t$1){if(super(t$1),t$1.type!==t.ATTRIBUTE||"class"!==t$1.name||t$1.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return " "+Object.keys(t).filter(s=>t[s]).join(" ")+" "}update(s,[i]){if(void 0===this.st){this.st=new Set,void 0!==s.strings&&(this.nt=new Set(s.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in i)i[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(i)}const r=s.element.classList;for(const t of this.st)t in i||(r.remove(t),this.st.delete(t));for(const t in i){const s=!!i[t];s===this.st.has(t)||this.nt?.has(t)||(s?(r.add(t),this.st.add(t)):(r.remove(t),this.st.delete(t)));}return E}});

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const n="important",i=" !"+n,o=e$1(class extends i$1{constructor(t$1){if(super(t$1),t$1.type!==t.ATTRIBUTE||"style"!==t$1.name||t$1.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,r)=>{const s=t[r];return null==s?e:e+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(e,[r]){const{style:s}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(r)),this.render(r);for(const t of this.ft)null==r[t]&&(this.ft.delete(t),t.includes("-")?s.removeProperty(t):s[t]=null);for(const t in r){const e=r[t];if(null!=e){this.ft.add(t);const r="string"==typeof e&&e.endsWith(i);t.includes("-")||r?s.setProperty(t,r?e.slice(0,-11):e,r?n:""):s[t]=e;}}return E}});

const D = "bedtime_stories";
function withEntry(msg, entryId) {
    return entryId ? { ...msg, entry_id: entryId } : msg;
}
const listEntries = (hass) => hass.callWS({ type: `${D}/entries/list` });
/** Resolve a `media-source://…` id to a directly usable (signed) URL. */
const resolveMediaSource = (hass, mediaContentId) => hass.callWS({
    type: "media_source/resolve_media",
    media_content_id: mediaContentId,
});
const subscribeLibrary = (hass, callback, entryId) => hass.connection.subscribeMessage(callback, withEntry({ type: `${D}/subscribe` }, entryId));
const playStory = (hass, storyId, mediaPlayer, entryId) => hass.callWS(withEntry({
    type: `${D}/play`,
    story_id: storyId,
    ...(mediaPlayer ? { media_player: mediaPlayer } : {}),
}, entryId));
/** Record a "this device" playback (audio plays in the browser, not cast). */
const recordPlay = (hass, storyId, source, entryId) => hass.callWS(withEntry({ type: `${D}/play`, story_id: storyId, record_only: true, source }, entryId));
const saveCategory = (hass, category, entryId) => hass.callWS(withEntry({ type: `${D}/category/save`, category }, entryId));
const deleteCategory = (hass, categoryId, entryId) => hass.callWS(withEntry({ type: `${D}/category/delete`, category_id: categoryId }, entryId));
const reorderCategories = (hass, categoryIds, entryId) => hass.callWS(withEntry({ type: `${D}/category/reorder`, category_ids: categoryIds }, entryId));
const reorderStories = (hass, storyIds, entryId) => hass.callWS(withEntry({ type: `${D}/story/reorder`, story_ids: storyIds }, entryId));
const saveStory = (hass, story, entryId) => hass.callWS(withEntry({ type: `${D}/story/save`, story }, entryId));
const deleteStory = (hass, storyId, entryId) => hass.callWS(withEntry({ type: `${D}/story/delete`, story_id: storyId }, entryId));
const resetStats = (hass, storyId, entryId) => hass.callWS(withEntry({ type: `${D}/stats/reset`, ...(storyId ? { story_id: storyId } : {}) }, entryId));

const TRANSLATIONS = {
    en: {
        empty: "No stories yet — add some in the card editor.",
        no_player: "No player available",
        this_device: "This device",
        play_failed: "Playback failed",
        sort_manual: "My order",
        sort_alphabetical: "A–Z",
        sort_play_count: "Favorites",
        sort_last_played: "Recent",
        played_never: "never played",
        played_once: "played once",
        played_times: "played {count}×",
        playing: "Playing…",
        // editor
        tab_settings: "Settings",
        tab_content: "Content",
        section_appearance: "Appearance",
        section_sorting: "Sorting & statistics",
        section_playback: "Playback",
        content_hint: "Categories group your stories and show up as sub-headers in the card. Edits to existing categories and stories save automatically and are shared by all Bedtime Stories cards — the card's own Save button below only applies to the display options.",
        new_category: "New category",
        edit_category: "Edit category",
        new_story: "New story",
        edit_story: "Edit story",
        advanced: "Advanced",
        media_selected: "Selected media",
        media_none: "No media file selected yet",
        media_help: "Browse your Home Assistant media, or upload a new audio file straight to “My media” with the button below.",
        cover_selected: "Selected image",
        cover_none: "No cover image selected yet",
        cover_help: "Browse your Home Assistant media, or upload a picture straight to “My media” with the button below.",
        or: "or",
        upload_file: "Upload",
        uploading: "Uploading…",
        upload_failed: "Upload failed",
        upload_no_media_source: "No writable media folder found. Upload via Settings → Media, or use a share.",
        image_url: "Cover image URL / content id",
        image_url_help: "Direct image URL, /api/image/serve/… path or media-source id — overrides the picker.",
        duration_help: "Shown as a badge on the tile, e.g. “~20m”.",
        media_content_id_help: "Direct media-source URI or stream URL — overrides the picked media.",
        columns_help: "0 = automatic, based on the available width.",
        no_categories: "No categories yet. Start by creating one — for example “General” or “Fairy tales”.",
        title: "Title",
        layout: "Layout",
        layout_grid: "Grid",
        layout_list: "List",
        columns: "Columns (0 = automatic)",
        density: "Density",
        density_cozy: "Cozy",
        density_compact: "Compact",
        show_titles: "Show story titles",
        show_duration: "Show duration badge",
        show_stats: "Show play statistics",
        sort: "Sort stories by",
        sort_direction: "Sort direction",
        asc: "Ascending",
        desc: "Descending",
        show_sort_selector: "Show sort chips in the card",
        show_player: "Show player chip in the header",
        show_device_toggle: "Show “This device” toggle",
        show_device_toggle_help: "Adds a header chip to play the story right here in the browser or companion app, instead of casting to a media player.",
        player_mode: "Playback target",
        player_mode_select: "Player select entity (switchable)",
        player_mode_fixed: "Fixed media player",
        media_player: "Media player",
        entry: "Library",
        categories: "Categories",
        add_category: "Add category",
        add_story: "Add story",
        edit: "Edit",
        delete: "Delete",
        save: "Save",
        cancel: "Cancel",
        done: "Done",
        name: "Name",
        icon: "Icon",
        category: "Category",
        duration: "Duration (minutes)",
        cover: "Cover image",
        media: "Media file",
        media_hint: "Pick a file from the media browser (upload possible there) or paste a media-source URL / stream URL below.",
        media_content_id: "Media URL / content id",
        media_content_type: "Content type",
        story_id_hint: "Story ID (for automations)",
        stories_count: "{count} stories",
        confirm_delete_category: "Delete this category and all of its stories?",
        confirm_delete_story: "Delete this story?",
        not_configured: "Bedtime Stories integration is not set up yet. Add it under Settings → Devices & services.",
        reset_stats: "Reset statistics",
        confirm_reset_stats: "Reset play statistics for this story?",
        drag_reorder: "Drag to reorder",
    },
    de: {
        empty: "Noch keine Geschichten – füge welche im Karten-Editor hinzu.",
        no_player: "Kein Player verfügbar",
        this_device: "Dieses Gerät",
        play_failed: "Wiedergabe fehlgeschlagen",
        sort_manual: "Meine Reihenfolge",
        sort_alphabetical: "A–Z",
        sort_play_count: "Lieblinge",
        sort_last_played: "Zuletzt",
        played_never: "noch nie gehört",
        played_once: "1× gehört",
        played_times: "{count}× gehört",
        playing: "Läuft…",
        tab_settings: "Einstellungen",
        tab_content: "Inhalte",
        section_appearance: "Darstellung",
        section_sorting: "Sortierung & Statistik",
        section_playback: "Wiedergabe",
        content_hint: "Kategorien gruppieren deine Geschichten und erscheinen als Zwischenüberschriften in der Karte. Änderungen an bestehenden Kategorien und Geschichten werden automatisch gespeichert und gelten für alle Bedtime-Stories-Karten — die Save-Schaltfläche der Karte selbst betrifft nur die Darstellungsoptionen.",
        new_category: "Neue Kategorie",
        edit_category: "Kategorie bearbeiten",
        new_story: "Neue Geschichte",
        edit_story: "Geschichte bearbeiten",
        advanced: "Erweitert",
        media_selected: "Ausgewählte Medien",
        media_none: "Noch keine Mediendatei ausgewählt",
        media_help: "Durchsuche deine Home-Assistant-Medien oder lade mit dem Button unten eine neue Audiodatei direkt in „Meine Medien“ hoch.",
        cover_selected: "Ausgewähltes Bild",
        cover_none: "Noch kein Cover-Bild ausgewählt",
        cover_help: "Durchsuche deine Home-Assistant-Medien oder lade mit dem Button unten ein Bild direkt in „Meine Medien“ hoch.",
        or: "oder",
        upload_file: "Hochladen",
        uploading: "Wird hochgeladen…",
        upload_failed: "Upload fehlgeschlagen",
        upload_no_media_source: "Kein beschreibbarer Medienordner gefunden. Lade über Einstellungen → Medien hoch oder nutze eine Freigabe.",
        image_url: "Cover-Bild-URL / Content-ID",
        image_url_help: "Direkte Bild-URL, /api/image/serve/…-Pfad oder media-source-ID — übersteuert die Auswahl.",
        duration_help: "Wird als Badge auf der Kachel angezeigt, z. B. „~20m“.",
        media_content_id_help: "Direkte media-source-URI oder Stream-URL — übersteuert die ausgewählte Datei.",
        columns_help: "0 = automatisch, passend zur verfügbaren Breite.",
        no_categories: "Noch keine Kategorien. Leg zuerst eine an — zum Beispiel „Allgemein“ oder „Märchen“.",
        title: "Titel",
        layout: "Darstellung",
        layout_grid: "Raster",
        layout_list: "Liste",
        columns: "Spalten (0 = automatisch)",
        density: "Dichte",
        density_cozy: "Gemütlich",
        density_compact: "Kompakt",
        show_titles: "Titel der Geschichten anzeigen",
        show_duration: "Dauer-Badge anzeigen",
        show_stats: "Hörstatistik anzeigen",
        sort: "Geschichten sortieren nach",
        sort_direction: "Sortierrichtung",
        asc: "Aufsteigend",
        desc: "Absteigend",
        show_sort_selector: "Sortier-Chips in der Karte anzeigen",
        show_player: "Player-Chip im Kopf anzeigen",
        show_device_toggle: "„Dieses Gerät“-Schalter anzeigen",
        show_device_toggle_help: "Fügt oben einen Chip hinzu, um die Geschichte direkt hier im Browser oder in der Companion-App abzuspielen statt auf einen Mediaplayer zu casten.",
        player_mode: "Wiedergabeziel",
        player_mode_select: "Player-Auswahl-Entität (umschaltbar)",
        player_mode_fixed: "Fester Medienplayer",
        media_player: "Medienplayer",
        entry: "Bibliothek",
        categories: "Kategorien",
        add_category: "Kategorie hinzufügen",
        add_story: "Geschichte hinzufügen",
        edit: "Bearbeiten",
        delete: "Löschen",
        save: "Speichern",
        cancel: "Abbrechen",
        done: "Fertig",
        name: "Name",
        icon: "Icon",
        category: "Kategorie",
        duration: "Dauer (Minuten)",
        cover: "Cover-Bild",
        media: "Mediendatei",
        media_hint: "Wähle eine Datei aus dem Medienbrowser (Upload dort möglich) oder trage unten eine media-source-URL / Stream-URL ein.",
        media_content_id: "Medien-URL / Content-ID",
        media_content_type: "Content-Type",
        story_id_hint: "Geschichten-ID (für Automationen)",
        stories_count: "{count} Geschichten",
        confirm_delete_category: "Diese Kategorie samt aller Geschichten löschen?",
        confirm_delete_story: "Diese Geschichte löschen?",
        not_configured: "Die Bedtime-Stories-Integration ist noch nicht eingerichtet. Füge sie unter Einstellungen → Geräte & Dienste hinzu.",
        reset_stats: "Statistik zurücksetzen",
        confirm_reset_stats: "Hörstatistik dieser Geschichte zurücksetzen?",
        drag_reorder: "Zum Sortieren ziehen",
    },
};
function localize(hass, key, vars) {
    const lang = (hass?.locale?.language ?? hass?.language ?? "en").split("-")[0];
    const table = TRANSLATIONS[lang] ?? TRANSLATIONS.en;
    let text = table[key] ?? TRANSLATIONS.en[key] ?? key;
    if (vars) {
        for (const [name, value] of Object.entries(vars)) {
            text = text.replace(`{${name}}`, String(value));
        }
    }
    return text;
}
/** "vor 2 Tagen" / "2 days ago" via Intl, falling back to the raw date. */
function relativeTime(hass, iso) {
    const lang = hass?.locale?.language ?? hass?.language ?? "en";
    const then = new Date(iso).getTime();
    if (Number.isNaN(then))
        return iso;
    const diffSec = Math.round((then - Date.now()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
    const table = [
        ["year", 60 * 60 * 24 * 365],
        ["month", 60 * 60 * 24 * 30],
        ["week", 60 * 60 * 24 * 7],
        ["day", 60 * 60 * 24],
        ["hour", 60 * 60],
        ["minute", 60],
    ];
    for (const [unit, seconds] of table) {
        if (Math.abs(diffSec) >= seconds) {
            return rtf.format(Math.round(diffSec / seconds), unit);
        }
    }
    return rtf.format(0, "minute");
}

/** Cover values that browse from the media library carry this scheme. */
function isMediaSource(value) {
    return typeof value === "string" && value.startsWith("media-source://");
}
// Resolved media-source URLs are signed and time-limited, so we cache them only
// briefly — long enough to avoid a websocket round-trip per re-render, short
// enough that a freshly created <img> never points at an expired signature.
const TTL_MS = 4 * 60 * 1000;
const cache = new Map();
/**
 * Turn a stored cover value into something usable as an image URL: a
 * `media-source://…` id is resolved via the websocket API (and cached), while
 * plain URLs / `/api/image/serve/…` paths pass straight through.
 */
async function resolveImage(hass, value) {
    if (!value)
        return null;
    if (!isMediaSource(value))
        return value;
    const now = Date.now();
    const hit = cache.get(value);
    if (hit && now - hit.at < TTL_MS)
        return hit.url;
    try {
        const { url } = await resolveMediaSource(hass, value);
        cache.set(value, { url, at: now });
        return url;
    }
    catch {
        return null;
    }
}

const DEFAULT_CONFIG = {
    layout: "grid",
    columns: 0, // 0 = automatic
    density: "cozy",
    show_titles: true,
    show_duration: true,
    show_stats: false,
    sort: "manual",
    sort_direction: "asc",
    show_sort_selector: false,
    show_player: true,
    show_device_toggle: true,
    player_mode: "select",
};

function fireEvent(node, type, detail) {
    const event = new CustomEvent(type, {
        bubbles: true,
        composed: true,
        detail: detail ?? {},
    });
    node.dispatchEvent(event);
}

/** Force-load ha-form and friends (they ship with the entities card editor). */
async function loadHaForm() {
    if (customElements.get("ha-form"))
        return;
    try {
        const helpers = await window.loadCardHelpers?.();
        if (!helpers)
            return;
        const card = await helpers.createCardElement({
            type: "entities",
            entities: [],
        });
        await card.constructor.getConfigElement?.();
    }
    catch {
        // ha-form is usually already defined inside the edit dialog
    }
}
let BedtimeStoriesCardEditor = class BedtimeStoriesCardEditor extends i$2 {
    constructor() {
        super(...arguments);
        this._entries = [];
        /** story.id → resolved cover URL, for images stored as media-source ids. */
        this._covers = {};
        this._formReady = false;
        this._categoryDraft = null;
        this._storyDraft = null;
        this._storyAdvanced = false;
        this._savingContent = false;
        this._computeLabel = (schema) => schema.name === "entry_id" ? this._l("entry") : this._l(schema.name);
        this._computeHelper = (schema) => {
            if (schema.name === "columns")
                return this._l("columns_help");
            if (schema.name === "show_device_toggle") {
                return this._l("show_device_toggle_help");
            }
            return undefined;
        };
        /** The cover section has its own header, so the image selector stays unlabeled. */
        this._noLabel = () => "";
        this._dragEnd = () => {
            this._dragKind = undefined;
            this._dragId = undefined;
            this._dragCategoryId = undefined;
            this._dragOverId = undefined;
        };
    }
    setConfig(config) {
        this._config = { ...config };
        this._connectLibrary();
    }
    connectedCallback() {
        super.connectedCallback();
        void loadHaForm().then(() => {
            this._formReady = true;
        });
        this._connectLibrary();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._unsubscribe?.then((unsub) => unsub()).catch(() => undefined);
        this._unsubscribe = undefined;
        this._subscribedEntry = undefined;
        // Persist a still-pending edit if the dialog is closed mid-debounce.
        if (this._contentTimer) {
            clearTimeout(this._contentTimer);
            this._contentTimer = undefined;
            void this._autoSaveContent();
        }
    }
    updated() {
        if (this.hass && !this._unsubscribe) {
            this._connectLibrary();
        }
    }
    _connectLibrary() {
        if (!this.hass || !this.isConnected)
            return;
        const entry = this._config?.entry_id ?? "";
        if (this._unsubscribe && this._subscribedEntry === entry)
            return;
        this._unsubscribe?.then((unsub) => unsub()).catch(() => undefined);
        this._subscribedEntry = entry;
        void listEntries(this.hass).then((entries) => {
            this._entries = entries;
        });
        this._unsubscribe = subscribeLibrary(this.hass, (snapshot) => {
            this._library = snapshot;
            this._error = undefined;
            void this._resolveCovers(snapshot);
        }, this._config?.entry_id || undefined);
        this._unsubscribe.catch(() => {
            this._unsubscribe = undefined;
            this._library = undefined;
        });
    }
    _l(key, vars) {
        return localize(this.hass, key, vars);
    }
    /** Resolve any media-source cover ids into displayable thumbnail URLs. */
    async _resolveCovers(lib) {
        if (!this.hass)
            return;
        const updates = {};
        await Promise.all(lib.stories.map(async (story) => {
            if (!isMediaSource(story.image))
                return;
            const url = await resolveImage(this.hass, story.image);
            if (url && url !== this._covers[story.id])
                updates[story.id] = url;
        }));
        if (Object.keys(updates).length) {
            this._covers = { ...this._covers, ...updates };
        }
    }
    /** Direct URLs pass through; media-source ids use the resolved cache. */
    _storyThumb(story) {
        if (!story.image)
            return null;
        if (isMediaSource(story.image))
            return this._covers[story.id] ?? null;
        return story.image;
    }
    // ---- settings forms ------------------------------------------------------
    _basicsSchema() {
        const schema = [];
        if (this._entries.length > 1) {
            schema.push({
                name: "entry_id",
                selector: {
                    select: {
                        mode: "dropdown",
                        options: this._entries.map((e) => ({
                            value: e.entry_id,
                            label: e.name,
                        })),
                    },
                },
            });
        }
        schema.push({ name: "title", selector: { text: {} } });
        return schema;
    }
    _appearanceSchema() {
        const config = { ...DEFAULT_CONFIG, ...this._config };
        const layoutRow = [
            {
                name: "layout",
                selector: {
                    select: {
                        mode: "dropdown",
                        options: [
                            { value: "grid", label: this._l("layout_grid") },
                            { value: "list", label: this._l("layout_list") },
                        ],
                    },
                },
            },
        ];
        if (config.layout === "list") {
            // Grid tiles scale via the column count; density only helps list rows.
            layoutRow.push({
                name: "density",
                selector: {
                    select: {
                        mode: "dropdown",
                        options: [
                            { value: "cozy", label: this._l("density_cozy") },
                            { value: "compact", label: this._l("density_compact") },
                        ],
                    },
                },
            });
        }
        else {
            layoutRow.push({
                name: "columns",
                selector: { number: { min: 0, max: 8, mode: "box" } },
            });
        }
        return [
            { name: "", type: "grid", schema: layoutRow },
            {
                name: "",
                type: "grid",
                schema: [
                    { name: "show_titles", selector: { boolean: {} } },
                    { name: "show_duration", selector: { boolean: {} } },
                ],
            },
        ];
    }
    _sortingSchema() {
        return [
            {
                name: "",
                type: "grid",
                schema: [
                    {
                        name: "sort",
                        selector: {
                            select: {
                                mode: "dropdown",
                                options: [
                                    { value: "manual", label: this._l("sort_manual") },
                                    { value: "alphabetical", label: this._l("sort_alphabetical") },
                                    { value: "play_count", label: this._l("sort_play_count") },
                                    { value: "last_played", label: this._l("sort_last_played") },
                                ],
                            },
                        },
                    },
                    {
                        name: "sort_direction",
                        selector: {
                            select: {
                                mode: "dropdown",
                                options: [
                                    { value: "asc", label: this._l("asc") },
                                    { value: "desc", label: this._l("desc") },
                                ],
                            },
                        },
                    },
                ],
            },
            {
                name: "",
                type: "grid",
                schema: [
                    { name: "show_sort_selector", selector: { boolean: {} } },
                    { name: "show_stats", selector: { boolean: {} } },
                ],
            },
        ];
    }
    _playbackSchema() {
        const config = { ...DEFAULT_CONFIG, ...this._config };
        const schema = [
            {
                name: "player_mode",
                selector: {
                    select: {
                        mode: "dropdown",
                        options: [
                            { value: "select", label: this._l("player_mode_select") },
                            { value: "fixed", label: this._l("player_mode_fixed") },
                        ],
                    },
                },
            },
        ];
        if (config.player_mode === "fixed") {
            schema.push({
                name: "media_player",
                selector: { entity: { domain: "media_player" } },
            });
        }
        else {
            schema.push({ name: "show_player", selector: { boolean: {} } });
        }
        schema.push({ name: "show_device_toggle", selector: { boolean: {} } });
        return schema;
    }
    _settingsChanged(ev) {
        ev.stopPropagation();
        const value = ev.detail.value;
        this._config = {
            ...this._config,
            ...value,
            type: "custom:bedtime-stories-card",
        };
        fireEvent(this, "config-changed", { config: this._config });
        this._connectLibrary();
    }
    _renderSettingsForm(schema) {
        return b `
      <ha-form
        .hass=${this.hass}
        .data=${{ ...DEFAULT_CONFIG, ...this._config }}
        .schema=${schema}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._settingsChanged}
      ></ha-form>
    `;
    }
    // ---- content management ---------------------------------------------------
    get _entryId() {
        return this._config?.entry_id || undefined;
    }
    _startCategory(category) {
        this._clearContentTimer();
        this._storyDraft = null;
        this._categoryDraft = category
            ? { id: category.id, name: category.name, icon: category.icon }
            : { name: "", icon: "mdi:teddy-bear" };
    }
    _startStory(categoryId, story) {
        this._clearContentTimer();
        this._categoryDraft = null;
        this._storyAdvanced = false;
        this._storyDraft = story
            ? {
                id: story.id,
                category_id: story.category_id,
                title: story.title,
                duration_min: story.duration_min,
                image: story.image,
                media_content_id: story.media_content_id,
                media_content_type: story.media_content_type,
                media: {
                    media_content_id: story.media_content_id,
                    media_content_type: story.media_content_type,
                },
                cover_media: isMediaSource(story.image)
                    ? { media_content_id: story.image, media_content_type: "image/*" }
                    : undefined,
            }
            : {
                category_id: categoryId,
                title: "",
                duration_min: null,
                image: null,
                media_content_id: "",
                media_content_type: "audio/mpeg",
            };
    }
    async _saveCategory() {
        if (!this.hass || !this._categoryDraft)
            return;
        this._clearContentTimer();
        try {
            await saveCategory(this.hass, { ...this._categoryDraft }, this._entryId);
            this._categoryDraft = null;
        }
        catch (err) {
            this._error = err?.message;
        }
    }
    async _deleteCategory(category) {
        if (!this.hass)
            return;
        if (!window.confirm(this._l("confirm_delete_category")))
            return;
        this._clearContentTimer();
        try {
            await deleteCategory(this.hass, category.id, this._entryId);
        }
        catch (err) {
            this._error = err?.message;
        }
    }
    async _saveStory() {
        if (!this.hass || !this._storyDraft)
            return;
        this._clearContentTimer();
        const { media: _media, cover_media: _coverMedia, ...story } = this._storyDraft;
        try {
            await saveStory(this.hass, { ...story }, this._entryId);
            this._storyDraft = null;
        }
        catch (err) {
            this._error = err?.message;
        }
    }
    async _deleteStory(story) {
        if (!this.hass)
            return;
        if (!window.confirm(this._l("confirm_delete_story")))
            return;
        this._clearContentTimer();
        try {
            await deleteStory(this.hass, story.id, this._entryId);
        }
        catch (err) {
            this._error = err?.message;
        }
    }
    async _resetStoryStats() {
        if (!this.hass || !this._storyDraft?.id)
            return;
        if (!window.confirm(this._l("confirm_reset_stats")))
            return;
        try {
            await resetStats(this.hass, this._storyDraft.id, this._entryId);
        }
        catch (err) {
            this._error = err?.message;
        }
    }
    _playCountText(storyId) {
        const count = this._library?.stats[storyId]?.play_count ?? 0;
        if (count === 0)
            return this._l("played_never");
        if (count === 1)
            return this._l("played_once");
        return this._l("played_times", { count });
    }
    _clearContentTimer() {
        if (this._contentTimer) {
            clearTimeout(this._contentTimer);
            this._contentTimer = undefined;
        }
    }
    _scheduleContentSave() {
        this._clearContentTimer();
        this._contentTimer = setTimeout(() => void this._autoSaveContent(), 700);
    }
    /**
     * Content (categories & stories) lives in the shared library, saved over the
     * websocket API — it is not part of the card's Lovelace config, so those
     * edits never enable Home Assistant's card-editor "Save" button. To avoid a
     * dead-end where a change looks unsaveable, edits to an existing item persist
     * automatically here (debounced). New items still use their explicit Save
     * button, since they aren't valid until they have the required fields.
     */
    async _autoSaveContent() {
        this._contentTimer = undefined;
        if (!this.hass)
            return;
        if (this._savingContent) {
            this._scheduleContentSave();
            return;
        }
        const story = this._storyDraft;
        const category = this._categoryDraft;
        this._savingContent = true;
        try {
            if (story?.id && story.title.trim() && story.media_content_id.trim()) {
                const { media: _media, cover_media: _coverMedia, ...payload } = story;
                await saveStory(this.hass, { ...payload }, this._entryId);
            }
            else if (category?.id && category.name.trim()) {
                await saveCategory(this.hass, { ...category }, this._entryId);
            }
        }
        catch (err) {
            this._error = err?.message;
        }
        finally {
            this._savingContent = false;
        }
    }
    /** Close an auto-saving draft, flushing any edit still inside the debounce. */
    async _doneStory() {
        this._clearContentTimer();
        await this._autoSaveContent();
        this._storyDraft = null;
    }
    async _doneCategory() {
        this._clearContentTimer();
        await this._autoSaveContent();
        this._categoryDraft = null;
    }
    // ---- drag & drop reordering ----------------------------------------------
    _renderDragHandle(kind, id, categoryId) {
        return b `
      <span
        class="drag-handle"
        draggable="true"
        title=${this._l("drag_reorder")}
        @dragstart=${(ev) => this._dragStart(kind, id, categoryId, ev)}
        @dragend=${this._dragEnd}
      >
        <ha-icon icon="mdi:drag-vertical"></ha-icon>
      </span>
    `;
    }
    _dragStart(kind, id, categoryId, ev) {
        this._dragKind = kind;
        this._dragId = id;
        this._dragCategoryId = categoryId;
        if (ev.dataTransfer) {
            ev.dataTransfer.effectAllowed = "move";
            ev.dataTransfer.setData("text/plain", id);
            const row = ev.currentTarget.closest(kind === "category" ? ".category-card" : ".story-row");
            if (row)
                ev.dataTransfer.setDragImage(row, 24, 16);
        }
    }
    _dragOver(kind, targetId, categoryId, ev) {
        if (this._dragKind !== kind)
            return;
        if (kind === "story" && this._dragCategoryId !== categoryId)
            return;
        ev.preventDefault(); // allow the drop
        if (ev.dataTransfer)
            ev.dataTransfer.dropEffect = "move";
        if (this._dragOverId !== targetId)
            this._dragOverId = targetId;
    }
    _drop(kind, targetId, categoryId, ev) {
        // Kind mismatch (e.g. a category dropped on a story row): let the event
        // bubble to the matching drop target instead of swallowing it here.
        if (this._dragKind !== kind)
            return;
        ev.preventDefault();
        ev.stopPropagation();
        const dragged = this._dragId;
        if (!dragged || dragged === targetId || !this.hass) {
            this._dragEnd();
            return;
        }
        const el = ev.currentTarget;
        const rect = el.getBoundingClientRect();
        const after = ev.clientY > rect.top + rect.height / 2;
        if (kind === "category") {
            const ids = this._moveInList((this._library?.categories ?? []).map((c) => c.id), dragged, targetId, after);
            void reorderCategories(this.hass, ids, this._entryId).catch((err) => (this._error = err?.message));
        }
        else if (categoryId && this._dragCategoryId === categoryId) {
            const ids = this._moveInList((this._library?.stories ?? [])
                .filter((s) => s.category_id === categoryId)
                .map((s) => s.id), dragged, targetId, after);
            void reorderStories(this.hass, ids, this._entryId).catch((err) => (this._error = err?.message));
        }
        this._dragEnd();
    }
    _moveInList(ids, draggedId, targetId, after) {
        const result = ids.filter((id) => id !== draggedId);
        const idx = result.indexOf(targetId);
        if (idx < 0)
            return ids;
        result.splice(after ? idx + 1 : idx, 0, draggedId);
        return result;
    }
    _categoryFormChanged(ev) {
        ev.stopPropagation();
        this._categoryDraft = {
            ...this._categoryDraft,
            ...ev.detail.value,
        };
        if (this._categoryDraft.id)
            this._scheduleContentSave();
    }
    _storyFormChanged(ev) {
        ev.stopPropagation();
        const value = ev.detail.value;
        const draft = { ...this._storyDraft, ...value };
        // Copy the media browser pick into the raw content id/type fields.
        const media = value.media;
        if (media?.media_content_id &&
            media.media_content_id !== this._storyDraft?.media?.media_content_id) {
            draft.media_content_id = media.media_content_id;
            draft.media_content_type =
                media.media_content_type ?? draft.media_content_type;
            if (!draft.title && media.metadata?.title) {
                draft.title = media.metadata.title;
            }
        }
        // Copy the cover image pick (a media-source id) into the image field;
        // clearing the picker clears the image too.
        const coverMedia = value.cover_media;
        if (coverMedia &&
            coverMedia.media_content_id !==
                this._storyDraft?.cover_media?.media_content_id) {
            draft.image = coverMedia.media_content_id || null;
        }
        this._storyDraft = draft;
        if (draft.id)
            this._scheduleContentSave();
    }
    _mediaDisplayName(draft) {
        if (draft.media?.metadata?.title)
            return draft.media.metadata.title;
        if (!draft.media_content_id)
            return undefined;
        const clean = draft.media_content_id.split("?")[0];
        const segment = decodeURIComponent(clean.split("/").pop() ?? "");
        return segment || draft.media_content_id;
    }
    _coverDisplayName(draft) {
        if (draft.cover_media?.metadata?.title) {
            return draft.cover_media.metadata.title;
        }
        if (!draft.image)
            return undefined;
        const clean = draft.image.split("?")[0];
        const segment = decodeURIComponent(clean.split("/").pop() ?? "");
        return segment || draft.image;
    }
    // ---- direct upload to "My media" -----------------------------------------
    /** Find a writable local media_source folder to upload into (cached). */
    async _localMediaFolder() {
        if (this._uploadFolder)
            return this._uploadFolder;
        if (!this.hass)
            return null;
        const isLocal = (id) => !!id && id.startsWith("media-source://media_source/local");
        try {
            const root = await this.hass.callWS({
                type: "media_source/browse_media",
            });
            const local = (root.children ?? []).find((c) => isLocal(c.media_content_id));
            if (!isLocal(local?.media_content_id))
                return null;
            const branch = await this.hass.callWS({
                type: "media_source/browse_media",
                media_content_id: local.media_content_id,
            });
            // Upload needs a concrete media directory, not the bare local root.
            const dir = (branch.children ?? []).find((c) => c.can_expand && isLocal(c.media_content_id));
            this._uploadFolder = (dir ?? local).media_content_id;
            return this._uploadFolder ?? null;
        }
        catch {
            return null;
        }
    }
    async _uploadToLocal(file) {
        const folder = await this._localMediaFolder();
        if (!folder || !this.hass) {
            this._error = this._l("upload_no_media_source");
            return null;
        }
        const form = new FormData();
        form.append("media_content_id", folder);
        form.append("file", file);
        const resp = await this.hass.fetchWithAuth("/api/media_source/local_source/upload", { method: "POST", body: form });
        if (!resp.ok) {
            throw new Error(`${this._l("upload_failed")} (HTTP ${resp.status})`);
        }
        const data = (await resp.json());
        // The endpoint returns the new id; fall back to composing it from the
        // target folder + filename (media_source ids are raw paths).
        return data.media_content_id ?? data.id ?? `${folder}/${file.name}`;
    }
    async _uploadMediaFile(ev) {
        const input = ev.target;
        const file = input.files?.[0];
        input.value = "";
        if (!file || !this._storyDraft)
            return;
        this._uploading = "media";
        this._error = undefined;
        try {
            const id = await this._uploadToLocal(file);
            if (!id)
                return;
            const type = file.type || "audio/mpeg";
            const draft = {
                ...this._storyDraft,
                media_content_id: id,
                media_content_type: type,
                media: {
                    media_content_id: id,
                    media_content_type: type,
                    metadata: { title: file.name },
                },
            };
            if (!draft.title.trim())
                draft.title = file.name.replace(/\.[^./\\]+$/, "");
            this._storyDraft = draft;
            if (draft.id)
                this._scheduleContentSave();
        }
        catch (err) {
            this._error =
                err?.message ?? this._l("upload_failed");
        }
        finally {
            this._uploading = undefined;
        }
    }
    async _uploadCoverFile(ev) {
        const input = ev.target;
        const file = input.files?.[0];
        input.value = "";
        if (!file || !this._storyDraft)
            return;
        this._uploading = "cover";
        this._error = undefined;
        try {
            const id = await this._uploadToLocal(file);
            if (!id)
                return;
            this._storyDraft = {
                ...this._storyDraft,
                image: id,
                cover_media: {
                    media_content_id: id,
                    media_content_type: file.type || "image/*",
                },
            };
            if (this._storyDraft.id)
                this._scheduleContentSave();
        }
        catch (err) {
            this._error =
                err?.message ?? this._l("upload_failed");
        }
        finally {
            this._uploading = undefined;
        }
    }
    // ---- rendering ----------------------------------------------------------
    /** "…or upload a file" row shown under the media / cover pickers. */
    _renderUploadRow(kind, accept, handler) {
        return b `
      <div class="upload-row">
        <span class="upload-or">${this._l("or")}</span>
        <mwc-button
          outlined
          dense
          .disabled=${this._uploading !== undefined}
          @click=${(ev) => ev.currentTarget
            .nextElementSibling.click()}
        >
          <ha-icon slot="icon" icon="mdi:tray-arrow-up"></ha-icon>
          ${this._uploading === kind
            ? this._l("uploading")
            : this._l("upload_file")}
        </mwc-button>
        <input
          class="file-input"
          type="file"
          accept=${accept}
          @change=${handler}
        />
      </div>
    `;
    }
    render() {
        if (!this.hass || !this._config)
            return b ``;
        if (!this._formReady) {
            return b `<ha-circular-progress indeterminate></ha-circular-progress>`;
        }
        return b `
      ${this._renderSettingsForm(this._basicsSchema())}
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:palette-outline"></ha-icon>
          <span>${this._l("section_appearance")}</span>
        </div>
        ${this._renderSettingsForm(this._appearanceSchema())}
      </div>
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:sort"></ha-icon>
          <span>${this._l("section_sorting")}</span>
        </div>
        ${this._renderSettingsForm(this._sortingSchema())}
      </div>
      <div class="section">
        <div class="section-header">
          <ha-icon icon="mdi:cast-audio"></ha-icon>
          <span>${this._l("section_playback")}</span>
        </div>
        ${this._renderSettingsForm(this._playbackSchema())}
      </div>
      ${this.hass.user?.is_admin ? this._renderContent() : A}
    `;
    }
    _renderContent() {
        const lib = this._library;
        return b `
      <div class="section content">
        <div class="section-header">
          <ha-icon icon="mdi:bookshelf"></ha-icon>
          <span>${this._l("tab_content")}</span>
        </div>
        <p class="section-hint">${this._l("content_hint")}</p>
        ${this._error
            ? b `<ha-alert alert-type="error">${this._error}</ha-alert>`
            : A}
        ${!lib
            ? b `<p class="section-hint">${this._l("not_configured")}</p>`
            : b `
              ${lib.categories.length === 0 && !this._categoryDraft
                ? b `<p class="section-hint empty">
                    ${this._l("no_categories")}
                  </p>`
                : A}
              ${lib.categories.map((category) => this._renderCategoryBlock(category, lib))}
              ${this._categoryDraft && !this._categoryDraft.id
                ? this._renderCategoryForm()
                : b `
                    <mwc-button
                      outlined
                      class="add-category"
                      @click=${() => this._startCategory()}
                    >
                      <ha-icon slot="icon" icon="mdi:plus"></ha-icon>
                      ${this._l("add_category")}
                    </mwc-button>
                  `}
            `}
      </div>
    `;
    }
    _renderCategoryBlock(category, lib) {
        const stories = lib.stories.filter((s) => s.category_id === category.id);
        const editingThis = this._categoryDraft?.id === category.id;
        return b `
      <div
        class="category-card ${this._dragOverId === category.id
            ? "drag-over"
            : ""}"
        @dragover=${(ev) => this._dragOver("category", category.id, undefined, ev)}
        @drop=${(ev) => this._drop("category", category.id, undefined, ev)}
      >
        <div class="category-head">
          ${this._renderDragHandle("category", category.id)}
          <div class="icon-chip">
            <ha-icon icon=${category.icon || "mdi:teddy-bear"}></ha-icon>
          </div>
          <div class="category-text">
            <span class="category-name">${category.name}</span>
            <span class="category-meta"
              >${this._l("stories_count", { count: stories.length })}</span
            >
          </div>
          <ha-icon-button
            .label=${this._l("edit")}
            @click=${() => this._startCategory(category)}
          >
            <ha-icon icon="mdi:pencil-outline"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            class="danger"
            .label=${this._l("delete")}
            @click=${() => this._deleteCategory(category)}
          >
            <ha-icon icon="mdi:trash-can-outline"></ha-icon>
          </ha-icon-button>
        </div>
        ${editingThis ? this._renderCategoryForm() : A}
        <div class="story-list">
          ${stories.map((story) => this._renderStoryRow(story, lib))}
        </div>
        ${this._storyDraft &&
            !this._storyDraft.id &&
            this._storyDraft.category_id === category.id
            ? this._renderStoryForm()
            : b `
              <button
                class="add-story"
                @click=${() => this._startStory(category.id)}
              >
                <ha-icon icon="mdi:plus"></ha-icon>
                <span>${this._l("add_story")}</span>
              </button>
            `}
      </div>
    `;
    }
    _renderStoryRow(story, lib) {
        const editingThis = this._storyDraft?.id === story.id;
        const thumb = this._storyThumb(story);
        const stats = lib.stats[story.id];
        const meta = [];
        if (story.duration_min)
            meta.push(`~${story.duration_min}m`);
        if (stats?.play_count) {
            meta.push(stats.play_count === 1
                ? this._l("played_once")
                : this._l("played_times", { count: stats.play_count }));
        }
        return b `
      <div
        class="story-row ${editingThis ? "editing" : ""} ${this._dragOverId ===
            story.id
            ? "drag-over"
            : ""}"
        @dragover=${(ev) => this._dragOver("story", story.id, story.category_id, ev)}
        @drop=${(ev) => this._drop("story", story.id, story.category_id, ev)}
      >
        ${this._renderDragHandle("story", story.id, story.category_id)}
        <span
          class="story-thumb"
          style=${thumb ? `background-image:url("${thumb}")` : ""}
        >
          ${!thumb
            ? b `<ha-icon icon="mdi:book-open-variant"></ha-icon>`
            : A}
        </span>
        <div class="story-text">
          <span class="story-title">${story.title}</span>
          ${meta.length
            ? b `<span class="story-meta">${meta.join(" · ")}</span>`
            : A}
        </div>
        <ha-icon-button
          .label=${this._l("edit")}
          @click=${() => this._startStory(story.category_id, story)}
        >
          <ha-icon icon="mdi:pencil-outline"></ha-icon>
        </ha-icon-button>
        <ha-icon-button
          class="danger"
          .label=${this._l("delete")}
          @click=${() => this._deleteStory(story)}
        >
          <ha-icon icon="mdi:trash-can-outline"></ha-icon>
        </ha-icon-button>
      </div>
      ${editingThis ? this._renderStoryForm() : A}
    `;
    }
    _renderCategoryForm() {
        const draft = this._categoryDraft;
        const schema = [
            {
                name: "",
                type: "grid",
                schema: [
                    { name: "name", selector: { text: {} } },
                    { name: "icon", selector: { icon: {} } },
                ],
            },
        ];
        return b `
      <div class="form-panel">
        <div class="form-title">
          ${this._l(draft.id ? "edit_category" : "new_category")}
        </div>
        <ha-form
          .hass=${this.hass}
          .data=${draft}
          .schema=${schema}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._categoryFormChanged}
        ></ha-form>
        <div class="form-actions">
          ${draft.id
            ? b `<mwc-button raised @click=${this._doneCategory}>
                ${this._l("done")}
              </mwc-button>`
            : b `
                <mwc-button @click=${() => (this._categoryDraft = null)}>
                  ${this._l("cancel")}
                </mwc-button>
                <mwc-button
                  raised
                  .disabled=${!draft.name.trim()}
                  @click=${this._saveCategory}
                >
                  ${this._l("save")}
                </mwc-button>
              `}
        </div>
      </div>
    `;
    }
    _renderStoryForm() {
        const draft = this._storyDraft;
        const categories = this._library?.categories ?? [];
        const basicsSchema = [
            { name: "title", selector: { text: {} } },
            {
                name: "",
                type: "grid",
                schema: [
                    {
                        name: "category_id",
                        selector: {
                            select: {
                                mode: "dropdown",
                                options: categories.map((c) => ({
                                    value: c.id,
                                    label: c.name,
                                })),
                            },
                        },
                    },
                    {
                        name: "duration_min",
                        selector: { number: { min: 1, max: 600, mode: "box" } },
                    },
                ],
            },
        ];
        const mediaSchema = [
            { name: "media", selector: { media: { accept: ["audio/*"] } } },
        ];
        const coverSchema = [
            { name: "cover_media", selector: { media: { accept: ["image/*"] } } },
        ];
        const advancedSchema = [
            { name: "media_content_id", selector: { text: {} } },
            { name: "media_content_type", selector: { text: {} } },
            { name: "image", selector: { text: {} } },
        ];
        const labels = {
            title: this._l("title"),
            category_id: this._l("category"),
            duration_min: this._l("duration"),
            media: this._l("media"),
            media_content_id: this._l("media_content_id"),
            media_content_type: this._l("media_content_type"),
            image: this._l("image_url"),
        };
        const helpers = {
            duration_min: this._l("duration_help"),
            media_content_id: this._l("media_content_id_help"),
            image: this._l("image_url_help"),
        };
        const computeLabel = (s) => labels[s.name] ?? s.name;
        const computeHelper = (s) => helpers[s.name];
        const mediaName = this._mediaDisplayName(draft);
        const coverName = this._coverDisplayName(draft);
        return b `
      <div class="form-panel">
        <div class="form-title">
          ${this._l(draft.id ? "edit_story" : "new_story")}
        </div>
        <ha-form
          .hass=${this.hass}
          .data=${draft}
          .schema=${basicsSchema}
          .computeLabel=${computeLabel}
          .computeHelper=${computeHelper}
          @value-changed=${this._storyFormChanged}
        ></ha-form>

        <div class="field-group">
          <div class="field-label">
            <ha-icon icon="mdi:music-note"></ha-icon>
            <span>${this._l("media")}</span>
          </div>
          <div class="field-help">${this._l("media_help")}</div>
          <ha-form
            .hass=${this.hass}
            .data=${draft}
            .schema=${mediaSchema}
            .computeLabel=${computeLabel}
            @value-changed=${this._storyFormChanged}
          ></ha-form>
          ${this._renderUploadRow("media", "audio/*", this._uploadMediaFile)}
          <div class="media-status ${draft.media_content_id ? "ok" : ""}">
            <ha-icon
              icon=${draft.media_content_id
            ? "mdi:check-circle"
            : "mdi:alert-circle-outline"}
            ></ha-icon>
            <span
              >${draft.media_content_id
            ? `${this._l("media_selected")}: ${mediaName}`
            : this._l("media_none")}</span
            >
          </div>
        </div>

        <div class="field-group">
          <div class="field-label">
            <ha-icon icon="mdi:image-outline"></ha-icon>
            <span>${this._l("cover")}</span>
          </div>
          <div class="field-help">${this._l("cover_help")}</div>
          <ha-form
            .hass=${this.hass}
            .data=${draft}
            .schema=${coverSchema}
            .computeLabel=${this._noLabel}
            @value-changed=${this._storyFormChanged}
          ></ha-form>
          ${this._renderUploadRow("cover", "image/*", this._uploadCoverFile)}
          <div class="media-status ${draft.image ? "ok" : ""}">
            <ha-icon
              icon=${draft.image
            ? "mdi:check-circle"
            : "mdi:image-off-outline"}
            ></ha-icon>
            <span
              >${draft.image
            ? `${this._l("cover_selected")}: ${coverName}`
            : this._l("cover_none")}</span
            >
          </div>
        </div>

        <button
          class="advanced-toggle"
          @click=${() => (this._storyAdvanced = !this._storyAdvanced)}
        >
          <ha-icon
            icon=${this._storyAdvanced
            ? "mdi:chevron-down"
            : "mdi:chevron-right"}
          ></ha-icon>
          ${this._l("advanced")}
        </button>
        ${this._storyAdvanced
            ? b `
              <div class="advanced-body">
                <ha-form
                  .hass=${this.hass}
                  .data=${draft}
                  .schema=${advancedSchema}
                  .computeLabel=${computeLabel}
                  .computeHelper=${computeHelper}
                  @value-changed=${this._storyFormChanged}
                ></ha-form>
                ${draft.id
                ? b `
                      <div class="story-id-row">
                        <span
                          >${this._l("story_id_hint")}:
                          <code>${draft.id}</code></span
                        >
                      </div>
                      <div class="reset-stats-row">
                        <span class="reset-count">
                          <ha-icon icon="mdi:chart-line-variant"></ha-icon>
                          ${this._playCountText(draft.id)}
                        </span>
                        <mwc-button
                          outlined
                          class="reset-button"
                          @click=${this._resetStoryStats}
                        >
                          <ha-icon slot="icon" icon="mdi:restart"></ha-icon>
                          ${this._l("reset_stats")}
                        </mwc-button>
                      </div>
                    `
                : A}
              </div>
            `
            : A}

        <div class="form-actions">
          ${draft.id
            ? b `<mwc-button raised @click=${this._doneStory}>
                ${this._l("done")}
              </mwc-button>`
            : b `
                <mwc-button @click=${() => (this._storyDraft = null)}>
                  ${this._l("cancel")}
                </mwc-button>
                <mwc-button
                  raised
                  .disabled=${!draft.title.trim() ||
                !draft.media_content_id.trim()}
                  @click=${this._saveStory}
                >
                  ${this._l("save")}
                </mwc-button>
              `}
        </div>
      </div>
    `;
    }
    static { this.styles = i$5 `
    :host {
      display: block;
    }
    .section {
      margin-top: 24px;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1rem;
      font-weight: 500;
      color: var(--primary-text-color);
      border-bottom: 1px solid var(--divider-color);
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .section-header ha-icon {
      color: var(--primary-color);
      --mdc-icon-size: 20px;
    }
    .section-hint {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      line-height: 1.4;
      margin: 0 0 12px;
    }
    .section-hint.empty {
      padding: 12px;
      background: var(--secondary-background-color);
      border-radius: 8px;
    }
    ha-form {
      display: block;
    }
    ha-alert {
      display: block;
      margin-bottom: 12px;
    }
    /* --- category cards --- */
    .category-card {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 12px;
      background: var(--card-background-color);
    }
    .category-head {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .icon-chip {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.12);
      color: var(--primary-color);
      flex-shrink: 0;
    }
    .icon-chip ha-icon {
      --mdc-icon-size: 22px;
    }
    .category-text {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }
    .category-name {
      font-weight: 500;
      font-size: 0.95rem;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .category-meta {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    /* --- story rows --- */
    .story-list {
      margin-top: 4px;
    }
    .story-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 4px;
      border-radius: 8px;
      transition: background 0.15s ease;
    }
    .story-row:hover {
      background: var(--secondary-background-color);
    }
    .story-row.editing {
      background: var(--secondary-background-color);
    }
    /* --- drag & drop --- */
    .drag-handle {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      cursor: grab;
      color: var(--secondary-text-color);
      border-radius: 6px;
      touch-action: none;
    }
    .drag-handle:hover {
      color: var(--primary-text-color);
      background: var(--divider-color);
    }
    .drag-handle:active {
      cursor: grabbing;
    }
    .drag-handle ha-icon {
      --mdc-icon-size: 20px;
    }
    .category-card.drag-over,
    .story-row.drag-over {
      outline: 2px dashed var(--primary-color);
      outline-offset: -2px;
    }
    .story-thumb {
      width: 56px;
      height: 40px;
      border-radius: 8px;
      background-color: var(--secondary-background-color);
      background-size: cover;
      background-position: center;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      border: 1px solid var(--divider-color);
    }
    .story-thumb ha-icon {
      --mdc-icon-size: 20px;
    }
    .story-text {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }
    .story-title {
      font-size: 0.9rem;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .story-meta {
      font-size: 0.75rem;
      color: var(--secondary-text-color);
    }
    /* --- buttons --- */
    ha-icon-button {
      --mdc-icon-button-size: 36px;
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
      flex-shrink: 0;
    }
    ha-icon-button.danger:hover {
      color: var(--error-color);
    }
    .add-story {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      margin-top: 8px;
      padding: 8px;
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      background: none;
      color: var(--primary-color);
      font: inherit;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .add-story:hover {
      background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.08);
    }
    .add-story ha-icon {
      --mdc-icon-size: 18px;
    }
    .add-category {
      width: 100%;
      --mdc-shape-small: 8px;
    }
    /* --- form panels --- */
    .form-panel {
      background: var(--secondary-background-color);
      border-radius: 12px;
      padding: 16px;
      margin: 12px 0;
    }
    .form-title {
      font-weight: 500;
      font-size: 0.95rem;
      color: var(--primary-text-color);
      margin-bottom: 12px;
    }
    .field-group {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }
    .field-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--primary-text-color);
      margin-bottom: 2px;
    }
    .field-label ha-icon {
      --mdc-icon-size: 16px;
      color: var(--secondary-text-color);
    }
    .field-help {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      line-height: 1.35;
      margin-bottom: 8px;
    }
    .media-status {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    .media-status.ok {
      color: var(--success-color, #4caf50);
    }
    .media-status ha-icon {
      --mdc-icon-size: 16px;
    }
    .upload-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
    }
    .upload-or {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    .file-input {
      display: none;
    }
    .advanced-toggle {
      display: flex;
      align-items: center;
      gap: 2px;
      width: 100%;
      margin-top: 16px;
      border: none;
      border-top: 1px solid var(--divider-color);
      background: none;
      padding: 12px 0 4px;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 0.82rem;
      cursor: pointer;
    }
    .advanced-toggle ha-icon {
      --mdc-icon-size: 18px;
    }
    .advanced-body {
      margin-top: 8px;
    }
    .story-id-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 8px;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    .reset-stats-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid var(--divider-color);
    }
    .reset-count {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    .reset-count ha-icon {
      --mdc-icon-size: 18px;
    }
    .reset-button {
      flex-shrink: 0;
      --mdc-theme-primary: var(--error-color);
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
    code {
      font-size: 0.78rem;
      background: var(--card-background-color);
      padding: 1px 5px;
      border-radius: 4px;
    }
  `; }
};
__decorate([
    n$1({ attribute: false })
], BedtimeStoriesCardEditor.prototype, "hass", void 0);
__decorate([
    r()
], BedtimeStoriesCardEditor.prototype, "_config", void 0);
__decorate([
    r()
], BedtimeStoriesCardEditor.prototype, "_entries", void 0);
__decorate([
    r()
], BedtimeStoriesCardEditor.prototype, "_library", void 0);
__decorate([
    r()
], BedtimeStoriesCardEditor.prototype, "_covers", void 0);
__decorate([
    r()
], BedtimeStoriesCardEditor.prototype, "_formReady", void 0);
__decorate([
    r()
], BedtimeStoriesCardEditor.prototype, "_categoryDraft", void 0);
__decorate([
    r()
], BedtimeStoriesCardEditor.prototype, "_storyDraft", void 0);
__decorate([
    r()
], BedtimeStoriesCardEditor.prototype, "_storyAdvanced", void 0);
__decorate([
    r()
], BedtimeStoriesCardEditor.prototype, "_error", void 0);
__decorate([
    r()
], BedtimeStoriesCardEditor.prototype, "_uploading", void 0);
__decorate([
    r()
], BedtimeStoriesCardEditor.prototype, "_dragOverId", void 0);
BedtimeStoriesCardEditor = __decorate([
    t$1("bedtime-stories-card-editor")
], BedtimeStoriesCardEditor);

const SORT_MODES = [
    "manual",
    "alphabetical",
    "play_count",
    "last_played",
];
/** Chips that imply "most first" flip their default direction. */
const DEFAULT_DESC = ["play_count", "last_played"];
let BedtimeStoriesCard = class BedtimeStoriesCard extends i$2 {
    constructor() {
        super(...arguments);
        /** story.id → resolved cover URL, for images stored as media-source ids. */
        this._covers = {};
        this._justPlayed = null;
        /** "This device" mode: play the audio in the browser instead of casting. */
        this._playHere = false;
        this._localPlayingId = null;
        this._onAudioError = () => {
            this._localPlayingId = null;
            if (this._playHere)
                this._flashError(localize(this.hass, "play_failed"));
        };
    }
    static getConfigElement() {
        return document.createElement("bedtime-stories-card-editor");
    }
    static getStubConfig() {
        return { title: "Bedtime Stories" };
    }
    setConfig(config) {
        this._config = { ...DEFAULT_CONFIG, ...config };
        this._localSort = this._loadLocalSort();
        this._playHere = this._loadPlayHere();
        this._resubscribe();
    }
    getCardSize() {
        const stories = this._library?.stories.length ?? 6;
        return 2 + Math.ceil(stories / 3) * 2;
    }
    /** Sections view: span the full width by default (resizable by the user). */
    getGridOptions() {
        return { columns: "full", rows: "auto" };
    }
    getLayoutOptions() {
        return { grid_columns: "full", grid_rows: "auto" };
    }
    connectedCallback() {
        super.connectedCallback();
        this._resubscribe();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._teardown();
        this._stopLocal();
    }
    updated() {
        if (this.hass && !this._unsubscribe) {
            this._resubscribe();
        }
    }
    _teardown() {
        this._unsubscribe?.then((unsub) => unsub()).catch(() => undefined);
        this._unsubscribe = undefined;
        this._subscribedEntry = undefined;
    }
    _resubscribe() {
        if (!this.hass || !this._config || !this.isConnected)
            return;
        const entry = this._config.entry_id ?? "";
        if (this._unsubscribe && this._subscribedEntry === entry)
            return;
        this._teardown();
        this._subscribedEntry = entry;
        this._unsubscribe = subscribeLibrary(this.hass, (snapshot) => {
            this._library = snapshot;
            this._error = undefined;
            void this._resolveCovers(snapshot);
        }, this._config.entry_id);
        this._unsubscribe.catch((err) => {
            this._unsubscribe = undefined;
            this._error = err?.message ?? "unknown error";
        });
    }
    // ---- sorting -------------------------------------------------------------
    _sortStorageKey() {
        return `bedtime-stories-sort:${this._config?.entry_id ?? "default"}`;
    }
    _loadLocalSort() {
        if (!this._config?.show_sort_selector)
            return undefined;
        try {
            const raw = window.localStorage.getItem(this._sortStorageKey());
            return raw ? JSON.parse(raw) : undefined;
        }
        catch {
            return undefined;
        }
    }
    // ---- "this device" playback ----------------------------------------------
    _deviceStorageKey() {
        return `bedtime-stories-here:${this._config?.entry_id ?? "default"}`;
    }
    _loadPlayHere() {
        try {
            return window.localStorage.getItem(this._deviceStorageKey()) === "1";
        }
        catch {
            return false;
        }
    }
    _togglePlayHere() {
        this._playHere = !this._playHere;
        try {
            window.localStorage.setItem(this._deviceStorageKey(), this._playHere ? "1" : "0");
        }
        catch {
            // private mode etc. — still works for this session
        }
        if (!this._playHere)
            this._stopLocal();
    }
    _stopLocal() {
        this._audioEl?.pause();
        this._localPlayingId = null;
    }
    _activeSort() {
        if (this._config?.show_sort_selector && this._localSort) {
            return this._localSort;
        }
        return {
            sort: this._config?.sort ?? "manual",
            direction: this._config?.sort_direction ?? "asc",
        };
    }
    _pickSort(mode) {
        const current = this._activeSort();
        const choice = current.sort === mode
            ? {
                sort: mode,
                direction: current.direction === "asc" ? "desc" : "asc",
            }
            : {
                sort: mode,
                direction: DEFAULT_DESC.includes(mode) ? "desc" : "asc",
            };
        this._localSort = choice;
        try {
            window.localStorage.setItem(this._sortStorageKey(), JSON.stringify(choice));
        }
        catch {
            // private mode etc. — sorting still works for this session
        }
    }
    _sortedStories(category) {
        const lib = this._library;
        if (!lib)
            return [];
        const { sort, direction } = this._activeSort();
        const stories = lib.stories.filter((s) => s.category_id === category.id);
        const stat = (id) => lib.stats[id];
        stories.sort((a, b) => {
            let cmp = 0;
            switch (sort) {
                case "alphabetical":
                    cmp = a.title.localeCompare(b.title, undefined, {
                        sensitivity: "base",
                    });
                    break;
                case "play_count":
                    cmp = (stat(a.id)?.play_count ?? 0) - (stat(b.id)?.play_count ?? 0);
                    break;
                case "last_played": {
                    const ta = Date.parse(stat(a.id)?.last_played ?? "") || 0;
                    const tb = Date.parse(stat(b.id)?.last_played ?? "") || 0;
                    cmp = ta - tb;
                    break;
                }
                default:
                    cmp = a.order - b.order;
            }
            if (cmp === 0) {
                cmp = a.title.localeCompare(b.title, undefined, {
                    sensitivity: "base",
                });
            }
            return direction === "desc" ? -cmp : cmp;
        });
        return stories;
    }
    // ---- players ---------------------------------------------------------------
    _targetPlayer() {
        if (this._config?.player_mode === "fixed" && this._config.media_player) {
            return this._config.media_player;
        }
        const lib = this._library;
        if (lib?.select_entity && this.hass?.states[lib.select_entity]) {
            const option = this.hass.states[lib.select_entity].state;
            if (option && option !== "unknown" && option !== "unavailable") {
                return option;
            }
        }
        return lib?.current_player ?? undefined;
    }
    _playerName(entityId) {
        if (!entityId)
            return undefined;
        const info = this._library?.players.find((p) => p.entity_id === entityId);
        if (info)
            return info.name;
        const st = this.hass?.states[entityId];
        return (st?.attributes.friendly_name ?? entityId);
    }
    _cyclePlayer() {
        const lib = this._library;
        if (!this.hass || !lib?.select_entity || lib.players.length < 2)
            return;
        const current = this._targetPlayer();
        const idx = lib.players.findIndex((p) => p.entity_id === current);
        const next = lib.players[(idx + 1) % lib.players.length];
        void this.hass.callService("select", "select_option", {
            entity_id: lib.select_entity,
            option: next.entity_id,
        });
    }
    _playingStoryId() {
        if (this._playHere)
            return this._localPlayingId;
        const player = this._targetPlayer();
        if (!player || !this.hass)
            return null;
        const st = this.hass.states[player];
        if (!st || st.state !== "playing")
            return null;
        const title = st.attributes.media_title;
        if (!title)
            return null;
        const story = this._library?.stories.find((s) => s.title === title);
        return story?.id ?? null;
    }
    // ---- actions ----------------------------------------------------------------
    _flashError(message) {
        this._error = message;
        window.setTimeout(() => {
            this._error = undefined;
        }, 4000);
    }
    async _play(story) {
        if (!this.hass)
            return;
        if (this._playHere) {
            await this._playLocal(story);
            return;
        }
        this._justPlayed = story.id;
        window.setTimeout(() => {
            if (this._justPlayed === story.id)
                this._justPlayed = null;
        }, 1600);
        try {
            await playStory(this.hass, story.id, this._config?.player_mode === "fixed"
                ? this._config.media_player
                : undefined, this._config?.entry_id);
        }
        catch (err) {
            this._justPlayed = null;
            this._flashError(err?.message ?? "play failed");
        }
    }
    /** Resolve a story's media id into a URL the browser can play. */
    async _resolveMediaUrl(mediaId) {
        if (!this.hass)
            return null;
        if (!isMediaSource(mediaId))
            return mediaId;
        try {
            const { url } = await resolveMediaSource(this.hass, mediaId);
            return url;
        }
        catch {
            return null;
        }
    }
    /** Play a story's audio in this browser tab (companion app included). */
    async _playLocal(story) {
        const audio = this._audioEl;
        if (!audio || !this.hass)
            return;
        // Tapping the currently playing tile stops it.
        if (this._localPlayingId === story.id && !audio.paused) {
            this._stopLocal();
            return;
        }
        this._justPlayed = story.id;
        window.setTimeout(() => {
            if (this._justPlayed === story.id)
                this._justPlayed = null;
        }, 1600);
        const url = await this._resolveMediaUrl(story.media_content_id);
        if (!url) {
            this._justPlayed = null;
            this._flashError(localize(this.hass, "play_failed"));
            return;
        }
        try {
            audio.src = url;
            await audio.play();
            this._localPlayingId = story.id;
            // Count the play (stats + logbook) without casting to a media player.
            void recordPlay(this.hass, story.id, localize(this.hass, "this_device"), this._config?.entry_id).catch(() => undefined);
        }
        catch {
            // Autoplay blocked or codec unsupported — a second tap usually works.
            this._justPlayed = null;
            this._localPlayingId = null;
        }
    }
    // ---- rendering ----------------------------------------------------------------
    _visibleCategories() {
        const lib = this._library;
        if (!lib)
            return [];
        const filter = this._config?.categories ?? [];
        return lib.categories.filter((c) => filter.length === 0 || filter.includes(c.id));
    }
    /** Resolve any media-source cover ids into displayable URLs. */
    async _resolveCovers(lib) {
        if (!this.hass)
            return;
        const updates = {};
        await Promise.all(lib.stories.map(async (story) => {
            if (!isMediaSource(story.image))
                return;
            const url = await resolveImage(this.hass, story.image);
            if (url && url !== this._covers[story.id])
                updates[story.id] = url;
        }));
        if (Object.keys(updates).length) {
            this._covers = { ...this._covers, ...updates };
        }
    }
    /** Direct URLs pass through; media-source ids use the resolved cache. */
    _coverUrl(story) {
        if (!story.image)
            return null;
        if (isMediaSource(story.image))
            return this._covers[story.id] ?? null;
        return story.image;
    }
    _statsLine(story) {
        const stats = this._library?.stats[story.id];
        if (!stats || stats.play_count === 0) {
            return localize(this.hass, "played_never");
        }
        const count = stats.play_count === 1
            ? localize(this.hass, "played_once")
            : localize(this.hass, "played_times", { count: stats.play_count });
        return stats.last_played
            ? `${count} · ${relativeTime(this.hass, stats.last_played)}`
            : count;
    }
    render() {
        const config = this._config;
        if (!config)
            return b ``;
        if (this._error && !this._library) {
            return b `<ha-card
        ><div class="empty">${localize(this.hass, "not_configured")}</div>
      </ha-card>`;
        }
        const categories = this._visibleCategories();
        // Density only applies to the list layout; grid tiles scale via columns.
        const compact = config.layout === "list" && config.density === "compact";
        const playing = this._playingStoryId();
        const player = this._targetPlayer();
        const showChip = config.show_player !== false &&
            config.player_mode !== "fixed" &&
            (this._library?.players.length ?? 0) > 0;
        return b `
      <ha-card class=${e({ compact })}>
        <div class="header">
          ${config.title ? b `<h1>${config.title}</h1>` : A}
          <div class="header-chips">
            ${config.show_device_toggle !== false
            ? b `<button
                  class=${e({
                "player-chip": true,
                "device-chip": true,
                active: this._playHere,
            })}
                  title=${localize(this.hass, "this_device")}
                  @click=${this._togglePlayHere}
                >
                  <ha-icon icon="mdi:cellphone-play"></ha-icon>
                  <span>${localize(this.hass, "this_device")}</span>
                </button>`
            : A}
            ${showChip && !this._playHere
            ? b `<button
                  class="player-chip"
                  title=${this._library?.select_entity ?? ""}
                  @click=${this._cyclePlayer}
                >
                  <ha-icon icon="mdi:cast-audio"></ha-icon>
                  <span
                    >${this._playerName(player) ??
                localize(this.hass, "no_player")}</span
                  >
                </button>`
            : A}
          </div>
        </div>
        ${config.show_sort_selector ? this._renderSortChips() : A}
        ${this._error
            ? b `<div class="error">${this._error}</div>`
            : A}
        ${categories.length === 0
            ? b `<div class="empty">
              <ha-icon icon="mdi:sleep"></ha-icon>
              ${localize(this.hass, "empty")}
            </div>`
            : categories.map((category) => this._renderCategory(category, playing))}
        <audio
          @ended=${() => (this._localPlayingId = null)}
          @error=${this._onAudioError}
        ></audio>
      </ha-card>
    `;
    }
    _renderSortChips() {
        const active = this._activeSort();
        return b `
      <div class="sort-chips">
        ${SORT_MODES.map((mode) => b `
            <button
              class=${e({ chip: true, active: active.sort === mode })}
              @click=${() => this._pickSort(mode)}
            >
              ${localize(this.hass, `sort_${mode}`)}
              ${active.sort === mode
            ? b `<ha-icon
                    icon=${active.direction === "asc"
                ? "mdi:arrow-up-thin"
                : "mdi:arrow-down-thin"}
                  ></ha-icon>`
            : A}
            </button>
          `)}
      </div>
    `;
    }
    _renderCategory(category, playing) {
        const stories = this._sortedStories(category);
        if (stories.length === 0)
            return b ``;
        const config = this._config;
        const grid = config.layout !== "list";
        const columns = config.columns ?? 0;
        const gridStyle = grid && columns > 0
            ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
            : {};
        return b `
      <div class="category">
        <div class="category-header">
          <ha-icon icon=${category.icon || "mdi:teddy-bear"}></ha-icon>
          <span>${category.name}</span>
        </div>
        <div
          class=${e({ tiles: grid, rows: !grid })}
          style=${o(gridStyle)}
        >
          ${stories.map((story) => grid
            ? this._renderTile(story, playing)
            : this._renderRow(story, playing))}
        </div>
      </div>
    `;
    }
    _renderTile(story, playing) {
        const config = this._config;
        const isPlaying = playing === story.id;
        const justPlayed = this._justPlayed === story.id;
        const cover = this._coverUrl(story);
        return b `
      <button
        class=${e({ tile: true, playing: isPlaying })}
        style=${o(cover ? { backgroundImage: `url("${cover}")` } : {})}
        aria-label=${story.title}
        @click=${() => this._play(story)}
      >
        ${!cover
            ? b `<ha-icon class="fallback" icon="mdi:book-open-variant"></ha-icon>`
            : A}
        ${config.show_duration && story.duration_min
            ? b `<span class="badge">~${story.duration_min}m</span>`
            : A}
        ${isPlaying
            ? b `<span class="equalizer" aria-hidden="true"
              ><i></i><i></i><i></i
            ></span>`
            : A}
        ${justPlayed
            ? b `<span class="pop" aria-hidden="true">
              <ha-icon icon="mdi:play-circle"></ha-icon>
            </span>`
            : A}
        <span class="tile-footer">
          ${config.show_titles !== false
            ? b `<span class="tile-title">${story.title}</span>`
            : A}
          ${config.show_stats
            ? b `<span class="tile-stats">${this._statsLine(story)}</span>`
            : A}
        </span>
      </button>
    `;
    }
    _renderRow(story, playing) {
        const config = this._config;
        const isPlaying = playing === story.id;
        const justPlayed = this._justPlayed === story.id;
        const cover = this._coverUrl(story);
        return b `
      <button
        class=${e({ row: true, playing: isPlaying })}
        aria-label=${story.title}
        @click=${() => this._play(story)}
      >
        <span
          class="thumb"
          style=${o(cover ? { backgroundImage: `url("${cover}")` } : {})}
        >
          ${!cover
            ? b `<ha-icon icon="mdi:book-open-variant"></ha-icon>`
            : A}
          ${isPlaying
            ? b `<span class="equalizer" aria-hidden="true"
                ><i></i><i></i><i></i
              ></span>`
            : A}
        </span>
        <span class="row-main">
          <span class="row-title">${story.title}</span>
          ${config.show_stats
            ? b `<span class="row-stats">${this._statsLine(story)}</span>`
            : A}
        </span>
        ${config.show_duration && story.duration_min
            ? b `<span class="row-duration">~${story.duration_min}m</span>`
            : A}
        <ha-icon
          class="row-play"
          icon=${justPlayed || isPlaying ? "mdi:volume-high" : "mdi:play-circle"}
        ></ha-icon>
      </button>
    `;
    }
    static { this.styles = i$5 `
    ha-card {
      padding: 16px;
      overflow: hidden;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    h1 {
      margin: 0 0 4px;
      font-size: 1.4rem;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .player-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 1px solid var(--divider-color);
      border-radius: 999px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      padding: 4px 12px;
      font: inherit;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.2s ease;
      flex-shrink: 0;
    }
    .player-chip:hover {
      background: var(--divider-color);
    }
    .player-chip ha-icon {
      --mdc-icon-size: 16px;
    }
    .header-chips {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .device-chip.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .device-chip.active:hover {
      background: var(--primary-color);
    }
    audio {
      display: none;
    }
    .sort-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 8px 0 4px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      border: 1px solid var(--divider-color);
      border-radius: 999px;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 4px 12px;
      font: inherit;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .chip.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .chip ha-icon {
      --mdc-icon-size: 14px;
    }
    .error {
      color: var(--error-color);
      font-size: 0.85rem;
      margin: 8px 0;
    }
    .empty {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--secondary-text-color);
      padding: 24px 8px;
      justify-content: center;
      text-align: center;
    }
    .category {
      margin-top: 16px;
    }
    .category-header {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--secondary-text-color);
      font-size: 1.05rem;
      margin-bottom: 10px;
    }
    .category-header ha-icon {
      --mdc-icon-size: 20px;
    }
    /* --- grid tiles --- */
    .tiles {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
    }
    .tile {
      position: relative;
      aspect-ratio: 16 / 10;
      border: none;
      border-radius: 16px;
      background-color: var(--secondary-background-color);
      background-size: cover;
      background-position: center;
      cursor: pointer;
      overflow: hidden;
      padding: 0;
      display: flex;
      align-items: flex-end;
      transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .tile:active {
      transform: scale(0.95);
    }
    @media (hover: hover) {
      .tile:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
      }
    }
    .tile.playing {
      outline: 3px solid var(--primary-color);
      outline-offset: -3px;
    }
    .tile .fallback {
      position: absolute;
      inset: 0;
      margin: auto;
      color: var(--secondary-text-color);
      --mdc-icon-size: 42px;
    }
    .badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      border-radius: 999px;
      padding: 2px 8px;
      font-size: 0.75rem;
    }
    .tile-footer {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 20px 10px 8px;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
      text-align: left;
    }
    .tile-title {
      color: #fff;
      font-size: 1rem;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .tile-stats,
    .row-stats {
      color: rgba(255, 255, 255, 0.85);
      font-size: 0.72rem;
      margin-top: 2px;
    }
    .row-stats {
      color: var(--secondary-text-color);
    }
    /* --- list rows --- */
    .rows {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .compact .rows {
      gap: 4px;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      border: none;
      border-radius: 14px;
      background: var(--secondary-background-color);
      cursor: pointer;
      padding: 8px;
      font: inherit;
      text-align: left;
      transition: transform 0.15s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .compact .row {
      padding: 4px 8px;
      border-radius: 10px;
    }
    .row:active {
      transform: scale(0.98);
    }
    .row.playing {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .thumb {
      position: relative;
      width: 64px;
      height: 48px;
      flex-shrink: 0;
      border-radius: 10px;
      background-color: var(--card-background-color);
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      overflow: hidden;
    }
    .compact .thumb {
      width: 48px;
      height: 36px;
      border-radius: 8px;
    }
    .row-main {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .row-title {
      color: var(--primary-text-color);
      font-size: 1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .compact .row-title {
      font-size: 0.9rem;
    }
    .row-duration {
      color: var(--secondary-text-color);
      font-size: 0.8rem;
      flex-shrink: 0;
    }
    .row-play {
      color: var(--primary-color);
      --mdc-icon-size: 28px;
      flex-shrink: 0;
    }
    /* --- playing equalizer --- */
    .equalizer {
      position: absolute;
      top: 8px;
      left: 8px;
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 14px;
      background: rgba(0, 0, 0, 0.55);
      border-radius: 6px;
      padding: 3px 5px;
      box-sizing: content-box;
    }
    .equalizer i {
      width: 3px;
      background: #fff;
      border-radius: 1px;
      animation: eq 0.9s ease-in-out infinite;
    }
    .equalizer i:nth-child(2) {
      animation-delay: 0.25s;
    }
    .equalizer i:nth-child(3) {
      animation-delay: 0.5s;
    }
    @keyframes eq {
      0%,
      100% {
        height: 4px;
      }
      50% {
        height: 14px;
      }
    }
    /* --- tap feedback --- */
    .pop {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      animation: pop 1.6s ease forwards;
      pointer-events: none;
    }
    .pop ha-icon {
      --mdc-icon-size: 56px;
    }
    @keyframes pop {
      0% {
        opacity: 0;
        transform: scale(0.6);
      }
      15% {
        opacity: 1;
        transform: scale(1.15);
      }
      30% {
        transform: scale(1);
      }
      80% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `; }
};
__decorate([
    n$1({ attribute: false })
], BedtimeStoriesCard.prototype, "hass", void 0);
__decorate([
    r()
], BedtimeStoriesCard.prototype, "_config", void 0);
__decorate([
    r()
], BedtimeStoriesCard.prototype, "_library", void 0);
__decorate([
    r()
], BedtimeStoriesCard.prototype, "_covers", void 0);
__decorate([
    r()
], BedtimeStoriesCard.prototype, "_error", void 0);
__decorate([
    r()
], BedtimeStoriesCard.prototype, "_justPlayed", void 0);
__decorate([
    r()
], BedtimeStoriesCard.prototype, "_localSort", void 0);
__decorate([
    r()
], BedtimeStoriesCard.prototype, "_playHere", void 0);
__decorate([
    r()
], BedtimeStoriesCard.prototype, "_localPlayingId", void 0);
__decorate([
    e$2("audio")
], BedtimeStoriesCard.prototype, "_audioEl", void 0);
BedtimeStoriesCard = __decorate([
    t$1("bedtime-stories-card")
], BedtimeStoriesCard);
window.customCards = window.customCards ?? [];
window.customCards.push({
    type: "bedtime-stories-card",
    name: "Bedtime Stories Card",
    description: "Kid-friendly story tiles with categories, play statistics and a switchable playback target.",
    preview: true,
    documentationURL: "https://github.com/florianbaethge/bedtime_stories",
});
// eslint-disable-next-line no-console
console.info(`%c BEDTIME-STORIES-CARD %c ${"0.1.7"} `, "color: #fff; background: #5c6bc0; font-weight: 700;", "color: #5c6bc0; background: #fff; font-weight: 700;");

export { BedtimeStoriesCard };
//# sourceMappingURL=bedtime-stories-card.js.map
