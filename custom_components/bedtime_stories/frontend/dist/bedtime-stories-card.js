function e(e,t,i,s){var r,o=arguments.length,a=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,s);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let o=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(t,e))}return e}toString(){return this.cssText}};const a=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new o(i,e,s)},n=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:_}=Object,u=globalThis,m=u.trustedTypes,y=m?m.emptyScript:"",g=u.reactiveElementPolyfillSupport,f=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?y:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},b=(e,t)=>!c(e,t),$={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&l(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:r}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const o=s?.call(this);r?.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const e=_(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=s;const o=r.fromAttribute(t,e.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(void 0!==e){const o=this.constructor;if(!1===s&&(r=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??b)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==r||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[f("elementProperties")]=new Map,w[f("finalized")]=new Map,g?.({ReactiveElement:w}),(u.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,k=e=>e,S=x.trustedTypes,A=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,C="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+E,D=`<${P}>`,z=document,T=()=>z.createComment(""),L=e=>null===e||"object"!=typeof e&&"function"!=typeof e,M=Array.isArray,I="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,O=/>/g,N=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,j=/"/g,F=/^(?:script|style|textarea|title)$/i,W=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),B=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),G=new WeakMap,q=z.createTreeWalker(z,129);function V(e,t){if(!M(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const Z=(e,t)=>{const i=e.length-1,s=[];let r,o=2===t?"<svg>":3===t?"<math>":"",a=R;for(let t=0;t<i;t++){const i=e[t];let n,c,l=-1,d=0;for(;d<i.length&&(a.lastIndex=d,c=a.exec(i),null!==c);)d=a.lastIndex,a===R?"!--"===c[1]?a=U:void 0!==c[1]?a=O:void 0!==c[2]?(F.test(c[2])&&(r=RegExp("</"+c[2],"g")),a=N):void 0!==c[3]&&(a=N):a===N?">"===c[0]?(a=r??R,l=-1):void 0===c[1]?l=-2:(l=a.lastIndex-c[2].length,n=c[1],a=void 0===c[3]?N:'"'===c[3]?j:H):a===j||a===H?a=N:a===U||a===O?a=R:(a=N,r=void 0);const h=a===N&&e[t+1].startsWith("/>")?" ":"";o+=a===R?i+D:l>=0?(s.push(n),i.slice(0,l)+C+i.slice(l)+E+h):i+E+(-2===l?t:h)}return[V(e,o+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class J{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,o=0;const a=e.length-1,n=this.parts,[c,l]=Z(e,t);if(this.el=J.createElement(c,i),q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=q.nextNode())&&n.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(C)){const t=l[o++],i=s.getAttribute(e).split(E),a=/([.?@])?(.*)/.exec(t);n.push({type:1,index:r,name:a[2],strings:i,ctor:"."===a[1]?te:"?"===a[1]?ie:"@"===a[1]?se:ee}),s.removeAttribute(e)}else e.startsWith(E)&&(n.push({type:6,index:r}),s.removeAttribute(e));if(F.test(s.tagName)){const e=s.textContent.split(E),t=e.length-1;if(t>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],T()),q.nextNode(),n.push({type:2,index:++r});s.append(e[t],T())}}}else if(8===s.nodeType)if(s.data===P)n.push({type:2,index:r});else{let e=-1;for(;-1!==(e=s.data.indexOf(E,e+1));)n.push({type:7,index:r}),e+=E.length-1}r++}}static createElement(e,t){const i=z.createElement("template");return i.innerHTML=e,i}}function X(e,t,i=e,s){if(t===B)return t;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=L(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(e),r._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(t=X(e,r._$AS(e,t.values),r,s)),t}class Y{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??z).importNode(t,!0);q.currentNode=s;let r=q.nextNode(),o=0,a=0,n=i[0];for(;void 0!==n;){if(o===n.index){let t;2===n.type?t=new Q(r,r.nextSibling,this,e):1===n.type?t=new n.ctor(r,n.name,n.strings,this,e):6===n.type&&(t=new re(r,this,e)),this._$AV.push(t),n=i[++a]}o!==n?.index&&(r=q.nextNode(),o++)}return q.currentNode=z,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),L(e)?e===K||null==e||""===e?(this._$AH!==K&&this._$AR(),this._$AH=K):e!==this._$AH&&e!==B&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>M(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==K&&L(this._$AH)?this._$AA.nextSibling.data=e:this.T(z.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=J.createElement(V(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new Y(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new J(e)),t}k(e){M(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const r of e)s===t.length?t.push(i=new Q(this.O(T()),this.O(T()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=K,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(e,t=this,i,s){const r=this.strings;let o=!1;if(void 0===r)e=X(this,e,t,0),o=!L(e)||e!==this._$AH&&e!==B,o&&(this._$AH=e);else{const s=e;let a,n;for(e=r[0],a=0;a<r.length-1;a++)n=X(this,s[i+a],t,a),n===B&&(n=this._$AH[a]),o||=!L(n)||n!==this._$AH[a],n===K?e=K:e!==K&&(e+=(n??"")+r[a+1]),this._$AH[a]=n}o&&!s&&this.j(e)}j(e){e===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===K?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==K)}}class se extends ee{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??K)===B)return;const i=this._$AH,s=e===K&&i!==K||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==K&&(i===K||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const oe=x.litHtmlPolyfillSupport;oe?.(J,Q),(x.litHtmlVersions??=[]).push("3.3.3");const ae=globalThis;let ne=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let r=s._$litPart$;if(void 0===r){const e=i?.renderBefore??null;s._$litPart$=r=new Q(t.insertBefore(T(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}};ne._$litElement$=!0,ne.finalized=!0,ae.litElementHydrateSupport?.({LitElement:ne});const ce=ae.litElementPolyfillSupport;ce?.({LitElement:ne}),(ae.litElementVersions??=[]).push("4.2.2");const le=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},de={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:b},he=(e=de,t,i)=>{const{kind:s,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const r=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,r,e,!0,i)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];t.call(this,i),this.requestUpdate(s,r,e,!0,i)}}throw Error("Unsupported decorator location: "+s)};function pe(e){return(t,i)=>"object"==typeof i?he(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function _e(e){return pe({...e,state:!0,attribute:!1})}const ue=1,me=e=>(...t)=>({_$litDirective$:e,values:t});let ye=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};const ge=me(class extends ye{constructor(e){if(super(e),e.type!==ue||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const i=e.element.classList;for(const e of this.st)e in t||(i.remove(e),this.st.delete(e));for(const e in t){const s=!!t[e];s===this.st.has(e)||this.nt?.has(e)||(s?(i.add(e),this.st.add(e)):(i.remove(e),this.st.delete(e)))}return B}}),fe="important",ve=" !"+fe,be=me(class extends ye{constructor(e){if(super(e),e.type!==ue||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const s=e[i];return null==s?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?i.removeProperty(e):i[e]=null);for(const e in t){const s=t[e];if(null!=s){this.ft.add(e);const t="string"==typeof s&&s.endsWith(ve);e.includes("-")||t?i.setProperty(e,t?s.slice(0,-11):s,t?fe:""):i[e]=s}}return B}}),$e="bedtime_stories";function we(e,t){return t?{...e,entry_id:t}:e}const xe=(e,t)=>e.callWS({type:"media_source/resolve_media",media_content_id:t}),ke=(e,t,i)=>e.connection.subscribeMessage(t,we({type:`${$e}/subscribe`},i)),Se=(e,t,i)=>e.callWS(we({type:`${$e}/category/save`,category:t},i)),Ae=(e,t,i)=>e.callWS(we({type:`${$e}/story/save`,story:t},i)),Ce={en:{empty:"No stories yet — add some in the card editor.",no_player:"No player available",this_device:"This device",play_failed:"Playback failed",sort_manual:"My order",sort_alphabetical:"A–Z",sort_play_count:"Favorites",sort_last_played:"Recent",played_never:"never played",played_once:"played once",played_times:"played {count}×",playing:"Playing…",pause:"Pause",resume:"Resume",now_playing:"Now playing",tab_content:"Content",section_appearance:"Appearance",section_sorting:"Sorting & statistics",section_playback:"Playback",content_hint:"Categories group your stories and show up as sub-headers in the card. Edits to existing categories and stories save automatically and are shared by all Bedtime Stories cards — the card's own Save button below only applies to the display options.",new_category:"New category",edit_category:"Edit category",new_story:"New story",edit_story:"Edit story",advanced:"Advanced",media_selected:"Selected media",media_none:"No media file selected yet",media_help:"Browse your Home Assistant media, or upload a new audio file straight to “My media” with the button below.",cover_selected:"Selected image",cover_none:"No cover image selected yet",cover_uploaded:"Uploaded image",cover_help:"Browse your Home Assistant media, or upload a picture with the button below — uploads are automatically resized and cached for fast loading.",or:"or",upload_file:"Upload",uploading:"Uploading…",upload_failed:"Upload failed",upload_no_media_source:"No writable media folder found. Upload via Settings → Media, or use a share.",image_url:"Cover image URL / content id",image_url_help:"Direct image URL, /api/image/serve/… path or media-source id — overrides the picker.",duration_help:"Shown as a badge on the tile, e.g. “~20m”.",media_content_id_help:"Direct media-source URI or stream URL — overrides the picked media.",columns_help:"0 = automatic, based on the available width.",no_categories:"No categories yet. Start by creating one — for example “General” or “Fairy tales”.",title:"Title",layout:"Layout",layout_grid:"Grid",layout_list:"List",columns:"Columns (0 = automatic)",density:"Density",density_cozy:"Cozy",density_compact:"Compact",show_titles:"Show story titles",show_duration:"Show duration badge",show_stats:"Show play statistics",sort:"Sort stories by",sort_direction:"Sort direction",asc:"Ascending",desc:"Descending",show_sort_selector:"Show sort chips in the card",show_player:"Show player chip in the header",show_device_toggle:"Show “This device” toggle",show_device_toggle_help:"Adds a header chip to play the story right here in the browser or companion app, instead of casting to a media player.",show_now_playing:"Show playback controls",show_now_playing_help:"Shows a play/pause button and a progress bar above the stories for whatever is currently playing — on the selected media player or on this device.",keep_awake:"Keep screen awake on this device",keep_awake_help:"While a story plays on “This device”, requests a screen wake lock so the display doesn’t sleep and cut off playback. Only affects this-device playback.",player_mode:"Playback target",player_mode_select:"Player select entity (switchable)",player_mode_fixed:"Fixed media player",media_player:"Media player",entry:"Library",categories:"Categories",add_category:"Add category",add_story:"Add story",edit:"Edit",delete:"Delete",save:"Save",cancel:"Cancel",done:"Done",name:"Name",icon:"Icon",category:"Category",duration:"Duration (minutes)",cover:"Cover image",media:"Media file",media_content_id:"Media URL / content id",media_content_type:"Content type",story_id_hint:"Story ID (for automations)",stories_count:"{count} stories",confirm_delete_category:"Delete this category and all of its stories?",confirm_delete_story:"Delete this story?",not_configured:"Bedtime Stories integration is not set up yet. Add it under Settings → Devices & services.",reset_stats:"Reset statistics",confirm_reset_stats:"Reset play statistics for this story?",drag_reorder:"Drag to reorder"},de:{empty:"Noch keine Geschichten – füge welche im Karten-Editor hinzu.",no_player:"Kein Player verfügbar",this_device:"Dieses Gerät",play_failed:"Wiedergabe fehlgeschlagen",sort_manual:"Meine Reihenfolge",sort_alphabetical:"A–Z",sort_play_count:"Lieblinge",sort_last_played:"Zuletzt",played_never:"noch nie gehört",played_once:"1× gehört",played_times:"{count}× gehört",playing:"Läuft…",pause:"Pause",resume:"Fortsetzen",now_playing:"Wird abgespielt",tab_content:"Inhalte",section_appearance:"Darstellung",section_sorting:"Sortierung & Statistik",section_playback:"Wiedergabe",content_hint:"Kategorien gruppieren deine Geschichten und erscheinen als Zwischenüberschriften in der Karte. Änderungen an bestehenden Kategorien und Geschichten werden automatisch gespeichert und gelten für alle Bedtime-Stories-Karten — die Save-Schaltfläche der Karte selbst betrifft nur die Darstellungsoptionen.",new_category:"Neue Kategorie",edit_category:"Kategorie bearbeiten",new_story:"Neue Geschichte",edit_story:"Geschichte bearbeiten",advanced:"Erweitert",media_selected:"Ausgewählte Medien",media_none:"Noch keine Mediendatei ausgewählt",media_help:"Durchsuche deine Home-Assistant-Medien oder lade mit dem Button unten eine neue Audiodatei direkt in „Meine Medien“ hoch.",cover_selected:"Ausgewähltes Bild",cover_none:"Noch kein Cover-Bild ausgewählt",cover_uploaded:"Hochgeladenes Bild",cover_help:"Durchsuche deine Home-Assistant-Medien oder lade mit dem Button unten ein Bild hoch — Uploads werden automatisch verkleinert und für schnelles Laden zwischengespeichert.",or:"oder",upload_file:"Hochladen",uploading:"Wird hochgeladen…",upload_failed:"Upload fehlgeschlagen",upload_no_media_source:"Kein beschreibbarer Medienordner gefunden. Lade über Einstellungen → Medien hoch oder nutze eine Freigabe.",image_url:"Cover-Bild-URL / Content-ID",image_url_help:"Direkte Bild-URL, /api/image/serve/…-Pfad oder media-source-ID — übersteuert die Auswahl.",duration_help:"Wird als Badge auf der Kachel angezeigt, z. B. „~20m“.",media_content_id_help:"Direkte media-source-URI oder Stream-URL — übersteuert die ausgewählte Datei.",columns_help:"0 = automatisch, passend zur verfügbaren Breite.",no_categories:"Noch keine Kategorien. Leg zuerst eine an — zum Beispiel „Allgemein“ oder „Märchen“.",title:"Titel",layout:"Darstellung",layout_grid:"Raster",layout_list:"Liste",columns:"Spalten (0 = automatisch)",density:"Dichte",density_cozy:"Gemütlich",density_compact:"Kompakt",show_titles:"Titel der Geschichten anzeigen",show_duration:"Dauer-Badge anzeigen",show_stats:"Hörstatistik anzeigen",sort:"Geschichten sortieren nach",sort_direction:"Sortierrichtung",asc:"Aufsteigend",desc:"Absteigend",show_sort_selector:"Sortier-Chips in der Karte anzeigen",show_player:"Player-Chip im Kopf anzeigen",show_device_toggle:"„Dieses Gerät“-Schalter anzeigen",show_device_toggle_help:"Fügt oben einen Chip hinzu, um die Geschichte direkt hier im Browser oder in der Companion-App abzuspielen statt auf einen Mediaplayer zu casten.",show_now_playing:"Wiedergabesteuerung anzeigen",show_now_playing_help:"Zeigt über den Geschichten einen Play/Pause-Knopf und einen Fortschrittsbalken für das, was gerade läuft — auf dem gewählten Mediaplayer oder auf diesem Gerät.",keep_awake:"Bildschirm auf diesem Gerät wachhalten",keep_awake_help:"Während eine Geschichte auf „Dieses Gerät“ läuft, wird ein Wake-Lock angefordert, damit der Bildschirm nicht in den Ruhezustand geht und die Wiedergabe abbricht. Betrifft nur die Wiedergabe auf diesem Gerät.",player_mode:"Wiedergabeziel",player_mode_select:"Player-Auswahl-Entität (umschaltbar)",player_mode_fixed:"Fester Medienplayer",media_player:"Medienplayer",entry:"Bibliothek",categories:"Kategorien",add_category:"Kategorie hinzufügen",add_story:"Geschichte hinzufügen",edit:"Bearbeiten",delete:"Löschen",save:"Speichern",cancel:"Abbrechen",done:"Fertig",name:"Name",icon:"Icon",category:"Kategorie",duration:"Dauer (Minuten)",cover:"Cover-Bild",media:"Mediendatei",media_content_id:"Medien-URL / Content-ID",media_content_type:"Content-Type",story_id_hint:"Geschichten-ID (für Automationen)",stories_count:"{count} Geschichten",confirm_delete_category:"Diese Kategorie samt aller Geschichten löschen?",confirm_delete_story:"Diese Geschichte löschen?",not_configured:"Die Bedtime-Stories-Integration ist noch nicht eingerichtet. Füge sie unter Einstellungen → Geräte & Dienste hinzu.",reset_stats:"Statistik zurücksetzen",confirm_reset_stats:"Hörstatistik dieser Geschichte zurücksetzen?",drag_reorder:"Zum Sortieren ziehen"}};function Ee(e,t,i){const s=(e?.locale?.language??e?.language??"en").split("-")[0];let r=(Ce[s]??Ce.en)[t]??Ce.en[t]??t;if(i)for(const[e,t]of Object.entries(i))r=r.replace(`{${e}}`,String(t));return r}function Pe(e){return"string"==typeof e&&e.startsWith("media-source://")}const De=new Map;async function ze(e,t){if(!t)return null;if(!Pe(t))return t;const i=Date.now(),s=De.get(t);if(s&&i-s.at<24e4)return s.url;try{const{url:s}=await xe(e,t);return De.set(t,{url:s,at:i}),s}catch{return null}}const Te={layout:"grid",columns:0,density:"cozy",show_titles:!0,show_duration:!0,show_stats:!1,sort:"manual",sort_direction:"asc",show_sort_selector:!1,show_player:!0,show_device_toggle:!0,show_now_playing:!0,keep_awake:!0,player_mode:"select"};var Le;let Me=class extends ne{constructor(){super(...arguments),this._entries=[],this._covers={},this._formReady=!1,this._categoryDraft=null,this._storyDraft=null,this._storyAdvanced=!1,this._savingContent=!1,this._computeLabel=e=>"entry_id"===e.name?this._l("entry"):this._l(e.name),this._computeHelper=e=>"columns"===e.name?this._l("columns_help"):"show_device_toggle"===e.name?this._l("show_device_toggle_help"):"show_now_playing"===e.name?this._l("show_now_playing_help"):"keep_awake"===e.name?this._l("keep_awake_help"):void 0,this._noLabel=()=>"",this._dragEnd=()=>{this._dragKind=void 0,this._dragId=void 0,this._dragCategoryId=void 0,this._dragOverId=void 0}}static{Le=this}setConfig(e){this._config={...e},this._connectLibrary()}connectedCallback(){super.connectedCallback(),async function(){if(!customElements.get("ha-form"))try{const e=await(window.loadCardHelpers?.());if(!e)return;const t=await e.createCardElement({type:"entities",entities:[]});await(t.constructor.getConfigElement?.())}catch{}}().then(()=>{this._formReady=!0}),this._connectLibrary()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.then(e=>e()).catch(()=>{}),this._unsubscribe=void 0,this._subscribedEntry=void 0,this._contentTimer&&(clearTimeout(this._contentTimer),this._contentTimer=void 0,this._autoSaveContent())}updated(){this.hass&&!this._unsubscribe&&this._connectLibrary()}_connectLibrary(){if(!this.hass||!this.isConnected)return;const e=this._config?.entry_id??"";var t;this._unsubscribe&&this._subscribedEntry===e||(this._unsubscribe?.then(e=>e()).catch(()=>{}),this._subscribedEntry=e,(t=this.hass,t.callWS({type:`${$e}/entries/list`})).then(e=>{this._entries=e}),this._unsubscribe=ke(this.hass,e=>{this._library=e,this._error=void 0,this._resolveCovers(e)},this._config?.entry_id||void 0),this._unsubscribe.catch(()=>{this._unsubscribe=void 0,this._library=void 0}))}_l(e,t){return Ee(this.hass,e,t)}async _resolveCovers(e){if(!this.hass)return;const t={};await Promise.all(e.stories.map(async e=>{if(!Pe(e.image))return;const i=await ze(this.hass,e.image);i&&i!==this._covers[e.id]&&(t[e.id]=i)})),Object.keys(t).length&&(this._covers={...this._covers,...t})}_storyThumb(e){return e.image?Pe(e.image)?this._covers[e.id]??null:e.image:null}_basicsSchema(){const e=[];return this._entries.length>1&&e.push({name:"entry_id",selector:{select:{mode:"dropdown",options:this._entries.map(e=>({value:e.entry_id,label:e.name}))}}}),e.push({name:"title",selector:{text:{}}}),e}_appearanceSchema(){const e={...Te,...this._config},t=[{name:"layout",selector:{select:{mode:"dropdown",options:[{value:"grid",label:this._l("layout_grid")},{value:"list",label:this._l("layout_list")}]}}}];return"list"===e.layout?t.push({name:"density",selector:{select:{mode:"dropdown",options:[{value:"cozy",label:this._l("density_cozy")},{value:"compact",label:this._l("density_compact")}]}}}):t.push({name:"columns",selector:{number:{min:0,max:8,mode:"box"}}}),[{name:"",type:"grid",schema:t},{name:"",type:"grid",schema:[{name:"show_titles",selector:{boolean:{}}},{name:"show_duration",selector:{boolean:{}}}]}]}_sortingSchema(){return[{name:"",type:"grid",schema:[{name:"sort",selector:{select:{mode:"dropdown",options:[{value:"manual",label:this._l("sort_manual")},{value:"alphabetical",label:this._l("sort_alphabetical")},{value:"play_count",label:this._l("sort_play_count")},{value:"last_played",label:this._l("sort_last_played")}]}}},{name:"sort_direction",selector:{select:{mode:"dropdown",options:[{value:"asc",label:this._l("asc")},{value:"desc",label:this._l("desc")}]}}}]},{name:"",type:"grid",schema:[{name:"show_sort_selector",selector:{boolean:{}}},{name:"show_stats",selector:{boolean:{}}}]}]}_playbackSchema(){const e={...Te,...this._config},t=[{name:"player_mode",selector:{select:{mode:"dropdown",options:[{value:"select",label:this._l("player_mode_select")},{value:"fixed",label:this._l("player_mode_fixed")}]}}}];return"fixed"===e.player_mode?t.push({name:"media_player",selector:{entity:{domain:"media_player"}}}):t.push({name:"show_player",selector:{boolean:{}}}),t.push({name:"show_device_toggle",selector:{boolean:{}}}),t.push({name:"show_now_playing",selector:{boolean:{}}}),t.push({name:"keep_awake",selector:{boolean:{}}}),t}_settingsChanged(e){e.stopPropagation();const t=e.detail.value;this._config={...this._config,...t,type:"custom:bedtime-stories-card"},function(e,t,i){const s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:i??{}});e.dispatchEvent(s)}(this,"config-changed",{config:this._config}),this._connectLibrary()}_renderSettingsForm(e){return W`
      <ha-form
        .hass=${this.hass}
        .data=${{...Te,...this._config}}
        .schema=${e}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._settingsChanged}
      ></ha-form>
    `}get _entryId(){return this._config?.entry_id||void 0}_startCategory(e){this._clearContentTimer(),this._storyDraft=null,this._categoryDraft=e?{id:e.id,name:e.name,icon:e.icon}:{name:"",icon:"mdi:teddy-bear"}}_startStory(e,t){this._clearContentTimer(),this._categoryDraft=null,this._storyAdvanced=!1,this._storyDraft=t?{id:t.id,category_id:t.category_id,title:t.title,duration_min:t.duration_min,image:t.image,media_content_id:t.media_content_id,media_content_type:t.media_content_type,media:{media_content_id:t.media_content_id,media_content_type:t.media_content_type},cover_media:Pe(t.image)?{media_content_id:t.image,media_content_type:"image/*"}:void 0}:{category_id:e,title:"",duration_min:null,image:null,media_content_id:"",media_content_type:"audio/mpeg"}}async _saveCategory(){if(this.hass&&this._categoryDraft){this._clearContentTimer();try{await Se(this.hass,{...this._categoryDraft},this._entryId),this._categoryDraft=null}catch(e){this._error=e?.message}}}async _deleteCategory(e){if(this.hass&&window.confirm(this._l("confirm_delete_category"))){this._clearContentTimer();try{await(t=this.hass,i=e.id,s=this._entryId,t.callWS(we({type:`${$e}/category/delete`,category_id:i},s)))}catch(e){this._error=e?.message}var t,i,s}}async _saveStory(){if(!this.hass||!this._storyDraft)return;this._clearContentTimer();const{media:e,cover_media:t,...i}=this._storyDraft;try{await Ae(this.hass,{...i},this._entryId),this._storyDraft=null}catch(e){this._error=e?.message}}async _deleteStory(e){if(this.hass&&window.confirm(this._l("confirm_delete_story"))){this._clearContentTimer();try{await(t=this.hass,i=e.id,s=this._entryId,t.callWS(we({type:`${$e}/story/delete`,story_id:i},s)))}catch(e){this._error=e?.message}var t,i,s}}async _resetStoryStats(){var e,t,i;if(this.hass&&this._storyDraft?.id&&window.confirm(this._l("confirm_reset_stats")))try{await(e=this.hass,t=this._storyDraft.id,i=this._entryId,e.callWS(we({type:`${$e}/stats/reset`,...t?{story_id:t}:{}},i)))}catch(e){this._error=e?.message}}_playCountText(e){const t=this._library?.stats[e]?.play_count??0;return 0===t?this._l("played_never"):1===t?this._l("played_once"):this._l("played_times",{count:t})}_clearContentTimer(){this._contentTimer&&(clearTimeout(this._contentTimer),this._contentTimer=void 0)}_scheduleContentSave(){this._clearContentTimer(),this._contentTimer=setTimeout(()=>{this._autoSaveContent()},700)}async _autoSaveContent(){if(this._contentTimer=void 0,!this.hass)return;if(this._savingContent)return void this._scheduleContentSave();const e=this._storyDraft,t=this._categoryDraft;this._savingContent=!0;try{if(e?.id&&e.title.trim()&&e.media_content_id.trim()){const{media:t,cover_media:i,...s}=e;await Ae(this.hass,{...s},this._entryId)}else t?.id&&t.name.trim()&&await Se(this.hass,{...t},this._entryId)}catch(e){this._error=e?.message}finally{this._savingContent=!1}}async _doneStory(){this._clearContentTimer(),await this._autoSaveContent(),this._storyDraft=null}async _doneCategory(){this._clearContentTimer(),await this._autoSaveContent(),this._categoryDraft=null}_renderDragHandle(e,t,i){return W`
      <span
        class="drag-handle"
        draggable="true"
        title=${this._l("drag_reorder")}
        @dragstart=${s=>this._dragStart(e,t,i,s)}
        @dragend=${this._dragEnd}
      >
        <ha-icon icon="mdi:drag-vertical"></ha-icon>
      </span>
    `}_dragStart(e,t,i,s){if(this._dragKind=e,this._dragId=t,this._dragCategoryId=i,s.dataTransfer){s.dataTransfer.effectAllowed="move",s.dataTransfer.setData("text/plain",t);const i=s.currentTarget.closest("category"===e?".category-card":".story-row");i&&s.dataTransfer.setDragImage(i,24,16)}}_dragOver(e,t,i,s){this._dragKind===e&&("story"===e&&this._dragCategoryId!==i||(s.preventDefault(),s.dataTransfer&&(s.dataTransfer.dropEffect="move"),this._dragOverId!==t&&(this._dragOverId=t)))}_drop(e,t,i,s){if(this._dragKind!==e)return;s.preventDefault(),s.stopPropagation();const r=this._dragId;if(!r||r===t||!this.hass)return void this._dragEnd();const o=s.currentTarget.getBoundingClientRect(),a=s.clientY>o.top+o.height/2;if("category"===e){const e=this._moveInList((this._library?.categories??[]).map(e=>e.id),r,t,a);(n=this.hass,c=e,l=this._entryId,n.callWS(we({type:`${$e}/category/reorder`,category_ids:c},l))).catch(e=>this._error=e?.message)}else if(i&&this._dragCategoryId===i){const e=this._moveInList((this._library?.stories??[]).filter(e=>e.category_id===i).map(e=>e.id),r,t,a);((e,t,i)=>e.callWS(we({type:`${$e}/story/reorder`,story_ids:t},i)))(this.hass,e,this._entryId).catch(e=>this._error=e?.message)}var n,c,l;this._dragEnd()}_moveInList(e,t,i,s){const r=e.filter(e=>e!==t),o=r.indexOf(i);return o<0?e:(r.splice(s?o+1:o,0,t),r)}_categoryFormChanged(e){e.stopPropagation(),this._categoryDraft={...this._categoryDraft,...e.detail.value},this._categoryDraft.id&&this._scheduleContentSave()}_storyFormChanged(e){e.stopPropagation();const t=e.detail.value,i={...this._storyDraft,...t},s=t.media;s?.media_content_id&&s.media_content_id!==this._storyDraft?.media?.media_content_id&&(i.media_content_id=s.media_content_id,i.media_content_type=s.media_content_type??i.media_content_type,!i.title&&s.metadata?.title&&(i.title=s.metadata.title));const r=t.cover_media;r&&r.media_content_id!==this._storyDraft?.cover_media?.media_content_id&&(i.image=r.media_content_id||null),this._storyDraft=i,i.id&&this._scheduleContentSave()}_mediaDisplayName(e){if(e.media?.metadata?.title)return e.media.metadata.title;if(!e.media_content_id)return;const t=e.media_content_id.split("?")[0];return decodeURIComponent(t.split("/").pop()??"")||e.media_content_id}_coverDisplayName(e){if(e.cover_media?.metadata?.title)return e.cover_media.metadata.title;if(!e.image)return;if(e.image.startsWith("/api/image/serve/"))return this._l("cover_uploaded");const t=e.image.split("?")[0];return decodeURIComponent(t.split("/").pop()??"")||e.image}static{this._LOCAL_PREFIX="media-source://media_source/local"}async _localMediaFolder(){if(this._uploadFolder)return this._uploadFolder;const e=Le._LOCAL_PREFIX,t=this._foldersFromExistingMedia();for(const e of await this._browseLocalFolders())t.includes(e)||t.push(e);const i=t.find(t=>t===`${e}/media`)??t.find(e=>e.endsWith("/media"))??t[0]??null;return i&&(this._uploadFolder=i),i}_foldersFromExistingMedia(){const e=Le._LOCAL_PREFIX,t=[];for(const i of this._library?.stories??[])for(const s of[i.media_content_id,i.image]){if(!s||!s.startsWith(e))continue;const i=s.split("?")[0],r=i.lastIndexOf("/");if(r<=e.length)continue;const o=i.slice(0,r);t.includes(o)||t.push(o)}return t}async _browseLocalFolders(){if(!this.hass)return[];const e=Le._LOCAL_PREFIX,t=t=>!!t&&t.startsWith(e),i=e=>(e?.children??[]).filter(e=>e.can_expand&&t(e.media_content_id)).map(e=>e.media_content_id),s=async e=>{try{return await this.hass.callWS({type:"media_source/browse_media",media_content_id:e})}catch{return}};for(const r of[`${e}/.`,e,"","media-source://"]){const e=await s(r);if(!e)continue;const o=i(e);if(o.length)return o;const a=(e.children??[]).find(e=>t(e.media_content_id));if(a?.media_content_id){const e=i(await s(a.media_content_id));if(e.length)return e}}return[]}async _uploadToLocal(e){const t=await this._localMediaFolder();if(!t||!this.hass)return this._error=this._l("upload_no_media_source"),null;const i=new FormData;i.append("media_content_id",t),i.append("file",e);const s=await this.hass.fetchWithAuth("/api/media_source/local_source/upload",{method:"POST",body:i});if(!s.ok)throw new Error(`${this._l("upload_failed")} (HTTP ${s.status})`);const r=await s.json();return r.media_content_id??r.id??`${t}/${e.name}`}async _uploadMediaFile(e){const t=e.target,i=t.files?.[0];if(t.value="",i&&this._storyDraft){this._uploading="media",this._error=void 0;try{const e=await this._uploadToLocal(i);if(!e)return;const t=i.type||"audio/mpeg",s={...this._storyDraft,media_content_id:e,media_content_type:t,media:{media_content_id:e,media_content_type:t,metadata:{title:i.name}}};s.title.trim()||(s.title=i.name.replace(/\.[^./\\]+$/,"")),this._storyDraft=s,s.id&&this._scheduleContentSave()}catch(e){this._error=e?.message??this._l("upload_failed")}finally{this._uploading=void 0}}}static{this._COVER_SERVE_SIZE="512x512"}async _downscaleImage(e,t=1024,i=.85){if(!e.type.startsWith("image/")||"image/gif"===e.type)return e;try{const s=await createImageBitmap(e),r=Math.min(1,t/Math.max(s.width,s.height));if(r>=1)return s.close(),e;const o=Math.round(s.width*r),a=Math.round(s.height*r),n=document.createElement("canvas");n.width=o,n.height=a;const c=n.getContext("2d");if(!c)return s.close(),e;c.drawImage(s,0,0,o,a),s.close();const l=await new Promise(e=>n.toBlob(e,"image/jpeg",i));if(!l)return e;const d=`${e.name.replace(/\.[^./\\]+$/,"")}.jpg`;return new File([l],d,{type:"image/jpeg"})}catch{return e}}async _uploadCover(e){if(!this.hass)return null;const t=await this._downscaleImage(e);try{const e=new FormData;e.append("file",t);const i=await this.hass.fetchWithAuth("/api/image/upload",{method:"POST",body:e});if(i.ok){const e=await i.json();if(e.id)return`/api/image/serve/${e.id}/${Le._COVER_SERVE_SIZE}`}}catch{}return this._uploadToLocal(t)}async _uploadCoverFile(e){const t=e.target,i=t.files?.[0];if(t.value="",i&&this._storyDraft){this._uploading="cover",this._error=void 0;try{const e=await this._uploadCover(i);if(!e)return;this._storyDraft={...this._storyDraft,image:e,cover_media:Pe(e)?{media_content_id:e,media_content_type:"image/*"}:void 0},this._storyDraft.id&&this._scheduleContentSave()}catch(e){this._error=e?.message??this._l("upload_failed")}finally{this._uploading=void 0}}}_renderUploadRow(e,t,i){return W`
      <div class="upload-row">
        <span class="upload-or">${this._l("or")}</span>
        <mwc-button
          outlined
          dense
          .disabled=${void 0!==this._uploading}
          @click=${e=>e.currentTarget.nextElementSibling.click()}
        >
          <ha-icon slot="icon" icon="mdi:tray-arrow-up"></ha-icon>
          ${this._uploading===e?this._l("uploading"):this._l("upload_file")}
        </mwc-button>
        <input
          class="file-input"
          type="file"
          accept=${t}
          @change=${i}
        />
      </div>
    `}render(){return this.hass&&this._config?this._formReady?W`
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
      ${this.hass.user?.is_admin?this._renderContent():K}
    `:W`<ha-circular-progress indeterminate></ha-circular-progress>`:W``}_renderContent(){const e=this._library;return W`
      <div class="section content">
        <div class="section-header">
          <ha-icon icon="mdi:bookshelf"></ha-icon>
          <span>${this._l("tab_content")}</span>
        </div>
        <p class="section-hint">${this._l("content_hint")}</p>
        ${this._error?W`<ha-alert alert-type="error">${this._error}</ha-alert>`:K}
        ${e?W`
              ${0!==e.categories.length||this._categoryDraft?K:W`<p class="section-hint empty">
                    ${this._l("no_categories")}
                  </p>`}
              ${e.categories.map(t=>this._renderCategoryBlock(t,e))}
              ${this._categoryDraft&&!this._categoryDraft.id?this._renderCategoryForm():W`
                    <mwc-button
                      outlined
                      class="add-category"
                      @click=${()=>this._startCategory()}
                    >
                      <ha-icon slot="icon" icon="mdi:plus"></ha-icon>
                      ${this._l("add_category")}
                    </mwc-button>
                  `}
            `:W`<p class="section-hint">${this._l("not_configured")}</p>`}
      </div>
    `}_renderCategoryBlock(e,t){const i=t.stories.filter(t=>t.category_id===e.id),s=this._categoryDraft?.id===e.id;return W`
      <div
        class="category-card ${this._dragOverId===e.id?"drag-over":""}"
        @dragover=${t=>this._dragOver("category",e.id,void 0,t)}
        @drop=${t=>this._drop("category",e.id,void 0,t)}
      >
        <div class="category-head">
          ${this._renderDragHandle("category",e.id)}
          <div class="icon-chip">
            <ha-icon icon=${e.icon||"mdi:teddy-bear"}></ha-icon>
          </div>
          <div class="category-text">
            <span class="category-name">${e.name}</span>
            <span class="category-meta"
              >${this._l("stories_count",{count:i.length})}</span
            >
          </div>
          <ha-icon-button
            .label=${this._l("edit")}
            @click=${()=>this._startCategory(e)}
          >
            <ha-icon icon="mdi:pencil-outline"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            class="danger"
            .label=${this._l("delete")}
            @click=${()=>this._deleteCategory(e)}
          >
            <ha-icon icon="mdi:trash-can-outline"></ha-icon>
          </ha-icon-button>
        </div>
        ${s?this._renderCategoryForm():K}
        <div class="story-list">
          ${i.map(e=>this._renderStoryRow(e,t))}
        </div>
        ${this._storyDraft&&!this._storyDraft.id&&this._storyDraft.category_id===e.id?this._renderStoryForm():W`
              <button
                class="add-story"
                @click=${()=>this._startStory(e.id)}
              >
                <ha-icon icon="mdi:plus"></ha-icon>
                <span>${this._l("add_story")}</span>
              </button>
            `}
      </div>
    `}_renderStoryRow(e,t){const i=this._storyDraft?.id===e.id,s=this._storyThumb(e),r=t.stats[e.id],o=[];return e.duration_min&&o.push(`~${e.duration_min}m`),r?.play_count&&o.push(1===r.play_count?this._l("played_once"):this._l("played_times",{count:r.play_count})),W`
      <div
        class="story-row ${i?"editing":""} ${this._dragOverId===e.id?"drag-over":""}"
        @dragover=${t=>this._dragOver("story",e.id,e.category_id,t)}
        @drop=${t=>this._drop("story",e.id,e.category_id,t)}
      >
        ${this._renderDragHandle("story",e.id,e.category_id)}
        <span
          class="story-thumb"
          style=${s?`background-image:url("${s}")`:""}
        >
          ${s?K:W`<ha-icon icon="mdi:book-open-variant"></ha-icon>`}
        </span>
        <div class="story-text">
          <span class="story-title">${e.title}</span>
          ${o.length?W`<span class="story-meta">${o.join(" · ")}</span>`:K}
        </div>
        <ha-icon-button
          .label=${this._l("edit")}
          @click=${()=>this._startStory(e.category_id,e)}
        >
          <ha-icon icon="mdi:pencil-outline"></ha-icon>
        </ha-icon-button>
        <ha-icon-button
          class="danger"
          .label=${this._l("delete")}
          @click=${()=>this._deleteStory(e)}
        >
          <ha-icon icon="mdi:trash-can-outline"></ha-icon>
        </ha-icon-button>
      </div>
      ${i?this._renderStoryForm():K}
    `}_renderCategoryForm(){const e=this._categoryDraft;return W`
      <div class="form-panel">
        <div class="form-title">
          ${this._l(e.id?"edit_category":"new_category")}
        </div>
        <ha-form
          .hass=${this.hass}
          .data=${e}
          .schema=${[{name:"",type:"grid",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]}]}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._categoryFormChanged}
        ></ha-form>
        <div class="form-actions">
          ${e.id?W`<mwc-button raised @click=${this._doneCategory}>
                ${this._l("done")}
              </mwc-button>`:W`
                <mwc-button @click=${()=>this._categoryDraft=null}>
                  ${this._l("cancel")}
                </mwc-button>
                <mwc-button
                  raised
                  .disabled=${!e.name.trim()}
                  @click=${this._saveCategory}
                >
                  ${this._l("save")}
                </mwc-button>
              `}
        </div>
      </div>
    `}_renderStoryForm(){const e=this._storyDraft,t=[{name:"title",selector:{text:{}}},{name:"",type:"grid",schema:[{name:"category_id",selector:{select:{mode:"dropdown",options:(this._library?.categories??[]).map(e=>({value:e.id,label:e.name}))}}},{name:"duration_min",selector:{number:{min:1,max:600,mode:"box"}}}]}],i={title:this._l("title"),category_id:this._l("category"),duration_min:this._l("duration"),media:this._l("media"),media_content_id:this._l("media_content_id"),media_content_type:this._l("media_content_type"),image:this._l("image_url")},s={duration_min:this._l("duration_help"),media_content_id:this._l("media_content_id_help"),image:this._l("image_url_help")},r=e=>i[e.name]??e.name,o=e=>s[e.name],a=this._mediaDisplayName(e),n=this._coverDisplayName(e);return W`
      <div class="form-panel">
        <div class="form-title">
          ${this._l(e.id?"edit_story":"new_story")}
        </div>
        <ha-form
          .hass=${this.hass}
          .data=${e}
          .schema=${t}
          .computeLabel=${r}
          .computeHelper=${o}
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
            .data=${e}
            .schema=${[{name:"media",selector:{media:{accept:["audio/*"]}}}]}
            .computeLabel=${r}
            @value-changed=${this._storyFormChanged}
          ></ha-form>
          ${this._renderUploadRow("media","audio/*",this._uploadMediaFile)}
          <div class="media-status ${e.media_content_id?"ok":""}">
            <ha-icon
              icon=${e.media_content_id?"mdi:check-circle":"mdi:alert-circle-outline"}
            ></ha-icon>
            <span
              >${e.media_content_id?`${this._l("media_selected")}: ${a}`:this._l("media_none")}</span
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
            .data=${e}
            .schema=${[{name:"cover_media",selector:{media:{accept:["image/*"]}}}]}
            .computeLabel=${this._noLabel}
            @value-changed=${this._storyFormChanged}
          ></ha-form>
          ${this._renderUploadRow("cover","image/*",this._uploadCoverFile)}
          <div class="media-status ${e.image?"ok":""}">
            <ha-icon
              icon=${e.image?"mdi:check-circle":"mdi:image-off-outline"}
            ></ha-icon>
            <span
              >${e.image?`${this._l("cover_selected")}: ${n}`:this._l("cover_none")}</span
            >
          </div>
        </div>

        <button
          class="advanced-toggle"
          @click=${()=>this._storyAdvanced=!this._storyAdvanced}
        >
          <ha-icon
            icon=${this._storyAdvanced?"mdi:chevron-down":"mdi:chevron-right"}
          ></ha-icon>
          ${this._l("advanced")}
        </button>
        ${this._storyAdvanced?W`
              <div class="advanced-body">
                <ha-form
                  .hass=${this.hass}
                  .data=${e}
                  .schema=${[{name:"media_content_id",selector:{text:{}}},{name:"media_content_type",selector:{text:{}}},{name:"image",selector:{text:{}}}]}
                  .computeLabel=${r}
                  .computeHelper=${o}
                  @value-changed=${this._storyFormChanged}
                ></ha-form>
                ${e.id?W`
                      <div class="story-id-row">
                        <span
                          >${this._l("story_id_hint")}:
                          <code>${e.id}</code></span
                        >
                      </div>
                      <div class="reset-stats-row">
                        <span class="reset-count">
                          <ha-icon icon="mdi:chart-line-variant"></ha-icon>
                          ${this._playCountText(e.id)}
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
                    `:K}
              </div>
            `:K}

        <div class="form-actions">
          ${e.id?W`<mwc-button raised @click=${this._doneStory}>
                ${this._l("done")}
              </mwc-button>`:W`
                <mwc-button @click=${()=>this._storyDraft=null}>
                  ${this._l("cancel")}
                </mwc-button>
                <mwc-button
                  raised
                  .disabled=${!e.title.trim()||!e.media_content_id.trim()}
                  @click=${this._saveStory}
                >
                  ${this._l("save")}
                </mwc-button>
              `}
        </div>
      </div>
    `}static{this.styles=a`
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
  `}};e([pe({attribute:!1})],Me.prototype,"hass",void 0),e([_e()],Me.prototype,"_config",void 0),e([_e()],Me.prototype,"_entries",void 0),e([_e()],Me.prototype,"_library",void 0),e([_e()],Me.prototype,"_covers",void 0),e([_e()],Me.prototype,"_formReady",void 0),e([_e()],Me.prototype,"_categoryDraft",void 0),e([_e()],Me.prototype,"_storyDraft",void 0),e([_e()],Me.prototype,"_storyAdvanced",void 0),e([_e()],Me.prototype,"_error",void 0),e([_e()],Me.prototype,"_uploading",void 0),e([_e()],Me.prototype,"_dragOverId",void 0),Me=Le=e([le("bedtime-stories-card-editor")],Me);const Ie=["manual","alphabetical","play_count","last_played"],Re=["play_count","last_played"];let Ue=class extends ne{constructor(){super(...arguments),this._covers={},this._justPlayed=null,this._playHere=!1,this._localPlayingId=null,this._localPaused=!1,this._localPos=0,this._localDur=0,this._scrubbing=!1,this._scrubValue=0,this._onAudioMeta=()=>{const e=this._audioEl?.duration??0;this._localDur=Number.isFinite(e)?e:0},this._onAudioTime=()=>{this._scrubbing||(this._localPos=this._audioEl?.currentTime??0)},this._onAudioPlay=()=>{this._localPaused=!1,this._acquireWakeLock()},this._onAudioPause=()=>{this._localPaused=!0,this._releaseWakeLock()},this._onAudioEnded=()=>{this._localPlayingId=null,this._localPaused=!1,this._localPos=0,this._releaseWakeLock()},this._onAudioError=()=>{this._localPlayingId=null,this._releaseWakeLock(),this._playHere&&this._flashError(Ee(this.hass,"play_failed"))},this._onVisibility=()=>{"visible"===document.visibilityState&&this._localPlayingId&&!this._localPaused&&this._acquireWakeLock()}}static getConfigElement(){return document.createElement("bedtime-stories-card-editor")}static getStubConfig(){return{title:"Bedtime Stories"}}setConfig(e){if(!e||"object"!=typeof e)throw new Error("Invalid configuration");if(e.layout&&"grid"!==e.layout&&"list"!==e.layout)throw new Error('layout must be "grid" or "list"');if("fixed"===e.player_mode&&!e.media_player)throw new Error('player_mode "fixed" requires a media_player');this._config={...Te,...e},this._localSort=this._loadLocalSort(),this._playHere=this._loadPlayHere(),this._resubscribe()}getCardSize(){const e=this._library?.stories.length??6;return 2+2*Math.ceil(e/3)}getGridOptions(){return{columns:"full",rows:"auto"}}getLayoutOptions(){return{grid_columns:"full",grid_rows:"auto"}}connectedCallback(){super.connectedCallback(),this._resubscribe(),document.addEventListener("visibilitychange",this._onVisibility)}disconnectedCallback(){super.disconnectedCallback(),this._teardown(),this._stopLocal(),document.removeEventListener("visibilitychange",this._onVisibility),this._stopPositionTimer()}updated(){this.hass&&!this._unsubscribe&&this._resubscribe(),this._syncPositionTimer()}_teardown(){this._unsubscribe?.then(e=>e()).catch(()=>{}),this._unsubscribe=void 0,this._subscribedEntry=void 0}_resubscribe(){if(!this.hass||!this._config||!this.isConnected)return;const e=this._config.entry_id??"";this._unsubscribe&&this._subscribedEntry===e||(this._teardown(),this._subscribedEntry=e,this._unsubscribe=ke(this.hass,e=>{this._library=e,this._error=void 0,this._resolveCovers(e)},this._config.entry_id),this._unsubscribe.catch(e=>{this._unsubscribe=void 0,this._error=e?.message??"unknown error"}))}_sortStorageKey(){return`bedtime-stories-sort:${this._config?.entry_id??"default"}`}_loadLocalSort(){if(this._config?.show_sort_selector)try{const e=window.localStorage.getItem(this._sortStorageKey());return e?JSON.parse(e):void 0}catch{return}}_deviceStorageKey(){return`bedtime-stories-here:${this._config?.entry_id??"default"}`}_loadPlayHere(){try{return"1"===window.localStorage.getItem(this._deviceStorageKey())}catch{return!1}}_togglePlayHere(){this._playHere=!this._playHere;try{window.localStorage.setItem(this._deviceStorageKey(),this._playHere?"1":"0")}catch{}this._playHere||this._stopLocal()}_stopLocal(){this._audioEl?.pause(),this._localPlayingId=null,this._localPaused=!1,this._localPos=0,this._localDur=0,this._releaseWakeLock()}async _acquireWakeLock(){if(!1===this._config?.keep_awake)return;const e=navigator;if(e.wakeLock&&!this._wakeLock)try{const t=await e.wakeLock.request("screen");this._wakeLock=t,t.addEventListener("release",()=>{this._wakeLock===t&&(this._wakeLock=void 0)})}catch{}}_releaseWakeLock(){this._wakeLock?.release().catch(()=>{}),this._wakeLock=void 0}_syncPositionTimer(){const e=this._activePlayback(),t=!!e&&!e.local&&e.playing&&!1!==this._config?.show_now_playing&&!this._scrubbing;t&&void 0===this._positionTimer?this._positionTimer=window.setInterval(()=>this.requestUpdate(),1e3):t||this._stopPositionTimer()}_stopPositionTimer(){void 0!==this._positionTimer&&(window.clearInterval(this._positionTimer),this._positionTimer=void 0)}_activeSort(){return this._config?.show_sort_selector&&this._localSort?this._localSort:{sort:this._config?.sort??"manual",direction:this._config?.sort_direction??"asc"}}_pickSort(e){const t=this._activeSort(),i=t.sort===e?{sort:e,direction:"asc"===t.direction?"desc":"asc"}:{sort:e,direction:Re.includes(e)?"desc":"asc"};this._localSort=i;try{window.localStorage.setItem(this._sortStorageKey(),JSON.stringify(i))}catch{}}_sortedStories(e){const t=this._library;if(!t)return[];const{sort:i,direction:s}=this._activeSort(),r=t.stories.filter(t=>t.category_id===e.id),o=e=>t.stats[e];return r.sort((e,t)=>{let r=0;switch(i){case"alphabetical":r=e.title.localeCompare(t.title,void 0,{sensitivity:"base"});break;case"play_count":r=(o(e.id)?.play_count??0)-(o(t.id)?.play_count??0);break;case"last_played":r=(Date.parse(o(e.id)?.last_played??"")||0)-(Date.parse(o(t.id)?.last_played??"")||0);break;default:r=e.order-t.order}return 0===r&&(r=e.title.localeCompare(t.title,void 0,{sensitivity:"base"})),"desc"===s?-r:r}),r}_targetPlayer(){if("fixed"===this._config?.player_mode&&this._config.media_player)return this._config.media_player;const e=this._library;if(e?.select_entity&&this.hass?.states[e.select_entity]){const t=this.hass.states[e.select_entity].state;if(t&&"unknown"!==t&&"unavailable"!==t)return t}return e?.current_player??void 0}_playerName(e){if(!e)return;const t=this._library?.players.find(t=>t.entity_id===e);if(t)return t.name;const i=this.hass?.states[e];return i?.attributes.friendly_name??e}_cyclePlayer(){const e=this._library;if(!this.hass||!e?.select_entity||e.players.length<2)return;const t=this._targetPlayer(),i=e.players.findIndex(e=>e.entity_id===t),s=e.players[(i+1)%e.players.length];this.hass.callService("select","select_option",{entity_id:e.select_entity,option:s.entity_id})}_activePlayback(){const e=this._library;if(!e||!this.hass)return null;if(this._playHere){if(!this._localPlayingId)return null;const t=e.stories.find(e=>e.id===this._localPlayingId);if(!t)return null;const i=Number.isFinite(this._localDur)?this._localDur:0;return{story:t,local:!0,playing:!this._localPaused,position:this._localPos,duration:i>0?i:0,canSeek:i>0,canPause:!0}}const t=this._targetPlayer(),i=t?this.hass.states[t]:void 0;if(!i||"playing"!==i.state&&"paused"!==i.state)return null;const s=i.attributes.media_title;if(!s)return null;const r=e.stories.find(e=>e.title===s);if(!r)return null;const o=Number(i.attributes.media_duration)||0;let a=Number(i.attributes.media_position)||0;const n=i.attributes.media_position_updated_at;"playing"===i.state&&n&&(a+=(Date.now()-Date.parse(n))/1e3),o>0&&(a=Math.min(a,o));const c=Number(i.attributes.supported_features)||0;return{story:r,local:!1,playing:"playing"===i.state,position:Math.max(0,a),duration:o,canSeek:!!(2&c)&&o>0,canPause:!!(1&c)||!!(16384&c)}}_togglePlayPause(e){if(e.local){const e=this._audioEl;if(!e)return;return void(e.paused?e.play().catch(()=>{}):e.pause())}const t=this._targetPlayer();t&&this.hass&&this.hass.callService("media_player",e.playing?"media_pause":"media_play",{entity_id:t})}_onScrub(e){this._scrubbing=!0,this._scrubValue=Number(e.target.value)}_onSeek(e,t){const i=Number(e.target.value);if(this._scrubbing=!1,t.local)return this._audioEl&&(this._audioEl.currentTime=i),void(this._localPos=i);const s=this._targetPlayer();s&&this.hass&&this.hass.callService("media_player","media_seek",{entity_id:s,seek_position:i})}_fmtTime(e){const t=Number.isFinite(e)&&e>0?Math.floor(e):0;return`${Math.floor(t/60)}:${(t%60).toString().padStart(2,"0")}`}_flashError(e){this._error=e,window.setTimeout(()=>{this._error=void 0},4e3)}async _play(e){if(this.hass)if(this._playHere)await this._playLocal(e);else{this._justPlayed=e.id,window.setTimeout(()=>{this._justPlayed===e.id&&(this._justPlayed=null)},1600);try{await(t=this.hass,i=e.id,s="fixed"===this._config?.player_mode?this._config.media_player:void 0,r=this._config?.entry_id,t.callWS(we({type:`${$e}/play`,story_id:i,...s?{media_player:s}:{}},r)))}catch(e){this._justPlayed=null,this._flashError(e?.message??"play failed")}var t,i,s,r}}async _resolveMediaUrl(e){if(!this.hass)return null;if(!Pe(e))return e;try{const{url:t}=await xe(this.hass,e);return t}catch{return null}}async _playLocal(e){const t=this._audioEl;if(!t||!this.hass)return;if(this._localPlayingId===e.id&&!t.paused)return void this._stopLocal();this._justPlayed=e.id,window.setTimeout(()=>{this._justPlayed===e.id&&(this._justPlayed=null)},1600);const i=await this._resolveMediaUrl(e.media_content_id);if(!i)return this._justPlayed=null,void this._flashError(Ee(this.hass,"play_failed"));try{this._localPos=0,this._localDur=0,this._localPaused=!1,t.src=i,await t.play(),this._localPlayingId=e.id,(s=this.hass,r=e.id,o=Ee(this.hass,"this_device"),a=this._config?.entry_id,s.callWS(we({type:`${$e}/play`,story_id:r,record_only:!0,source:o},a))).catch(()=>{})}catch{this._justPlayed=null,this._localPlayingId=null}var s,r,o,a}_visibleCategories(){const e=this._library;if(!e)return[];const t=this._config?.categories??[];return e.categories.filter(e=>0===t.length||t.includes(e.id))}async _resolveCovers(e){if(!this.hass)return;const t={};await Promise.all(e.stories.map(async e=>{if(!Pe(e.image))return;const i=await ze(this.hass,e.image);i&&i!==this._covers[e.id]&&(t[e.id]=i)})),Object.keys(t).length&&(this._covers={...this._covers,...t})}_coverUrl(e){return e.image?Pe(e.image)?this._covers[e.id]??null:e.image:null}_statsLine(e){const t=this._library?.stats[e.id];if(!t||0===t.play_count)return Ee(this.hass,"played_never");const i=1===t.play_count?Ee(this.hass,"played_once"):Ee(this.hass,"played_times",{count:t.play_count});return t.last_played?`${i} · ${function(e,t){const i=e?.locale?.language??e?.language??"en",s=new Date(t).getTime();if(Number.isNaN(s))return t;const r=Math.round((s-Date.now())/1e3),o=new Intl.RelativeTimeFormat(i,{numeric:"auto"}),a=[["year",31536e3],["month",2592e3],["week",604800],["day",86400],["hour",3600],["minute",60]];for(const[e,t]of a)if(Math.abs(r)>=t)return o.format(Math.round(r/t),e);return o.format(0,"minute")}(this.hass,t.last_played)}`:i}render(){const e=this._config;if(!e)return W``;if(this._error&&!this._library)return W`<ha-card
        ><div class="empty">${Ee(this.hass,"not_configured")}</div>
      </ha-card>`;const t=this._visibleCategories(),i="list"===e.layout&&"compact"===e.density,s=this._activePlayback(),r=s?.story.id??null,o=s?.playing?s.story.id:null,a=this._targetPlayer(),n=!1!==e.show_player&&"fixed"!==e.player_mode&&(this._library?.players.length??0)>0;return W`
      <ha-card class=${ge({compact:i})}>
        <div class="header">
          ${e.title?W`<h1>${e.title}</h1>`:K}
          <div class="header-chips">
            ${!1!==e.show_device_toggle?W`<button
                  class=${ge({"player-chip":!0,"device-chip":!0,active:this._playHere})}
                  title=${Ee(this.hass,"this_device")}
                  @click=${this._togglePlayHere}
                >
                  <ha-icon icon="mdi:cellphone-play"></ha-icon>
                  <span>${Ee(this.hass,"this_device")}</span>
                </button>`:K}
            ${n&&!this._playHere?W`<button
                  class="player-chip"
                  title=${this._library?.select_entity??""}
                  @click=${this._cyclePlayer}
                >
                  <ha-icon icon="mdi:cast-audio"></ha-icon>
                  <span
                    >${this._playerName(a)??Ee(this.hass,"no_player")}</span
                  >
                </button>`:K}
          </div>
        </div>
        ${e.show_sort_selector?this._renderSortChips():K}
        ${!1!==e.show_now_playing&&s?this._renderNowPlaying(s):K}
        ${this._error?W`<div class="error">${this._error}</div>`:K}
        ${0===t.length?W`<div class="empty">
              <ha-icon icon="mdi:sleep"></ha-icon>
              ${Ee(this.hass,"empty")}
            </div>`:t.map(e=>this._renderCategory(e,r,o))}
        <audio
          @loadedmetadata=${this._onAudioMeta}
          @timeupdate=${this._onAudioTime}
          @play=${this._onAudioPlay}
          @pause=${this._onAudioPause}
          @ended=${this._onAudioEnded}
          @error=${this._onAudioError}
        ></audio>
      </ha-card>
    `}_renderSortChips(){const e=this._activeSort();return W`
      <div class="sort-chips">
        ${Ie.map(t=>W`
            <button
              class=${ge({chip:!0,active:e.sort===t})}
              @click=${()=>this._pickSort(t)}
            >
              ${Ee(this.hass,`sort_${t}`)}
              ${e.sort===t?W`<ha-icon
                    icon=${"asc"===e.direction?"mdi:arrow-up-thin":"mdi:arrow-down-thin"}
                  ></ha-icon>`:K}
            </button>
          `)}
      </div>
    `}_renderNowPlaying(e){const t=this._coverUrl(e.story),i=e.duration,s=this._scrubbing?this._scrubValue:e.position;return W`
      <div class="now-playing">
        <span
          class="np-cover"
          style=${be(t?{backgroundImage:`url("${t}")`}:{})}
        >
          ${t?K:W`<ha-icon icon="mdi:book-open-variant"></ha-icon>`}
        </span>
        <div class="np-main">
          <span class="np-title">${e.story.title}</span>
          <div class="np-seek">
            <span class="np-time">${this._fmtTime(s)}</span>
            ${i>0?W`<input
                  class="np-range"
                  type="range"
                  min="0"
                  max=${String(Math.ceil(i))}
                  step="1"
                  .value=${String(Math.floor(s))}
                  ?disabled=${!e.canSeek}
                  aria-label=${Ee(this.hass,"now_playing")}
                  @input=${e=>this._onScrub(e)}
                  @change=${t=>this._onSeek(t,e)}
                />`:W`<span class="np-track"></span>`}
            <span class="np-time"
              >${i>0?this._fmtTime(i):"–:–"}</span
            >
          </div>
        </div>
        <button
          class="np-btn"
          ?disabled=${!e.canPause}
          title=${Ee(this.hass,e.playing?"pause":"resume")}
          @click=${()=>this._togglePlayPause(e)}
        >
          <ha-icon
            icon=${e.playing?"mdi:pause":"mdi:play"}
          ></ha-icon>
        </button>
      </div>
    `}_renderCategory(e,t,i){const s=this._sortedStories(e);if(0===s.length)return W``;const r=this._config,o="list"!==r.layout,a=r.columns??0,n=o&&a>0?{gridTemplateColumns:`repeat(${a}, 1fr)`}:{};return W`
      <div class="category">
        <div class="category-header">
          <ha-icon icon=${e.icon||"mdi:teddy-bear"}></ha-icon>
          <span>${e.name}</span>
        </div>
        <div
          class=${ge({tiles:o,rows:!o})}
          style=${be(n)}
        >
          ${s.map(e=>o?this._renderTile(e,t,i):this._renderRow(e,t,i))}
        </div>
      </div>
    `}_renderTile(e,t,i){const s=this._config,r=t===e.id,o=i===e.id,a=this._justPlayed===e.id,n=this._coverUrl(e);return W`
      <button
        class=${ge({tile:!0,playing:r})}
        style=${be(n?{backgroundImage:`url("${n}")`}:{})}
        aria-label=${e.title}
        @click=${()=>this._play(e)}
      >
        ${n?K:W`<ha-icon class="fallback" icon="mdi:book-open-variant"></ha-icon>`}
        ${s.show_duration&&e.duration_min?W`<span class="badge">~${e.duration_min}m</span>`:K}
        ${o?W`<span class="equalizer" aria-hidden="true"
              ><i></i><i></i><i></i
            ></span>`:K}
        ${a?W`<span class="pop" aria-hidden="true">
              <ha-icon icon="mdi:play-circle"></ha-icon>
            </span>`:K}
        <span class="tile-footer">
          ${!1!==s.show_titles?W`<span class="tile-title">${e.title}</span>`:K}
          ${s.show_stats?W`<span class="tile-stats">${this._statsLine(e)}</span>`:K}
        </span>
      </button>
    `}_renderRow(e,t,i){const s=this._config,r=t===e.id,o=i===e.id,a=this._justPlayed===e.id,n=this._coverUrl(e);return W`
      <button
        class=${ge({row:!0,playing:r})}
        aria-label=${e.title}
        @click=${()=>this._play(e)}
      >
        <span
          class="thumb"
          style=${be(n?{backgroundImage:`url("${n}")`}:{})}
        >
          ${n?K:W`<ha-icon icon="mdi:book-open-variant"></ha-icon>`}
          ${o?W`<span class="equalizer" aria-hidden="true"
                ><i></i><i></i><i></i
              ></span>`:K}
        </span>
        <span class="row-main">
          <span class="row-title">${e.title}</span>
          ${s.show_stats?W`<span class="row-stats">${this._statsLine(e)}</span>`:K}
        </span>
        ${s.show_duration&&e.duration_min?W`<span class="row-duration">~${e.duration_min}m</span>`:K}
        <ha-icon
          class="row-play"
          icon=${a||o?"mdi:volume-high":"mdi:play-circle"}
        ></ha-icon>
      </button>
    `}static{this.styles=a`
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
    /* --- now playing bar --- */
    .now-playing {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 12px 0 4px;
      padding: 8px 10px;
      border-radius: 14px;
      background: var(--secondary-background-color);
    }
    .np-cover {
      width: 44px;
      height: 44px;
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
    .np-cover ha-icon {
      --mdc-icon-size: 22px;
    }
    .np-main {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
      gap: 4px;
    }
    .np-title {
      color: var(--primary-text-color);
      font-size: 0.95rem;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .np-seek {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .np-time {
      color: var(--secondary-text-color);
      font-size: 0.72rem;
      font-variant-numeric: tabular-nums;
      flex-shrink: 0;
      min-width: 30px;
    }
    .np-time:last-child {
      text-align: right;
    }
    .np-range {
      flex: 1;
      min-width: 0;
      height: 4px;
      margin: 0;
      cursor: pointer;
      accent-color: var(--primary-color);
    }
    .np-range:disabled {
      cursor: default;
      opacity: 0.7;
    }
    .np-track {
      flex: 1;
      min-width: 0;
      height: 4px;
      border-radius: 2px;
      background: var(--divider-color);
    }
    .np-btn {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border: none;
      border-radius: 50%;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: transform 0.15s ease;
    }
    .np-btn:active {
      transform: scale(0.92);
    }
    .np-btn:disabled {
      background: var(--divider-color);
      color: var(--secondary-text-color);
      cursor: default;
    }
    .np-btn ha-icon {
      --mdc-icon-size: 26px;
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
  `}};e([pe({attribute:!1})],Ue.prototype,"hass",void 0),e([_e()],Ue.prototype,"_config",void 0),e([_e()],Ue.prototype,"_library",void 0),e([_e()],Ue.prototype,"_covers",void 0),e([_e()],Ue.prototype,"_error",void 0),e([_e()],Ue.prototype,"_justPlayed",void 0),e([_e()],Ue.prototype,"_localSort",void 0),e([_e()],Ue.prototype,"_playHere",void 0),e([_e()],Ue.prototype,"_localPlayingId",void 0),e([_e()],Ue.prototype,"_localPaused",void 0),e([_e()],Ue.prototype,"_localPos",void 0),e([_e()],Ue.prototype,"_localDur",void 0),e([_e()],Ue.prototype,"_scrubbing",void 0),e([_e()],Ue.prototype,"_scrubValue",void 0),e([function(e){return(t,i,s)=>((e,t,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,i),i))(t,i,{get(){return(t=>t.renderRoot?.querySelector(e)??null)(this)}})}("audio")],Ue.prototype,"_audioEl",void 0),Ue=e([le("bedtime-stories-card")],Ue),window.customCards=window.customCards??[],window.customCards.push({type:"bedtime-stories-card",name:"Bedtime Stories Card",description:"Kid-friendly story tiles with categories, play statistics and a switchable playback target.",preview:!0,documentationURL:"https://github.com/florianbaethge/bedtime_stories"}),console.info("%c BEDTIME-STORIES-CARD %c 0.3.0 ","color: #fff; background: #5c6bc0; font-weight: 700;","color: #5c6bc0; background: #fff; font-weight: 700;");export{Ue as BedtimeStoriesCard};
//# sourceMappingURL=bedtime-stories-card.js.map
