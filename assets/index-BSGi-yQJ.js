import{g as gc}from"./index-DI8hGBIA.js";function xc(n,e){for(var t=0;t<e.length;t++){const s=e[t];if(typeof s!="string"&&!Array.isArray(s)){for(const o in s)if(o!=="default"&&!(o in n)){const r=Object.getOwnPropertyDescriptor(s,o);r&&Object.defineProperty(n,o,r.get?r:{enumerable:!0,get:()=>s[o]})}}}return Object.freeze(Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}))}const Cc=1e-7,bc=1e-4;class wc{constructor(e,t){this.backend=e,this.dataMover=t,this.data=new WeakMap,this.dataIdsCount=0}get(e){return this.data.has(e)||this.dataMover.moveData(this.backend,e),this.data.get(e)}set(e,t){this.dataIdsCount++,this.data.set(e,t)}has(e){return this.data.has(e)}delete(e){return this.dataIdsCount--,this.data.delete(e)}numDataIds(){return this.dataIdsCount}}class dr{refCount(e){return xe("refCount")}incRef(e){return xe("incRef")}timerAvailable(){return!0}time(e){return xe("time")}read(e){return xe("read")}readSync(e){return xe("readSync")}readToGPU(e,t){return xe("readToGPU")}numDataIds(){return xe("numDataIds")}disposeData(e,t){return xe("disposeData")}write(e,t,s){return xe("write")}move(e,t,s,o,r){return xe("move")}createTensorFromGPUData(e,t,s){return xe("createTensorFromGPUData")}memory(){return xe("memory")}floatPrecision(){return xe("floatPrecision")}epsilon(){return this.floatPrecision()===32?Cc:bc}dispose(){return xe("dispose")}}function xe(n){throw new Error(`'${n}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}function Ds(n){return n%2===0?n:n+1}function Kt(n,e,t){const s=n[e];n[e]=n[t],n[t]=s}function yc(n){let e=0;for(let t=0;t<n.length;t++)e+=n[t];return e}function D(n,e){if(!n)throw new Error(typeof e=="string"?e:e())}function hr(n,e,t=""){D(oe(n,e),()=>t+` Shapes ${n} and ${e} must match`)}function F(n){if(n.length===0)return 1;let e=n[0];for(let t=1;t<n.length;t++)e*=n[t];return e}function oe(n,e){if(n===e)return!0;if(n==null||e==null||n.length!==e.length)return!1;for(let t=0;t<n.length;t++)if(n[t]!==e[t])return!1;return!0}function fr(n){return n%1===0}function as(n){const e=Math.ceil(Math.sqrt(n));return[e,Math.ceil(n/e)]}function Nt(n,e){return e<=n.length?n:n+" ".repeat(e-n.length)}function po(n,e=o=>0,t,s){return new Promise((o,r)=>{let i=0;const a=()=>{if(n()){o();return}i++;const c=e(i);if(t!=null&&i>=t){r();return}s!=null?s(a,c):setTimeout(a,c)};a()})}function vc(n,e){let t=1,s=-1;for(let r=0;r<n.length;++r)if(n[r]>=0)t*=n[r];else if(n[r]===-1){if(s!==-1)throw Error(`Shapes can only have 1 implicit size. Found -1 at dim ${s} and dim ${r}`);s=r}else if(n[r]<0)throw Error(`Shapes can not be < 0. Found ${n[r]} at dim ${r}`);if(s===-1){if(e>0&&e!==t)throw Error(`Size(${e}) must match the product of shape ${n}`);return n}if(t===0)throw Error(`Cannot infer the missing size in [${n}] when there are 0 elements`);if(e%t!==0)throw Error(`The implicit shape can't be a fractional number. Got ${e} / ${t}`);const o=n.slice();return o[s]=e/t,o}function ge(n,e){const t=e.length;return n=n==null?e.map((s,o)=>o):[].concat(n),D(n.every(s=>s>=-t&&s<t),()=>`All values in axis param must be in range [-${t}, ${t}) but got axis ${n}`),D(n.every(s=>fr(s)),()=>`All values in axis param must be integers but got axis ${n}`),n.map(s=>s<0?t+s:s)}function xt(n,e){const t=[],s=[];for(let o=0;o<n.length;++o)n[o]!==1&&(t.push(n[o]),s.push(o));return{newShape:t,keptDims:s}}function ct(n,e){return ee(n,e)}function ee(n,e){let t=null;if(n==null||n==="float32")t=new Float32Array(e);else if(n==="int32")t=new Int32Array(e);else if(n==="bool")t=new Uint8Array(e);else if(n==="string")t=new Array(e);else throw new Error(`Unknown data type ${n}`);return t}function $c(n,e){for(let t=0;t<n.length;t++){const s=n[t];if(isNaN(s)||!isFinite(s))throw Error(`A tensor of type ${e} being uploaded contains ${s}.`)}}function Sc(n){return n==="bool"||n==="complex64"||n==="float32"||n==="int32"||n==="string"}function Ic(n,e){return!(e==="complex64"||e==="float32"&&n!=="complex64"||e==="int32"&&n!=="float32"&&n!=="complex64"||e==="bool"&&n==="bool")}function An(n){if(n==="float32"||n==="int32")return 4;if(n==="complex64")return 8;if(n==="bool")return 1;throw new Error(`Unknown dtype ${n}`)}function Rc(n){if(n==null)return 0;let e=0;return n.forEach(t=>e+=t.length),e}function Un(n){return typeof n=="string"||n instanceof String}function Tc(n){return typeof n=="boolean"}function Ec(n){return typeof n=="number"}function dn(n){return Array.isArray(n)?dn(n[0]):n instanceof Float32Array?"float32":n instanceof Int32Array||n instanceof Uint8Array||n instanceof Uint8ClampedArray?"int32":Ec(n)?"float32":Un(n)?"string":Tc(n)?"bool":"float32"}function cs(n){return!!(n&&n.constructor&&n.call&&n.apply)}function ls(n,e){for(let t=e;t<n;++t)if(n%t===0)return t;return n}function se(n){const e=n.length;if(e<2)return[];const t=new Array(e-1);t[e-2]=n[e-1];for(let s=e-3;s>=0;--s)t[s]=t[s+1]*n[s+1];return t}function pr(n,e,t,s=!1){const o=new Array;if(e.length===1){const r=e[0]*(s?2:1);for(let i=0;i<r;i++)o[i]=t[n+i]}else{const r=e[0],i=e.slice(1),a=i.reduce((c,l)=>c*l)*(s?2:1);for(let c=0;c<r;c++)o[c]=pr(n+c*a,i,t,s)}return o}function mo(n,e,t=!1){if(n.length===0)return e[0];const s=n.reduce((o,r)=>o*r)*(t?2:1);if(s===0)return[];if(s!==e.length)throw new Error(`[${n}] does not match the input size ${e.length}${t?" for a complex tensor":""}.`);return pr(0,n,e,t)}function Nc(n,e){const t=Qe(n,e);for(let s=0;s<t.length;s++)t[s]=1;return t}function Qe(n,e){if(e==null||e==="float32"||e==="complex64")return new Float32Array(n);if(e==="int32")return new Int32Array(n);if(e==="bool")return new Uint8Array(n);throw new Error(`Unknown data type ${e}`)}function hn(n){n.forEach(e=>{D(Number.isInteger(e)&&e>=0,()=>`Tensor must have a shape comprised of positive integers but got shape [${n}].`)})}function us(n,e,t){if(e===0)return 0;if(e===1)return n[0];let s=n[n.length-1];for(let o=0;o<n.length-1;++o)s+=t[o]*n[o];return s}function Os(n,e,t){if(e===0)return[];if(e===1)return[n];const s=new Array(e);for(let o=0;o<s.length-1;++o)s[o]=Math.floor(n/t[o]),n-=s[o]*t[o];return s[s.length-1]=n,s}function Ps(n){return n&&n.then&&typeof n.then=="function"}const go="tfjsflags";class kc{constructor(e){this.global=e,this.flags={},this.flagRegistry={},this.urlFlags={},this.getQueryParams=Ac,this.populateURLFlags()}setPlatform(e,t){this.platform!=null&&(v().getBool("IS_TEST")||v().getBool("PROD")||console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${e}.`)),this.platformName=e,this.platform=t}registerFlag(e,t,s){if(this.flagRegistry[e]={evaluationFn:t,setHook:s},this.urlFlags[e]!=null){const o=this.urlFlags[e];v().getBool("IS_TEST")||v().getBool("PROD")||console.warn(`Setting feature override from URL ${e}: ${o}.`),this.set(e,o)}}async getAsync(e){return e in this.flags?this.flags[e]:(this.flags[e]=await this.evaluateFlag(e),this.flags[e])}get(e){if(e in this.flags)return this.flags[e];const t=this.evaluateFlag(e);if(Ps(t))throw new Error(`Flag ${e} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[e]=t,this.flags[e]}getNumber(e){return this.get(e)}getBool(e){return this.get(e)}getString(e){return this.get(e)}getFlags(){return this.flags}get features(){return this.flags}set(e,t){if(this.flagRegistry[e]==null)throw new Error(`Cannot set flag ${e} as it has not been registered.`);this.flags[e]=t,this.flagRegistry[e].setHook!=null&&this.flagRegistry[e].setHook(t)}evaluateFlag(e){if(this.flagRegistry[e]==null)throw new Error(`Cannot evaluate flag '${e}': no evaluation function found.`);return this.flagRegistry[e].evaluationFn()}setFlags(e){this.flags=Object.assign({},e)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(typeof this.global>"u"||typeof this.global.location>"u"||typeof this.global.location.search>"u")return;const e=this.getQueryParams(this.global.location.search);go in e&&e[go].split(",").forEach(s=>{const[o,r]=s.split(":");this.urlFlags[o]=Dc(o,r)})}}function Ac(n){const e={};return n.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,(t,...s)=>(Fc(e,s[0],s[1]),s.join("="))),e}function Fc(n,e,t){n[decodeURIComponent(e)]=decodeURIComponent(t||"")}function Dc(n,e){const t=e.toLowerCase();return t==="true"||t==="false"?t==="true":`${+t}`===t?+t:e}function v(){return mr}let mr=null;function Oc(n){mr=n}let Jn;function gr(){if(Jn==null){let n;if(typeof window<"u")n=window;else if(typeof global<"u")n=global;else if(typeof process<"u")n=process;else if(typeof self<"u")n=self;else throw new Error("Could not find a global object");Jn=n}return Jn}function Pc(){const n=gr();return n._tfGlobals==null&&(n._tfGlobals=new Map),n._tfGlobals}function _s(n,e){const t=Pc();if(t.has(n))return t.get(n);{const s=e();return t.set(n,s),t.get(n)}}const xr="Abs",_c="Acos",Lc="Acosh",Ls="Add",Bc="AddN",Mc="All",Vc="Any",Uc="ArgMax",Wc="ArgMin",Gc="Asin",zc="Asinh",Hc="Atan",Xc="Atanh",jc="Atan2",qc="AvgPool",Kc="AvgPoolGrad",Yc="AvgPool3D",Qc="AvgPool3DGrad",Zc="BatchMatMul",Jc="BatchToSpaceND",el="Bincount",tl="BitwiseAnd",nl="BroadcastArgs",Bs="Cast",sl="Ceil",ol="ClipByValue",Cr="Complex",br="ComplexAbs",rl="Concat",il="Conv2D",al="Conv2DBackpropFilter",cl="Conv2DBackpropInput",ll="Conv3D",ul="Conv3DBackpropFilterV2",dl="Conv3DBackpropInputV2",hl="Cos",fl="Cosh",pl="Cumprod",ml="Cumsum",gl="CropAndResize",xl="DenseBincount",Cl="DepthToSpace",bl="DepthwiseConv2dNative",wl="DepthwiseConv2dNativeBackpropFilter",yl="DepthwiseConv2dNativeBackpropInput",vl="Diag",$l="Dilation2D",wr="RealDiv",Sl="Einsum",Il="Elu",Rl="EluGrad",Tl="Erf",El="Equal",Nl="Exp",kl="ExpandDims",Al="Expm1",Fl="FFT",yr="Fill",Dl="FlipLeftRight",Ol="Floor",vr="FloorDiv",Pl="FusedBatchNorm",_l="GatherV2",Ll="GatherNd",Bl="Greater",Ml="GreaterEqual",Ms="Identity",Vl="IFFT",Ul="Imag",Wl="IsFinite",Gl="IsInf",zl="IsNan",Hl="LeakyRelu",Xl="Less",jl="LessEqual",ql="LinSpace",Kl="Log",Yl="Log1p",Ql="LogicalAnd",Zl="LogicalNot",Jl="LogicalOr",eu="LRN",tu="LRNGrad",nu="Max",$r="Maximum",su="MaxPool",ou="MaxPoolGrad",ru="MaxPool3D",iu="MaxPool3DGrad",au="MaxPoolWithArgmax",cu="Mean",lu="Min",uu="Minimum",du="MirrorPad",hu="Mod",fu="Multinomial",Sr="Multiply",pu="Neg",mu="NotEqual",gu="NonMaxSuppressionV3",xu="NonMaxSuppressionV4",Cu="NonMaxSuppressionV5",bu="OnesLike",wu="OneHot",yu="Pack",vu="PadV2",Ir="Pow",$u="Prelu",Su="Prod",Iu="RaggedGather",Ru="RaggedRange",Tu="RaggedTensorToTensor",Eu="Range",Nu="Real",ku="Reciprocal",Au="Relu",Rr="Reshape",Fu="ResizeNearestNeighbor",Du="ResizeNearestNeighborGrad",Ou="ResizeBilinear",Pu="ResizeBilinearGrad",_u="Relu6",Lu="Reverse",Bu="Round",Mu="Rsqrt",Vu="ScatterNd",Uu="TensorScatterUpdate",Wu="SearchSorted",Gu="Select",zu="Selu",Hu="Slice",Xu="Sin",ju="Sinh",qu="Sign",Ku="Sigmoid",Yu="Softplus",Tr="Sqrt",Qu="Sum",Zu="SpaceToBatchND",Ju="SplitV",ed="Softmax",td="SparseFillEmptyRows",nd="SparseReshape",sd="SparseSegmentMean",od="SparseSegmentSum",rd="SparseToDense",id="SquaredDifference",ad="Square",cd="StaticRegexReplace",ld="StridedSlice",ud="StringNGrams",dd="StringSplit",hd="StringToHashBucketFast",Er="Sub",fd="Tan",pd="Tanh",Nr="Tile",md="TopK",gd="Transform",xd="Transpose",Cd="Unique",bd="Unpack",wd="UnsortedSegmentSum",kr="ZerosLike",yd="Step",vd="FromPixels",$d="RotateWithOffset",Sd="_FusedMatMul",Id="FusedConv2D",Rd="FusedDepthwiseConv2D";function Fe(...n){v().getBool("IS_TEST")||v().getBool("PROD")||console.warn(...n)}const Fn=_s("kernelRegistry",()=>new Map),Td=_s("gradRegistry",()=>new Map);function xo(n,e){const t=Ar(n,e);return Fn.get(t)}function Co(n){return Td.get(n)}function bo(n){const e=Fn.entries(),t=[];for(;;){const{done:s,value:o}=e.next();if(s)break;const[r,i]=o,[a]=r.split("_");a===n&&t.push(i)}return t}function Ed(n){const{kernelName:e,backendName:t}=n,s=Ar(e,t);Fn.has(s)&&Fe(`The kernel '${e}' for backend '${t}' is already registered`),Fn.set(s,n)}function Ar(n,e){return`${e}_${n}`}function Fr(n){return n instanceof Float32Array||n instanceof Int32Array||n instanceof Uint8Array||n instanceof Uint8ClampedArray}var es,wo;function Nd(){if(wo)return es;wo=1,es=e;var n=null;try{n=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}function e($,b,T){this.low=$|0,this.high=b|0,this.unsigned=!!T}e.prototype.__isLong__,Object.defineProperty(e.prototype,"__isLong__",{value:!0});function t($){return($&&$.__isLong__)===!0}e.isLong=t;var s={},o={};function r($,b){var T,P,B;return b?($>>>=0,(B=0<=$&&$<256)&&(P=o[$],P)?P:(T=a($,($|0)<0?-1:0,!0),B&&(o[$]=T),T)):($|=0,(B=-128<=$&&$<128)&&(P=s[$],P)?P:(T=a($,$<0?-1:0,!1),B&&(s[$]=T),T))}e.fromInt=r;function i($,b){if(isNaN($))return b?C:m;if(b){if($<0)return C;if($>=p)return E}else{if($<=-x)return R;if($+1>=x)return N}return $<0?i(-$,b).neg():a($%f|0,$/f|0,b)}e.fromNumber=i;function a($,b,T){return new e($,b,T)}e.fromBits=a;var c=Math.pow;function l($,b,T){if($.length===0)throw Error("empty string");if($==="NaN"||$==="Infinity"||$==="+Infinity"||$==="-Infinity")return m;if(typeof b=="number"?(T=b,b=!1):b=!!b,T=T||10,T<2||36<T)throw RangeError("radix");var P;if((P=$.indexOf("-"))>0)throw Error("interior hyphen");if(P===0)return l($.substring(1),b,T).neg();for(var B=i(c(T,8)),L=m,U=0;U<$.length;U+=8){var j=Math.min(8,$.length-U),W=parseInt($.substring(U,U+j),T);if(j<8){var q=i(c(T,j));L=L.mul(q).add(i(W))}else L=L.mul(B),L=L.add(i(W))}return L.unsigned=b,L}e.fromString=l;function u($,b){return typeof $=="number"?i($,b):typeof $=="string"?l($,b):a($.low,$.high,typeof b=="boolean"?b:$.unsigned)}e.fromValue=u;var d=65536,h=1<<24,f=d*d,p=f*f,x=p/2,g=r(h),m=r(0);e.ZERO=m;var C=r(0,!0);e.UZERO=C;var w=r(1);e.ONE=w;var y=r(1,!0);e.UONE=y;var I=r(-1);e.NEG_ONE=I;var N=a(-1,2147483647,!1);e.MAX_VALUE=N;var E=a(-1,-1,!0);e.MAX_UNSIGNED_VALUE=E;var R=a(0,-2147483648,!1);e.MIN_VALUE=R;var S=e.prototype;return S.toInt=function(){return this.unsigned?this.low>>>0:this.low},S.toNumber=function(){return this.unsigned?(this.high>>>0)*f+(this.low>>>0):this.high*f+(this.low>>>0)},S.toString=function(b){if(b=b||10,b<2||36<b)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative())if(this.eq(R)){var T=i(b),P=this.div(T),B=P.mul(T).sub(this);return P.toString(b)+B.toInt().toString(b)}else return"-"+this.neg().toString(b);for(var L=i(c(b,6),this.unsigned),U=this,j="";;){var W=U.div(L),q=U.sub(W.mul(L)).toInt()>>>0,H=q.toString(b);if(U=W,U.isZero())return H+j;for(;H.length<6;)H="0"+H;j=""+H+j}},S.getHighBits=function(){return this.high},S.getHighBitsUnsigned=function(){return this.high>>>0},S.getLowBits=function(){return this.low},S.getLowBitsUnsigned=function(){return this.low>>>0},S.getNumBitsAbs=function(){if(this.isNegative())return this.eq(R)?64:this.neg().getNumBitsAbs();for(var b=this.high!=0?this.high:this.low,T=31;T>0&&(b&1<<T)==0;T--);return this.high!=0?T+33:T+1},S.isZero=function(){return this.high===0&&this.low===0},S.eqz=S.isZero,S.isNegative=function(){return!this.unsigned&&this.high<0},S.isPositive=function(){return this.unsigned||this.high>=0},S.isOdd=function(){return(this.low&1)===1},S.isEven=function(){return(this.low&1)===0},S.equals=function(b){return t(b)||(b=u(b)),this.unsigned!==b.unsigned&&this.high>>>31===1&&b.high>>>31===1?!1:this.high===b.high&&this.low===b.low},S.eq=S.equals,S.notEquals=function(b){return!this.eq(b)},S.neq=S.notEquals,S.ne=S.notEquals,S.lessThan=function(b){return this.comp(b)<0},S.lt=S.lessThan,S.lessThanOrEqual=function(b){return this.comp(b)<=0},S.lte=S.lessThanOrEqual,S.le=S.lessThanOrEqual,S.greaterThan=function(b){return this.comp(b)>0},S.gt=S.greaterThan,S.greaterThanOrEqual=function(b){return this.comp(b)>=0},S.gte=S.greaterThanOrEqual,S.ge=S.greaterThanOrEqual,S.compare=function(b){if(t(b)||(b=u(b)),this.eq(b))return 0;var T=this.isNegative(),P=b.isNegative();return T&&!P?-1:!T&&P?1:this.unsigned?b.high>>>0>this.high>>>0||b.high===this.high&&b.low>>>0>this.low>>>0?-1:1:this.sub(b).isNegative()?-1:1},S.comp=S.compare,S.negate=function(){return!this.unsigned&&this.eq(R)?R:this.not().add(w)},S.neg=S.negate,S.add=function(b){t(b)||(b=u(b));var T=this.high>>>16,P=this.high&65535,B=this.low>>>16,L=this.low&65535,U=b.high>>>16,j=b.high&65535,W=b.low>>>16,q=b.low&65535,H=0,Z=0,Y=0,ae=0;return ae+=L+q,Y+=ae>>>16,ae&=65535,Y+=B+W,Z+=Y>>>16,Y&=65535,Z+=P+j,H+=Z>>>16,Z&=65535,H+=T+U,H&=65535,a(Y<<16|ae,H<<16|Z,this.unsigned)},S.subtract=function(b){return t(b)||(b=u(b)),this.add(b.neg())},S.sub=S.subtract,S.multiply=function(b){if(this.isZero())return m;if(t(b)||(b=u(b)),n){var T=n.mul(this.low,this.high,b.low,b.high);return a(T,n.get_high(),this.unsigned)}if(b.isZero())return m;if(this.eq(R))return b.isOdd()?R:m;if(b.eq(R))return this.isOdd()?R:m;if(this.isNegative())return b.isNegative()?this.neg().mul(b.neg()):this.neg().mul(b).neg();if(b.isNegative())return this.mul(b.neg()).neg();if(this.lt(g)&&b.lt(g))return i(this.toNumber()*b.toNumber(),this.unsigned);var P=this.high>>>16,B=this.high&65535,L=this.low>>>16,U=this.low&65535,j=b.high>>>16,W=b.high&65535,q=b.low>>>16,H=b.low&65535,Z=0,Y=0,ae=0,It=0;return It+=U*H,ae+=It>>>16,It&=65535,ae+=L*H,Y+=ae>>>16,ae&=65535,ae+=U*q,Y+=ae>>>16,ae&=65535,Y+=B*H,Z+=Y>>>16,Y&=65535,Y+=L*q,Z+=Y>>>16,Y&=65535,Y+=U*W,Z+=Y>>>16,Y&=65535,Z+=P*H+B*q+L*W+U*j,Z&=65535,a(ae<<16|It,Z<<16|Y,this.unsigned)},S.mul=S.multiply,S.divide=function(b){if(t(b)||(b=u(b)),b.isZero())throw Error("division by zero");if(n){if(!this.unsigned&&this.high===-2147483648&&b.low===-1&&b.high===-1)return this;var T=(this.unsigned?n.div_u:n.div_s)(this.low,this.high,b.low,b.high);return a(T,n.get_high(),this.unsigned)}if(this.isZero())return this.unsigned?C:m;var P,B,L;if(this.unsigned){if(b.unsigned||(b=b.toUnsigned()),b.gt(this))return C;if(b.gt(this.shru(1)))return y;L=C}else{if(this.eq(R)){if(b.eq(w)||b.eq(I))return R;if(b.eq(R))return w;var U=this.shr(1);return P=U.div(b).shl(1),P.eq(m)?b.isNegative()?w:I:(B=this.sub(b.mul(P)),L=P.add(B.div(b)),L)}else if(b.eq(R))return this.unsigned?C:m;if(this.isNegative())return b.isNegative()?this.neg().div(b.neg()):this.neg().div(b).neg();if(b.isNegative())return this.div(b.neg()).neg();L=m}for(B=this;B.gte(b);){P=Math.max(1,Math.floor(B.toNumber()/b.toNumber()));for(var j=Math.ceil(Math.log(P)/Math.LN2),W=j<=48?1:c(2,j-48),q=i(P),H=q.mul(b);H.isNegative()||H.gt(B);)P-=W,q=i(P,this.unsigned),H=q.mul(b);q.isZero()&&(q=w),L=L.add(q),B=B.sub(H)}return L},S.div=S.divide,S.modulo=function(b){if(t(b)||(b=u(b)),n){var T=(this.unsigned?n.rem_u:n.rem_s)(this.low,this.high,b.low,b.high);return a(T,n.get_high(),this.unsigned)}return this.sub(this.div(b).mul(b))},S.mod=S.modulo,S.rem=S.modulo,S.not=function(){return a(~this.low,~this.high,this.unsigned)},S.and=function(b){return t(b)||(b=u(b)),a(this.low&b.low,this.high&b.high,this.unsigned)},S.or=function(b){return t(b)||(b=u(b)),a(this.low|b.low,this.high|b.high,this.unsigned)},S.xor=function(b){return t(b)||(b=u(b)),a(this.low^b.low,this.high^b.high,this.unsigned)},S.shiftLeft=function(b){return t(b)&&(b=b.toInt()),(b&=63)===0?this:b<32?a(this.low<<b,this.high<<b|this.low>>>32-b,this.unsigned):a(0,this.low<<b-32,this.unsigned)},S.shl=S.shiftLeft,S.shiftRight=function(b){return t(b)&&(b=b.toInt()),(b&=63)===0?this:b<32?a(this.low>>>b|this.high<<32-b,this.high>>b,this.unsigned):a(this.high>>b-32,this.high>=0?0:-1,this.unsigned)},S.shr=S.shiftRight,S.shiftRightUnsigned=function(b){if(t(b)&&(b=b.toInt()),b&=63,b===0)return this;var T=this.high;if(b<32){var P=this.low;return a(P>>>b|T<<32-b,T>>>b,this.unsigned)}else return b===32?a(T,0,this.unsigned):a(T>>>b-32,0,this.unsigned)},S.shru=S.shiftRightUnsigned,S.shr_u=S.shiftRightUnsigned,S.toSigned=function(){return this.unsigned?a(this.low,this.high,!1):this},S.toUnsigned=function(){return this.unsigned?this:a(this.low,this.high,!0)},S.toBytes=function(b){return b?this.toBytesLE():this.toBytesBE()},S.toBytesLE=function(){var b=this.high,T=this.low;return[T&255,T>>>8&255,T>>>16&255,T>>>24,b&255,b>>>8&255,b>>>16&255,b>>>24]},S.toBytesBE=function(){var b=this.high,T=this.low;return[b>>>24,b>>>16&255,b>>>8&255,b&255,T>>>24,T>>>16&255,T>>>8&255,T&255]},e.fromBytes=function(b,T,P){return P?e.fromBytesLE(b,T):e.fromBytesBE(b,T)},e.fromBytesLE=function(b,T){return new e(b[0]|b[1]<<8|b[2]<<16|b[3]<<24,b[4]|b[5]<<8|b[6]<<16|b[7]<<24,T)},e.fromBytesBE=function(b,T){return new e(b[4]<<24|b[5]<<16|b[6]<<8|b[7],b[0]<<24|b[1]<<16|b[2]<<8|b[3],T)},es}var Dr=Nd();const Or=gc(Dr),kd=xc({__proto__:null,default:Or},[Dr]);const nt=Or||kd;function Wn(n){return nt.fromString(n,!0,16)}const Pr=Wn("c3a5c85c97cb3127"),tt=Wn("b492b66fbe98f273"),le=Wn("9ae16a3b2f90404f");function ds(n){return n.xor(n.shru(47))}function _r(n,e,t){const s=n.slice(e,e+t);return nt.fromBytes(Array.from(s),!0,!0)}function X(n,e){return _r(n,e,8)}function yo(n,e){return _r(n,e,4)}function J(n,e){return e===0?n:n.shru(e).or(n.shl(64-e))}function Ye(n,e,t=Wn("9ddfea08eb382d69")){let s=n.xor(e).mul(t);s=s.xor(s.shru(47));let o=e.xor(s).mul(t);return o=o.xor(o.shru(47)),o=o.mul(t),o}function Ad(n,e,t,s,o,r){o=o.add(n),r=J(r.add(o).add(s),21);const i=o;return o=o.add(e),o=o.add(t),r=r.add(J(o,44)),[o.add(s),r.add(i)]}function bn(n,e,t,s){return Ad(X(n,e),X(n,e+8),X(n,e+16),X(n,e+24),t,s)}function Fd(n,e=n.length){if(e>=8){const t=le.add(e*2),s=X(n,0).add(le),o=X(n,e-8),r=J(o,37).mul(t).add(s),i=J(s,25).add(o).mul(t);return Ye(r,i,t)}if(e>=4){const t=le.add(e*2),s=yo(n,0);return Ye(s.shl(3).add(e),yo(n,e-4),t)}if(e>0){const t=n[0],s=n[e>>1],o=n[e-1],r=t+(s<<8),i=e+(o<<2);return ds(le.mul(r).xor(Pr.mul(i))).mul(le)}return le}function Dd(n,e=n.length){const t=le.add(e*2),s=X(n,0).mul(tt),o=X(n,8),r=X(n,e-8).mul(t),i=X(n,e-16).mul(le);return Ye(J(s.add(o),43).add(J(r,30)).add(i),s.add(J(o.add(le),18)).add(r),t)}function Od(n,e=n.length){const t=le.add(e*2),s=X(n,0).mul(le),o=X(n,8),r=X(n,e-8).mul(t),i=X(n,e-16).mul(le),a=J(s.add(o),43).add(J(r,30)).add(i),c=Ye(a,s.add(J(o.add(le),18)).add(r),t),l=X(n,16).mul(t),u=X(n,24),d=a.add(X(n,e-32)).mul(t),h=c.add(X(n,e-24)).mul(t);return Ye(J(l.add(u),43).add(J(d,30)).add(h),l.add(J(u.add(s),18)).add(d),t)}function Pd(n,e=n.length){const t=nt.fromNumber(81,!0);if(e<=32)return e<=16?Fd(n,e):Dd(n,e);if(e<=64)return Od(n,e);let s=t,o=t.mul(tt).add(113),r=ds(o.mul(le).add(113)).mul(le),i=[nt.UZERO,nt.UZERO],a=[nt.UZERO,nt.UZERO];s=s.mul(le).add(X(n,0));let c=0;const l=(e-1>>6)*64,u=l+(e-1&63)-63;do s=J(s.add(o).add(i[0]).add(X(n,c+8)),37).mul(tt),o=J(o.add(i[1]).add(X(n,c+48)),42).mul(tt),s=s.xor(a[1]),o=o.add(i[0]).add(X(n,c+40)),r=J(r.add(a[0]),33).mul(tt),i=bn(n,c,i[1].mul(tt),s.add(a[0])),a=bn(n,c+32,r.add(a[1]),o.add(X(n,c+16))),[r,s]=[s,r],c+=64;while(c!==l);const d=tt.add(r.and(255).shl(1));return c=u,a[0]=a[0].add(e-1&63),i[0]=i[0].add(a[0]),a[0]=a[0].add(i[0]),s=J(s.add(o).add(i[0]).add(X(n,c+8)),37).mul(d),o=J(o.add(i[1]).add(X(n,c+48)),42).mul(d),s=s.xor(a[1].mul(9)),o=o.add(i[0].mul(9).add(X(n,c+40))),r=J(r.add(a[0]),33).mul(d),i=bn(n,c,i[1].mul(d),s.add(a[0])),a=bn(n,c+32,r.add(a[1]),o.add(X(n,c+16))),[r,s]=[s,r],Ye(Ye(i[0],a[0],d).add(ds(o).mul(Pr)).add(r),Ye(i[1],a[1],d).add(s),d)}function _t(n,e){return e==="string"?it(n):Gn([n],e)}function _d(n,e){return n instanceof Float32Array&&e==="float32"||n instanceof Int32Array&&e==="int32"||n instanceof Uint8Array&&e==="bool"}function Gn(n,e){if(e==="string")throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(n)&&(n=lt(n)),v().getBool("DEBUG")&&$c(n,e),_d(n,e))return n;if(e==null||e==="float32"||e==="complex64")return new Float32Array(n);if(e==="int32")return new Int32Array(n);if(e==="bool"){const t=new Uint8Array(n.length);for(let s=0;s<t.length;++s)Math.round(n[s])!==0&&(t[s]=1);return t}else throw new Error(`Unknown data type ${e}`)}function Ee(){return v().platform.now()}function it(n,e="utf-8"){return e=e||"utf-8",v().platform.encode(n,e)}function Ft(n,e="utf-8"){return e=e||"utf-8",v().platform.decode(n,e)}function Se(n){return v().platform.isTypedArray!=null?v().platform.isTypedArray(n):Fr(n)}function lt(n,e=[],t=!1){if(e==null&&(e=[]),typeof n=="boolean"||typeof n=="number"||typeof n=="string"||Ps(n)||n==null||Se(n)&&t)e.push(n);else if(Array.isArray(n)||Se(n))for(let s=0;s<n.length;++s)lt(n[s],e,t);else{let s=-1;for(const o of Object.keys(n))/^([1-9]+[0-9]*|0)$/.test(o)&&(s=Math.max(s,Number(o)));for(let o=0;o<=s;o++)lt(n[o],e,t)}return e}class Ld{constructor(e,t){this.backendTimer=e,this.logger=t,t==null&&(this.logger=new Md)}profileKernel(e,t,s){let o;const r=()=>{o=s()};let i;const a=Ee();if(this.backendTimer.timerAvailable())i=this.backendTimer.time(r);else{r();for(const l of o)l.dataSync();i=Promise.resolve({kernelMs:Ee()-a})}if(v().getBool("CHECK_COMPUTATION_FOR_ERRORS"))for(let l=0;l<o.length;l++){const u=o[l];u.data().then(d=>{Bd(d,u.dtype,e)})}return{kernelName:e,outputs:o,inputs:t,timeMs:i.then(l=>l.kernelMs),extraInfo:i.then(l=>l.getExtraProfileInfo!=null?l.getExtraProfileInfo():"")}}logKernelProfile(e){const{kernelName:t,outputs:s,timeMs:o,inputs:r,extraInfo:i}=e;s.forEach(a=>{Promise.all([a.data(),o,i]).then(c=>{this.logger.logKernelProfile(t,a,c[0],c[1],r,c[2])})})}}function Bd(n,e,t){if(e!=="float32")return!1;for(let s=0;s<n.length;s++){const o=n[s];if(isNaN(o)||!isFinite(o))return console.warn(`Found ${o} in the result of '${t}'`),!0}return!1}class Md{logKernelProfile(e,t,s,o,r,i){const a=typeof o=="number"?Nt(`${o}ms`,9):o.error,c=Nt(e,25),l=t.rank,u=t.size,d=Nt(t.shape.toString(),14);let h="";for(const f in r){const p=r[f];if(p!=null){const x=p.shape||t.shape,g=x.length;h+=`${f}: ${g}D ${g>0?x:""} `}}console.log(`%c${c}	%c${a}	%c${l}D ${d}	%c${u}	%c${h}	%c${i}`,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")}}function Vd(n,e,t){const s={},o={};for(let c=0;c<e.length;c++)s[e[c].id]=!0;for(let c=0;c<n.length;c++){const l=n[c],u=l.inputs;for(const d in u){const h=u[d];let f=!1;for(let p=0;p<e.length;p++)if(s[h.id]){l.outputs.forEach(x=>s[x.id]=!0),f=!0,o[l.id]=!0;break}if(f)break}}const r={};r[t.id]=!0;const i={};for(let c=n.length-1;c>=0;c--){const l=n[c],u=l.inputs;for(let d=0;d<l.outputs.length;d++)if(r[l.outputs[d].id]){for(const h in u)r[u[h].id]=!0,i[l.id]=!0;break}}const a=[];for(let c=0;c<n.length;c++){const l=n[c];if(o[l.id]&&i[l.id]){const u={};for(const h in l.inputs){const f=l.inputs[h];s[f.id]&&(u[h]=f)}const d=Object.assign({},l);d.inputs=u,d.outputs=l.outputs,a.push(d)}}return a}function Ud(n,e,t,s){for(let o=e.length-1;o>=0;o--){const r=e[o],i=[];if(r.outputs.forEach(c=>{const l=n[c.id];l!=null?i.push(l):i.push(null)}),r.gradient==null)throw new Error(`Cannot compute gradient: gradient function not found for ${r.kernelName}.`);const a=r.gradient(i);for(const c in r.inputs){if(!(c in a))throw new Error(`Cannot backprop through input ${c}. Available gradients found: ${Object.keys(a)}.`);const l=t(()=>a[c]());if(l.dtype!=="float32")throw new Error(`Error in gradient for op ${r.kernelName}. The gradient of input ${c} must have 'float32' dtype, but has '${l.dtype}'`);const u=r.inputs[c];if(!oe(l.shape,u.shape))throw new Error(`Error in gradient for op ${r.kernelName}. The gradient of input '${c}' has shape '${l.shape}', which does not match the shape of the input '${u.shape}'`);if(n[u.id]==null)n[u.id]=l;else{const d=n[u.id];n[u.id]=s(d,l),d.dispose()}}}}const vo=20,Yt=3,ts=7;function Wd(n,e,t,s){const o=se(e),r=Gd(n,e,t,o),i=e.length,a=In(n,e,t,o,r),c=["Tensor"];return s&&(c.push(`  dtype: ${t}`),c.push(`  rank: ${i}`),c.push(`  shape: [${e}]`),c.push("  values:")),c.push(a.map(l=>"    "+l).join(`
`)),c.join(`
`)}function Gd(n,e,t,s){const o=F(e),r=s[s.length-1],i=new Array(r).fill(0),a=e.length,c=t==="complex64"?Zt(n):n;if(a>1)for(let l=0;l<o/r;l++){const u=l*r;for(let d=0;d<r;d++)i[d]=Math.max(i[d],Qt(c[u+d],0,t).length)}return i}function Qt(n,e,t){let s;return Array.isArray(n)?s=`${parseFloat(n[0].toFixed(ts))} + ${parseFloat(n[1].toFixed(ts))}j`:Un(n)?s=`'${n}'`:t==="bool"?s=Lr(n):s=parseFloat(n.toFixed(ts)).toString(),Nt(s,e)}function Lr(n){return n===0?"false":"true"}function In(n,e,t,s,o,r=!0){const i=t==="complex64"?2:1,a=e[0],c=e.length;if(c===0){if(t==="complex64"){const x=Zt(n);return[Qt(x[0],0,t)]}return t==="bool"?[Lr(n[0])]:[n[0].toString()]}if(c===1){if(a>vo){const g=Yt*i;let m=Array.from(n.slice(0,g)),C=Array.from(n.slice((a-Yt)*i,a*i));return t==="complex64"&&(m=Zt(m),C=Zt(C)),["["+m.map((w,y)=>Qt(w,o[y],t)).join(", ")+", ..., "+C.map((w,y)=>Qt(w,o[a-Yt+y],t)).join(", ")+"]"]}return["["+(t==="complex64"?Zt(n):Array.from(n)).map((g,m)=>Qt(g,o[m],t)).join(", ")+"]"]}const l=e.slice(1),u=s.slice(1),d=s[0]*i,h=[];if(a>vo){for(let x=0;x<Yt;x++){const g=x*d,m=g+d;h.push(...In(n.slice(g,m),l,t,u,o,!1))}h.push("...");for(let x=a-Yt;x<a;x++){const g=x*d,m=g+d;h.push(...In(n.slice(g,m),l,t,u,o,x===a-1))}}else for(let x=0;x<a;x++){const g=x*d,m=g+d;h.push(...In(n.slice(g,m),l,t,u,o,x===a-1))}const f=c===2?",":"";h[0]="["+(a>0?h[0]+f:"");for(let x=1;x<h.length-1;x++)h[x]=" "+h[x]+f;let p=`,
`;for(let x=2;x<c;x++)p+=`
`;return h[h.length-1]=" "+h[h.length-1]+"]"+(r?"":p),h}function Zt(n){const e=[];for(let t=0;t<n.length;t+=2)e.push([n[t],n[t+1]]);return e}class Dn{constructor(e,t,s){if(this.dtype=t,this.shape=e.slice(),this.size=F(e),s!=null){const o=s.length;D(o===this.size,()=>`Length of values '${o}' does not match the size inferred by the shape '${this.size}'.`)}if(t==="complex64")throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");this.values=s||ee(t,this.size),this.strides=se(e)}set(e,...t){t.length===0&&(t=[0]),D(t.length===this.rank,()=>`The number of provided coordinates (${t.length}) must match the rank (${this.rank})`);const s=this.locToIndex(t);this.values[s]=e}get(...e){e.length===0&&(e=[0]);let t=0;for(const o of e){if(o<0||o>=this.shape[t]){const r=`Requested out of range element at ${e}.   Buffer shape=${this.shape}`;throw new Error(r)}t++}let s=e[e.length-1];for(let o=0;o<e.length-1;++o)s+=this.strides[o]*e[o];return this.values[s]}locToIndex(e){if(this.rank===0)return 0;if(this.rank===1)return e[0];let t=e[e.length-1];for(let s=0;s<e.length-1;++s)t+=this.strides[s]*e[s];return t}indexToLoc(e){if(this.rank===0)return[];if(this.rank===1)return[e];const t=new Array(this.shape.length);for(let s=0;s<t.length-1;++s)t[s]=Math.floor(e/this.strides[s]),e-=t[s]*this.strides[s];return t[t.length-1]=e,t}get rank(){return this.shape.length}toTensor(){return Ne().makeTensor(this.values,this.shape,this.dtype)}}let Ne=null,Tt=null;function zd(n){Ne=n}function Hd(n){Tt=n}class ke{constructor(e,t,s,o){this.kept=!1,this.isDisposedInternal=!1,this.shape=e.slice(),this.dtype=t||"float32",this.size=F(e),this.strides=se(e),this.dataId=s,this.id=o,this.rankType=this.rank<5?this.rank.toString():"higher"}get rank(){return this.shape.length}async buffer(){const e=await this.data();return Tt.buffer(this.shape,this.dtype,e)}bufferSync(){return Tt.buffer(this.shape,this.dtype,this.dataSync())}async array(){const e=await this.data();return mo(this.shape,e,this.dtype==="complex64")}arraySync(){return mo(this.shape,this.dataSync(),this.dtype==="complex64")}async data(){this.throwIfDisposed();const e=Ne().read(this.dataId);if(this.dtype==="string"){const t=await e;try{return t.map(s=>Ft(s))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}}return e}dataToGPU(e){return this.throwIfDisposed(),Ne().readToGPU(this.dataId,e)}dataSync(){this.throwIfDisposed();const e=Ne().readSync(this.dataId);if(this.dtype==="string")try{return e.map(t=>Ft(t))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return e}async bytes(){this.throwIfDisposed();const e=await Ne().read(this.dataId);return this.dtype==="string"?e:new Uint8Array(e.buffer)}dispose(){this.isDisposed||(this.kerasMask&&this.kerasMask.dispose(),Ne().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw new Error("Tensor is disposed.")}print(e=!1){return Tt.print(this,e)}clone(){return this.throwIfDisposed(),Tt.clone(this)}toString(e=!1){const t=this.dataSync();return Wd(t,this.shape,this.dtype,e)}cast(e){return this.throwIfDisposed(),Tt.cast(this,e)}variable(e=!0,t,s){return this.throwIfDisposed(),Ne().makeVariable(this,e,t,s)}}Object.defineProperty(ke,Symbol.hasInstance,{value:n=>!!n&&n.data!=null&&n.dataSync!=null&&n.throwIfDisposed!=null});function Br(){return _s("Tensor",()=>ke)}Br();class On extends ke{constructor(e,t,s,o){super(e.shape,e.dtype,e.dataId,o),this.trainable=t,this.name=s}assign(e){if(e.dtype!==this.dtype)throw new Error(`dtype of the new value (${e.dtype}) and previous value (${this.dtype}) must match`);if(!oe(e.shape,this.shape))throw new Error(`shape of the new value (${e.shape}) and previous value (${this.shape}) must match`);Ne().disposeTensor(this),this.dataId=e.dataId,Ne().incRef(this,null)}dispose(){Ne().disposeVariable(this),this.isDisposedInternal=!0}}Object.defineProperty(On,Symbol.hasInstance,{value:n=>n instanceof ke&&n.assign!=null&&n.assign instanceof Function});var $o;(function(n){n.R0="R0",n.R1="R1",n.R2="R2",n.R3="R3",n.R4="R4",n.R5="R5",n.R6="R6"})($o||($o={}));var hs;(function(n){n.float32="float32",n.int32="int32",n.bool="int32",n.complex64="complex64"})(hs||(hs={}));var fs;(function(n){n.float32="float32",n.int32="int32",n.bool="bool",n.complex64="complex64"})(fs||(fs={}));var ps;(function(n){n.float32="float32",n.int32="float32",n.bool="float32",n.complex64="complex64"})(ps||(ps={}));var ms;(function(n){n.float32="complex64",n.int32="complex64",n.bool="complex64",n.complex64="complex64"})(ms||(ms={}));const Xd={float32:ps,int32:hs,bool:fs,complex64:ms};function Ve(n,e){if(n==="string"||e==="string"){if(n==="string"&&e==="string")return"string";throw new Error(`Can not upcast ${n} with ${e}`)}return Xd[n][e]}function Vs(n){return Ve(n,"int32")}function Mr(n){return n!=null&&typeof n=="object"&&"texture"in n&&n.texture instanceof WebGLTexture}function Vr(n){return typeof GPUBuffer<"u"&&n!=null&&typeof n=="object"&&"buffer"in n&&n.buffer instanceof GPUBuffer}function Ct(n,e){if(n.dtype===e.dtype)return[n,e];const t=Ve(n.dtype,e.dtype);return[n.cast(t),e.cast(t)]}function Ur(n){const e=[];return Wr(n,e,new Set),e}function Wr(n,e,t){if(n==null)return;if(n instanceof ke){e.push(n);return}if(!jd(n))return;const s=n;for(const o in s){const r=s[o];t.has(r)||(t.add(r),Wr(r,e,t))}}function jd(n){return Array.isArray(n)||typeof n=="object"}function ns(n){return n.kernelName!=null}class So{constructor(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null,get kernelNames(){return Array.from(new Set(this.kernels.map(e=>e.name)))}}}dispose(){for(const e in this.registeredVariables)this.registeredVariables[e].dispose()}}class Dt{constructor(e){this.ENV=e,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new So}async ready(){if(this.pendingBackendInit!=null)return this.pendingBackendInit.then(()=>{});if(this.backendInstance!=null)return;const e=this.getSortedBackends();for(let t=0;t<e.length;t++){const s=e[t];if(await this.initializeBackend(s).success){await this.setBackend(s);return}}throw new Error("Could not initialize any backends, all backend initializations failed.")}get backend(){if(this.pendingBackendInit!=null)throw new Error(`Backend '${this.backendName}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);if(this.backendInstance==null){const{name:e,asyncInit:t}=this.initializeBackendsAndReturnBest();if(t)throw new Error(`The highest priority backend '${e}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);this.setBackend(e)}return this.backendInstance}backendNames(){return Object.keys(this.registryFactory)}findBackend(e){if(!(e in this.registry))if(e in this.registryFactory){const{asyncInit:t}=this.initializeBackend(e);if(t)return null}else return null;return this.registry[e]}findBackendFactory(e){return e in this.registryFactory?this.registryFactory[e].factory:null}registerBackend(e,t,s=1){return e in this.registryFactory?(Fe(`${e} backend was already registered. Reusing existing backend factory.`),!1):(this.registryFactory[e]={factory:t,priority:s},!0)}async setBackend(e){if(this.registryFactory[e]==null)throw new Error(`Backend name '${e}' not found in registry`);if(this.backendName=e,this.registry[e]==null){this.backendInstance=null;const{success:t,asyncInit:s}=this.initializeBackend(e);if(!(s?await t:t))return!1}return this.backendInstance=this.registry[e],this.setupRegisteredKernels(),this.profiler=new Ld(this.backendInstance),!0}setupRegisteredKernels(){bo(this.backendName).forEach(t=>{t.setupFunc!=null&&t.setupFunc(this.backendInstance)})}disposeRegisteredKernels(e){bo(e).forEach(s=>{s.disposeFunc!=null&&s.disposeFunc(this.registry[e])})}initializeBackend(e){const t=this.registryFactory[e];if(t==null)throw new Error(`Cannot initialize backend ${e}, no registration found.`);try{const s=t.factory();if(s&&!(s instanceof dr)&&typeof s.then=="function"){const o=++this.pendingBackendInitId,r=s.then(i=>o<this.pendingBackendInitId?!1:(this.registry[e]=i,this.pendingBackendInit=null,!0)).catch(i=>(o<this.pendingBackendInitId||(this.pendingBackendInit=null,Fe(`Initialization of backend ${e} failed`),Fe(i.stack||i.message)),!1));return this.pendingBackendInit=r,{success:r,asyncInit:!0}}else return this.registry[e]=s,{success:!0,asyncInit:!1}}catch(s){return Fe(`Initialization of backend ${e} failed`),Fe(s.stack||s.message),{success:!1,asyncInit:!1}}}removeBackend(e){if(!(e in this.registryFactory))throw new Error(`${e} backend not found in registry`);this.backendName===e&&this.pendingBackendInit!=null&&this.pendingBackendInitId++,e in this.registry&&(this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e]),delete this.registryFactory[e],this.backendName===e&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)}getSortedBackends(){if(Object.keys(this.registryFactory).length===0)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort((e,t)=>this.registryFactory[t].priority-this.registryFactory[e].priority)}initializeBackendsAndReturnBest(){const e=this.getSortedBackends();for(let t=0;t<e.length;t++){const s=e[t],{success:o,asyncInit:r}=this.initializeBackend(s);if(r||o)return{name:s,asyncInit:r}}throw new Error("Could not initialize any backends, all backend initializations failed.")}moveData(e,t){const s=this.state.tensorInfo.get(t),o=s.backend,r=this.readSync(t),i=o.refCount(t);o.disposeData(t,!0),s.backend=e,e.move(t,r,s.shape,s.dtype,i),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++}tidy(e,t){let s=null;if(t==null){if(typeof e!="function")throw new Error("Please provide a function to tidy()");t=e}else{if(typeof e!="string"&&!(e instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if(typeof t!="function")throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");s=e}let o;return this.scopedRun(()=>this.startScope(s),()=>this.endScope(o),()=>(o=t(),o instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),o))}scopedRun(e,t,s){e();try{const o=s();return t(),o}catch(o){throw t(),o}}nextTensorId(){return Dt.nextTensorId++}nextVariableId(){return Dt.nextVariableId++}clone(e){const t=_.runKernel(Ms,{x:e}),s={x:e},o=i=>({x:()=>{const a="float32",c={x:i},l={dtype:a};return _.runKernel(Bs,c,l)}}),r=[];return this.addTapeNode(this.state.activeScope.name,s,[t],o,r,{}),t}runKernel(e,t,s){if(this.backendName==null&&this.backend,!(xo(e,this.backendName)!=null))throw new Error(`Kernel '${e}' not registered for backend '${this.backendName}'`);return this.runKernelFunc({kernelName:e,inputs:t,attrs:s})}shouldCheckForMemLeaks(){return this.ENV.getBool("IS_TEST")}checkKernelForMemLeak(e,t,s){const o=this.backend.numDataIds();let r=0;s.forEach(c=>{r+=c.dtype==="complex64"?3:1});const i=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],a=o-t-r-i;if(a>0)throw new Error(`Backend '${this.backendName}' has an internal memory leak (${a} data ids) after running '${e}'`)}runKernelFunc(e){let t,s=[];const o=this.isTapeOn(),r=this.state.numBytes,i=this.state.numTensors;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0);let a;this.backendName==null&&this.backend;let c;const l=ns(e)?e.kernelName:this.state.activeScope!=null?this.state.activeScope.name:"";if(ns(e)){const{kernelName:p,inputs:x,attrs:g}=e;this.backendName==null&&this.backend;const m=xo(p,this.backendName);D(m!=null,()=>`Cannot find registered kernel '${p}' for backend '${this.backendName}'`),a=()=>{const C=this.backend.numDataIds();c=m.kernelFunc({inputs:x,attrs:g,backend:this.backend});const w=Array.isArray(c)?c:[c];this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(p,C,w);const y=w.map(I=>I.rank!=null?I:this.makeTensorFromTensorInfo(I));if(o){const I=this.getTensorsForGradient(p,x,y);s=this.saveTensorsForBackwardMode(I)}return y}}else{const{forwardFunc:p}=e,x=g=>{o&&(s=g.map(m=>this.keep(this.clone(m))))};a=()=>{const g=this.backend.numDataIds();c=this.tidy(()=>p(this.backend,x));const m=Array.isArray(c)?c:[c];return this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(l,g,m),m}}const{inputs:u,attrs:d}=e,h=ns(e)?null:e.backwardsFunc;let f;return this.scopedRun(()=>this.state.kernelDepth++,()=>this.state.kernelDepth--,()=>{!this.ENV.getBool("DEBUG")&&!this.state.profiling?t=a():(f=this.profiler.profileKernel(l,u,()=>a()),this.ENV.getBool("DEBUG")&&this.profiler.logKernelProfile(f),t=f.outputs)}),o&&this.addTapeNode(l,u,t,h,s,d),this.state.profiling&&this.state.activeProfile.kernels.push({name:l,bytesAdded:this.state.numBytes-r,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-i,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(u).map(p=>u[p]!=null?u[p].shape:null),outputShapes:t.map(p=>p.shape),kernelTimeMs:f.timeMs,extraInfo:f.extraInfo}),Array.isArray(c)?t:t[0]}saveTensorsForBackwardMode(e){return e.map(s=>this.keep(this.clone(s)))}getTensorsForGradient(e,t,s){const o=Co(e);if(o!=null){const r=o.inputsToSave||[],i=o.outputsToSave||[];let a;o.saveAllInputs?(D(Array.isArray(t),()=>"saveAllInputs is true, expected inputs to be an array."),a=Object.keys(t).map(l=>t[l])):a=r.map(l=>t[l]);const c=s.filter((l,u)=>i[u]);return a.concat(c)}return[]}makeTensor(e,t,s,o){if(e==null)throw new Error("Values passed to engine.makeTensor() are null");s=s||"float32",o=o||this.backend;let r=e;s==="string"&&Un(e[0])&&(r=e.map(c=>it(c)));const i=o.write(r,t,s),a=new ke(t,s,i,this.nextTensorId());if(this.trackTensor(a,o),s==="string"){const c=this.state.tensorInfo.get(i),l=Rc(r);this.state.numBytes+=l-c.bytes,c.bytes=l}return a}makeTensorFromDataId(e,t,s,o){s=s||"float32";const r={dataId:e,shape:t,dtype:s};return this.makeTensorFromTensorInfo(r,o)}makeTensorFromTensorInfo(e,t){const{dataId:s,shape:o,dtype:r}=e,i=new ke(o,r,s,this.nextTensorId());return this.trackTensor(i,t),i}makeVariable(e,t=!0,s,o){s=s||this.nextVariableId().toString(),o!=null&&o!==e.dtype&&(e=e.cast(o));const r=new On(e,t,s,this.nextTensorId());if(this.state.registeredVariables[r.name]!=null)throw new Error(`Variable with name ${r.name} was already registered`);return this.state.registeredVariables[r.name]=r,this.incRef(r,this.backend),r}trackTensor(e,t){this.state.numTensors++,e.dtype==="string"&&this.state.numStringTensors++;let s=0;e.dtype!=="complex64"&&e.dtype!=="string"&&(s=e.size*An(e.dtype)),this.state.numBytes+=s,this.state.tensorInfo.has(e.dataId)||(this.state.numDataBuffers++,this.state.tensorInfo.set(e.dataId,{backend:t||this.backend,dtype:e.dtype,shape:e.shape,bytes:s})),e instanceof On||this.track(e)}incRef(e,t){this.trackTensor(e,t),this.backend.incRef(e.dataId)}removeDataId(e,t){this.state.tensorInfo.has(e)&&this.state.tensorInfo.get(e).backend===t&&(this.state.tensorInfo.delete(e),this.state.numDataBuffers--)}disposeTensor(e){if(!this.state.tensorInfo.has(e.dataId))return;const t=this.state.tensorInfo.get(e.dataId);if(this.state.numTensors--,e.dtype==="string"&&(this.state.numStringTensors--,this.state.numBytes-=t.bytes),e.dtype!=="complex64"&&e.dtype!=="string"){const s=e.size*An(e.dtype);this.state.numBytes-=s}t.backend.disposeData(e.dataId)&&this.removeDataId(e.dataId,t.backend)}disposeVariables(){for(const e in this.state.registeredVariables){const t=this.state.registeredVariables[e];this.disposeVariable(t)}}disposeVariable(e){this.disposeTensor(e),this.state.registeredVariables[e.name]!=null&&delete this.state.registeredVariables[e.name]}memory(){const e=this.backend.memory();return e.numTensors=this.state.numTensors,e.numDataBuffers=this.state.numDataBuffers,e.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(e.unreliable=!0,e.reasons==null&&(e.reasons=[]),e.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),e}async profile(e){this.state.profiling=!0;const t=this.state.numBytes,s=this.state.numTensors;this.state.activeProfile.kernels=[],this.state.activeProfile.result=await e(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max(...this.state.activeProfile.kernels.map(o=>o.totalBytesSnapshot)),this.state.activeProfile.newBytes=this.state.numBytes-t,this.state.activeProfile.newTensors=this.state.numTensors-s;for(const o of this.state.activeProfile.kernels)o.kernelTimeMs=await o.kernelTimeMs,o.extraInfo=await o.extraInfo;return this.state.activeProfile}isTapeOn(){return this.state.gradientDepth>0&&this.state.kernelDepth===0}addTapeNode(e,t,s,o,r,i){const a={id:this.state.nextTapeNodeId++,kernelName:e,inputs:t,outputs:s,saved:r},c=Co(e);c!=null&&(o=c.gradFunc),o!=null&&(a.gradient=l=>(l=l.map((u,d)=>{if(u==null){const h=s[d],f=Qe(h.size,h.dtype);return this.makeTensor(f,h.shape,h.dtype)}return u}),o(l.length>1?l:l[0],r,i))),this.state.activeTape.push(a)}keep(e){return e.kept=!0,e}startTape(){this.state.gradientDepth===0&&(this.state.activeTape=[]),this.state.gradientDepth++}endTape(){this.state.gradientDepth--}startScope(e){const t={track:[],name:"unnamed scope",id:this.state.nextScopeId++};e&&(t.name=e),this.state.scopeStack.push(t),this.state.activeScope=t}endScope(e){const t=Ur(e),s=new Set(t.map(r=>r.id));for(let r=0;r<this.state.activeScope.track.length;r++){const i=this.state.activeScope.track[r];!i.kept&&!s.has(i.id)&&i.dispose()}const o=this.state.scopeStack.pop();this.state.activeScope=this.state.scopeStack.length===0?null:this.state.scopeStack[this.state.scopeStack.length-1],t.forEach(r=>{!r.kept&&r.scopeId===o.id&&this.track(r)})}gradients(e,t,s,o=!1){if(D(t.length>0,()=>"gradients() received an empty list of xs."),s!=null&&s.dtype!=="float32")throw new Error(`dy must have 'float32' dtype, but has '${s.dtype}'`);const r=this.scopedRun(()=>this.startTape(),()=>this.endTape(),()=>this.tidy("forward",e));D(r instanceof ke,()=>"The result y returned by f() must be a tensor.");const i=Vd(this.state.activeTape,t,r);if(!o&&i.length===0&&t.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",()=>{const a={};a[r.id]=s??qd(r.shape),Ud(a,i,l=>this.tidy(l),Kd);const c=t.map(l=>a[l.id]);return this.state.gradientDepth===0&&(this.state.activeTape.forEach(l=>{for(const u of l.saved)u.dispose()}),this.state.activeTape=null),{value:r,grads:c}})}customGrad(e){return D(cs(e),()=>"The f passed in customGrad(f) must be a function."),(...t)=>{D(t.every(a=>a instanceof ke),()=>"The args passed in customGrad(f)(x1, x2,...) must all be tensors");let s;const o={};t.forEach((a,c)=>{o[c]=a});const r=(a,c)=>(s=e(...t,c),D(s.value instanceof ke,()=>"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor"),D(cs(s.gradFunc),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function."),s.value),i=(a,c)=>{const l=s.gradFunc(a,c),u=Array.isArray(l)?l:[l];D(u.length===t.length,()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...)."),D(u.every(h=>h instanceof ke),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors.");const d={};return u.forEach((h,f)=>{d[f]=()=>h}),d};return this.runKernelFunc({forwardFunc:r,backwardsFunc:i,inputs:o})}}readSync(e){return this.state.tensorInfo.get(e).backend.readSync(e)}read(e){return this.state.tensorInfo.get(e).backend.read(e)}readToGPU(e,t){return this.state.tensorInfo.get(e).backend.readToGPU(e,t)}async time(e){const t=Ee(),s=await this.backend.time(e);return s.wallMs=Ee()-t,s}track(e){return this.state.activeScope!=null&&(e.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(e)),e}get registeredVariables(){return this.state.registeredVariables}reset(){this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new So;for(const e in this.registry)this.disposeRegisteredKernels(e),this.registry[e].dispose(),delete this.registry[e];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null}}Dt.nextTensorId=0;Dt.nextVariableId=0;function qd(n){const e=Nc(F(n),"float32");return _.makeTensor(e,n,"float32")}function Gr(){const n=gr();if(n._tfengine==null){const e=new kc(n);n._tfengine=new Dt(e)}return Oc(n._tfengine.ENV),zd(()=>n._tfengine),n._tfengine}const _=Gr();function Kd(n,e){const t={a:n,b:e};return _.runKernel(Ls,t)}function Yd(){return typeof navigator<"u"&&navigator!=null}function zr(n){if(n||Yd()){if(n||(n=navigator),n.product==="ReactNative")return!0;const e=n.userAgent||n.vendor||(typeof window<"u"?window.opera:"");if(!e){const t=n;return t.userAgentData&&t.userAgentData.mobile}return/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4))}return!1}function Hr(){return typeof window<"u"&&window.document!=null||typeof WorkerGlobalScope<"u"}const me=v();me.registerFlag("DEBUG",()=>!1,n=>{n&&console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.")});me.registerFlag("IS_BROWSER",()=>Hr());me.registerFlag("IS_NODE",()=>typeof process<"u"&&typeof process.versions<"u"&&typeof process.versions.node<"u");me.registerFlag("IS_CHROME",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor));me.registerFlag("IS_SAFARI",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Safari/.test(navigator.userAgent)&&/Apple/.test(navigator.vendor));me.registerFlag("PROD",()=>!1);me.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY",()=>me.getBool("DEBUG"));me.registerFlag("DEPRECATION_WARNINGS_ENABLED",()=>!0);me.registerFlag("IS_TEST",()=>!1);me.registerFlag("CHECK_COMPUTATION_FOR_ERRORS",()=>me.getBool("DEBUG"));me.registerFlag("WRAP_TO_IMAGEBITMAP",()=>!1);me.registerFlag("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU",()=>!1);me.registerFlag("USE_SETTIMEOUTCUSTOM",()=>!1);function Qd(n,e){let t=n;if(Se(n))return e==="string"?[]:[n.length];if(Mr(n)){const o=n.channels||"RGBA";return[n.height,n.width*o.length]}else if(Vr(n))return[n.buffer.size/(e==null?4:An(e))];if(!Array.isArray(n))return[];const s=[];for(;Array.isArray(t)||Se(t)&&e!=="string";)s.push(t.length),t=t[0];return Array.isArray(n)&&v().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&Xr(n,s,[]),s}function Xr(n,e,t){if(t=t||[],!Array.isArray(n)&&!Se(n)){D(e.length===0,()=>`Element arr[${t.join("][")}] is a primitive, but should be an array/TypedArray of ${e[0]} elements`);return}D(e.length>0,()=>`Element arr[${t.join("][")}] should be a primitive, but is an array of ${n.length} elements`),D(n.length===e[0],()=>`Element arr[${t.join("][")}] should have ${e[0]} elements, but has ${n.length} elements`);const s=e.slice(1);for(let o=0;o<n.length;++o)Xr(n[o],s,t.concat(o))}function Io(n,e,t,s){if(n!=="string_or_numeric"){if(n==null)throw new Error("Expected dtype cannot be null.");if(n!=="numeric"&&n!==e||n==="numeric"&&e==="string")throw new Error(`Argument '${t}' passed to '${s}' must be ${n} tensor, but got ${e} tensor`)}}function K(n,e,t,s="numeric"){if(n instanceof Br())return Io(s,n.dtype,e,t),n;let o=dn(n);if(o!=="string"&&["bool","int32","float32"].indexOf(s)>=0&&(o=s),Io(s,o,e,t),n==null||!Se(n)&&!Array.isArray(n)&&typeof n!="number"&&typeof n!="boolean"&&typeof n!="string"){const c=n==null?"null":n.constructor.name;throw new Error(`Argument '${e}' passed to '${t}' must be a Tensor or TensorLike, but got '${c}'`)}const r=Qd(n,o);!Se(n)&&!Array.isArray(n)&&(n=[n]);const a=o!=="string"?Gn(n,o):lt(n,[],!0);return _.makeTensor(a,r,o)}const Zd="__op";function fe(n){const e=Object.keys(n);if(e.length!==1)throw new Error(`Please provide an object with a single key (operation name) mapping to a function. Got an object with ${e.length} keys.`);let t=e[0];const s=n[t];t.endsWith("_")&&(t=t.substring(0,t.length-1)),t=t+Zd;const o=(...r)=>{_.startScope(t);try{const i=s(...r);return Ps(i)&&console.error("Cannot return a Promise inside of tidy."),_.endScope(i),i}catch(i){throw _.endScope(null),i}};return Object.defineProperty(o,"name",{value:t,configurable:!0}),o}function Jd(n,e){const t=K(n,"real","complex"),s=K(e,"imag","complex");hr(t.shape,s.shape,`real and imag shapes, ${t.shape} and ${s.shape}, must match in call to tf.complex().`);const o={real:t,imag:s};return _.runKernel(Cr,o)}const eh=fe({complex_:Jd});function th(n,e,t,s){if(s==null)s=dn(n);else if(s==="complex64")throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(Vr(n)||Mr(n)){if(s!=="float32"&&s!=="int32")throw new Error(`Creating tensor from GPU data only supports 'float32'|'int32' dtype, while the dtype is ${s}.`);return _.backend.createTensorFromGPUData(n,e||t,s)}if(!Se(n)&&!Array.isArray(n)&&typeof n!="number"&&typeof n!="boolean"&&typeof n!="string")throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(e!=null){hn(e);const o=F(e),r=F(t);D(o===r,()=>`Based on the provided shape, [${e}], the tensor should have ${o} values but has ${r}`);for(let i=0;i<t.length;++i){const a=t[i],c=i===t.length-1?a!==F(e.slice(i)):!0;D(t[i]===e[i]||!c,()=>`Error creating a new Tensor. Inferred shape (${t}) does not match the provided shape (${e}). `)}}return!Se(n)&&!Array.isArray(n)&&(n=[n]),e=e||t,n=s!=="string"?Gn(n,s):lt(n,[],!0),_.makeTensor(n,e,s)}class bt{static join(e){return new bt(e).slice()}constructor(e){if(this.shards=[],this.previousShardIndex=0,e==null||(e instanceof Array||(e=[e]),e=e.map(s=>Se(s)?s.buffer:s),e.length===0))return;this.bufferUniformSize=e[0].byteLength;let t=0;for(let s=0;s<e.length;s++){const o=e[s];s!==e.length-1&&o.byteLength!==this.bufferUniformSize&&(this.bufferUniformSize=void 0);const r=t+o.byteLength;this.shards.push({buffer:o,start:t,end:r}),t=r}this.shards.length===0&&(this.byteLength=0),this.byteLength=this.shards[this.shards.length-1].end}slice(e=0,t=this.byteLength){if(this.shards.length===0)return new ArrayBuffer(0);if(e=isNaN(Number(e))?0:e,t=isNaN(Number(t))?0:t,e=Math.max(0,e),t=Math.min(this.byteLength,t),t<=e)return new ArrayBuffer(0);const s=this.findShardForByte(e);if(s===-1)throw new Error(`Could not find start shard for byte ${e}`);const o=t-e,r=new ArrayBuffer(o),i=new Uint8Array(r);let a=0;for(let c=s;c<this.shards.length;c++){const l=this.shards[c],d=e+a-l.start,h=a,p=Math.min(t,l.end)-l.start,x=new Uint8Array(l.buffer,d,p-d);if(i.set(x,h),a+=x.length,t<l.end)break}return r}findShardForByte(e){if(this.shards.length===0||e<0||e>=this.byteLength)return-1;if(this.bufferUniformSize!=null)return this.previousShardIndex=Math.floor(e/this.bufferUniformSize),this.previousShardIndex;function t(o){return e<o.start?-1:e>=o.end?1:0}if(t(this.shards[this.previousShardIndex])===0)return this.previousShardIndex;const s=nh(this.shards,t);return s===-1?-1:(this.previousShardIndex=s,this.previousShardIndex)}}function nh(n,e){let t=0,s=n.length;for(;t<=s;){const o=Math.floor((s-t)/2)+t,r=e(n[o]);if(r===0)return o;r<0?s=o:t=o+1}return-1}function Xe(){return _}function Q(n,e){return _.tidy(n,e)}function ye(n){Ur(n).forEach(t=>t.dispose())}function sh(n){return _.keep(n)}function oh(n,e,t=1){return _.registerBackend(n,e,t)}const Us=typeof Buffer<"u"&&(typeof Blob>"u"||typeof atob>"u"||typeof btoa>"u");function Ro(n){return Us?Buffer.byteLength(n,"utf8"):new Blob([n]).size}function rh(n){if(Us)return Buffer.from(n).toString("base64");const e=new Uint8Array(n);let t="";for(let s=0,o=e.length;s<o;s++)t+=String.fromCharCode(e[s]);return btoa(t)}function ih(n){if(Us){const s=Buffer.from(n,"base64");return s.buffer.slice(s.byteOffset,s.byteOffset+s.byteLength)}const e=atob(n),t=new Uint8Array(e.length);for(let s=0;s<e.length;++s)t.set([e.charCodeAt(s)],s);return t.buffer}function jr(n,e){const t={modelTopology:n.modelTopology,format:n.format,generatedBy:n.generatedBy,convertedBy:n.convertedBy,weightsManifest:e};return n.signature!=null&&(t.signature=n.signature),n.userDefinedMetadata!=null&&(t.userDefinedMetadata=n.userDefinedMetadata),n.modelInitializer!=null&&(t.modelInitializer=n.modelInitializer),n.initializerSignature!=null&&(t.initializerSignature=n.initializerSignature),n.trainingConfig!=null&&(t.trainingConfig=n.trainingConfig),t}function ah(n,e,t){const s={modelTopology:n.modelTopology,format:n.format,generatedBy:n.generatedBy,convertedBy:n.convertedBy};if(n.trainingConfig!=null&&(s.trainingConfig=n.trainingConfig),n.weightsManifest!=null){if(!e)throw new Error("modelJSON has weightsManifest but weightSpecs is null");if(!t)throw new Error("modelJSON has weightsManifest but weightData is null");s.weightSpecs=e,s.weightData=t}return n.signature!=null&&(s.signature=n.signature),n.userDefinedMetadata!=null&&(s.userDefinedMetadata=n.userDefinedMetadata),n.modelInitializer!=null&&(s.modelInitializer=n.modelInitializer),n.initializerSignature!=null&&(s.initializerSignature=n.initializerSignature),s}async function ch(n,e){let t,s;return n.weightsManifest!=null&&([t,s]=await e(n.weightsManifest)),ah(n,t,s)}function zn(n){if(n.modelTopology instanceof ArrayBuffer)throw new Error("Expected JSON model topology, received ArrayBuffer.");return{dateSaved:new Date,modelTopologyType:"JSON",modelTopologyBytes:n.modelTopology==null?0:Ro(JSON.stringify(n.modelTopology)),weightSpecsBytes:n.weightSpecs==null?0:Ro(JSON.stringify(n.weightSpecs)),weightDataBytes:n.weightData==null?0:new bt(n.weightData).byteLength}}function To(n){const e=[];for(const t of n)e.push(...t.weights);return e}class te{constructor(){this.saveRouters=[],this.loadRouters=[]}static getInstance(){return te.instance==null&&(te.instance=new te),te.instance}static registerSaveRouter(e){te.getInstance().saveRouters.push(e)}static registerLoadRouter(e){te.getInstance().loadRouters.push(e)}static getSaveHandlers(e){return te.getHandlers(e,"save")}static getLoadHandlers(e,t){return te.getHandlers(e,"load",t)}static getHandlers(e,t,s){const o=[];return(t==="load"?te.getInstance().loadRouters:te.getInstance().saveRouters).forEach(i=>{const a=i(e,s);a!==null&&o.push(a)}),o}}const gs="tensorflowjs",xs=1,rt="models_store",qe="model_info_store";function qr(){if(!v().getBool("IS_BROWSER"))throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");const n=typeof window>"u"?self:window,e=n.indexedDB||n.mozIndexedDB||n.webkitIndexedDB||n.msIndexedDB||n.shimIndexedDB;if(e==null)throw new Error("The current browser does not appear to support IndexedDB.");return e}function Cs(n){const e=n.result;e.createObjectStore(rt,{keyPath:"modelPath"}),e.createObjectStore(qe,{keyPath:"modelPath"})}class ut{constructor(e){if(this.indexedDB=qr(),e==null||!e)throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");this.modelPath=e}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");return this.databaseAction(this.modelPath,e)}async load(){return this.databaseAction(this.modelPath)}databaseAction(e,t){return new Promise((s,o)=>{const r=this.indexedDB.open(gs,xs);r.onupgradeneeded=()=>Cs(r),r.onsuccess=()=>{const i=r.result;if(t==null){const a=i.transaction(rt,"readonly"),l=a.objectStore(rt).get(this.modelPath);l.onsuccess=()=>{if(l.result==null)return i.close(),o(new Error(`Cannot find model with path '${this.modelPath}' in IndexedDB.`));s(l.result.modelArtifacts)},l.onerror=u=>(i.close(),o(l.error)),a.oncomplete=()=>i.close()}else{t.weightData=bt.join(t.weightData);const a=zn(t),c=i.transaction(qe,"readwrite");let l=c.objectStore(qe),u;try{u=l.put({modelPath:this.modelPath,modelArtifactsInfo:a})}catch(h){return o(h)}let d;u.onsuccess=()=>{d=i.transaction(rt,"readwrite");const h=d.objectStore(rt);let f;try{f=h.put({modelPath:this.modelPath,modelArtifacts:t,modelArtifactsInfo:a})}catch(p){return o(p)}f.onsuccess=()=>s({modelArtifactsInfo:a}),f.onerror=p=>{l=c.objectStore(qe);const x=l.delete(this.modelPath);x.onsuccess=()=>(i.close(),o(f.error)),x.onerror=g=>(i.close(),o(f.error))}},u.onerror=h=>(i.close(),o(u.error)),c.oncomplete=()=>{d==null?i.close():d.oncomplete=()=>i.close()}}},r.onerror=i=>o(r.error)})}}ut.URL_SCHEME="indexeddb://";const Kr=n=>v().getBool("IS_BROWSER")&&!Array.isArray(n)&&n.startsWith(ut.URL_SCHEME)?lh(n.slice(ut.URL_SCHEME.length)):null;te.registerSaveRouter(Kr);te.registerLoadRouter(Kr);function lh(n){return new ut(n)}function uh(n){return n.startsWith(ut.URL_SCHEME)?n.slice(ut.URL_SCHEME.length):n}class dh{constructor(){this.indexedDB=qr()}async listModels(){return new Promise((e,t)=>{const s=this.indexedDB.open(gs,xs);s.onupgradeneeded=()=>Cs(s),s.onsuccess=()=>{const o=s.result,r=o.transaction(qe,"readonly"),a=r.objectStore(qe).getAll();a.onsuccess=()=>{const c={};for(const l of a.result)c[l.modelPath]=l.modelArtifactsInfo;e(c)},a.onerror=c=>(o.close(),t(a.error)),r.oncomplete=()=>o.close()},s.onerror=o=>t(s.error)})}async removeModel(e){return e=uh(e),new Promise((t,s)=>{const o=this.indexedDB.open(gs,xs);o.onupgradeneeded=()=>Cs(o),o.onsuccess=()=>{const r=o.result,i=r.transaction(qe,"readwrite"),a=i.objectStore(qe),c=a.get(e);let l;c.onsuccess=()=>{if(c.result==null)return r.close(),s(new Error(`Cannot find model with path '${e}' in IndexedDB.`));{const u=a.delete(e),d=()=>{l=r.transaction(rt,"readwrite");const f=l.objectStore(rt).delete(e);f.onsuccess=()=>t(c.result.modelArtifactsInfo),f.onerror=p=>s(c.error)};u.onsuccess=d,u.onerror=h=>(d(),r.close(),s(c.error))}},c.onerror=u=>(r.close(),s(c.error)),i.oncomplete=()=>{l==null?r.close():l.oncomplete=()=>r.close()}},o.onerror=r=>s(o.error)})}}const We="/",Et="tensorflowjs_models",Yr="info",hh="model_topology",fh="weight_specs",ph="weight_data",mh="model_metadata";function Qr(n){return{info:[Et,n,Yr].join(We),topology:[Et,n,hh].join(We),weightSpecs:[Et,n,fh].join(We),weightData:[Et,n,ph].join(We),modelMetadata:[Et,n,mh].join(We)}}function Zr(n){for(const e of Object.values(n))window.localStorage.removeItem(e)}function gh(n){const e=n.split(We);if(e.length<3)throw new Error(`Invalid key format: ${n}`);return e.slice(1,e.length-1).join(We)}function xh(n){return n.startsWith(dt.URL_SCHEME)?n.slice(dt.URL_SCHEME.length):n}class dt{constructor(e){if(!v().getBool("IS_BROWSER")||typeof window>"u"||typeof window.localStorage>"u")throw new Error("The current environment does not support local storage.");if(this.LS=window.localStorage,e==null||!e)throw new Error("For local storage, modelPath must not be null, undefined or empty.");this.modelPath=e,this.keys=Qr(this.modelPath)}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");{const t=JSON.stringify(e.modelTopology),s=JSON.stringify(e.weightSpecs),o=zn(e),r=bt.join(e.weightData);try{this.LS.setItem(this.keys.info,JSON.stringify(o)),this.LS.setItem(this.keys.topology,t),this.LS.setItem(this.keys.weightSpecs,s),this.LS.setItem(this.keys.weightData,rh(r));const i={format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,signature:e.signature!=null?e.signature:void 0,userDefinedMetadata:e.userDefinedMetadata!=null?e.userDefinedMetadata:void 0,modelInitializer:e.modelInitializer!=null?e.modelInitializer:void 0,initializerSignature:e.initializerSignature!=null?e.initializerSignature:void 0,trainingConfig:e.trainingConfig!=null?e.trainingConfig:void 0};return this.LS.setItem(this.keys.modelMetadata,JSON.stringify(i)),{modelArtifactsInfo:o}}catch{throw Zr(this.keys),new Error(`Failed to save model '${this.modelPath}' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=${o.modelTopologyBytes}, weightSpecsBytes=${o.weightSpecsBytes}, weightDataBytes=${o.weightDataBytes}.`)}}}async load(){const e=JSON.parse(this.LS.getItem(this.keys.info));if(e==null)throw new Error(`In local storage, there is no model with name '${this.modelPath}'`);if(e.modelTopologyType!=="JSON")throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");const t={},s=JSON.parse(this.LS.getItem(this.keys.topology));if(s==null)throw new Error(`In local storage, the topology of model '${this.modelPath}' is missing.`);t.modelTopology=s;const o=JSON.parse(this.LS.getItem(this.keys.weightSpecs));if(o==null)throw new Error(`In local storage, the weight specs of model '${this.modelPath}' are missing.`);t.weightSpecs=o;const r=this.LS.getItem(this.keys.modelMetadata);if(r!=null){const a=JSON.parse(r);t.format=a.format,t.generatedBy=a.generatedBy,t.convertedBy=a.convertedBy,a.signature!=null&&(t.signature=a.signature),a.userDefinedMetadata!=null&&(t.userDefinedMetadata=a.userDefinedMetadata),a.modelInitializer!=null&&(t.modelInitializer=a.modelInitializer),a.initializerSignature!=null&&(t.initializerSignature=a.initializerSignature),a.trainingConfig!=null&&(t.trainingConfig=a.trainingConfig)}const i=this.LS.getItem(this.keys.weightData);if(i==null)throw new Error(`In local storage, the binary weight values of model '${this.modelPath}' are missing.`);return t.weightData=ih(i),t}}dt.URL_SCHEME="localstorage://";const Jr=n=>v().getBool("IS_BROWSER")&&!Array.isArray(n)&&n.startsWith(dt.URL_SCHEME)?Ch(n.slice(dt.URL_SCHEME.length)):null;te.registerSaveRouter(Jr);te.registerLoadRouter(Jr);function Ch(n){return new dt(n)}class bh{constructor(){D(v().getBool("IS_BROWSER"),()=>"Current environment is not a web browser"),D(typeof window>"u"||typeof window.localStorage<"u",()=>"Current browser does not appear to support localStorage"),this.LS=window.localStorage}async listModels(){const e={},t=Et+We,s=We+Yr;for(let o=0;o<this.LS.length;++o){const r=this.LS.key(o);if(r.startsWith(t)&&r.endsWith(s)){const i=gh(r);e[i]=JSON.parse(this.LS.getItem(r))}}return e}async removeModel(e){e=xh(e);const t=Qr(e);if(this.LS.getItem(t.info)==null)throw new Error(`Cannot find model at path '${e}'`);const s=JSON.parse(this.LS.getItem(t.info));return Zr(t),s}}const Eo="://";class _e{constructor(){this.managers={}}static getInstance(){return _e.instance==null&&(_e.instance=new _e),_e.instance}static registerManager(e,t){D(e!=null,()=>"scheme must not be undefined or null."),e.endsWith(Eo)&&(e=e.slice(0,e.indexOf(Eo))),D(e.length>0,()=>"scheme must not be an empty string.");const s=_e.getInstance();D(s.managers[e]==null,()=>`A model store manager is already registered for scheme '${e}'.`),s.managers[e]=t}static getManager(e){const t=_e.getInstance().managers[e];if(t==null)throw new Error(`Cannot find model manager for scheme '${e}'`);return t}static getSchemes(){return Object.keys(_e.getInstance().managers)}}class wh{constructor(){this.messageName="setTimeoutCustom",this.functionRefs=[],this.handledMessageCount=0,this.hasEventListener=!1}fetch(e,t){return fetch(e,t)}now(){return performance.now()}encode(e,t){if(t!=="utf-8"&&t!=="utf8")throw new Error(`Browser's encoder only supports utf-8, but got ${t}`);return this.textEncoder==null&&(this.textEncoder=new TextEncoder),this.textEncoder.encode(e)}decode(e,t){return new TextDecoder(t).decode(e)}setTimeoutCustom(e,t){if(typeof window>"u"||!v().getBool("USE_SETTIMEOUTCUSTOM")){setTimeout(e,t);return}this.functionRefs.push(e),setTimeout(()=>{window.postMessage({name:this.messageName,index:this.functionRefs.length-1},"*")},t),this.hasEventListener||(this.hasEventListener=!0,window.addEventListener("message",s=>{if(s.source===window&&s.data.name===this.messageName){s.stopPropagation();const o=this.functionRefs[s.data.index];o(),this.handledMessageCount++,this.handledMessageCount===this.functionRefs.length&&(this.functionRefs=[],this.handledMessageCount=0)}},!0))}isTypedArray(e){return Fr(e)}}if(v().get("IS_BROWSER")){v().setPlatform("browser",new wh);try{_e.registerManager(dt.URL_SCHEME,new bh)}catch{}try{_e.registerManager(ut.URL_SCHEME,new dh)}catch{}}const yh={importFetch:()=>require("node-fetch")};let ss;class vh{constructor(){this.util=require("util"),this.textEncoder=new this.util.TextEncoder}fetch(e,t){return v().global.fetch!=null?v().global.fetch(e,t):(ss==null&&(ss=yh.importFetch()),ss(e,t))}now(){const e=process.hrtime();return e[0]*1e3+e[1]/1e6}encode(e,t){if(t!=="utf-8"&&t!=="utf8")throw new Error(`Node built-in encoder only supports utf-8, but got ${t}`);return this.textEncoder.encode(e)}decode(e,t){return e.length===0?"":new this.util.TextDecoder(t).decode(e)}isTypedArray(e){return this.util.types.isFloat32Array(e)||this.util.types.isInt32Array(e)||this.util.types.isUint8Array(e)||this.util.types.isUint8ClampedArray(e)}}v().get("IS_NODE")&&!v().get("IS_BROWSER")&&v().setPlatform("node",new vh);function re(n,e="float32",t){return e=e||"float32",hn(n),new Dn(n,e,t)}function $h(n,e){const t=K(n,"x","cast");if(!Sc(e))throw new Error(`Failed to cast to unknown dtype ${e}`);if(e==="string"&&t.dtype!=="string"||e!=="string"&&t.dtype==="string")throw new Error("Only strings can be casted to strings");const s={x:t},o={dtype:e};return _.runKernel(Bs,s,o)}const bs=fe({cast_:$h});function Sh(n){const t={x:K(n,"x","clone","string_or_numeric")};return _.runKernel(Ms,t)}const ei=fe({clone_:Sh});function Ih(n,e=!1){console.log(n.toString(e))}Gr();const Rh={buffer:re,cast:bs,clone:ei,print:Ih};Hd(Rh);function Th(n,e){let t=K(n,"a","add"),s=K(e,"b","add");[t,s]=Ct(t,s);const o={a:t,b:s};return _.runKernel(Ls,o)}const G=fe({add_:Th});function Eh(n,e){let t=K(n,"a","floorDiv"),s=K(e,"b","floorDiv");[t,s]=Ct(t,s);const o={a:t,b:s};return _.runKernel(vr,o)}const Nh=fe({floorDiv_:Eh});function kh(n,e){let t=K(n,"a","div"),s=K(e,"b","div");if([t,s]=Ct(t,s),t.dtype==="int32"&&s.dtype==="int32")return Nh(t,s);const o={a:t,b:s},r={};return _.runKernel(wr,o,r)}const Be=fe({div_:kh});function Ah(n,e){let t=K(n,"a","mul"),s=K(e,"b","mul");[t,s]=Ct(t,s);const o={a:t,b:s};return _.runKernel(Sr,o)}const M=fe({mul_:Ah});function Fh(n){const e=K(n,"x","abs");if(e.dtype==="complex64"){const t={x:e};return _.runKernel(br,t)}else{const t={x:e};return _.runKernel(xr,t)}}const Dh=fe({abs_:Fh});function ti(n,e,t,s,o="NHWC",r){const i=n[3],a=[...e,i],c=Mt(o);return Oe(n,a,t,r,s,null,null,c)}function Lt(n,e,t,s,o,r,i="channelsLast"){const[a,c]=Pn(e);let l;if(i==="channelsLast")l=[a,c,n[3],n[3]];else if(i==="channelsFirst")l=[a,c,n[1],n[1]];else throw new Error(`Unknown dataFormat ${i}`);return Oe(n,l,t,s,o,r,!1,i)}function fn(n,e,t,s,o,r,i="NDHWC"){const[a,c,l]=ws(e);let u,d;if(i==="NDHWC")d="channelsLast",u=[a,c,l,n[4],n[4]];else if(i==="NCDHW")d="channelsFirst",u=[a,c,l,n[1],n[1]];else throw new Error(`Unknown dataFormat ${i}`);return pn(n,u,t,s,o,!1,d,r)}function Oe(n,e,t,s,o,r,i=!1,a="channelsLast"){let[c,l,u,d]=[-1,-1,-1,-1];if(a==="channelsLast")[c,l,u,d]=n;else if(a==="channelsFirst")[c,d,l,u]=n;else throw new Error(`Unknown dataFormat ${a}`);const[h,f,,p]=e,[x,g]=Pn(t),[m,C]=Pn(s),w=kt(h,m),y=kt(f,C),{padInfo:I,outHeight:N,outWidth:E}=_h(o,l,u,x,g,w,y,r,a),R=i?p*d:p;let S;return a==="channelsFirst"?S=[c,R,N,E]:a==="channelsLast"&&(S=[c,N,E,R]),{batchSize:c,dataFormat:a,inHeight:l,inWidth:u,inChannels:d,outHeight:N,outWidth:E,outChannels:R,padInfo:I,strideHeight:x,strideWidth:g,filterHeight:h,filterWidth:f,effectiveFilterHeight:w,effectiveFilterWidth:y,dilationHeight:m,dilationWidth:C,inShape:n,outShape:S,filterShape:e}}function pn(n,e,t,s,o,r=!1,i="channelsLast",a){let[c,l,u,d,h]=[-1,-1,-1,-1,-1];if(i==="channelsLast")[c,l,u,d,h]=n;else if(i==="channelsFirst")[c,h,l,u,d]=n;else throw new Error(`Unknown dataFormat ${i}`);const[f,p,x,,g]=e,[m,C,w]=ws(t),[y,I,N]=ws(s),E=kt(f,y),R=kt(p,I),S=kt(x,N),{padInfo:$,outDepth:b,outHeight:T,outWidth:P}=Lh(o,l,u,d,m,C,w,E,R,S,a),B=r?g*h:g;let L;return i==="channelsFirst"?L=[c,B,b,T,P]:i==="channelsLast"&&(L=[c,b,T,P,B]),{batchSize:c,dataFormat:i,inDepth:l,inHeight:u,inWidth:d,inChannels:h,outDepth:b,outHeight:T,outWidth:P,outChannels:B,padInfo:$,strideDepth:m,strideHeight:C,strideWidth:w,filterDepth:f,filterHeight:p,filterWidth:x,effectiveFilterDepth:E,effectiveFilterHeight:R,effectiveFilterWidth:S,dilationDepth:y,dilationHeight:I,dilationWidth:N,inShape:n,outShape:L,filterShape:e}}function Oh(n,e,t,s,o){s==null&&(s=Ws(n,e,t));const r=n[0],i=n[1],a=on((r-e+2*s)/t+1,o),c=on((i-e+2*s)/t+1,o);return[a,c]}function Ph(n,e,t,s,o,r){o==null&&(o=Ws(n,e[0],s[0]));const i=[0,0,0,t];for(let a=0;a<3;a++)n[a]+2*o>=e[a]&&(i[a]=on((n[a]-e[a]+2*o)/s[a]+1,r));return i}function Ws(n,e,t,s=1){const o=kt(e,s);return Math.floor((n[0]*(t-1)-t+o)/2)}function Pn(n){return typeof n=="number"?[n,n,n]:n.length===2?[n[0],n[1],1]:n}function ws(n){return typeof n=="number"?[n,n,n]:n}function kt(n,e){return e<=1?n:n+(n-1)*(e-1)}function _h(n,e,t,s,o,r,i,a,c){let l,u,d;if(typeof n=="number"){l={top:n,bottom:n,left:n,right:n,type:n===0?"VALID":"NUMBER"};const f=Oh([e,t],r,s,n,a);u=f[0],d=f[1]}else if(n==="same"){u=Math.ceil(e/s),d=Math.ceil(t/o);const h=Math.max(0,(u-1)*s+r-e),f=Math.max(0,(d-1)*o+i-t),p=Math.floor(h/2),x=h-p,g=Math.floor(f/2),m=f-g;l={top:p,bottom:x,left:g,right:m,type:"SAME"}}else if(n==="valid")l={top:0,bottom:0,left:0,right:0,type:"VALID"},u=Math.ceil((e-r+1)/s),d=Math.ceil((t-i+1)/o);else if(typeof n=="object"){const h=c==="channelsLast"?n[1][0]:n[2][0],f=c==="channelsLast"?n[1][1]:n[2][1],p=c==="channelsLast"?n[2][0]:n[3][0],x=c==="channelsLast"?n[2][1]:n[3][1];l={top:h,bottom:f,left:p,right:x,type:h===0&&f===0&&p===0&&x===0?"VALID":"EXPLICIT"},u=on((e-r+h+f)/s+1,a),d=on((t-i+p+x)/o+1,a)}else throw Error(`Unknown padding parameter: ${n}`);return{padInfo:l,outHeight:u,outWidth:d}}function Lh(n,e,t,s,o,r,i,a,c,l,u){let d,h,f,p;if(n==="valid"&&(n=0),typeof n=="number"){d={top:n,bottom:n,left:n,right:n,front:n,back:n,type:n===0?"VALID":"NUMBER"};const g=Ph([e,t,s,1],[a,c,l],1,[o,r,i],n,u);h=g[0],f=g[1],p=g[2]}else if(n==="same"){h=Math.ceil(e/o),f=Math.ceil(t/r),p=Math.ceil(s/i);const x=(h-1)*o+a-e,g=(f-1)*r+c-t,m=(p-1)*i+l-s,C=Math.floor(x/2),w=x-C,y=Math.floor(g/2),I=g-y,N=Math.floor(m/2),E=m-N;d={top:y,bottom:I,left:N,right:E,front:C,back:w,type:"SAME"}}else throw Error(`Unknown padding parameter: ${n}`);return{padInfo:d,outDepth:h,outHeight:f,outWidth:p}}function on(n,e){if(!e)return Math.trunc(n);switch(e){case"round":return Math.round(n);case"ceil":return Math.ceil(n);case"floor":return Math.floor(n);default:throw new Error(`Unknown roundingMode ${e}`)}}function ys(n){const[e,t,s]=Pn(n);return e===1&&t===1&&s===1}function Bt(n,e){return ys(n)||ys(e)}function Mt(n){if(n==="NHWC")return"channelsLast";if(n==="NCHW")return"channelsFirst";throw new Error(`Unknown dataFormat ${n}`)}function Bh(n,e){const s={x:K(n,"x","reshape","string_or_numeric")},o={shape:e};return _.runKernel(Rr,s,o)}const ni=fe({reshape_:Bh});function Mh(n,e){let t=K(n,"broadcastTo","x");const s=t.shape;if(hn(e),e.length<t.rank)throw new Error(`broadcastTo(): shape.length=${e.length} < input.rank=${t.rank}.`);if(e.length>t.rank){const l=t.shape.slice();for(;l.length<e.length;)l.unshift(1);t=ni(t,l)}const o=t.shape,r=Array.from(e);for(let l=e.length-1;l>=0;l--)if(o[l]===e[l])r[l]=1;else if(t.shape[l]!==1)throw new Error(`broadcastTo(): [${s}] cannot be broadcast to [${e}].`);if(r.map((l,u)=>l>1?u:-1).filter(l=>l>=0).length===0)return ei(t);const a={x:t},c={reps:r};return _.runKernel(Nr,a,c)}const Vh=fe({broadcastTo_:Mh});function Uh(n,e,t){hn(n),t=t||dn(e);const s={shape:n,value:e,dtype:t};return _.runKernel(yr,{},s)}function _n(n,e){const t=n.length,s=[];for(let o=0;o<t;o++){const r=t-1-o,i=n[r]||1;(e[e.length-1-o]||1)>1&&i===1&&s.unshift(r)}return s}function de(n,e){const t=Math.max(n.length,e.length),s=new Array(t);for(let o=0;o<t;o++){let r=n[n.length-o-1];r==null&&(r=1);let i=e[e.length-o-1];if(i==null&&(i=1),r===1)s[t-o-1]=i;else if(i===1)s[t-o-1]=r;else if(r!==i){const a=`Operands could not be broadcast together with shapes ${n} and ${e}.`;throw Error(a)}else s[t-o-1]=r}return s}function Wh(n){const t={x:K(n,"x","zerosLike")};return _.runKernel(kr,t)}const Me=fe({zerosLike_:Wh});function Gs(n,e){for(let t=0;t<n.length;++t)if(n[n.length-t-1]!==e-1-t)return!1;return!0}function si(n,e,t){const s=n.length+e.length,o=[];let r=0,i=0;for(let a=0;a<s;a++)t.indexOf(a)===-1?o.push(n[r++]):o.push(e[i++]);return o}function Ue(n,e){const t=[],s=n.length;for(let r=0;r<s;r++)e.indexOf(r)===-1&&t.push(n[r]);const o=e.map(r=>n[r]);return[t,o]}function Ge(n,e){const t=e.map(s=>1);return si(n,t,e)}function Pe(n,e,t){D(Gs(e,t),()=>`${n} supports only inner-most axes for now. Got axes ${e} and rank-${t} input.`)}function Ie(n,e){if(Gs(n,e))return null;const t=[];for(let s=0;s<e;++s)n.indexOf(s)===-1&&t.push(s);return n.forEach(s=>t.push(s)),t}function zs(n){return n.map((e,t)=>[t,e]).sort((e,t)=>e[1]-t[1]).map(e=>e[0])}function Re(n,e){const t=[];for(let s=e-n;s<e;++s)t.push(s);return t}function Gh(n,e){let t=K(n,"base","pow"),s=K(e,"exp","pow");[t,s]=Ct(t,s);const o={a:t,b:s};return _.runKernel(Ir,o)}const No=fe({pow_:Gh});function Ze(n,e){if((Se(n)&&e!=="string"||Array.isArray(n))&&e!=="complex64")throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");if(e==="string"&&Se(n)&&!(n instanceof Uint8Array))throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return th(n,[],[],e)}function zh(n){const t={x:K(n,"x","sqrt","float32")};return _.runKernel(Tr,t)}const Ot=fe({sqrt_:zh});function Hh(n){const e=K(n,"x","square"),t={};return _.runKernel("Square",{x:e},t)}const at=fe({square_:Hh});function Xh(n,e){D(cs(n),()=>"The f passed in variableGrads(f) must be a function"),D(e==null||Array.isArray(e)&&e.every(l=>l instanceof On),()=>"The varList passed in variableGrads(f, varList) must be an array of variables");const t=e!=null;if(!t){e=[];for(const l in _.registeredVariables)e.push(_.registeredVariables[l])}const s=t?e.filter(l=>!l.trainable):null,o=e.length;e=e.filter(l=>l.trainable),D(e.length>0,()=>`variableGrads() expects at least one of the input variables to be trainable, but none of the ${o} variables is trainable.`);const r=!0,{value:i,grads:a}=_.gradients(n,e,null,r);D(a.some(l=>l!=null),()=>"Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize()."),D(i.rank===0,()=>`The f passed in variableGrads(f) must return a scalar, but it returned a rank-${i.rank} tensor`);const c={};return e.forEach((l,u)=>{a[u]!=null&&(c[l.name]=a[u])}),s?.forEach(l=>c[l.name]=null),{value:i,grads:c}}function jh(n,e){let t=K(n,"a","sub"),s=K(e,"b","sub");[t,s]=Ct(t,s);const o={a:t,b:s};return _.runKernel(Er,o)}const At=fe({sub_:jh});function qh(n,e){let t=K(n,"a","maximum"),s=K(e,"b","maximum");[t,s]=Ct(t,s),t.dtype==="bool"&&(t=bs(t,"int32"),s=bs(s,"int32")),de(t.shape,s.shape);const o={a:t,b:s};return _.runKernel($r,o)}const Kh=fe({maximum_:qh});function vs(n,e="float32"){if(hn(n),e==="complex64"){const s=vs(n,"float32"),o=vs(n,"float32");return eh(s,o)}const t=Qe(F(n),e);return _.makeTensor(t,n,e)}function Hn(n,e,t){const s=e.shape.length,o=s>1?e.shape[s-1]:1,r=t.length;let i=1;for(let d=o;d<r;++d)i*=t[d];const a=o<1?1:o,c=F(e.shape)/a,l=[...se(t.slice(0,o)),1],u=F(t);return{sliceRank:o,numUpdates:c,sliceSize:i,strides:l,outputSize:u}}function Yh(n,e){const t=[];for(let r=0;r<e.length;r++)e[r]&&t.push(r);const s=re(n,"int32"),o=re([t.length,n.length],"int32");for(let r=0;r<t.length;r++){const i=s.indexToLoc(t[r]),a=r*n.length;o.values.set(i,a)}return o.toTensor()}function Qh(n,e,t){const s=Zh(n,e,t),o=s<0?-(s+1):s;n.splice(o,0,e)}function Zh(n,e,t){return ef(n,e,t||Jh)}function Jh(n,e){return n>e?1:n<e?-1:0}function ef(n,e,t){let s=0,o=n.length,r=0,i=!1;for(;s<o;){r=s+(o-s>>>1);const a=t(e,n[r]);a>0?s=r+1:(o=r,i=!a)}return i?s:-s-1}function tf(n,e,t,s,o){return Hs(n,e,t,s,o,0)}function nf(n,e,t,s,o,r){return Hs(n,e,t,s,o,0,!1,r,!0)}function sf(n,e,t,s,o,r){return Hs(n,e,t,s,o,r,!0)}function Hs(n,e,t,s,o,r,i=!1,a=!1,c=!1){const l=[];for(let g=0;g<e.length;g++)e[g]>o&&l.push({score:e[g],boxIndex:g,suppressBeginIndex:0});l.sort(ko);const u=r>0?-.5/r:0,d=[],h=[];for(;d.length<t&&l.length>0;){const g=l.pop(),{score:m,boxIndex:C,suppressBeginIndex:w}=g;if(m<o)break;let y=!1;for(let I=d.length-1;I>=w;--I){const N=of(n,C,d[I]);if(N>=s){y=!0;break}if(g.score=g.score*rf(s,u,N),g.score<=o)break}g.suppressBeginIndex=d.length,y||(g.score===m?(d.push(C),h.push(g.score)):g.score>o&&Qh(l,g,ko))}const f=d.length,p=t-f;a&&p>0&&(d.push(...new Array(p).fill(0)),h.push(...new Array(p).fill(0)));const x={selectedIndices:d};return i&&(x.selectedScores=h),c&&(x.validOutputs=f),x}function of(n,e,t){const s=n.subarray(e*4,e*4+4),o=n.subarray(t*4,t*4+4),r=Math.min(s[0],s[2]),i=Math.min(s[1],s[3]),a=Math.max(s[0],s[2]),c=Math.max(s[1],s[3]),l=Math.min(o[0],o[2]),u=Math.min(o[1],o[3]),d=Math.max(o[0],o[2]),h=Math.max(o[1],o[3]),f=(a-r)*(c-i),p=(d-l)*(h-u);if(f<=0||p<=0)return 0;const x=Math.max(r,l),g=Math.max(i,u),m=Math.min(a,d),C=Math.min(c,h),w=Math.max(m-x,0)*Math.max(C-g,0);return w/(f+p-w)}function rf(n,e,t){const s=Math.exp(e*t*t);return t<=n?s:0}function ko(n,e){return n.score-e.score||n.score===e.score&&e.boxIndex-n.boxIndex}const af=new Map,cf=new Map;class lf{getClassName(){return this.constructor.className}static fromConfig(e,t){return new e(t)}}class st{constructor(){this.classNameMap={}}static getMap(){return st.instance==null&&(st.instance=new st),st.instance}static register(e){st.getMap().classNameMap[e.className]=[e,e.fromConfig]}}function uf(n,e,t){D(n.className!=null,()=>"Class being registered does not have the static className property defined."),D(typeof n.className=="string",()=>"className is required to be a string, but got type "+typeof n.className),D(n.className.length>0,()=>"Class being registered has an empty-string as its className, which is disallowed."),typeof e>"u"&&(e="Custom"),typeof t>"u"&&(t=n.className);const s=t,o=e+">"+s;return st.register(n),af.set(o,n),cf.set(n,o),n}class wt extends lf{minimize(e,t=!1,s){const{value:o,grads:r}=this.computeGradients(e,s);if(s!=null){const i=s.map(a=>({name:a.name,tensor:r[a.name]}));this.applyGradients(i)}else this.applyGradients(r);return ye(r),t?o:(o.dispose(),null)}get iterations(){return this.iterations_==null&&(this.iterations_=0),this.iterations_}incrementIterations(){this.iterations_=this.iterations+1}computeGradients(e,t){return Xh(e,t)}dispose(){this.iterations_!=null&&ye(this.iterations_)}async saveIterations(){return this.iterations_==null&&(this.iterations_=0),{name:"iter",tensor:Ze(this.iterations_,"int32")}}async getWeights(){throw new Error("getWeights() is not implemented for this optimizer yet.")}async setWeights(e){throw new Error(`setWeights() is not implemented for this optimizer class ${this.getClassName()}`)}async extractIterations(e){return this.iterations_=(await e[0].tensor.data())[0],e.slice(1)}}Object.defineProperty(wt,Symbol.hasInstance,{value:n=>n.minimize!=null&&n.computeGradients!=null&&n.applyGradients!=null});class df extends wt{static get className(){return"Adadelta"}constructor(e,t,s=null){super(),this.learningRate=e,this.rho=t,this.epsilon=s,this.accumulatedGrads=[],this.accumulatedUpdates=[],s==null&&(this.epsilon=_.backend.epsilon())}applyGradients(e){(Array.isArray(e)?e.map(s=>s.name):Object.keys(e)).forEach((s,o)=>{const r=_.registeredVariables[s],i=!1;this.accumulatedGrads[o]==null&&(this.accumulatedGrads[o]={originalName:`${s}/accum_grad`,variable:Q(()=>Me(r).variable(i))}),this.accumulatedUpdates[o]==null&&(this.accumulatedUpdates[o]={originalName:`${s}/accum_var`,variable:Q(()=>Me(r).variable(i))});const a=Array.isArray(e)?e[o].tensor:e[s];if(a==null)return;const c=this.accumulatedGrads[o].variable,l=this.accumulatedUpdates[o].variable;Q(()=>{const u=G(M(c,this.rho),M(at(a),1-this.rho)),d=M(Be(Ot(G(l,this.epsilon)),Ot(G(c,this.epsilon))),a),h=G(M(l,this.rho),M(at(d),1-this.rho));c.assign(u),l.assign(h);const f=G(M(d,-this.learningRate),r);r.assign(f)})}),this.incrementIterations()}dispose(){this.accumulatedUpdates!=null&&(ye(this.accumulatedGrads.map(e=>e.variable)),ye(this.accumulatedUpdates.map(e=>e.variable)))}async getWeights(){const e=[...this.accumulatedGrads,...this.accumulatedUpdates];return[await this.saveIterations()].concat(e.map(t=>({name:t.originalName,tensor:t.variable})))}async setWeights(e){e=await this.extractIterations(e);const t=e.length/2,s=!1;this.accumulatedGrads=e.slice(0,t).map(o=>({originalName:o.name,variable:o.tensor.variable(s)})),this.accumulatedUpdates=e.slice(t,t*2).map(o=>({originalName:o.name,variable:o.tensor.variable(s)}))}getConfig(){return{learningRate:this.learningRate,rho:this.rho,epsilon:this.epsilon}}static fromConfig(e,t){return new e(t.learningRate,t.rho,t.epsilon)}}class hf extends wt{static get className(){return"Adagrad"}constructor(e,t=.1){super(),this.learningRate=e,this.initialAccumulatorValue=t,this.accumulatedGrads=[]}applyGradients(e){(Array.isArray(e)?e.map(s=>s.name):Object.keys(e)).forEach((s,o)=>{const r=_.registeredVariables[s];this.accumulatedGrads[o]==null&&(this.accumulatedGrads[o]={originalName:`${s}/accumulator`,variable:Q(()=>Uh(r.shape,this.initialAccumulatorValue).variable(!1))});const i=Array.isArray(e)?e[o].tensor:e[s];if(i==null)return;const a=this.accumulatedGrads[o].variable;Q(()=>{const c=G(a,at(i));a.assign(c);const l=G(M(Be(i,Ot(G(c,_.backend.epsilon()))),-this.learningRate),r);r.assign(l)})}),this.incrementIterations()}dispose(){this.accumulatedGrads!=null&&ye(this.accumulatedGrads.map(e=>e.variable))}async getWeights(){return[await this.saveIterations()].concat(this.accumulatedGrads.map(e=>({name:e.originalName,tensor:e.variable})))}async setWeights(e){e=await this.extractIterations(e);const t=!1;this.accumulatedGrads=e.map(s=>({originalName:s.name,variable:s.tensor.variable(t)}))}getConfig(){return{learningRate:this.learningRate,initialAccumulatorValue:this.initialAccumulatorValue}}static fromConfig(e,t){return new e(t.learningRate,t.initialAccumulatorValue)}}class ff extends wt{static get className(){return"Adam"}constructor(e,t,s,o=null){super(),this.learningRate=e,this.beta1=t,this.beta2=s,this.epsilon=o,this.accumulatedFirstMoment=[],this.accumulatedSecondMoment=[],Q(()=>{this.accBeta1=Ze(t).variable(),this.accBeta2=Ze(s).variable()}),o==null&&(this.epsilon=_.backend.epsilon())}applyGradients(e){const t=Array.isArray(e)?e.map(s=>s.name):Object.keys(e);Q(()=>{const s=At(1,this.accBeta1),o=At(1,this.accBeta2);t.forEach((r,i)=>{const a=_.registeredVariables[r],c=!1;this.accumulatedFirstMoment[i]==null&&(this.accumulatedFirstMoment[i]={originalName:`${r}/m`,variable:Q(()=>Me(a).variable(c))}),this.accumulatedSecondMoment[i]==null&&(this.accumulatedSecondMoment[i]={originalName:`${r}/v`,variable:Q(()=>Me(a).variable(c))});const l=Array.isArray(e)?e[i].tensor:e[r];if(l==null)return;const u=this.accumulatedFirstMoment[i].variable,d=this.accumulatedSecondMoment[i].variable,h=G(M(u,this.beta1),M(l,1-this.beta1)),f=G(M(d,this.beta2),M(at(l),1-this.beta2)),p=Be(h,s),x=Be(f,o);u.assign(h),d.assign(f);const g=G(M(Be(p,G(Ot(x),this.epsilon)),-this.learningRate),a);a.assign(g)}),this.accBeta1.assign(M(this.accBeta1,this.beta1)),this.accBeta2.assign(M(this.accBeta2,this.beta2))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.accBeta2.dispose(),this.accumulatedFirstMoment!=null&&ye(this.accumulatedFirstMoment.map(e=>e.variable)),this.accumulatedSecondMoment!=null&&ye(this.accumulatedSecondMoment.map(e=>e.variable))}async getWeights(){const e=[...this.accumulatedFirstMoment,...this.accumulatedSecondMoment];return[await this.saveIterations()].concat(e.map(t=>({name:t.originalName,tensor:t.variable})))}async setWeights(e){e=await this.extractIterations(e),Q(()=>{this.accBeta1.assign(No(this.beta1,this.iterations_+1)),this.accBeta2.assign(No(this.beta2,this.iterations_+1))});const t=e.length/2,s=!1;this.accumulatedFirstMoment=e.slice(0,t).map(o=>({originalName:o.name,variable:o.tensor.variable(s)})),this.accumulatedSecondMoment=e.slice(t,t*2).map(o=>({originalName:o.name,variable:o.tensor.variable(s)}))}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon}}static fromConfig(e,t){return new e(t.learningRate,t.beta1,t.beta2,t.epsilon)}}class pf extends wt{static get className(){return"Adamax"}constructor(e,t,s,o=null,r=0){super(),this.learningRate=e,this.beta1=t,this.beta2=s,this.epsilon=o,this.decay=r,this.accumulatedFirstMoment=[],this.accumulatedWeightedInfNorm=[],Q(()=>{this.iteration=Ze(0).variable(),this.accBeta1=Ze(t).variable()}),o==null&&(this.epsilon=_.backend.epsilon())}applyGradients(e){const t=Array.isArray(e)?e.map(s=>s.name):Object.keys(e);Q(()=>{const s=At(1,this.accBeta1),o=Be(-this.learningRate,G(M(this.iteration,this.decay),1));t.forEach((r,i)=>{const a=_.registeredVariables[r],c=!1;this.accumulatedFirstMoment[i]==null&&(this.accumulatedFirstMoment[i]={originalName:`${r}/m`,variable:Me(a).variable(c)}),this.accumulatedWeightedInfNorm[i]==null&&(this.accumulatedWeightedInfNorm[i]={originalName:`${r}/v`,variable:Me(a).variable(c)});const l=Array.isArray(e)?e[i].tensor:e[r];if(l==null)return;const u=this.accumulatedFirstMoment[i].variable,d=this.accumulatedWeightedInfNorm[i].variable,h=G(M(u,this.beta1),M(l,1-this.beta1)),f=M(d,this.beta2),p=Dh(l),x=Kh(f,p);u.assign(h),d.assign(x);const g=G(M(Be(o,s),Be(h,G(x,this.epsilon))),a);a.assign(g)}),this.iteration.assign(G(this.iteration,1)),this.accBeta1.assign(M(this.accBeta1,this.beta1))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.iteration.dispose(),this.accumulatedFirstMoment!=null&&ye(this.accumulatedFirstMoment.map(e=>e.variable)),this.accumulatedWeightedInfNorm!=null&&ye(this.accumulatedWeightedInfNorm.map(e=>e.variable))}async getWeights(){throw new Error("getWeights() is not implemented for Adamax yet.")}async setWeights(e){throw new Error("setWeights() is not implemented for Adamax yet.")}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon,decay:this.decay}}static fromConfig(e,t){return new e(t.learningRate,t.beta1,t.beta2,t.epsilon,t.decay)}}class oi extends wt{static get className(){return"SGD"}constructor(e){super(),this.learningRate=e,this.setLearningRate(e)}applyGradients(e){(Array.isArray(e)?e.map(s=>s.name):Object.keys(e)).forEach((s,o)=>{const r=Array.isArray(e)?e[o].tensor:e[s];if(r==null)return;const i=_.registeredVariables[s];Q(()=>{const a=G(M(this.c,r),i);i.assign(a)})}),this.incrementIterations()}setLearningRate(e){this.learningRate=e,this.c!=null&&this.c.dispose(),this.c=sh(Ze(-e))}dispose(){this.c.dispose()}async getWeights(){return[await this.saveIterations()]}async setWeights(e){if(e=await this.extractIterations(e),e.length!==0)throw new Error("SGD optimizer does not have settable weights.")}getConfig(){return{learningRate:this.learningRate}}static fromConfig(e,t){return new e(t.learningRate)}}class mf extends oi{static get className(){return"Momentum"}constructor(e,t,s=!1){super(e),this.learningRate=e,this.momentum=t,this.useNesterov=s,this.accumulations=[],this.m=Ze(this.momentum)}applyGradients(e){(Array.isArray(e)?e.map(s=>s.name):Object.keys(e)).forEach((s,o)=>{const r=_.registeredVariables[s];this.accumulations[o]==null&&(this.accumulations[o]={originalName:`${s}/momentum`,variable:Q(()=>Me(r).variable(!1))});const i=this.accumulations[o].variable,a=Array.isArray(e)?e[o].tensor:e[s];a!=null&&Q(()=>{let c;const l=G(M(this.m,i),a);this.useNesterov?c=G(M(this.c,G(a,M(l,this.m))),r):c=G(M(this.c,l),r),i.assign(l),r.assign(c)})}),this.incrementIterations()}dispose(){this.m.dispose(),this.accumulations!=null&&ye(this.accumulations.map(e=>e.variable))}setMomentum(e){this.momentum=e}async getWeights(){return[await this.saveIterations()].concat(this.accumulations.map(e=>({name:e.originalName,tensor:e.variable})))}async setWeights(e){e=await this.extractIterations(e);const t=!1;this.accumulations=e.map(s=>({originalName:s.name,variable:s.tensor.variable(t)}))}getConfig(){return{learningRate:this.learningRate,momentum:this.momentum,useNesterov:this.useNesterov}}static fromConfig(e,t){return new e(t.learningRate,t.momentum,t.useNesterov)}}class gf extends wt{static get className(){return"RMSProp"}constructor(e,t=.9,s=0,o=null,r=!1){if(super(),this.learningRate=e,this.decay=t,this.momentum=s,this.epsilon=o,this.accumulatedMeanSquares=[],this.accumulatedMoments=[],this.accumulatedMeanGrads=[],this.centered=r,o==null&&(this.epsilon=_.backend.epsilon()),e==null)throw new Error("learningRate for RMSPropOptimizer must be defined.")}applyGradients(e){(Array.isArray(e)?e.map(s=>s.name):Object.keys(e)).forEach((s,o)=>{const r=_.registeredVariables[s],i=!1;this.accumulatedMeanSquares[o]==null&&(this.accumulatedMeanSquares[o]={originalName:`${s}/rms`,variable:Q(()=>Me(r).variable(i))}),this.accumulatedMoments[o]==null&&(this.accumulatedMoments[o]={originalName:`${s}/momentum`,variable:Q(()=>Me(r).variable(i))}),this.accumulatedMeanGrads[o]==null&&this.centered&&(this.accumulatedMeanGrads[o]={originalName:`${s}/mg`,variable:Q(()=>Me(r).variable(i))});const a=Array.isArray(e)?e[o].tensor:e[s];if(a==null)return;const c=this.accumulatedMeanSquares[o].variable,l=this.accumulatedMoments[o].variable;Q(()=>{const u=G(M(c,this.decay),M(at(a),1-this.decay));if(this.centered){const d=this.accumulatedMeanGrads[o].variable,h=G(M(d,this.decay),M(a,1-this.decay)),f=Be(M(a,this.learningRate),Ot(At(u,G(at(h),this.epsilon)))),p=G(M(l,this.momentum),f);c.assign(u),d.assign(h),l.assign(p);const x=At(r,p);r.assign(x)}else{const d=G(M(c,this.decay),M(at(a),1-this.decay)),h=G(M(l,this.momentum),Be(M(a,this.learningRate),Ot(G(d,this.epsilon))));c.assign(d),l.assign(h);const f=At(r,h);r.assign(f)}})}),this.incrementIterations()}dispose(){this.accumulatedMeanSquares!=null&&ye(this.accumulatedMeanSquares.map(e=>e.variable)),this.accumulatedMeanGrads!=null&&this.centered&&ye(this.accumulatedMeanGrads.map(e=>e.variable)),this.accumulatedMoments!=null&&ye(this.accumulatedMoments.map(e=>e.variable))}async getWeights(){const e=[...this.accumulatedMeanSquares,...this.accumulatedMoments];return this.centered&&e.push(...this.accumulatedMeanGrads),[await this.saveIterations()].concat(e.map(t=>({name:t.originalName,tensor:t.variable})))}async setWeights(e){e=await this.extractIterations(e);const t=this.centered?e.length/3:e.length/2,s=!1;this.accumulatedMeanSquares=e.slice(0,t).map(o=>({originalName:o.name,variable:o.tensor.variable(s)})),this.accumulatedMoments=e.slice(t,t*2).map(o=>({originalName:o.name,variable:o.tensor.variable(s)})),this.centered&&(this.accumulatedMeanGrads=e.slice(t*2,t*3).map(o=>({originalName:o.name,variable:o.tensor.variable(s)})))}getConfig(){return{learningRate:this.learningRate,decay:this.decay,momentum:this.momentum,epsilon:this.epsilon,centered:this.centered}}static fromConfig(e,t){return new e(t.learningRate,t.decay,t.momentum,t.epsilon,t.centered)}}const xf=[df,hf,ff,pf,mf,gf,oi];function Cf(){for(const n of xf)uf(n)}const bf="model",wf=".json",yf=".weights.bin";function Ao(n){return new Promise(e=>setTimeout(e)).then(n)}class ht{constructor(e){if(!v().getBool("IS_BROWSER"))throw new Error("browserDownloads() cannot proceed because the current environment is not a browser.");e.startsWith(ht.URL_SCHEME)&&(e=e.slice(ht.URL_SCHEME.length)),(e==null||e.length===0)&&(e=bf),this.modelJsonFileName=e+wf,this.weightDataFileName=e+yf}async save(e){if(typeof document>"u")throw new Error("Browser downloads are not supported in this environment since `document` is not present");const t=bt.join(e.weightData),s=window.URL.createObjectURL(new Blob([t],{type:"application/octet-stream"}));if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserDownloads.save() does not support saving model topology in binary formats yet.");{const o=[{paths:["./"+this.weightDataFileName],weights:e.weightSpecs}],r=jr(e,o),i=window.URL.createObjectURL(new Blob([JSON.stringify(r)],{type:"application/json"})),a=this.modelJsonAnchor==null?document.createElement("a"):this.modelJsonAnchor;if(a.download=this.modelJsonFileName,a.href=i,await Ao(()=>a.dispatchEvent(new MouseEvent("click"))),e.weightData!=null){const c=this.weightDataAnchor==null?document.createElement("a"):this.weightDataAnchor;c.download=this.weightDataFileName,c.href=s,await Ao(()=>c.dispatchEvent(new MouseEvent("click")))}return{modelArtifactsInfo:zn(e)}}}}ht.URL_SCHEME="downloads://";const vf=n=>v().getBool("IS_BROWSER")&&!Array.isArray(n)&&n.startsWith(ht.URL_SCHEME)?$f(n.slice(ht.URL_SCHEME.length)):null;te.registerSaveRouter(vf);function $f(n="model"){return new ht(n)}function Fo(n,e,t,s){i(n),t=t??0,s=s??1,a(t,s);let o=0;const r=c=>(c.then(l=>{const u=t+ ++o/n.length*(s-t);return e(u),l}),c);function i(c){D(c!=null&&Array.isArray(c)&&c.length>0,()=>"promises must be a none empty array")}function a(c,l){D(c>=0&&c<=1,()=>`Progress fraction must be in range [0, 1], but got startFraction ${c}`),D(l>=0&&l<=1,()=>`Progress fraction must be in range [0, 1], but got endFraction ${l}`),D(l>=c,()=>`startFraction must be no more than endFraction, but got startFraction ${c} and endFraction ${l}`)}return Promise.all(n.map(r))}async function Sf(n,e){e==null&&(e={});const t=e.fetchFunc==null?v().platform.fetch:e.fetchFunc,s=n.map(d=>t(d,e.requestInit,{isBinary:!0})),a=(e.onProgress==null?await Promise.all(s):await Fo(s,e.onProgress,0,.5)).map(d=>d.arrayBuffer());return e.onProgress==null?await Promise.all(a):await Fo(a,e.onProgress,.5,1)}function If(n,e){var t;const s=e.fetchFunc==null?v().platform.fetch:e.fetchFunc;let o=0,r;return(t=e.onProgress)===null||t===void 0||t.call(e,0),new ReadableStream({pull:async i=>{for(var a;o<n.length;){r||(r=(await s(n[o],e.requestInit,{isBinary:!0})).body.getReader());const{done:c,value:l}=await r.read();if(c){o++,r=void 0,(a=e.onProgress)===null||a===void 0||a.call(e,o/n.length);continue}i.enqueue(l);return}i.close()}})}const Rf="application/octet-stream",Tf="application/json";class Xs{constructor(e,t){if(this.DEFAULT_METHOD="POST",t==null&&(t={}),this.weightPathPrefix=t.weightPathPrefix,this.weightUrlConverter=t.weightUrlConverter,t.fetchFunc!=null?(D(typeof t.fetchFunc=="function",()=>"Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)"),this.fetch=t.fetchFunc):this.fetch=v().platform.fetch,D(e!=null&&e.length>0,()=>"URL path for http must not be null, undefined or empty."),Array.isArray(e)&&D(e.length===2,()=>`URL paths for http must have a length of 2, (actual length is ${e.length}).`),this.path=e,t.requestInit!=null&&t.requestInit.body!=null)throw new Error("requestInit is expected to have no pre-existing body, but has one.");this.requestInit=t.requestInit||{},this.loadOptions=t}async save(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.");const t=Object.assign({method:this.DEFAULT_METHOD},this.requestInit);t.body=new FormData;const s=[{paths:["./model.weights.bin"],weights:e.weightSpecs}],o=jr(e,s);if(t.body.append("model.json",new Blob([JSON.stringify(o)],{type:Tf}),"model.json"),e.weightData!=null){const i=bt.join(e.weightData);t.body.append("model.weights.bin",new Blob([i],{type:Rf}),"model.weights.bin")}const r=await this.fetch(this.path,t);if(r.ok)return{modelArtifactsInfo:zn(e),responses:[r]};throw new Error(`BrowserHTTPRequest.save() failed due to HTTP response status ${r.status}.`)}async loadModelJSON(){const e=await this.fetch(this.path,this.requestInit);if(!e.ok)throw new Error(`Request to ${this.path} failed with status code ${e.status}. Please verify this URL points to the model JSON of the model to load.`);let t;try{t=await e.json()}catch{let i=`Failed to parse model JSON of response from ${this.path}.`;throw this.path.endsWith(".pb")?i+=" Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository.":i+=" Please make sure the server is serving valid JSON for this request.",new Error(i)}const s=t.modelTopology,o=t.weightsManifest;if(s==null&&o==null)throw new Error(`The JSON from HTTP path ${this.path} contains neither model topology or manifest for weights.`);return t}async load(){if(this.loadOptions.streamWeights)return this.loadStream();const e=await this.loadModelJSON();return ch(e,t=>this.loadWeights(t))}async loadStream(){const e=await this.loadModelJSON(),t=await this.getWeightUrls(e.weightsManifest),s=To(e.weightsManifest),o=()=>If(t,this.loadOptions);return Object.assign(Object.assign({},e),{weightSpecs:s,getWeightStream:o})}async getWeightUrls(e){const t=Array.isArray(this.path)?this.path[1]:this.path,[s,o]=Ef(t),r=this.weightPathPrefix||s,i=[],a=[];for(const c of e)for(const l of c.paths)this.weightUrlConverter!=null?a.push(this.weightUrlConverter(l)):i.push(r+l+o);return this.weightUrlConverter&&i.push(...await Promise.all(a)),i}async loadWeights(e){const t=await this.getWeightUrls(e),s=To(e),o=await Sf(t,this.loadOptions);return[s,o]}}Xs.URL_SCHEME_REGEX=/^https?:\/\//;function Ef(n){const e=n.lastIndexOf("/"),t=n.lastIndexOf("?"),s=n.substring(0,e),o=t>e?n.substring(t):"";return[s+"/",o]}function Do(n){return n.match(Xs.URL_SCHEME_REGEX)!=null}const ri=(n,e)=>{if(typeof fetch>"u"&&(e==null||e.fetchFunc==null))return null;{let t=!0;if(Array.isArray(n)?t=n.every(s=>Do(s)):t=Do(n),t)return Nf(n,e)}return null};te.registerSaveRouter(ri);te.registerLoadRouter(ri);function Nf(n,e){return new Xs(n,e)}function ii(n,e){const t=n.shape.length,s=e.shape.length;if(t<1)throw new Error(`tf.gatherND() expects the input to be rank 1 or higher, but the rank was ${t}.`);if(s<1)throw new Error(`tf.gatherND() expects the indices to be rank 1 or higher, but the rank was ${s}.`);if(e.dtype!=="int32")throw new Error(`tf.gatherND() expects the indices to be int32 type, but the dtype was ${e.dtype}.`);if(e.shape[s-1]>t)throw new Error(`index innermost dimension length must be <= tensor rank; saw: ${e.shape[s-1]} vs. ${t}`);if(F(n.shape)===0)throw new Error(`Requested more than 0 entries, but input is empty. Input shape: ${n.shape}.`);const o=e.shape,r=o[o.length-1];let i=1;for(let d=0;d<o.length-1;++d)i*=o[d];const a=n.shape,c=o.slice();c.pop();let l=1;for(let d=r;d<t;++d)l*=a[d],c.push(a[d]);const u=[...se(n.shape).map(d=>d/l),1].slice(0,r);return[c,i,l,u]}const $s=-2,kf=-1;function Af(n,e,t){const s=n.shape.length;D(s===e.length,()=>`Error in slice${s}D: Length of begin ${e} must match the rank of the array (${s}).`),D(s===t.length,()=>`Error in slice${s}D: Length of size ${t} must match the rank of the array (${s}).`);for(let o=0;o<s;++o)D(e[o]+t[o]<=n.shape[o],()=>`Error in slice${s}D: begin[${o}] + size[${o}] (${e[o]+t[o]}) would overflow input.shape[${o}] (${n.shape[o]})`)}function Ff(n,e,t){const s=[];for(let o=0;o<n.length;o++)s[o]=Math.ceil((e[o]-n[o])/t[o]);return s}function ai(n,e,t){let s=t.length;for(let o=0;o<t.length;o++)if(t[o]>1){s=o;break}for(let o=s+1;o<t.length;o++)if(e[o]>0||t[o]!==n[o])return!1;return!0}function ci(n,e){let t=n.length>0?n[n.length-1]:1;for(let s=0;s<n.length-1;s++)t+=n[s]*e[s];return t}function Df(n,e,t){let s;const o=n.shape.length;typeof e=="number"?s=[e,...new Array(o-1).fill(0)]:e.length<o?s=e.concat(new Array(o-e.length).fill(0)):s=e.slice(),s.forEach(i=>{D(i!==-1,()=>"slice() does not support negative begin indexing.")});let r;return t==null?r=new Array(o).fill(-1):typeof t=="number"?r=[t,...new Array(o-1).fill(-1)]:t.length<o?r=t.concat(new Array(o-t.length).fill(-1)):r=t,r=r.map((i,a)=>i>=0?i:(D(i===-1,()=>`Negative size values should be exactly -1 but got ${i} for the slice() size at index ${a}.`),n.shape[a]-s[a])),[s,r]}function Of(n,e,t,s,o,r,i,a,c){let l;if(s==null?(l=new Array(e.length),l.fill(1)):l=s,i!=null&&(i&i-1)!==0)throw new Error("Multiple ellipses in slice is not allowed.");let u=!1;const d={dims:l.length,numAddAxisAfterEllipsis:0,begin:e.slice(),end:t.slice(),strides:l.slice(),beginMask:o,endMask:r,ellipsisMask:i,newAxisMask:a,shrinkAxisMask:c};for(let w=0;w<d.dims;w++)u&&(1<<w&a)!==0&&d.numAddAxisAfterEllipsis++,1<<w&i&&(u=!0);u||(d.ellipsisMask|=1<<d.dims,d.dims++);const h={dims:n.length,beginMask:0,endMask:0,beginValid:!1,endValid:!1};Pf(d,h);let f=!0,p=!0,x=!0;const g=[],m=[];for(let w=0;w<n.length;++w){if(h.strides[w]===0)throw Error(`strides[${w}] must be non-zero`);const y=!!(h.shrinkAxisMask&1<<w),I=n[w];if(I===-1){g.push(y?1:-1);continue}const N=[h.beginMask&1<<w,h.endMask&1<<w],E=[h.strides[w]>0?0:-1,h.strides[w]>0?I:I-1];if(y&&h.strides[w]<=0)throw Error("only stride 1 allowed on non-range indexing.");x=x&&h.strides[w]===1;const R=!!(h.beginMask&1<<w&&h.endMask&1<<w);if(h.beginValid&&h.endValid){if(y){const T=h.begin[w]<0?I+h.begin[w]:h.begin[w];if(h.begin[w]=T,h.end[w]=h.begin[w]+1,T<0||T>=I)throw Error(`slice index ${h.begin[w]} of dimension ${w} out of bounds.`)}else h.begin[w]=Oo(h.begin[w],0,h.strides[w],I,N,E),h.end[w]=Oo(h.end[w],1,h.strides[w],I,N,E);const b=h.strides[w]===1&&h.begin[w]===0&&h.end[w]===I;f=f&&b,p=p&&(w===0&&h.strides[w]===1||b)}else f=f&&h.strides[w]===1&&R,p=p&&(w===0&&h.strides[w]===1||R);let S,$=!1;if(h.beginValid&&h.endValid?(S=h.end[w]-h.begin[w],$=!0):y?(S=1,$=!0):R&&I>=0&&(h.strides[w]<0?S=-I:S=I,$=!0),$){let b;S===0||S<0!=h.strides[w]<0?b=0:b=Math.trunc(S/h.strides[w])+(S%h.strides[w]!==0?1:0),g.push(b)}else g.push(-1)}for(let w=0;w<h.finalShapeGatherIndices.length;++w){const y=h.finalShapeGatherIndices[w];y>=0?m.push(g[y]):y===$s&&m.push(1)}return{finalShapeSparse:m.filter((w,y)=>h.finalShapeGatherIndices[y]!==$s),finalShape:m,isIdentity:f,sliceDim0:p,isSimpleSlice:x,begin:h.begin,end:h.end,strides:h.strides}}function Pf(n,e){e.beginMask=0,e.endMask=0,e.shrinkAxisMask=0;let t=0;e.beginValid=n.begin!=null,e.endValid=n.end!=null,e.begin=new Array(e.dims),e.end=new Array(e.dims),e.strides=new Array(e.dims),e.finalShapeGatherIndices=[],e.finalShapeGatherIndicesSparse=[],e.inputShapeGatherIndicesSparse=new Array(e.dims);for(let s=0;s<n.dims;s++)if(1<<s&n.ellipsisMask){const o=Math.min(e.dims-(n.dims-s)+1+n.numAddAxisAfterEllipsis,e.dims);for(;t<o;t++)e.begin[t]=0,e.end[t]=0,e.strides[t]=1,e.beginMask|=1<<t,e.endMask|=1<<t,e.finalShapeGatherIndices.push(t),e.finalShapeGatherIndicesSparse.push(-1),e.inputShapeGatherIndicesSparse[t]=s}else if(1<<s&n.newAxisMask)e.finalShapeGatherIndices.push($s),e.finalShapeGatherIndicesSparse.push(-1);else{if(t===e.begin.length)throw Error(`Index out of range using input dim ${t}; input has only ${e.dims} dims, ${e.begin.length}.`);n.begin!=null&&(e.begin[t]=n.begin[s]),n.end!=null&&(e.end[t]=n.end[s]),e.strides[t]=n.strides[s],n.beginMask&1<<s&&(e.beginMask|=1<<t),n.endMask&1<<s&&(e.endMask|=1<<t),n.shrinkAxisMask&1<<s?(e.finalShapeGatherIndices.push(kf),e.finalShapeGatherIndicesSparse.push(-1),e.shrinkAxisMask|=1<<t):(e.finalShapeGatherIndices.push(t),e.finalShapeGatherIndicesSparse.push(s)),e.inputShapeGatherIndicesSparse[t]=s,t++}}function Oo(n,e,t,s,o,r){if(o[e])return t>0?r[e]:r[e+1&1];{const i=n<0?s+n:n;return i<r[0]?r[0]:i>r[1]?r[1]:i}}const _f=typeof requestAnimationFrame<"u"?requestAnimationFrame:typeof setImmediate<"u"?setImmediate:n=>n();function Lf(){return new Promise(n=>_f(()=>n()))}function li(n,e){const t=n[0].length;n.forEach((o,r)=>{D(o.length===t,()=>`Error in concat${t}D: rank of tensors[${r}] must be the same as the rank of the rest (${t})`)}),D(e>=0&&e<t,()=>`Error in concat${t}D: axis must be between 0 and ${t-1}.`);const s=n[0];n.forEach((o,r)=>{for(let i=0;i<t;i++)D(i===e||o[i]===s[i],()=>`Error in concat${t}D: Shape of tensors[${r}] (${o}) does not match the shape of the rest (${s}) along the non-concatenated axis ${r}.`)})}function ft(n,e){const t=n[0].slice();for(let s=1;s<n.length;s++)t[e]+=n[s][e];return t}var Ae;(function(n){n[n.FIRST_DIM_SIZE=0]="FIRST_DIM_SIZE",n[n.VALUE_ROWIDS=1]="VALUE_ROWIDS",n[n.ROW_LENGTHS=2]="ROW_LENGTHS",n[n.ROW_SPLITS=3]="ROW_SPLITS",n[n.ROW_LIMITS=4]="ROW_LIMITS",n[n.ROW_STARTS=5]="ROW_STARTS"})(Ae||(Ae={}));function ui(n,e,t){let s=new Array;if(t==null&&e==null)return s;if(e==null)for(;s.length<n+t.length;)s.push(-1);else s=e.slice();if(t==null)return s;if(n+t.length!==s.length)throw new Error(`rt input.shape and shape=${e} are incompatible: rt input.rank = ${n+t.length}, but shape.rank = ${s.length}`);for(let o=1;o<t.length;++o){const r=t[o],i=s[s.length-t.length+o],a=s[i];if(r>=0)if(a>=0){if(a!==r)throw new Error(`rt input.shape and shape=${e} are incompatible: rt input.shape[${o+n}] = ${r} but shape[${o+n}] = ${a}`)}else s[i]=r}return s}function di(n){const e={FIRST_DIM_SIZE:Ae.FIRST_DIM_SIZE,VALUE_ROWIDS:Ae.VALUE_ROWIDS,ROW_LENGTHS:Ae.ROW_LENGTHS,ROW_SPLITS:Ae.ROW_SPLITS,ROW_LIMITS:Ae.ROW_LIMITS,ROW_STARTS:Ae.ROW_STARTS},t=[];for(const s of n)if(s in e)t.push(e[s]);else break;return t}function hi(n){return n.length===0?0:n[0]===Ae.FIRST_DIM_SIZE?n.length-1:n.length}function fi(n,e){if(n==null||e==null)return;const t=n.length,s=e.length;if(t>=s)throw new Error(`defaultValue.shape=${n} and ragged tensor flatValues.shape=${e}, are incompatible: defaultValue.rank = ${t} must be less than ragged tensor input flatValues.rank = ${s})`);for(let o=0;o<Math.min(t,s-1);++o){const r=n[o],i=e[o+1];if(r>=0&&i>=0&&r!==1&&r!==i)throw new Error(`defaultValue.shape=${n}, and ragged tensor input flatValues.shape=${e} are incompatible: defaultValue.shape[${o-n.length}] = ${r} but ragged tensor input.flatValues.shape[${o-n.length}] = ${i}`)}}const js=30;function Xn(n){return n<=js?n:ls(n,Math.floor(Math.sqrt(n)))}function pi(n,e,t){const s=t*(typeof n=="number"?n:n[0]),o=e*(typeof n=="number"?n:n[1]);return[s,o]}function qs(n,e,t,s=!0){let o=[];if(s)o=o.concat(e.slice(0)),o.push(n[0]/t),o=o.concat(n.slice(1));else{o=o.concat(n[0]);const r=e.length;for(let i=0;i<r;++i)o=o.concat([n[i+1]/e[i],e[i]]);o=o.concat(n.slice(r+1))}return o}function Ks(n,e,t=!0){const s=[];if(t){s.push(e);for(let o=e+1;o<n;++o)o<=2*e?(s.push(o),s.push(o-(e+1))):s.push(o)}else{const o=[],r=[];for(let i=1;i<n;++i)i>=e*2+1||i%2===1?r.push(i):o.push(i);s.push(...o),s.push(0),s.push(...r)}return s}function Ys(n,e,t,s=!0){const o=[];s?o.push(n[0]/t):o.push(n[0]*t);for(let r=1;r<n.length;++r)r<=e.length?s?o.push(e[r-1]*n[r]):o.push(n[r]/e[r-1]):o.push(n[r]);return o}function mi(n,e){const t=[0];for(let s=0;s<e;++s)t.push(n[s][0]);return t}function gi(n,e,t){const s=n.slice(0,1);for(let o=0;o<t;++o)s.push(n[o+1]-e[o][0]-e[o][1]);return s}const xi=1.7580993408473768,Ci=1.0507009873554805;const bi=.3275911,wi=.254829592,yi=-.284496736,vi=1.421413741,$i=-1.453152027,Si=1.061405429;function Ss(n,e){if(n.length!==e.length)throw new Error(`Cannot merge real and imag arrays of different lengths. real:${n.length}, imag: ${e.length}.`);const t=new Float32Array(n.length*2);for(let s=0;s<t.length;s+=2)t[s]=n[s/2],t[s+1]=e[s/2];return t}const os="->",Bf=/->/g,Po=",",_o="...";function Ii(n,e){n=n.replace(/\s/g,"");const t=(n.length-n.replace(Bf,"").length)/os.length;if(t<1)throw new Error("Equations without an arrow are not supported.");if(t>1)throw new Error(`Equation must contain exactly one arrow ("${os}").`);const[s,o]=n.split(os);D(s.indexOf(_o)===-1,()=>`The ellipsis notation ("${_o}") is not supported yet.`);const r=s.split(Po),i=r.length;if(e!==i)throw new Error(`Expected ${i} input tensors, received ${e}`);if(i>2)throw new Error("Support for more than 2 input tensors is not implemented yet.");const a=[];for(let h=0;h<o.length;++h){const f=o[h];if(!r.some(p=>p.indexOf(f)!==-1))throw new Error(`Output subscripts contain the label ${f} not present in the input subscripts.`);a.indexOf(f)===-1&&a.push(f)}for(let h=0;h<s.length;++h){const f=s[h];a.indexOf(f)===-1&&f!==Po&&a.push(f)}const c=new Array(r.length);for(let h=0;h<i;++h){if(new Set(r[h].split("")).size!==r[h].length)throw new Error(`Found duplicate axes in input component ${r[h]}. Support for duplicate axes in input is not implemented yet.`);c[h]=[];for(let f=0;f<r[h].length;++f)c[h].push(a.indexOf(r[h][f]))}const l=a.length,u=o.length,d=[];for(let h=u;h<l;++h)d.push(h);return{allDims:a,summedDims:d,idDims:c}}function Ri(n,e){let t=new Array(n);t.fill(-1);for(let o=0;o<e.length;++o)t[e[o]]=o;const s=[];for(let o=0;o<n;++o)t[o]===-1&&s.push(o);return t=t.filter(o=>o!==-1),{permutationIndices:t,expandDims:s}}function Ti(n,e,t){const s=new Array(n);for(let o=0;o<t.length;++o){const r=t[o].shape;for(let i=0;i<e[o].length;++i)s[e[o][i]]===void 0?s[e[o][i]]=r[i]:D(s[e[o][i]]===r[i],()=>`Expected dimension ${s[e[o][i]]} at axis ${i} of input shaped ${JSON.stringify(r)}, but got dimension ${r[i]}`)}}function Ei(n,e){const t=n,s=[];let o=0;n.length===0&&t.push(-1),o=n.length+1;for(let i=0;i<o;++i)s.push([]);const r=[];for(let i=0;i<t.length;++i){const a=t[i],c=Mf(e,a);for(const l of c)r.indexOf(l)===-1&&(s[i].push(l),r.push(l))}return{path:t,steps:s}}function Ni(n){return n.every((e,t)=>e===t)}function Mf(n,e){const t=[];for(let s=0;s<n.length;++s)(n[s].length===0||n[s].indexOf(e)!==-1||e===-1)&&t.push(s);return t}function ki(n,e,t=0){let s=[];if(typeof e=="number")D(n.shape[t]%e===0,()=>"Number of splits must evenly divide the axis."),s=new Array(e).fill(n.shape[t]/e);else{const o=e.reduce((i,a)=>(a===-1&&(i+=1),i),0);D(o<=1,()=>"There should be only one negative value in split array.");const r=e.indexOf(-1);if(r!==-1){const i=e.reduce((a,c)=>c>0?a+c:a);e[r]=n.shape[t]-i}D(n.shape[t]===e.reduce((i,a)=>i+a),()=>"The sum of sizes must match the size of the axis dimension."),s=e}return s}function Ai(n){return`Received SparseTensor with denseShape[0] = 0 but
  indices.shape[0] = ${n}`}function Fi(n,e){return`indices(${n}, 0) is invalid: ${e} < 0`}function Di(n,e,t){return`indices(${n}, 0) is invalid: ${e} >= ${t}`}function Oi(n,e){return`only one output dimension may be -1, not both ${n} and ${e}`}function Pi(n,e){return`size ${n} must be non-negative, not ${e}`}function _i(){return"reshape cannot infer the missing input size for an empty tensor unless all specified input sizes are non-zero"}function Li(n,e){const t=F(n),s=F(e);return`Input to reshape is a SparseTensor with ${t}
  dense values, but the requested shape requires a multiple of ${s}. inputShape=${n} outputShape= ${e}`}function Bi(n,e){const t=F(n),s=F(e);return`Input to reshape is a tensor with ${t} dense values, but the requested shape has ${s}. inputShape=${n} outputShape=${e}`}function Is(){return"segment ids must be >= 0"}function Mi(){return"segment ids are not increasing"}function Vi(n,e){return`Segment id ${n} out of range [0, ${e}), possibly because segmentIds input is not sorted.`}function Ui(n,e,t){return`Bad: indices[${n}] == ${e} out of range [0, ${t})`}function Vf(n,e){let t=!1,s;for(n<=js?(s=n,t=!0):s=ls(n,Math.floor(Math.sqrt(n)));!t;)s>e||s===n?t=!0:s=ls(n,s+1);return s}function Uf(n,e,t){const s=[],o=n.length;for(let r=0;r<o;r++)r!==e?s.push(n[r]):s.push(t);return s}function Wf(n,e,t,s){const o=e.shape.length,r=n.shape.length;if(s!==0&&(s<-o||s>o))throw new Error(`Expect batchDims in the range of [-${o}, ${o}], but got ${s}`);if(s<0&&(s+=o),s>r)throw new Error(`batchDims (${s}) must be less than rank(x) (
    ${r}).`);if(t<s)throw new Error(`batchDims (${s}) must be less than or equal to axis (${t}).`);for(let d=0;d<s;++d)if(n.shape[d]!==e.shape[d])throw new Error(`x.shape[${d}]: ${n.shape[d]} should be equal to indices.shape[${d}]: ${e.shape[d]}.`);const i=n.shape[t],a=[];let c=1,l=1,u=1;for(let d=0;d<s;++d)a.push(n.shape[d]),c*=n.shape[d];for(let d=s;d<t;d++)a.push(n.shape[d]),l*=n.shape[d];for(let d=s;d<o;d++)a.push(e.shape[d]);for(let d=t+1;d<r;d++)a.push(n.shape[d]),u*=n.shape[d];return{batchSize:c,sliceSize:u,outerSize:l,dimSize:i,outputShape:a}}function Pt(n){try{return n.map(e=>Ft(e))}catch(e){throw new Error(`Failed to decode encoded string bytes into utf-8, error: ${e}`)}}function Wi(n){return n.map(e=>it(e))}const Gf=Object.freeze(Object.defineProperty({__proto__:null,ERF_A1:wi,ERF_A2:yi,ERF_A3:vi,ERF_A4:$i,ERF_A5:Si,ERF_P:bi,PARALLELIZE_THRESHOLD:js,get RowPartitionType(){return Ae},SELU_SCALE:Ci,SELU_SCALEALPHA:xi,assertAndGetBroadcastShape:de,assertAxesAreInnerMostDims:Pe,assertParamsConsistent:li,axesAreInnerMostDims:Gs,calculateShapes:Hn,checkEinsumDimSizes:Ti,combineLocations:si,combineRaggedTensorToTensorShapes:ui,computeConv2DInfo:Oe,computeConv3DInfo:pn,computeDefaultPad:Ws,computeDilation2DInfo:ti,computeOptimalWindowSize:Xn,computeOutAndReduceShapes:Ue,computeOutShape:ft,computePool2DInfo:Lt,computePool3DInfo:fn,convertConv2DDataFormat:Mt,decodeEinsumEquation:Ii,eitherStridesOrDilationsAreOne:Bt,expandShapeToKeepDim:Ge,fromStringArrayToUint8:Wi,fromUint8ToStringArray:Pt,getAxesPermutation:Ie,getBroadcastDims:_n,getEinsumComputePath:Ei,getEinsumPermutation:Ri,getImageCenter:pi,getInnerMostAxes:Re,getPermuted:Ks,getRaggedRank:hi,getReshaped:qs,getReshapedPermuted:Ys,getRowPartitionTypesHelper:di,getSliceBeginCoords:mi,getSliceSize:gi,getSparseFillEmptyRowsIndicesDenseShapeMismatch:Ai,getSparseFillEmptyRowsNegativeIndexErrorMessage:Fi,getSparseFillEmptyRowsOutOfRangeIndexErrorMessage:Di,getSparseReshapeEmptyTensorZeroOutputDimErrorMessage:_i,getSparseReshapeInputOutputMismatchErrorMessage:Bi,getSparseReshapeInputOutputMultipleErrorMessage:Li,getSparseReshapeMultipleNegativeOneOutputDimErrorMessage:Oi,getSparseReshapeNegativeOutputDimErrorMessage:Pi,getSparseSegmentReductionIndicesOutOfRangeErrorMessage:Ui,getSparseSegmentReductionNegativeSegmentIdsErrorMessage:Is,getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage:Mi,getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage:Vi,getUndoAxesPermutation:zs,isIdentityPermutation:Ni,mergeRealAndImagArrays:Ss,prepareAndValidate:ii,prepareSplitSize:ki,tupleValuesAreOne:ys,upcastType:Ve,validateDefaultValueShape:fi,warn:Fe},Symbol.toStringTag,{value:"Module"}));Cf();const ot={},wn={alpha:!1,antialias:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,depth:!1,stencil:!1,failIfMajorPerformanceCaveat:!0};function zf(n,e){ot[n]=e}function De(n,e){if(!(n in ot)||e!=null){const s=Xf(n,e);if(s!==null)ot[n]=s;else return console.log("Could not get context for WebGL version",n),null}const t=ot[n];return t==null||t.isContextLost()?(delete ot[n],De(n)):(t.disable(t.DEPTH_TEST),t.disable(t.STENCIL_TEST),t.disable(t.BLEND),t.disable(t.DITHER),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SAMPLE_COVERAGE),t.enable(t.SCISSOR_TEST),t.enable(t.CULL_FACE),t.cullFace(t.BACK),ot[n])}function Hf(n){if(!v().getBool("IS_SAFARI")&&typeof OffscreenCanvas<"u"&&n===2)return new OffscreenCanvas(300,150);if(typeof document<"u")return document.createElement("canvas");throw new Error("Cannot create a canvas in this context")}function Xf(n,e){if(n!==1&&n!==2)throw new Error("Cannot get WebGL rendering context, WebGL is disabled.");const t=e??Hf(n);return t.addEventListener("webglcontextlost",s=>{s.preventDefault(),delete ot[n]},!1),v().getBool("SOFTWARE_WEBGL_ENABLED")&&(wn.failIfMajorPerformanceCaveat=!1),n===1?t.getContext("webgl",wn)||t.getContext("experimental-webgl",wn):t.getContext("webgl2",wn)}var rn;(function(n){n[n.DENSE=0]="DENSE",n[n.SHARED_BATCH=1]="SHARED_BATCH"})(rn||(rn={}));var be;(function(n){n[n.RENDER=0]="RENDER",n[n.UPLOAD=1]="UPLOAD",n[n.PIXELS=2]="PIXELS",n[n.DOWNLOAD=3]="DOWNLOAD"})(be||(be={}));var ne;(function(n){n[n.UNPACKED_FLOAT16=0]="UNPACKED_FLOAT16",n[n.UNPACKED_FLOAT32=1]="UNPACKED_FLOAT32",n[n.PACKED_4X1_UNSIGNED_BYTE=2]="PACKED_4X1_UNSIGNED_BYTE",n[n.PACKED_2X2_FLOAT32=3]="PACKED_2X2_FLOAT32",n[n.PACKED_2X2_FLOAT16=4]="PACKED_2X2_FLOAT16"})(ne||(ne={}));function mn(n,e){return[e,n]}function jf(n,e){return n*e}function yn(n){const e=F(n),t=Math.ceil(e/4);return as(t)}function Vt(n,e){return[Math.max(1,Math.ceil(e/2)),Math.max(1,Math.ceil(n/2))]}function qf(n,e){const[t,s]=Vt(n,e);return t*s*4}function Qs(n,e){const t=n;let s,o,r,i,a,c,l,u,d,h;return v().getNumber("WEBGL_VERSION")===2?(s=t.R32F,o=t.R16F,r=t.RGBA16F,i=t.RGBA32F,a=t.RED,l=4,u=1,d=t.HALF_FLOAT,h=t.FLOAT,c=t.RGBA8):(s=n.RGBA,o=n.RGBA,r=n.RGBA,i=t.RGBA,a=n.RGBA,l=4,u=4,d=e!=null?e.HALF_FLOAT_OES:null,h=n.FLOAT,c=n.RGBA),{internalFormatFloat:s,internalFormatHalfFloat:o,internalFormatPackedHalfFloat:r,internalFormatPackedFloat:i,textureFormatFloat:a,downloadTextureFormat:c,downloadUnpackNumChannels:l,defaultNumChannels:u,textureTypeHalfFloat:d,textureTypeFloat:h}}function A(n,e){const t=e();return v().getBool("DEBUG")&&Kf(n),t}function Kf(n){const e=n.getError();if(e!==n.NO_ERROR)throw new Error("WebGL Error: "+zi(n,e))}const Yf=596e-10,Qf=65504;function Gi(n){return!!(v().getBool("WEBGL_RENDER_FLOAT32_ENABLED")||n===0||Yf<Math.abs(n)&&Math.abs(n)<Qf)}function zi(n,e){switch(e){case n.NO_ERROR:return"NO_ERROR";case n.INVALID_ENUM:return"INVALID_ENUM";case n.INVALID_VALUE:return"INVALID_VALUE";case n.INVALID_OPERATION:return"INVALID_OPERATION";case n.INVALID_FRAMEBUFFER_OPERATION:return"INVALID_FRAMEBUFFER_OPERATION";case n.OUT_OF_MEMORY:return"OUT_OF_MEMORY";case n.CONTEXT_LOST_WEBGL:return"CONTEXT_LOST_WEBGL";default:return`Unknown error code ${e}`}}function Jt(n,e){return ze(n,()=>n.getExtension(e),'Extension "'+e+'" not supported on this browser.')}function Hi(n,e){const t=ze(n,()=>n.createShader(n.VERTEX_SHADER),"Unable to create vertex WebGLShader.");if(A(n,()=>n.shaderSource(t,e)),A(n,()=>n.compileShader(t)),n.getShaderParameter(t,n.COMPILE_STATUS)===!1)throw console.log(n.getShaderInfoLog(t)),new Error("Failed to compile vertex shader.");return t}function Xi(n,e){const t=ze(n,()=>n.createShader(n.FRAGMENT_SHADER),"Unable to create fragment WebGLShader.");if(A(n,()=>n.shaderSource(t,e)),A(n,()=>n.compileShader(t)),v().get("ENGINE_COMPILE_ONLY"))return t;if(n.getShaderParameter(t,n.COMPILE_STATUS)===!1)throw Zs(e,n.getShaderInfoLog(t)),new Error("Failed to compile fragment shader.");return t}const Zf=/ERROR: [0-9]+:([0-9]+):/g;function Zs(n,e){const t=Zf.exec(e);if(t==null){console.log(`Couldn't parse line number in error: ${e}`),console.log(n);return}const s=+t[1],o=n.split(`
`),r=o.length.toString().length+2,i=o.map((d,h)=>Nt((h+1).toString(),r)+d);let a=0;for(let d=0;d<i.length;d++)a=Math.max(i[d].length,a);const c=i.slice(0,s-1),l=i.slice(s-1,s),u=i.slice(s);console.log(c.join(`
`)),console.log(e.split(`
`)[0]),console.log(`%c ${Nt(l[0],a)}`,"border:1px solid red; background-color:#e3d2d2; color:#a61717"),console.log(u.join(`
`))}function ji(n){return ze(n,()=>n.createProgram(),"Unable to create WebGLProgram.")}function qi(n,e){if(A(n,()=>n.linkProgram(e)),!v().get("ENGINE_COMPILE_ONLY")&&n.getProgramParameter(e,n.LINK_STATUS)===!1)throw console.log(n.getProgramInfoLog(e)),new Error("Failed to link vertex and fragment shaders.")}function Rn(n,e){if(A(n,()=>n.validateProgram(e)),n.getProgramParameter(e,n.VALIDATE_STATUS)===!1)throw console.log(n.getProgramInfoLog(e)),new Error("Shader program validation failed.")}function Ki(n,e){const t=ze(n,()=>n.createBuffer(),"Unable to create WebGLBuffer");return A(n,()=>n.bindBuffer(n.ARRAY_BUFFER,t)),A(n,()=>n.bufferData(n.ARRAY_BUFFER,e,n.STATIC_DRAW)),t}function Yi(n,e){const t=ze(n,()=>n.createBuffer(),"Unable to create WebGLBuffer");return A(n,()=>n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t)),A(n,()=>n.bufferData(n.ELEMENT_ARRAY_BUFFER,e,n.STATIC_DRAW)),t}function Jf(){return v().getNumber("WEBGL_VERSION")===2?1:4}function Qi(n){return ze(n,()=>n.createTexture(),"Unable to create WebGLTexture.")}function Zi(n,e){const t=v().getNumber("WEBGL_MAX_TEXTURE_SIZE");if(n<=0||e<=0){const s=`[${n}x${e}]`;throw new Error("Requested texture size "+s+" is invalid.")}if(n>t||e>t){const s=`[${n}x${e}]`,o=`[${t}x${t}]`;throw new Error("Requested texture size "+s+" greater than WebGL maximum on this browser / GPU "+o+".")}}function Ji(n){return ze(n,()=>n.createFramebuffer(),"Unable to create WebGLFramebuffer.")}function Rs(n,e,t,s,o,r,i){const a=n.getAttribLocation(e,t);return a===-1?!1:(A(n,()=>n.bindBuffer(n.ARRAY_BUFFER,s)),A(n,()=>n.vertexAttribPointer(a,o,n.FLOAT,!1,r,i)),A(n,()=>n.enableVertexAttribArray(a)),!0)}function ea(n,e,t){ra(n,t),A(n,()=>n.activeTexture(n.TEXTURE0+t)),A(n,()=>n.bindTexture(n.TEXTURE_2D,e))}function ep(n,e){ra(n,e),A(n,()=>n.activeTexture(n.TEXTURE0+e)),A(n,()=>n.bindTexture(n.TEXTURE_2D,null))}function ta(n,e,t){return ze(n,()=>n.getUniformLocation(e,t),'uniform "'+t+'" not present in program.')}function na(n,e,t){return n.getUniformLocation(e,t)}function sa(n,e,t,s){A(n,()=>ea(n,e,s)),A(n,()=>n.uniform1i(t,s))}function tp(n){A(n,()=>n.bindFramebuffer(n.FRAMEBUFFER,null)),A(n,()=>n.viewport(0,0,n.canvas.width,n.canvas.height)),A(n,()=>n.scissor(0,0,n.canvas.width,n.canvas.height))}function Tn(n,e,t){A(n,()=>n.bindFramebuffer(n.FRAMEBUFFER,t)),A(n,()=>n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,e,0))}function Ts(n,e){A(n,()=>n.bindFramebuffer(n.FRAMEBUFFER,e)),A(n,()=>n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,null,0))}function en(n){const e=n.checkFramebufferStatus(n.FRAMEBUFFER);if(e!==n.FRAMEBUFFER_COMPLETE)throw new Error("Error binding framebuffer: "+oa(n,e))}function oa(n,e){switch(e){case n.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:return"FRAMEBUFFER_INCOMPLETE_ATTACHMENT";case n.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:return"FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";case n.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:return"FRAMEBUFFER_INCOMPLETE_DIMENSIONS";case n.FRAMEBUFFER_UNSUPPORTED:return"FRAMEBUFFER_UNSUPPORTED";default:return`unknown error ${e}`}}function ze(n,e,t){const s=A(n,()=>e());if(s==null)throw new Error(t);return s}function ra(n,e){const t=n.MAX_COMBINED_TEXTURE_IMAGE_UNITS-1,s=e+n.TEXTURE0;if(s<n.TEXTURE0||s>t){const o=`[gl.TEXTURE0, gl.TEXTURE${t}]`;throw new Error(`textureUnit must be in ${o}.`)}}function pt(n,e=2){return F(n.slice(0,n.length-e))}function mt(n){if(n.length===0)throw Error("Cannot get rows and columns of an empty shape array.");return[n.length>1?n[n.length-2]:1,n[n.length-1]]}function tn(n){let e=[1,1,1];return n.length===0||n.length===1&&n[0]===1||(e=[pt(n),...mt(n)]),e}function ia(n,e=!1){let t=v().getNumber("WEBGL_MAX_TEXTURE_SIZE"),s=v().getNumber("WEBGL_MAX_SIZE_FOR_NARROW_TEXTURE");s===1/0&&v().getBool("WEBGL_AUTO_SQUARIFY_NARROW_TEXTURE_SHAPE")&&(s=t/2),e&&(t=t*2,s=s*2,n=n.map((a,c)=>c>=n.length-2?Ds(n[c]):n[c]),n.length===1&&(n=[2,n[0]])),n.length!==2&&(n=xt(n).newShape);let o=F(n),r=null;n.length<=1&&o<=t?r=[1,o]:n.length===2&&n[0]<=t&&n[1]<=t?r=n:n.length===3&&n[0]*n[1]<=t&&n[2]<=t?r=[n[0]*n[1],n[2]]:n.length===3&&n[0]<=t&&n[1]*n[2]<=t?r=[n[0],n[1]*n[2]]:n.length===4&&n[0]*n[1]*n[2]<=t&&n[3]<=t?r=[n[0]*n[1]*n[2],n[3]]:n.length===4&&n[0]<=t&&n[1]*n[2]*n[3]<=t&&(r=[n[0],n[1]*n[2]*n[3]]);const i=r!=null&&Math.max(...r)>s&&Math.min(...r)<=(e?2:1)&&Math.min(...r)>0;if(r==null||i)if(e){const a=pt(n);let c=2,l=2;n.length&&([c,l]=mt(n)),o=a*(c/2)*(l/2),r=as(o).map(u=>u*2)}else r=as(o);return r}function vn(n){return n%2===0}function an(n,e){if(n=n.slice(-2),e=e.slice(-2),oe(n,e)||!n.length||!e.length||n[0]===0||n[1]===0||e[0]===0||e[1]===0)return!0;if(n.length!==e.length){const t=n[n.length-1],s=e[e.length-1];if(t===s||vn(t)&&vn(s)&&(n[0]===1||e[0]===1))return!0}return n[1]===e[1]&&vn(n[0])&&vn(e[0])}let En,Nn;function aa(n){if(En==null){const e=De(n);En=e.getParameter(e.MAX_TEXTURE_SIZE)}return En}function np(){En=null}function sp(){Nn=null}function ca(n){if(Nn==null){const e=De(n);Nn=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS)}return Math.min(16,Nn)}function la(n){if(n===0)return 0;let e;const t=De(n);return we(t,"EXT_disjoint_timer_query_webgl2")&&n===2?e=2:we(t,"EXT_disjoint_timer_query")?e=1:e=0,e}function we(n,e){return n.getExtension(e)!=null}function Es(n){try{if(De(n)!=null)return!0}catch(e){return console.log("Error when getting WebGL context: ",e),!1}return!1}function ua(n){if(n===0)return!1;const e=De(n);if(n===1){if(!we(e,"OES_texture_float"))return!1}else if(!we(e,"EXT_color_buffer_float"))return!1;return Ns(e)}function da(n){if(n===0)return!1;const e=De(n);if(n===1){if(!we(e,"OES_texture_float")||!we(e,"WEBGL_color_buffer_float"))return!1}else{if(we(e,"EXT_color_buffer_float"))return Ns(e);const s="EXT_color_buffer_half_float";if(we(e,s)){const o=e.getExtension(s);return op(e,o)}return!1}return Ns(e)}function Ns(n){const e=Qs(n),t=n.createTexture();n.bindTexture(n.TEXTURE_2D,t),n.texImage2D(n.TEXTURE_2D,0,e.internalFormatFloat,1,1,0,e.textureFormatFloat,e.textureTypeFloat,null);const r=n.createFramebuffer();n.bindFramebuffer(n.FRAMEBUFFER,r),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,t,0);const i=n.checkFramebufferStatus(n.FRAMEBUFFER)===n.FRAMEBUFFER_COMPLETE;return n.bindTexture(n.TEXTURE_2D,null),n.bindFramebuffer(n.FRAMEBUFFER,null),n.deleteTexture(t),n.deleteFramebuffer(r),i}function op(n,e){const t=Qs(n,e),s=n.createTexture();n.bindTexture(n.TEXTURE_2D,s),n.texImage2D(n.TEXTURE_2D,0,t.internalFormatHalfFloat,1,1,0,t.textureFormatFloat,t.textureTypeHalfFloat,null);const i=n.createFramebuffer();n.bindFramebuffer(n.FRAMEBUFFER,i),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,s,0);const a=n.checkFramebufferStatus(n.FRAMEBUFFER)===n.FRAMEBUFFER_COMPLETE;return n.bindTexture(n.TEXTURE_2D,null),n.bindFramebuffer(n.FRAMEBUFFER,null),n.deleteTexture(s),n.deleteFramebuffer(i),a}function ha(n){return n!==2?!1:De(n).fenceSync!=null}function Ut(n,e){Array.isArray(n)||(n=[n]),n.forEach(t=>{t!=null&&D(t.dtype!=="complex64",()=>`${e} does not support complex64 tensors in the WebGL backend.`)})}const sS=Object.freeze(Object.defineProperty({__proto__:null,assertNotComplex:Ut,bindCanvasToFramebuffer:tp,bindColorTextureToFramebuffer:Tn,bindTextureToProgramUniformSampler:sa,bindTextureUnit:ea,bindVertexBufferToProgramAttribute:Rs,callAndCheck:A,canBeRepresented:Gi,createFragmentShader:Xi,createFramebuffer:Ji,createProgram:ji,createStaticIndexBuffer:Yi,createStaticVertexBuffer:Ki,createTexture:Qi,createVertexShader:Hi,getBatchDim:pt,getExtensionOrThrow:Jt,getFramebufferErrorMessage:oa,getMaxTexturesInShader:ca,getNumChannels:Jf,getProgramUniformLocation:na,getProgramUniformLocationOrThrow:ta,getRowsCols:mt,getShapeAs3D:tn,getTextureShapeFromLogicalShape:ia,getWebGLDisjointQueryTimerVersion:la,getWebGLErrorMessage:zi,getWebGLMaxTextureSize:aa,hasExtension:we,isCapableOfRenderingToFloatTexture:ua,isDownloadFloatTextureEnabled:da,isReshapeFree:an,isWebGLFenceEnabled:ha,isWebGLVersionEnabled:Es,linkProgram:qi,logShaderSourceAndInfoLog:Zs,resetMaxTextureSize:np,resetMaxTexturesInShader:sp,unbindColorTextureFromFramebuffer:Ts,unbindTextureUnit:ep,validateFramebuffer:en,validateProgram:Rn,validateTextureSize:Zi},Symbol.toStringTag,{value:"Module"}));const O=v();O.registerFlag("HAS_WEBGL",()=>O.getNumber("WEBGL_VERSION")>0);O.registerFlag("WEBGL_VERSION",()=>Es(2)?2:Es(1)?1:0);O.registerFlag("WEBGL_CHECK_NUMERICAL_PROBLEMS",()=>!1);O.registerFlag("WEBGL_BUFFER_SUPPORTED",()=>O.get("WEBGL_VERSION")===2);O.registerFlag("WEBGL_CPU_FORWARD",()=>!0);O.registerFlag("WEBGL_FORCE_F16_TEXTURES",()=>!1);O.registerFlag("WEBGL_PACK",()=>O.getBool("HAS_WEBGL"));O.registerFlag("WEBGL_PACK_NORMALIZATION",()=>O.getBool("WEBGL_PACK"));O.registerFlag("WEBGL_PACK_CLIP",()=>O.getBool("WEBGL_PACK"));O.registerFlag("WEBGL_PACK_DEPTHWISECONV",()=>O.getBool("WEBGL_PACK"));O.registerFlag("WEBGL_PACK_BINARY_OPERATIONS",()=>O.getBool("WEBGL_PACK"));O.registerFlag("WEBGL_PACK_UNARY_OPERATIONS",()=>O.getBool("WEBGL_PACK"));O.registerFlag("WEBGL_PACK_ARRAY_OPERATIONS",()=>O.getBool("WEBGL_PACK"));O.registerFlag("WEBGL_PACK_IMAGE_OPERATIONS",()=>O.getBool("WEBGL_PACK"));O.registerFlag("WEBGL_PACK_REDUCE",()=>O.getBool("WEBGL_PACK"));O.registerFlag("WEBGL_LAZILY_UNPACK",()=>O.getBool("WEBGL_PACK"));O.registerFlag("WEBGL_CONV_IM2COL",()=>O.getBool("WEBGL_PACK"));O.registerFlag("WEBGL_PACK_CONV2DTRANSPOSE",()=>O.getBool("WEBGL_PACK"));O.registerFlag("WEBGL_MAX_TEXTURE_SIZE",()=>aa(O.getNumber("WEBGL_VERSION")));O.registerFlag("WEBGL_MAX_TEXTURES_IN_SHADER",()=>ca(O.getNumber("WEBGL_VERSION")));O.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION",()=>{const n=O.getNumber("WEBGL_VERSION");return n===0?0:la(n)});O.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE",()=>O.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0&&!zr());O.registerFlag("WEBGL_RENDER_FLOAT32_CAPABLE",()=>ua(O.getNumber("WEBGL_VERSION")));O.registerFlag("WEBGL_RENDER_FLOAT32_ENABLED",()=>O.getBool("WEBGL_FORCE_F16_TEXTURES")?!1:O.getBool("WEBGL_RENDER_FLOAT32_CAPABLE"));O.registerFlag("WEBGL_DOWNLOAD_FLOAT_ENABLED",()=>da(O.getNumber("WEBGL_VERSION")));O.registerFlag("WEBGL_FENCE_API_ENABLED",()=>ha(O.getNumber("WEBGL_VERSION")));O.registerFlag("WEBGL_SIZE_UPLOAD_UNIFORM",()=>O.getBool("WEBGL_RENDER_FLOAT32_ENABLED")?4:0);O.registerFlag("WEBGL_DELETE_TEXTURE_THRESHOLD",()=>-1,n=>{if(typeof n!="number")throw new Error(`WEBGL_DELETE_TEXTURE_THRESHOLD must be a number but got ${n}.`);if(n<0&&n!==-1)throw new Error(`WEBGL_DELETE_TEXTURE_THRESHOLD must be -1 (indicating never delete) or at least 0, but got ${n}.`)});O.registerFlag("WEBGL_FLUSH_THRESHOLD",()=>zr()?1:-1,n=>{if(typeof n!="number")throw new Error(`WEBGL_FLUSH_THRESHOLD must be a number but got ${n}.`);if(n<0&&n!==-1)throw new Error(`WEBGL_FLUSH_THRESHOLD must be -1 (indicating never manual flush) or at least 0, but got ${n}.`)});O.registerFlag("CPU_HANDOFF_SIZE_THRESHOLD",()=>128);O.registerFlag("WEBGL_USE_SHAPES_UNIFORMS",()=>!1);O.registerFlag("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD",()=>1e5);O.registerFlag("TOPK_K_CPU_HANDOFF_THRESHOLD",()=>128);O.registerFlag("WEBGL_EXP_CONV",()=>!1);O.registerFlag("SOFTWARE_WEBGL_ENABLED",()=>O.getBool("IS_TEST"));O.registerFlag("WEBGL_MAX_SIZE_FOR_NARROW_TEXTURE",()=>1/0);O.registerFlag("WEBGL_AUTO_SQUARIFY_NARROW_TEXTURE_SHAPE",()=>!1);O.registerFlag("WEBGL2_ISNAN_CUSTOM",()=>!1);O.registerFlag("ENGINE_COMPILE_ONLY",()=>!1);function pe(){let n,e,t,s,o,r,i,a,c,l;return v().getNumber("WEBGL_VERSION")===2?(n="#version 300 es",e="in",t="out",s="in",o="texture",r="outputColor",i="out vec4 outputColor;",a=v().getBool("WEBGL2_ISNAN_CUSTOM")?`
      bool isnan_custom(float val) {
        uint floatToUint = floatBitsToUint(val);
        return (floatToUint & 0x7fffffffu) > 0x7f800000u;
      }

      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan_custom(val.x),
          isnan_custom(val.y), isnan_custom(val.z), isnan_custom(val.w));
      }

      #define isnan(value) isnan_custom(value)
    `:"",c="",l=`
      #define round(value) newRound(value)
      int newRound(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 newRound(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `):(n="",e="attribute",t="varying",s="varying",o="texture2D",r="gl_FragColor",i="",a=`
      #define isnan(value) isnan_custom(value)
      bool isnan_custom(float val) {
        return (val > 0. || val < 1. || val == 0.) ? false : true;
      }
      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan(val.x), isnan(val.y), isnan(val.z), isnan(val.w));
      }
    `,c=`
      uniform float INFINITY;

      bool isinf(float val) {
        return abs(val) == INFINITY;
      }
      bvec4 isinf(vec4 val) {
        return equal(abs(val), vec4(INFINITY));
      }
    `,l=`
      int round(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 round(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `),{version:n,attribute:e,varyingVs:t,varyingFs:s,texture2D:o,output:r,defineOutput:i,defineSpecialNaN:a,defineSpecialInf:c,defineRound:l}}function yt(n,e,t="index"){const s=se(e);return s.map((o,r)=>{const i=`int ${n[r]} = ${t} / ${o}`,a=r===s.length-1?`int ${n[r+1]} = ${t} - ${n[r]} * ${o}`:`index -= ${n[r]} * ${o}`;return`${i}; ${a};`}).join("")}function jn(n,e,t="index"){const s=se(e);return s.map((o,r)=>{const i=`int ${n[r]} = ${t} / outShapeStrides[${r}]`,a=r===s.length-1?`int ${n[r+1]} = ${t} - ${n[r]} * outShapeStrides[${r}]`:`index -= ${n[r]} * outShapeStrides[${r}]`;return`${i}; ${a};`}).join("")}function rp(n,e){const t=n.length,s=n.map(r=>`${e}[${r}]`),o=new Array(t-1);o[t-2]=s[t-1];for(let r=t-3;r>=0;--r)o[r]=`(${o[r+1]} * ${s[r+1]})`;return o}function ip(n,e,t="index"){const s=n.map((r,i)=>i),o=rp(s,e);return o.map((r,i)=>{const a=`int ${n[i]} = ${t} / ${o[i]}`,c=i===o.length-1?`int ${n[i+1]} = ${t} - ${n[i]} * ${o[i]}`:`index -= ${n[i]} * ${o[i]}`;return`${a}; ${c};`}).join("")}function Js(n){const e=se(n).map(t=>t.toString());return`
  int getFlatIndex(ivec3 coords) {
    return coords.x * ${e[0]} + coords.y * ${e[1]} + coords.z;
  }
`}function eo(){return`
  int getFlatIndex(ivec3 coords) {
    return coords.x * outShapeStrides[0] + coords.y * outShapeStrides[1] + coords.z;
  }
`}const fa=`
  const float FLOAT_MAX = 1.70141184e38;
  const float FLOAT_MIN = 1.17549435e-38;

  lowp vec4 encode_float(highp float v) {
    if (isnan(v)) {
      return vec4(255, 255, 255, 255);
    }

    highp float av = abs(v);

    if(av < FLOAT_MIN) {
      return vec4(0.0, 0.0, 0.0, 0.0);
    } else if(v > FLOAT_MAX) {
      return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
    } else if(v < -FLOAT_MAX) {
      return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
    }

    highp vec4 c = vec4(0,0,0,0);

    highp float e = floor(log2(av));
    highp float m = exp2(fract(log2(av))) - 1.0;

    c[2] = floor(128.0 * m);
    m -= c[2] / 128.0;
    c[1] = floor(32768.0 * m);
    m -= c[1] / 32768.0;
    c[0] = floor(8388608.0 * m);

    highp float ebias = e + 127.0;
    c[3] = floor(ebias / 2.0);
    ebias -= c[3] * 2.0;
    c[2] += floor(ebias) * 128.0;

    c[3] += 128.0 * step(0.0, -v);

    return c / 255.0;
  }
`;const{getBroadcastDims:pa}=Gf;function ap(n,e,t){const s=[];if(n.forEach(f=>{const p=F(f.shapeInfo.logicalShape);if(f.shapeInfo.isUniform?s.push(`uniform float ${f.name}${p>1?`[${p}]`:""};`):(s.push(`uniform sampler2D ${f.name};`),s.push(`uniform int offset${f.name};`)),t.enableShapeUniforms){const{uniformShape:x}=to(t.packedInputs,f.shapeInfo.logicalShape,f.shapeInfo.texShape);switch(x.length){case 1:s.push(`uniform int ${f.name}Shape;`);break;case 2:s.push(`uniform ivec2 ${f.name}Shape;`);break;case 3:s.push(`uniform ivec3 ${f.name}Shape;`);break;case 4:s.push(`uniform ivec4 ${f.name}Shape;`);break}s.push(`uniform ivec2 ${f.name}TexShape;`)}}),t.enableShapeUniforms){switch(e.logicalShape.length){case 1:s.push("uniform int outShape;");break;case 2:s.push("uniform ivec2 outShape;"),s.push("uniform int outShapeStrides;");break;case 3:s.push("uniform ivec3 outShape;"),s.push("uniform ivec2 outShapeStrides;");break;case 4:s.push("uniform ivec4 outShape;"),s.push("uniform ivec3 outShapeStrides;");break}s.push("uniform ivec2 outTexShape;")}t.customUniforms&&t.customUniforms.forEach(f=>{s.push(`uniform ${f.type} ${f.name}${f.arrayIndex?`[${f.arrayIndex}]`:""};`)});const o=s.join(`
`),r=n.map(f=>cp(f,e,t.packedInputs,t.enableShapeUniforms)).join(`
`),i=e.texShape,a=pe(),c=dp(a);let l,u,d=pp(a);return e.isPacked?(l=lp(e.logicalShape,i,t.enableShapeUniforms),u=fp(a)):(l=up(e.logicalShape,i,t.enableShapeUniforms),u=hp(a)),t.packedInputs&&(d+=Cp),[d,c,u,o,l,r,t.userCode].join(`
`)}function Wt(n,e=!1){const t=n.shapeInfo.logicalShape;switch(t.length){case 0:return kp(n,e);case 1:return Fp(n,e);case 2:return Op(n,e);case 3:return _p(n,e);case 4:return Bp(n,e);case 5:return Mp(n);case 6:return Vp(n);default:throw new Error(`${t.length}-D input sampling is not yet supported`)}}function ma(n,e){switch(n.shapeInfo.logicalShape.length){case 0:return Np(n);case 1:return Ap(n,e);case 2:return Dp(n,e);case 3:return Pp(n,e);default:return Lp(n,e)}}function cp(n,e,t=!1,s){let o="";t?o+=ma(n,s):o+=Wt(n,s);const r=n.shapeInfo.logicalShape,i=e.logicalShape;return r.length<=i.length&&(t?o+=Up(n,e):o+=Wp(n,e)),o}function lp(n,e,t){switch(n.length){case 0:return ga();case 1:return bp(n,e,t);case 2:return Tp(n,e,t);case 3:return yp(n,e,t);default:return $p(n,e,t)}}function up(n,e,t){switch(n.length){case 0:return ga();case 1:return wp(n,e,t);case 2:return Ep(n,e,t);case 3:return vp(n,e,t);case 4:return Sp(n,e,t);case 5:return Ip(n,e);case 6:return Rp(n,e);default:throw new Error(`${n.length}-D output sampling is not yet supported`)}}function dp(n){return`
    float sampleTexture(sampler2D textureSampler, vec2 uv) {
      return ${n.texture2D}(textureSampler, uv).r;
    }
  `}function hp(n){return`
    void setOutput(float val) {
      ${n.output} = vec4(val, 0, 0, 0);
    }
  `}function fp(n){return`
    void setOutput(vec4 val) {
      ${n.output} = val;
    }
  `}function pp(n){return`${n.version}
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    ${n.varyingFs} vec2 resultUV;
    ${n.defineOutput}
    const vec2 halfCR = vec2(0.5, 0.5);

    struct ivec5
    {
      int x;
      int y;
      int z;
      int w;
      int u;
    };

    struct ivec6
    {
      int x;
      int y;
      int z;
      int w;
      int u;
      int v;
    };

    uniform float NAN;
    ${n.defineSpecialNaN}
    ${n.defineSpecialInf}
    ${n.defineRound}

    int imod(int x, int y) {
      return x - y * (x / y);
    }

    int idiv(int a, int b, float sign) {
      int res = a / b;
      int mod = imod(a, b);
      if (sign < 0. && mod != 0) {
        res -= 1;
      }
      return res;
    }

    //Based on the work of Dave Hoskins
    //https://www.shadertoy.com/view/4djSRW
    #define HASHSCALE1 443.8975
    float random(float seed){
      vec2 p = resultUV * seed;
      vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
      p3 += dot(p3, p3.yzx + 19.19);
      return fract((p3.x + p3.y) * p3.z);
    }

    ${mp}
    ${gp}
    ${xp}
  `}const mp=`
vec2 uvFromFlat(int texNumR, int texNumC, int index) {
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {
  int texelIndex = index / 2;
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,gp=`
vec2 packedUVfrom2D(int texelsInLogicalRow, int texNumR,
  int texNumC, int row, int col) {
  int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,xp=`
vec2 packedUVfrom3D(int texNumR, int texNumC,
    int texelsInBatch, int texelsInLogicalRow, int b,
    int row, int col) {
  int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,Cp=`
  float getChannel(vec4 frag, vec2 innerDims) {
    vec2 modCoord = mod(innerDims, 2.);
    return modCoord.x == 0. ?
      (modCoord.y == 0. ? frag.r : frag.g) :
      (modCoord.y == 0. ? frag.b : frag.a);
  }
  float getChannel(vec4 frag, int dim) {
    float modCoord = mod(float(dim), 2.);
    return modCoord == 0. ? frag.r : frag.g;
  }
`;function ga(){return`
    int getOutputCoords() {
      return 0;
    }
  `}function bp(n,e,t){const s=[Math.ceil(e[0]/2),Math.ceil(e[1]/2)];return s[0]===1?t?`
      int getOutputCoords() {
        return 2 * int(resultUV.x * ceil(float(outTexShape[1]) / 2.0));
      }
    `:`
      int getOutputCoords() {
        return 2 * int(resultUV.x * ${s[1]}.0);
      }
    `:s[1]===1?t?`
      int getOutputCoords() {
        return 2 * int(resultUV.y * ceil(float(outTexShape[0]) / 2.0));
      }
    `:`
      int getOutputCoords() {
        return 2 * int(resultUV.y * ${s[0]}.0);
      }
    `:t?`
    int getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      return 2 * (resTexRC.x * packedTexShape[1] + resTexRC.y);
    }
  `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${s[0]}, ${s[1]}));
      return 2 * (resTexRC.x * ${s[1]} + resTexRC.y);
    }
  `}function wp(n,e,t){return e[0]===1?t?`
      int getOutputCoords() {
        return int(resultUV.x * float(outTexShape[1]));
      }
    `:`
      int getOutputCoords() {
        return int(resultUV.x * ${e[1]}.0);
      }
    `:e[1]===1?t?`
      int getOutputCoords() {
        return int(resultUV.y * float(outTexShape[0]));
      }
    `:`
      int getOutputCoords() {
        return int(resultUV.y * ${e[0]}.0);
      }
    `:t?`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      return resTexRC.x * outTexShape[1] + resTexRC.y;
    }
  `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${e[0]}, ${e[1]}));
      return resTexRC.x * ${e[1]} + resTexRC.y;
    }
  `}function yp(n,e,t){if(t)return`
    ivec3 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      int texelsInLogicalRow = int(ceil(float(outShape[2]) / 2.0));
      int texelsInBatch = texelsInLogicalRow * int(ceil(float(outShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;

      int b = index / texelsInBatch;
      index -= b * texelsInBatch;

      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec3(b, r, c);
    }
  `;const s=[Math.ceil(e[0]/2),Math.ceil(e[1]/2)],o=Math.ceil(n[2]/2),r=o*Math.ceil(n[1]/2);return`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${s[0]}, ${s[1]}));
      int index = resTexRC.x * ${s[1]} + resTexRC.y;

      int b = index / ${r};
      index -= b * ${r};

      int r = 2 * (index / ${o});
      int c = imod(index, ${o}) * 2;

      return ivec3(b, r, c);
    }
  `}function vp(n,e,t){if(t)return`
  ivec3 getOutputCoords() {
    ivec2 resTexRC = ivec2(resultUV.yx *
                           vec2(outTexShape[0], outTexShape[1]));
    int index = resTexRC.x * outTexShape[1] + resTexRC.y;
    ${jn(["r","c","d"],n)}
    return ivec3(r, c, d);
  }
`;const s=yt(["r","c","d"],n);return`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${e[0]}, ${e[1]}));
      int index = resTexRC.x * ${e[1]} + resTexRC.y;
      ${s}
      return ivec3(r, c, d);
    }
  `}function $p(n,e,t){if(t)return`
    ivec4 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;

      int texelsInLogicalRow = int(ceil(float(outShape[3]) / 2.0));
      int texelsInBatch = texelsInLogicalRow * int(ceil(float(outShape[2]) / 2.0));
      int texelsInBatchN = texelsInBatch * outShape[1];

      int b2 = index / texelsInBatchN;
      index -= b2 * texelsInBatchN;

      int b = index / texelsInBatch;
      index -= b * texelsInBatch;

      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec4(b2, b, r, c);
    }
  `;const s=[Math.ceil(e[0]/2),Math.ceil(e[1]/2)],o=Math.ceil(n[n.length-1]/2),r=o*Math.ceil(n[n.length-2]/2);let i=r,a="",c="b, r, c";for(let l=2;l<n.length-1;l++)i*=n[n.length-l-1],a=`
      int b${l} = index / ${i};
      index -= b${l} * ${i};
    `+a,c=`b${l}, `+c;return`
    ivec${n.length} getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${s[0]}, ${s[1]}));
      int index = resTexRC.x * ${s[1]} + resTexRC.y;

      ${a}

      int b = index / ${r};
      index -= b * ${r};

      int r = 2 * (index / ${o});
      int c = imod(index, ${o}) * 2;

      return ivec${n.length}(${c});
    }
  `}function Sp(n,e,t){if(t)return`
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      ${jn(["r","c","d","d2"],n)}
      return ivec4(r, c, d, d2);
    }
  `;const s=yt(["r","c","d","d2"],n);return`
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${e[0]}, ${e[1]}));
      int index = resTexRC.x * ${e[1]} + resTexRC.y;
      ${s}
      return ivec4(r, c, d, d2);
    }
  `}function Ip(n,e){const t=yt(["r","c","d","d2","d3"],n);return`
    ivec5 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx * vec2(${e[0]},
                             ${e[1]}));

      int index = resTexRC.x * ${e[1]} + resTexRC.y;

      ${t}

      ivec5 outShape = ivec5(r, c, d, d2, d3);
      return outShape;
    }
  `}function Rp(n,e){const t=yt(["r","c","d","d2","d3","d4"],n);return`
    ivec6 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${e[0]}, ${e[1]}));
      int index = resTexRC.x * ${e[1]} + resTexRC.y;

      ${t}

      ivec6 result = ivec6(r, c, d, d2, d3, d4);
      return result;
    }
  `}function Tp(n,e,t){const s=[Math.ceil(e[0]/2),Math.ceil(e[1]/2)];if(oe(n,e))return t?`
      ivec2 getOutputCoords() {
        ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
        return 2 * ivec2(resultUV.yx * vec2(packedTexShape[0], packedTexShape[1]));
      }
    `:`
      ivec2 getOutputCoords() {
        return 2 * ivec2(resultUV.yx * vec2(${s[0]}, ${s[1]}));
      }
    `;const o=Math.ceil(n[1]/2);return t?`
    ivec2 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      int texelsInLogicalRow = int(ceil(float(outShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));

      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;
      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec2(r, c);
    }
  `:`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${s[0]}, ${s[1]}));

      int index = resTexRC.x * ${s[1]} + resTexRC.y;
      int r = 2 * (index / ${o});
      int c = imod(index, ${o}) * 2;

      return ivec2(r, c);
    }
  `}function Ep(n,e,t){return oe(n,e)?t?`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(outTexShape[0], outTexShape[1]));
      }
    `:`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(${e[0]}, ${e[1]}));
      }
    `:n[1]===1?t?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(index, 0);
      }
    `:`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${e[0]}, ${e[1]}));
        int index = resTexRC.x * ${e[1]} + resTexRC.y;
        return ivec2(index, 0);
      }
    `:n[0]===1?t?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(0, index);
      }
    `:`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${e[0]}, ${e[1]}));
        int index = resTexRC.x * ${e[1]} + resTexRC.y;
        return ivec2(0, index);
      }
    `:t?`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      int r = index / outShape[1];
      int c = index - r * outShape[1];
      return ivec2(r, c);
    }
  `:`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${e[0]}, ${e[1]}));
      int index = resTexRC.x * ${e[1]} + resTexRC.y;
      int r = index / ${n[1]};
      int c = index - r * ${n[1]};
      return ivec2(r, c);
    }
  `}function vt(n){return`offset${n}`}function Np(n){const e=n.name,t="get"+e.charAt(0).toUpperCase()+e.slice(1),s=pe();return`
    vec4 ${t}() {
      return ${s.texture2D}(${e}, halfCR);
    }
  `}function kp(n,e){const t=n.name,s="get"+t.charAt(0).toUpperCase()+t.slice(1);if(n.shapeInfo.isUniform)return`float ${s}() {return ${t};}`;const[o,r]=n.shapeInfo.texShape;if(o===1&&r===1)return`
      float ${s}() {
        return sampleTexture(${t}, halfCR);
      }
    `;const i=vt(t);if(e)return`
    float ${s}() {
      vec2 uv = uvFromFlat(${t}TexShape[0], ${t}TexShape[1], ${i});
      return sampleTexture(${t}, uv);
    }
  `;const[a,c]=n.shapeInfo.texShape;return`
    float ${s}() {
      vec2 uv = uvFromFlat(${a}, ${c}, ${i});
      return sampleTexture(${t}, uv);
    }
  `}function Ap(n,e){const t=n.name,s="get"+t.charAt(0).toUpperCase()+t.slice(1),o=n.shapeInfo.texShape,r=pe();if(e)return`
    vec4 ${s}(int index) {
      ivec2 packedTexShape = ivec2(ceil(float(${t}TexShape[0]) / 2.0), ceil(float(${t}TexShape[1]) / 2.0));
      vec2 uv = packedUVfrom1D(
        packedTexShape[0], packedTexShape[1], index);
      return ${r.texture2D}(${t}, uv);
    }
  `;const i=[Math.ceil(o[0]/2),Math.ceil(o[1]/2)];return`
    vec4 ${s}(int index) {
      vec2 uv = packedUVfrom1D(
        ${i[0]}, ${i[1]}, index);
      return ${r.texture2D}(${t}, uv);
    }
  `}function Fp(n,e){const t=n.name,s="get"+t.charAt(0).toUpperCase()+t.slice(1);if(n.shapeInfo.isUniform)return`
      float ${s}(int index) {
        ${Gt(n)}
      }
    `;const o=n.shapeInfo.texShape,r=o[0],i=o[1];if(i===1&&r===1)return`
      float ${s}(int index) {
        return sampleTexture(${t}, halfCR);
      }
    `;const a=vt(t);return i===1?e?`
      float ${s}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${a}) + 0.5) / float(${t}TexShape[0]));
        return sampleTexture(${t}, uv);
      }
    `:`
      float ${s}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${a}) + 0.5) / ${r}.0);
        return sampleTexture(${t}, uv);
      }
    `:r===1?e?`
      float ${s}(int index) {
        vec2 uv = vec2((float(index + ${a}) + 0.5) / float(${t}TexShape[1]), 0.5);
        return sampleTexture(${t}, uv);
      }
    `:`
      float ${s}(int index) {
        vec2 uv = vec2((float(index + ${a}) + 0.5) / ${i}.0, 0.5);
        return sampleTexture(${t}, uv);
      }
    `:e?`
    float ${s}(int index) {
      vec2 uv = uvFromFlat(${t}TexShape[0], ${t}TexShape[1], index + ${a});
      return sampleTexture(${t}, uv);
    }
  `:`
    float ${s}(int index) {
      vec2 uv = uvFromFlat(${r}, ${i}, index + ${a});
      return sampleTexture(${t}, uv);
    }
  `}function Dp(n,e){const t=n.shapeInfo.logicalShape,s=n.name,o="get"+s.charAt(0).toUpperCase()+s.slice(1),r=n.shapeInfo.texShape,i=r[0],a=r[1],c=pe();if(r!=null&&oe(t,r))return e?`
      vec4 ${o}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${s}TexShape[1], ${s}TexShape[0]);

        return ${c.texture2D}(${s}, uv);
      }
    `:`
      vec4 ${o}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${a}.0, ${i}.0);

        return ${c.texture2D}(${s}, uv);
      }
    `;if(e)return`
    vec4 ${o}(int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${s}TexShape[0]) / 2.0), ceil(float(${s}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${s}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom2D(valuesPerRow, packedTexShape[0], packedTexShape[1], row, col);
      return ${c.texture2D}(${s}, uv);
    }
  `;const l=[Math.ceil(r[0]/2),Math.ceil(r[1]/2)],u=Math.ceil(t[1]/2);return`
    vec4 ${o}(int row, int col) {
      vec2 uv = packedUVfrom2D(${u}, ${l[0]}, ${l[1]}, row, col);
      return ${c.texture2D}(${s}, uv);
    }
  `}function Op(n,e){const t=n.shapeInfo.logicalShape,s=n.name,o="get"+s.charAt(0).toUpperCase()+s.slice(1),r=n.shapeInfo.texShape;if(r!=null&&oe(t,r)){if(e)return`
      float ${o}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${s}TexShape[1], ${s}TexShape[0]);
        return sampleTexture(${s}, uv);
      }
    `;const h=r[0],f=r[1];return`
    float ${o}(int row, int col) {
      vec2 uv = (vec2(col, row) + halfCR) / vec2(${f}.0, ${h}.0);
      return sampleTexture(${s}, uv);
    }
  `}const{newShape:i,keptDims:a}=xt(t),c=i;if(c.length<t.length){const h=zt(n,c),f=["row","col"];return`
      ${Wt(h,e)}
      float ${o}(int row, int col) {
        return ${o}(${Ht(f,a)});
      }
    `}if(n.shapeInfo.isUniform)return`
      float ${o}(int row, int col) {
        int index = round(dot(vec2(row, col), vec2(${t[1]}, 1)));
        ${Gt(n)}
      }
    `;const l=r[0],u=r[1],d=vt(s);return u===1?e?`
      float ${o}(int row, int col) {
        float index = dot(vec3(row, col, ${d}), vec3(${s}Shape[1], 1, 1));
        vec2 uv = vec2(0.5, (index + 0.5) / float(${s}TexShape[0]));
        return sampleTexture(${s}, uv);
      }
    `:`
    float ${o}(int row, int col) {
      float index = dot(vec3(row, col, ${d}), vec3(${t[1]}, 1, 1));
      vec2 uv = vec2(0.5, (index + 0.5) / ${l}.0);
      return sampleTexture(${s}, uv);
    }
  `:l===1?e?`
      float ${o}(int row, int col) {
        float index = dot(vec3(row, col, ${d}), vec3(${s}Shape[1], 1, 1));
        vec2 uv = vec2((index + 0.5) / float(${s}TexShape[1]), 0.5);
        return sampleTexture(${s}, uv);
      }
    `:`
    float ${o}(int row, int col) {
      float index = dot(vec3(row, col, ${d}), vec3(${t[1]}, 1, 1));
      vec2 uv = vec2((index + 0.5) / ${u}.0, 0.5);
      return sampleTexture(${s}, uv);
    }
  `:e?`
      float ${o}(int row, int col) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${s}Shape[1] + col + ${d};
        vec2 uv = uvFromFlat(${s}TexShape[0], ${s}TexShape[1], index);
        return sampleTexture(${s}, uv);
      }
    `:`
  float ${o}(int row, int col) {
    // Explicitly use integer operations as dot() only works on floats.
    int index = row * ${t[1]} + col + ${d};
    vec2 uv = uvFromFlat(${l}, ${u}, index);
    return sampleTexture(${s}, uv);
  }
`}function Pp(n,e){const t=n.shapeInfo.logicalShape,s=n.name,o="get"+s.charAt(0).toUpperCase()+s.slice(1),r=n.shapeInfo.texShape,i=[Math.ceil(r[0]/2),Math.ceil(r[1]/2)];if(t[0]===1){const h=t.slice(1),f=[1,2],p=zt(n,h),x=["b","row","col"];return`
        ${ma(p,e)}
        vec4 ${o}(int b, int row, int col) {
          return ${o}(${Ht(x,f)});
        }
      `}const a=pe();if(e)return`
    vec4 ${o}(int b, int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${s}TexShape[0]) / 2.0), ceil(float(${s}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${s}Shape[2]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${s}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom3D(
        packedTexShape[0], packedTexShape[1], texelsInBatch, valuesPerRow, b, row, col);
      return ${a.texture2D}(${s}, uv);
    }
  `;const c=i[0],l=i[1],u=Math.ceil(t[2]/2),d=u*Math.ceil(t[1]/2);return`
    vec4 ${o}(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        ${c}, ${l}, ${d}, ${u}, b, row, col);
      return ${a.texture2D}(${s}, uv);
    }
  `}function _p(n,e){const t=n.shapeInfo.logicalShape,s=n.name,o="get"+s.charAt(0).toUpperCase()+s.slice(1),r=t[1]*t[2],i=t[2],{newShape:a,keptDims:c}=xt(t),l=a;if(l.length<t.length){const x=zt(n,l),g=["row","col","depth"];return`
        ${Wt(x,e)}
        float ${o}(int row, int col, int depth) {
          return ${o}(${Ht(g,c)});
        }
      `}if(n.shapeInfo.isUniform)return`
      float ${o}(int row, int col, int depth) {
        int index = round(dot(vec3(row, col, depth),
                          vec3(${r}, ${i}, 1)));
        ${Gt(n)}
      }
    `;const u=n.shapeInfo.texShape,d=u[0],h=u[1],f=n.shapeInfo.flatOffset;if(h===r&&f==null)return e?`
      float ${o}(int row, int col, int depth) {
        int stride1 = ${s}Shape[2];
        float texR = float(row);
        float texC = dot(vec2(col, depth), vec2(stride1, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${s}TexShape[1], ${s}TexShape[0]);
        return sampleTexture(${s}, uv);
      }
    `:`
        float ${o}(int row, int col, int depth) {
          float texR = float(row);
          float texC = dot(vec2(col, depth), vec2(${i}, 1));
          vec2 uv = (vec2(texC, texR) + halfCR) /
                     vec2(${h}.0, ${d}.0);
          return sampleTexture(${s}, uv);
        }
      `;if(h===i&&f==null)return e?`
      float ${o}(int row, int col, int depth) {
        float texR = dot(vec2(row, col), vec2(${s}Shape[1], 1));
        float texC = float(depth);
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${s}TexShape[1], ${s}TexShape[0]);
        return sampleTexture(${s}, uv);
      }
    `:`
    float ${o}(int row, int col, int depth) {
      float texR = dot(vec2(row, col), vec2(${t[1]}, 1));
      float texC = float(depth);
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${h}.0, ${d}.0);
      return sampleTexture(${s}, uv);
    }
  `;const p=vt(s);return e?`
    float ${o}(int row, int col, int depth) {
      // Explicitly use integer operations as dot() only works on floats.
      int stride0 = ${s}Shape[1] * ${s}Shape[2];
      int stride1 = ${s}Shape[2];
      int index = row * stride0 + col * stride1 + depth + ${p};
      vec2 uv = uvFromFlat(${s}TexShape[0], ${s}TexShape[1], index);
      return sampleTexture(${s}, uv);
    }
    `:`
      float ${o}(int row, int col, int depth) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${r} + col * ${i} + depth + ${p};
        vec2 uv = uvFromFlat(${d}, ${h}, index);
        return sampleTexture(${s}, uv);
      }
  `}function Lp(n,e){const t=n.name,s="get"+t.charAt(0).toUpperCase()+t.slice(1),o=pe();if(e)return`
    vec4 ${s}(int b2, int b, int row, int col) {
      int valuesPerRow = int(ceil(float(${t}Shape[3]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${t}Shape[2]) / 2.0));
      int index = b * texelsInBatch + (row / 2) * valuesPerRow + (col / 2);
      texelsInBatch *= ${t}Shape[1];
      index = b2 * texelsInBatch + index;
      ivec2 packedTexShape = ivec2(ceil(float(${t}TexShape[0]) / 2.0), ceil(float(${t}TexShape[1]) / 2.0));
      int texR = index / packedTexShape[1];
      int texC = index - texR * packedTexShape[1];
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(packedTexShape[1], packedTexShape[0]); return ${o.texture2D}(${t}, uv);
    }
  `;const r=n.shapeInfo.logicalShape,i=r.length,a=n.shapeInfo.texShape,c=[Math.ceil(a[0]/2),Math.ceil(a[1]/2)],l=c[0],u=c[1],d=Math.ceil(r[i-1]/2);let h=d*Math.ceil(r[i-2]/2),f="int b, int row, int col",p=`b * ${h} + (row / 2) * ${d} + (col / 2)`;for(let x=2;x<i-1;x++)f=`int b${x}, `+f,h*=r[i-x-1],p=`b${x} * ${h} + `+p;return`
    vec4 ${s}(${f}) {
      int index = ${p};
      int texR = index / ${u};
      int texC = index - texR * ${u};
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${u}, ${l});
      return ${o.texture2D}(${t}, uv);
    }
  `}function Bp(n,e){const t=n.shapeInfo.logicalShape,s=n.name,o="get"+s.charAt(0).toUpperCase()+s.slice(1),r=t[3],i=t[2]*r,a=t[1]*i,{newShape:c,keptDims:l}=xt(t);if(c.length<t.length){const C=zt(n,c),w=["row","col","depth","depth2"];return`
      ${Wt(C,e)}
      float ${o}(int row, int col, int depth, int depth2) {
        return ${o}(${Ht(w,l)});
      }
    `}if(n.shapeInfo.isUniform)return`
      float ${o}(int row, int col, int depth, int depth2) {
        int index = round(dot(vec4(row, col, depth, depth2),
                          vec4(${a}, ${i}, ${r}, 1)));
        ${Gt(n)}
      }
    `;const u=n.shapeInfo.flatOffset,d=n.shapeInfo.texShape,h=d[0],f=d[1],p=`int stride2 = ${s}Shape[3];`,x=`int stride1 = ${s}Shape[2] * stride2;`,g=`int stride0 = ${s}Shape[1] * stride1;`;if(f===a&&u==null)return e?`
      float ${o}(int row, int col, int depth, int depth2) {
        ${p}
        ${x}
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(stride1, stride2, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${s}TexShape[1], ${s}TexShape[0]);
        return sampleTexture(${s}, uv);
      }
    `:`
      float ${o}(int row, int col, int depth, int depth2) {
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(${i}, ${r}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${f}.0, ${h}.0);
        return sampleTexture(${s}, uv);
      }
    `;if(f===r&&u==null)return e?`
      float ${o}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${s}Shape[1] * ${s}Shape[2], ${s}Shape[2], 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${s}TexShape[1], ${s}TexShape[0]);
        return sampleTexture(${s}, uv);
      }
    `:`
      float ${o}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${t[1]*t[2]}, ${t[2]}, 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${f}.0, ${h}.0);
        return sampleTexture(${s}, uv);
      }
    `;const m=vt(s);return e?`
    float ${o}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      ${p}
      ${x}
      ${g}
      int index = row * stride0 + col * stride1 +
          depth * stride2 + depth2;
      vec2 uv = uvFromFlat(${s}TexShape[0], ${s}TexShape[1], index + ${m});
      return sampleTexture(${s}, uv);
    }
  `:`
    float ${o}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${a} + col * ${i} +
          depth * ${r} + depth2;
      vec2 uv = uvFromFlat(${h}, ${f}, index + ${m});
      return sampleTexture(${s}, uv);
    }
  `}function Mp(n){const e=n.shapeInfo.logicalShape,t=n.name,s="get"+t.charAt(0).toUpperCase()+t.slice(1),o=e[4],r=e[3]*o,i=e[2]*r,a=e[1]*i,{newShape:c,keptDims:l}=xt(e);if(c.length<e.length){const x=zt(n,c),g=["row","col","depth","depth2","depth3"];return`
      ${Wt(x)}
      float ${s}(int row, int col, int depth, int depth2, int depth3) {
        return ${s}(${Ht(g,l)});
      }
    `}if(n.shapeInfo.isUniform)return`
      float ${s}(int row, int col, int depth, int depth2, int depth3) {
        float index = dot(
          vec4(row, col, depth, depth2),
          vec4(${a}, ${i}, ${r}, ${o})) +
          depth3;
        ${Gt(n)}
      }
    `;const u=n.shapeInfo.flatOffset,d=n.shapeInfo.texShape,h=d[0],f=d[1];if(f===a&&u==null)return`
      float ${s}(int row, int col, int depth, int depth2, int depth3) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
                         vec4(${i}, ${r}, ${o}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${f}.0, ${h}.0);
        return sampleTexture(${t}, uv);
      }
    `;if(f===o&&u==null)return`
      float ${s}(int row, int col, int depth, int depth2, int depth3) {
        float texR = dot(
          vec4(row, col, depth, depth2),
          vec4(${e[1]*e[2]*e[3]},
               ${e[2]*e[3]}, ${e[3]}, 1));
        int texC = depth3;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${f}.0, ${h}.0);
        return sampleTexture(${t}, uv);
      }
    `;const p=vt(t);return`
    float ${s}(int row, int col, int depth, int depth2, int depth3) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${a} + col * ${i} + depth * ${r} +
          depth2 * ${o} + depth3 + ${p};
      vec2 uv = uvFromFlat(${h}, ${f}, index);
      return sampleTexture(${t}, uv);
    }
  `}function Vp(n){const e=n.shapeInfo.logicalShape,t=n.name,s="get"+t.charAt(0).toUpperCase()+t.slice(1),{newShape:o,keptDims:r}=xt(e);if(o.length<e.length){const g=zt(n,o),m=["row","col","depth","depth2","depth3","depth4"];return`
      ${Wt(g)}
      float ${s}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        return ${s}(${Ht(m,r)});
      }
    `}const i=e[5],a=e[4]*i,c=e[3]*a,l=e[2]*c,u=e[1]*l;if(n.shapeInfo.isUniform)return`
      float ${s}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
        int index = round(dot(
          vec4(row, col, depth, depth2),
          vec4(${u}, ${l}, ${c}, ${a})) +
          dot(
            vec2(depth3, depth4),
            vec2(${i}, 1)));
        ${Gt(n)}
      }
    `;const d=n.shapeInfo.flatOffset,h=n.shapeInfo.texShape,f=h[0],p=h[1];if(p===u&&d==null)return`
      float ${s}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
          vec4(${l}, ${c}, ${a}, ${i})) +
               float(depth4);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${p}.0, ${f}.0);
        return sampleTexture(${t}, uv);
      }
    `;if(p===i&&d==null)return`
      float ${s}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        float texR = dot(vec4(row, col, depth, depth2),
          vec4(${e[1]*e[2]*e[3]*e[4]},
               ${e[2]*e[3]*e[4]},
               ${e[3]*e[4]},
               ${e[4]})) + float(depth3);
        int texC = depth4;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${p}.0, ${f}.0);
        return sampleTexture(${t}, uv);
      }
    `;const x=vt(t);return`
    float ${s}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${u} + col * ${l} + depth * ${c} +
          depth2 * ${a} + depth3 * ${i} + depth4 + ${x};
      vec2 uv = uvFromFlat(${f}, ${p}, index);
      return sampleTexture(${t}, uv);
    }
  `}function Gt(n){const e=n.name,t=F(n.shapeInfo.logicalShape);return t<2?`return ${e};`:`
    for (int i = 0; i < ${t}; i++) {
      if (i == index) {
        return ${e}[i];
      }
    }
  `}function Up(n,e){const t=n.name,s=t.charAt(0).toUpperCase()+t.slice(1),o="get"+s+"AtOutCoords",r=n.shapeInfo.logicalShape.length,i=e.logicalShape.length,a=pa(n.shapeInfo.logicalShape,e.logicalShape),c=z(i),l=i-r;let u;const d=["x","y","z","w","u","v"];r===0?u="":i<2&&a.length>=1?u="coords = 0;":u=a.map(C=>`coords.${d[C+l]} = 0;`).join(`
`);let h="";i<2&&r>0?h="coords":h=n.shapeInfo.logicalShape.map((C,w)=>`coords.${d[w+l]}`).join(", ");let f="return outputValue;";const x=F(n.shapeInfo.logicalShape)===1,m=F(e.logicalShape)===1;if(r===1&&!x&&!m)f=`
      return vec4(outputValue.xy, outputValue.xy);
    `;else if(x&&!m)i===1?f=`
        return vec4(outputValue.x, outputValue.x, 0., 0.);
      `:f=`
        return vec4(outputValue.x);
      `;else if(a.length){const C=r-2,w=r-1;a.indexOf(C)>-1&&a.indexOf(w)>-1?f="return vec4(outputValue.x);":a.indexOf(C)>-1?f="return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);":a.indexOf(w)>-1&&(f="return vec4(outputValue.xx, outputValue.zz);")}return`
    vec4 ${o}() {
      ${c} coords = getOutputCoords();
      ${u}
      vec4 outputValue = get${s}(${h});
      ${f}
    }
  `}function Wp(n,e){const t=n.name,s=t.charAt(0).toUpperCase()+t.slice(1),o="get"+s+"AtOutCoords",r=e.texShape,i=n.shapeInfo.texShape,a=n.shapeInfo.logicalShape.length,c=e.logicalShape.length;if(!n.shapeInfo.isUniform&&a===c&&n.shapeInfo.flatOffset==null&&oe(i,r))return`
      float ${o}() {
        return sampleTexture(${t}, resultUV);
      }
    `;const l=z(c),u=pa(n.shapeInfo.logicalShape,e.logicalShape),d=c-a;let h;const f=["x","y","z","w","u","v"];a===0?h="":c<2&&u.length>=1?h="coords = 0;":h=u.map(x=>`coords.${f[x+d]} = 0;`).join(`
`);let p="";return c<2&&a>0?p="coords":p=n.shapeInfo.logicalShape.map((x,g)=>`coords.${f[g+d]}`).join(", "),`
    float ${o}() {
      ${l} coords = getOutputCoords();
      ${h}
      return get${s}(${p});
    }
  `}function z(n){if(n<=1)return"int";if(n===2)return"ivec2";if(n===3)return"ivec3";if(n===4)return"ivec4";if(n===5)return"ivec5";if(n===6)return"ivec6";throw Error(`GPU for rank ${n} is not yet supported`)}function to(n,e,t){const{newShape:s,keptDims:o}=xt(e),r=e.length,i=n&&r===3&&e[0]===1,a=i?e.slice(1):s,c=!n&&r>1&&!oe(e,t)&&s.length<r||i;return{useSqueezeShape:c,uniformShape:c?a:e,keptDims:o}}function zt(n,e){const t=JSON.parse(JSON.stringify(n));return t.shapeInfo.logicalShape=e,t}function Ht(n,e){return e.map(t=>n[t]).join(", ")}function Gp(n,e,t,s){const o=t.map((u,d)=>{const h={logicalShape:u.shape,texShape:u.isUniform?null:u.texData.texShape,isUniform:u.isUniform,isPacked:u.isUniform?!1:u.texData.isPacked,flatOffset:null};return u.texData!=null&&u.texData.slice!=null&&u.texData.slice.flatOffset>0&&(h.flatOffset=u.texData.slice.flatOffset),{name:e.variableNames[d],shapeInfo:h}}),r=o.map(u=>u.shapeInfo),i={logicalShape:s.shape,texShape:s.texData.texShape,isUniform:!1,isPacked:s.texData.isPacked,flatOffset:null},a=ap(o,i,e),c=Xi(n.gl,a),l=n.createProgram(c);return v().get("ENGINE_COMPILE_ONLY")?{program:e,fragmentShader:c,source:a,webGLProgram:l,inShapeInfos:r,outShapeInfo:i,variablesLocations:null,customUniformLocations:null,infLoc:null,nanLoc:null,outShapeLocation:null,outShapeStridesLocation:null,outTexShapeLocation:null}:(n.buildVao(l),Object.assign({program:e,fragmentShader:c,source:a,webGLProgram:l,inShapeInfos:r,outShapeInfo:i},xa(n,e,l)))}function xa(n,e,t){const s=[],o=[];let r,i,a,c=null,l=null;l=n.getUniformLocation(t,"NAN",!1),v().getNumber("WEBGL_VERSION")===1&&(c=n.getUniformLocation(t,"INFINITY",!1));const u=!1;for(const d of e.variableNames){const h={name:d,uniform:n.getUniformLocation(t,d,u),offset:n.getUniformLocation(t,`offset${d}`,u)};e.enableShapeUniforms&&(h.shape=n.getUniformLocation(t,`${d}Shape`,u),h.texShape=n.getUniformLocation(t,`${d}TexShape`,u)),s.push(h)}if(e.enableShapeUniforms&&(r=n.getUniformLocation(t,"outShape",u),a=n.getUniformLocation(t,"outShapeStrides",u),i=n.getUniformLocation(t,"outTexShape",u)),e.customUniforms)for(const d of e.customUniforms)o.push(n.getUniformLocation(t,d.name,u));return{variablesLocations:s,customUniformLocations:o,infLoc:c,nanLoc:l,outShapeLocation:r,outShapeStridesLocation:a,outTexShapeLocation:i}}function Lo(n,e){if(n.length!==e.length)throw Error(`Binary was compiled with ${n.length} inputs, but was executed with ${e.length} inputs`);n.forEach((t,s)=>{const o=t.logicalShape,r=e[s],i=r.shape;if(!oe(o,i))throw Error(`Binary was compiled with different shapes than the current args. Shapes ${o} and ${i} must match`);if(t.isUniform&&r.isUniform)return;const a=t.texShape,c=r.isUniform?null:r.texData.texShape;if(!oe(a,c))throw Error(`Binary was compiled with different texture shapes than the current args. Shape ${a} and ${c} must match`)})}function zp(n,e,t,s,o){e.program.enableShapeUniforms||(Lo(e.inShapeInfos,t),Lo([e.outShapeInfo],[s]));const r=s.texData.texture,i=s.texData.texShape;s.texData.isPacked?n.setOutputPackedMatrixTexture(r.texture,i[0],i[1]):n.setOutputMatrixTexture(r.texture,i[0],i[1]),n.setProgram(e.webGLProgram),n.bindVertexArray(e.webGLProgram.vao),v().getNumber("WEBGL_VERSION")===1&&e.infLoc!==null&&n.gl.uniform1f(e.infLoc,1/0),e.nanLoc!==null&&n.gl.uniform1f(e.nanLoc,NaN);for(let c=0;c<t.length;++c){const l=t[c],{uniform:u,offset:d,shape:h,texShape:f}=e.variablesLocations[c];if(h){const{uniformShape:p}=to(e.program.packedInputs,l.shape,l.texData.texShape);switch(p.length){case 1:n.gl.uniform1iv(h,new Int32Array(p));break;case 2:n.gl.uniform2iv(h,new Int32Array(p));break;case 3:n.gl.uniform3iv(h,new Int32Array(p));break;case 4:n.gl.uniform4iv(h,new Int32Array(p));break}}if(f&&n.gl.uniform2i(f,l.texData.texShape[0],l.texData.texShape[1]),u!=null){if(l.isUniform){if(F(l.shape)<2)n.gl.uniform1f(u,l.uniformValues[0]);else{let p=l.uniformValues;p instanceof Float32Array||(p=new Float32Array(p)),n.gl.uniform1fv(u,p)}continue}l.texData.slice!=null&&d!=null&&n.gl.uniform1i(d,l.texData.slice.flatOffset),n.setInputMatrixTexture(l.texData.texture.texture,u,c)}}const a=e.outShapeLocation;if(a)switch(s.shape.length){case 1:n.gl.uniform1iv(a,new Int32Array(s.shape));break;case 2:n.gl.uniform2iv(a,new Int32Array(s.shape));break;case 3:n.gl.uniform3iv(a,new Int32Array(s.shape));break;case 4:n.gl.uniform4iv(a,new Int32Array(s.shape));break}if(e.outShapeStridesLocation){const c=se(s.shape);switch(s.shape.length){case 2:n.gl.uniform1iv(e.outShapeStridesLocation,new Int32Array(c));break;case 3:n.gl.uniform2iv(e.outShapeStridesLocation,new Int32Array(c));break;case 4:n.gl.uniform3iv(e.outShapeStridesLocation,new Int32Array(c));break}}if(e.outTexShapeLocation&&n.gl.uniform2i(e.outTexShapeLocation,s.texData.texShape[0],s.texData.texShape[1]),e.program.customUniforms&&o)for(let c=0;c<e.program.customUniforms.length;++c){const l=e.program.customUniforms[c],u=e.customUniformLocations[c],d=o[c];if(l.type==="float")n.gl.uniform1fv(u,d);else if(l.type==="vec2")n.gl.uniform2fv(u,d);else if(l.type==="vec3")n.gl.uniform3fv(u,d);else if(l.type==="vec4")n.gl.uniform4fv(u,d);else if(l.type==="int")n.gl.uniform1iv(u,d);else if(l.type==="ivec2")n.gl.uniform2iv(u,d);else if(l.type==="ivec3")n.gl.uniform3iv(u,d);else if(l.type==="ivec4")n.gl.uniform4iv(u,d);else throw Error(`uniform type ${l.type} is not supported yet.`)}n.executeProgram()}function Hp(n,e,t){let s="";e.concat(t).forEach(i=>{const a=i.texData!=null&&i.texData.slice!=null&&i.texData.slice.flatOffset>0;if(n.enableShapeUniforms&&!i.isUniform){const c=i.texData.texShape,{useSqueezeShape:l,uniformShape:u,keptDims:d}=to(n.packedInputs,i.shape,c);let h="",f="",p="";if(u.length===1&&n.packedInputs){const I=[Math.ceil(c[0]/2),Math.ceil(c[1]/2)];h=`${I[0]>1}_${I[1]>1}`}else if(u.length===2&&!n.packedInputs)f=`${u[0]>1}_${u[1]>1}`;else if(u.length>2&&!n.packedInputs){const I=se(u);p=`${I[0]===c[1]}_${I[I.length-1]===c[1]}`}const x=i.shape.length,g=u.length===2&&oe(i.shape,c),m=F(i.shape)===1,C=_n(i.shape,t.shape),w=!n.packedInputs&&x===t.shape.length&&oe(c,t.texData.texShape),y=n.packedInputs||u.length>2?"":`${c[0]>1}_${c[1]>1}`;s+=`${x}_${w}_${l?d:""}_${u.length}_${m}_${C}_${g}_${h}_${f}_${p}_${y}_${a}`}else{const c=i.isUniform?"uniform":i.texData.texShape;s+=`${i.shape}_${c}_${a}`}});const o=n.userCode;let r=n.constructor.name;return r+="_"+s+"_"+o+`${v().getNumber("WEBGL_VERSION")}`,r}function ce(n){return v().getBool("WEBGL_USE_SHAPES_UNIFORMS")&&n<=4}class Xp{constructor(e){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outPackingScheme=rn.DENSE,this.customUniforms=[{name:"texShape",type:"ivec2"}];const t=pe();this.outputShape=e,this.enableShapeUniforms=ce(this.outputShape.length),this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        ${this.enableShapeUniforms?jn(["r","c","d"],e):yt(["r","c","d"],e)}
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx * vec2(texShape[0], texShape[1]));
        int index = 4 * (resTexRC.x * texShape[1] + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getA(rc.x, rc.y, rc.z);
        }

        ${t.output} = result;
      }
    `}}class jp{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outPackingScheme=rn.DENSE,this.customUniforms=[{name:"texShape",type:"ivec2"}];const t=pe();this.outputShape=e,this.enableShapeUniforms=ce(this.outputShape.length),this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        ${this.enableShapeUniforms?jn(["r","c","d"],e):yt(["r","c","d"],e)}
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx * vec2(texShape[0], texShape[1]));
        int index = 4 * (resTexRC.x * texShape[1] + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getChannel(getA(rc.x, rc.y, rc.z), vec2(rc.y, rc.z));
        }

        ${t.output} = result;
      }
    `}}class qp{constructor(e){this.variableNames=["A"],this.outTexUsage=be.DOWNLOAD;const t=pe();this.outputShape=e,this.userCode=`
      ${fa}

      void main() {
        float x = getAAtOutCoords();
        ${t.output} = encode_float(x);
      }
    `}}class Kp{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!1,this.outTexUsage=be.DOWNLOAD;const t=pe();this.outputShape=e,this.userCode=`
      ${fa}

      void main() {
        ivec3 coords = getOutputCoords();
        float x = getChannel(getAAtOutCoords(), vec2(coords.y, coords.z));
        ${t.output} = encode_float(x);
      }
    `}}const Yp={R:0,G:1,B:2,A:3};class Bo{constructor(e,t=!1,s="RGBA"){this.variableNames=["A"],this.customUniforms=[{name:"texShape",type:"ivec2"}];const o=pe();this.outputShape=e,this.enableShapeUniforms=ce(this.outputShape.length);let r="result";t&&(r="floor(result * 255. + 0.5)");let i="";for(let a=0;a<s.length;a++){const c=s[a];i+=`
          if(offset == ${a}) {
            result = values[${Yp[c]}];
          }`}this.userCode=`
      ${this.enableShapeUniforms?eo():Js(e)}

      void main() {
        ivec3 coords = getOutputCoords();
        int flatIndex = getFlatIndex(coords);
        float result = 0.;
        int offset = imod(flatIndex, ${s.length});

        flatIndex = idiv(flatIndex, ${s.length}, 1.);

        int r = flatIndex / texShape[1];
        if (r < texShape[0]) {
          int c = imod(flatIndex, texShape[1]);
          vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
          vec4 values = ${o.texture2D}(A, uv);
          ${i}
        }
        ${o.output} = vec4(${r}, 0., 0., 0.);
      }
    `}}class Qp{constructor(e,t=!1){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.customUniforms=[{name:"texShape",type:"ivec2"}];const s=pe();this.outputShape=e,this.enableShapeUniforms=ce(this.outputShape.length);let o="",r="result";t&&(r="floor(result * 255. + 0.5)");for(let i=0;i<=1;i++)for(let a=0;a<=1;a++){const c=i*2+a;o+=`
          localCoords = coords;
          if(localCoords[2] + ${a} < ${this.enableShapeUniforms?"outShape[2]":`${e[2]}`}) {
          localCoords[2] += ${a};
          if (localCoords[1] + ${i} < ${this.enableShapeUniforms?"outShape[1]":`${e[1]}`}) {
            localCoords[1] += ${i};

            flatIndex = getFlatIndex(localCoords);
            offset = imod(flatIndex, 4);

            flatIndex = idiv(flatIndex, 4, 1.);

            int r = flatIndex / texShape[1];
            int c = imod(flatIndex, texShape[1]);
            vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
            values = ${s.texture2D}(A, uv);

            if (offset == 0) {
              result[${c}] = values[0];
            } else if (offset == 1) {
              result[${c}] = values[1];
            } else if (offset == 2) {
              result[${c}] = values[2];
            } else {
              result[${c}] = values[3];
            }
          }
        }
        `}this.userCode=`
        ${this.enableShapeUniforms?eo():Js(e)}

        void main() {
          ivec3 coords = getOutputCoords();

          vec4 result = vec4(0.);
          int flatIndex, r, c, offset;
          ivec3 localCoords;
          vec2 uv;
          vec4 values;

          ${o}

          ${s.output} = ${r};
        }
    `}}function Ca(n){const e=pe(),t=`${e.version}
    precision highp float;
    ${e.attribute} vec3 clipSpacePos;
    ${e.attribute} vec2 uv;
    ${e.varyingVs} vec2 resultUV;

    void main() {
      gl_Position = vec4(clipSpacePos, 1);
      resultUV = uv;
    }`;return Hi(n,t)}function ba(n){const e=new Float32Array([-1,1,0,0,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0]);return Ki(n,e)}function wa(n){const e=new Uint16Array([0,1,2,2,1,3]);return Yi(n,e)}function gn(n,e,t,s,o,r){Zi(e,t);const i=Qi(n),a=n.TEXTURE_2D;return A(n,()=>n.bindTexture(a,i)),A(n,()=>n.texParameteri(a,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE)),A(n,()=>n.texParameteri(a,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)),A(n,()=>n.texParameteri(a,n.TEXTURE_MIN_FILTER,n.NEAREST)),A(n,()=>n.texParameteri(a,n.TEXTURE_MAG_FILTER,n.NEAREST)),v().getNumber("WEBGL_VERSION")===1?A(n,()=>n.texImage2D(a,0,s,e,t,0,o,r,null)):A(n,()=>n.texStorage2D(a,1,s,e,t)),A(n,()=>n.bindTexture(n.TEXTURE_2D,null)),{texture:i,texShape:[t,e]}}function no(n){return n.internalFormatFloat}function ya(n,e,t,s){const[o,r]=mn(e,t);return gn(n,o,r,no(s),s.textureFormatFloat,n.FLOAT)}function so(n){return n.internalFormatHalfFloat}function va(n,e,t,s){const[o,r]=mn(e,t);return gn(n,o,r,so(s),s.textureFormatFloat,s.textureTypeHalfFloat)}function oo(n){return n.downloadTextureFormat}function $a(n,e,t,s){const[o,r]=mn(e,t);return gn(n,o,r,oo(s),n.RGBA,n.UNSIGNED_BYTE)}function ro(n){return n.internalFormatPackedFloat}function Sa(n,e,t,s){const[o,r]=Vt(e,t);return gn(n,o,r,ro(s),n.RGBA,n.FLOAT)}function io(n){return n.internalFormatPackedHalfFloat}function Ia(n,e,t,s){const[o,r]=Vt(e,t);return gn(n,o,r,io(s),n.RGBA,s.textureTypeHalfFloat)}function Ra(n,e,t){return A(n,()=>n.bindBuffer(n.ARRAY_BUFFER,t)),Rs(n,e,"clipSpacePos",t,3,20,0)&&Rs(n,e,"uv",t,2,20,12)}function Ta(n,e,t,s,o,r){A(n,()=>n.bindTexture(n.TEXTURE_2D,e));let i,a,c;o instanceof Uint8Array?(i=new Uint8Array(t*s*4),a=n.UNSIGNED_BYTE,c=n.RGBA):(i=new Float32Array(t*s*4),a=n.FLOAT,c=r.internalFormatPackedFloat),i.set(o),v().getNumber("WEBGL_VERSION")===2?A(n,()=>n.texSubImage2D(n.TEXTURE_2D,0,0,0,t,s,n.RGBA,a,i)):A(n,()=>n.texImage2D(n.TEXTURE_2D,0,c,t,s,0,n.RGBA,a,i)),A(n,()=>n.bindTexture(n.TEXTURE_2D,null))}function Ea(n,e,t){A(n,()=>n.bindTexture(n.TEXTURE_2D,e)),t.data instanceof Uint8Array?v().getNumber("WEBGL_VERSION")===2?A(n,()=>n.texSubImage2D(n.TEXTURE_2D,0,0,0,t.width,t.height,n.RGBA,n.UNSIGNED_BYTE,t.data)):A(n,()=>n.texImage2D(n.TEXTURE_2D,0,n.RGBA,t.width,t.height,0,n.RGBA,n.UNSIGNED_BYTE,t.data)):v().getNumber("WEBGL_VERSION")===2?A(n,()=>n.texSubImage2D(n.TEXTURE_2D,0,0,0,n.RGBA,n.UNSIGNED_BYTE,t)):A(n,()=>n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,t)),A(n,()=>n.bindTexture(n.TEXTURE_2D,null))}function Na(n,e,t,s){const o=n.createBuffer();A(n,()=>n.bindBuffer(n.PIXEL_PACK_BUFFER,o));const a=4*4*e*t;return A(n,()=>n.bufferData(n.PIXEL_PACK_BUFFER,a,n.STREAM_READ)),A(n,()=>n.readPixels(0,0,t,e,n.RGBA,n.FLOAT,0)),A(n,()=>n.bindBuffer(n.PIXEL_PACK_BUFFER,null)),o}function ka(n,e,t){const s=n,o=new Float32Array(t);return s.bindBuffer(s.PIXEL_PACK_BUFFER,e),s.getBufferSubData(s.PIXEL_PACK_BUFFER,0,o),s.bindBuffer(s.PIXEL_PACK_BUFFER,null),o}function Aa(n,e,t,s){const[o,r]=mn(e,t),i=4,a=new Uint8Array(jf(e*t,i));return A(n,()=>n.readPixels(0,0,o,r,s.downloadTextureFormat,n.UNSIGNED_BYTE,a)),new Float32Array(a.buffer)}function Fa(n,e,t,s,o,r,i,a){const c=n,l=new Float32Array(qf(r,i));return c.bindBuffer(c.PIXEL_PACK_BUFFER,e),c.getBufferSubData(c.PIXEL_PACK_BUFFER,0,l),c.bindBuffer(c.PIXEL_PACK_BUFFER,null),l}function Da(n,e,t){const s=new Float32Array(e*t*4);return A(n,()=>n.readPixels(0,0,t,e,n.RGBA,n.FLOAT,s)),s}const oS=Object.freeze(Object.defineProperty({__proto__:null,bindVertexProgramAttributeStreams:Ra,createBufferFromOutputTexture:Na,createFloat16MatrixTexture:va,createFloat16PackedMatrixTexture:Ia,createFloat32MatrixTexture:ya,createIndexBuffer:wa,createPackedMatrixTexture:Sa,createUnsignedBytesMatrixTexture:$a,createVertexBuffer:ba,createVertexShader:Ca,downloadByteEncodedFloatMatrixFromOutputTexture:Aa,downloadFloat32MatrixFromBuffer:ka,downloadMatrixFromPackedOutputTexture:Da,downloadPackedMatrixFromBuffer:Fa,getInternalFormatForFloat16MatrixTexture:so,getInternalFormatForFloat16PackedMatrixTexture:io,getInternalFormatForFloat32MatrixTexture:no,getInternalFormatForPackedMatrixTexture:ro,getInternalFormatForUnsignedBytesMatrixTexture:oo,uploadDenseMatrixToTexture:Ta,uploadPixelDataToTexture:Ea},Symbol.toStringTag,{value:"Module"}));class rs{constructor(e){this.outputTexture=null,this.program=null,this.disposed=!1,this.itemsToPoll=[];const t=v().getNumber("WEBGL_VERSION");if(e!=null?(this.gl=e,zf(t,e)):this.gl=De(t),e=this.gl,v().getNumber("WEBGL_VERSION")===2){const r=e;this.createVertexArray=()=>A(r,()=>r.createVertexArray()),this.bindVertexArray=i=>A(r,()=>r.bindVertexArray(i)),this.deleteVertexArray=i=>A(r,()=>r.deleteVertexArray(i)),this.getVertexArray=()=>A(r,()=>r.getParameter(r.VERTEX_ARRAY_BINDING))}else if(e!=null){const r=e.getExtension("OES_vertex_array_object");if(r==null)throw new Error("All WebGL1 implementations are expected to offer OES_vertex_array_object.");this.createVertexArray=()=>A(e,()=>r.createVertexArrayOES()),this.bindVertexArray=i=>A(e,()=>r.bindVertexArrayOES(i)),this.deleteVertexArray=i=>A(e,()=>r.deleteVertexArrayOES(i)),this.getVertexArray=()=>A(e,()=>e.getParameter(r.VERTEX_ARRAY_BINDING_OES))}let s="WEBGL_color_buffer_float";const o="EXT_color_buffer_half_float";if(this.parallelCompilationExtension=this.gl.getExtension("KHR_parallel_shader_compile"),v().getNumber("WEBGL_VERSION")===1){const r="OES_texture_float",i="OES_texture_half_float";if(this.textureFloatExtension=Jt(this.gl,r),we(this.gl,i))this.textureHalfFloatExtension=Jt(this.gl,i);else if(v().get("WEBGL_FORCE_F16_TEXTURES"))throw new Error("GL context does not support half float textures, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.");if(this.colorBufferFloatExtension=this.gl.getExtension(s),we(this.gl,o))this.colorBufferHalfFloatExtension=Jt(this.gl,o);else if(v().get("WEBGL_FORCE_F16_TEXTURES"))throw new Error("GL context does not support color renderable half floats, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.")}else if(s="EXT_color_buffer_float",we(this.gl,s))this.colorBufferFloatExtension=this.gl.getExtension(s);else if(we(this.gl,o))this.colorBufferHalfFloatExtension=this.gl.getExtension(o);else throw new Error("GL context does not support color renderable floats");this.vertexBuffer=ba(this.gl),this.indexBuffer=wa(this.gl),this.framebuffer=Ji(this.gl),this.textureConfig=Qs(this.gl,this.textureHalfFloatExtension)}get debug(){return v().getBool("DEBUG")}dispose(){if(this.disposed)return;this.program!=null&&console.warn("Disposing a GPGPUContext that still has a bound WebGLProgram. This is probably a resource leak, delete the program with GPGPUContext.deleteProgram before disposing."),this.outputTexture!=null&&console.warn("Disposing a GPGPUContext that still has a bound output matrix texture.  This is probably a resource leak, delete the output matrix texture with GPGPUContext.deleteMatrixTexture before disposing.");const e=this.gl;A(e,()=>e.finish()),A(e,()=>e.bindFramebuffer(e.FRAMEBUFFER,null)),A(e,()=>e.deleteFramebuffer(this.framebuffer)),A(e,()=>e.bindBuffer(e.ARRAY_BUFFER,null)),A(e,()=>e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null)),A(e,()=>e.deleteBuffer(this.indexBuffer)),this.disposed=!0}createFloat32MatrixTexture(e,t){return this.throwIfDisposed(),ya(this.gl,e,t,this.textureConfig)}createFloat16MatrixTexture(e,t){return this.throwIfDisposed(),va(this.gl,e,t,this.textureConfig)}createUnsignedBytesMatrixTexture(e,t){return this.throwIfDisposed(),$a(this.gl,e,t,this.textureConfig)}uploadPixelDataToTexture(e,t){this.throwIfDisposed(),Ea(this.gl,e,t)}uploadDenseMatrixToTexture(e,t,s,o){this.throwIfDisposed(),Ta(this.gl,e,t,s,o,this.textureConfig)}createFloat16PackedMatrixTexture(e,t){return this.throwIfDisposed(),Ia(this.gl,e,t,this.textureConfig)}createPackedMatrixTexture(e,t){return this.throwIfDisposed(),Sa(this.gl,e,t,this.textureConfig)}deleteMatrixTexture(e){this.throwIfDisposed(),this.outputTexture===e&&(Ts(this.gl,this.framebuffer),this.outputTexture=null),A(this.gl,()=>this.gl.deleteTexture(e))}downloadByteEncodedFloatMatrixFromOutputTexture(e,t,s){return this.downloadMatrixDriver(e,()=>Aa(this.gl,t,s,this.textureConfig))}downloadPackedMatrixFromBuffer(e,t,s,o,r,i){return Fa(this.gl,e,t,s,o,r,i,this.textureConfig)}downloadFloat32MatrixFromBuffer(e,t){return ka(this.gl,e,t)}createBufferFromTexture(e,t,s){this.bindTextureToFrameBuffer(e);const o=Na(this.gl,t,s,this.textureConfig);return this.unbindTextureToFrameBuffer(),o}createAndWaitForFence(){const e=this.createFence(this.gl);return this.pollFence(e)}createFence(e){let t,s;if(v().getBool("WEBGL_FENCE_API_ENABLED")){const o=e,r=o.fenceSync(o.SYNC_GPU_COMMANDS_COMPLETE,0);e.flush(),s=()=>{const i=o.clientWaitSync(r,0,0);return i===o.ALREADY_SIGNALED||i===o.CONDITION_SATISFIED},t=r}else v().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0?(t=this.beginQuery(),this.endQuery(),s=()=>this.isQueryAvailable(t,v().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))):s=()=>!0;return{query:t,isFencePassed:s}}downloadMatrixFromPackedTexture(e,t,s){return this.downloadMatrixDriver(e,()=>Da(this.gl,t,s))}createProgram(e){this.throwIfDisposed();const t=this.gl;this.vertexShader==null&&(this.vertexShader=Ca(t));const s=ji(t);A(t,()=>t.attachShader(s,this.vertexShader)),A(t,()=>t.attachShader(s,e)),qi(t,s);const o=Object.assign(s,{vao:this.createVertexArray()});return this.debug&&Rn(t,o),o}buildVao(e){this.setProgram(e),this.bindVertexArray(e.vao);const t=this.gl;A(t,()=>t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer)),Ra(t,e,this.vertexBuffer)}deleteProgram(e){this.throwIfDisposed(),e===this.program&&(this.program=null),e!=null&&(A(this.gl,()=>this.gl.deleteProgram(e)),this.deleteVertexArray(e.vao))}setProgram(e){this.throwIfDisposed(),this.program=e,this.program!=null&&this.debug&&Rn(this.gl,this.program),A(this.gl,()=>this.gl.useProgram(e))}getUniformLocation(e,t,s=!0){return this.throwIfDisposed(),s?ta(this.gl,e,t):na(this.gl,e,t)}getAttributeLocation(e,t){return this.throwIfDisposed(),A(this.gl,()=>this.gl.getAttribLocation(e,t))}getUniformLocationNoThrow(e,t){return this.throwIfDisposed(),this.gl.getUniformLocation(e,t)}setInputMatrixTexture(e,t,s){this.throwIfDisposed(),this.throwIfNoProgram(),sa(this.gl,e,t,s)}setOutputMatrixTexture(e,t,s){this.setOutputMatrixTextureDriver(e,s,t)}setOutputPackedMatrixTexture(e,t,s){this.throwIfDisposed();const[o,r]=Vt(t,s);this.setOutputMatrixTextureDriver(e,o,r)}setOutputMatrixWriteRegion(e,t,s,o){this.setOutputMatrixWriteRegionDriver(s,e,o,t)}setOutputPackedMatrixWriteRegion(e,t,s,o){throw new Error("setOutputPackedMatrixWriteRegion not implemented.")}debugValidate(){this.program!=null&&Rn(this.gl,this.program),en(this.gl)}executeProgram(){this.throwIfDisposed(),this.throwIfNoProgram();const e=this.gl;if(this.debug){const t=this.getVertexArray();console.assert(t===this.program.vao,"VAO changed between setProgram and executeProgram!"),this.debugValidate()}A(e,()=>e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0))}blockUntilAllProgramsCompleted(){this.throwIfDisposed(),A(this.gl,()=>this.gl.finish())}getQueryTimerExtension(){return this.disjointQueryTimerExtension==null&&(this.disjointQueryTimerExtension=Jt(this.gl,v().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2?"EXT_disjoint_timer_query_webgl2":"EXT_disjoint_timer_query")),this.disjointQueryTimerExtension}getQueryTimerExtensionWebGL2(){return this.getQueryTimerExtension()}getQueryTimerExtensionWebGL1(){return this.getQueryTimerExtension()}beginQuery(){if(v().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2){const s=this.gl,o=this.getQueryTimerExtensionWebGL2(),r=s.createQuery();return s.beginQuery(o.TIME_ELAPSED_EXT,r),r}const e=this.getQueryTimerExtensionWebGL1(),t=e.createQueryEXT();return e.beginQueryEXT(e.TIME_ELAPSED_EXT,t),t}endQuery(){if(v().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2){const t=this.gl,s=this.getQueryTimerExtensionWebGL2();t.endQuery(s.TIME_ELAPSED_EXT);return}const e=this.getQueryTimerExtensionWebGL1();e.endQueryEXT(e.TIME_ELAPSED_EXT)}async waitForQueryAndGetTime(e){return await po(()=>this.disposed||this.isQueryAvailable(e,v().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))),this.getQueryTime(e,v().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))}getQueryTime(e,t){if(t===0)return null;if(t===2){const s=this.gl;return s.getQueryParameter(e,s.QUERY_RESULT)/1e6}else{const s=this.getQueryTimerExtensionWebGL1();return s.getQueryObjectEXT(e,s.QUERY_RESULT_EXT)/1e6}}isQueryAvailable(e,t){if(t===0)return!0;if(t===2){const s=this.gl,o=this.getQueryTimerExtensionWebGL2(),r=s.getQueryParameter(e,s.QUERY_RESULT_AVAILABLE);return this.disjoint==null&&(this.disjoint=this.gl.getParameter(o.GPU_DISJOINT_EXT)),r&&!this.disjoint}else{const s=this.getQueryTimerExtensionWebGL1(),o=s.getQueryObjectEXT(e,s.QUERY_RESULT_AVAILABLE_EXT);return this.disjoint==null&&(this.disjoint=this.gl.getParameter(s.GPU_DISJOINT_EXT)),o&&!this.disjoint}}pollFence(e){return new Promise(t=>{this.addItemToPoll(()=>e.isFencePassed(),()=>t())})}pollItems(){const e=Zp(this.itemsToPoll.map(t=>t.isDoneFn));for(let t=0;t<=e;++t){const{resolveFn:s}=this.itemsToPoll[t];s()}this.itemsToPoll=this.itemsToPoll.slice(e+1)}addItemToPoll(e,t){if(this.itemsToPoll.push({isDoneFn:e,resolveFn:t}),this.itemsToPoll.length>1)return;let s;"setTimeoutCustom"in v().platform&&(s=v().platform.setTimeoutCustom.bind(v().platform)),po(()=>(this.pollItems(),this.itemsToPoll.length===0),()=>0,null,s)}bindTextureToFrameBuffer(e){this.throwIfDisposed(),Tn(this.gl,e,this.framebuffer),this.debug&&en(this.gl)}unbindTextureToFrameBuffer(){this.outputTexture!=null?(Tn(this.gl,this.outputTexture,this.framebuffer),this.debug&&en(this.gl)):Ts(this.gl,this.framebuffer)}downloadMatrixDriver(e,t){this.bindTextureToFrameBuffer(e);const s=t();return this.unbindTextureToFrameBuffer(),s}setOutputMatrixTextureDriver(e,t,s){this.throwIfDisposed();const o=this.gl;Tn(o,e,this.framebuffer),this.debug&&en(o),this.outputTexture=e,A(o,()=>o.viewport(0,0,t,s)),A(o,()=>o.scissor(0,0,t,s))}setOutputMatrixWriteRegionDriver(e,t,s,o){this.throwIfDisposed(),A(this.gl,()=>this.gl.scissor(e,t,s,o))}throwIfDisposed(){if(this.disposed)throw new Error("Attempted to use disposed GPGPUContext.")}throwIfNoProgram(){if(this.program==null)throw new Error("No GPU program is currently set.")}}function Zp(n){let e=0;for(;e<n.length&&n[e]();++e);return e-1}function Jp(n){const e=new Float32Array(n.length);for(let t=0;t<n.length;++t)e[t]=Math.abs(n[t]);return e}function ve(n){return(e,t,s,o,r)=>{const i=de(e,t),a=i.length,c=se(i),l=F(i),u=ct(r,l),d=e.length,h=t.length,f=se(e),p=se(t),x=_n(e,i),g=_n(t,i);if(x.length+g.length===0)for(let m=0;m<u.length;++m)u[m]=n(s[m%s.length],o[m%o.length]);else for(let m=0;m<u.length;++m){const C=Os(m,a,c),w=C.slice(-d);x.forEach(E=>w[E]=0);const y=us(w,d,f),I=C.slice(-h);g.forEach(E=>I[E]=0);const N=us(I,h,p);u[m]=n(s[y],o[N])}return[u,i]}}function em(n,e,t,s){if(s==="int32"){const o=Int32Array.from(n);return[e,"int32",o]}if(s==="bool"){const o=Gn([0],t),[r,i]=ve((a,c)=>a!==c?1:0)(e,[],n,o,"bool");return[i,"bool",r]}throw new Error(`Error in Cast: failed to cast ${t} to ${s}`)}const tm=ve(((n,e)=>n+e));function nm(n,e,t,s,o){const r=F(s),i=Qe(o,t);for(let a=0;a<n.length;a++){const c=n[a];if(c<0)throw new Error("Input x must be non-negative!");c>=o||(r>0?i[c]+=e[a]:i[c]+=1)}return i}function sm(n,e,t,s=!1){const o=n.shape[0],r=n.shape[1],i=re([o,t],e.dtype);for(let a=0;a<o;a++)for(let c=0;c<r;c++){const l=n.get(a,c);if(l<0)throw new Error("Input x must be non-negative!");l>=t||(s?i.set(1,a,l):e.size>0?i.set(i.get(a,l)+e.get(a,c),a,l):i.set(i.get(a,l)+1,a,l))}return i}const om=ve(((n,e)=>n&e));function He(n){return(e,t,s)=>{const o=ee(t,e.length);for(let r=0;r<e.length;++r)o[r]=n(e[r],s);return o}}const rm=He(n=>Math.ceil(n));function im(n,e,t,s){const o=ee(t,F(e));if(s&&t!=="string"){let r=0;n.forEach(i=>{const a=F(i.shape);o.set(i.vals,r),r+=a})}else{let r=0;n.forEach(i=>{const a=t==="string"?Pt(i.vals):i.vals;let c=0;for(let l=0;l<i.shape[0];++l){const u=l*e[1]+r;for(let d=0;d<i.shape[1];++d)o[u+d]=a[c++]}r+=i.shape[1]})}return o}const am=ve((n,e)=>n===e?1:0);const cm=He(n=>Math.exp(n));const lm=He(n=>Math.expm1(n));const um=He(n=>Math.floor(n));function dm(n,e,t,s,o,r,i,a,c){const l=re([s,r],t);for(let u=0;u<s;u++){const d=[];let h=0;for(let f=0;f<o;f++){const p=n[u*o+f];h+=p*i[f],d.push(p)}if(h<0||h>=c/r)throw new Error(`Invalid indices: ${d} does not index into ${a}`);for(let f=0;f<r;f++)l.values[u*r+f]=e.get(...e.indexToLoc(h*r+f))}return l}function hm(n,e,t){const s=re(t,n.dtype);for(let o=0;o<s.size;++o){const i=s.indexToLoc(o).slice(),a=i[0],c=i[2],l=e.locToIndex([a,c]);i[2]=e.values[l];const u=n.locToIndex(i);0<=u&&u<n.values.length&&(s.values[o]=n.values[u])}return s}const fm=ve((n,e)=>n>e?1:0);const pm=ve((n,e)=>n>=e?1:0);const mm=ve((n,e)=>n<e?1:0);const gm=ve((n,e)=>n<=e?1:0);function xm(n,e,t){const s=(e-n)/(t-1),o=Qe(t,"float32");o[0]=n;for(let r=1;r<o.length;r++)o[r]=o[r-1]+s;return o}const Cm=He(n=>Math.log(n));function bm(n,e,t,s){const o=ct(s,F(t));for(let r=0;r<o.length;++r){const i=r*e;let a=n[i];for(let c=0;c<e;++c){const l=n[i+c];(Number.isNaN(l)||l>a)&&(a=l)}o[r]=a}return o}const wm=ve(((n,e)=>Math.max(n,e)));const ym=ve(((n,e)=>Math.min(n,e)));const Oa=ve(((n,e)=>n*e));function vm(n,e,t){const s=_t(-1,t);return Oa([],e,s,n,t)}const $m=ve(((n,e)=>n!==e?1:0));function Sm(n,e,t,s,o){const r=e.length,i=F(e),a=se(e),c=se(o),l=ct(t,F(o));for(let u=0;u<i;++u){const d=Os(u,r,a),h=new Array(d.length);for(let p=0;p<h.length;p++)h[p]=d[s[p]];const f=us(h,r,c);l[f]=n[u]}return l}function Im(n,e,t,s){const[o,r]=Ue(n,s),i=Ve(e,"int32"),a=Qe(F(o),i),c=F(r);for(let l=0;l<a.length;++l){const u=l*c;let d=1;for(let h=0;h<c;++h)d*=t[u+h];a[l]=d}return{outVals:a,outShape:o,outDtype:i}}function Rm(n,e,t){n.forEach((s,o)=>{if(s<0||s>=t){const r=Os(o,e.length,se(e)).join(",");throw new Error(`indices[${r}] = ${s} is not in [0, ${t})`)}})}function Tm(n,e){for(let t=0;t<n.length;++t){const s=n[t],o=t===n.length-1?e:n[t+1].length;if(s.length===0)throw new Error("Ragged splits may not be empty");if(s[0]<0)throw new Error("Ragged splits must be non-negative");if(s[s.length-1]>o)throw new Error("Ragged splits must not point past values");for(let r=1;r<s.length;++r)if(s[r-1]>s[r])throw new Error("Ragged splits must be sorted in ascending order")}}function Em(n,e,t,s){const o=[];let r=0;const i=e.length-1+t.length,a=new Array(i).fill(null).map(()=>[0]);Tm(t,s);let c=1;for(let l=0;l<e.length-1;++l){c*=e[l];const u=e[l+1];for(let d=1;d<c+1;++d)a[l].push(d*u)}for(let l=0;l<n.length;++l){let u=n[l],d=n[l]+1;for(let h=0;h<t.length;++h){const f=t[h],p=h+e.length-1;if(p>=0){const x=a[p],g=x[x.length-1]-f[u];for(let m=u;m<d;++m)a[p].push(f[m+1]+g)}u=f[u],d=f[d]}d!==u&&(o.push([u,d]),r+=d-u)}return{outSplits:a,valueSlices:o,numValues:r}}function Nm(n){const e=[];for(let t=0;t<n.length;++t){const s=n[t].length,o=ee("int32",s);e.push(o),n[t].forEach((r,i)=>o[i]=r)}return e}function Mo(n,e){const t=n.slice(0,e);for(;t.length<e;)t.push(1);for(let s=e;s<n.length;s++)t[e-1]*=n[s];return t}function km(n,e,t,s,o,r){const i=Mo(e,2)[1],a=Mo(r,2)[1];let c=0;for(const l of t)for(let u=l[0];u<l[1];++u){for(let d=0;d<s;++d)o[c*a+d]=n[u*i+d];++c}}function Am(n,e,t,s,o){const r=e.slice();r[0]=o;const i=ee(t,F(r)),a=n.length,c=a===0?0:a/e[0];return km(n,e,s,c,i,r),[i,r]}function Fm(n,e,t,s,o,r,i,a){if(n.length===0)throw new Error("paramsNestedSplits must be non empty");if(e[0].length===0)throw new Error("Split tensors must not be scalars");const c=e[0][0]-1;if(Rm(r,i,c),s.length===0)throw new Error("params.rank must be nonzero");const l=s[0],{outSplits:u,valueSlices:d,numValues:h}=Em(r,i,n,l),f=Nm(u),p=Am(t,s,o,d,h);return[f,p[0],p[1]]}const Vo=2147483647;function Dm(n,e,t,s,o,r,i){if(e.length>1)throw new Error("starts must be a scalar or vector");if(o.length>1)throw new Error("limits must be a scalar or vector");if(i.length>1)throw new Error("deltas must be a scalar or vector");const a=e.length===0,c=o.length===0,l=i.length===0,u=[];a||u.push(e[0]),c||u.push(o[0]),l||u.push(i[0]);for(let g=1;g<u.length;++g)if(u[g]!==u[g-1])throw new Error("starts, limits, and deltas must have the same shape");const d=u.length===0?1:u[0],h=ee("int32",d+1);h[0]=0;for(let g=0;g<d;++g){const m=a?n[0]:n[g],C=c?s[0]:s[g],w=l?r[0]:r[g];if(w===0)throw new Error("Requires delta != 0");let y;if(w>0&&C<m||w<0&&C>m)y=0;else if(y=Math.ceil(Math.abs((C-m)/w)),y>Vo)throw new Error(`Requires ((limit - start) / delta) <= ${Vo}`);h[g+1]=h[g]+y}const f=h[d],p=ee(t,f);let x=0;for(let g=0;g<d;++g){const m=h[g+1]-h[g];let C=a?n[0]:n[g];const w=l?r[0]:r[g];for(let y=0;y<m;++y)p[x++]=C,C+=w}return[h,p]}var $e=Ae;class Ln{constructor(e,t,s,o,r,i,a,c,l,u){this.shape=e,this.shapeShape=t,this.values=s,this.valuesShape=o,this.valuesDType=r,this.defaultValue=i,this.defaultValueShape=a,this.rowPartitionValues=c,this.rowPartitionValuesShapes=l,this.rowPartitionTypes=di(u),this.raggedRank=hi(this.rowPartitionTypes)}getRowPartitionTypeByDimension(e){return this.rowPartitionTypes[0]===$e.FIRST_DIM_SIZE?this.rowPartitionTypes[e+1]:this.rowPartitionTypes[e]}getRowPartitionTensor(e){return this.rowPartitionTypes[0]===$e.FIRST_DIM_SIZE?this.rowPartitionValues[e+1]:this.rowPartitionValues[e]}getMaxWidth(e){const t=this.getRowPartitionTensor(e-1);switch(this.getRowPartitionTypeByDimension(e-1)){case $e.VALUE_ROWIDS:return Ln.getMaxWidthValueRowID(t);case $e.ROW_SPLITS:return Ln.getMaxWidthRowSplit(t);default:throw new Error(`Cannot handle partition type ${$e[this.getRowPartitionTypeByDimension(e-1)]}`)}}static getMaxWidthRowSplit(e){const t=e.length;if(t===0||t===1)return 0;let s=0;for(let o=0;o<t-1;++o){const r=e[o+1]-e[o];r>s&&(s=r)}return s}static getMaxWidthValueRowID(e){const t=e.length;if(t===0)return 0;let s=0,o=e[0],r=0;for(let i=1;i<t;++i){const a=e[i];a!==o&&(o=a,r=Math.max(i-s,r),s=i)}return Math.max(t-s,r)}tensorShapeFromTensor(e,t,s=!0){if(t.length===0){if(e[0]===-1)return[];throw new Error("The only valid scalar shape tensor is the fully unknown shape specified as -1.")}return Wo(e,s)}calculateOutputSize(e){const t=this.valuesShape,s=this.defaultValueShape;fi(s,t);const o=this.tensorShapeFromTensor(this.shape,this.shapeShape),i=ui(this.raggedRank,o,t);i[0]<0&&(i[0]=e);for(let a=1;a<=this.raggedRank;++a)i[a]<0&&(i[a]=this.getMaxWidth(a));return i}calculateFirstParentOutputIndex(e,t,s){const o=Math.min(e,s),r=[];let i=0;for(let a=0;a<o;++a,i+=t)r.push(i);for(let a=o;a<e;++a)r.push(-1);return D(r.length===e,()=>"Final length of result must be equal to firstDimension."),r}calculateOutputIndexRowSplit(e,t,s,o){const r=e.length,i=[];for(let a=0;a<r-1;++a){const c=e[a+1]-e[a];let l=Math.min(o,c),u=t[a];u===-1&&(l=0);for(let d=0;d<l;++d)i.push(u),u+=s;for(let d=0;d<c-l;++d)i.push(-1)}if(r>0&&i.length!==e[r-1])throw new Error("Invalid row split size.");return i}calculateOutputIndexValueRowID(e,t,s,o){const r=e.length,i=[];if(r===0)return[];let a=0,c=e[0];if(c>=t.length)throw new Error(`Got currentValueRowId=${c}, which is not less than ${t.length}`);let l=t[c];i.push(l);for(let u=1;u<r;++u){const d=e[u];if(d===c)l>=0&&(++a,a<o?l+=s:l=-1);else{if(a=0,c=d,d>=t.length)throw new Error(`Got nextValueRowId=${d} which is not less than ${t.length}`);l=t[d]}i.push(l)}if(i.length!==e.length)throw new Error("Invalid row ids.");return i}calculateOutputIndex(e,t,s,o){const r=this.getRowPartitionTensor(e),i=this.getRowPartitionTypeByDimension(e);switch(i){case $e.VALUE_ROWIDS:return this.calculateOutputIndexValueRowID(r,t,s,o);case $e.ROW_SPLITS:if(r.length-1>t.length)throw new Error(`Row partition size is greater than output size: ${r.length-1} > ${t.length}`);return this.calculateOutputIndexRowSplit(r,t,s,o);default:throw new Error(`Unsupported partition type: ${$e[i]}`)}}getFirstDimensionSize(){const e=this.rowPartitionValues[0];if(this.rowPartitionTypes.length===0)throw new Error("No row_partition_types given.");const t=this.rowPartitionTypes[0];switch(t){case $e.FIRST_DIM_SIZE:return e[0];case $e.VALUE_ROWIDS:throw new Error("Cannot handle VALUE_ROWIDS in first dimension.");case $e.ROW_SPLITS:return this.rowPartitionValuesShapes[0][0]-1;default:throw new Error(`Cannot handle type ${$e[t]}`)}}compute(){if(this.rowPartitionValues[0].length<=0)throw new Error("Invalid first partition input. Tensor requires at least one element.");const t=this.getFirstDimensionSize(),s=this.calculateOutputSize(t),o=new Array(this.raggedRank+1);o[o.length-1]=1;for(let c=o.length-2;c>=0;--c)o[c]=o[c+1]*s[c+1];const r=Wo(s,!1),i=ee(this.valuesDType,F(r));if(o[0]*s[0]>0){let c=this.calculateFirstParentOutputIndex(t,o[0],s[0]);for(let l=1;l<=this.raggedRank;++l)c=this.calculateOutputIndex(l-1,c,o[l],s[l]);this.setOutput(this.raggedRank,c,i,r)}return[r,i]}setOutput(e,t,s,o){if(s.length===0)return;const r=this.values,i=s;let a=o.slice();a=a.slice(e+1);const c=F(a),l=t.length;let u=this.defaultValue;if(u.length!==c&&u.length!==1){const p=this.defaultValueShape;Q(()=>{const x=ni(u,p);u=Vh(x,a).dataSync()})}let d=0,h=0,f=0;for(let p=0;p<=l;++p){let x=p<l?t[p]:-1;if(x===f){++f;continue}if(h<f){const g=r.subarray(d*c),m=i.subarray(h*c),C=(f-h)*c;Uo(m,g,C)}if(p>=l){const g=s.length;x=Math.floor(g/c)}if(x>f)if(this.defaultValue.length===1)i.subarray(f*c,x*c).fill(this.defaultValue[0]),f=x;else for(;x>f;){const g=i.slice(f*c);Uo(g,u,c),++f}x<0?(d=p+1,h=f):(d=p,h=f,f=h+1)}}}function Uo(n,e,t){for(let s=0;s<t;s++)n[s]=e[s]}function Wo(n,e){const t=[];for(let s of n){if(s<0){if(!e)throw new Error(`Dimension ${s} must be >= 0`);if(s<-1)throw new Error(`Dimension ${s} must be >= -1`);s=-1}t.push(s)}return t}function Om(n,e,t,s,o,r,i,a,c,l){return new Ln(n,e,t,s,o,r,i,a,c,l).compute()}function Pm(n,e,t,s){const o=n===e,r=n<e&&t<0,i=e<n&&t>1;if(o||r||i)return Qe(0,s);const a=Math.abs(Math.ceil((e-n)/t)),c=Qe(a,s);e<n&&t===1&&(t=-1),c[0]=n;for(let l=1;l<c.length;l++)c[l]=c[l-1]+t;return c}const _m=He(n=>1/Math.sqrt(n));function Lm(n,e,t,s,o,r,i,a,c,l){const u=[s/o,o],d=n.values,h=e.values;if(s===0)return re(t,e.dtype);const f=c instanceof Dn?c:re(u,e.dtype);typeof c=="string"||typeof c=="number"?f.values.fill(c):typeof c=="boolean"&&f.values.fill(+c);for(let p=0;p<r;p++){const x=[];let g=0;for(let m=0;m<i;m++){const C=d[p*i+m];x.push(C),g+=C*a[m]}if(g<0||g>=s/o)throw new Error(`Invalid indices: ${x} does not index into ${t}`);for(let m=0;m<o;m++)f.values[g*o+m]=e.rank===0?h[0]:h[p*o+m]}return f}const Bm=He(n=>1/(1+Math.exp(-n)));function Mm(n,e,t,s,o){const r=ai(s,e,t),i=F(t),a=se(s);if(r){const d=ci(e,a);return o==="string"?n.slice(d,d+i):n.subarray(d,d+i)}const c=o==="string"?Pt(n):n,l=re(s,o,c),u=re(t,o);for(let d=0;d<u.size;++d){const h=u.indexToLoc(d),f=h.map((p,x)=>p+e[x]);u.set(l.get(...f),...h)}return o==="string"?Wi(u.values):u.values}function Vm(n,e,t,s,o,r,i){const a=e[0],c=r[0],l=new Array(c),u=new Array(a),d=e[1];if(c===0){if(a!==0)throw new Error(Ai(a));const g=ee(t,0),m=ee(o,0);return[g,[0,d],m,l,u]}let h=!0,f=0;const p=new Array(c).fill(0);for(let g=0;g<a;++g){const m=n[g*d];if(m<0)throw new Error(Fi(g,m));if(m>=c)throw new Error(Di(g,m,c));++p[m],h=h&&m>=f,f=m}let x=!0;for(let g=0;g<c;++g){const m=p[g]===0;l[g]=m,x=x&&!m,p[g]=Math.max(p[g],1),g>0&&(p[g]+=p[g-1])}if(x&&h){const g=n,m=s;for(let C=0;C<a;++C)u[C]=C;return[g,[a,d],m,l,u]}else{const g=p[c-1],m=ee(t,g*d),C=ee(o,g),w=new Array(c).fill(0);for(let y=0;y<a;++y){const I=n[y*d],N=w[I],E=(I===0?0:p[I-1])+N;w[I]++;for(let R=0;R<d;++R)m[E*d+R]=n[y*d+R];C[E]=s[y],u[y]=E}for(let y=0;y<c;++y)if(w[y]===0){const N=y===0?0:p[y-1];m[N*d+0]=y;for(let E=1;E<d;++E)m[N*d+E]=0;C[N]=i}return[m,[g,d],C,l,u]}}function Um(n,e,t,s,o){const r=F(s),i=e[0],a=o.length,c=[];let l=1,u=-1;for(let g=0;g<a;++g){const m=o[g];if(m===-1){if(u!==-1)throw new Error(Oi(u,g));u=g,c.push(1)}else{if(m<0)throw new Error(Pi(g,m));l*=m,c.push(m)}}if(u!==-1){if(l<=0)throw new Error(_i());const g=Math.trunc(r/l);if(l*g!==r)throw new Error(Li(s,c));c[u]=g}if(F(c)!==r)throw new Error(Bi(s,c));const h=s.length,f=[];if(h>0){f[h-1]=1;for(let g=h-2;g>=0;--g)f[g]=f[g+1]*s[g+1]}const p=[];if(a>0){p[a-1]=1;for(let g=a-2;g>=0;--g)p[g]=p[g+1]*c[g+1]}const x=ee(t,i*a);for(let g=0;g<i;++g){let m=0;for(let C=0;C<h;++C)m+=n[g*h+C]*f[C];for(let C=0;C<a;++C)x[g*a+C]=Math.trunc(m/p[C]),m%=p[C]}return[x,[i,a],c]}function Wm(n,e,t,s,o,r=!1,i=0){const a=s.length,c=[e[0],n.length/e[0]],l=c[1],d=a>0?o[a-1]+1:0;if(d<0)throw new Error(Is());const h=e.slice();h[0]=d;const f=h.reduce((w,y)=>w*y,1),p=ee(t,f);if(a===0)return d>0&&p.fill(i),[p,h];if(d<=0)throw new Error(Is());let x=0,g=1,m=0,C=o[x];for(;;){let w=0;if(g<a){if(w=o[g],C===w){++g;continue}if(C>=w)throw new Error(Mi())}if(C<0||C>=d)throw new Error(Vi(C,d));C>m&&p.fill(i,m*l,C*l);for(let y=x;y<g;++y){const I=s[y];if(I<0||I>=c[0])throw new Error(Ui(y,s[y],c[0]));for(let N=0;N<l;N++)p[C*l+N]+=n[I*l+N]}if(r)for(let y=0;y<l;y++)p[C*l+y]/=g-x;if(x=g,++g,m=C+1,C=w,g>a)break}return m<d&&p.fill(i,m*l,d*l),[p,h]}const Gm=He(n=>Math.sqrt(n));const zm=He((n,e)=>{const{pattern:t,replaceGlobal:s,rewrite:o}=e;return n.replace(new RegExp(t,s?"g":""),o)});function Hm(n,e,t,s){const o=re(n,e.dtype);for(let r=0;r<o.size;r++){const i=o.indexToLoc(r),a=new Array(i.length);for(let c=0;c<a.length;c++)a[c]=i[c]*t[c]+s[c];o.set(e.get(...a),...i)}return o}class Xm{constructor(e,t,s,o,r,i){this.separator=it(e),this.nGramWidths=t,this.leftPad=it(s),this.rightPad=it(o),this.padWidth=r,this.preserveShort=i}getPadWidth(e){return Math.min(this.padWidth<0?e-1:this.padWidth,e-1)}getNumNGrams(e,t){const s=this.getPadWidth(t);return Math.max(0,e+2*s-t+1)}createNGrams(e,t,s,o,r,i){for(let a=0;a<r;++a){const c=this.getPadWidth(i),l=Math.max(0,c-a),u=Math.max(0,c-(r-(a+1))),d=i-(l+u),h=t+(l>0?0:a-c);let f=0;f+=l*this.leftPad.length;for(let C=0;C<d;++C)f+=e[h+C].length;f+=u*this.rightPad.length;const p=l+u+d-1;f+=p*this.separator.length,s[o+a]=new Uint8Array(f);const x=s[o+a];let g=0;const m=C=>C.forEach(w=>x[g++]=w);for(let C=0;C<l;++C)m(this.leftPad),m(this.separator);for(let C=0;C<d-1;++C)m(e[h+C]),m(this.separator);if(d>0){m(e[h+d-1]);for(let C=0;C<u;++C)m(this.separator),m(this.rightPad)}else{for(let C=0;C<u-1;++C)m(this.rightPad),m(this.separator);m(this.rightPad)}}}compute(e,t){const s=e.length,o=t.length;if(o>0){let c=t[0];if(c!==0)throw new Error(`First split value must be 0, got ${c}`);for(let l=1;l<o;++l){let u=t[l]>=c;if(u=u&&t[l]<=s,!u)throw new Error(`Invalid split value ${t[l]}, must be in [${c}, ${s}]`);c=t[l]}if(c!==s)throw new Error(`Last split value must be data size. Expected ${s}, got ${c}`)}const r=o-1,i=ee("int32",o);if(s===0||o===0){const c=new Array(s);for(let l=0;l<=r;++l)i[l]=0;return[c,i]}i[0]=0;for(let c=1;c<=r;++c){const l=t[c]-t[c-1];let u=0;this.nGramWidths.forEach(d=>{u+=this.getNumNGrams(l,d)}),this.preserveShort&&l>0&&u===0&&(u=1),i[c]=i[c-1]+u}const a=new Array(i[r]);for(let c=0;c<r;++c){const l=t[c];let u=i[c];if(this.nGramWidths.forEach(d=>{const h=t[c+1]-t[c],f=this.getNumNGrams(h,d);this.createNGrams(e,l,a,u,f,d),u+=f}),this.preserveShort&&u===i[c]){const d=t[c+1]-t[c];if(d===0)continue;const h=d+2*this.padWidth;this.createNGrams(e,l,a,u,1,h)}}return[a,i]}}function jm(n,e,t,s,o,r,i,a){return new Xm(t,s,o,r,i,a).compute(n,e)}function qm(n,e,t,s){if(!n.length)return;if(e.length===0){for(let r=0;r<n.length;++r)s.push(n.subarray(r,r+1));return}if(e.length===1){const r=e[0];let i=n.indexOf(r);for(;i!==-1;){const a=n.subarray(0,i);(!t||a.length!==0)&&s.push(a),n=n.subarray(i+1),i=n.indexOf(r)}(!t||n.length!==0)&&s.push(n);return}let o=0;for(let r=0;r<n.length+1;r++)if(r===n.length||e.indexOf(n[r])!==-1){const i=n.subarray(o,r);(!t||i.length!==0)&&s.push(i),o=r+1}}function Km(n,e,t){const s=n.length,o=[];let r=0,i=0;const a=new Array(s);for(let h=0;h<s;++h){const f=o.length;qm(n[h],e,t,o);const p=o.length-f;a[h]=p,r+=p,i=Math.max(i,p)}const c=ee("int32",r*2),l=new Array(r),u=[s,i];let d=0;for(let h=0;h<s;++h)for(let f=0;f<a[h];++f)c[d*2]=h,c[d*2+1]=f,l[d]=o[d],++d;return[c,l,u]}function Ym(n,e){const t=ee("int32",n.length);for(let s=0;s<n.length;++s)t[s]=Pd(n[s]).modulo(e).getLowBitsUnsigned();return t}const Qm=ve(((n,e)=>n-e));function Zm(n,e){const t=new Array(n.rank);for(let o=0;o<t.length;o++)t[o]=n.shape[o]*e[o];const s=re(t,n.dtype);for(let o=0;o<s.values.length;++o){const r=s.indexToLoc(o),i=new Array(n.rank);for(let c=0;c<i.length;c++)i[c]=r[c]%n.shape[c];const a=n.locToIndex(i);s.values[o]=n.values[a]}return s}const nn=(n,e)=>{const t=e.value-n.value;return t===0?n.index-e.index:t};function Pa(n,e,t=0,s=n.length-1){for(;s>t;){if(s-t>600){const a=s-t+1,c=e-t+1,l=Math.log(a),u=.5*Math.exp(2*l/3),d=.5*Math.sqrt(l*u*(a-u)/a)*Math.sign(c-a/2),h=Math.max(t,Math.floor(e-c*u/a+d)),f=Math.min(s,Math.floor(e+(a-c)*u/a+d));Pa(n,e,h,f)}const o=n[e];let r=t,i=s;for(Kt(n,t,e),nn(n[s],o)>0&&Kt(n,t,s);r<i;){for(Kt(n,r,i),r++,i--;nn(n[r],o)<0;)r=r+1;for(;nn(n[i],o)>0;)i=i-1}nn(n[t],o)===0?Kt(n,t,i):(i=i+1,Kt(n,i,s)),i<=e&&(t=i+1),e<=i&&(s=i-1)}}function Jm(n,e,t,s,o){const r=e[e.length-1],[i,a]=[n.length/r,r],c=ct(t,i*s),l=ct("int32",i*s);for(let d=0;d<i;d++){const h=d*a,f=n.subarray(h,h+a);let p=new Array(f.length);f.forEach((C,w)=>p[w]={value:C,index:w}),s<p.length&&(Pa(p,s),p=p.slice(0,s)),o&&p.sort(nn);const x=d*s,g=c.subarray(x,x+s),m=l.subarray(x,x+s);for(let C=0;C<s;C++)g[C]=p[C].value,m[C]=p[C].index}const u=e.slice();return u[u.length-1]=s,[re(u,t,c),re(u,"int32",l)]}function eg(n,e,t,s){const o=ge(e,t)[0],r=[1,t[0],1];for(let p=0;p<o;p++)r[0]*=t[p];r[1]=t[o];for(let p=o+1;p<t.length;p++)r[2]*=t[p];const i=new Map,a=new Int32Array(t[o]),c=new Dn(r,s,n),l=[],u=r[0]===1&&r[2]===1;for(let p=0;p<t[o];p++){let x;if(u)x=n[p].toString();else{const m=[];for(let C=0;C<r[0];C++)for(let w=0;w<r[2];w++)m.push(c.get(C,p,w));x=m.join(",")}const g=i.get(x);if(g!=null)a[p]=g;else{const m=i.size;i.set(x,m),a[p]=m,l.push(p)}}const d=r.slice();d[1]=i.size;const h=new Dn(d,s);l.forEach((p,x)=>{for(let g=0;g<r[0];g++)for(let m=0;m<r[2];m++)h.set(c.get(g,p,m),g,x,m)});const f=t.slice();return f[o]=d[1],{outputValues:h.values,outputShape:f,indices:a}}const tg=Object.freeze(Object.defineProperty({__proto__:null,addImpl:tm,bincountImpl:nm,bincountReduceImpl:sm,bitwiseAndImpl:om,castImpl:em,ceilImpl:rm,concatImpl:im,equalImpl:am,expImpl:cm,expm1Impl:lm,floorImpl:um,gatherNdImpl:dm,gatherV2Impl:hm,greaterEqualImpl:pm,greaterImpl:fm,lessEqualImpl:gm,lessImpl:mm,linSpaceImpl:xm,logImpl:Cm,maxImpl:bm,maximumImpl:wm,minimumImpl:ym,multiplyImpl:Oa,negImpl:vm,notEqualImpl:$m,prodImpl:Im,raggedGatherImpl:Fm,raggedRangeImpl:Dm,raggedTensorToTensorImpl:Om,rangeImpl:Pm,rsqrtImpl:_m,scatterImpl:Lm,sigmoidImpl:Bm,simpleAbsImpl:Jp,sliceImpl:Mm,sparseFillEmptyRowsImpl:Vm,sparseReshapeImpl:Um,sparseSegmentReductionImpl:Wm,sqrtImpl:Gm,staticRegexReplaceImpl:zm,stridedSliceImpl:Hm,stringNGramsImpl:jm,stringSplitImpl:Km,stringToHashBucketFastImpl:Ym,subImpl:Qm,tileImpl:Zm,topKImpl:Jm,transposeImpl:Sm,uniqueImpl:eg},Symbol.toStringTag,{value:"Module"}));const{addImpl:ng,bincountImpl:_a,bincountReduceImpl:sg,bitwiseAndImpl:og,castImpl:rg,ceilImpl:ig,concatImpl:ag,equalImpl:cg,expImpl:lg,expm1Impl:ug,floorImpl:dg,gatherNdImpl:hg,gatherV2Impl:fg,greaterImpl:pg,greaterEqualImpl:mg,lessImpl:gg,lessEqualImpl:xg,linSpaceImpl:Cg,logImpl:bg,maxImpl:wg,maximumImpl:yg,minimumImpl:vg,multiplyImpl:$g,negImpl:Sg,notEqualImpl:Ig,prodImpl:Rg,raggedGatherImpl:Tg,raggedRangeImpl:Eg,raggedTensorToTensorImpl:Ng,rangeImpl:kg,rsqrtImpl:Ag,scatterImpl:Fg,sigmoidImpl:Dg,simpleAbsImpl:La,sliceImpl:Og,sparseFillEmptyRowsImpl:Pg,sparseReshapeImpl:_g,sparseSegmentReductionImpl:Ba,sqrtImpl:Lg,staticRegexReplaceImpl:Bg,stridedSliceImpl:Mg,stringNGramsImpl:Vg,stringSplitImpl:Ug,stringToHashBucketFastImpl:Wg,subImpl:Gg,tileImpl:zg,topKImpl:Hg,transposeImpl:ao,uniqueImpl:Xg}=tg;function Ma(n,e){return["x","y","z","w","u","v"].slice(0,e).map(t=>`${n}.${t}`)}function ue(n,e){return e===1?[n]:Ma(n,e)}function jg(n,e){if(n===1)return"rc";let t="";for(let s=0;s<n;s++)t+=e[s],s<n-1&&(t+=",");return t}class qg{constructor(e){if(this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outputShape=e,this.rank=e.length,this.enableShapeUniforms=ce(this.outputShape.length),this.rank===0)this.userCode=`
        void main() {
          setOutput(vec4(getA(), 0., 0., 0.));
        }
      `;else{const t=ue("rc",this.rank),s=z(this.rank),o=this.getOutOfBoundsCondition(t),r=this.getSetup(t),i=this.getOutput(t);this.userCode=`
        void main() {
          ${s} rc = getOutputCoords();

          if(${o}) {
            setOutput(vec4(0));
          } else {
            ${r}

            setOutput(vec4(${i}));
          }
        }
      `}}getSourceCoordsArr(e){const t=[];for(let s=0;s<=1;s++)for(let o=0;o<=1;o++){let r=`${s===0?"r":"rp1"}, ${o===0?"c":"cp1"}`;for(let i=2;i<this.rank;i++)r=`${e[e.length-1-i]},`+r;t.push(r)}return t}getOutOfBoundsCondition(e){if(this.rank===1)return`rc > ${this.enableShapeUniforms?"outShape":this.outputShape[0]}`;let t="";for(let s=this.rank-2;s<this.rank;s++)t+=`${e[s]} >= ${this.enableShapeUniforms?`outShape[${s}]`:this.outputShape[s]}`,s<this.rank-1&&(t+="||");return t}getSetup(e){if(this.rank===1)return"";const t=e.slice(-2),s=this.enableShapeUniforms?`outShape[${this.rank} - 1]`:this.outputShape[this.rank-1],o=this.enableShapeUniforms?`outShape[${this.rank} - 2]`:this.outputShape[this.rank-2];return`
      int r = ${t[0]};
      int c = ${t[1]};
      int rp1 = r + 1;
      int cp1 = c + 1;

      bool cEdge = cp1 >= ${s};
      bool rEdge = rp1 >= ${o};
    `}getOutput(e){const t=this.getSourceCoordsArr(e);return this.rank===1?`getA(rc), (rc + 1 >= ${this.enableShapeUniforms?"outShape":this.outputShape[0]} ? 0. : getA(rc + 1)), 0, 0`:`getA(${t[0]}),
            cEdge ? 0. : getA(${t[1]}),
            rEdge ? 0. : getA(${t[2]}),
            rEdge || cEdge ? 0. : getA(${t[3]})`}}class Va{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"inputShape",type:"ivec3"}],this.outputShape=e,this.enableShapeUniforms=ce(this.outputShape.length);let s="";for(let o=0;o<4;o++){let r="thisRC = rc;";o%2===1&&(r+="thisRC.z += 1;"),o>1&&(r+="thisRC.y += 1;"),s+=`
        ${r}
        ${o>0?"if(thisRC.y < rows && thisRC.z < cols){":""}
          int flatIndex = getFlatIndex(thisRC);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flatIndex);
          vec2 inputRCInnerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[${o}] =
            getChannel(getA(inputRC.x, inputRC.y, inputRC.z), inputRCInnerDims);
        ${o>0?"}":""}
      `}this.userCode=`
      ${Kg(t,this.enableShapeUniforms)}
      ${this.enableShapeUniforms?eo():Js(e)}

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.);

        ivec3 thisRC;
        int rows = ${this.enableShapeUniforms?"outShape[1]":e[1]};
        int cols = ${this.enableShapeUniforms?"outShape[2]":e[2]};

        ${s}

        setOutput(result);
      }
    `}}function Kg(n,e){return`
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      ${e?ip(["r","c","d"],"inputShape"):yt(["r","c","d"],n)}
      return ivec3(r, c, d);
    }
  `}class Yg{constructor(e){this.gpgpu=e,this.numUsedTextures=0,this.numFreeTextures=0,this._numBytesAllocated=0,this._numBytesFree=0,this.freeTextures={},this.usedTextures={},this.logEnabled=!1}acquireTexture(e,t,s){const o=zo(t,s),r=Ho(e,o,s);r in this.freeTextures||(this.freeTextures[r]=[]),r in this.usedTextures||(this.usedTextures[r]=[]);const i=Go(e,o,this.gpgpu.gl,this.gpgpu.textureConfig,s);if(this.freeTextures[r].length>0){this.numFreeTextures--,this.numUsedTextures++,this._numBytesFree-=i,this.log();const c=this.freeTextures[r].pop();return this.usedTextures[r].push(c),c}let a;return o===ne.PACKED_2X2_FLOAT32?a=this.gpgpu.createPackedMatrixTexture(e[0],e[1]):o===ne.PACKED_2X2_FLOAT16?a=this.gpgpu.createFloat16PackedMatrixTexture(e[0],e[1]):o===ne.UNPACKED_FLOAT32?a=this.gpgpu.createFloat32MatrixTexture(e[0],e[1]):o===ne.UNPACKED_FLOAT16?a=this.gpgpu.createFloat16MatrixTexture(e[0],e[1]):o===ne.PACKED_4X1_UNSIGNED_BYTE&&(a=this.gpgpu.createUnsignedBytesMatrixTexture(e[0],e[1])),this.usedTextures[r].push(a),this.numUsedTextures++,this._numBytesAllocated+=i,this.log(),a}releaseTexture(e,t,s,o){if(this.freeTextures==null)return;const r=zo(s,o),i=Ho(t,r,o);i in this.freeTextures||(this.freeTextures[i]=[]);const a=Go(t,r,this.gpgpu.gl,this.gpgpu.textureConfig,o),c=v().getNumber("WEBGL_DELETE_TEXTURE_THRESHOLD");c!==-1&&this._numBytesAllocated>c?(this.gpgpu.deleteMatrixTexture(e.texture),this._numBytesAllocated-=a):(this.freeTextures[i].push(e),this.numFreeTextures++,this._numBytesFree+=a),this.numUsedTextures--;const l=this.usedTextures[i],u=l&&l.indexOf(e);if(u==null||u<0)throw new Error("Cannot release a texture that was never provided by this texture manager");l[u]=l[l.length-1],l.pop(),this.log()}log(){if(!this.logEnabled)return;const e=this.numFreeTextures+this.numUsedTextures;console.log("Free/Used",`${this.numFreeTextures} / ${this.numUsedTextures}`,`(${e})`);const t=this._numBytesFree/this._numBytesAllocated;console.log(`Bytes allocated: ${this._numBytesAllocated}`),console.log(`Bytes unused: ${this._numBytesFree} (${Math.round(100*t)}%)`)}get numBytesAllocated(){return this._numBytesAllocated}get numBytesFree(){return this._numBytesFree}getNumUsedTextures(){return this.numUsedTextures}getNumFreeTextures(){return this.numFreeTextures}dispose(){if(this.freeTextures!=null){for(const e in this.freeTextures)this.freeTextures[e].forEach(t=>{this.gpgpu.deleteMatrixTexture(t.texture)});for(const e in this.usedTextures)this.usedTextures[e].forEach(t=>{this.gpgpu.deleteMatrixTexture(t.texture)});this.freeTextures=null,this.usedTextures=null,this.numUsedTextures=0,this.numFreeTextures=0,this._numBytesAllocated=0,this._numBytesFree=0}}}function Qg(n,e){const t=n;if(e===t.R32F)return 4;if(e===t.R16F)return 2;if(e===t.RGBA32F)return 16;if(e===n.RGBA)return 16;if(e===t.RGBA16F)return 8;if(e===t.RGBA8)return 4;throw new Error(`Unknown internal format ${e}`)}function Go(n,e,t,s,o){const r=Zg(e,s);let i;if(o){const[c,l]=Vt(n[0],n[1]);i=c*l}else{const[c,l]=mn(n[0],n[1]);i=c*l}const a=Qg(t,r);return i*a}function Zg(n,e){switch(n){case ne.PACKED_2X2_FLOAT32:return ro(e);case ne.PACKED_2X2_FLOAT16:return io(e);case ne.UNPACKED_FLOAT32:return no(e);case ne.UNPACKED_FLOAT16:return so(e);case ne.PACKED_4X1_UNSIGNED_BYTE:return oo(e);default:throw new Error(`Unknown physical texture type ${n}`)}}function Jg(n){return v().getBool("WEBGL_RENDER_FLOAT32_ENABLED")?n?ne.PACKED_2X2_FLOAT32:ne.UNPACKED_FLOAT32:n?ne.PACKED_2X2_FLOAT16:ne.UNPACKED_FLOAT16}function zo(n,e){if(n===be.UPLOAD)return ne.PACKED_2X2_FLOAT32;if(n===be.RENDER||n==null)return Jg(e);if(n===be.DOWNLOAD||n===be.PIXELS)return ne.PACKED_4X1_UNSIGNED_BYTE;throw new Error(`Unknown logical texture type ${n}`)}function Ho(n,e,t){return`${n[0]}_${n[1]}_${e}_${t}`}class Le{constructor(e,t){this.variableNames=["A"],this.outputShape=e,this.enableShapeUniforms=ce(this.outputShape.length),this.userCode=`
      float unaryOperation(float x) {
        ${t}
      }

      void main() {
        float x = getAAtOutCoords();
        float y = unaryOperation(x);

        setOutput(y);
      }
    `}}const Te="if (isnan(x)) return x;",ex="return x;",Xo="return abs(x);",tx="return (x >= 0.0) ? x : (exp(x) - 1.0);",nx=Te+`
  return (x < 0.0) ? 0.0 : x;
`,sx=Te+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,je="return x;",ox="return 1.0 / (1.0 + exp(-1.0 * x));";const rx="return x;",ix=`
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`,ax=`
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,cx=`
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,lx="return 1.0 / (1.0 + exp(-1.0 * x));";class Ke{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=e,this.enableShapeUniforms=ce(this.outputShape.length),this.userCode=`
      vec4 unaryOperation(vec4 x) {
        ${t}
      }

      void main() {
        vec4 x = getAAtOutCoords();
        vec4 y = unaryOperation(x);

        setOutput(y);
      }
    `}}class ux{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!1,this.outputShape=e,this.enableShapeUniforms=ce(this.outputShape.length);const t=e.length,s=ue("rc",t),o=z(t),r=jg(t,s),i=s.slice(-2),a=t<=1?"rc":`vec2(${i.join(",")})`;this.userCode=`
      void main() {
        ${o} rc = getOutputCoords();
        vec4 packedInput = getA(${r});

        setOutput(getChannel(packedInput, ${a}));
      }
    `}}const dx=Yh,hx=1e-7,fx=1e-4,$n={};function px(n){return n in $n||($n[n]={}),$n[n]}const mx=v().getNumber("CPU_HANDOFF_SIZE_THRESHOLD"),gx=600;function xx(){return v().global.screen==null?1024:v().global.screen.height*v().global.screen.width*window.devicePixelRatio*gx/1024/1024}class qn extends dr{nextDataId(){return qn.nextDataId++}constructor(e){if(super(),this.pendingRead=new WeakMap,this.pendingDisposal=new WeakSet,this.dataRefCount=new WeakMap,this.numBytesInGPU=0,this.uploadWaitMs=0,this.downloadWaitMs=0,this.lastGlFlushTime=0,this.warnedAboutMemory=!1,this.pendingDeletes=0,this.disposed=!1,!v().getBool("HAS_WEBGL"))throw new Error("WebGL is not supported on this device");let t;if(e!=null){if(e instanceof rs)t=e;else{const s=De(v().getNumber("WEBGL_VERSION"),e);t=new rs(s)}this.binaryCache={},this.gpgpuCreatedLocally=!1}else{const s=De(v().getNumber("WEBGL_VERSION"));t=new rs(s),this.binaryCache=px(v().getNumber("WEBGL_VERSION")),this.gpgpuCreatedLocally=!0}this.gpgpu=t,this.canvas=this.gpgpu.gl.canvas,this.textureManager=new Yg(this.gpgpu),this.numMBBeforeWarning=xx(),this.texData=new wc(this,Xe())}numDataIds(){return this.texData.numDataIds()-this.pendingDeletes}writeTexture(e,t,s,o,r,i){const a=this.makeTensorInfo(t,s),c=this.texData.get(a.dataId);c.isPacked=!1,c.texture={texture:e,texShape:[o,r]},c.texShape=[o,r];const l=tn(t),u=new Bo(l,!1,i),d=this.runWebGLProgram(u,[a],s,[[o,r]]);return d.shape=t,c.texture=null,this.disposeIntermediateTensorInfo(a),d.dataId}write(e,t,s){if((v().getBool("WEBGL_CHECK_NUMERICAL_PROBLEMS")||v().getBool("DEBUG"))&&this.checkNumericalProblems(e),s==="complex64"&&e!=null)throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");const o={id:this.nextDataId()};return this.texData.set(o,{shape:t,dtype:s,values:e,usage:be.UPLOAD,refCount:1}),o}refCount(e){return this.texData.has(e)?this.texData.get(e).refCount:0}incRef(e){const t=this.texData.get(e);t.refCount++}decRef(e){if(this.texData.has(e)){const t=this.texData.get(e);t.refCount--}}move(e,t,s,o,r){if(v().getBool("DEBUG")&&this.checkNumericalProblems(t),o==="complex64")throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");this.texData.set(e,{shape:s,dtype:o,values:t,usage:be.UPLOAD,refCount:r})}disposeIntermediateTensorInfo(e){this.disposeData(e.dataId)}readSync(e){const t=this.texData.get(e),{values:s,dtype:o,complexTensorInfos:r,slice:i,shape:a,isPacked:c}=t;if(i!=null){let h;c?h=new Ke(a,je):h=new Le(a,je);const f=this.runWebGLProgram(h,[{dataId:e,shape:a,dtype:o}],o),p=this.readSync(f.dataId);return this.disposeIntermediateTensorInfo(f),p}if(s!=null)return this.convertAndCacheOnCPU(e);if(o==="string")return s;const l=this.activeTimers!=null;let u;l&&(u=Ee());let d;if(o==="complex64"){const h=this.readSync(r.real.dataId),f=this.readSync(r.imag.dataId);d=Ss(h,f)}else d=this.getValuesFromTexture(e);return l&&(this.downloadWaitMs+=Ee()-u),this.convertAndCacheOnCPU(e,d)}async read(e){if(this.pendingRead.has(e)){const p=this.pendingRead.get(e);return new Promise(x=>p.push(x))}const t=this.texData.get(e),{values:s,shape:o,slice:r,dtype:i,complexTensorInfos:a,isPacked:c}=t;if(r!=null){let p;c?p=new Ke(o,je):p=new Le(o,je);const x=this.runWebGLProgram(p,[{dataId:e,shape:o,dtype:i}],i),g=this.read(x.dataId);return this.disposeIntermediateTensorInfo(x),g}if(s!=null)return this.convertAndCacheOnCPU(e);if(v().getBool("DEBUG")&&!v().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")&&v().getNumber("WEBGL_VERSION")===2)throw new Error("tensor.data() with WEBGL_DOWNLOAD_FLOAT_ENABLED=false and WEBGL_VERSION=2 not yet supported.");let l=null,u;if(i!=="complex64"&&v().get("WEBGL_BUFFER_SUPPORTED")){u=this.decode(e);const p=this.texData.get(u.dataId);l=this.gpgpu.createBufferFromTexture(p.texture.texture,...yn(o))}this.pendingRead.set(e,[]),i!=="complex64"&&await this.gpgpu.createAndWaitForFence();let d;if(i==="complex64"){const p=await Promise.all([this.read(a.real.dataId),this.read(a.imag.dataId)]),x=p[0],g=p[1];d=Ss(x,g)}else if(l==null)d=this.getValuesFromTexture(e);else{const p=F(o);d=this.gpgpu.downloadFloat32MatrixFromBuffer(l,p)}if(u!=null&&this.disposeIntermediateTensorInfo(u),l!=null){const p=this.gpgpu.gl;A(p,()=>p.deleteBuffer(l))}const h=this.convertAndCacheOnCPU(e,d),f=this.pendingRead.get(e);return this.pendingRead.delete(e),f.forEach(p=>p(h)),this.pendingDisposal.has(e)&&(this.pendingDisposal.delete(e),this.disposeData(e)&&Xe().removeDataId(e,this),this.pendingDeletes--),h}readToGPU(e,t={}){const s=this.texData.get(e),{values:o,shape:r,slice:i,dtype:a,isPacked:c,texture:l}=s;if(a==="complex64")throw new Error("Does not support reading texture for complex64 dtype.");if(i!=null){let f;c?f=new Ke(r,je):f=new Le(r,je);const p=this.runWebGLProgram(f,[{dataId:e,shape:r,dtype:a}],a),x=this.readToGPU(p,t);return this.disposeIntermediateTensorInfo(p),x}if(l==null)throw o!=null?new Error("Data is not on GPU but on CPU."):new Error("There is no data on GPU or CPU.");const u=this.decode(e,t.customTexShape),d=Xe().makeTensorFromTensorInfo(u),h=this.texData.get(u.dataId);return Object.assign({tensorRef:d},h.texture)}bufferSync(e){const t=this.readSync(e.dataId);if(e.dtype==="string")try{const s=t.map(o=>Ft(o));return re(e.shape,e.dtype,s)}catch{throw new Error("Failed to decode encoded string bytes into utf-8")}return re(e.shape,e.dtype,t)}checkNumericalProblems(e){if(e!=null)for(let t=0;t<e.length;t++){const s=e[t];if(!Gi(s))throw v().getBool("WEBGL_RENDER_FLOAT32_CAPABLE")?Error(`The value ${s} cannot be represented with your current settings. Consider enabling float32 rendering: 'tf.env().set('WEBGL_RENDER_FLOAT32_ENABLED', true);'`):Error(`The value ${s} cannot be represented on this device.`)}}getValuesFromTexture(e){const{shape:t,dtype:s,isPacked:o}=this.texData.get(e),r=F(t);if(v().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")){const h=this.decode(e),f=this.texData.get(h.dataId),p=this.gpgpu.downloadMatrixFromPackedTexture(f.texture.texture,...yn(t)).subarray(0,r);return this.disposeIntermediateTensorInfo(h),p}const i=v().getBool("WEBGL_PACK")&&o===!0,a=i?tn(t):t,c=i?new Kp(a):new qp(a),l=this.runWebGLProgram(c,[{shape:a,dtype:s,dataId:e}],"float32"),u=this.texData.get(l.dataId),d=this.gpgpu.downloadByteEncodedFloatMatrixFromOutputTexture(u.texture.texture,u.texShape[0],u.texShape[1]).subarray(0,r);return this.disposeIntermediateTensorInfo(l),d}timerAvailable(){return v().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0}time(e){const t=this.activeTimers,s=[];let o=!1;this.programTimersStack==null?(this.programTimersStack=s,o=!0):this.activeTimers.push(s),this.activeTimers=s,e();const r=lt(this.activeTimers.map(c=>c.query)).filter(c=>c!=null),i=lt(this.activeTimers.map(c=>c.name)).filter(c=>c!=null);this.activeTimers=t,o&&(this.programTimersStack=null);const a={uploadWaitMs:this.uploadWaitMs,downloadWaitMs:this.downloadWaitMs,kernelMs:null,wallMs:null};return(async()=>{if(v().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0){const c=await Promise.all(r);a.kernelMs=yc(c),a.getExtraProfileInfo=()=>c.map((l,u)=>({name:i[u],ms:l})).map(l=>`${l.name}: ${l.ms}`).join(", ")}else a.kernelMs={error:"WebGL query timers are not supported in this environment."};return this.uploadWaitMs=0,this.downloadWaitMs=0,a})()}memory(){return{unreliable:!1,numBytesInGPU:this.numBytesInGPU,numBytesInGPUAllocated:this.textureManager.numBytesAllocated,numBytesInGPUFree:this.textureManager.numBytesFree}}startTimer(){return v().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?this.gpgpu.beginQuery():{startMs:Ee(),endMs:null}}endTimer(e){return v().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?(this.gpgpu.endQuery(),e):(e.endMs=Ee(),e)}async getQueryTime(e){if(v().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0)return this.gpgpu.waitForQueryAndGetTime(e);const t=e;return t.endMs-t.startMs}disposeData(e,t=!1){if(this.pendingDisposal.has(e))return!1;if(!this.texData.has(e))return!0;if(t?this.texData.get(e).refCount=0:this.texData.get(e).refCount--,!t&&this.texData.get(e).refCount>0)return!1;if(this.pendingRead.has(e))return this.pendingDisposal.add(e),this.pendingDeletes++,!1;this.releaseGPUData(e);const{complexTensorInfos:s}=this.texData.get(e);return s!=null&&(this.disposeData(s.real.dataId,t),this.disposeData(s.imag.dataId,t)),this.texData.delete(e),!0}releaseGPUData(e){const{texture:t,dtype:s,texShape:o,usage:r,isPacked:i,slice:a}=this.texData.get(e),c=a&&a.origDataId||e,l=this.dataRefCount.get(c);l>1?this.dataRefCount.set(c,l-1):(this.dataRefCount.delete(c),t!=null&&(this.numBytesInGPU-=this.computeBytes(o,s),this.textureManager.releaseTexture(t,o,r,i)));const u=this.texData.get(e);u.texture=null,u.texShape=null,u.isPacked=!1,u.slice=null}getTexture(e){return this.uploadToGPU(e),this.texData.get(e).texture.texture}getDataInfo(e){return this.texData.get(e)}shouldExecuteOnCPU(e,t=mx){return v().getBool("WEBGL_CPU_FORWARD")&&e.every(s=>this.texData.get(s.dataId).texture==null&&F(s.shape)<t)}getGPGPUContext(){return this.gpgpu}where(e){Fe("tf.where() in webgl locks the UI thread. Call tf.whereAsync() instead");const t=e.dataSync();return dx(e.shape,t)}packedUnaryOp(e,t,s){const o=new Ke(e.shape,t),r=this.compileAndRun(o,[e],s);return Xe().makeTensorFromTensorInfo(r)}abs(e){if(this.shouldExecuteOnCPU([e])&&e.dtype!=="complex64"){const o=La(this.texData.get(e.dataId).values);return this.makeOutput(e.shape,e.dtype,o)}if(v().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,Xo,e.dtype);const t=new Le(e.shape,Xo),s=this.compileAndRun(t,[e]);return Xe().makeTensorFromTensorInfo(s)}makeTensorInfo(e,t,s){let o;if(t==="string"&&s!=null&&s.length>0&&Un(s[0])){const r=s.map(i=>it(i));o=this.write(r,e,t)}else o=this.write(s,e,t);return this.texData.get(o).usage=null,{dataId:o,shape:e,dtype:t}}makeOutput(e,t,s){return Xe().makeTensorFromTensorInfo(this.makeTensorInfo(e,t,s),this)}unpackTensor(e){const t=new ux(e.shape);return this.runWebGLProgram(t,[e],e.dtype)}packTensor(e){const t=new qg(e.shape);return this.runWebGLProgram(t,[e],e.dtype,null,!0)}packedReshape(e,t){const s=[pt(e.shape),...mt(e.shape)],o={dtype:e.dtype,shape:s,dataId:e.dataId},r=[pt(t),...mt(t)],i=new Va(r,s),a=!0,c=[s],l=this.runWebGLProgram(i,[o],e.dtype,c,a);return{dataId:l.dataId,shape:t,dtype:l.dtype}}decode(e,t){const s=this.texData.get(e),{isPacked:o,shape:r,dtype:i}=s;if(t!=null){const h=F(r),f=t[0]*t[1]*4;D(h<=f,()=>"customTexShape is too small. Row * Column * 4 should be equal or larger than the size of the tensor data.")}const a=tn(r);let c;o?c=new jp(a):c=new Xp(a);const l=!0,u=[t??yn(a)],d=this.runWebGLProgram(c,[{shape:a,dtype:i,dataId:e}],i,u,l,t);return{dtype:i,shape:r,dataId:d.dataId}}runWebGLProgram(e,t,s,o,r=!1,i){const a=this.makeTensorInfo(e.outputShape,s),c=this.texData.get(a.dataId);if(e.packedOutput&&(c.isPacked=!0),e.outPackingScheme===rn.DENSE){const m=i??yn(e.outputShape);c.texShape=m.map(C=>C*2)}if(e.outTexUsage!=null&&(c.usage=e.outTexUsage),F(a.shape)===0)return c.values=ct(a.dtype,0),a;const l=[],u=t.map(m=>{if(m.dtype==="complex64")throw new Error("GPGPUProgram does not support complex64 input. For complex64 dtypes, please separate the program into real and imaginary parts.");let C=this.texData.get(m.dataId);if(C.texture==null){if(!e.packedInputs&&F(m.shape)<=v().getNumber("WEBGL_SIZE_UPLOAD_UNIFORM"))return{shape:m.shape,texData:null,isUniform:!0,uniformValues:C.values};e.packedInputs&&(C.isPacked=!0,C.shape=m.shape)}if(this.uploadToGPU(m.dataId),!!C.isPacked!=!!e.packedInputs)m=C.isPacked?this.unpackTensor(m):this.packTensor(m),l.push(m),C=this.texData.get(m.dataId);else if(C.isPacked&&!an(C.shape,m.shape)){const w=m,y=m.shape;m.shape=C.shape,m=this.packedReshape(m,y),l.push(m),C=this.texData.get(m.dataId),w.shape=y}return{shape:m.shape,texData:C,isUniform:!1}});this.uploadToGPU(a.dataId);const d={shape:a.shape,texData:c,isUniform:!1},h=Hp(e,u,d),f=this.getAndSaveBinary(h,()=>Gp(this.gpgpu,e,u,d)),p=this.activeTimers!=null;let x;p&&(x=this.startTimer()),v().get("ENGINE_COMPILE_ONLY")||zp(this.gpgpu,f,u,d,o),l.forEach(m=>this.disposeIntermediateTensorInfo(m)),p&&(x=this.endTimer(x),this.activeTimers.push({name:e.constructor.name,query:this.getQueryTime(x)}));const g=v().getNumber("WEBGL_FLUSH_THRESHOLD");if(g>0){const m=Ee();m-this.lastGlFlushTime>g&&(this.gpgpu.gl.flush(),this.lastGlFlushTime=m)}if(!v().getBool("WEBGL_LAZILY_UNPACK")&&c.isPacked&&r===!1){const m=this.unpackTensor(a);return this.disposeIntermediateTensorInfo(a),m}return a}compileAndRun(e,t,s,o,r=!1){return s=s||t[0].dtype,this.runWebGLProgram(e,t,s,o,r)}getAndSaveBinary(e,t){return e in this.binaryCache||(this.binaryCache[e]=t()),this.binaryCache[e]}getTextureManager(){return this.textureManager}dispose(){this.disposed||(v().getBool("IS_TEST")||Object.keys(this.binaryCache).forEach(t=>{this.gpgpu.deleteProgram(this.binaryCache[t].webGLProgram),delete this.binaryCache[t]}),this.textureManager.dispose(),this.canvas!=null&&typeof HTMLCanvasElement<"u"&&this.canvas instanceof HTMLCanvasElement?this.canvas.remove():this.canvas=null,this.gpgpuCreatedLocally&&(this.gpgpu.program=null,this.gpgpu.dispose()),this.disposed=!0)}floatPrecision(){return this.floatPrecisionValue==null&&(this.floatPrecisionValue=Q(()=>{if(!v().get("WEBGL_RENDER_FLOAT32_ENABLED")){const e=v().getBool("DEBUG");v().set("DEBUG",!1);const t=this.abs(Ze(1e-8)).dataSync()[0];if(v().set("DEBUG",e),t>0)return 32}return 16})),this.floatPrecisionValue}epsilon(){return this.floatPrecision()===32?hx:fx}uploadToGPU(e){const t=this.texData.get(e),{shape:s,dtype:o,values:r,texture:i,usage:a,isPacked:c}=t;if(i!=null)return;const l=this.activeTimers!=null;let u;l&&(u=Ee());let d=t.texShape;if(d==null&&(d=ia(s,c),t.texShape=d),r!=null){const h=tn(s);let f,p=d[1],x=d[0];const g=r instanceof Uint8Array||r instanceof Uint8ClampedArray;(c||!g)&&([p,x]=Vt(d[0],d[1])),c?f=new Qp(h,g):f=new Bo(h,g);const m=g?[x,p]:d,C=this.makeTensorInfo(m,o),w=this.texData.get(C.dataId);g?w.usage=be.PIXELS:w.usage=be.UPLOAD,w.texShape=m,this.gpgpu.uploadDenseMatrixToTexture(this.getTexture(C.dataId),p,x,r);const y=[[x,p]],N=this.runWebGLProgram(f,[C],o,y,!0),E=this.texData.get(N.dataId);t.texShape=E.texShape,t.isPacked=E.isPacked,t.usage=E.usage,v().get("ENGINE_COMPILE_ONLY")?this.disposeData(N.dataId):(t.texture=E.texture,t.values=null,this.texData.delete(N.dataId)),this.disposeIntermediateTensorInfo(C),l&&(this.uploadWaitMs+=Ee()-u)}else{const h=this.acquireTexture(d,a,o,c);t.texture=h}}convertAndCacheOnCPU(e,t){const s=this.texData.get(e),{dtype:o}=s;return t!=null&&(s.values=Cx(t,o)),s.values}acquireTexture(e,t,s,o){if(this.numBytesInGPU+=this.computeBytes(e,s),!this.warnedAboutMemory&&this.numBytesInGPU>this.numMBBeforeWarning*1024*1024){const r=(this.numBytesInGPU/1024/1024).toFixed(2);this.warnedAboutMemory=!0,console.warn(`High memory usage in GPU: ${r} MB, most likely due to a memory leak`)}return this.textureManager.acquireTexture(e,t,o)}computeBytes(e,t){return e[0]*e[1]*An(t)}checkCompileCompletion(){for(const[,e]of Object.entries(this.binaryCache))this.checkCompletion_(e)}async checkCompileCompletionAsync(){const e=[];if(this.gpgpu.parallelCompilationExtension){for(const[,t]of Object.entries(this.binaryCache))e.push(this.checkCompletionAsync_(t));return Promise.all(e)}else{for(const[,t]of Object.entries(this.binaryCache)){const s=new Promise(o=>{try{this.checkCompletion_(t),o(!0)}catch(r){throw r}});e.push(s)}return Promise.all(e)}}async checkCompletionAsync_(e){return this.gpgpu.gl.getProgramParameter(e.webGLProgram,this.gpgpu.parallelCompilationExtension.COMPLETION_STATUS_KHR)?this.checkCompletion_(e):(await Lf(),this.checkCompletionAsync_(e))}checkCompletion_(e){if(this.gpgpu.gl.getProgramParameter(e.webGLProgram,this.gpgpu.gl.LINK_STATUS)===!1)throw console.log(this.gpgpu.gl.getProgramInfoLog(e.webGLProgram)),this.gpgpu.gl.getShaderParameter(e.fragmentShader,this.gpgpu.gl.COMPILE_STATUS)===!1?(Zs(e.source,this.gpgpu.gl.getShaderInfoLog(e.fragmentShader)),new Error("Failed to compile fragment shader.")):new Error("Failed to link vertex and fragment shaders.");return!0}getUniformLocations(){for(const e of Object.values(this.binaryCache)){this.gpgpu.buildVao(e.webGLProgram);const{variablesLocations:t,customUniformLocations:s,infLoc:o,nanLoc:r,outShapeLocation:i,outShapeStridesLocation:a,outTexShapeLocation:c}=xa(this.gpgpu,e.program,e.webGLProgram);e.variablesLocations=t,e.customUniformLocations=s,e.infLoc=o,e.nanLoc=r,e.outShapeLocation=i,e.outShapeStridesLocation=a,e.outTexShapeLocation=c}}createTensorFromGPUData(e,t,s){e.channels=e.channels||"RGBA";const{texture:o,height:r,width:i,channels:a}=e,c=Xe().backend;if(!c.gpgpu.gl.isTexture(o))throw new Error("The texture is invalid. Also, please make sure the texture and the TFJS WebGL backend are using the same canvas. If you want to use your own custom canvas, you have to create and use the custom TFJS WebGL backend created from the canvas through 'new tf.MathBackendWebGL(customCanvas)'.");const l=c.writeTexture(o,t,s,r,i,a);return Xe().makeTensorFromDataId(l,t,s,c)}}qn.nextDataId=0;function Cx(n,e){if(e==="float32"||e==="complex64")return n;if(e==="int32"||e==="bool"){const t=e==="int32"?new Int32Array(n.length):new Uint8Array(n.length);for(let s=0;s<t.length;++s)t[s]=Math.round(n[s]);return t}else throw new Error(`Unknown dtype ${e}`)}const rS="4.22.0";function bx(){v().set("WEBGL_FORCE_F16_TEXTURES",!0)}Hr()&&oh("webgl",()=>new qn,2);const iS={forceHalfFloat:bx};const co=`
  if (isnan(a)) return a;
  if (isnan(b)) return b;
`;class gt{constructor(e,t,s){this.variableNames=["A","B"],this.outputShape=de(t,s),this.enableShapeUniforms=ce(this.outputShape.length),this.userCode=`
      float binaryOperation(float a, float b) {
        ${e}
      }

      void main() {
        float a = getAAtOutCoords();
        float b = getBAtOutCoords();
        setOutput(binaryOperation(a, b));
      }
    `}}const $t=`
  result.r = isNaN.r ? NAN : result.r;
  result.g = isNaN.g ? NAN : result.g;
  result.b = isNaN.b ? NAN : result.b;
  result.a = isNaN.a ? NAN : result.a;
`;class Xt{constructor(e,t,s,o=!1){this.variableNames=["A","B"],this.supportsBroadcasting=!0,this.packedInputs=!0,this.packedOutput=!0,this.outputShape=de(t,s);const r=this.outputShape.length;this.enableShapeUniforms=ce(r);let i="";if(o)if(r===0||F(this.outputShape)===1)i=`
          result.y = 0.;
          result.z = 0.;
          result.w = 0.;
        `;else if(i=`
          ${z(r)} coords = getOutputCoords();
        `,r===1)this.enableShapeUniforms?i+=`
            result.y = (coords + 1) >= outShape ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `:i+=`
            result.y = (coords + 1) >= ${this.outputShape[0]} ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `;else{const c=ue("coords",r);this.enableShapeUniforms?i+=`
            bool nextRowOutOfBounds =
              (${c[r-2]} + 1) >= outShape[${r} - 2];
            bool nextColOutOfBounds =
              (${c[r-1]} + 1) >= outShape[${r} - 1];
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `:i+=`
            bool nextRowOutOfBounds =
              (${c[r-2]} + 1) >= ${this.outputShape[r-2]};
            bool nextColOutOfBounds =
              (${c[r-1]} + 1) >= ${this.outputShape[r-1]};
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `}this.userCode=`
      vec4 binaryOperation(vec4 a, vec4 b) {
        ${e}
      }

      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();

        vec4 result = binaryOperation(a, b);
        ${i}

        setOutput(result);
      }
    `}}function Ce(n){const{inputs:e,backend:t}=n,{x:s}=e;return t.incRef(s.dataId),{dataId:s.dataId,shape:s.shape,dtype:s.dtype}}const wx={kernelName:Ms,backendName:"webgl",kernelFunc:Ce};function Je(n){const{inputs:e,backend:t}=n,{real:s,imag:o}=e,r=t.makeTensorInfo(s.shape,"complex64"),i=t.texData.get(r.dataId),a=Ce({inputs:{x:s},backend:t}),c=Ce({inputs:{x:o},backend:t});return i.complexTensorInfos={real:a,imag:c},r}const yx={kernelName:Cr,backendName:"webgl",kernelFunc:Je};const Ua="return (a < 0.) ? b * a : a;",Wa=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`;function vx(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{alpha:r}=s,i=t.makeTensorInfo([],"float32",_t(r,"float32")),a=v().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Xt(Wa,o.shape,i.shape):new gt(Ua,o.shape,i.shape),c=t.runWebGLProgram(a,[o,i],"float32");return t.disposeIntermediateTensorInfo(i),c}const $x={kernelName:Hl,backendName:"webgl",kernelFunc:vx};const Ga="return (a < 0.) ? b * a : a;",za=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`;function Sx(n){const{inputs:e,backend:t}=n,{x:s,alpha:o}=e,r=v().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Xt(za,s.shape,o.shape):new gt(Ga,s.shape,o.shape);return t.runWebGLProgram(r,[s,o],"float32")}const Ix={kernelName:$u,backendName:"webgl",kernelFunc:Sx};const jt="if (isnan(x)) return x;";function V({opSnippet:n,packedOpSnippet:e,cpuKernelImpl:t,dtype:s}){return({inputs:o,backend:r})=>{const{x:i}=o,a=r,c=s||i.dtype;if(a.shouldExecuteOnCPU([i])&&t!=null){const d=a.texData.get(i.dataId),h=t(d.values,c);return a.makeTensorInfo(i.shape,c,h)}const l=v().getBool("WEBGL_PACK_UNARY_OPERATIONS")&&e!=null;let u;return l?u=new Ke(i.shape,e):u=new Le(i.shape,n),a.runWebGLProgram(u,[i],c)}}function ie({opSnippet:n,packedOpSnippet:e,checkOutOfBounds:t=!1,supportsComplex:s=!1,cpuKernelImpl:o,dtype:r}){return({inputs:i,backend:a})=>{const{a:c,b:l}=i,u=a;if(s&&c.dtype==="complex64"){const p=u.texData.get(c.dataId),x=u.texData.get(l.dataId),[g,m]=[[p.complexTensorInfos.real,x.complexTensorInfos.real],[p.complexTensorInfos.imag,x.complexTensorInfos.imag]].map(w=>{const[y,I]=w,N={dataId:y.dataId,dtype:y.dtype,shape:c.shape},E={dataId:I.dataId,dtype:I.dtype,shape:l.shape},R=new gt(n,c.shape,l.shape);return u.runWebGLProgram(R,[N,E],Ve(y.dtype,I.dtype))}),C=Je({inputs:{real:g,imag:m},backend:u});return u.disposeIntermediateTensorInfo(g),u.disposeIntermediateTensorInfo(m),C}const d=r||Ve(c.dtype,l.dtype);if((c.dtype==="string"||l.dtype==="string"||u.shouldExecuteOnCPU([c,l]))&&o!=null){const p=u.texData.get(c.dataId).values,x=u.texData.get(l.dataId).values,g=c.dtype==="string"?Pt(p):p,m=c.dtype==="string"?Pt(x):x,[C,w]=o(c.shape,l.shape,g,m,d),y=u.makeTensorInfo(w,d),I=u.texData.get(y.dataId);return I.values=C,y}const h=v().getBool("WEBGL_PACK_BINARY_OPERATIONS")&&e!=null;let f;return h?f=new Xt(e,c.shape,l.shape,t):f=new gt(n,c.shape,l.shape),u.runWebGLProgram(f,[c,l],d)}}function cn(n,e=!1){if(n==="linear")return e?rx:ex;if(n==="relu")return e?ax:nx;if(n==="elu")return e?ix:tx;if(n==="relu6")return e?cx:sx;if(n==="prelu")return e?za:Ga;if(n==="leakyrelu")return e?Wa:Ua;if(n==="sigmoid")return e?lx:ox;throw new Error(`Activation ${n} has not been implemented for the WebGL backend.`)}class Ha{constructor(e,t,s,o=!1,r=!1,i=!1,a=null,c=!1,l=!1){this.variableNames=["matrixA","matrixB"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=s,this.enableShapeUniforms=ce(this.outputShape.length);const u=o?e[1]:e[2],d=Math.ceil(u/2),h=o?"i * 2, rc.y":"rc.y, i * 2",f=r?"rc.z, i * 2":"i * 2, rc.z",p=o?["a.xxyy","a.zzww"]:["a.xxzz","a.yyww"],x=r?["b.xzxz","b.ywyw"]:["b.xyxy","b.zwzw"];let g="",m="";a&&(c?g=`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${a}
        }`:l?g=`vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${a}
        }`:g=`vec4 activation(vec4 x) {
          ${a}
        }`,m="result = activation(result);");const C=i?"result += getBiasAtOutCoords();":"";i&&this.variableNames.push("bias"),c&&this.variableNames.push("preluActivationWeights"),l&&this.variableNames.push("leakyreluAlpha");let w="rc.x",y="rc.x";e[0]<t[0]?w=`imod(rc.x, ${e[0]})`:t[0]<e[0]&&(y=`imod(rc.x, ${t[0]})`),this.userCode=`
      ${g}
      // Don't use uniform for sharedDimensionPacked for performance.
      const float sharedDimension = ${d}.0;

      vec4 dot2x2ARowBCol(ivec3 rc) {
        vec4 result = vec4(0);
        int batchA = ${w};
        int batchB = ${y};
        for (int i = 0; i < ${d}; i++) {
          vec4 a = getMatrixA(batchA, ${h});
          vec4 b = getMatrixB(batchB, ${f});

          // These swizzled products need to be separately added.
          // See: https://github.com/tensorflow/tfjs/issues/1735
          result += (${p[0]} * ${x[0]});
          result += (${p[1]} * ${x[1]});
        }
        return result;
      }

      void main() {
        ivec3 rc = getOutputCoords();
        vec4 result = dot2x2ARowBCol(rc);

        ${C}

        ${m}

        setOutput(result);
      }
    `}}const jo={REAL:"return areal * breal - aimag * bimag;",IMAG:"return areal * bimag + aimag * breal;"};class qo{constructor(e,t,s){this.variableNames=["AReal","AImag","BReal","BImag"],this.outputShape=de(t,s),this.userCode=`
      float binaryOpComplex(
          float areal, float aimag, float breal, float bimag) {
        ${e}
      }

      void main() {
        float areal = getARealAtOutCoords();
        float aimag = getAImagAtOutCoords();
        float breal = getBRealAtOutCoords();
        float bimag = getBImagAtOutCoords();
        setOutput(binaryOpComplex(areal, aimag, breal, bimag));
      }
    `}}const Ko="return a * b;";function lo(n){const{inputs:e,backend:t}=n,{a:s,b:o}=e,r=Ve(s.dtype,o.dtype);if(s.dtype==="complex64"){const a=t.texData.get(s.dataId),c=t.texData.get(o.dataId),l=new qo(jo.REAL,s.shape,o.shape),u=new qo(jo.IMAG,s.shape,o.shape),d=[{dataId:a.complexTensorInfos.real.dataId,dtype:a.complexTensorInfos.real.dtype,shape:s.shape},{dataId:a.complexTensorInfos.imag.dataId,dtype:a.complexTensorInfos.imag.dtype,shape:s.shape},{dataId:c.complexTensorInfos.real.dataId,dtype:c.complexTensorInfos.real.dtype,shape:o.shape},{dataId:c.complexTensorInfos.imag.dataId,dtype:c.complexTensorInfos.imag.dtype,shape:o.shape}],h=t.runWebGLProgram(l,d,"float32"),f=t.runWebGLProgram(u,d,"float32"),p=Je({inputs:{real:h,imag:f},backend:t});return t.disposeIntermediateTensorInfo(h),t.disposeIntermediateTensorInfo(f),p}if(t.shouldExecuteOnCPU([s,o])){const a=t.texData.get(s.dataId),c=t.texData.get(o.dataId),[l,u]=$g(s.shape,o.shape,a.values,c.values,r),d=t.makeTensorInfo(u,r),h=t.texData.get(d.dataId);return h.values=l,d}let i;return v().getBool("WEBGL_PACK_BINARY_OPERATIONS")?i=new Xt(Ko,s.shape,o.shape):i=new gt(Ko,s.shape,o.shape),t.runWebGLProgram(i,[s,o],r)}const Rx={kernelName:Sr,backendName:"webgl",kernelFunc:lo};function Tx(n,e,t){const s=[pt(n.shape),...mt(n.shape)],o={dtype:n.dtype,shape:s,dataId:n.dataId},r=[pt(e),...mt(e)],i=new Va(r,s),a=!0,c=[s],l=t.runWebGLProgram(i,[o],n.dtype,c,a);return{dataId:l.dataId,shape:e,dtype:l.dtype}}function k(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{shape:r}=s,i=t,a=F(o.shape),c=vc(r,a),l=F(c);D(a===l,()=>`The new shape (${c}) has ${l} elements and the old shape (${o.shape}) has ${a} elements. The new shape and old shape must have the same number of elements.`);const u=i.texData.get(o.dataId);return u.isPacked&&!an(o.shape,c)&&!(u.texture!==null&&an(u.shape,c))?Tx(o,c,i):(i.incRef(o.dataId),{dataId:o.dataId,shape:c,dtype:o.dtype})}const Ex={kernelName:Rr,backendName:"webgl",kernelFunc:k};class Yo{constructor(e,t){this.variableNames=["x"];const{windowSize:s,batchSize:o,inSize:r,outSize:i}=e;this.outputShape=[o,i];const a=Math.floor(s/4)*4,c=s%4;let l="sumValue += dot(values, ones);";if(t!=null){const d=1/t;l=`sumValue += dot(values * ${fr(d)?d.toPrecision(2):d}, ones);`}let u="";r%s>0&&(u=`
        if (inIdx < 0 || inIdx >= ${r}) {
          return 0.0;
        }
      `),this.userCode=`
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${u}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${s};

        float sumValue = 0.0;

        for (int i = 0; i < ${a}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${l}
        }

        int inIdx = inOffset + ${a};
        if (${c===1}) {
          vec4 values = vec4(getValue(batch, inIdx), 0.0, 0.0, 0.0);

          ${l}
        } else if (${c===2}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1), 0.0, 0.0);

          ${l}
        } else if (${c===3}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2), 0.0);

          ${l}
        }
        setOutput(sumValue);
      }
    `}}class Nx{constructor(e,t){this.variableNames=["x"];const{windowSize:s,batchSize:o,inSize:r,outSize:i}=e;this.outputShape=[o,i];let a="0.0",c="";t==="prod"?a="1.0":t==="min"?(a="1.0 / 1e-20",c="min"):t==="max"&&(a="-1.0 / 1e-20",c="max");let l=`${t}(${t}(${t}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;t==="sum"?l="sumValue":t==="prod"?l="prodValue":t==="all"?l="allValue":t==="any"&&(l="anyValue");const u=Math.floor(s/4)*4,d=s%4;let h=`
      if (${t==="sum"}) {
        sumValue += dot(values, ones);
      } else if (${t==="prod"}) {
        vec2 tmp = vec2(values[0], values[1]) * vec2(values[2], values[3]);
        prodValue *= tmp[0] * tmp[1];
      } else {
        minMaxValue = ${c}(values, minMaxValue);
        if (${t==="min"} || ${t==="max"}) {
          minMaxValue = ${c}(values, minMaxValue);
          bvec4 isNaN = isnan(values);
          if (isNaN.r || isNaN.g || isNaN.b || isNaN.a) {
            minMaxValue = vec4(NAN);
          }
        }
      }
    `,f="vec4";t==="all"?(a="1.0",h=`
        bool reducedAllValue = all(values);
        float floatedReducedAllValue = float(reducedAllValue);
        allValue = float(allValue >= 1.0 && floatedReducedAllValue >= 1.0);
      `,f="bvec4"):t==="any"&&(a="0.0",h=`
        bool reducedAnyValue = any(values);
        float floatedReducedAnyValue = float(reducedAnyValue);
        anyValue = float(anyValue >= 1.0 || floatedReducedAnyValue >= 1.0);
      `,f="bvec4");let p="";r%s>0&&(p=`
        if (inIdx < 0 || inIdx >= ${r}) {
          return initializationValue;
        }
      `),this.userCode=`
      const float initializationValue = ${a};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${p}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${s};

        vec4 minMaxValue = vec4(${a});
        float prodValue = 1.0;
        float sumValue = 0.0;
        float allValue = 1.0;
        float anyValue = 0.0;

        for (int i = 0; i < ${u}; i += 4) {
          int inIdx = inOffset + i;
          ${f} values = ${f}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${h}
        }

        int inIdx = inOffset + ${u};
        if (${d===1}) {
          ${f} values = ${f}(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          ${h}
        } else if (${d===2}) {
          ${f} values = ${f}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          ${h}
        } else if (${d===3}) {
          ${f} values = ${f}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          ${h}
        }
        setOutput(${l});
      }
    `}}function kx(n){const e=[];for(;e.length===0||e[e.length-1].outSize!==1;){const t=e.length?e[e.length-1].outSize:n[1],s=Xn(t);e.push({inSize:t,windowSize:s,outSize:Math.ceil(t/s)})}return e}function St(n,e,t,s){const o=kx(n.shape);let r=n;for(let i=0;i<o.length;i++){const{inSize:a,windowSize:c,outSize:l}=o[i];let u,d;t==="mean"?u=i===0?new Yo({windowSize:c,inSize:a,batchSize:n.shape[0],outSize:l},a):new Yo({windowSize:c,inSize:a,batchSize:n.shape[0],outSize:l}):u=new Nx({windowSize:c,inSize:a,batchSize:n.shape[0],outSize:l},t),d=r,r=s.runWebGLProgram(u,[r],e),d.dataId!==n.dataId&&s.disposeIntermediateTensorInfo(d)}return r}class Ax{constructor(e,t){this.variableNames=["A"];const s=new Array(e.length);for(let i=0;i<s.length;i++)s[i]=e[t[i]];this.outputShape=s,this.rank=s.length;const o=z(this.rank),r=Fx(t);this.userCode=`
    void main() {
      ${o} resRC = getOutputCoords();
      setOutput(getA(${r}));
    }
    `}}function Fx(n){const e=n.length;if(e>6)throw Error(`Transpose for rank ${e} is not yet supported`);const t=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u","resRC.v"],s=new Array(e);for(let o=0;o<n.length;o++)s[n[o]]=t[o];return s.join()}class Dx{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0;const s=new Array(e.length);for(let u=0;u<s.length;u++)s[u]=e[t[u]];if(this.outputShape=s,this.rank=s.length,this.rank>6)throw Error(`Packed transpose for rank ${this.rank} is not yet supported.`);const o=z(this.rank),r=Ma("rc",this.rank),i=new Array(this.rank);for(let u=0;u<t.length;u++)i[t[u]]=r[u];const a=`vec2(${i.slice(-2).join()})`,c=`++${r[this.rank-1]} < ${s[this.rank-1]}`,l=`getChannel(getA(${i.join()}), ${a})`;this.userCode=`
    void main() {
      ${o} rc = getOutputCoords();
      vec4 result = vec4(0.);
      result[0] = ${l};
      if(${c}) {
        result[1] = ${l};
      }
      --${r[this.rank-1]};
      if(++${r[this.rank-2]} < ${s[this.rank-2]}) {
        result[2] = ${l};
        if(${c}) {
          result[3] = ${l};
        }
      }
      setOutput(result);
    }
    `}}function Kn(n,e,t){const s=v().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new Dx(n.shape,e):new Ax(n.shape,e);return t.runWebGLProgram(s,[n],n.dtype)}function Ox(n,e,t,s){const o=e,r=n.shape.length,i=ge(o,n.shape);let a=i;const c=Ie(a,r),l=c!=null;let u=n;l&&(u=Kn(n,c,s),a=Re(a.length,r)),Pe("sum",a,r);const[d,h]=Ue(u.shape,a);let f=d;t&&(f=Ge(d,i));const p=F(h),g=F(n.shape)/p,m=k({inputs:{x:u},attrs:{shape:[g,p]},backend:s}),C=Vs(n.dtype),w=St(m,C,"sum",s),y=k({inputs:{x:w},attrs:{shape:f},backend:s});return s.disposeIntermediateTensorInfo(m),s.disposeIntermediateTensorInfo(w),l&&s.disposeIntermediateTensorInfo(u),y}function Yn(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{axis:r,keepDims:i}=s;return Ox(o,r,i,t)}const Px={kernelName:Qu,backendName:"webgl",kernelFunc:Yn};function he(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{perm:r}=s,i=t,a=o.shape.length,c=new Array(a);for(let u=0;u<c.length;u++)c[u]=o.shape[r[u]];let l;if(i.shouldExecuteOnCPU([o])){const d=i.texData.get(o.dataId).values,h=ao(d,o.shape,o.dtype,r,c);l=i.makeTensorInfo(c,o.dtype);const f=i.texData.get(l.dataId);f.values=h}else l=Kn(o,r,i);return l}const _x={kernelName:xd,backendName:"webgl",kernelFunc:he};const Xa=1e3;function Bn({a:n,b:e,transposeA:t,transposeB:s,backend:o,bias:r=null,preluActivationWeights:i=null,leakyreluAlpha:a=0,activation:c=null}){const l=n.shape.length,u=e.shape.length,d=t?n.shape[l-2]:n.shape[l-1],h=s?e.shape[u-1]:e.shape[u-2],f=t?n.shape[l-1]:n.shape[l-2],p=s?e.shape[u-2]:e.shape[u-1],x=n.shape.slice(0,-2),g=e.shape.slice(0,-2),m=F(x),C=F(g),y=de(n.shape.slice(0,-2),e.shape.slice(0,-2)).concat([f,p]);D(d===h,()=>`Error in matMul: inner shapes (${d}) and (${h}) of Tensors with shapes ${n.shape} and ${e.shape} and transposeA=${t} and transposeB=${s} must match.`);const I=t?[m,d,f]:[m,f,d],N=s?[C,p,h]:[C,h,p],E=k({inputs:{x:n},backend:o,attrs:{shape:I}}),R=k({inputs:{x:e},backend:o,attrs:{shape:N}}),S=[E,R],$=Math.max(m,C),b=t?E.shape[1]:E.shape[2],T=r!=null,P=i!=null,B=c==="leakyrelu",L=c!=null?cn(c,!0):null,U=T||P||B||L!=null;let j;if((f===1||p===1)&&b>Xa&&U===!1){let q=E,H=R;t&&(q=he({inputs:{x:E},backend:o,attrs:{perm:[0,2,1]}}),S.push(q)),s&&(H=he({inputs:{x:R},backend:o,attrs:{perm:[0,2,1]}}),S.push(H));const Z=p!==1,Y=p===1;let ae=q;Z&&(ae=k({inputs:{x:q},backend:o,attrs:{shape:[$,b,1]}}),S.push(ae));const It=p===1?2:1;let Zn=H;Y&&(Zn=k({inputs:{x:H},backend:o,attrs:{shape:[$,1,b]}}),S.push(Zn));const fo=lo({inputs:{a:ae,b:Zn},backend:o});j=Yn({inputs:{x:fo},backend:o,attrs:{axis:It,keepDims:!0}}),S.push(fo)}else{const q=Ve(n.dtype,e.dtype),H=new Ha(I,N,[$,f,p],t,s,T,L,P,B),Z=[E,R];if(r!=null&&Z.push(r),P&&Z.push(i),B){const Y=o.makeTensorInfo([],"float32",_t(a,"float32"));Z.push(Y),S.push(Y)}j=o.runWebGLProgram(H,Z,q)}const W=k({inputs:{x:j},backend:o,attrs:{shape:y}});S.push(j);for(const q of S)o.disposeIntermediateTensorInfo(q);return W}function Lx(n){const{inputs:e,backend:t,attrs:s}=n,{a:o,b:r,bias:i,preluActivationWeights:a}=e,{transposeA:c,transposeB:l,activation:u,leakyreluAlpha:d}=s;return Bn({a:o,b:r,transposeA:c,transposeB:l,backend:t,bias:i,preluActivationWeights:a,leakyreluAlpha:d,activation:u})}const Bx={kernelName:Sd,backendName:"webgl",kernelFunc:Lx};const Qo="return abs(x);";function Mx(n){const{inputs:e,backend:t}=n,{x:s}=e;if(t.shouldExecuteOnCPU([s])&&s.dtype!=="complex64"){const r=t.texData.get(s.dataId),i=La(r.values);return t.makeTensorInfo(s.shape,s.dtype,i)}let o;return v().getBool("WEBGL_PACK_UNARY_OPERATIONS")?o=new Ke(s.shape,Qo):o=new Le(s.shape,Qo),t.runWebGLProgram(o,[s],s.dtype)}const Vx={kernelName:xr,backendName:"webgl",kernelFunc:Mx};const Ux=Te+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return acos(x);
`,Wx=V({opSnippet:Ux}),Gx={kernelName:_c,backendName:"webgl",kernelFunc:Wx};const zx=Te+`
  if (x < 1.0) return NAN;
return log(x + sqrt(x * x - 1.0));`,Hx=V({opSnippet:zx}),Xx={kernelName:Lc,backendName:"webgl",kernelFunc:Hx};const Zo="return a + b;",jx=ie({opSnippet:Zo,packedOpSnippet:Zo,supportsComplex:!0,cpuKernelImpl:ng}),qx={kernelName:Ls,backendName:"webgl",kernelFunc:jx};class Kx{constructor(e,t){this.outputShape=[],this.outputShape=e,this.variableNames=t.map((r,i)=>`T${i}`);const s=[];this.variableNames.forEach(r=>{s.push(`float v${r} = get${r}AtOutCoords();`)});const o=this.variableNames.map(r=>`v${r}`).join(" + ");this.userCode=`
      void main() {
        ${s.join(`
        `)}

        float result = ${o};
        setOutput(result);
      }
    `}}class Yx{constructor(e,t){this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=e,this.variableNames=t.map((r,i)=>`T${i}`);const s=[];this.variableNames.forEach(r=>{s.push(`vec4 v${r} = get${r}AtOutCoords();`)});const o=this.variableNames.map(r=>`v${r}`).join(" + ");this.userCode=`
      void main() {
        ${s.join(`
        `)}

        vec4 result = ${o};
        setOutput(result);
      }
    `}}function kn(n){const{inputs:e,backend:t}=n,s=e;if(s.length===1)return Ce({inputs:{x:s[0]},backend:t});if(s.length>v().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER")){const c=Math.floor(s.length/2),l=kn({inputs:s.slice(0,c),backend:t}),u=kn({inputs:s.slice(c),backend:t});return kn({inputs:[l,u],backend:t})}const o=s.map(c=>c.dtype).reduce((c,l)=>Ve(c,l)),r=s.map(c=>c.shape),a=v().getBool("WEBGL_PACK")?new Yx(s[0].shape,r):new Kx(s[0].shape,r);return t.runWebGLProgram(a,s,o)}const Qx={kernelName:Bc,backendName:"webgl",kernelFunc:kn};function Zx(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{axis:r,keepDims:i}=s,a=o.shape.length,c=ge(r,o.shape);let l=c;const u=Ie(l,a);let d=o;u!=null&&(d=he({inputs:{x:o},backend:t,attrs:{perm:u}}),l=Re(l.length,a)),Pe("all",l,a);const[h,f]=Ue(d.shape,l),p=F(f),x=k({inputs:{x:d},backend:t,attrs:{shape:[-1,p]}}),g=St(x,x.dtype,"all",t);let m;if(i){const C=Ge(h,c);m=k({inputs:{x:g},backend:t,attrs:{shape:C}})}else m=k({inputs:{x:g},backend:t,attrs:{shape:h}});return t.disposeIntermediateTensorInfo(x),t.disposeIntermediateTensorInfo(g),u!=null&&t.disposeIntermediateTensorInfo(d),m}const Jx={kernelName:Mc,backendName:"webgl",kernelFunc:Zx};function e0(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{axis:r,keepDims:i}=s,a=o.shape.length,c=ge(r,o.shape);let l=c;const u=Ie(l,a);let d=o;u!=null&&(d=he({inputs:{x:o},backend:t,attrs:{perm:u}}),l=Re(l.length,a)),Pe("any",l,a);const[h,f]=Ue(d.shape,l),p=F(f),x=k({inputs:{x:d},backend:t,attrs:{shape:[-1,p]}}),g=St(x,x.dtype,"any",t);let m;if(i){const C=Ge(h,c);m=k({inputs:{x:g},backend:t,attrs:{shape:C}})}else m=k({inputs:{x:g},backend:t,attrs:{shape:h}});return t.disposeIntermediateTensorInfo(x),t.disposeIntermediateTensorInfo(g),u!=null&&t.disposeIntermediateTensorInfo(d),m}const t0={kernelName:Vc,backendName:"webgl",kernelFunc:e0};class n0{constructor(e,t,s){this.variableNames=["A"];const{windowSize:o,batchSize:r,outSize:i}=e;s||this.variableNames.push("bestIndicesA"),this.outputShape=[r,i];const a=t==="max"?">":"<",c=s?"inOffset + i;":"round(getBestIndicesA(batch, inOffset + i));";this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${o};

        int bestIndex = inOffset;
        float bestValue = getA(batch, bestIndex);

        for (int i = 0; i < ${o}; i++) {
          int inIdx = ${c};
          float candidate = getA(batch, inIdx);
          if (candidate ${a} bestValue) {
            bestValue = candidate;
            bestIndex = inIdx;
          }
        }
        setOutput(float(bestIndex));
      }
    `}}class s0{constructor(e,t,s,o){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,D(e.length>2,()=>`Packed arg${s.charAt(0).toUpperCase()+s.slice(1)} supports only inputs with rank above 2.`);const r=e[e.length-1],i=Math.ceil(r/t);this.outputShape=e.slice(0,-1),i>1&&this.outputShape.push(i),o||this.variableNames.push("bestIndicesA");const a=this.outputShape,c=a.length,l=z(c),u=ue("coords",c);let d,h;if(i===1){h=c+1;const R=z(h);d=`
        ${R} sourceLocR = ${R}(${u.join()}, 0);
        ++${u[c-1]};
        ${R} sourceLocG = ${R}(${u.join()}, 0);
        ++${u[c-2]};
        ${R} sourceLocA = ${R}(${u.join()}, 0);
        --${u[c-1]};
        ${R} sourceLocB = ${R}(${u.join()}, 0);
        --${u[c-2]};`}else h=c,d=`
        ${l} sourceLocR = coords;
        ++${u[c-1]};
        ${l} sourceLocG = coords;
        ++${u[c-2]};
        ${l} sourceLocA = coords;
        --${u[c-1]};
        ${l} sourceLocB = coords;
        --${u[c-2]};`;const f=["x","y","z","w","u","v"].slice(0,h),p="."+f[h-1],x=f.map(R=>"int "+R),g=ue("sourceLocR",h-1).concat("inIdx.r"),m=ue("sourceLocG",h-1).concat("inIdx.g"),C=ue("sourceLocB",h-1).concat("inIdx.b"),w=ue("sourceLocA",h-1).concat("inIdx.a"),y=s==="max"?"greaterThan":"lessThan",I=o?"":`
          inIdx = round(vec4(getBestIndicesAChannel(${g.join()}),
                             getBestIndicesAChannel(${m.join()}),
                             getBestIndicesAChannel(${C.join()}),
                             getBestIndicesAChannel(${w.join()})));`,N=`vec4(
            getAChannel(${g.join()}),
            hasNextCol ? getAChannel(${m.join()}) : 0.,
            hasNextRow ? getAChannel(${C.join()}) : 0.,
            hasNextRow && hasNextCol ? getAChannel(${w.join()}) : 0.)`,E=o?"":`
      float getBestIndicesAChannel(${x.join()}) {
        return getChannel(getBestIndicesA(${f.join()}),
                                          vec2(${f.slice(-2).join()}));
      }`;this.userCode=`
      float getAChannel(${x.join()}) {
        return getChannel(getA(${f.join()}),
                               vec2(${f.slice(-2).join()}));
      }
      ${E}
      void main() {
        ${l} coords = getOutputCoords();
        bool hasNextCol = ${u[c-1]} < ${a[c-1]-1};
        bool hasNextRow = ${u[c-2]} < ${a[c-2]-1};
        ${d}
        ivec4 srcIdx = ivec4(sourceLocR${p}, sourceLocG${p},
          sourceLocB${p}, sourceLocA${p}) * ${t};
        ivec4 inIdx = srcIdx;
        vec4 bestIndex = vec4(inIdx);
        vec4 bestValue = ${N};

        for (int i = 0; i < ${t}; i++) {
          inIdx = srcIdx;
          ${I}
          vec4 candidate = ${N};
          bvec4 nan = isnan(candidate);
          bvec4 replace = bvec4(
            vec4(${y}(candidate, bestValue)) * (vec4(1.0) - vec4(nan)));

          bestValue = vec4(replace.x  ? candidate.x : bestValue.x,
                           replace.y  ? candidate.y : bestValue.y,
                           replace.z  ? candidate.z : bestValue.z,
                           replace.w  ? candidate.w : bestValue.w);
          bestIndex = mix(bestIndex, vec4(inIdx), vec4(replace));
          srcIdx++;
        }
        setOutput(bestIndex);
      }
    `}}function ja(n,e,t,s=null){let o=e.shape[0],r=e.shape[1];s!=null&&(o=s.shape[0],r=s.shape[1]);const i=Xn(r),a={windowSize:i,inSize:r,batchSize:o,outSize:Math.ceil(r/i)},c=new n0(a,t,s==null),l=[e];s!=null&&l.push(s);const u=n.runWebGLProgram(c,l,"int32");if(u.shape[1]===1)return u;const d=ja(n,e,t,u);return n.disposeIntermediateTensorInfo(u),d}function qa(n,e,t,s=null){const o=s!=null?s.shape:e.shape,r=o[o.length-1],i=Xn(r),a=new s0(o,i,t,s==null),c=s==null?[e]:[e,s],l=n.runWebGLProgram(a,c,"int32");if(l.shape.length===e.shape.length){const u=qa(n,e,t,l);return n.disposeIntermediateTensorInfo(l),u}return l}function Ka(n,e,t,s){const o=[t];if(Pe("arg"+s.charAt(0).toUpperCase()+s.slice(1),o,e.shape.length),!v().getBool("WEBGL_PACK_REDUCE")||e.shape.length<=2){const r=[],i=n.texData.get(e.dataId),a=i!==null&&i.isPacked;let c=e;a&&(c=n.unpackTensor(e),r.push(c));const[l,u]=Ue(c.shape,o),d=F(u),h=k({inputs:{x:c},backend:n,attrs:{shape:[-1,d]}});r.push(h);const f=ja(n,h,s);r.push(f);const p=k({inputs:{x:f},backend:n,attrs:{shape:l}});return r.forEach(x=>n.disposeIntermediateTensorInfo(x)),p}return qa(n,e,s)}function o0(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{axis:r}=s;let i=ge(r,o.shape);const a=Ie(i,o.shape.length);let c=o;const l=[];a!=null&&(c=he({inputs:{x:o},backend:t,attrs:{perm:a}}),l.push(c),i=Re(i.length,c.shape.length)),Pe("argMax",[i[0]],c.shape.length);const u=Ka(t,c,i[0],"max");return l.forEach(d=>t.disposeIntermediateTensorInfo(d)),u}const r0={kernelName:Uc,backendName:"webgl",kernelFunc:o0};function i0(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{axis:r}=s;let i=ge(r,o.shape);const a=Ie(i,o.shape.length);let c=o;const l=[];a!=null&&(c=he({inputs:{x:o},backend:t,attrs:{perm:a}}),l.push(c),i=Re(i.length,c.shape.length)),Pe("argMin",[i[0]],c.shape.length);const u=Ka(t,c,i[0],"min");return l.forEach(d=>t.disposeIntermediateTensorInfo(d)),u}const a0={kernelName:Wc,backendName:"webgl",kernelFunc:i0};const c0=Te+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return asin(x);
`,l0=V({opSnippet:c0}),u0={kernelName:Gc,backendName:"webgl",kernelFunc:l0};const d0=Te+"return log(x + sqrt(x * x + 1.0));",h0=V({opSnippet:d0}),f0={kernelName:zc,backendName:"webgl",kernelFunc:h0};const p0=Te+`
  return atan(x);
`,m0=V({opSnippet:p0}),g0={kernelName:Hc,backendName:"webgl",kernelFunc:m0};const x0=co+`
  return atan(a, b);
`,C0=`
  vec4 result = atan(a, b);
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+$t+`
  return result;
`,b0=ie({opSnippet:x0,packedOpSnippet:C0}),w0={kernelName:jc,backendName:"webgl",kernelFunc:b0};const y0=Te+`
  if ((x < -1.0) || (x > 1.0)) return NAN;
return (log(1.0 + x) - log(1.0 - x)) / 2.0;`,v0=V({opSnippet:y0}),$0={kernelName:Xc,backendName:"webgl",kernelFunc:v0};class ln{constructor(e,t,s,o=!1,r=!1){if(this.variableNames=["x"],t==="avg"&&s)throw new Error("Cannot compute positions for average pool.");const i=e.filterWidth,a=e.strideHeight,c=e.strideWidth,l=e.dilationHeight,u=e.dilationWidth,d=e.effectiveFilterHeight,h=e.effectiveFilterWidth,f=e.padInfo.top,p=e.padInfo.left;this.outputShape=e.outShape;const x=t==="avg",g=`((batch  * ${e.inHeight} + xR) * ${e.inWidth} + xC) * ${e.inChannels} + d`,m=`(xR * ${e.inWidth} + xC) * ${e.inChannels} + d`;let C="0.0";if(x||(C="-1.0 / 1e-20"),s){this.userCode=`
        const ivec2 strides = ivec2(${a}, ${c});
        const ivec2 pads = ivec2(${f}, ${p});

        void main() {
          ivec4 coords = getOutputCoords();
          int batch = coords[0];
          int d = coords[3];

          ivec2 xRCCorner = coords.yz * strides - pads;
          int xRCorner = xRCCorner.x;
          int xCCorner = xRCCorner.y;

          // max/min x(?, ?, d) to get y(yR, yC, d).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;
          float avgValue = 0.0;

          for (int wR = 0; wR < ${d};
              wR += ${l}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${h};
                wC += ${u}) {
              int xC = xCCorner + wC;

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              float value = getX(batch, xR, xC, d);

              // If a min / max value has already been found, use it. If not,
              // use the current value.
              float currMinMaxValue = mix(
                  value, minMaxValue, minMaxValueFound);
              if (value >= currMinMaxValue) {
                minMaxValue = value;
                minMaxValueFound = 1.0;
                minMaxPosition = ${o?r?g:m:`wR * ${h} + wC`};
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;return}const w="max";let y=`${t}(${t}(${t}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;t==="avg"&&(y="avgValue / max(count, 1.0)");const I=Math.floor(i/4)*4,N=i%4,E=`
      if (${x}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = ${w}(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec2 strides = ivec2(${a}, ${c});
      const ivec2 pads = ivec2(${f}, ${p});
      const float initializationValue = ${C};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xR, int xC, int d) {
        if (xC < 0 || xC >= ${e.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xR, xC, d);
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d = coords[3];

        ivec2 xRCCorner = coords.yz * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // max/min x(?, ?, d) to get y(yR, yC, d).
        // ? = to be determined
        vec4 minMaxValue = vec4(${C});
        float avgValue = 0.0;
        count = 0.0;

        for (int wR = 0; wR < ${d};
            wR += ${l}) {
          int xR = xRCorner + wR;

          if (xR < 0 || xR >= ${e.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${I}; wC += 4) {
            int xC = xCCorner + wC * ${u};

            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              getValue(batch, xR, xC + 2 * ${u}, d),
              getValue(batch, xR, xC + 3 * ${u}, d)
            );

            ${E}
          }

          int xC = xCCorner + ${I};
          if (${N===1}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              initializationValue,
              initializationValue,
              initializationValue
            );

            ${E}
          } else if (${N===2}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              initializationValue,
              initializationValue
            );

            ${E}
          } else if (${N===3}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              getValue(batch, xR, xC + 2 * ${u}, d),
              initializationValue
            );

            ${E}
          }
        }
        setOutput(${y});
      }
    `}}class uo{constructor(e,t,s,o=!1,r=!1){if(this.variableNames=["x"],t==="avg"&&s)throw new Error("Cannot compute positions for average pool.");const i=e.filterWidth,a=e.strideDepth,c=e.strideHeight,l=e.strideWidth,u=e.dilationDepth,d=e.dilationHeight,h=e.dilationWidth,f=e.effectiveFilterDepth,p=e.effectiveFilterHeight,x=e.effectiveFilterWidth,g=e.padInfo.front,m=e.padInfo.top,C=e.padInfo.left;this.outputShape=e.outShape;const w=t==="avg";let y="0.0";if(w||(y="-1.0 / 1e-20"),s){this.userCode=`
        const ivec3 strides =
            ivec3(${a}, ${c}, ${l});
        const ivec3 pads = ivec3(${g}, ${m}, ${C});

        void main() {
          ivec5 coords = getOutputCoords();
          int batch = coords.x;
          int ch = coords.u;

          ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
          int xDCorner = xCorner.x;
          int xRCorner = xCorner.y;
          int xCCorner = xCorner.z;

          // max/min x(?, ?, ?, ch) to get y(yD, yR, yC, ch).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;

          for (int wD = 0; wD < ${f};
              wD += ${u}) {
            int xD = xDCorner + wD;

            if (xD < 0 || xD >= ${e.inDepth}) {
              continue;
            }

            for (int wR = 0; wR < ${p};
                wR += ${d}) {
              int xR = xRCorner + wR;

              if (xR < 0 || xR >= ${e.inHeight}) {
                continue;
              }

              for (int wC = 0; wC < ${x};
                  wC += ${h}) {
                int xC = xCCorner + wC;

                if (xC < 0 || xC >= ${e.inWidth}) {
                  continue;
                }

                float value = getX(batch, xD, xR, xC, ch);

                // If a min / max value has already been found, use it. If not,
                // use the current value.
                float currMinMaxValue = mix(
                    value, minMaxValue, minMaxValueFound);
                if (value >= currMinMaxValue) {
                  minMaxValue = value;
                  minMaxValueFound = 1.0;
                  minMaxPosition = ${o?r?`(((batch * ${e.inDepth} + xD) * ${e.inHeight} + xR) * ${e.inWidth} + xC) * ${e.inChannels} + ch`:`((xD * ${e.inHeight} + xR) * ${e.inWidth} + xC) * ${e.inChannels} + ch`:`wD * ${p} * ${x} +
                      wR * ${x} + wC`};
                }
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;return}const I="max";let N=`${t}(${t}(${t}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;t==="avg"&&(N="avgValue / max(count, 1.0)");const E=Math.floor(i/4)*4,R=i%4,S=`
      if (${w}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = ${I}(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec3 strides =
        ivec3(${a}, ${c}, ${l});
      const ivec3 pads = ivec3(${g}, ${m}, ${C});
      const float initializationValue = ${y};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xD, int xR, int xC, int ch) {
        if (xC < 0 || xC >= ${e.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xD, xR, xC, ch);
      }

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xDCorner = xCorner.x;
        int xRCorner = xCorner.y;
        int xCCorner = xCorner.z;

        // max/min x(?, ?, ?, d) to get y(yD, yR, yC, ch).
        // ? = to be determined
        vec4 minMaxValue = vec4(${y});
        float avgValue = 0.0;
        count = 0.0;

        for (int wD = 0; wD < ${f};
            wD += ${u}) {
          int xD = xDCorner + wD;

          if (xD < 0 || xD >= ${e.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${p};
            wR += ${d}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${E}; wC += 4) {
              int xC = xCCorner + wC * ${h};

              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${h}, ch),
                getValue(batch, xD, xR, xC + 2 * ${h}, ch),
                getValue(batch, xD, xR, xC + 3 * ${h}, ch)
              );

              ${S}
            }

            int xC = xCCorner + ${E};
            if (${R===1}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                initializationValue,
                initializationValue,
                initializationValue
              );

              ${S}
            } else if (${R===2}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${h}, ch),
                initializationValue,
                initializationValue
              );

              ${S}
            } else if (${R===3}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${h}, ch),
                getValue(batch, xD, xR, xC + 2 * ${h}, ch),
                initializationValue
              );

              ${S}
            }
          }
        }
        setOutput(${N});
      }
    `}}function S0(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e;Ut(o,"avgPool");const{filterSize:r,strides:i,pad:a,dimRoundingMode:c}=s,l=1;D(Bt(i,l),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${i} and dilations '${l}'`);const u=Lt(o.shape,r,i,l,a,c);if(u.filterWidth===1&&u.filterHeight===1&&oe(u.inShape,u.outShape))return Ce({inputs:{x:o},backend:t});const d=new ln(u,"avg",!1);return t.runWebGLProgram(d,[o],"float32")}const I0={kernelName:qc,backendName:"webgl",kernelFunc:S0};function R0(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{filterSize:r,strides:i,pad:a,dimRoundingMode:c,dataFormat:l}=s,u=[1,1,1],d=fn(o.shape,r,i,u,a,c,l),h=new uo(d,"avg",!1);return t.runWebGLProgram(h,[o],"float32")}const T0={kernelName:Yc,backendName:"webgl",kernelFunc:R0};class E0{constructor(e){this.variableNames=["dy"],this.outputShape=e.inShape;const t=e.filterHeight,s=e.filterWidth,o=e.strideHeight,r=e.strideWidth,i=e.dilationHeight,a=e.dilationWidth,c=e.effectiveFilterHeight,l=e.effectiveFilterWidth,u=c-1-e.padInfo.top,d=l-1-e.padInfo.left,h=1/(t*s);this.userCode=`
      const ivec2 pads = ivec2(${u}, ${d});
      const float avgMultiplier = float(${h});

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${c};
            wR += ${i}) {
          float dyR = float(dyRCorner + wR) / ${o}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${l};
            wC+= ${a}) {
            float dyC = float(dyCCorner + wC) / ${r}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);

            dotProd += dyValue * avgMultiplier;
          }
        }
        setOutput(dotProd);
      }
    `}}class N0{constructor(e){this.variableNames=["dy"],this.outputShape=e.inShape;const t=e.filterDepth,s=e.filterHeight,o=e.filterWidth,r=e.strideDepth,i=e.strideHeight,a=e.strideWidth,c=e.dilationDepth,l=e.dilationHeight,u=e.dilationWidth,d=e.effectiveFilterDepth,h=e.effectiveFilterHeight,f=e.effectiveFilterWidth,p=d-1-e.padInfo.front,x=h-1-e.padInfo.top,g=f-1-e.padInfo.left,m=1/(t*s*o);this.userCode=`
      const ivec3 pads = ivec3(${p}, ${x}, ${g});
      const float avgMultiplier = float(${m});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, d) with pos mask(:, :, :, ch) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < ${d};
            wD += ${c}) {
          float dyD = float(dyDCorner + wD) / ${r}.0;

          if (dyD < 0.0 || dyD >= ${e.outDepth}.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < ${h};
              wR += ${l}) {
            float dyR = float(dyRCorner + wR) / ${i}.0;

            if (dyR < 0.0 || dyR >= ${e.outHeight}.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < ${f};
                wC += ${u}) {
              float dyC = float(dyCCorner + wC) / ${a}.0;

              if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);

              dotProd += dyValue * avgMultiplier;
            }
          }
        }
        setOutput(dotProd);
      }
    `}}function k0(n){const{inputs:e,backend:t,attrs:s}=n,{dy:o,input:r}=e,i=r,{filterSize:a,strides:c,pad:l,dimRoundingMode:u}=s,d=[1,1,1],h=fn(i.shape,a,c,d,l,u),f=new N0(h);return t.runWebGLProgram(f,[o],i.dtype)}const A0={kernelName:Qc,backendName:"webgl",kernelFunc:k0};function F0(n){const{inputs:e,backend:t,attrs:s}=n,{dy:o,input:r}=e,i=r;Ut([o,r],"avgPoolGrad");const{filterSize:a,strides:c,pad:l}=s,u=Lt(i.shape,a,c,1,l),d=new E0(u);return t.runWebGLProgram(d,[o],i.dtype)}const D0={kernelName:Kc,backendName:"webgl",kernelFunc:F0};function O0(n){const{inputs:e,backend:t,attrs:s}=n,{a:o,b:r}=e,{transposeA:i,transposeB:a}=s;return Bn({a:o,b:r,transposeA:i,transposeB:a,backend:t})}const P0={kernelName:Zc,backendName:"webgl",kernelFunc:O0};class _0{constructor(e,t,s,o,r,i){this.outputShape=[],this.variableNames=["x","mean","variance"],de(e,t),de(e,s);let a="0.0";o!=null&&(de(e,o),this.variableNames.push("offset"),a="getOffsetAtOutCoords()");let c="1.0";r!=null&&(de(e,r),this.variableNames.push("scale"),c="getScaleAtOutCoords()"),this.outputShape=e,this.userCode=`
      void main() {
        float x = getXAtOutCoords();
        float mean = getMeanAtOutCoords();
        float variance = getVarianceAtOutCoords();
        float offset = ${a};
        float scale = ${c};
        float inv = scale * inversesqrt(variance + float(${i}));
        setOutput(dot(vec3(x, -mean, offset), vec3(inv, inv, 1)));
      }
    `}}class L0{constructor(e,t,s,o,r,i){this.packedInputs=!0,this.packedOutput=!0,this.variableNames=["x","mean","variance"],de(e,t),de(e,s);let a="vec4(0.0)";o!=null&&(de(e,o),this.variableNames.push("offset"),a="getOffsetAtOutCoords()");let c="vec4(1.0)";r!=null&&(de(e,r),this.variableNames.push("scale"),c="getScaleAtOutCoords()"),this.outputShape=e,this.userCode=`
      void main() {
        vec4 offset = ${a};
        vec4 scale = ${c};

        vec4 x = getXAtOutCoords();
        vec4 mean = getMeanAtOutCoords();
        vec4 variance = getVarianceAtOutCoords();

        vec4 inv = scale * inversesqrt(variance + vec4(${i}));

        setOutput((x - mean) * inv + offset);
      }
    `}}const B0=({inputs:n,backend:e,attrs:t})=>{const{x:s,mean:o,variance:r,offset:i,scale:a}=n;D(o.shape.length===r.shape.length,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),D(i==null||o.shape.length===i.shape.length,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),D(a==null||o.shape.length===a.shape.length,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");let{varianceEpsilon:c}=t;c==null&&(c=.001);const l=[s,o,r];let u=null;i!=null&&(u=i.shape,l.push(i));let d=null;a!=null&&(d=a.shape,l.push(a));const h=v().getBool("WEBGL_PACK_NORMALIZATION")?new L0(s.shape,o.shape,r.shape,u,d,c):new _0(s.shape,o.shape,r.shape,u,d,c);return e.runWebGLProgram(h,l,l[0].dtype)},M0={kernelName:Pl,backendName:"webgl",kernelFunc:B0};class V0{constructor(e){this.variableNames=["source"],this.outputShape=e,this.rank=e.length;const t=z(this.rank);this.customUniforms=[{name:"start",arrayIndex:this.rank,type:"int"}];const s=U0(this.rank);let o;const r=e.map((i,a)=>`sourceLoc.${ks[a]} = start[${a}] + coords.${ks[a]};`);o=`
        ${t} sourceLoc;
        ${t} coords = getOutputCoords();
        ${r.join(`
`)}
      `,this.userCode=`
      void main() {
        ${o}
        setOutput(getSource(${s}));
      }
    `}}const ks=["x","y","z","w","u","v"];function U0(n){if(n===1)return"sourceLoc";if(n<=6)return ks.slice(0,n).map(e=>"sourceLoc."+e).join(",");throw Error(`Slicing for rank ${n} is not yet supported`)}class W0{constructor(e){this.variableNames=["source"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=e,this.rank=e.length,this.customUniforms=[{name:"start",arrayIndex:this.rank,type:"int"}];const t=z(this.rank),s=ue("coords",this.rank),o=ue("sourceLoc",this.rank),r=this.rank===1?"sourceLoc":`vec2(${o.slice(-2).join()})`,i=`getChannel(getSource(${o.join()}), ${r})`,a=`
      result.x = ${i};
      if (++${s[this.rank-1]} < ${e[this.rank-1]}) {
        ++${o[this.rank-1]};
        result.y = ${i};
        --${o[this.rank-1]};
      }
    `,c=this.rank===1?"":`
      --${s[this.rank-1]};
      if (++${s[this.rank-2]} < ${e[this.rank-2]}) {
        ++${o[this.rank-2]};
        result.z = ${i};
        if (++${s[this.rank-1]} < ${e[this.rank-1]}) {
          ++${o[this.rank-1]};
          result.w = ${i};
        }
      }
    `,l=this.rank<=4?`sourceLoc = coords +
            ${t}(${e.map((u,d)=>`start[${d}]`).join()});`:e.map((u,d)=>`${o[d]} = ${s[d]} + start[${d}];`).join(`
`);this.userCode=`
      void main() {
        ${t} coords = getOutputCoords();
        ${t} sourceLoc;
        ${l}
        vec4 result = vec4(0.);
        ${a}
        ${c}
        setOutput(result);
      }
    `}}function G0(n,e,t,s){const o=s.texData.get(n.dataId),r=s.makeTensorInfo(t,n.dtype),i=s.texData.get(r.dataId);Object.assign(i,o),i.refCount=1,i.shape=t,i.dtype=n.dtype;let a=ci(e,se(n.shape));o.slice&&(a+=o.slice.flatOffset),i.slice={flatOffset:a,origDataId:o.slice&&o.slice.origDataId||n.dataId};const c=s.dataRefCount.get(i.slice.origDataId)||1;return s.dataRefCount.set(i.slice.origDataId,c+1),r}function qt(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{begin:r,size:i}=s,[a,c]=Df(o,r,i);if(Af(o,a,c),F(c)===0)return t.makeTensorInfo(c,o.dtype,[]);if(t.shouldExecuteOnCPU([o])||o.dtype==="string"){const d=t.texData.get(o.dataId),h=Og(d.values,a,c,o.shape,o.dtype);return t.makeTensorInfo(c,o.dtype,h)}const{isPacked:l}=t.texData.get(o.dataId),u=ai(o.shape,a,c);if(l||!u){const d=v().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new W0(c):new V0(c),h=[a];return t.runWebGLProgram(d,[o],o.dtype,h)}return t.uploadToGPU(o.dataId),G0(o,a,c,t)}const z0={kernelName:Hu,backendName:"webgl",kernelFunc:qt};const H0=n=>{const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{blockShape:r,crops:i}=s;D(o.shape.length<=4,()=>"batchToSpaceND for rank > 4 with a WebGL backend not implemented yet");const a=r.reduce((C,w)=>C*w),c=qs(o.shape,r,a),l=Ks(c.length,r.length),u=Ys(o.shape,r,a),d=mi(i,r.length),h=gi(u,i,r.length),f=[],p=k({inputs:{x:o},backend:t,attrs:{shape:c}}),x=he({inputs:{x:p},backend:t,attrs:{perm:l}}),g=k({inputs:{x},backend:t,attrs:{shape:u}}),m=qt({inputs:{x:g},backend:t,attrs:{begin:d,size:h}});return f.push(p),f.push(x),f.push(g),f.forEach(C=>t.disposeIntermediateTensorInfo(C)),m},X0={kernelName:Jc,backendName:"webgl",kernelFunc:H0};function j0(n){const{inputs:e,backend:t,attrs:s}=n,{x:o,weights:r}=e,{size:i}=s,a=t.readSync(o.dataId),c=t.readSync(r.dataId),l=_a(a,c,r.dtype,r.shape,i);return t.makeTensorInfo([i],r.dtype,l)}const q0={kernelName:el,backendName:"webgl",kernelFunc:j0};const K0=`
  int r = int(a.r) & int(b.r);
  int g = int(a.g) & int(b.g);
  int rb = int(a.b) & int(b.b);
  int ra = int(a.a) & int(b.a);
  return vec4(r, g, rb, ra);
`,Y0=`
  return float(int(a.r) & int(b.r));
`;function Q0(n){const{inputs:e,backend:t}=n,{a:s,b:o}=e,r=v().getBool("WEBGL_PACK_BINARY_OPERATIONS"),i=v().getNumber("WEBGL_VERSION");if(t.shouldExecuteOnCPU([s,o])||i===1){const c=t.texData.get(s.dataId).values,l=t.texData.get(o.dataId).values,[u,d]=og(s.shape,o.shape,c,l,s.dtype),h=t.makeTensorInfo(d,s.dtype),f=t.texData.get(h.dataId);return f.values=u,h}let a;return r?a=new Xt(K0,s.shape,o.shape,!1):a=new gt(Y0,s.shape,o.shape),t.runWebGLProgram(a,[s,o],s.dtype)}const Z0={kernelName:tl,backendName:"webgl",kernelFunc:Q0};function J0(n){const{inputs:e,backend:t}=n,{s0:s,s1:o}=e,r=t.readSync(s.dataId),i=t.readSync(o.dataId),a=de(Array.from(r),Array.from(i));return t.makeTensorInfo([a.length],"int32",Int32Array.from(a))}const eC={kernelName:nl,backendName:"webgl",kernelFunc:J0};const tC="return float(a != b);",Ya=ie({opSnippet:tC,cpuKernelImpl:Ig,dtype:"bool"}),nC={kernelName:mu,backendName:"webgl",kernelFunc:Ya};function xn(n){const{inputs:e,backend:t}=n,{input:s}=e,o=t.texData.get(s.dataId);return Ce({inputs:{x:o.complexTensorInfos.real},backend:t})}const sC={kernelName:Nu,backendName:"webgl",kernelFunc:xn};const oC="return float(int(x));";function rC(n,e){const t=new Le(n.shape,oC),s=e.runWebGLProgram(t,[n],"int32");return{dataId:s.dataId,shape:s.shape,dtype:s.dtype}}function As(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{dtype:r}=s;if(r==="complex64"){if(o.dtype==="complex64")return Ce({inputs:{x:o},backend:t});const i=vs(o.shape),a=As({inputs:{x:o},backend:t,attrs:{dtype:"float32"}}),c=Je({inputs:{real:a,imag:i},backend:t});return i.dispose(),t.disposeIntermediateTensorInfo(a),c}if(o.dtype==="complex64"){const i=xn({inputs:{input:o},backend:t}),a=As({inputs:{x:i},backend:t,attrs:{dtype:r}});return t.disposeIntermediateTensorInfo(i),a}if(!Ic(o.dtype,r)){const i=Ce({inputs:{x:o},backend:t});return{dataId:i.dataId,shape:i.shape,dtype:r}}if(t.shouldExecuteOnCPU([o])){const i=t.texData.get(o.dataId).values,[a,c,l]=rg(i,o.shape,o.dtype,r);return t.makeTensorInfo(a,c,l)}if(r==="int32")return rC(o,t);if(r==="bool"){const i=t.makeTensorInfo([],"bool",ct("bool",1)),c=Ya({inputs:{a:o,b:i},backend:t});return t.disposeIntermediateTensorInfo(i),c}throw new Error(`Error in Cast: failed to cast ${o.dtype} to ${r}`)}const iC={kernelName:Bs,backendName:"webgl",kernelFunc:As};const Jo="return ceil(x);",aC=V({opSnippet:Jo,packedOpSnippet:Jo,cpuKernelImpl:ig}),cC={kernelName:sl,backendName:"webgl",kernelFunc:aC};class lC{constructor(e){this.variableNames=["A"],this.customUniforms=[{name:"minVal",type:"float"},{name:"maxVal",type:"float"}],this.outputShape=e,this.userCode=`

      void main() {
        float value = getAAtOutCoords();
        if (isnan(value)) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, minVal, maxVal));
      }
    `}}class uC{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"minVal",type:"float"},{name:"maxVal",type:"float"}],this.outputShape=e,this.userCode=`
      void main() {
        vec4 value = getAAtOutCoords();

        if (any(isnan(value))) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, vec4(minVal), vec4(maxVal)));
      }
    `}}function dC(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{clipValueMin:r,clipValueMax:i}=s;let a;v().getBool("WEBGL_PACK_CLIP")?a=new uC(o.shape):a=new lC(o.shape);const c=[[r],[i]];return t.runWebGLProgram(a,[o],o.dtype,c)}const hC={kernelName:ol,backendName:"webgl",kernelFunc:dC};class fC{constructor(e){this.variableNames=["real","imag"],this.outputShape=e,this.userCode=`
      void main() {
        float re = abs(getRealAtOutCoords());
        float im = abs(getImagAtOutCoords());
        float mx = max(re, im);

        // sadly the length function in glsl is not underflow-safe
        // (at least not on Intel GPUs). So the safe solution is
        // to ensure underflow-safety in all cases.
        setOutput(
          mx == 0.0 ? 0.0 : mx * length(vec2(1, min(re, im)/mx))
        );
      }
    `}}function er(n,e){return{dataId:e.dataId,dtype:e.dtype,shape:n.shape}}function pC(n){const{inputs:e,backend:t}=n,{x:s}=e,o=t.texData.get(s.dataId),r=new fC(s.shape),i=[er(s,o.complexTensorInfos.real),er(s,o.complexTensorInfos.imag)];return t.runWebGLProgram(r,i,i[0].dtype)}const mC={kernelName:br,backendName:"webgl",kernelFunc:pC};class gC{constructor(e){this.outputShape=[],this.outputShape=ft(e,1),this.variableNames=e.map((i,a)=>`T${a}`);const t=new Array(e.length-1);t[0]=e[0][1];for(let i=1;i<t.length;i++)t[i]=t[i-1]+e[i][1];const s=[`if (yC < ${t[0]}) setOutput(getT0(yR, yC));`];for(let i=1;i<t.length;i++){const a=t[i-1];s.push(`else if (yC < ${t[i]}) setOutput(getT${i}(yR, yC-${a}));`)}const o=t.length,r=t[t.length-1];s.push(`else setOutput(getT${o}(yR, yC-${r}));`),this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int yR = coords.x;
        int yC = coords.y;

        ${s.join(`
        `)}
      }
    `}}class xC{constructor(e,t){this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[],this.outputShape=ft(e,t);const s=this.outputShape,o=s.length,r=z(o),i=ue("coords",o),a=["x","y","z","w","u","v"].slice(0,o);this.variableNames=e.map((x,g)=>`T${g}`);const c=new Array(e.length-1);c[0]=e[0][t];for(let x=1;x<c.length;x++)c[x]=c[x-1]+e[x][t];const l=a[t],u=a.slice(-2),d=a.join();let h=`if (${l} < ${c[0]}) {
        return getChannel(
            getT0(${d}), vec2(${u.join()}));
        }`;for(let x=1;x<c.length;x++){const g=c[x-1];h+=`
        if (${l} < ${c[x]}  && ${l} >= ${c[x-1]}) {
          return getChannel(
            getT${x}(${Sn(a,l,g)}),
            vec2(${Sn(u,l,g)}));
        }`}const f=c.length,p=c[c.length-1];h+=`
        return getChannel(
          getT${f}(${Sn(a,l,p)}),
          vec2(${Sn(u,l,p)}));`,this.userCode=`
      float getValue(${a.map(x=>"int "+x)}) {
        ${h}
      }

      void main() {
        ${r} coords = getOutputCoords();
        vec4 result = vec4(getValue(${i}), 0., 0., 0.);

        ${i[o-1]} = ${i[o-1]} + 1;
        if (${i[o-1]} < ${s[o-1]}) {
          result.g = getValue(${i});
        }

        ${i[o-2]} = ${i[o-2]} + 1;
        if (${i[o-2]} < ${s[o-2]}) {
          result.a = getValue(${i});
        }

        ${i[o-1]} = ${i[o-1]} - 1;
        if (${i[o-2]} < ${s[o-2]} &&
            ${i[o-1]} < ${s[o-1]}) {
          result.b = getValue(${i});
        }
        setOutput(result);
      }
    `}}function Sn(n,e,t){const s=n.indexOf(e);return n.map((r,i)=>i===s?`${r} - ${t}`:r).join()}function Qn(n){const{inputs:e,backend:t}=n,{input:s}=e,o=t.texData.get(s.dataId);return Ce({inputs:{x:o.complexTensorInfos.imag},backend:t})}const CC={kernelName:Ul,backendName:"webgl",kernelFunc:Qn};function sn(n,e,t){const s=n[0].dtype;if(s==="complex64"){const f=n.map(C=>xn({inputs:{input:C},backend:t})),p=n.map(C=>Qn({inputs:{input:C},backend:t})),x=sn(f,e,t),g=sn(p,e,t),m=Je({inputs:{real:x,imag:g},backend:t});return f.forEach(C=>t.disposeIntermediateTensorInfo(C)),p.forEach(C=>t.disposeIntermediateTensorInfo(C)),t.disposeIntermediateTensorInfo(x),t.disposeIntermediateTensorInfo(g),m}let o=t.shouldExecuteOnCPU(n);if(s==="string"&&(o=!0),o){const f=n.map(y=>{const N=[-1,F(y.shape.slice(e))];return k({inputs:{x:y},backend:t,attrs:{shape:N}})}),p=f.map(y=>({vals:t.readSync(y.dataId),shape:y.shape})),x=ft(f.map(y=>y.shape),1),g=f[0].shape[0]===1,m=ag(p,x,s,g),C=ft(n.map(y=>y.shape),e),w=t.makeTensorInfo(C,s,m);return f.forEach(y=>t.disposeIntermediateTensorInfo(y)),w}const r=n.filter(f=>F(f.shape)>0),i=v().getBool("WEBGL_PACK_ARRAY_OPERATIONS")&&r[0].shape.length>1;if(r.length===1){const f=i?new Le(n[0].shape,je):new Ke(n[0].shape,je);return t.runWebGLProgram(f,n,s)}const a=v().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER");if(r.length>a){const f=[];for(let x=0;x<r.length;x+=a){const g=r.slice(x,x+a);f.push(sn(g,e,t))}const p=sn(f,e,t);for(const x of f)t.disposeIntermediateTensorInfo(x);return p}if(i){const f=new xC(r.map(p=>p.shape),e);return t.runWebGLProgram(f,r,s)}const{tensors2D:c,outShape:l}=bC(r,e,t),u=new gC(c.map(f=>f.shape)),d=t.runWebGLProgram(u,c,s);c.forEach(f=>t.disposeIntermediateTensorInfo(f));const h=k({inputs:{x:d},attrs:{shape:l},backend:t});return t.disposeIntermediateTensorInfo(d),h}function bC(n,e,t){const s=ft(n.map(r=>r.shape),e);return{tensors2D:n.map(r=>k({inputs:{x:r},attrs:{shape:[-1,F(r.shape.slice(e))]},backend:t})),outShape:s}}function Qa(n){const{inputs:e,backend:t,attrs:s}=n,{axis:o}=s,r=ge(o,e[0].shape)[0],i=e.map(l=>l.shape);li(i,r);const a=ft(e.map(l=>l.shape),r);if(F(a)===0)return t.makeTensorInfo(a,e[0].dtype,[]);const c=e.filter(l=>F(l.shape)>0);return c.length===1?Ce({inputs:{x:c[0]},backend:t}):sn(c,r,t)}const wC={kernelName:rl,backendName:"webgl",kernelFunc:Qa};class Za{constructor(e,t=!1,s=null,o=!1,r=!1){this.variableNames=["x","W"],this.outputShape=e.outShape;const i=e.padInfo.top,a=e.padInfo.left,c=e.strideHeight,l=e.strideWidth,u=e.dilationHeight,d=e.dilationWidth,h=e.filterHeight,f=e.filterWidth,p=Math.floor(e.inChannels/4)*4,x=e.inChannels%4,g=e.dataFormat==="channelsLast",m=g?1:2,C=g?2:3,w=g?3:1;let y="",I="";s&&(o?y=`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${s}
        }`:r?y=`float activation(float a) {
          float b = getLeakyreluAlphaAtOutCoords();
          ${s}
        }`:y=`
          float activation(float x) {
            ${s}
          }
        `,I="result = activation(result);");const N=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),o&&this.variableNames.push("preluActivationWeights"),r&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${y}

      const ivec2 strides = ivec2(${c}, ${l});
      const ivec2 pads = ivec2(${i}, ${a});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d2 = coords[${w}];

        ivec2 xRCCorner =
            ivec2(coords[${m}], coords[${C}]) * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${h}; wR++) {
          int xR = xRCorner + wR * ${u};

          if (xR < 0 || xR >= ${e.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${f}; wC++) {
            int xC = xCCorner + wC * ${d};

            if (xC < 0 || xC >= ${e.inWidth}) {
              continue;
            }

            for (int d1 = 0; d1 < ${p}; d1 += 4) {
              vec4 wValues = vec4(
                getW(wR, wC, d1, d2),
                getW(wR, wC, d1 + 1, d2),
                getW(wR, wC, d1 + 2, d2),
                getW(wR, wC, d1 + 3, d2)
              );

              if (${g}) {
                vec4 xValues = vec4(
                  getX(batch, xR, xC, d1),
                  getX(batch, xR, xC, d1 + 1),
                  getX(batch, xR, xC, d1 + 2),
                  getX(batch, xR, xC, d1 + 3)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec4 xValues = vec4(
                  getX(batch, d1, xR, xC),
                  getX(batch, d1 + 1, xR, xC),
                  getX(batch, d1 + 2, xR, xC),
                  getX(batch, d1 + 3, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }
            }

            if (${x===1}) {

              if (${g}) {
                dotProd +=
                    getX(batch, xR, xC, ${p}) *
                    getW(wR, wC, ${p}, d2);
              } else {
                dotProd +=
                    getX(batch, ${p}, xR, xC) *
                    getW(wR, wC, ${p}, d2);
              }

            } else if (${x===2}) {
              vec2 wValues = vec2(
                getW(wR, wC, ${p}, d2),
                getW(wR, wC, ${p} + 1, d2)
              );

              if (${g}) {
                vec2 xValues = vec2(
                  getX(batch, xR, xC, ${p}),
                  getX(batch, xR, xC, ${p} + 1)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec2 xValues = vec2(
                  getX(batch, ${p}, xR, xC),
                  getX(batch, ${p} + 1, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            } else if (${x===3}) {
              vec3 wValues = vec3(
                getW(wR, wC, ${p}, d2),
                getW(wR, wC, ${p} + 1, d2),
                getW(wR, wC, ${p} + 2, d2)
              );

              if (${g}) {
                vec3 xValues = vec3(
                  getX(batch, xR, xC, ${p}),
                  getX(batch, xR, xC, ${p} + 1),
                  getX(batch, xR, xC, ${p} + 2)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec3 xValues = vec3(
                  getX(batch, ${p}, xR, xC),
                  getX(batch, ${p} + 1, xR, xC),
                  getX(batch, ${p} + 2, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            }
          }
        }

        float result = dotProd;
        ${N}
        ${I}
        setOutput(result);
      }
    `}}class yC{constructor(e){this.variableNames=["x","W"],this.outputShape=e.outShape;const t=e.padInfo.front,s=e.padInfo.top,o=e.padInfo.left,r=e.strideDepth,i=e.strideHeight,a=e.strideWidth,c=e.dilationDepth,l=e.dilationHeight,u=e.dilationWidth,d=e.filterDepth,h=e.filterHeight,f=e.filterWidth,p=Math.floor(e.inChannels/4)*4,x=e.inChannels%4;this.userCode=`
      const ivec3 strides = ivec3(${r}, ${i}, ${a});
      const ivec3 pads = ivec3(${t}, ${s}, ${o});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d2 = coords.u;

        ivec3 xFRCCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xFCorner = xFRCCorner.x;
        int xRCorner = xFRCCorner.y;
        int xCCorner = xFRCCorner.z;

        // Convolve x(?, ?, ?, d1) with w(:, :, :, d1, d2) to get
        // y(yF, yR, yC, d2). ? = to be determined. : = across all
        // values in that axis.
        float dotProd = 0.0;
        for (int wF = 0; wF < ${d}; wF++) {
          int xF = xFCorner + wF * ${c};

          if (xF < 0 || xF >= ${e.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${h}; wR++) {
            int xR = xRCorner + wR * ${l};

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${f}; wC++) {
              int xC = xCCorner + wC * ${u};

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              for (int d1 = 0; d1 < ${p}; d1 += 4) {
                vec4 xValues = vec4(
                  getX(batch, xF, xR, xC, d1),
                  getX(batch, xF, xR, xC, d1 + 1),
                  getX(batch, xF, xR, xC, d1 + 2),
                  getX(batch, xF, xR, xC, d1 + 3)
                );
                vec4 wValues = vec4(
                  getW(wF, wR, wC, d1, d2),
                  getW(wF, wR, wC, d1 + 1, d2),
                  getW(wF, wR, wC, d1 + 2, d2),
                  getW(wF, wR, wC, d1 + 3, d2)
                );

                dotProd += dot(xValues, wValues);
              }

              if (${x===1}) {
                dotProd +=
                  getX(batch, xF, xR, xC, ${p}) *
                  getW(wF, wR, wC, ${p}, d2);
              } else if (${x===2}) {
                vec2 xValues = vec2(
                  getX(batch, xF, xR, xC, ${p}),
                  getX(batch, xF, xR, xC, ${p} + 1)
                );
                vec2 wValues = vec2(
                  getW(wF, wR, wC, ${p}, d2),
                  getW(wF, wR, wC, ${p} + 1, d2)
                );
                dotProd += dot(xValues, wValues);
              } else if (${x===3}) {
                vec3 xValues = vec3(
                  getX(batch, xF, xR, xC, ${p}),
                  getX(batch, xF, xR, xC, ${p} + 1),
                  getX(batch, xF, xR, xC, ${p} + 2)
                );
                vec3 wValues = vec3(
                  getW(wF, wR, wC, ${p}, d2),
                  getW(wF, wR, wC, ${p} + 1, d2),
                  getW(wF, wR, wC, ${p} + 2, d2)
                );
                dotProd += dot(xValues, wValues);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}}class Ja{constructor(e,t=!1,s=null,o=!1,r=!1){this.variableNames=["x","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=e.outShape,this.enableShapeUniforms=ce(this.outputShape.length);const i=e.padInfo.left,a=e.strideWidth,c=e.dilationWidth,l=e.filterHeight,u=e.filterWidth,d=u;let h=`
       int xR; int xC; int xCOffset;
       vec4 wTexel; vec4 previous; vec4 final;`;for(let g=0;g<u;g++)h+=`
           vec4 xTexelC${g*2};
           int xTexelC${g*2}Ready;
           vec4 xTexelC${g*2+1};
           int xTexelC${g*2+1}Ready;
           vec4 xC${g};`;h+=`
     for (int r = 0; r < ${l}; r++) {
      for (int d1 = 0; d1 < ${e.inChannels}; d1 += 2) {
       `;for(let g=0;g<u;g++)h+=`
           xTexelC${g*2} = vec4(0.0);
           xTexelC${g*2}Ready = 0;
           xTexelC${g*2+1} = vec4(0.0);
           xTexelC${g*2+1}Ready = 0;
           xC${g} = vec4(0.0);`;h+=`
         xR = xRCorner + r * dilations[0];
         if (xR >=0 && xR < inDims[0]) {
       `;for(let g=0;g<(d+1)/2;g++){const m=g*2;if(h+=`
           xC = xCCorner + ${m*c};
           `,a===1){if(m<u&&(i%2===1?(h+=`
                 xCOffset = xC + 1;
                 if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${m}Ready == 0) {
                   xTexelC${m} = getX(batch, xR, xCOffset, d1);

                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${m}.zw = vec2(0.0);
                   }
                   xTexelC${m}Ready = 1;
                 }
               `,c===1&&m>0?h+=`
                 xC${m} = vec4(xTexelC${m-2}.zw, xTexelC${m}.xy);
                 `:h+=`
                   xCOffset = xC + 1 - 2;

                   if (xCOffset >= 0 && xCOffset < inDims[1]) {
                     previous = getX(batch, xR, xCOffset, d1);

                     // Need to manually clear unused channels in case
                     // we're reading from recycled texture.
                     if (xCOffset + 1 >= inDims[1]) {
                       previous.zw = vec2(0.0);
                     }

                     xC${m} = vec4(previous.zw, xTexelC${m}.xy);
                   } else {
                     xC${m} = vec4(0.0, 0.0, xTexelC${m}.xy);
                   }
                   `):h+=`
                 if (xC >= 0 && xC < inDims[1] && xTexelC${m}Ready == 0) {
                   xTexelC${m} = getX(batch, xR, xC, d1);
                   if (xC + 1 >= inDims[1]) {
                     xTexelC${m}.zw = vec2(0.0);
                   }
                   xTexelC${m}Ready = 1;
                 }

                 xC${m} = xTexelC${m};
                 `,m+1<u)){const C=i%2===0?Ds(c):c;c%2===0&&i%2===1||c%2!==0&&i%2!==1?(h+=`
                   xCOffset = xC + imod(pads[1], 2) + ${C};

                   if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${m+1}Ready == 0) {
                     xTexelC${m+1} = getX(batch, xR, xCOffset, d1);

                     // Need to manually clear unused channels in case
                     // we're reading from recycled texture.
                     if (xCOffset + 1 >= inDims[1]) {
                       xTexelC${m+1}.zw = vec2(0.0);
                     }
                     xTexelC${m+1}Ready = 1;
                   }
                   `,c>1?h+=`
                     xCOffset -= 2;
                     if (xCOffset >= 0 && xCOffset < inDims[1]) {
                      previous = getX(batch, xR, xCOffset, d1);
                      xC${m+1} = vec4(previous.zw, xTexelC${m+1}.xy);
                     } else {
                      xC${m+1} = vec4(0.0, 0.0, xTexelC${m+1}.xy);
                     }
                     `:h+=`
                     xC${m+1} = vec4(xTexelC${m}.zw, xTexelC${m+1}.xy);
                     `):C===1?h+=`
                     xC${m+1} = xTexelC${m};
                     `:h+=`
                     xCOffset = xC + ${C};

                     if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${m+1}Ready == 0) {
                       xTexelC${m+1} = getX(batch, xR, xCOffset, d1);
                       if (xCOffset + 1 >= inDims[1]) {
                         xTexelC${m+1}.zw = vec2(0.0);
                       }
                       xTexelC${m+1}Ready = 1;
                     }

                     xC${m+1} = xTexelC${m+1};
                     `}}else m<u&&(i%2===1?(h+=`
                 xCOffset = xC + 1 - strides[1];
                 if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${m}Ready == 0) {
                   xTexelC${m} = getX(batch, xR, xCOffset, d1);
                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${m}.zw = vec2(0.0);
                   }
                   xTexelC${m}Ready = 1;
                 }

                 if(xC + 1 >= 0 && xC + 1 < inDims[1] && xTexelC${m+1}Ready == 0) {
                   xTexelC${m+1} = getX(batch, xR, xC + 1, d1);
                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xC + 2 >= inDims[1]) {
                     xTexelC${m+1}.zw = vec2(0.0);
                   }
                   xTexelC${m+1}Ready = 1;
                 }

                 xC${m} = vec4(xTexelC${m}.zw, xTexelC${m+1}.zw);
               `,m+1<u&&(h+=`
                   final = vec4(0.0);
                   xCOffset = xC + 1 + strides[1];
                   if(xCOffset >= 0 && xCOffset < inDims[1]) {
                     final = getX(batch, xR, xCOffset, d1);
                   }
                   xC${m+1} = vec4(xTexelC${m+1}.xy, final.xy);
                 `)):(h+=`
                 if(xC >= 0 && xC < inDims[1] && xTexelC${m}Ready == 0) {
                   xTexelC${m} = getX(batch, xR, xC, d1);
                   if (xC + 1 >= inDims[1]) {
                     xTexelC${m}.zw = vec2(0.0);
                   }
                   xTexelC${m}Ready = 1;
                 }

                 xCOffset = xC + strides[1];
                 if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${m+1}Ready == 0) {
                   xTexelC${m+1} = getX(batch, xR, xCOffset, d1);
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${m+1}.zw = vec2(0.);
                   }
                   xTexelC${m+1}Ready = 1;
                 }

                 xC${m} = vec4(
                   xTexelC${m}.xy, xTexelC${m+1}.xy);
               `,m+1<u&&(h+=`
                   xC${m+1} = vec4(xTexelC${m}.zw, xTexelC${m+1}.zw);
                 `)));m<u&&(h+=`
             wTexel = getW(r, ${m}, d1, d2);
             dotProd += xC${m}.xxzz * vec4(wTexel.xy, wTexel.xy);
             if(d1 + 1 < ${e.inChannels}) {
               dotProd += xC${m}.yyww * vec4(wTexel.zw, wTexel.zw);
             }
           `,m+1<u&&(h+=`
               wTexel = getW(r, ${m+1}, d1, d2);
               dotProd += xC${m+1}.xxzz * vec4(wTexel.xy, wTexel.xy);
               if(d1 + 1 < ${e.inChannels}) {
                 dotProd += xC${m+1}.yyww * vec4(wTexel.zw, wTexel.zw);
               }
             `))}h+=`
     }
   `,h+=`
     }
   `,h+=`
     }
   `;let f="",p="";s&&(o?f=`vec4 activation(vec4 a) {
           vec4 b = getPreluActivationWeightsAtOutCoords();
           ${s}
         }`:r?f=`vec4 activation(vec4 a) {
           vec4 b = getLeakyreluAlphaAtOutCoords();
           ${s}
         }`:f=`vec4 activation(vec4 x) {
           ${s}
         }`,p="result = activation(result);");const x=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),o&&this.variableNames.push("preluActivationWeights"),r&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
       ${f}

       void main() {
         ivec4 coords = getOutputCoords();
         int batch = coords.x;
         ivec2 xRCCorner = coords.yz * strides - pads;
         int d2 = coords.w;
         int xRCorner = xRCCorner.x;
         int xCCorner = xRCCorner.y;

         //intialize dotProd with a small epsilon seems to reduce GPU accuracy loss.
         vec4 dotProd = vec4(0.000000000000001);

         ${h}

         vec4 result = dotProd - vec4(0.000000000000001);
         ${x}
         ${p}
         setOutput(result);
       }
     `}}class vC{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"inputShape",type:"ivec4"},{name:"pad",type:"ivec2"},{name:"stride",type:"ivec2"},{name:"dilation",type:"ivec2"},{name:"inChannels",type:"int"},{name:"itemsPerBlockRow",type:"int"},{name:"outWidth",type:"int"}],this.outputShape=e,this.enableShapeUniforms=ce(this.outputShape.length);const{dataFormat:s}=t,o=pe(),r=s==="channelsLast",i=r?1:2,a=r?2:3,c=this.enableShapeUniforms?"if(blockIndex < outShape[2] && pos < outShape[1]) {":`if(blockIndex < ${e[2]} && pos < ${e[1]}) {`;let l="";for(let u=0;u<=1;u++)for(let d=0;d<=1;d++)l+=`
          blockIndex = rc.z + ${d};
          pos = rc.y + ${u};

          ${c}
            offsetY = int(blockIndex / outWidth) * stride[0] - pad[0];
            d0 = offsetY + dilation[0] * (pos / itemsPerBlockRow);

            if(d0 < inputShape[${i}] && d0 >= 0) {
              // Use custom imod instead mod. On Intel GPU, mod may generate
              // unexpected value.
              // https://github.com/tensorflow/tfjs/issues/5447
              offsetX = imod(blockIndex, outWidth) * stride[1] - pad[1];
              d1 = offsetX + dilation[1] * (imod(pos, itemsPerBlockRow) /
                  inChannels);

              if(d1 < inputShape[${a}] && d1 >= 0) {

                ch = imod(pos, inChannels);

                if (${r}) {
                  innerDims = vec2(d1, ch);
                  result[${u*2+d}] = getChannel(
                    getA(rc.x, d0, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                } else {
                  innerDims = vec2(d0, d1);
                  result[${u*2+d}] = getChannel(
                    getA(rc.x, ch, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                }
              }
            }
          }
        `;this.userCode=`
      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0);

        int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
        vec2 innerDims;

        ${l}

        ${o.output} = result;
      }
    `}}function Mn(n,e){const t=n.length;return t>=3?e?[...n.slice(0,-3),n[t-3]*n[t-2],n[t-1]]:[...n.slice(0,-3),n[t-3],n[t-2]*n[t-1]]:!e&&t===1&&n[0]>1?[n[0],1]:null}function ec({x:n,filter:e,convInfo:t,backend:s,bias:o=null,preluActivationWeights:r=null,leakyreluAlpha:i=0,activation:a=null}){const c=n.shape,l=s.texData.get(n.dataId),u=t.inChannels,d=c[0]*c[1]*c[2],h=t.outChannels,f=t.dataFormat==="channelsLast",p=!1,x=!1;let g;const m=[];if(r!=null){const y=Mn(r.shape,f);y!=null&&(r=k({inputs:{x:r},backend:s,attrs:{shape:y}}),m.push(r))}if(o!=null){const y=Mn(o.shape,f);y!=null&&(o=k({inputs:{x:o},backend:s,attrs:{shape:y}}),m.push(o))}if(!((d===1||h===1)&&u>Xa)&&l.isPacked&&f&&l.texture!=null&&c[2]%2!==0&&oe(l.shape.slice(-3),c.slice(-3))){const y=c[0]*c[1]*(c[2]+1),I={dataId:n.dataId,shape:[1,y,t.inChannels],dtype:n.dtype},N=l.shape;l.shape=l.shape.slice(),l.shape[l.shape.length-2]++,D(an(l.shape,I.shape),()=>`packed reshape ${l.shape} to ${I.shape} isn't free`);const E=k({inputs:{x:e},backend:s,attrs:{shape:[1,t.inChannels,t.outChannels]}});m.push(E);const R=Bn({a:I,b:E,backend:s,transposeA:p,transposeB:x,bias:o,activation:a,preluActivationWeights:r,leakyreluAlpha:i}),S=s.texData.get(R.dataId);D(S.isPacked,()=>"batchMatMul result is expected to be packed"),l.shape=N,S.shape=t.outShape,g=Ce({inputs:{x:R},backend:s}),g.shape=t.outShape,m.push(R)}else{const y=t.outHeight*t.outWidth,I=k({inputs:{x:n},backend:s,attrs:{shape:f?[t.batchSize,y,t.inChannels]:[t.batchSize,t.inChannels,y]}}),N=k({inputs:{x:e},backend:s,attrs:{shape:[1,t.inChannels,t.outChannels]}}),E=Bn({a:f?I:N,b:f?N:I,transposeA:!f,transposeB:x,backend:s,bias:o,activation:a,preluActivationWeights:r,leakyreluAlpha:i});g=k({inputs:{x:E},backend:s,attrs:{shape:t.outShape}}),m.push(I),m.push(N),m.push(E)}for(const y of m)s.disposeIntermediateTensorInfo(y);return g}function tc({x:n,filter:e,convInfo:t,backend:s,bias:o=null,preluActivationWeights:r=null,leakyreluAlpha:i=0,activation:a=null}){const{filterWidth:c,filterHeight:l,inChannels:u,outWidth:d,outHeight:h,dataFormat:f}=t,p=f==="channelsLast",x=c*l*u,g=h*d,m=[t.batchSize,x,g],C=!0,w=!1,y=[];if(r!=null){const W=Mn(r.shape,p);W!=null&&(r=k({inputs:{x:r},backend:s,attrs:{shape:W}}),y.push(r))}if(o!=null){const W=Mn(o.shape,p);W!=null&&(o=k({inputs:{x:o},backend:s,attrs:{shape:W}}),y.push(o))}const I=k({inputs:{x:e},backend:s,attrs:{shape:[1,x,F(e.shape)/x]}});y.push(I);const N=new vC(m,t),E=[n.shape,[t.padInfo.top,t.padInfo.left],[t.strideHeight,t.strideWidth],[t.dilationHeight,t.dilationWidth],[t.inChannels],[t.filterWidth*t.inChannels],[t.outWidth]],R=s.runWebGLProgram(N,[n],"float32",E),S=k({inputs:{x:R},backend:s,attrs:{shape:m}});y.push(R),y.push(S);const $=o!=null,b=r!=null,T=a==="leakyrelu",P=a?cn(a,!0):null,B=new Ha(p?S.shape:I.shape,p?I.shape:S.shape,p?[t.batchSize,g,t.outChannels]:[t.batchSize,t.outChannels,g],C,w,$,P,b,T),L=p?[S,I]:[I,S];if(o&&L.push(o),b&&L.push(r),T){const W=s.makeTensorInfo([],"float32",_t(i,"float32"));L.push(W),y.push(W)}const U=s.runWebGLProgram(B,L,"float32"),j=k({inputs:{x:U},backend:s,attrs:{shape:t.outShape}});y.push(U);for(const W of y)s.disposeIntermediateTensorInfo(W);return j}function $C(n){const{inputs:e,backend:t,attrs:s}=n,{x:o,filter:r}=e,{strides:i,pad:a,dataFormat:c,dilations:l,dimRoundingMode:u}=s,d=Mt(c),h=Oe(o.shape,r.shape,i,l,a,u,!1,d);let f;if(h.filterHeight===1&&h.filterWidth===1&&h.dilationHeight===1&&h.dilationWidth===1&&h.strideHeight===1&&h.strideWidth===1&&(h.padInfo.type==="SAME"||h.padInfo.type==="VALID"))f=ec({x:o,filter:r,convInfo:h,backend:t});else if(h.strideWidth<=2&&d==="channelsLast"&&v().getBool("WEBGL_EXP_CONV")){const x=new Ja(h),g=[[h.padInfo.top,h.padInfo.left],[h.strideHeight,h.strideWidth],[h.dilationHeight,h.dilationWidth],[h.inHeight,h.inWidth]];f=t.runWebGLProgram(x,[o,r],"float32",g)}else if(v().getBool("WEBGL_CONV_IM2COL"))f=tc({x:o,filter:r,convInfo:h,backend:t});else{const x=new Za(h);f=t.runWebGLProgram(x,[o,r],"float32")}const p=k({inputs:{x:f},backend:t,attrs:{shape:h.outShape}});return t.disposeIntermediateTensorInfo(f),p}const SC={kernelName:il,backendName:"webgl",kernelFunc:$C};class IC{constructor(e){this.variableNames=["x","dy"],this.outputShape=e.filterShape;const t=e.strideHeight,s=e.strideWidth,o=e.padInfo.top,r=e.padInfo.left,i=e.dataFormat==="channelsLast";this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int d2 = coords.w;

        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int b = 0; b < ${e.batchSize}; b++) {
          for (int yR = 0; yR < ${e.outHeight}; yR++) {
            int xR = wR + yR * ${t} - ${o};

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int yC = 0; yC < ${e.outWidth}; yC++) {
              int xC = wC + yC * ${s} - ${r};

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              ${i?`float dyValue = getDy(b, yR, yC, d2);
              float xValue = getX(b, xR, xC, d1);
              dotProd += (xValue * dyValue);`:`float dyValue = getDy(b, d2, yR, yC);
              float xValue = getX(b, d1, xR, xC);
              dotProd += (xValue * dyValue);`}
            }
          }
        }
        setOutput(dotProd);
      }
    `}}class RC{constructor(e){this.variableNames=["dy","W"],this.outputShape=e.inShape;const t=e.filterHeight,s=e.filterWidth,o=e.strideHeight,r=e.strideWidth,i=e.dataFormat==="channelsLast",a=t-1-e.padInfo.top,c=s-1-e.padInfo.left,l=i?1:2,u=i?2:3,d=i?3:1;this.userCode=`
      const ivec2 pads = ivec2(${a}, ${c});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[${d}];

        ivec2 dyCorner = ivec2(coords[${l}], coords[${u}]) - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${t}; wR++) {
          float dyR = float(dyRCorner + wR) / ${o}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = ${t} - 1 - wR;

          for (int wC = 0; wC < ${s}; wC++) {
            float dyC = float(dyCCorner + wC) / ${r}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = ${s} - 1 - wC;

            for (int d2 = 0; d2 < ${e.outChannels}; d2++) {

              if (${i}) {
                float xValue = getDy(batch, idyR, idyC, d2);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              } else {
                float xValue = getDy(batch, d2, idyR, idyC);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }

            }
          }
        }
        setOutput(dotProd);
      }
    `}}class TC{constructor(e){this.variableNames=["x","dy"],this.outputShape=e.filterShape;const t=e.strideDepth,s=e.strideHeight,o=e.strideWidth,r=e.padInfo.front,i=e.padInfo.top,a=e.padInfo.left;this.userCode=`
      void main() {
        ivec5 coords = getOutputCoords();
        int wF = coords.x;
        int wR = coords.y;
        int wC = coords.z;
        int d1 = coords.w;
        int d2 = coords.u;

        float dotProd = 0.0;

        for (int b = 0; b < ${e.batchSize}; b++) {
          for (int yF = 0; yF < ${e.outDepth}; yF++) {
            int xF = wF + yF * ${t} - ${r};

            if (xF < 0 || xF >= ${e.inDepth}) {
              continue;
            }

            for (int yR = 0; yR < ${e.outHeight}; yR++) {
              int xR = wR + yR * ${s} - ${i};

              if (xR < 0 || xR >= ${e.inHeight}) {
                continue;
              }

              for (int yC = 0; yC < ${e.outWidth}; yC++) {
                int xC = wC + yC * ${o} - ${a};

                if (xC < 0 || xC >= ${e.inWidth}) {
                  continue;
                }

                float dyValue = getDy(b, yF, yR, yC, d2);
                float xValue = getX(b, xF, xR, xC, d1);
                dotProd += (xValue * dyValue);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}}class EC{constructor(e){this.variableNames=["dy","W"],this.outputShape=e.inShape;const t=e.filterDepth,s=e.filterHeight,o=e.filterWidth,r=e.strideDepth,i=e.strideHeight,a=e.strideWidth,c=t-1-e.padInfo.front,l=s-1-e.padInfo.top,u=o-1-e.padInfo.left;this.userCode=`
      const ivec3 pads = ivec3(${c}, ${l}, ${u});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.u;


        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyFCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        float dotProd = 0.0;
        for (int wF = 0; wF < ${t}; wF++) {
          float dyF = float(dyFCorner + wF) / ${r}.0;

          if (dyF < 0.0 || dyF >= ${e.outDepth}.0 || fract(dyF) > 0.0) {
            continue;
          }
          int idyF = int(dyF);

          int wFPerm = ${t} - 1 - wF;

          for (int wR = 0; wR < ${s}; wR++) {
            float dyR = float(dyRCorner + wR) / ${i}.0;

            if (dyR < 0.0 || dyR >= ${e.outHeight}.0 ||
              fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            int wRPerm = ${s} - 1 - wR;

            for (int wC = 0; wC < ${o}; wC++) {
              float dyC = float(dyCCorner + wC) / ${a}.0;

              if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              int wCPerm = ${o} - 1 - wC;

              for (int d2 = 0; d2 < ${e.outChannels}; d2++) {
                float xValue = getDy(batch, idyF, idyR, idyC, d2);
                float wValue = getW(wFPerm, wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}}function NC(n){const{inputs:e,backend:t,attrs:s}=n,{x:o,dy:r}=e,{strides:i,pad:a,dataFormat:c,dimRoundingMode:l,filterShape:u}=s,d=Mt(c),h=Oe(o.shape,u,i,1,a,l,!1,d),f=new IC(h);return t.runWebGLProgram(f,[o,r],"float32")}const kC={kernelName:al,backendName:"webgl",kernelFunc:NC};class AC{constructor(e){this.variableNames=["dy","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"strides",type:"vec2"}],this.outputShape=e.inShape,this.enableShapeUniforms=ce(this.outputShape.length);const t=e.filterHeight,s=e.filterWidth,o=t-1-e.padInfo.top,r=s-1-e.padInfo.left;this.userCode=`
      const ivec2 pads = ivec2(${o}, ${r});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[3];

        ivec2 dyCorner = ivec2(coords[1], coords[2]) - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        vec4 result = vec4(0.);
        for (int wR = 0; wR < ${t}; wR++) {
          float dyR = float(dyRCorner + wR) / strides[0];
          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);
          int wRPerm = ${t} - 1 - wR;

          for (int wC = 0; wC < ${s}; wC++) {
            int wCPerm = ${s} - 1 - wC;

            float dyC = float(dyCCorner + wC) / strides[1];
            bool idyCVal = (dyC >= 0.0) && (dyC < ${e.outWidth}.0)
              && (fract(dyC) == 0.0);
            int idyC = int(dyC);

            float dyC2 = float(dyCCorner + wC + 1) / strides[1];
            bool idyCVal2 = (dyC2 >= 0.0) && (dyC2 < ${e.outWidth}.0)
              && (fract(dyC2) == 0.0);
            int idyC2 = int(dyC2);

            if (idyCVal && idyCVal2) {
              for (int d2 = 0; d2 < ${e.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC, d2);
                vec4 dySample2 = (idyC / 2 == idyC2 / 2) ?
                  dySample : getDy(batch, idyR, idyC2, d2);

                vec2 dyValue = mod(float(idyC), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.xy += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));

                dyValue = mod(float(idyC2), 2.) == 0. ?
                  dySample2.xy : dySample2.zw;
                result.zw += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            } else if (idyCVal) {
              for (int d2 = 0; d2 < ${e.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC, d2);
                vec2 dyValue = mod(float(idyC), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.xy += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            } else if (idyCVal2) {
              for (int d2 = 0; d2 < ${e.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC2, d2);
                vec2 dyValue = mod(float(idyC2), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.zw += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            }
          }
        }
        setOutput(result);
      }
    `}}function FC(n){const{inputs:e,backend:t,attrs:s}=n,{dy:o,filter:r}=e,{inputShape:i,strides:a,pad:c,dataFormat:l,dimRoundingMode:u}=s,d=Mt(l),h=Oe(i,r.shape,a,1,c,u,!1,d);if(v().getBool("WEBGL_PACK_CONV2DTRANSPOSE")&&d==="channelsLast"){const f=[[h.strideHeight,h.strideWidth]],p=new AC(h);return t.runWebGLProgram(p,[o,r],"float32",f)}else{const f=new RC(h);return t.runWebGLProgram(f,[o,r],"float32")}}const DC={kernelName:cl,backendName:"webgl",kernelFunc:FC};function OC(n){const{inputs:e,backend:t,attrs:s}=n,{x:o,filter:r}=e,{strides:i,pad:a,dilations:c}=s,l=pn(o.shape,r.shape,i,c,a),u=new yC(l);return t.runWebGLProgram(u,[o,r],"float32")}const PC={kernelName:ll,backendName:"webgl",kernelFunc:OC};function _C(n){const{inputs:e,backend:t,attrs:s}=n,{x:o,dy:r}=e,{strides:i,pad:a,filterShape:c}=s,l=pn(o.shape,c,i,1,a),u=new TC(l);return t.runWebGLProgram(u,[o,r],"float32")}const LC={kernelName:ul,backendName:"webgl",kernelFunc:_C};function BC(n){const{inputs:e,backend:t,attrs:s}=n,{dy:o,filter:r}=e,{pad:i,strides:a,inputShape:c}=s,l=pn(c,r.shape,a,1,i),u=new EC(l);return t.runWebGLProgram(u,[o,r],"float32")}const MC={kernelName:dl,backendName:"webgl",kernelFunc:BC};const VC=jt+`
  return cos(x);
`,UC=`
  vec4 result = cos(x);
  bvec4 isNaN = isnan(x);
  ${$t}
  return result;
`,WC=V({opSnippet:VC,packedOpSnippet:UC}),GC={kernelName:hl,backendName:"webgl",kernelFunc:WC};const zC=`
  float e2x = exp(-x);
  return (e2x + 1.0 / e2x) / 2.0;
`,HC=V({opSnippet:zC}),XC={kernelName:fl,backendName:"webgl",kernelFunc:HC};class jC{constructor(e,t,s,o,r){this.variableNames=["Image","Boxes","BoxInd"],this.outputShape=[];const[i,a,c,l]=e,[u]=t,[d,h]=s;this.outputShape=[u,d,h,l];const f=o==="bilinear"?1:0,[p,x]=[`${a-1}.0`,`${c-1}.0`],[g,m,C]=d>1?[`${(a-1)/(d-1)}`,"(y2-y1) * height_ratio",`y1*${p} + float(y)*(height_scale)`]:["0.0","0.0",`0.5 * (y1+y2) * ${p}`],[w,y,I]=h>1?[`${(c-1)/(h-1)}`,"(x2-x1) * width_ratio",`x1*${x} + float(x)*(width_scale)`]:["0.0","0.0",`0.5 * (x1+x2) * ${x}`];this.userCode=`
      const float height_ratio = float(${g});
      const float width_ratio = float(${w});
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int y = coords[1];
        int x = coords[2];
        int d = coords[3];

        // get box vals
        float y1 = getBoxes(b,0);
        float x1 = getBoxes(b,1);
        float y2 = getBoxes(b,2);
        float x2 = getBoxes(b,3);

        // get image in batch index
        int bInd = round(getBoxInd(b));
        if(bInd < 0 || bInd >= ${i}) {
          return;
        }

        float height_scale = ${m};
        float width_scale = ${y};

        float in_y = ${C};
        if( in_y < 0.0 || in_y > ${p} ) {
          setOutput(float(${r}));
          return;
        }
        float in_x = ${I};
        if( in_x < 0.0 || in_x > ${x} ) {
          setOutput(float(${r}));
          return;
        }

        vec2 sourceFracIndexCR = vec2(in_x,in_y);
        if(${f} == 1) {
          // Compute the four integer indices.
          ivec2 sourceFloorCR = ivec2(sourceFracIndexCR);
          ivec2 sourceCeilCR = ivec2(ceil(sourceFracIndexCR));

          float topLeft = getImage(b, sourceFloorCR.y, sourceFloorCR.x, d);
          float bottomLeft = getImage(b, sourceCeilCR.y, sourceFloorCR.x, d);
          float topRight = getImage(b, sourceFloorCR.y, sourceCeilCR.x, d);
          float bottomRight = getImage(b, sourceCeilCR.y, sourceCeilCR.x, d);

          vec2 fracCR = sourceFracIndexCR - vec2(sourceFloorCR);

          float top = topLeft + (topRight - topLeft) * fracCR.x;
          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;
          float newValue = top + (bottom - top) * fracCR.y;
          setOutput(newValue);
        } else {
          // Compute the coordinators of nearest neighbor point.
          ivec2 sourceNearestCR = ivec2(floor(
            sourceFracIndexCR + vec2(0.5,0.5)));
          float newValue = getImage(b, sourceNearestCR.y, sourceNearestCR.x, d);
          setOutput(newValue);
        }
      }
    `}}const qC=n=>{const{inputs:e,backend:t,attrs:s}=n,{image:o,boxes:r,boxInd:i}=e,{cropSize:a,method:c,extrapolationValue:l}=s,u=new jC(o.shape,r.shape,a,c,l);return t.runWebGLProgram(u,[o,r,i],"float32")},KC={kernelName:gl,backendName:"webgl",kernelFunc:qC};var un;(function(n){n.Prod="*",n.Sum="+"})(un||(un={}));class tr{constructor(e,t,s,o){this.op=e,this.outputShape=t,this.variableNames=["x"],this.customUniforms=[{name:"index",type:"float"}];const r=this.outputShape.length,i=this.op===un.Prod?"1.0":"0.0",a=s?i:`getX(${nr(r,"coords",this.op)})`,c=this.outputShape[this.outputShape.length-1];let l="",u="";s?(l=o?`end != ${c-1}`:"end != 0",u=o?"end + 1":"end - 1"):(l=o?`end + pow2 < ${c}`:"end >= pow2",u=o?"end + pow2":"end - pow2"),this.userCode=`
      void main() {
        ${z(r)} coords = getOutputCoords();
        int end = ${sr(r,"coords",this.op)};
        float val = ${a};
        int pow2 = int(pow(2.0, index));
        if (${l}) {
          int idx = ${u};
          ${sr(r,"coords",this.op)} = idx;
          val ${this.op}= getX(${nr(r,"coords",this.op)});
        }
        setOutput(val);
      }
    `}}function nr(n,e,t){if(n===1)return`${e}`;if(n===2)return`${e}.x, ${e}.y`;if(n===3)return`${e}.x, ${e}.y, ${e}.z`;if(n===4)return`${e}.x, ${e}.y, ${e}.z, ${e}.w`;throw new Error(`Cumulative ${t} for rank ${n} is not yet supported`)}function sr(n,e,t){if(n===1)return`${e}`;if(n===2)return`${e}.y`;if(n===3)return`${e}.z`;if(n===4)return`${e}.w`;throw new Error(`Cumulative ${t} for rank ${n} is not yet supported`)}function nc(n,e,t,s,o,r){const i=e.shape.length,a=Ie([s],i);let c=e;a!=null&&(c=he({inputs:{x:e},backend:t,attrs:{perm:a}}));const l=Re(1,i)[0];if(l!==i-1)throw new Error(`WebGL cumprod shader expects an inner-most axis=${e.shape.length-1} but got axis=${s}`);const u=c.shape[l];let d=Ce({inputs:{x:c},backend:t});for(let h=0;h<=Math.ceil(Math.log2(u))-1;h++){const f=new tr(n,c.shape,!1,r),p=[[h]],x=d;d=t.runWebGLProgram(f,[d],d.dtype,p),t.disposeIntermediateTensorInfo(x)}if(o){const h=new tr(n,c.shape,o,r),f=d;d=t.runWebGLProgram(h,[d],d.dtype),t.disposeIntermediateTensorInfo(f)}if(a!=null){const h=zs(a),f=he({inputs:{x:d},backend:t,attrs:{perm:h}});return t.disposeIntermediateTensorInfo(d),t.disposeIntermediateTensorInfo(c),f}return d}function YC(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{axis:r,exclusive:i,reverse:a}=s;return nc(un.Prod,o,t,r,i,a)}const QC={kernelName:pl,backendName:"webgl",kernelFunc:YC};function ZC(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{axis:r,exclusive:i,reverse:a}=s;return nc(un.Sum,o,t,r,i,a)}const JC={kernelName:ml,backendName:"webgl",kernelFunc:ZC};function eb(n){const{inputs:e,backend:t,attrs:s}=n,{x:o,weights:r}=e,{size:i,binaryOutput:a}=s;if(o.shape.length===1){const c=t.readSync(o.dataId),l=t.readSync(r.dataId),u=_a(c,l,r.dtype,r.shape,i);return t.makeTensorInfo([i],r.dtype,u)}else if(o.shape.length===2){const c=t.bufferSync(o),l=t.bufferSync(r),u=sg(c,l,i,a);return t.makeTensorInfo(u.shape,r.dtype,u.values)}throw new Error(`Error in denseBincount: input must be at most rank 2, but got rank${o.shape.length}.`)}const tb={kernelName:xl,backendName:"webgl",kernelFunc:eb};class nb{constructor(e,t,s){this.variableNames=["x"],this.outputShape=[],this.outputShape=e,this.blockSize=t,this.dataFormat=s,this.userCode=`
    void main() {
      ivec4 coords = getOutputCoords();
      int b = coords[0];
      int h = ${this.getHeightCoordString()};
      int w = ${this.getWidthCoordString()};
      int d = ${this.getDepthCoordString()};

      int in_h = h / ${t};
      int offset_h = imod(h, ${t});
      int in_w = w / ${t};
      int offset_w = imod(w, ${t});
      int offset_d = (offset_h * ${t} + offset_w) *
        ${this.getOutputDepthSize()};
      int in_d = d + offset_d;

      float result = ${this.getInputSamplingString()};
      setOutput(result);
    }
  `}getHeightCoordString(){return this.dataFormat==="NHWC"?"coords[1]":"coords[2]"}getWidthCoordString(){return this.dataFormat==="NHWC"?"coords[2]":"coords[3]"}getDepthCoordString(){return this.dataFormat==="NHWC"?"coords[3]":"coords[1]"}getOutputDepthSize(){return this.dataFormat==="NHWC"?this.outputShape[3]:this.outputShape[1]}getInputSamplingString(){return this.dataFormat==="NHWC"?"getX(b, in_h, in_w, in_d)":"getX(b, in_d, in_h, in_w)"}}function sb(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{blockSize:r,dataFormat:i}=s,a=o.shape[0],c=i==="NHWC"?o.shape[1]:o.shape[2],l=i==="NHWC"?o.shape[2]:o.shape[3],u=i==="NHWC"?o.shape[3]:o.shape[1],d=c*r,h=l*r,f=u/(r*r),p=i==="NHWC"?[a,d,h,f]:[a,f,d,h],x=new nb(p,r,i);return t.runWebGLProgram(x,[o],o.dtype)}const ob={kernelName:Cl,backendName:"webgl",kernelFunc:sb};class sc{constructor(e,t=!1,s=null,o=!1,r=!1){this.variableNames=["x","W"],this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=e.outShape,this.enableShapeUniforms=ce(this.outputShape.length);const i=e.filterHeight,a=e.filterWidth,c=e.outChannels/e.inChannels;let l="",u="";s&&(o?l=`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${s}
        }`:r?l=`float activation(float a) {
          float b = getLeakyreluAlphaAtOutCoords();
          ${s}
        }`:l=`
          float activation(float x) {
            ${s}
          }
        `,u="result = activation(result);");const d=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),o&&this.variableNames.push("preluActivationWeights"),r&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${l}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${c};
        int q = d2 - d1 * ${c};

        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, q) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        // TO DO(dsmilkov): Flatten the two for loops and vec4 the operations.
        for (int wR = 0; wR < ${i}; wR++) {
          int xR = xRCorner + wR * dilations[0];

          if (xR < 0 || xR >= inDims[0]) {
            continue;
          }

          for (int wC = 0; wC < ${a}; wC++) {
            int xC = xCCorner + wC * dilations[1];

            if (xC < 0 || xC >= inDims[1]) {
              continue;
            }

            float xVal = getX(batch, xR, xC, d1);
            float wVal = getW(wR, wC, d1, q);
            dotProd += xVal * wVal;
          }
        }

        float result = dotProd;
        ${d}
        ${u}
        setOutput(result);
      }
    `}}class oc{constructor(e,t=!1,s=null,o=!1,r=!1){this.variableNames=["x","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=e.outShape,this.enableShapeUniforms=ce(this.outputShape.length);const i=e.outChannels/e.inChannels,a=e.padInfo.left,c=e.strideWidth,l=e.dilationWidth,u=e.filterHeight,d=e.filterWidth,h=d;let f=`
      int xR; int xC; int xCOffset;
      vec4 wTexel; vec4 previous; vec4 final;`;for(let m=0;m<d;m++)f+=`
          vec4 xTexelC${m*2};
          int xTexelC${m*2}Ready;
          vec4 xTexelC${m*2+1};
          int xTexelC${m*2+1}Ready;
          vec4 xC${m};`;f+=`
    for (int r = 0; r < ${u}; r++) {
      `;for(let m=0;m<d;m++)f+=`
          xTexelC${m*2} = vec4(0.0);
          xTexelC${m*2}Ready = 0;
          xTexelC${m*2+1} = vec4(0.0);
          xTexelC${m*2+1}Ready = 0;
          xC${m} = vec4(0.0);`;f+=`
        xR = xRCorner + r * dilations[0];
        if (xR >=0 && xR < inDims[0]) {
      `;for(let m=0;m<(h+1)/2;m++){const C=m*2;if(f+=`
          xC = xCCorner + ${C*l};
          `,c===1){if(C<d&&(a%2===1?(f+=`
                xCOffset = xC + 1;
                if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${C}Ready == 0) {
                  xTexelC${C} = getX(batch, xR, xCOffset, d1);

                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${C}.zw = vec2(0.0);
                  }
                  xTexelC${C}Ready = 1;
                }
              `,l===1&&C>0?f+=`
                xC${C} = vec4(xTexelC${C-2}.zw, xTexelC${C}.xy);
                `:f+=`
                  xCOffset = xC + 1 - 2;

                  if (xCOffset >= 0 && xCOffset < inDims[1]) {
                    previous = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      previous.zw = vec2(0.0);
                    }

                    xC${C} = vec4(previous.zw, xTexelC${C}.xy);
                  } else {
                    xC${C} = vec4(0.0, 0.0, xTexelC${C}.xy);
                  }
                  `):f+=`
                if (xC >= 0 && xC < inDims[1] && xTexelC${C}Ready == 0) {
                  xTexelC${C} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${C}.zw = vec2(0.0);
                  }
                  xTexelC${C}Ready = 1;
                }

                xC${C} = xTexelC${C};
                `,C+1<d)){const w=a%2===0?Ds(l):l;l%2===0&&a%2===1||l%2!==0&&a%2!==1?(f+=`
                  xCOffset = xC + imod(pads[1], 2) + ${w};

                  if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${C+1}Ready == 0) {
                    xTexelC${C+1} = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      xTexelC${C+1}.zw = vec2(0.0);
                    }
                    xTexelC${C+1}Ready = 1;
                  }
                  `,l>1?f+=`
                    xCOffset -= 2;
                    if (xCOffset >= 0 && xCOffset < inDims[1]) {
                     previous = getX(batch, xR, xCOffset, d1);
                     xC${C+1} = vec4(previous.zw, xTexelC${C+1}.xy);
                    } else {
                     xC${C+1} = vec4(0.0, 0.0, xTexelC${C+1}.xy);
                    }
                    `:f+=`
                    xC${C+1} = vec4(xTexelC${C}.zw, xTexelC${C+1}.xy);
                    `):w===1?f+=`
                    xC${C+1} = xTexelC${C};
                    `:f+=`
                    xCOffset = xC + ${w};

                    if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${C+1}Ready == 0) {
                      xTexelC${C+1} = getX(batch, xR, xCOffset, d1);
                      if (xCOffset + 1 >= inDims[1]) {
                        xTexelC${C+1}.zw = vec2(0.0);
                      }
                      xTexelC${C+1}Ready = 1;
                    }

                    xC${C+1} = xTexelC${C+1};
                    `}}else C<d&&(a%2===1?(f+=`
                xCOffset = xC + 1 - strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${C}Ready == 0) {
                  xTexelC${C} = getX(batch, xR, xCOffset, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${C}.zw = vec2(0.0);
                  }
                  xTexelC${C}Ready = 1;
                }

                if(xC + 1 >= 0 && xC + 1 < inDims[1] && xTexelC${C+1}Ready == 0) {
                  xTexelC${C+1} = getX(batch, xR, xC + 1, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xC + 2 >= inDims[1]) {
                    xTexelC${C+1}.zw = vec2(0.0);
                  }
                  xTexelC${C+1}Ready = 1;
                }

                xC${C} = vec4(xTexelC${C}.zw, xTexelC${C+1}.zw);
              `,C+1<d&&(f+=`
                  final = vec4(0.0);
                  xCOffset = xC + 1 + strides[1];
                  if(xCOffset >= 0 && xCOffset < inDims[1]) {
                    final = getX(batch, xR, xCOffset, d1);
                  }
                  xC${C+1} = vec4(xTexelC${C+1}.xy, final.xy);
                `)):(f+=`
                if(xC >= 0 && xC < inDims[1] && xTexelC${C}Ready == 0) {
                  xTexelC${C} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${C}.zw = vec2(0.0);
                  }
                  xTexelC${C}Ready = 1;
                }

                xCOffset = xC + strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${C+1}Ready == 0) {
                  xTexelC${C+1} = getX(batch, xR, xCOffset, d1);
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${C+1}.zw = vec2(0.);
                  }
                  xTexelC${C+1}Ready = 1;
                }

                xC${C} = vec4(
                  xTexelC${C}.xy, xTexelC${C+1}.xy);
              `,C+1<d&&(f+=`
                  xC${C+1} = vec4(xTexelC${C}.zw, xTexelC${C+1}.zw);
                `)));C<d&&(f+=`
            wTexel = getW(r, ${C}, d1, q);
            dotProd += xC${C} * vec4(wTexel.xz, wTexel.xz);
          `,C+1<d&&(f+=`
              wTexel = getW(r, ${C+1}, d1, q);
              dotProd += xC${C+1} * vec4(wTexel.xz, wTexel.xz);
            `))}f+=`
    }
  `,f+=`
      }
    `;let p="",x="";s&&(o?p=`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${s}
        }`:r?p=`vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${s}
        }`:p=`vec4 activation(vec4 x) {
          ${s}
        }`,x="result = activation(result);");const g=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),o&&this.variableNames.push("preluActivationWeights"),r&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${p}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${i};
        int q = d2 - d1 * ${i};
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        //intialize dotProd with a small epsilon seems to reduce GPU accuracy loss.
        vec4 dotProd = vec4(0.000000000000001);

        ${f}

        vec4 result = dotProd - vec4(0.000000000000001);
        ${g}
        ${x}
        setOutput(result);
      }
    `}}function rb(n){const{inputs:e,backend:t,attrs:s}=n,{x:o,filter:r}=e,{strides:i,pad:a,dilations:c,dimRoundingMode:l}=s;let u=c;u==null&&(u=[1,1]),D(Bt(i,u),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${i} and dilations '${u}'`);const d=Oe(o.shape,r.shape,i,u,a,l,!0);let h;v().getBool("WEBGL_PACK_DEPTHWISECONV")&&d.strideWidth<=2&&d.outChannels/d.inChannels===1?h=new oc(d):h=new sc(d);const f=[[d.padInfo.top,d.padInfo.left],[d.strideHeight,d.strideWidth],[d.dilationHeight,d.dilationWidth],[d.inHeight,d.inWidth]];return t.runWebGLProgram(h,[o,r],"float32",f)}const ib={kernelName:bl,backendName:"webgl",kernelFunc:rb};class ab{constructor(e){this.variableNames=["x","dy"],this.outputShape=e.filterShape;const t=e.strideHeight,s=e.strideWidth,o=e.padInfo.top,r=e.padInfo.left,i=e.outChannels/e.inChannels;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int dm = coords.w;
        int d2 = d1 * ${i} + dm;

        float dotProd = 0.0;

        // TO DO: Vec4 over the batch size
        for (int b = 0; b < ${e.batchSize}; b++) {
          for (int yR = 0; yR < ${e.outHeight}; yR++) {
            int xR = wR + yR * ${t} - ${o};

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int yC = 0; yC < ${e.outWidth}; yC++) {
              int xC = wC + yC * ${s} - ${r};

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              float dyValue = getDy(b, yR, yC, d2);
              float xValue = getX(b, xR, xC, d1);
              dotProd += (xValue * dyValue);
            }
          }
        }
        setOutput(dotProd);
      }
    `}}class cb{constructor(e){this.variableNames=["dy","W"],this.outputShape=e.inShape;const t=e.filterHeight,s=e.filterWidth,o=e.strideHeight,r=e.strideWidth,i=t-1-e.padInfo.top,a=s-1-e.padInfo.left,c=e.outChannels/e.inChannels;this.userCode=`
      const ivec2 pads = ivec2(${i}, ${a});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[3];
        ivec2 dyCorner = coords.yz - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        float dotProd = 0.0;

        for (int wR = 0; wR < ${t}; wR++) {
          float dyR = float(dyRCorner + wR) / ${o}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = ${t} - 1 - wR;

          for (int wC = 0; wC < ${s}; wC++) {
            float dyC = float(dyCCorner + wC) / ${r}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = ${s} - 1 - wC;

            // TO DO: Vec4 over the channelMul
            for (int dm = 0; dm < ${c}; dm++) {
              int d2 = d1 * ${c} + dm;
              float xValue = getDy(batch, idyR, idyC, d2);
              float wValue = getW(wRPerm, wCPerm, d1, dm);
              dotProd += xValue * wValue;
            }
          }
        }
        setOutput(dotProd);
      }
    `}}function lb(n){const{inputs:e,backend:t,attrs:s}=n,{x:o,dy:r}=e,{strides:i,dilations:a,pad:c,dimRoundingMode:l,filterShape:u}=s,d=Oe(o.shape,u,i,a,c,l,!0),h=new ab(d);return t.runWebGLProgram(h,[o,r],"float32")}const ub={kernelName:wl,backendName:"webgl",kernelFunc:lb};function db(n){const{inputs:e,backend:t,attrs:s}=n,{dy:o,filter:r}=e,{strides:i,dilations:a,pad:c,dimRoundingMode:l,inputShape:u}=s,d=Oe(u,r.shape,i,a,c,l,!0),h=new cb(d);return t.runWebGLProgram(h,[o,r],"float32")}const hb={kernelName:yl,backendName:"webgl",kernelFunc:db};class fb{constructor(e){this.variableNames=["X"],this.outputShape=[e,e],this.userCode=`
      void main() {
          ivec2 coords = getOutputCoords();
          float val = coords[0] == coords[1] ? getX(coords[0]) : 0.0;
          setOutput(val);
      }
    `}}function pb(n){const{inputs:e,backend:t}=n,{x:s}=e,o=[...s.shape,...s.shape],r=F(s.shape),i=k({inputs:{x:s},backend:t,attrs:{shape:[r]}}),a=new fb(r),c=t.runWebGLProgram(a,[i],i.dtype),l=k({inputs:{x:c},backend:t,attrs:{shape:o}});return t.disposeIntermediateTensorInfo(i),t.disposeIntermediateTensorInfo(c),l}const mb={kernelName:vl,backendName:"webgl",kernelFunc:pb};class gb{constructor(e){this.variableNames=["x","W"],this.outputShape=e.outShape;const{inHeight:t,inWidth:s,padInfo:o,strideHeight:r,strideWidth:i,filterHeight:a,filterWidth:c,dilationHeight:l,dilationWidth:u}=e,{top:d,left:h}=o;this.userCode=`
      const ivec2 strides = ivec2(${r}, ${i});
      const ivec2 pads = ivec2(${d}, ${h});
      const float neg_infinity = -3.4e38;

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.w;
        ivec2 outTopLeftCorner =
            coords.yz * strides - pads;
        int hBeg = outTopLeftCorner.x;
        int wBeg = outTopLeftCorner.y;

        float curVal = neg_infinity;
        for (int h = 0; h < ${a}; h++) {
          int hIn = hBeg + h * ${l};

          if (hIn >= 0 && hIn < ${t}) {
            for (int w = 0; w < ${c}; w++) {
              int wIn = wBeg + w * ${u};

              if (wIn >= 0 && wIn < ${s}) {
                float xVal = getX(batch, hIn, wIn, d1);
                float wVal = getW(h, w, d1);

                float val = xVal + wVal;
                if (val > curVal) {
                  curVal = val;
                }
              }
            }
          }
        }

        float result = curVal;
        setOutput(result);
      }
    `}}function xb(n){const{inputs:e,backend:t,attrs:s}=n,{x:o,filter:r}=e,{strides:i,pad:a,dilations:c}=s,l=ti(o.shape,r.shape,i,a,"NHWC",c);let u;const d=new gb(l);u=t.runWebGLProgram(d,[o,r],"float32");const h=k({inputs:{x:u},backend:t,attrs:{shape:l.outShape}});return t.disposeIntermediateTensorInfo(u),h}const Cb={kernelName:$l,backendName:"webgl",kernelFunc:xb};function bb(n){const{inputs:e,backend:t,attrs:s}=n,{equation:o}=s,r=e,{allDims:i,summedDims:a,idDims:c}=Ii(o,r.length);Ti(i.length,c,r);const{path:l,steps:u}=Ei(a,c),d=u.length;let h=null,f=i.length;const p=[];for(let x=0;x<d;++x){for(const g of u[x]){const{permutationIndices:m,expandDims:C}=Ri(f,c[g]);let w;Ni(m)?w=r[g]:(w=he({inputs:{x:r[g]},backend:t,attrs:{perm:m}}),p.push(w));const y=w.shape.slice();for(let I=0;I<C.length;++I)y.splice(C[I],0,1);oe(w.shape,y)||(w=k({inputs:{x:w},backend:t,attrs:{shape:y}}),p.push(w)),h===null?h=w:(h=lo({inputs:{a:w,b:h},backend:t}),p.push(h))}x<d-1&&(l[x]>=0&&(h=Yn({inputs:{x:h},backend:t,attrs:{axis:l[x]-(i.length-f),keepDims:!1}}),p.push(h)),f--)}for(const x of p)x!==h&&t.disposeIntermediateTensorInfo(x);return h}const wb={kernelName:Sl,backendName:"webgl",kernelFunc:bb};const yb="return (x >= 0.0) ? x : (exp(x) - 1.0);",vb=`
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`,$b=V({opSnippet:yb,packedOpSnippet:vb}),Sb={kernelName:Il,backendName:"webgl",kernelFunc:$b};const Ib="return (b >= 0.0) ? a : a * (b + 1.0);",Rb=`
  vec4 bGTEZero = vec4(greaterThanEqual(b, vec4(0.)));
  return (bGTEZero * a) + ((vec4(1.0) - bGTEZero) * (a * (b + vec4(1.0))));
`,Tb=n=>{const{inputs:e,backend:t}=n,{dy:s,y:o}=e,r=v().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Xt(Rb,s.shape,o.shape):new gt(Ib,s.shape,o.shape);return t.runWebGLProgram(r,[s,o],s.dtype)},Eb={kernelName:Rl,backendName:"webgl",kernelFunc:Tb};const Nb=`
  return vec4(equal(a, b));
`,kb="return float(a == b);",Ab=ie({opSnippet:kb,packedOpSnippet:Nb,dtype:"bool",cpuKernelImpl:cg}),Fb={kernelName:El,backendName:"webgl",kernelFunc:Ab};const Db=`
  // Error function is calculated approximately with elementary function.
  // See "Handbook of Mathematical Functions with Formulas,
  // Graphs, and Mathematical Tables", Abramowitz and Stegun.
  float p = ${bi};
  float a1 = ${wi};
  float a2 = ${yi};
  float a3 = ${vi};
  float a4 = ${$i};
  float a5 = ${Si};

  float sign = sign(x);
  x = abs(x);
  float t = 1.0 / (1.0 + p * x);
  return sign * (1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*exp(-x*x));
`,Ob=V({opSnippet:Db}),Pb={kernelName:Tl,backendName:"webgl",kernelFunc:Ob};const _b=jt+`
  return exp(x);
`,Lb=`
  vec4 result = exp(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,rc=V({opSnippet:_b,packedOpSnippet:Lb,cpuKernelImpl:lg,dtype:"float32"}),Bb={kernelName:Nl,backendName:"webgl",kernelFunc:rc};function Fs(n){const{inputs:e,attrs:t,backend:s}=n,{dim:o}=t,{input:r}=e,i=r.shape.length,a=r.shape.slice();let c=o;return o<0&&(D(-(i+1)<=o,()=>`Axis must be in the interval [${-(i+1)}, ${i}]`),c=i+o+1),a.splice(c,0,1),k({inputs:{x:r},backend:s,attrs:{shape:a}})}const Mb={kernelName:kl,backendName:"webgl",kernelFunc:Fs};const or="return exp(x) - 1.0;",Vb=V({opSnippet:or,packedOpSnippet:or,cpuKernelImpl:ug}),Ub={kernelName:Al,backendName:"webgl",kernelFunc:Vb};class rr{constructor(e,t,s){this.variableNames=["real","imag"];const o=t[1];this.outputShape=t;const r=s?`2.0 * ${Math.PI}`:`-2.0 * ${Math.PI}`,i=s?`${o}.0`:"1.0";let a;if(e==="real")a="return real * expR - imag * expI;";else if(e==="imag")a="return real * expI + imag * expR;";else throw new Error(`FFT component must be either "real" or "imag", got ${e}.`);this.userCode=`
      const float exponentMultiplier = ${r};

      float unaryOpComplex(float real, float expR, float imag, float expI) {
        ${a}
      }

      float mulMatDFT(int batch, int index) {
        float indexRatio = float(index) / float(${o});
        float exponentMultiplierTimesIndexRatio =
            exponentMultiplier * indexRatio;

        float result = 0.0;

        for (int i = 0; i < ${o}; i++) {
          // x = (-2|2 * PI / N) * index * i;
          float x = exponentMultiplierTimesIndexRatio * float(i);
          float expR = cos(x);
          float expI = sin(x);
          float real = getReal(batch, i);
          float imag = getImag(batch, i);

          result +=
              unaryOpComplex(real, expR, imag, expI) / ${i};
        }

        return result;
      }

      void main() {
        ivec2 coords = getOutputCoords();
        setOutput(mulMatDFT(coords[0], coords[1]));
      }
    `}}function ic(n,e,t){const s=t.texData.get(n.dataId),o=F(n.shape),r=n.shape[n.shape.length-1],i=o/r,a=k({inputs:{x:n},backend:t,attrs:{shape:[i,r]}}),c=a.shape,l=new rr("real",c,e),u=new rr("imag",c,e),d=[{dataId:s.complexTensorInfos.real.dataId,dtype:s.complexTensorInfos.real.dtype,shape:c},{dataId:s.complexTensorInfos.imag.dataId,dtype:s.complexTensorInfos.imag.dtype,shape:c}],h=t.runWebGLProgram(l,d,"float32"),f=t.runWebGLProgram(u,d,"float32"),p=Je({inputs:{real:h,imag:f},backend:t});t.disposeIntermediateTensorInfo(h),t.disposeIntermediateTensorInfo(f);const x=k({inputs:{x:p},backend:t,attrs:{shape:n.shape}});return t.disposeIntermediateTensorInfo(a),t.disposeIntermediateTensorInfo(p),x}function Wb(n){const{inputs:e,backend:t}=n,{input:s}=e;return ic(s,!1,t)}const Gb={kernelName:Fl,backendName:"webgl",kernelFunc:Wb};class zb{constructor(e,t){this.outputShape=[],this.customUniforms=[{name:"value",type:"float"}],this.variableNames=["x"],this.outputShape=e,this.userCode=`
      void main() {
        // Input can be obtained from uniform value.
        setOutput(value);
      }
    `}}function Cn(n){const{backend:e,attrs:t}=n,{shape:s,value:o}=t;let{dtype:r}=t;if(r=r||dn(o),r==="string"){const i=ee(r,F(s));return i.fill(o),e.makeTensorInfo(s,r,i)}else{const i=new zb(s,o),a=[[o]];return e.runWebGLProgram(i,[],r,a)}}const Hb={kernelName:yr,backendName:"webgl",kernelFunc:Cn};class Xb{constructor(e){this.variableNames=["Image"],this.outputShape=[];const t=e[2];this.outputShape=e,this.userCode=`
        void main() {
          ivec4 coords = getOutputCoords();
          int x = coords[2];

          int coordX = ${t} - x - 1;
          float outputValue;
          if(coordX >= 0 && coordX < ${t}) {
            outputValue = getImage(coords[0], coords[1], coordX, coords[3]);
          } else {
            outputValue = getImage(coords[0], coords[1], coords[2], coords[3]);
          }
          setOutput(outputValue);
        }
    `}}const jb={kernelName:Dl,backendName:"webgl",kernelFunc:({inputs:n,backend:e})=>{const{image:t}=n,s=e,o=new Xb(t.shape);return s.runWebGLProgram(o,[t],t.dtype)}};const ir="return floor(x);",qb=V({opSnippet:ir,packedOpSnippet:ir,cpuKernelImpl:dg}),Kb={kernelName:Ol,backendName:"webgl",kernelFunc:qb};const Yb=`
  float s = sign(a) * sign(b);
  int ia = round(a);
  int ib = round(b);
  if (ib != 0) {
    // Windows (D3D) wants guaranteed non-zero int division at compile-time.
    return float(idiv(ia, ib, s));
  } else {
    return NAN;
  }
`,Qb=`
  ivec4 ia = round(a);
  ivec4 ib = round(b);
  bvec4 cond = notEqual(ib, ivec4(0));
  ivec4 result = ivec4(0);
  vec4 s = sign(a) * sign(b);

  // Windows (D3D) wants guaranteed non-zero int division at compile-time.
  if (cond[0]) {
    result[0] = idiv(ia[0], ib[0], s[0]);
  }
  if (cond[1]) {
    result[1] = idiv(ia[1], ib[1], s[1]);
  }
  if (cond[2]) {
    result[2] = idiv(ia[2], ib[2], s[2]);
  }
  if (cond[3]) {
    result[3] = idiv(ia[3], ib[3], s[3]);
  }
  return vec4(result);
`,Zb=ie({opSnippet:Yb,packedOpSnippet:Qb,dtype:"int32"}),Jb={kernelName:vr,backendName:"webgl",kernelFunc:Zb};class ew{constructor(e){this.variableNames=["A"];const t=pe(),[s,o]=e;this.outputShape=e,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${o}.0, ${s}.0);

        vec4 values = ${t.texture2D}(A, uv);
        float value;
        if (depth == 0) {
          value = values.r;
        } else if (depth == 1) {
          value = values.g;
        } else if (depth == 2) {
          value = values.b;
        } else if (depth == 3) {
          value = values.a;
        }

        setOutput(floor(value * 255.0 + 0.5));
      }
    `}}class tw{constructor(e){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0;const t=pe(),[s,o]=e;this.outputShape=e,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];

        vec4 result = vec4(0.);

        for(int row=0; row<=1; row++) {
          for(int col=0; col<=1; col++) {
            texC = coords[1] + row;
            depth = coords[2] + col;

            vec2 uv = (vec2(texC, texR) + halfCR) /
                       vec2(${o}.0, ${s}.0);
            vec4 values = ${t.texture2D}(A, uv);
            float value;
            if (depth == 0) {
              value = values.r;
            } else if (depth == 1) {
              value = values.g;
            } else if (depth == 2) {
              value = values.b;
            } else if (depth == 3) {
              value = values.a;
            }

            result[row * 2 + col] = floor(value * 255.0 + 0.5);
          }
        }

        ${t.output} = result;
      }
    `}}const nw={kernelName:vd,backendName:"webgl",kernelFunc:sw};let Rt,is=v().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");function sw(n){const{inputs:e,backend:t,attrs:s}=n;let{pixels:o}=e;const{numChannels:r}=s,i=typeof HTMLVideoElement<"u"&&o instanceof HTMLVideoElement,a=typeof HTMLImageElement<"u"&&o instanceof HTMLImageElement,[c,l]=i?[o.videoWidth,o.videoHeight]:[o.width,o.height],u=[l,c],d=[l,c,r];if(a||i){const x=v().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");(Rt==null||x!==is)&&(is=x,Rt=document.createElement("canvas").getContext("2d",{willReadFrequently:is})),Rt.canvas.width=c,Rt.canvas.height=l,Rt.drawImage(o,0,0,c,l),o=Rt.canvas}const h=t.makeTensorInfo(u,"int32");t.texData.get(h.dataId).usage=be.PIXELS,t.gpgpu.uploadPixelDataToTexture(t.getTexture(h.dataId),o);const f=v().getBool("WEBGL_PACK")?new tw(d):new ew(d),p=t.runWebGLProgram(f,[h],"int32");return t.disposeData(h.dataId),p}function ow(n){const{inputs:e,backend:t,attrs:s}=n,{x:o,filter:r,bias:i,preluActivationWeights:a}=e,{strides:c,pad:l,dataFormat:u,dilations:d,dimRoundingMode:h,activation:f,leakyreluAlpha:p}=s,x=Mt(u),g=Oe(o.shape,r.shape,c,d,l,h,!1,x);let m;const C=[],w=i!=null,y=a!=null,I=f==="leakyrelu",N=()=>{const R=[o,r],S=($,b)=>{if(b==="NCHW"&&$.shape.length===1&&$.shape[0]!==1){const T=k({inputs:{x:$},backend:t,attrs:{shape:[$.shape[0],1,1]}});return C.push(T),T}return $};if(w&&R.push(S(i,u)),y&&R.push(S(a,u)),I){const $=t.makeTensorInfo([],"float32",_t(p,"float32"));R.push($),C.push($)}return R};if(g.filterHeight===1&&g.filterWidth===1&&g.dilationHeight===1&&g.dilationWidth===1&&g.strideHeight===1&&g.strideWidth===1&&(g.padInfo.type==="SAME"||g.padInfo.type==="VALID"))m=ec({x:o,filter:r,convInfo:g,backend:t,bias:i,activation:f,preluActivationWeights:a,leakyreluAlpha:p});else if(g.strideWidth<=2&&x==="channelsLast"&&v().getBool("WEBGL_EXP_CONV")){const R=f?cn(f,!0):null,S=new Ja(g,w,R,y,I),$=[[g.padInfo.top,g.padInfo.left],[g.strideHeight,g.strideWidth],[g.dilationHeight,g.dilationWidth],[g.inHeight,g.inWidth]],b=N();m=t.runWebGLProgram(S,b,"float32",$)}else if(v().getBool("WEBGL_CONV_IM2COL"))m=tc({x:o,filter:r,convInfo:g,backend:t,bias:i,activation:f,preluActivationWeights:a,leakyreluAlpha:p});else{const R=f?cn(f,!1):null,S=new Za(g,w,R,y,I),$=N();m=t.runWebGLProgram(S,$,"float32")}const E=k({inputs:{x:m},backend:t,attrs:{shape:g.outShape}});return C.push(m),C.forEach(R=>t.disposeIntermediateTensorInfo(R)),E}const rw={kernelName:Id,backendName:"webgl",kernelFunc:ow};function iw(n){const{inputs:e,backend:t,attrs:s}=n,{x:o,filter:r,bias:i,preluActivationWeights:a}=e,{strides:c,pad:l,dilations:u,dimRoundingMode:d,activation:h,leakyreluAlpha:f}=s,p=[];let x=u;x==null&&(x=[1,1]),D(Bt(c,x),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${c} and dilations '${x}'`);const g=Oe(o.shape,r.shape,c,x,l,d,!0),m=v().getBool("WEBGL_PACK_DEPTHWISECONV")&&g.strideWidth<=2&&g.outChannels/g.inChannels===1,C=h?cn(h,m):null,w=[o,r],y=i!=null,I=a!=null,N=h==="leakyrelu";if(y&&w.push(i),I&&w.push(a),N){const $=t.makeTensorInfo([],"float32",_t(f,"float32"));w.push($),p.push($)}let E;m?E=new oc(g,y,C,I,N):E=new sc(g,y,C,I,N);const R=[[g.padInfo.top,g.padInfo.left],[g.strideHeight,g.strideWidth],[g.dilationHeight,g.dilationWidth],[g.inHeight,g.inWidth]],S=t.runWebGLProgram(E,w,"float32",R);return p.forEach($=>t.disposeIntermediateTensorInfo($)),S}const aw={kernelName:Rd,backendName:"webgl",kernelFunc:iw};class cw{constructor(e,t,s,o){this.sliceDim=e,this.strides=t,this.paramsShape=o,this.variableNames=["x","indices"],this.outputShape=s;const r=z(s.length);let i=`
    int index;`;for(let a=0;a<this.sliceDim;a++)i+=`
          index = round(getIndices(coords[0], ${a}));
          out_of_bounds = out_of_bounds || index < 0;
          out_of_bounds = out_of_bounds || index >= ${this.paramsShape[a]};
          flattenIndex += index * ${this.strides[a]};`;this.userCode=`
         void main() {
          ${r} coords = getOutputCoords();
          int flattenIndex = 0;
          bool out_of_bounds = false;

          ${i}

          setOutput(out_of_bounds ? 0.0 : getX(flattenIndex, coords[1]));
        }
      `}}function lw(n){const{inputs:e,backend:t}=n,{params:s,indices:o}=e,r=o.shape,i=r[r.length-1],a=F(s.shape),[c,l,u,d]=ii(s,o),h=k({inputs:{x:o},backend:t,attrs:{shape:[l,i]}}),f=k({inputs:{x:s},backend:t,attrs:{shape:[F(s.shape)/u,u]}});if(t.shouldExecuteOnCPU([s,o])||s.dtype==="string"){const m=t.readSync(o.dataId),C=t.bufferSync(s),w=hg(m,C,s.dtype,l,i,u,d,s.shape,a);return t.makeTensorInfo(c,s.dtype,w.values)}const p=new cw(i,d,[l,u],s.shape),x=t.runWebGLProgram(p,[f,h],f.dtype),g=k({inputs:{x},backend:t,attrs:{shape:c}});return t.disposeIntermediateTensorInfo(h),t.disposeIntermediateTensorInfo(f),t.disposeIntermediateTensorInfo(x),g}const uw={kernelName:Ll,backendName:"webgl",kernelFunc:lw};class dw{constructor(e,t){this.variableNames=["A","indices"],this.outputShape=t,this.rank=t.length;const s=z(this.rank),o=hw(e);this.userCode=`
      void main() {
        ${s} resRC = getOutputCoords();
        int index = int(getIndices(resRC.x, resRC.z));
        float inBounds = (index >= 0) && (index < ${e[2]}) ? 1.0 : 0.0;
        setOutput(inBounds * getA(${o}));
      }
    `}}function hw(n,e){const t=["resRC.x","resRC.y","resRC.z","resRC.w"],s=[];for(let o=0;o<n.length;o++)o===2?s.push("index"):s.push(`${t[o]}`);return s.join()}function ac(n){const{inputs:e,backend:t,attrs:s}=n,{x:o,indices:r}=e,{axis:i,batchDims:a}=s,c=ge(i,o.shape)[0];if(v().get("DEBUG")){const C=t.readSync(r.dataId),w=o.shape[c];for(let y=0;y<C.length;++y){const I=C[y];D(I<=w-1&&I>=0,()=>`GatherV2: the index value ${I} is not in [0, ${w-1}]`)}}const l=Wf(o,r,c,a),u=F(r.shape),d=[],h=k({inputs:{x:o},backend:t,attrs:{shape:[l.batchSize,l.outerSize,l.dimSize,l.sliceSize]}}),f=k({inputs:{x:r},backend:t,attrs:{shape:[l.batchSize,u/l.batchSize]}});d.push(h),d.push(f);const p=[l.batchSize,l.outerSize,u/l.batchSize,l.sliceSize];if(t.shouldExecuteOnCPU([o,r])||o.dtype==="string"){const C=t.bufferSync(f),w=t.bufferSync(h),y=fg(w,C,p);return d.forEach(I=>t.disposeIntermediateTensorInfo(I)),t.makeTensorInfo(l.outputShape,y.dtype,y.values)}const x=new dw(h.shape,p),g=t.runWebGLProgram(x,[h,f],h.dtype);d.push(g);const m=k({inputs:{x:g},backend:t,attrs:{shape:l.outputShape}});return d.forEach(C=>t.disposeIntermediateTensorInfo(C)),m}const fw={kernelName:_l,backendName:"webgl",kernelFunc:ac};const pw="return float(a > b);",mw=`
  return vec4(greaterThan(a, b));
`,gw=ie({opSnippet:pw,packedOpSnippet:mw,cpuKernelImpl:pg,dtype:"bool"}),xw={kernelName:Bl,backendName:"webgl",kernelFunc:gw};const Cw="return float(a >= b);",bw=`
  return vec4(greaterThanEqual(a, b));
`,ww=ie({opSnippet:Cw,packedOpSnippet:bw,dtype:"bool",cpuKernelImpl:mg}),yw={kernelName:Ml,backendName:"webgl",kernelFunc:ww};function vw(n){const{inputs:e,backend:t}=n,{input:s}=e;return ic(s,!0,t)}const $w={kernelName:Vl,backendName:"webgl",kernelFunc:vw};const Sw="return float(!isnan(x) && !isinf(x));",Iw=V({opSnippet:Sw,dtype:"bool"}),Rw={kernelName:Wl,backendName:"webgl",kernelFunc:Iw};const Tw="return float(isinf(x));",Ew=V({opSnippet:Tw,dtype:"bool"}),Nw={kernelName:Gl,backendName:"webgl",kernelFunc:Ew};const kw="return float(isnan(x));",Aw=V({opSnippet:kw,dtype:"bool"}),Fw={kernelName:zl,backendName:"webgl",kernelFunc:Aw};const Dw="return float(a < b);",Ow=`
  return vec4(lessThan(a, b));
`,Pw=ie({opSnippet:Dw,packedOpSnippet:Ow,cpuKernelImpl:gg,dtype:"bool"}),_w={kernelName:Xl,backendName:"webgl",kernelFunc:Pw};const Lw="return float(a <= b);",Bw=`
  return vec4(lessThanEqual(a, b));
`,Mw=ie({opSnippet:Lw,packedOpSnippet:Bw,cpuKernelImpl:xg,dtype:"bool"}),Vw={kernelName:jl,backendName:"webgl",kernelFunc:Mw};function Uw(n){const{backend:e,attrs:t}=n,{start:s,stop:o,num:r}=t,i=Cg(s,o,r);return e.makeTensorInfo([i.length],"float32",i)}const Ww={kernelName:ql,backendName:"webgl",kernelFunc:Uw};const Gw=jt+`
  return x < 0.0 ? 0./0. : log(x);
`,zw=`
  vec4 result = log(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : (x.r < 0.0 ? 0./0. : result.r);
  result.g = isNaN.g ? x.g : (x.g < 0.0 ? 0./0. : result.g);
  result.b = isNaN.b ? x.b : (x.b < 0.0 ? 0./0. : result.b);
  result.a = isNaN.a ? x.a : (x.a < 0.0 ? 0./0. : result.a);
  return result;
`,Hw=V({opSnippet:Gw,packedOpSnippet:zw,cpuKernelImpl:bg}),Xw={kernelName:Kl,backendName:"webgl",kernelFunc:Hw};const jw=jt+`
  return log(1.0 + x);
`,qw=V({opSnippet:jw}),Kw={kernelName:Yl,backendName:"webgl",kernelFunc:qw};const Yw="return float(a >= 1.0 && b >= 1.0);",Qw=`
  return vec4(
    vec4(greaterThanEqual(a, vec4(1.0))) *
    vec4(greaterThanEqual(b, vec4(1.0))));
`,Zw=ie({opSnippet:Yw,packedOpSnippet:Qw,dtype:"bool"}),Jw={kernelName:Ql,backendName:"webgl",kernelFunc:Zw};const e1="return float(!(x >= 1.0));",t1=V({opSnippet:e1}),n1={kernelName:Zl,backendName:"webgl",kernelFunc:t1};const s1="return float(a >= 1.0 || b >= 1.0);",o1=`
  return min(
    vec4(greaterThanEqual(a, vec4(1.0))) +
    vec4(greaterThanEqual(b, vec4(1.0))),
    vec4(1.0));
`,r1=ie({opSnippet:s1,packedOpSnippet:o1,dtype:"bool"}),i1={kernelName:Jl,backendName:"webgl",kernelFunc:r1};class a1{constructor(e,t,s,o,r){this.variableNames=["x"],this.outputShape=[];const i=t,a=e[3]-1;this.outputShape=e;let c;const l=`float(${s}) + float(${o}) * sum`;r===.5?c=`inversesqrt(${l})`:r===1?c=`1.0/(${l})`:c=`exp(log(${l}) * float(-${r}));`,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];
        int d = coords[3];
        float x = getX(b, r, c, d);
        float sum = 0.0;
        for (int j = -${i}; j <= ${i}; j++) {
          int idx = d + j;
          if (idx >= 0 && idx <=  ${a}) {
            float z = getX(b, r, c, idx);
            sum += z * z;
          }
        }
        float val = x * ${c};
        setOutput(val);
      }
    `}}class c1{constructor(e,t,s,o,r){this.variableNames=["x"],this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0;const i=t,a=e[3]-1;this.outputShape=e;let c;const l=`float(${s}) + float(${o}) * sum`;r===.5?c=`inversesqrt(${l})`:r===1?c=`1.0/(${l})`:c=`exp(log(${l}) * float(-${r}));`,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords.x;
        int r = coords.y;
        int c = coords.z;
        int d = coords.w;

        bool hasNextCol = d < ${this.outputShape[3]};
        bool hasNextRow = c < ${this.outputShape[2]};

        vec4 sum = vec4(0.);
        vec4 xFragAtOutputCoords = getX(b, r, c, d);

        vec4 xAtOutputCoords = vec4(
          getChannel(xFragAtOutputCoords, vec2(c, d)),
          hasNextCol ?
            getChannel(xFragAtOutputCoords, vec2(c, d + 1)) : 0.0,
          hasNextRow ?
            getChannel(xFragAtOutputCoords , vec2(c + 1, d)) : 0.0,
          (hasNextRow && hasNextCol) ?
            getChannel(xFragAtOutputCoords, vec2(c + 1, d + 1)) : 0.0
        );

        int firstChannel = d - ${i};
        vec2 cache = vec2(0.);
        if(firstChannel >= 0){
          vec4 firstChannelFrag = getX(b, r, c, firstChannel);
          cache.x = getChannel(firstChannelFrag, vec2(c, firstChannel));
            if(hasNextRow){
              cache.y = getChannel(firstChannelFrag, vec2(c + 1, firstChannel));
            }
        }

        ivec2 depth = ivec2(d, d + 1);
        for (int j = - ${i}; j <= ${i}; j++) {
          ivec2 idx = depth + j;
          bvec2 aboveLowerBound = greaterThanEqual(idx, ivec2(0));
          bvec2 belowUpperBound = lessThanEqual(idx, ivec2(${a}));

          bool depthInRange = aboveLowerBound.x && belowUpperBound.x;
          bool depthPlusOneInRange = aboveLowerBound.y && belowUpperBound.y;

          if(depthInRange || depthPlusOneInRange){
            vec4 z = vec4(0.);
            vec4 xFragAtCurrentDepth;
            z.xz = cache.xy;
            if(depthPlusOneInRange && hasNextCol){
              xFragAtCurrentDepth = idx.y != d ?
                getX(b, r, c, idx.y) : xFragAtOutputCoords;
              z.y = getChannel(xFragAtCurrentDepth, vec2(c, idx.y));
              if(hasNextRow){
                z.w = getChannel(xFragAtCurrentDepth, vec2(c + 1, idx.y));
              }
            }
            cache.xy = z.yw;
            sum += z * z;
          }
        }
        vec4 result = xAtOutputCoords * ${c};
        setOutput(result);
      }
    `}}const l1=n=>{const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{depthRadius:r,bias:i,alpha:a,beta:c}=s,l=v().getBool("WEBGL_PACK_NORMALIZATION")?new c1(o.shape,r,i,a,c):new a1(o.shape,r,i,a,c);return t.runWebGLProgram(l,[o],o.dtype)},u1={kernelName:eu,backendName:"webgl",kernelFunc:l1};class d1{constructor(e,t,s,o,r){this.variableNames=["inputImage","outputImage","dy"],this.outputShape=[],this.outputShape=e,this.depth=e[3],this.depthRadius=t,this.bias=s,this.alpha=o,this.beta=r,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];

        float result = 0.0;
        for (int d = 0; d < ${this.depth}; ++d) {
          int depthBegin = int(max(0.0, float(d - ${t})));
          int depthEnd = int(min(float(${this.depth}),
              float(d + ${t} + 1)));

          const int MIN_DEPTH_BEGIN = 0;
          const int MAX_DEPTH_END = ${this.depth};

          float norm = 0.0;
          for (int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k) {
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd) {
              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);
            }
            else {
              break;
            }
          }

          norm = float(${o}) * norm + float(${s});

          for(int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k){
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd){
              float dyi = -2.0 * float(${o})
                * float(${r})
                * getInputImage(b, r, c, k) * getOutputImage(b, r, c, d)
                / norm;
              if (k == d) {
                dyi += pow(norm, -1.0 * ${r});
              }
              if (k == coords[3]) {
                dyi *= getDy(b, r, c, d);
                result += dyi;
              }
            }
            else {
              break;
            }
          }
      }
      setOutput(result);
      }
    `}}const h1=n=>{const{inputs:e,backend:t,attrs:s}=n,{x:o,y:r,dy:i}=e,{depthRadius:a,bias:c,alpha:l,beta:u}=s,d=new d1(o.shape,a,c,l,u);return t.runWebGLProgram(d,[o,r,i],o.dtype)},f1={kernelName:tu,backendName:"webgl",kernelFunc:h1};function p1(n,e,t,s){const o=F(e),i=F(n.shape)/o,a=k({inputs:{x:n},attrs:{shape:[i,o]},backend:s}),c=St(a,n.dtype,"max",s),l=k({inputs:{x:c},attrs:{shape:t},backend:s});return s.disposeIntermediateTensorInfo(a),s.disposeIntermediateTensorInfo(c),l}function cc(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{reductionIndices:r,keepDims:i}=s,a=o.shape.length,c=ge(r,o.shape);let l=c;const u=Ie(l,a),d=u!=null,h=t.shouldExecuteOnCPU([o]);let f=o;if(d){if(h){const w=t.texData.get(f.dataId).values,y=new Array(a);for(let E=0;E<y.length;E++)y[E]=o.shape[u[E]];const I=ao(w,o.shape,o.dtype,u,y);f=t.makeTensorInfo(y,o.dtype);const N=t.texData.get(f.dataId);N.values=I}else f=Kn(o,u,t);l=Re(l.length,a)}Pe("max",l,a);const[p,x]=Ue(f.shape,l);let g=p;i&&(g=Ge(p,c));let m;if(h){const w=t.texData.get(f.dataId).values,y=wg(w,F(x),g,o.dtype);m=t.makeTensorInfo(g,o.dtype);const I=t.texData.get(m.dataId);I.values=y}else m=p1(f,x,g,t);return d&&t.disposeIntermediateTensorInfo(f),m}const m1={kernelName:nu,backendName:"webgl",kernelFunc:cc};const g1=co+`
  return max(a, b);
`,x1=`
  vec4 result = vec4(max(a, b));
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+$t+`
  return result;
`,C1=ie({opSnippet:g1,packedOpSnippet:x1,cpuKernelImpl:yg}),b1={kernelName:$r,backendName:"webgl",kernelFunc:C1};function w1(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e;Ut(o,"maxPool");const{filterSize:r,strides:i,pad:a,dimRoundingMode:c}=s,l=1;D(Bt(i,l),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${i} and dilations '${l}'`);const u=Lt(o.shape,r,i,l,a,c);if(u.filterWidth===1&&u.filterHeight===1&&oe(u.inShape,u.outShape))return Ce({inputs:{x:o},backend:t});const d=new ln(u,"max",!1);return t.runWebGLProgram(d,[o],o.dtype)}const y1={kernelName:su,backendName:"webgl",kernelFunc:w1};function v1(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{filterSize:r,strides:i,pad:a,dataFormat:c,dimRoundingMode:l}=s,u=[1,1,1],d=fn(o.shape,r,i,u,a,l,c),h=new uo(d,"max",!1);return t.runWebGLProgram(h,[o],o.dtype)}const $1={kernelName:ru,backendName:"webgl",kernelFunc:v1};class S1{constructor(e){this.variableNames=["dy","maxPos"],this.outputShape=e.inShape;const t=e.strideHeight,s=e.strideWidth,o=e.dilationHeight,r=e.effectiveFilterHeight,i=e.effectiveFilterWidth,a=r-1-e.padInfo.top,c=i-1-e.padInfo.left,l=r*i-1;this.userCode=`
      const ivec2 pads = ivec2(${a}, ${c});

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${r};
          wR += ${o}) {
          float dyR = float(dyRCorner + wR) / ${t}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${i}; wC++) {
            float dyC = float(dyCCorner + wC) / ${s}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);
            int maxPosValue = ${l} - int(getMaxPos(b, idyR, idyC, d));

            // Get the current value, check it against the value from the
            // position matrix.
            int curPosValue = wR * ${i} + wC;
            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

            dotProd += dyValue * mask;
          }
        }
        setOutput(dotProd);
      }
    `}}class I1{constructor(e){this.variableNames=["dy","maxPos"],this.outputShape=e.inShape;const t=e.strideDepth,s=e.strideHeight,o=e.strideWidth,r=e.dilationDepth,i=e.dilationHeight,a=e.dilationWidth,c=e.effectiveFilterDepth,l=e.effectiveFilterHeight,u=e.effectiveFilterWidth,d=c-1-e.padInfo.front,h=l-1-e.padInfo.top,f=u-1-e.padInfo.left,p=c*l*u-1;this.userCode=`
      const ivec3 pads = ivec3(${d}, ${h}, ${f});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, ch) with pos mask(:, :, :, d) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < ${c};
           wD += ${r}) {
          float dyD = float(dyDCorner + wD) / ${t}.0;

          if (dyD < 0.0 || dyD >= ${e.outDepth}.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < ${l};
              wR += ${i}) {
            float dyR = float(dyRCorner + wR) / ${s}.0;

            if (dyR < 0.0 || dyR >= ${e.outHeight}.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < ${u};
                wC += ${a}) {
              float dyC = float(dyCCorner + wC) / ${o}.0;

              if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);
              int maxPosValue = ${p} -
                  int(getMaxPos(batch, idyD, idyR, idyC, ch));

              // Get the current value, check it against the value from the
              // position matrix.
              int curPosValue =
                  wD * ${l} * ${u} +
                  wR * ${u} + wC;
              float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

              dotProd += dyValue * mask;
            }
          }
        }
        setOutput(dotProd);
      }
    `}}function R1(n){const{inputs:e,backend:t,attrs:s}=n,{dy:o,input:r}=e,i=r,{filterSize:a,strides:c,pad:l,dimRoundingMode:u}=s,d=[1,1,1],h=fn(i.shape,a,c,d,l,u),f=new uo(h,"max",!0),p=t.runWebGLProgram(f,[i],i.dtype),x=new I1(h),g=t.runWebGLProgram(x,[o,p],i.dtype);return t.disposeIntermediateTensorInfo(p),g}const T1={kernelName:iu,backendName:"webgl",kernelFunc:R1};function E1(n){const{inputs:e,backend:t,attrs:s}=n,{dy:o,input:r,output:i}=e,a=r;Ut([r,i],"maxPoolGrad");const{filterSize:c,strides:l,pad:u,dimRoundingMode:d}=s,h=Lt(a.shape,c,l,1,u,d),f=!0,p=new ln(h,"max",f),x=t.runWebGLProgram(p,[a],a.dtype),g=new S1(h),m=t.runWebGLProgram(g,[o,x],a.dtype);return t.disposeIntermediateTensorInfo(x),m}const N1={kernelName:ou,backendName:"webgl",kernelFunc:E1};function k1(n,e,t,s){let o=new ln(t,"max",!1);const r=s.runWebGLProgram(o,[n],"float32");o=new ln(t,"max",!0,!0,e);const i=s.runWebGLProgram(o,[n],"float32");return[r,i]}const A1={kernelName:au,backendName:"webgl",kernelFunc:({inputs:n,attrs:e,backend:t})=>{const{x:s}=n,{filterSize:o,strides:r,pad:i,includeBatchInIndex:a}=e,c=t;D(s.shape.length===4,()=>`Error in maxPool: input must be rank 4 but got rank ${s.shape.length}.`);const l=[1,1];D(Bt(r,l),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${r} and dilations '${l}'`);const u=Lt(s.shape,o,r,l,i),[d,h]=k1(s,a,u,c);return[d,h]}};function F1(n,e,t,s){const o=F(e),i=F(n.shape)/o,a=k({inputs:{x:n},attrs:{shape:[i,o]},backend:s}),c=St(a,"float32","mean",s),l=k({inputs:{x:c},attrs:{shape:t},backend:s});return s.disposeIntermediateTensorInfo(a),s.disposeIntermediateTensorInfo(c),l}const D1={kernelName:cu,backendName:"webgl",kernelFunc:({inputs:n,attrs:e,backend:t})=>{const{x:s}=n,{keepDims:o,axis:r}=e,i=t,a=s.shape.length,c=ge(r,s.shape);let l=c;const u=Ie(l,a),d=u!=null,h=i.shouldExecuteOnCPU([s]),f=[];let p=s;if(d){if(h){const y=i.texData.get(p.dataId).values,I=new Array(a);for(let R=0;R<I.length;R++)I[R]=s.shape[u[R]];const N=ao(y,s.shape,s.dtype,u,I);p=i.makeTensorInfo(I,s.dtype);const E=i.texData.get(p.dataId);E.values=N}else p=Kn(s,u,i);f.push(p),l=Re(l.length,a)}Pe("sum",l,a);const[x,g]=Ue(p.shape,l);let m=x;o&&(m=Ge(x,c));const C=F1(p,g,m,i);for(const w of f)i.disposeIntermediateTensorInfo(w);return C}};function O1(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{axis:r,keepDims:i}=s,a=o.shape.length,c=ge(r,o.shape);let l=c;const u=Ie(l,a);let d=o;u!=null&&(d=he({inputs:{x:o},backend:t,attrs:{perm:u}}),l=Re(l.length,o.shape.length)),Pe("min",l,a);const[h,f]=Ue(d.shape,l),p=F(f),x=k({inputs:{x:d},backend:t,attrs:{shape:[-1,p]}}),g=St(x,x.dtype,"min",t);let m;if(i){const C=Ge(h,c);m=k({inputs:{x:g},backend:t,attrs:{shape:C}})}else m=k({inputs:{x:g},backend:t,attrs:{shape:h}});return t.disposeIntermediateTensorInfo(x),t.disposeIntermediateTensorInfo(g),u!=null&&t.disposeIntermediateTensorInfo(d),m}const P1={kernelName:lu,backendName:"webgl",kernelFunc:O1};const _1=co+`
  return min(a, b);
`,L1=`
  vec4 result = vec4(min(a, b));
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+$t+`
  return result;
`,B1=ie({opSnippet:_1,packedOpSnippet:L1,cpuKernelImpl:vg}),M1={kernelName:uu,backendName:"webgl",kernelFunc:B1};class V1{constructor(e,t,s){this.variableNames=["x"],this.outputShape=t.map((u,d)=>u[0]+e[d]+u[1]);const o=e.length,r=z(o),i=t.map(u=>u[0]).join(","),a=t.map((u,d)=>u[0]+e[d]).join(","),c=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,o),l=s==="reflect"?0:1;if(o===1){this.userCode=`
        int start = ${i};
        int end = ${a};

        void main() {
          int outC = getOutputCoords();
          if (outC < start) {
            outC = start * 2 - outC - ${l};
          } else if(outC >= end) {
            outC = (end - 1) * 2 - outC + ${l};
          }
          setOutput(getX(outC - start));
        }
      `;return}this.userCode=`
      ${r} start = ${r}(${i});
      ${r} end = ${r}(${a});

      void main() {
        ${r} outC = getOutputCoords();
        for (int i = 0; i < ${o}; i++) {
          if (outC[i] < start[i]) {
            outC[i] = start[i] * 2 - outC[i] - ${l};
          } else if(outC[i] >= end[i]) {
            outC[i] = (end[i] - 1) * 2 - outC[i] + ${l};
          }
        }
        ${r} coords = outC - start;
        setOutput(getX(${c}));
      }
    `}}class U1{constructor(e,t,s){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t.map((p,x)=>p[0]+e[x]+p[1]);const o=e.length,r=z(o),i=t.map(p=>p[0]).join(","),a=t.map((p,x)=>p[0]+e[x]).join(","),c=ue("rc",o),l=ue("source",o),u=`${c[o-1]} < ${this.outputShape[o-1]}`,d=o===1?"source":`vec2(${l.slice(-2).join()})`,h=s==="reflect"?0:1;let f="";if(o===1){const p=`
        ${r} source = rc;
        if (source < start) {
          source = start * 2 - source - ${h};
        } else if (source >= end) {
          source = (end - 1) * 2 - source + ${h};
        }
        source -= start;
      `;f=`
        ${r} rc = outputLoc;
        ${p}
        result[0] = getChannel(getX(${l.join()}), ${d});
        ${c[o-1]} += 1;
        if(${u}) {
          ${p}
          result[1] = getChannel(getX(${l.join()}), ${d});
        }
      `}else{const p=`
        ${r} source = rc;
        ${r} lt = ${r}(lessThan(source, start));
        ${r} gte = ${r}(greaterThanEqual(source, end));
        ${r} orig = 1 - (lt + gte);
        source = orig * source +
                lt * (start * 2 - source - ${h}) +
                gte * ((end - 1) * 2 - source + ${h});
        source -= start;
      `;f=`
        ${r} rc = outputLoc;
        ${p}
        result[0] = getChannel(getX(${l.join()}), ${d});
        ${c[o-1]} += 1;
        if(${u}) {
          ${p}
          result[1] = getChannel(getX(${l.join()}), ${d});
        }
        rc = outputLoc;
        ${c[o-2]} += 1;
        if(${c[o-2]} < ${this.outputShape[o-2]}) {
          ${p}
          result[2] = getChannel(getX(${l.join()}), ${d});
          ${c[o-1]} += 1;
          if(${u}) {
            ${p}
            result[3] = getChannel(getX(${l.join()}), ${d});
          }
        }
      `}this.userCode=`
      const ${r} start = ${r}(${i});
      const ${r} end = ${r}(${a});

      void main() {
        ${r} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${f}
        setOutput(result);
      }
    `}}const W1=({inputs:n,backend:e,attrs:t})=>{const{x:s}=n,{paddings:o,mode:r}=t,i=v().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new U1(s.shape,o,r):new V1(s.shape,o,r);return e.runWebGLProgram(i,[s],s.dtype)},G1={kernelName:du,backendName:"webgl",kernelFunc:W1};const z1=`if (b == 0.0) return NAN;
  return mod(a, b);`,H1=`
  vec4 result = mod(a, b);
  bvec4 isNaN = equal(b, vec4(0.0));
  `+$t+`
  return result;
`,X1=ie({opSnippet:z1,packedOpSnippet:H1}),j1={kernelName:hu,backendName:"webgl",kernelFunc:X1};class q1{constructor(e,t,s){this.variableNames=["probs"],this.customUniforms=[{name:"seed",type:"float"}],this.outputShape=[e,s],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];

        float r = random(seed);
        float cdf = 0.0;

        for (int i = 0; i < ${t-1}; i++) {
          cdf += getProbs(batch, i);

          if (r < cdf) {
            setOutput(float(i));
            return;
          }
        }

        // If no other event happened, last event happened.
        setOutput(float(${t-1}));
      }
    `}}const K1=`
if (a == b) {
  return 1.0;
};
return a / b;`,Y1=`
  // vec4 one = vec4(equal(a, b));
  // return one + (vec4(1.0) - one) * a / b;
  vec4 result = a / b;
  if(a.x == b.x) {
    result.x = 1.;
  }
  if(a.y == b.y) {
    result.y = 1.;
  }
  if(a.z == b.z) {
    result.z = 1.;
  }
  if(a.w == b.w) {
    result.w = 1.;
  }

  return result;
`,lc=ie({opSnippet:K1,packedOpSnippet:Y1,checkOutOfBounds:!0}),Q1={kernelName:wr,backendName:"webgl",kernelFunc:lc};const ar="return a - b;",uc=ie({opSnippet:ar,packedOpSnippet:ar,supportsComplex:!0,cpuKernelImpl:Gg}),Z1={kernelName:Er,backendName:"webgl",kernelFunc:uc};function dc(n){const{inputs:e,backend:t,attrs:s}=n,{logits:o}=e,{dim:r}=s,i=ge([r],o.shape),a=cc({inputs:{x:o},backend:t,attrs:{reductionIndices:i,keepDims:!1}}),c=Ge(a.shape,i),l=k({inputs:{x:a},backend:t,attrs:{shape:c}}),u=uc({inputs:{a:o,b:l},backend:t}),d=rc({inputs:{x:u},backend:t}),h=Yn({inputs:{x:d},backend:t,attrs:{axis:i,keepDims:!1}}),f=k({inputs:{x:h},backend:t,attrs:{shape:c}}),p=lc({inputs:{a:d,b:f},backend:t});return t.disposeIntermediateTensorInfo(a),t.disposeIntermediateTensorInfo(l),t.disposeIntermediateTensorInfo(u),t.disposeIntermediateTensorInfo(d),t.disposeIntermediateTensorInfo(h),t.disposeIntermediateTensorInfo(f),p}const J1={kernelName:ed,backendName:"webgl",kernelFunc:dc};function ey(n){const{inputs:e,backend:t,attrs:s}=n,{logits:o}=e,{numSamples:r,seed:i,normalized:a}=s,c=a?o:dc({inputs:{logits:o},backend:t,attrs:{dim:o.shape.length-1}}),l=c.shape[0],u=c.shape[1],d=new q1(l,u,r),h=[[i]],f=t.runWebGLProgram(d,[c],"int32",h);return a||t.disposeIntermediateTensorInfo(c),f}const ty={kernelName:fu,backendName:"webgl",kernelFunc:ey};const ny=Te+`
  return -x;
`,sy=`
  vec4 result = -x;
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`;function oy(n){const{inputs:e,backend:t}=n,{x:s}=e;if(t.shouldExecuteOnCPU([s])){const r=t.texData.get(s.dataId),[i,a]=Sg(r.values,s.shape,s.dtype);return t.makeTensorInfo(a,s.dtype,i)}let o;return v().getBool("WEBGL_PACK_UNARY_OPERATIONS")?o=new Ke(s.shape,sy):o=new Le(s.shape,ny),t.runWebGLProgram(o,[s],s.dtype)}const ry={kernelName:pu,backendName:"webgl",kernelFunc:oy};const iy=tf;function ay(n){Fe("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");const{inputs:e,backend:t,attrs:s}=n,{boxes:o,scores:r}=e,{maxOutputSize:i,iouThreshold:a,scoreThreshold:c}=s,l=t.readSync(o.dataId),u=t.readSync(r.dataId),{selectedIndices:d}=iy(l,u,i,a,c);return t.makeTensorInfo([d.length],"int32",new Int32Array(d))}const cy={kernelName:gu,backendName:"webgl",kernelFunc:ay};const ly=nf;function uy(n){Fe("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");const{inputs:e,backend:t,attrs:s}=n,{boxes:o,scores:r}=e,{maxOutputSize:i,iouThreshold:a,scoreThreshold:c,padToMaxOutputSize:l}=s,u=t.readSync(o.dataId),d=t.readSync(r.dataId),{selectedIndices:h,validOutputs:f}=ly(u,d,i,a,c,l);return[t.makeTensorInfo([h.length],"int32",new Int32Array(h)),t.makeTensorInfo([],"int32",new Int32Array([f]))]}const dy={kernelName:xu,backendName:"webgl",kernelFunc:uy};const hy=sf;function fy(n){Fe("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");const{inputs:e,backend:t,attrs:s}=n,{boxes:o,scores:r}=e,{maxOutputSize:i,iouThreshold:a,scoreThreshold:c,softNmsSigma:l}=s,u=t.readSync(o.dataId),d=t.readSync(r.dataId),h=i,f=a,p=c,x=l,{selectedIndices:g,selectedScores:m}=hy(u,d,h,f,p,x);return[t.makeTensorInfo([g.length],"int32",new Int32Array(g)),t.makeTensorInfo([m.length],"float32",new Float32Array(m))]}const py={kernelName:Cu,backendName:"webgl",kernelFunc:fy};class my{constructor(e,t,s,o){this.variableNames=["indices"],this.outputShape=[e,t],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int index = round(getIndices(coords.x));
        setOutput(mix(float(${o}), float(${s}),
                      float(index == coords.y)));
      }
    `}}const gy=n=>{const{inputs:e,backend:t,attrs:s}=n,{indices:o}=e,{dtype:r,depth:i,onValue:a,offValue:c}=s,l=F(o.shape),u=new my(l,i,a,c),d=k({inputs:{x:o},backend:t,attrs:{shape:[l]}}),h=t.runWebGLProgram(u,[d],r);t.disposeIntermediateTensorInfo(d);const f=[...o.shape,i],p=k({inputs:{x:h},backend:t,attrs:{shape:f}});return t.disposeIntermediateTensorInfo(h),p},xy={kernelName:wu,backendName:"webgl",kernelFunc:gy};function Vn(n){const{inputs:e,backend:t}=n,{x:s}=e;if(s.dtype==="complex64"){const o=xn({inputs:{input:s},backend:t}),r=Vn({inputs:{x:o},backend:t}),i=Qn({inputs:{input:s},backend:t}),a=Vn({inputs:{x:i},backend:t}),c=Je({inputs:{real:r,imag:a},backend:t});return t.disposeIntermediateTensorInfo(o),t.disposeIntermediateTensorInfo(r),t.disposeIntermediateTensorInfo(i),t.disposeIntermediateTensorInfo(a),c}else return Cn({attrs:{shape:s.shape,dtype:s.dtype,value:s.dtype==="string"?"":0},backend:t})}const Cy={kernelName:kr,backendName:"webgl",kernelFunc:Vn};function hc(n){const{inputs:e,backend:t}=n,{x:s}=e;if(s.dtype==="string")throw new Error("onesLike is not supported under string dtype");if(s.dtype==="complex64"){const o=xn({inputs:{input:s},backend:t}),r=hc({inputs:{x:o},backend:t}),i=Qn({inputs:{input:s},backend:t}),a=Vn({inputs:{x:i},backend:t}),c=Je({inputs:{real:r,imag:a},backend:t});return t.disposeIntermediateTensorInfo(o),t.disposeIntermediateTensorInfo(r),t.disposeIntermediateTensorInfo(i),t.disposeIntermediateTensorInfo(a),c}else return Cn({attrs:{shape:s.shape,dtype:s.dtype,value:1},backend:t})}const by={kernelName:bu,backendName:"webgl",kernelFunc:hc};function wy(n){const{inputs:e,backend:t,attrs:s}=n,{axis:o}=s;if(e.length===1)return Fs({inputs:{input:e[0]},backend:t,attrs:{dim:o}});const r=e[0].shape,i=e[0].dtype;e.forEach(u=>{hr(r,u.shape,"All tensors passed to stack must have matching shapes"),D(i===u.dtype,()=>"All tensors passed to stack must have matching dtypes")});const a=[],c=e.map(u=>{const d=Fs({inputs:{input:u},backend:t,attrs:{dim:o}});return a.push(d),d}),l=Qa({inputs:c,backend:t,attrs:{axis:o}});return a.forEach(u=>t.disposeIntermediateTensorInfo(u)),l}const yy={kernelName:yu,backendName:"webgl",kernelFunc:wy};class vy{constructor(e,t,s){this.variableNames=["x"],this.customUniforms=[{name:"value",type:"float"}],this.outputShape=t.map((l,u)=>l[0]+e[u]+l[1]);const o=e.length,r=z(o),i=t.map(l=>l[0]).join(","),a=t.map((l,u)=>l[0]+e[u]).join(","),c=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,o);if(o===1){this.userCode=`
        int start = ${i};
        int end = ${a};

        void main() {
          int outC = getOutputCoords();
          if (outC < start || outC >= end) {
            setOutput(value);
          } else {
            setOutput(getX(outC - start));
          }
        }
      `;return}this.userCode=`
      ${r} start = ${r}(${i});
      ${r} end = ${r}(${a});

      void main() {
        ${r} outC = getOutputCoords();
        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {
          setOutput(value);
        } else {
          ${r} coords = outC - start;
          setOutput(getX(${c}));
        }
      }
    `}}class $y{constructor(e,t,s){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"value",type:"float"}],this.outputShape=t.map((x,g)=>x[0]+e[g]+x[1]);const o=e.length,r=z(o),i=t.map(x=>x[0]).join(","),a=t.map((x,g)=>x[0]+e[g]).join(","),c=ue("rc",o),l=ue("source",o),u=`${c[o-1]} < ${this.outputShape[o-1]}`,d=o===1?"source":`vec2(${l.slice(-2).join()})`,h=[`${r} rc = outputLoc;`,`${c[o-1]} += 1;
       if(${u}) {
      `,o===1?"":`}
       rc = outputLoc;
       ${c[o-2]} += 1;
       if(${c[o-2]} < ${this.outputShape[o-2]}) {`,o===1?"":`  ${c[o-1]} += 1;
         if(${u}) {`],f=o===1?"rc < start || rc >= end":"any(lessThan(rc, start)) || any(greaterThanEqual(rc, end))";let p="";for(let x=0,g=o===1?2:4;x<g;x++)p+=`
        ${h[x]}
        if (${f}) {
          result[${x}] = float(value);
        } else {
          ${r} source = rc - start;
          result[${x}] = getChannel(getX(${l.join()}), ${d});
        }
      `;p+=o===1?"} ":"}}",this.userCode=`
      const ${r} start = ${r}(${i});
      const ${r} end = ${r}(${a});

      void main() {
        ${r} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${p}
        setOutput(result);
      }
    `}}const fc=n=>{const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{paddings:r,constantValue:i}=s;if(F(o.shape)===0){const l=r.map((u,d)=>u[0]+o.shape[d]+u[1]);return Cn({backend:t,attrs:{shape:l,value:i,dtype:o.dtype}})}const a=v().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new $y(o.shape,r,i):new vy(o.shape,r,i),c=[[i]];return t.runWebGLProgram(a,[o],o.dtype,c)},Sy={kernelName:vu,backendName:"webgl",kernelFunc:fc};const Iy=`
  if(a < 0.0 && floor(b) < b){
    return NAN;
  }
  if (b == 0.0) {
    return 1.0;
  }
  return (round(mod(b, 2.0)) != 1) ?
      pow(abs(a), b) : sign(a) * pow(abs(a), b);
`,Ry=`
  // isModRound1 has 1 for components with round(mod(b, 2.0)) == 1, 0 otherwise.
  vec4 isModRound1 = vec4(equal(round(mod(b, 2.0)), ivec4(1)));
  vec4 multiplier = sign(a) * isModRound1 + (vec4(1.0) - isModRound1);
  vec4 result = multiplier * pow(abs(a), b);

  // Ensure that a^0 = 1, including 0^0 = 1 as this correspond to TF and JS
  bvec4 isExpZero = equal(b, vec4(0.0));
  result.r = isExpZero.r ? 1.0 : result.r;
  result.g = isExpZero.g ? 1.0 : result.g;
  result.b = isExpZero.b ? 1.0 : result.b;
  result.a = isExpZero.a ? 1.0 : result.a;

  bvec4 isNaN1 = lessThan(a, vec4(0.0));
  bvec4 isNaN2 = lessThan(floor(b), b);
  bvec4 isNaN = bvec4(isNaN1.x && isNaN2.x, isNaN1.y && isNaN2.y, isNaN1.z && isNaN2.z, isNaN1.w && isNaN2.w);
  `+$t+`
  return result;
`,Ty=ie({opSnippet:Iy,packedOpSnippet:Ry}),Ey={kernelName:Ir,backendName:"webgl",kernelFunc:Ty};function Ny(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{axis:r,keepDims:i}=s,a=o.shape.length,c=[],l=ge(r,o.shape);let u=l;const d=Ie(u,a);let h=o;d!=null&&(h=he({inputs:{x:o},backend:t,attrs:{perm:d}}),u=Re(u.length,a),c.push(h)),Pe("prod",u,a);let f;if(t.shouldExecuteOnCPU([h])){const p=t.texData.get(h.dataId).values,{outVals:x,outShape:g,outDtype:m}=Rg(h.shape,h.dtype,p,u);f=t.makeTensorInfo(g,m,x)}else{const[p,x]=Ue(h.shape,u),g=F(x),m=k({inputs:{x:h},backend:t,attrs:{shape:[-1,g]}}),C=Vs(o.dtype),w=St(m,C,"prod",t);f=k({inputs:{x:w},backend:t,attrs:{shape:p}}),c.push(m),c.push(w)}if(i){c.push(f);const p=Ge(f.shape,l);f=k({inputs:{x:f},backend:t,attrs:{shape:p}})}return c.forEach(p=>t.disposeIntermediateTensorInfo(p)),f}const ky={kernelName:Su,backendName:"webgl",kernelFunc:Ny};function Ay(n){const{inputs:e,backend:t,attrs:s}=n,{paramsNestedSplits:o,paramsDenseValues:r,indices:i}=e,{outputRaggedRank:a}=s,c=o.map(m=>t.readSync(m.dataId)),l=o.map(m=>m.shape),u=t.readSync(r.dataId),d=t.readSync(i.dataId),[h,f,p]=Tg(c,l,u,r.shape,r.dtype,d,i.shape,a),x=h.map(m=>t.makeTensorInfo([m.length],"int32",m)),g=t.makeTensorInfo(p,r.dtype,f);return x.concat([g])}const Fy={kernelName:Iu,backendName:"webgl",kernelFunc:Ay};function Dy(n){const{inputs:e,backend:t}=n,{starts:s,limits:o,deltas:r}=e,i=t.readSync(s.dataId),a=t.readSync(o.dataId),c=t.readSync(r.dataId),[l,u]=Eg(i,s.shape,s.dtype,a,o.shape,c,r.shape),d=t.makeTensorInfo([l.length],"int32",l),h=t.makeTensorInfo([u.length],s.dtype,u);return[d,h]}const Oy={kernelName:Ru,backendName:"webgl",kernelFunc:Dy};function Py(n){const{inputs:e,backend:t,attrs:s}=n,{shape:o,values:r,defaultValue:i,rowPartitionTensors:a}=e,{rowPartitionTypes:c}=s,l=t.readSync(o.dataId),u=t.readSync(r.dataId),d=t.readSync(i.dataId),h=a.map(g=>t.readSync(g.dataId)),f=a.map(g=>g.shape),[p,x]=Ng(l,o.shape,u,r.shape,r.dtype,d,i.shape,h,f,c);return t.makeTensorInfo(p,r.dtype,x)}const _y={kernelName:Tu,backendName:"webgl",kernelFunc:Py};const pc=n=>{const{backend:e,attrs:t}=n,{start:s,stop:o,step:r,dtype:i}=t,a=kg(s,o,r,i);return e.makeTensorInfo([a.length],i,a)},Ly={kernelName:Eu,backendName:"webgl",kernelFunc:pc};const By="return 1.0 / x;",My=V({opSnippet:By}),Vy={kernelName:ku,backendName:"webgl",kernelFunc:My};const Uy=Te+`
  return (x < 0.0) ? 0.0 : x;
`,Wy=`
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,Gy=V({opSnippet:Uy,packedOpSnippet:Wy}),zy={kernelName:Au,backendName:"webgl",kernelFunc:Gy};const Hy=Te+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,Xy=`
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,jy=V({opSnippet:Hy,packedOpSnippet:Xy}),qy={kernelName:_u,backendName:"webgl",kernelFunc:jy};class Ky{constructor(e,t,s,o,r){this.variableNames=["A"],this.outputShape=[];const[i,a,c,l]=e;this.outputShape=[i,t,s,l];const u=[o&&t>1?a-1:a,o&&s>1?c-1:c],d=[o&&t>1?t-1:t,o&&s>1?s-1:s];let h;r?h="(vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC - vec2(0.5)":h="vec2(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          ${u[0]/d[0]},
          ${u[1]/d[1]});
      const vec2 inputShapeRC = vec2(${a}.0, ${c}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = ${h};

        // Compute the four integer indices.
        ivec2 sourceFloorRC = ivec2(max(sourceFracIndexRC, vec2(0.0)));
        ivec2 sourceCeilRC = ivec2(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);
        float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);
        float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);
        float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);

        vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);

        float top = topLeft + (topRight - topLeft) * fracRC.y;
        float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;
        float newValue = top + (bottom - top) * fracRC.x;

        setOutput(newValue);
      }
    `}}class Yy{constructor(e,t,s,o,r){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[];const[i,a,c,l]=e;this.outputShape=[i,t,s,l];const u=[o&&t>1?a-1:a,o&&s>1?c-1:c],d=[o&&t>1?t-1:t,o&&s>1?s-1:s];let h;r?h="(vec3(yRC) + vec3(0.5)) * effectiveInputOverOutputRatioRC - vec3(0.5)":h="vec3(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          ${u[0]/d[0]},
          ${u[1]/d[1]},
          ${u[1]/d[1]});
      const vec3 inputShapeRC = vec3(${a}.0, ${c}.0,
                                     ${c}.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = ${h};

        // Compute the four integer indices.
        ivec3 sourceFloorRC = ivec3(max(sourceFracIndexRC, vec3(0.0)));
        ivec3 sourceCeilRC = ivec3(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < ${l-1};
        bool hasNextRow = coords.z < ${s-1};

        // In parallel, construct four corners for all four components in
        // packed 2x2 cell.
        vec4 topLeft = vec4(
          getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 bottomLeft = vec4(
          getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 topRight = vec4(
          getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec4 bottomRight = vec4(
          getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec3 fracRC = sourceFracIndexRC - vec3(sourceFloorRC);

        vec4 top = mix(topLeft, topRight, fracRC.yyzz);
        vec4 bottom = mix(bottomLeft, bottomRight, fracRC.yyzz);
        vec4 newValue = mix(top, bottom, fracRC.x);

        setOutput(newValue);
      }
    `}}function Qy(n){const{inputs:e,backend:t,attrs:s}=n,{images:o}=e,{alignCorners:r,halfPixelCenters:i,size:a}=s,[c,l]=a,u=v().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new Yy(o.shape,c,l,r,i):new Ky(o.shape,c,l,r,i);return t.runWebGLProgram(u,[o],"float32")}const Zy={kernelName:Ou,backendName:"webgl",kernelFunc:Qy};class Jy{constructor(e,t,s){this.variableNames=["dy"],this.outputShape=[],this.outputShape=t;const[,o,r]=t,[,i,a]=e,c=[s&&i>1?o-1:o,s&&a>1?r-1:r],l=[s&&i>1?i-1:i,s&&a>1?a-1:a],u=c[0]/l[0],d=c[1]/l[1],h=1/u,f=1/d,p=Math.ceil(h)*2+2,x=Math.ceil(f)*2+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(${u});
        const float widthScale = float(${d});

        const float invHeightScale = float(${h});
        const float invWidthScale = float(${f});

        const int winHeight = int(${p});
        const int winWidth = int(${x});

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(startRLerp - float(winHeight / 2));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(startCLerp - float(winWidth / 2));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${i}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${a}) {
              continue;
            }

            float dxR = float(dyR) * heightScale;
            int topDxRIndex = int(floor(dxR));
            int bottomDxRIndex = int(min(ceil(dxR), ${o-1}.0));
            float dxRLerp = dxR - float(topDxRIndex);
            float inverseDxRLerp = 1.0 - dxRLerp;

            float dxC = float(dyC) * widthScale;
            int leftDxCIndex = int(floor(dxC));
            int rightDxCIndex = int(min(ceil(dxC), ${r-1}.0));
            float dxCLerp = dxC - float(leftDxCIndex);
            float inverseDxCLerp = 1.0 - dxCLerp;

            if (r == topDxRIndex && c == leftDxCIndex) {
              // topLeft
              accumulator +=
                getDy(b, dyR, dyC, d) * inverseDxRLerp * inverseDxCLerp;
            }

            if (r == topDxRIndex && c == rightDxCIndex) {
              // topRight
              accumulator += getDy(b, dyR, dyC, d) * inverseDxRLerp * dxCLerp;
            }

            if (r == bottomDxRIndex && c == leftDxCIndex) {
              // bottomLeft
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * inverseDxCLerp;
            }

            if (r == bottomDxRIndex && c == rightDxCIndex) {
              // bottomRight
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * dxCLerp;
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `}}function ev(n){const{inputs:e,backend:t,attrs:s}=n,{images:o,dy:r}=e,{alignCorners:i}=s,a=new Jy(r.shape,o.shape,i);return t.runWebGLProgram(a,[r],r.dtype)}const tv={kernelName:Pu,backendName:"webgl",kernelFunc:ev};class nv{constructor(e,t,s,o,r){this.variableNames=["A"],this.outputShape=[];const[i,a,c,l]=e;this.outputShape=[i,t,s,l];const u=[o&&t>1?a-1:a,o&&s>1?c-1:c],d=[o&&t>1?t-1:t,o&&s>1?s-1:s],h=o?"0.5":"0.0";let f;r?f="max((vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC, vec2(0.0))":f="vec2(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          ${u[0]/d[0]},
          ${u[1]/d[1]});
      const vec2 inputShapeRC = vec2(${a}.0, ${c}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = ${f};

        // Compute the coordinators of nearest neighbor point.
        ivec2 sourceNearestRC = ivec2(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${h})));
        float newValue = getA(b, sourceNearestRC.x, sourceNearestRC.y, d);

        setOutput(newValue);
      }
    `}}class sv{constructor(e,t,s,o,r){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[];const[i,a,c,l]=e;this.outputShape=[i,t,s,l];const u=[o&&t>1?a-1:a,o&&s>1?c-1:c],d=[o&&t>1?t-1:t,o&&s>1?s-1:s],h=o?"0.5":"0.0";let f;r?f="max((vec3(yRC) + vec3(0.5)) * effectiveInputOverOutputRatioRC, vec3(0.0))":f="vec3(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          ${u[0]/d[0]},
          ${u[1]/d[1]},
          ${u[1]/d[1]});
      const vec3 inputShapeRC = vec3(${a}.0, ${c}.0,
                                     ${c}.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = ${f};

        // Compute the coordinators of nearest neighbor point.
        ivec3 sourceNearestRC = ivec3(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${h})));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < ${l-1};
        bool hasNextRow = coords.z < ${s-1};

        vec4 newValue = vec4(
          getAValue(b, sourceNearestRC.x, sourceNearestRC.y, d),
          hasNextCol ? getAValue(b, sourceNearestRC.x, sourceNearestRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceNearestRC.x, sourceNearestRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceNearestRC.x, sourceNearestRC.z, d + 1) : 0.0);

        setOutput(newValue);
      }
    `}}function ov(n){const{inputs:e,backend:t,attrs:s}=n,{images:o}=e,{alignCorners:r,halfPixelCenters:i,size:a}=s,[c,l]=a,u=v().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new sv(o.shape,c,l,r,i):new nv(o.shape,c,l,r,i);return t.runWebGLProgram(u,[o],o.dtype)}const rv={kernelName:Fu,backendName:"webgl",kernelFunc:ov};class iv{constructor(e,t,s){this.variableNames=["dy"],this.outputShape=[],this.outputShape=t;const[,o,r]=t,[,i,a]=e,c=[s&&i>1?o-1:o,s&&a>1?r-1:r],l=[s&&i>1?i-1:i,s&&a>1?a-1:a],u=c[0]/l[0],d=c[1]/l[1],h=1/u,f=1/d,p=Math.ceil(h)*2+2,x=Math.ceil(f)*2+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(${u});
        const float widthScale = float(${d});

        const float invHeightScale = float(${h});
        const float invWidthScale = float(${f});

        const int winHeight = int(${p});
        const int winWidth = int(${x});

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(floor(startRLerp - float(winHeight / 2)));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(floor(startCLerp - float(winWidth / 2)));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${i}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${a}) {
              continue;
            }

            float sourceFracRow =
              float(${c[0]}) *
                (float(dyR) / float(${l[0]}));

            float sourceFracCol =
                float(${c[1]}) *
                  (float(dyC) / float(${l[1]}));

            int sourceNearestRow = int(min(
                float(int(${o}) - 1),
                ${s} ? float(round(sourceFracRow)) :
                                  float(floor(sourceFracRow))));

            int sourceNearestCol = int(min(
                float(int(${r}) - 1),
                ${s} ? float(round(sourceFracCol)) :
                                  float(floor(sourceFracCol))));

            if (r == sourceNearestRow && c == sourceNearestCol) {
              accumulator += getDy(b, dyR, dyC, d);
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `}}function av(n){const{inputs:e,backend:t,attrs:s}=n,{images:o,dy:r}=e,{alignCorners:i}=s,a=new iv(r.shape,o.shape,i);return t.runWebGLProgram(a,[r],r.dtype)}const cv={kernelName:Du,backendName:"webgl",kernelFunc:av};class lv{constructor(e,t){this.variableNames=["x"];const s=e.length;if(s>4)throw new Error(`WebGL backend: Reverse of rank-${s} tensor is not yet supported`);if(this.outputShape=e,s===1){this.userCode=`
        void main() {
          int coord = getOutputCoords();
          setOutput(getX(${e[0]} - coord - 1));
        }
      `;return}const o=a=>t.indexOf(a)!==-1&&e[a]!==1?`${e[a]} - coords[${a}] - 1`:`coords[${a}]`,r=e.map((a,c)=>o(c)).join(","),i=z(s);this.userCode=`
      void main() {
        ${i} coords = getOutputCoords();
        setOutput(getX(${r}));
      }
    `}}class uv{constructor(e,t){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0;const s=e.length;if(s>4)throw new Error(`WebGL backend: Reverse of rank-${s} tensor is not yet supported`);this.outputShape=e;const o=ue("rc",s),r=`${o[s-1]} + 1 < ${this.outputShape[s-1]}`,i=`${o[s-2]} + 1 < ${this.outputShape[s-2]}`,a=z(s);s===1?this.userCode=`
        void main(){
          int rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = getChannel(getX(${e[0]} - rc - 1),
            ${e[0]} - rc - 1);
          if(${r}){
              result.g = getChannel(getX(${e[0]} - (rc  + 1) - 1),
                ${e[0]} - (rc  + 1) - 1);
          }
          setOutput(result);
        }
      `:this.userCode=`
        void main() {
          ${a} rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = ${c(o.slice())};
          if(${r}){
            result.g = ${l(o.slice())};
          }
          if(${i}) {
            result.b = ${u(o.slice())};
            if(${r}) {
              result.a = ${d(o.slice())};
            }
          }
          setOutput(result);
        }
    `;function c(p){return h(p)}function l(p){return p[s-1]="("+p[s-1]+" + 1)",h(p)}function u(p){return p[s-2]="("+p[s-2]+" + 1)",h(p)}function d(p){return p[s-1]="("+p[s-1]+" + 1)",p[s-2]="("+p[s-2]+" + 1)",h(p)}function h(p){const x=e.map((C,w)=>f(w,p)),g=x.join(","),m=x.slice(-2).join(",");return`getChannel(getX(${g}), vec2(${m}))`}function f(p,x){return t.indexOf(p)!==-1&&e[p]!==1?`${e[p]} - ${x[p]} - 1`:`${x[p]}`}}}function dv(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{dims:r}=s,i=o.shape.length,a=ge(r,o.shape);if(i===0)return Ce({inputs:{x:o},backend:t});const c=v().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new uv(o.shape,a):new lv(o.shape,a);return t.runWebGLProgram(c,[o],o.dtype)}const hv={kernelName:Lu,backendName:"webgl",kernelFunc:dv};class fv{constructor(e,t){this.variableNames=["Image"],this.outputShape=[],this.customUniforms=[{name:"params",type:"vec4"}];const s=e[1],o=e[2];this.outputShape=e;let r="";typeof t=="number"?r=`float outputValue = ${t.toFixed(2)};`:r=`
        vec3 fill = vec3(${t.join(",")});
        float outputValue = fill[coords[3]];`,this.userCode=`
        void main() {
          ivec4 coords = getOutputCoords();
          int x = coords[2];
          int y = coords[1];
          float coordXFloat = (float(x) - params[0]) * params[3] -
            (float(y) - params[1]) * params[2];
          float coordYFloat = (float(x) - params[0]) * params[2] +
            (float(y) - params[1]) * params[3];
          int coordX = int(round(coordXFloat + params[0]));
          int coordY = int(round(coordYFloat + params[1]));
          ${r}
          if(coordX >= 0 && coordX < ${o} && coordY >= 0 && coordY < ${s}) {
            outputValue = getImage(coords[0], coordY, coordX, coords[3]);
          }
          setOutput(outputValue);
        }
    `}}const pv={kernelName:$d,backendName:"webgl",kernelFunc:({inputs:n,attrs:e,backend:t})=>{const{image:s}=n,{radians:o,fillValue:r,center:i}=e,a=t,c=new fv(s.shape,r),[l,u]=pi(i,s.shape[1],s.shape[2]),d=[[l,u,Math.sin(o),Math.cos(o)]];return a.runWebGLProgram(c,[s],s.dtype,d)}};const mv=`
  // OpenGL ES does not support round function.
  // The algorithm is based on banker's rounding.
  float base = floor(x);
  if ((x - base) < 0.5) {
    return floor(x);
  } else if ((x - base) > 0.5) {
    return ceil(x);
  } else {
    if (mod(base, 2.0) == 0.0) {
      return base;
    } else {
      return base + 1.0;
    }
  }
`,gv=V({opSnippet:mv}),xv={kernelName:Bu,backendName:"webgl",kernelFunc:gv};const Cv="return inversesqrt(x);",bv=V({opSnippet:Cv,cpuKernelImpl:Ag}),wv={kernelName:Mu,backendName:"webgl",kernelFunc:bv};class ho{constructor(e,t,s,o,r,i,a=!0,c=!1){this.variableNames=["updates","indices","defaultValue"],this.outputShape=i;const l=z(r.length),u=z(i.length);let d="";s===1?d="i":s===2&&(d="i, j");const h=`getIndices(${d})`;let f="";o===1?f="i":o===2&&(f="i, coords[1]");const p=`getUpdates(${f})`;let x="";c&&(x="coords[0], coords[1]");const g=`getDefaultValue(${x})`,m=t>1?"strides[j]":"strides";this.userCode=`
        ${l} strides = ${l}(${r});

        void main() {
          ${u} coords = getOutputCoords();
          float sum = 0.0;
          bool found = false;
          for (int i = 0; i < ${e}; i++) {
            int flattenedIndex = 0;
            for (int j = 0; j < ${t}; j++) {
              int index = round(${h});
              flattenedIndex += index * ${m};
            }
            if (flattenedIndex == coords[0]) {
              sum += ${p};
              found = true;
            }
          }
          setOutput(mix(${g}, sum, float(found)));
        }
      `}}class yv{constructor(e,t,s,o,r,i,a=!0,c=!1){this.variableNames=["updates","indices","defaultValue"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=i;const l=z(r.length),u=z(i.length);let d="";s===1?d="i":s===2&&(d="i, j");const h=`getIndices(${d})`;let f="";o===1?f="i":o===2&&(f="i, coords[1]");const p=`getUpdates(${f})`;let x="";c&&(x="coords[0], coords[1]");const g=`getDefaultValue(${x})`,m=t>1?"strides[j]":"strides",C=t>1?"strides[j + 1]":"strides";this.userCode=`
        ${l} strides = ${l}(${r});

        void main() {
          ${u} coords = getOutputCoords();
          vec4 sum = vec4(0.);
          vec4 found = vec4(0.);
          for (int i = 0; i < ${e}; i+=2) {
            ivec2 flattenedIndex = ivec2(0);
            for (int j = 0; j < ${t}; j+=2) {
              ivec4 index = round(${h});
              flattenedIndex += index.xz * ${m};
              if (j + 1 < ${t}) {
                flattenedIndex += index.yw * ${C};
              }
            }
            if (flattenedIndex[0] == coords[0] || flattenedIndex[1] == coords[0] ||
                flattenedIndex[0] == coords[0] + 1 || flattenedIndex[1] == coords[0] + 1) {
              vec4 updVals = ${p};
              if (flattenedIndex[0] == coords[0]) {
                sum.xy += updVals.xy;
                found.xy = vec2(1.);
              } else if (flattenedIndex[0] == coords[0] + 1) {
                sum.zw += updVals.xy;
                found.zw = vec2(1.);
              }
              if (flattenedIndex[1] == coords[0]) {
                sum.xy += updVals.zw;
                found.xy = vec2(1.);
              } else if (flattenedIndex[1] == coords[0] + 1) {
                sum.zw += updVals.zw;
                found.zw = vec2(1.);
              }
            }
          }
          setOutput(mix(${g}, sum, found));
        }
      `}}function vv(n){const{inputs:e,backend:t,attrs:s}=n,{indices:o,updates:r}=e,{shape:i}=s,{sliceRank:a,numUpdates:c,sliceSize:l,strides:u,outputSize:d}=Hn(r,o,i),h=[d/l,l];if(d===0)return t.makeTensorInfo(i,o.dtype);const f=k({inputs:{x:o},backend:t,attrs:{shape:[c,a]}}),p=k({inputs:{x:r},backend:t,attrs:{shape:[c,l]}}),x=t.makeTensorInfo([],"float32",new Float32Array([0]));let g;v().getBool("WEBGL_PACK")?g=new yv(c,a,f.shape.length,p.shape.length,u,h):g=new ho(c,a,f.shape.length,p.shape.length,u,h);const m=t.runWebGLProgram(g,[p,f,x],p.dtype),C=k({inputs:{x:m},backend:t,attrs:{shape:i}});return t.disposeIntermediateTensorInfo(f),t.disposeIntermediateTensorInfo(p),t.disposeIntermediateTensorInfo(m),t.disposeIntermediateTensorInfo(x),C}const $v={kernelName:Vu,backendName:"webgl",kernelFunc:vv};class Sv{constructor(e,t,s,o){this.variableNames=["sortedSequence","values"],this.customUniforms=[{name:"numInputs",type:"int"}],this.outputShape=[e,s];const r="while (left < right) {",i=`for (int i = 0; i < ${Math.ceil(Math.log2(t+1))}; ++i) { if (left >= right) break;`,a=v().getNumber("WEBGL_VERSION")===2?r:i,c=o==="left"?"<":"<=";this.userCode=`
       int findBound(int batch, float value) {
         int left = 0;
         int right = numInputs;
         int mid;
         ${a}
           mid = (left + right) / 2;
           if (getSortedSequence(batch, mid) ${c} value) {
             left = mid + 1;
           } else {
             right = mid;
           }
         }
         return right;
       }

       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int valueIndex = coords[1];

         float value = getValues(batch, valueIndex);

         setOutput(float(findBound(batch, value)));
       }
     `}}function Iv(n){const{inputs:e,backend:t,attrs:s}=n,{sortedSequence:o,values:r}=e,{side:i}=s,a=new Sv(o.shape[0],o.shape[1],r.shape[1],i),c=[[o.shape[1]]];return t.runWebGLProgram(a,[o,r],"int32",c)}const Rv={kernelName:Wu,backendName:"webgl",kernelFunc:Iv};class Tv{constructor(e,t,s){this.variableNames=["c","a","b"],this.outputShape=t;let o,r;if(s>4)throw Error(`Where for rank ${s} is not yet supported`);if(s===1)r="resRC",o="resRC";else{const a=["resRC.x","resRC.y","resRC.z","resRC.w"],c=[],l=[];for(let u=0;u<t.length;u++)l.push(`${a[u]}`),u<e&&c.push(`${a[u]}`);o=c.join(),r=l.join()}const i=z(s);this.userCode=`
      void main() {
        ${i} resRC = getOutputCoords();
        float cVal = getC(${o});
        if (cVal >= 1.0) {
          setOutput(getA(${r}));
        } else {
          setOutput(getB(${r}));
        }
      }
    `}}function Ev(n){const{inputs:e,backend:t}=n,{condition:s,t:o,e:r}=e,i=new Tv(s.shape.length,o.shape,o.shape.length);return t.runWebGLProgram(i,[s,o,r],Ve(o.dtype,r.dtype))}const Nv={kernelName:Gu,backendName:"webgl",kernelFunc:Ev};const kv=`
  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.
  // see: https://arxiv.org/abs/1706.02515
  float scaleAlpha = ${xi};
  float scale = ${Ci};
  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);
`,Av=V({opSnippet:kv}),Fv={kernelName:zu,backendName:"webgl",kernelFunc:Av};const Dv=jt+`
  return 1.0 / (1.0 + exp(-1.0 * x));
`,Ov=`
  vec4 result = 1.0 / (1.0 + exp(-1.0 * x));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,Pv=V({opSnippet:Dv,packedOpSnippet:Ov,cpuKernelImpl:Dg}),_v={kernelName:Ku,backendName:"webgl",kernelFunc:Pv};const Lv=`
  if (isnan(x)) { return 0.0; }
  return sign(x);
`,Bv=V({opSnippet:Lv}),Mv={kernelName:qu,backendName:"webgl",kernelFunc:Bv};const Vv=jt+`
  return sin(x);
`,Uv=`
  vec4 result = sin(x);
  bvec4 isNaN = isnan(x);
  ${$t}
  return result;
`,Wv=V({opSnippet:Vv,packedOpSnippet:Uv}),Gv={kernelName:Xu,backendName:"webgl",kernelFunc:Wv};const zv=`
  float e2x = exp(x);
  return (e2x - 1.0 / e2x) / 2.0;
`,Hv=V({opSnippet:zv}),Xv={kernelName:ju,backendName:"webgl",kernelFunc:Hv};const jv=`
  float epsilon = 1.1920928955078125e-7;
  float threshold = log(epsilon) + 2.0;

  bool too_large = x > -threshold;
  bool too_small = x < threshold;

  float result;
  float exp_x = exp(x);

  if (too_large){
    result = x;
  }
  else if (too_small){
    result = exp_x;
  }
  else{
    result = log(exp_x + 1.0);
  }
  return result;
`,qv=V({opSnippet:jv}),Kv={kernelName:Yu,backendName:"webgl",kernelFunc:qv};const Yv=n=>{const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{blockShape:r,paddings:i}=s;D(o.shape.length<=4,()=>"spaceToBatchND for rank > 4 with a WebGL backend not implemented yet");const a=r.reduce((m,C)=>m*C),c=[[0,0]];c.push(...i);for(let m=1+r.length;m<o.shape.length;++m)c.push([0,0]);const l=[],u=fc({inputs:{x:o},backend:t,attrs:{paddings:c,constantValue:0}}),d=qs(u.shape,r,a,!1),h=Ks(d.length,r.length,!1),f=Ys(u.shape,r,a,!1),p=k({inputs:{x:u},backend:t,attrs:{shape:d}}),x=he({inputs:{x:p},backend:t,attrs:{perm:h}}),g=k({inputs:{x},backend:t,attrs:{shape:f}});return l.push(u),l.push(p),l.push(x),l.forEach(m=>t.disposeIntermediateTensorInfo(m)),g},Qv={kernelName:Zu,backendName:"webgl",kernelFunc:Yv};function Zv(n){const{inputs:e,backend:t}=n,{indices:s,values:o,denseShape:r,defaultValue:i}=e;if(r.shape.length!==1)throw new Error(`Dense shape must be a vector, saw:
         ${r.shape}`);if(s.shape.length!==2)throw new Error(`Indices must be a matrix, saw:
         ${s.shape}`);if(o.shape.length!==1)throw new Error(`Values must be a vector, saw:
         ${o.shape}`);if(i.shape.length!==0)throw new Error(`Default value must be a scalar, saw:
        ${i.shape}`);const a=t.readSync(s.dataId),c=t.readSync(o.dataId),l=t.readSync(r.dataId),u=t.readSync(i.dataId)[0],[d,h,f,p,x]=Pg(a,s.shape,s.dtype,c,o.dtype,l,u);return[t.makeTensorInfo(h,s.dtype,d),t.makeTensorInfo([h[0]],o.dtype,f),t.makeTensorInfo([p.length],"bool",new Uint8Array(p.map(g=>Number(g)))),t.makeTensorInfo([x.length],s.dtype,new Int32Array(x))]}const Jv={kernelName:td,backendName:"webgl",kernelFunc:Zv};function e$(n){const{inputs:e,backend:t}=n,{inputIndices:s,inputShape:o,newShape:r}=e;if(s.shape.length!==2)throw new Error(`Input indices should be a matrix but received shape ${s.shape}`);if(o.shape.length!==1)throw new Error(`Input shape should be a vector but received shape ${o.shape}`);if(r.shape.length!==1)throw new Error(`Target shape should be a vector but received shape ${r.shape}`);const i=Array.from(t.readSync(o.dataId)),a=t.readSync(s.dataId),c=Array.from(t.readSync(r.dataId)),[l,u,d]=_g(a,s.shape,s.dtype,i,c);return[t.makeTensorInfo(u,s.dtype,l),t.makeTensorInfo([d.length],r.dtype,new Int32Array(d))]}const t$={kernelName:nd,backendName:"webgl",kernelFunc:e$};function n$(n){const{inputs:e,backend:t}=n,{data:s,indices:o,segmentIds:r}=e;if(s.shape.length<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(o.shape.length!==1)throw new Error(`Indices should be a vector but received shape
              ${o.shape}`);if(r.shape.length!==1)throw new Error(`Segment ids should be a vector but received shape
              ${r.shape}`);const i=t.readSync(s.dataId),a=t.readSync(o.dataId),c=t.readSync(r.dataId),[l,u]=Ba(i,s.shape,s.dtype,a,c,!0);return t.makeTensorInfo(u,s.dtype,l)}const s$={kernelName:sd,backendName:"webgl",kernelFunc:n$};function o$(n){const{inputs:e,backend:t}=n,{data:s,indices:o,segmentIds:r}=e;if(s.shape.length<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(o.shape.length!==1)throw new Error(`Indices should be a vector but received shape
             ${o.shape}`);if(r.shape.length!==1)throw new Error(`Segment ids should be a vector but received shape
             ${r.shape}`);const i=t.readSync(s.dataId),a=t.readSync(o.dataId),c=t.readSync(r.dataId),[l,u]=Ba(i,s.shape,s.dtype,a,c);return t.makeTensorInfo(u,s.dtype,l)}const r$={kernelName:od,backendName:"webgl",kernelFunc:o$};function i$(n){const{inputs:e,backend:t,attrs:s}=n,{sparseIndices:o,sparseValues:r,defaultValue:i}=e,{outputShape:a}=s,{sliceRank:c,numUpdates:l,sliceSize:u,strides:d,outputSize:h}=Hn(r,o,a),f=!1;if(r.dtype==="string"){const m=t.bufferSync(o),C=t.bufferSync(r),w=Ft(t.readSync(i.dataId)[0]),y=Fg(m,C,a,h,u,l,c,d,w,f);return t.makeTensorInfo(a,y.dtype,y.values)}const p=new ho(l,c,o.shape.length,r.shape.length,d,[h,1],f),x=t.runWebGLProgram(p,[r,o,i],r.dtype),g=k({inputs:{x},backend:t,attrs:{shape:a}});return t.disposeIntermediateTensorInfo(x),g}const a$={kernelName:rd,backendName:"webgl",kernelFunc:i$};function c$(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{numOrSizeSplits:r,axis:i}=s,a=ge(i,o.shape)[0],c=ki(o,r,a),l=o.shape.length,u=new Array(l).fill(0),d=o.shape.slice();return c.map(h=>{const f=[...d];f[a]=h;const p=qt({inputs:{x:o},backend:t,attrs:{begin:u,size:f}});return u[a]+=h,p})}const l$={kernelName:Ju,backendName:"webgl",kernelFunc:c$};const cr="return sqrt(x);",u$=V({opSnippet:cr,packedOpSnippet:cr,cpuKernelImpl:Lg}),d$={kernelName:Tr,backendName:"webgl",kernelFunc:u$};const h$="return x * x;",f$=V({opSnippet:h$}),p$={kernelName:ad,backendName:"webgl",kernelFunc:f$};const lr="return (a - b) * (a - b);",m$=ie({opSnippet:lr,packedOpSnippet:lr}),g$={kernelName:id,backendName:"webgl",kernelFunc:m$};function x$(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e;if(o.dtype!=="string")throw new Error("Input must be of datatype string");const r=t.readSync(o.dataId),i=Pt(r),a=Bg(i,"string",s);return t.makeTensorInfo(o.shape,"string",a)}const C$={kernelName:cd,backendName:"webgl",kernelFunc:x$};function b$({inputs:n,attrs:e,backend:t}){const{x:s}=n,o=Te+`
    return x > 0.0 ? 1.0 : float(${e.alpha});
  `,r=new Le(s.shape,o);return t.runWebGLProgram(r,[s],s.dtype)}const w$={kernelName:yd,backendName:"webgl",kernelFunc:b$};class y${constructor(e,t,s){this.variableNames=["x"],this.outputShape=s;const o=s.length,r=z(s.length),i=z(s.length);let a="";if(o===1)a="coords * strides + begin";else{let c=0;a=s.map((l,u)=>(c++,s.length===1?`coords * strides[${u}] + begin[${u}]`:`coords[${c-1}] * strides[${u}] + begin[${u}]`)).join(",")}this.userCode=`
      ${r} begin = ${r}(${e});
      ${r} strides = ${r}(${t});

      void main() {
        ${i} coords = getOutputCoords();
        setOutput(getX(${a}));
      }
    `}}function v$(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{begin:r,end:i,strides:a,beginMask:c,endMask:l,ellipsisMask:u,newAxisMask:d,shrinkAxisMask:h}=s,{finalShapeSparse:f,finalShape:p,isIdentity:x,sliceDim0:g,isSimpleSlice:m,begin:C,end:w,strides:y}=Of(o.shape,r,i,a,c,l,u,d,h);let I;if(x)I=k({inputs:{x:o},backend:t,attrs:{shape:p}});else if(g||m){D(o.shape.length>=1,()=>`Input must have rank at least 1, got: ${o.shape.length}`);const E=Ff(C,w,y),R=qt({inputs:{x:o},backend:t,attrs:{begin:C,size:E}});I=k({inputs:{x:R},backend:t,attrs:{shape:p}}),t.disposeIntermediateTensorInfo(R)}else if(t.shouldExecuteOnCPU([o])){const R=t.readSync(o.dataId),S=re(o.shape,o.dtype,R),$=Mg(f,S,y,C);I=t.makeTensorInfo(p,o.dtype,$.values)}else{const R=new y$(C,y,f);I=t.runWebGLProgram(R,[o],o.dtype)}const N=k({inputs:{x:I},backend:t,attrs:{shape:p}});return t.disposeIntermediateTensorInfo(I),N}const $$={kernelName:ld,backendName:"webgl",kernelFunc:v$};function S$(n){const{inputs:e,backend:t,attrs:s}=n,{separator:o,nGramWidths:r,leftPad:i,rightPad:a,padWidth:c,preserveShortSequences:l}=s,{data:u,dataSplits:d}=e,h=t.readSync(u.dataId),f=t.readSync(d.dataId),[p,x]=Vg(h,f,o,r,i,a,c,l);return[t.makeTensorInfo([p.length],"string",p),t.makeTensorInfo(d.shape,"int32",x)]}const I$={kernelName:ud,backendName:"webgl",kernelFunc:S$};function R$(n){const{inputs:e,backend:t,attrs:s}=n,{skipEmpty:o}=s,{input:r,delimiter:i}=e;if(r.dtype!=="string")throw new Error("Input must be of datatype string");if(r.shape.length!==1)throw new Error(`Input must be a vector, got shape: ${r.shape}`);if(i.shape.length!==0)throw new Error(`Delimiter must be a scalar, got shape: ${i.shape}`);const a=t.readSync(r.dataId),c=t.readSync(i.dataId)[0],[l,u,d]=Ug(a,c,o),h=u.length;return[t.makeTensorInfo([h,2],"int32",l),t.makeTensorInfo([h],"string",u),t.makeTensorInfo([2],"int32",new Int32Array(d))]}const T$={kernelName:dd,backendName:"webgl",kernelFunc:R$};function E$(n){const{inputs:e,backend:t,attrs:s}=n,{numBuckets:o}=s,{input:r}=e;if(r.dtype!=="string")throw new Error("Input must be of datatype string");if(o<=0)throw new Error("Number of buckets must be at least 1");const i=t.readSync(r.dataId),a=Wg(i,o);return t.makeTensorInfo(r.shape,"int32",a)}const N$={kernelName:hd,backendName:"webgl",kernelFunc:E$};const k$="return tan(x);",A$=V({opSnippet:k$}),F$={kernelName:fd,backendName:"webgl",kernelFunc:A$};const D$=`
  float e2x = exp(-2.0 * abs(x));
  return sign(x) * (1.0 - e2x) / (1.0 + e2x);
`,O$=V({opSnippet:D$}),P$={kernelName:pd,backendName:"webgl",kernelFunc:O$};function _$(n){const{inputs:e,backend:t,attrs:s}=n,{tensor:o,indices:r,updates:i}=e,{sliceRank:a,numUpdates:c,sliceSize:l,strides:u,outputSize:d}=Hn(i,r,o.shape),h=[d/l,l];if(d===0)return t.makeTensorInfo(o.shape,r.dtype);const f=k({inputs:{x:r},backend:t,attrs:{shape:[c,a]}}),p=k({inputs:{x:i},backend:t,attrs:{shape:[c,l]}}),x=k({inputs:{x:o},backend:t,attrs:{shape:h}}),g=new ho(c,a,f.shape.length,p.shape.length,u,h,!1,!0),m=t.runWebGLProgram(g,[p,f,x],x.dtype),C=k({inputs:{x:m},backend:t,attrs:{shape:o.shape}});return t.disposeIntermediateTensorInfo(f),t.disposeIntermediateTensorInfo(p),t.disposeIntermediateTensorInfo(x),t.disposeIntermediateTensorInfo(m),C}const L$={kernelName:Uu,backendName:"webgl",kernelFunc:_$};class B${constructor(e,t){this.variableNames=["A"];const s=new Array(e.length);for(let i=0;i<s.length;i++)s[i]=e[i]*t[i];this.outputShape=s,this.rank=s.length;const o=z(this.rank),r=M$(e);this.userCode=`
      void main() {
        ${o} resRC = getOutputCoords();
        setOutput(getA(${r}));
      }
    `}}function M$(n){const e=n.length;if(e>5)throw Error(`Tile for rank ${e} is not yet supported`);if(e===1)return`imod(resRC, ${n[0]})`;const t=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u"],s=[];for(let o=0;o<n.length;o++)s.push(`imod(${t[o]}, ${n[o]})`);return s.join()}function mc(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{reps:r}=s;if(o.dtype==="string"||o.shape.length>5){const c=t.readSync(o.dataId),l=o.dtype==="string"?c.map(h=>Ft(h)):c,u=re(o.shape,o.dtype,l),d=zg(u,r);return t.makeTensorInfo(d.shape,d.dtype,d.values)}const i=new B$(o.shape,r);return t.runWebGLProgram(i,[o],o.dtype)}const V$={kernelName:Nr,backendName:"webgl",kernelFunc:mc};class U${constructor(e){this.variableNames=["x","indices"],this.customUniforms=[{name:"n",type:"int"},{name:"firstPass",type:"int"},{name:"negativeInf",type:"float"},{name:"dir",type:"int"},{name:"inc",type:"int"}],this.outputShape=e,this.userCode=`
       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int elemIdx = coords[1];

         // We compare elements pair-wise within a group of size 2 * inc.
         // The comparing rule for each group alternates between ascending
         // and descending. Within each group, we compare each pair at
         // positions i and i+inc. To decide whether an element at position i
         // is x0 or x1, we mod it by 2 * inc, if the result is smaller than
         // inc, it is in the first half of the group, we denote it as x0,
         // otherwise we denote it as x1.
         // For example, as shown in the Bitonic top K paper referenced above,
         // Figure5(a) shows that element[1] is in the
         // second half of the group when group size is 2, but it is in the
         // first half of the group when group size is 4.

         bool isFirstInPair = imod(elemIdx, 2 * inc) < inc;
         int i = isFirstInPair ? elemIdx : elemIdx - inc;

         int i0 = firstPass == 1 ? i : int(getIndices(batch, i));
         int i1 = firstPass == 1 ? i + inc : int(getIndices(batch, i + inc));
         float x0 = i0 < n ? getX(batch, i0) : negativeInf;
         float x1 = i1 < n ? getX(batch, i1) : negativeInf;

         // Denotes which direction indices are in (ascending or descending).
         bool reverse = imod(elemIdx, 2 * dir) >= dir;
         bool isGreater = x0 > x1 || (x0 == x1 && i1 > i0);
         if (reverse == isGreater) { // Elements in opposite order of direction
           int iTemp = i0;
           i0 = i1;
           i1 = iTemp;
         }
         if (isFirstInPair) {
            setOutput(float(i0));
         } else {
            setOutput(float(i1));
         }
       }
     `}}class W${constructor(e){this.variableNames=["x","indices"],this.customUniforms=[{name:"n",type:"int"},{name:"firstPass",type:"int"},{name:"k",type:"int"}],this.outputShape=e,this.userCode=`
    void main() {
         // Takes max of indices (0, k), (1, k + 1), (2, k + 2) ...
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int elemIdx = coords[1];

         // The output size is half of the previous size.
         // If the previous sequence is | | | | _ _ _ _  | | | |  _ _ _ _ (k=4),
         // we only need to output the indices at positions |, the indices at
         // positions _ can be thrown away, see Figure5(b) After Phase 2
         // (Merge phase) in the Bitonic Top K paper referenced above.
         // For example, the paper shows we only need to output the orange bars.
         // The output sequence should look like this | | | | | | | |.
         // Because the sequence is halved, to map the output index back
         // to the previous sequence to find the corresponding value,
         // we need to double the index. When we double the index,
         // we basically interpolate a position, so 2i looks like
         // | _ | _ | _ | _ | _ | _ | _. We move the | to the first k position
         // of each 2k positions by - elemIdx % k. E.g. for output at
         // index 4,5,6,7, we want to get the corresponding element at
         // original index 8,9,10,11, for output at index 8,9,10,11,
         // we want to get the corresponding element at original index
         // 16,17,18,19, so on and so forth.

         int i = elemIdx < k ? elemIdx : (elemIdx * 2 - imod(elemIdx, k));
         int i0 = firstPass == 1 ? i : int(getIndices(batch, i));
         int i1 = firstPass == 1 ? i + k : int(getIndices(batch, i + k));

         float x0 = getX(batch, i0);
         float x1 = i1 < n ? getX(batch, i1) : x0;

         setOutput(x0 >= x1 ? float(i0) : float(i1));
       }
     `}}function et(n,e){e!==null&&n.disposeIntermediateTensorInfo(e)}function ur(n){let e=1;for(;e<n;)e*=2;return e}function G$(n){const{inputs:e,backend:t,attrs:s}=n,{x:o}=e,{k:r,sorted:i}=s,a=v().getNumber("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD"),c=v().getNumber("TOPK_K_CPU_HANDOFF_THRESHOLD"),l=o.shape,u=l[l.length-1];if(t.shouldExecuteOnCPU([o])||u<a||r>c){const $=t.readSync(o.dataId),[b,T]=Hg($,l,o.dtype,r,i);return[t.makeTensorInfo(b.shape,b.dtype,b.values),t.makeTensorInfo(T.shape,T.dtype,T.values)]}if(r===0)return l[l.length-1]=0,[t.makeTensorInfo(l,o.dtype,[]),t.makeTensorInfo(l,"int32",[])];if(u===1)return[o,Cn({attrs:{shape:l,dtype:"int32",value:0},backend:t})];const d=t.texData.get(o.dataId),h=d!==null&&d.isPacked,f=h?t.unpackTensor(o):o,x=F(l)/u,g=k({inputs:{x:f},attrs:{shape:[x,u]},backend:t});h&&et(t,f);const m=ur(r),C=ur(u);let w=null;const y=()=>w===null?[g,g]:[g,w],I=($,b,T)=>{const P=y(),B=new U$(T),U=[[u],[w===null?1:0],[Number.NEGATIVE_INFINITY],[$],[b]],j=w;w=t.runWebGLProgram(B,P,"int32",U),et(t,j)};for(let $=1;$<m;$*=2){const b=$*2;for(let T=$;T>=1;T/=2)I(b,T,[x,C])}for(let $=C;$>m;$/=2){const b=y(),T=new W$([x,$/2]),B=[[u],[w===null?1:0],[m]],L=w;w=t.runWebGLProgram(T,b,"int32",B),et(t,L);const U=m/2,j=U*2;for(let W=U;W>=1;W/=2)I(j,W,w.shape)}let N=w;w=qt({inputs:{x:w},backend:t,attrs:{begin:0,size:[x,r]}}),et(t,N);let E=ac({inputs:{x:g,indices:w},backend:t,attrs:{axis:1,batchDims:1}});et(t,g);const R=l.slice(0,-1);R.push(r),N=w,w=k({inputs:{x:w},attrs:{shape:R},backend:t}),et(t,N);const S=E;return E=k({inputs:{x:E},attrs:{shape:R},backend:t}),et(t,S),[E,w]}const z$={kernelName:md,backendName:"webgl",kernelFunc:G$};class H${constructor(e,t,s,o,r,i){this.variableNames=["Image","Transforms"],this.outputShape=i;const a=s==="nearest"?1:2;let c;switch(o){case"constant":c=1;break;case"reflect":c=2;break;case"wrap":c=3;break;case"nearest":c=4;break;default:c=1;break}this.userCode=`
            float mapCoord(float outCoord, float len) {
              float inCoord = outCoord;
              if(${c} == 2) {
                if (inCoord < 0.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz2 = 2.0 * len;
                    if (inCoord < sz2) {
                      inCoord = sz2 * float(int(float(-inCoord / sz2))) +
                      inCoord;
                    }
                    inCoord = inCoord < -len ? inCoord + sz2 : -inCoord - 1.0;
                  }
                } else if (inCoord > len - 1.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz2 = 2.0 * len;
                    inCoord -= sz2 * float(int(float(inCoord / sz2)));
                    if (inCoord >= len) {
                      inCoord = sz2 - inCoord - 1.0;
                    }
                  }
                }
                return clamp(inCoord, 0.0, len - 1.0);
              } else if (${c} == 3) {
                if (inCoord < 0.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz = len - 1.0;
                    inCoord += len * (float(int(float(-inCoord / sz))) + 1.0);
                  }
                } else if (inCoord > len - 1.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz = len - 1.0;
                    inCoord -= len * float(int(float(inCoord / sz)));
                  }
                }
                return clamp(inCoord, 0.0, len - 1.0);
              } else if (${c} == 4) {
                return clamp(outCoord, 0.0, len - 1.0);
              } else {
                return outCoord;
              }
            }

            float readWithFillValue(int batch, int coordY, int coordX,
              int channel) {
              float outputValue;
              if (0 <= coordY && coordY < ${e} && 0 <= coordX && coordX < ${t}) {
                  outputValue = getImage(batch, coordY, coordX, channel);
              } else {
                outputValue = float(${r});
              }
              return outputValue;
            }

            void main() {
              ivec4 coords = getOutputCoords();
              float outputValue;
              int batch = coords[0];
              int x = coords[2];
              int y = coords[1];
              int channel = coords[3];
              float xf = float(x);
              float yf = float(y);
              float a1 = getTransforms(batch, 0);
              float a2 = getTransforms(batch, 1);
              float a3 = getTransforms(batch, 2);
              float b1 = getTransforms(batch, 3);
              float b2 = getTransforms(batch, 4);
              float b3 = getTransforms(batch, 5);
              float c1 = getTransforms(batch, 6);
              float c2 = getTransforms(batch, 7);
              float projection = c1 * xf + c2 * yf + 1.0;
              if (projection == 0.0) {
                outputValue = float(${r});
              } else {
                float inX = (a1 * xf + a2 * yf + a3) / projection;
                float inY = (b1 * xf + b2 * yf + b3) / projection;
                float mapX = mapCoord(inX, float(${t}));
                float mapY = mapCoord(inY, float(${e}));

                if (${a} == 1) {
                  int coordY = int(round(mapY));
                  int coordX = int(round(mapX));
                  outputValue = readWithFillValue(batch, coordY, coordX,
                    channel);
                } else {
                  float yFloor = floor(mapY);
                  float xFloor = floor(mapX);
                  float yCeil = yFloor + 1.0;
                  float xCeil = xFloor + 1.0;
                  float valueYFloor = (xCeil - mapX) *
                  readWithFillValue(batch, int(yFloor), int(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, int(yFloor), int(xCeil), channel);
                  float valueYCeil = (xCeil - mapX) *
                  readWithFillValue(batch, int(yCeil), int(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, int(yCeil), int(xCeil), channel);
                  outputValue = (yCeil - mapY) * valueYFloor +
                  (mapY - yFloor) * valueYCeil;
                }
              }
              setOutput(outputValue);
            }
        `}}function X$(n){const{inputs:e,backend:t,attrs:s}=n,{image:o,transforms:r}=e,{interpolation:i,fillMode:a,fillValue:c,outputShape:l}=s,[u,d,h,f]=o.shape,[p,x]=l??[d,h],g=[u,p,x,f],m=new H$(d,h,i,a,c,g);return t.runWebGLProgram(m,[o,r],"float32")}const j$={kernelName:gd,backendName:"webgl",kernelFunc:X$};function q$(n){const{inputs:e,attrs:t,backend:s}=n,{axis:o}=t,{x:r}=e;Ut(r,"unique"),console.warn("WARNING: ","UI might be locked temporarily as data is being downloaded");const i=s.readSync(r.dataId),{outputValues:a,outputShape:c,indices:l}=Xg(i,o,r.shape,r.dtype);return[s.makeTensorInfo(c,r.dtype,a),s.makeTensorInfo([l.length],"int32",l)]}const K$={kernelName:Cd,backendName:"webgl",kernelFunc:q$};function Y$(n){const{inputs:e,backend:t,attrs:s}=n,{value:o}=e;let{axis:r}=s;r<0&&(r+=o.shape.length);const i=o,a=i.shape.length,c=o.shape[r],l=new Array(a-1);let u=0;for(let x=0;x<a;x++)x!==r&&(l[u++]=i.shape[x]);const d=[],h=new Array(a).fill(0),f=i.shape.slice();f[r]=1;const p=new Array(c);for(let x=0;x<p.length;x++){h[r]=x;const g=qt({inputs:{x:i},backend:t,attrs:{begin:h,size:f}}),m=k({inputs:{x:g},backend:t,attrs:{shape:l}});p[x]=m,d.push(g)}return d.forEach(x=>t.disposeIntermediateTensorInfo(x)),p}const Q$={kernelName:bd,backendName:"webgl",kernelFunc:Y$};class Z${constructor(e,t){this.variableNames=["x","segmentIds"];const s=e.windowSize,o=e.batchSize,r=e.inSize,i=e.numSegments,a=i*Math.ceil(r/s);this.outputShape=[o,a];const c="0.0",l="sumValue",u=Math.floor(s/4)*4,d=s%4,h=`
        sumValue += dot(values, segFilter);
    `;let f="";r%s>0&&(f=`
        if (inIdx < 0 || inIdx >= ${r}) {
          return initializationValue;
        }
      `);let p="";r%s>0&&(p=`
        if (inIdx < 0 || inIdx >= ${r}) {
          return -1.0;
        }
      `),this.userCode=`
      const float initializationValue = ${c};

      float getValue(int batch, int inIdx) {
        ${f}
        return getX(batch, inIdx);
      }

      float getSegmentIdAtIndex(int inIdx) {
        ${p}
        return getSegmentIds(inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = int(floor(float(outIdx) / float(
          ${i})) * float(${s}));
        int currentSeg = int(mod(float(outIdx), float(${i})));

        float sumValue = 0.0;

        for (int i = 0; i < ${u}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 3)) == currentSeg ? 1 : 0
          );

          ${h}
        }

        int inIdx = inOffset + ${u};
        if (${d===1}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          int inIdxSeg = int(getSegmentIdAtIndex(inIdx));

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            0,
            0,
            0
          );

          ${h}
        } else if (${d===2}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
              0,
              0
          );

          ${h}
        } else if (${d===3}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            0
          );

          ${h}
        }
        setOutput(${l});
      }
    `}}function J$(n){const{inputs:e,backend:t,attrs:s}=n,{x:o,segmentIds:r}=e,{numSegments:i}=s,a=o.shape.length,c=[];let l=0;const u=Ie([l],a);let d=o;u!=null&&(d=he({inputs:{x:o},backend:t,attrs:{perm:u}}),c.push(d),l=Re(1,a)[0]);const h=Uf(d.shape,l,i),f=F([d.shape[l]]),p=k({inputs:{x:d},backend:t,attrs:{shape:[-1,f]}});c.push(p);const x=Vs(o.dtype),g=(y,I,N,E,R)=>{const S=y.shape[0],$=y.shape[1],b=Vf($,R),T={windowSize:b,inSize:$,batchSize:S,numSegments:R},P=new Z$(T,I),B=t.compileAndRun(P,[y,N],E);if(c.push(B),B.shape[1]===R)return B;const L=pc({backend:t,attrs:{start:0,stop:R,step:1,dtype:"float32"}}),U=mc({inputs:{x:L},backend:t,attrs:{reps:[$/b]}});return c.push(L),c.push(U),g(B,I,U,E,R)},m=g(p,"unsortedSegmentSum",r,x,i),C=k({inputs:{x:m},backend:t,attrs:{shape:h}});let w=C;if(u!=null){c.push(C);const y=zs(u);w=he({inputs:{x:w},backend:t,attrs:{perm:y}})}return c.forEach(y=>t.disposeIntermediateTensorInfo(y)),w}const eS={kernelName:wd,backendName:"webgl",kernelFunc:J$};const tS=[Bx,Vx,Gx,Xx,qx,Qx,Jx,t0,r0,a0,u0,f0,g0,w0,$0,I0,T0,A0,D0,P0,M0,X0,q0,Z0,eC,iC,cC,hC,yx,mC,wC,SC,kC,DC,PC,LC,MC,GC,XC,KC,QC,JC,tb,ob,ib,ub,hb,mb,Cb,wb,Sb,Eb,Fb,Pb,Bb,Mb,Ub,Gb,Hb,jb,Kb,Jb,nw,rw,aw,uw,fw,xw,yw,wx,$w,CC,Rw,Nw,Fw,$x,_w,Vw,Ww,Xw,Kw,Jw,n1,i1,u1,f1,m1,b1,y1,$1,T1,N1,A1,D1,P1,M1,G1,j1,ty,Rx,ry,cy,dy,py,nC,xy,by,yy,Sy,Ey,Ix,ky,Fy,Oy,_y,Ly,sC,Q1,Vy,zy,qy,Ex,Zy,tv,rv,cv,hv,pv,xv,wv,$v,Rv,Nv,Fv,_v,Mv,Gv,Xv,z0,J1,Kv,Qv,Jv,t$,s$,r$,a$,l$,d$,p$,g$,C$,w$,$$,I$,T$,N$,Z1,Px,F$,P$,L$,V$,z$,j$,_x,K$,Q$,eS,Cy];for(const n of tS)Ed(n);export{rs as GPGPUContext,qn as MathBackendWebGL,bx as forceHalfFloat,oS as gpgpu_util,zf as setWebGLContext,rS as version_webgl,iS as webgl,sS as webgl_util};
