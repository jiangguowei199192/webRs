define(["./when-cbf8cd21","./Check-35e1a91d","./Math-e66fad2a","./Cartesian2-44433f55","./Transforms-23521d7e","./RuntimeError-f4c64df1","./WebGLConstants-95ceb4e9","./ComponentDatatype-7ee14e67","./GeometryAttribute-b1aaa48a","./GeometryAttributes-90846c5f","./AttributeCompression-170b3be0","./GeometryPipeline-7efc0064","./EncodedCartesian3-86f19ac2","./IndexDatatype-66caba23","./IntersectionTests-4068523d","./Plane-47e9c397","./GeometryOffsetAttribute-84f7eff3","./VertexFormat-cc24f342","./EllipseGeometryLibrary-3d44bfc0","./GeometryInstance-70a15eb5","./EllipseGeometry-c778bcca"],function(r,e,t,n,a,c,i,o,s,f,l,d,b,m,p,y,u,G,C,E,A){"use strict";return function(e,t){return r.defined(t)&&(e=A.EllipseGeometry.unpack(e,t)),e._center=n.Cartesian3.clone(e._center),e._ellipsoid=n.Ellipsoid.clone(e._ellipsoid),A.EllipseGeometry.createGeometry(e)}});
