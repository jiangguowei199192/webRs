define(["./when-cbf8cd21","./Check-35e1a91d","./Math-e66fad2a","./Cartesian2-44433f55","./WebGLConstants-95ceb4e9","./AttributeCompression-170b3be0","./IndexDatatype-66caba23","./createTaskProcessorWorker"],function(a,e,G,W,r,B,z,n){"use strict";var H=32767,O=new W.Cartographic,Y=new W.Cartesian3;var Z=new W.Rectangle,j=new W.Ellipsoid,q=new W.Cartesian3,J={min:void 0,max:void 0};var K=new W.Cartesian3,Q=new W.Cartesian3,V=new W.Cartesian3,X=new W.Cartesian3,$=new W.Cartesian3;return n(function(a,e){var r=new Uint16Array(a.positions),n=new Uint16Array(a.widths),t=new Uint32Array(a.counts),i=new Uint16Array(a.batchIds);!function(a){a=new Float64Array(a);var e=0;J.min=a[e++],J.max=a[e++],W.Rectangle.unpack(a,e,Z),e+=W.Rectangle.packedLength,W.Ellipsoid.unpack(a,e,j),e+=W.Ellipsoid.packedLength,W.Cartesian3.unpack(a,e,q)}(a.packedBuffer);for(var s=q,u=function(a,e,r,n,t){var i=a.length/3,s=a.subarray(0,i),u=a.subarray(i,2*i),c=a.subarray(2*i,3*i);B.AttributeCompression.zigZagDeltaDecode(s,u,c);for(var o=new Float64Array(a.length),f=0;f<i;++f){var p=s[f],C=u[f],d=c[f],b=G.CesiumMath.lerp(e.west,e.east,p/H),w=G.CesiumMath.lerp(e.south,e.north,C/H),h=G.CesiumMath.lerp(r,n,d/H),l=W.Cartographic.fromRadians(b,w,h,O),y=t.cartographicToCartesian(l,Y);W.Cartesian3.pack(y,o,3*f)}return o}(r,Z,J.min,J.max,j),c=u.length/3,o=4*c-4,f=new Float32Array(3*o),p=new Float32Array(3*o),C=new Float32Array(3*o),d=new Float32Array(2*o),b=new Uint16Array(o),w=0,h=0,l=0,y=0,k=t.length,v=0;v<k;++v){for(var A,g,m,x=t[v],E=n[v],D=i[v],I=0;I<x;++I){0===I?(A=W.Cartesian3.unpack(u,3*y,K),g=W.Cartesian3.unpack(u,3*(y+1),Q),m=W.Cartesian3.subtract(A,g,V),W.Cartesian3.add(A,m,m)):m=W.Cartesian3.unpack(u,3*(y+I-1),V);var T,U,F,N=W.Cartesian3.unpack(u,3*(y+I),X);I===x-1?(T=W.Cartesian3.unpack(u,3*(y+x-1),K),U=W.Cartesian3.unpack(u,3*(y+x-2),Q),F=W.Cartesian3.subtract(T,U,$),W.Cartesian3.add(T,F,F)):F=W.Cartesian3.unpack(u,3*(y+I+1),$),W.Cartesian3.subtract(m,s,m),W.Cartesian3.subtract(N,s,N),W.Cartesian3.subtract(F,s,F);for(var R=I===x-1?2:4,M=0===I?2:0;M<R;++M){W.Cartesian3.pack(N,f,w),W.Cartesian3.pack(m,p,w),W.Cartesian3.pack(F,C,w),w+=3;var P=M-2<0?-1:1;d[h++]=M%2*2-1,d[h++]=P*E,b[l++]=D}}y+=x}var L=z.IndexDatatype.createTypedArray(o,6*c-6),S=0,_=0,k=c-1;for(v=0;v<k;++v)L[_++]=S,L[_++]=S+2,L[_++]=S+1,L[_++]=S+1,L[_++]=S+2,L[_++]=S+3,S+=4;return e.push(f.buffer,p.buffer,C.buffer),e.push(d.buffer,b.buffer,L.buffer),{indexDatatype:2===L.BYTES_PER_ELEMENT?z.IndexDatatype.UNSIGNED_SHORT:z.IndexDatatype.UNSIGNED_INT,currentPositions:f.buffer,previousPositions:p.buffer,nextPositions:C.buffer,expandAndWidth:d.buffer,batchIds:b.buffer,indices:L.buffer}})});
