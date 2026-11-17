// Volcado SOLO LECTURA de una composición de After Effects a JSON.
// ARGS: {id: <comp id>, out: <ruta json>}. No modifica nada.
function r3(v){if(v===null||v===undefined)return v;if(typeof v=="number")return Math.round(v*1000)/1000;if(v instanceof Array){var a=[];for(var i=0;i<v.length;i++)a.push(r3(v[i]));return a;}if(typeof v=="string"||typeof v=="boolean")return v;try{if(v.text!==undefined){return {text:v.text,font:v.font,size:v.fontSize,fill:v.applyFill?r3(v.fillColor):null,track:v.tracking,lead:v.leading,just:String(v.justification),caps:v.allCaps}}}catch(e){}return String(v);}
function q(s){return '"'+String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,'\\n').replace(/\r/g,'\\n').replace(/\t/g,' ')+'"';}
function J(v){if(v===null||v===undefined)return "null";if(typeof v=="number")return isFinite(v)?String(v):"null";if(typeof v=="boolean")return v?"true":"false";if(typeof v=="string")return q(v);if(v instanceof Array){var a=[];for(var i=0;i<v.length;i++)a.push(J(v[i]));return "["+a.join(",")+"]";}var o=[];for(var k in v){if(v.hasOwnProperty(k))o.push(q(k)+":"+J(v[k]));}return "{"+o.join(",")+"}";}
function ki(p,i){var e={t:r3(p.keyTime(i)),v:null};try{e.v=r3(p.keyValue(i));}catch(x){}
try{var it=p.keyInInterpolationType(i),ot=p.keyOutInterpolationType(i);var c=function(z){return z==KeyframeInterpolationType.BEZIER?"B":z==KeyframeInterpolationType.HOLD?"H":"L";};e.i=c(it)+c(ot);
var a=p.keyInTemporalEase(i),b=p.keyOutTemporalEase(i);e.ein=[r3(a[0].speed),r3(a[0].influence)];e.eout=[r3(b[0].speed),r3(b[0].influence)];}catch(x){}return e;}
function walk(g,path,acc,depth){var n=0;try{n=g.numProperties;}catch(x){return;}for(var i=1;i<=n;i++){var p=g.property(i);if(!p)continue;var nm=path+"/"+p.name;
if(p.propertyType==PropertyType.PROPERTY){var rec=null;var nk=0;try{nk=p.numKeys;}catch(x){}
if(nk>0){rec={p:nm,keys:[]};for(var k=1;k<=Math.min(nk,40);k++)rec.keys.push(ki(p,k));if(nk>40)rec.more=nk;}
try{if(p.canSetExpression&&p.expressionEnabled&&p.expression!=""){rec=rec||{p:nm};rec.expr=p.expression.substring(0,400);}}catch(x){}
if(rec)acc.push(rec);}
else if(depth<8&&p.matchName!="ADBE Effect Parade"){walk(p,nm,acc,depth+1);}}}
function fxs(L,acc){var r=[];var E=L.property("ADBE Effect Parade");if(!E)return r;for(var i=1;i<=E.numProperties;i++){var e=E.property(i);var o={n:e.name,mn:e.matchName,on:e.enabled,params:{}};for(var j=1;j<=Math.min(e.numProperties,60);j++){var pp=e.property(j);try{if(pp.propertyType==PropertyType.PROPERTY){var v=pp.value;if(typeof v=="number"||typeof v=="boolean"||v instanceof Array)o.params[pp.name]=r3(v);var nk=pp.numKeys;if(nk>0||(pp.expressionEnabled&&pp.expression!="")){var rec={p:"fx:"+e.name+"/"+pp.name};if(nk>0){rec.keys=[];for(var k=1;k<=Math.min(nk,30);k++)rec.keys.push(ki(pp,k));}if(pp.expressionEnabled&&pp.expression!="")rec.expr=pp.expression.substring(0,300);acc.push(rec);}}}catch(x){}}r.push(o);}return r;}
function masks(L){var r=[];var M=L.property("ADBE Mask Parade");if(!M)return r;for(var i=1;i<=M.numProperties;i++){var m=M.property(i);var o={n:m.name,mode:String(m.maskMode),inv:m.inverted,feather:r3(m.property("ADBE Mask Feather").value),exp:r3(m.property("ADBE Mask Offset").value),op:r3(m.property("ADBE Mask Opacity").value),animated:m.property("ADBE Mask Shape").numKeys};try{var s=m.property("ADBE Mask Shape").value;o.vtx=s.vertices.length;var xs=[],ys=[];for(var k=0;k<s.vertices.length;k++){xs.push(s.vertices[k][0]);ys.push(s.vertices[k][1]);}o.bbox=r3([Math.min.apply(null,xs),Math.min.apply(null,ys),Math.max.apply(null,xs),Math.max.apply(null,ys)]);}catch(x){}r.push(o);}return r;}
var C=app.project.itemByID(ARGS.id);var co={id:C.id,n:C.name,w:C.width,h:C.height,d:r3(C.duration),fps:r3(C.frameRate),mb:C.motionBlur,shutter:C.shutterAngle,layers:[]};
for(var l=1;l<=C.numLayers;l++){var L=C.layer(l);var lo={i:l,n:L.name,on:L.enabled,ini:r3(L.inPoint),out:r3(L.outPoint),st:r3(L.startTime),str:r3(L.stretch),par:L.parent?L.parent.index:null,anim:[]};
try{lo.src=L.source?L.source.name:null;}catch(x){}
lo.kind=(L instanceof TextLayer)?"text":(L instanceof ShapeLayer)?"shape":(L instanceof CameraLayer)?"camera":(L instanceof LightLayer)?"light":(L.nullLayer?"null":(L.adjustmentLayer?"adjust":"av"));
try{lo.three=L.threeDLayer;lo.mb=L.motionBlur;lo.blend=String(L.blendingMode);lo.matte=L.hasTrackMatte?String(L.trackMatteType):null;try{lo.matteL=L.trackMatteLayer?L.trackMatteLayer.index:null;}catch(x){}lo.isMatte=L.isTrackMatte;lo.collapse=L.collapseTransformation;lo.timeRemap=L.timeRemapEnabled;}catch(x){}
try{lo.fx=fxs(L,lo.anim);}catch(x){lo.fxErr=String(x);}try{lo.masks=masks(L);}catch(x){}
var tr=L.property("ADBE Transform Group");if(tr){lo.T={};for(var t=1;t<=tr.numProperties;t++){try{lo.T[tr.property(t).name]=r3(tr.property(t).value);}catch(x){}}}
if(L instanceof TextLayer){try{lo.text=r3(L.property("ADBE Text Properties").property("ADBE Text Document").value);}catch(x){}}
var skip={"ADBE Effect Parade":1};for(var g=1;g<=L.numProperties;g++){var G=L.property(g);if(G.matchName=="ADBE Effect Parade")continue;try{if(G.propertyType==PropertyType.PROPERTY){}else walk(G,"/"+G.name,lo.anim,1);}catch(x){}}
co.layers.push(lo);}
var f=new File(ARGS.out);f.encoding="UTF-8";f.open("w");f.write(J(co));f.close();return {ok:true,layers:co.layers.length};
