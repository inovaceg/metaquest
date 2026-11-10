import { useEffect, useRef, useState } from 'react';
import { Loader2, TriangleAlert } from 'lucide-react';

export type SceneControls = { enterVR: () => Promise<void>; setView: (view: 'therapist'|'overview'|'window') => void };
type Props = { onReady?: (controls: SceneControls) => void };

export default function ClinicScene({onReady}:Props){
 const host=useRef<HTMLDivElement>(null);const [error,setError]=useState('');const [loading,setLoading]=useState(true);
 useEffect(()=>{
  let disposed=false;let cleanup=()=>{};
  async function init(){
   try {
    // Pinned official Three.js modules delivered through ESM CDN while local package installation is unavailable.
    const threeUrl='https://esm.sh/three@0.170.0';
    const controlsUrl='https://esm.sh/three@0.170.0/examples/jsm/controls/OrbitControls.js';
    const [T,{OrbitControls}]=await Promise.all([import(/* @vite-ignore */ threeUrl),import(/* @vite-ignore */ controlsUrl)]);
    if(disposed||!host.current)return;
    const container=host.current;const scene=new T.Scene();scene.background=new T.Color('#dce4dd');
    const renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));renderer.setSize(container.clientWidth,container.clientHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.xr.enabled=true;container.appendChild(renderer.domElement);
    const camera=new T.PerspectiveCamera(52,container.clientWidth/container.clientHeight,.08,80);camera.position.set(2.6,1.85,2.9);
    const rig=new T.Group();rig.add(camera);scene.add(rig);
    const orbit=new OrbitControls(camera,renderer.domElement);orbit.target.set(0,1,-.7);orbit.enableDamping=true;orbit.minDistance=.9;orbit.maxDistance=6;orbit.maxPolarAngle=Math.PI*.48;orbit.minPolarAngle=.35;orbit.enablePan=false;
    const material=(color:string,roughness=.8)=>new T.MeshStandardMaterial({color,roughness});
    const plaster=material('#eeeae0');const wood=material('#a77e52');const darkwood=material('#66523d');const linen=material('#c9c1aa');const teal=material('#386a60');const metal=material('#575a45',.4);
    function box(w:number,h:number,d:number,mat:unknown,x:number,y:number,z:number,rounded=false){
     let geometry;
     if(rounded){const r=Math.min(.07,w/4,h/4,d/4);const s=new T.Shape();const a=-w/2,b=-h/2;s.moveTo(a+r,b);s.lineTo(a+w-r,b);s.quadraticCurveTo(a+w,b,a+w,b+r);s.lineTo(a+w,b+h-r);s.quadraticCurveTo(a+w,b+h,a+w-r,b+h);s.lineTo(a+r,b+h);s.quadraticCurveTo(a,b+h,a,b+h-r);s.lineTo(a,b+r);s.quadraticCurveTo(a,b,a+r,b);geometry=new T.ExtrudeGeometry(s,{depth:d-2*r,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:r,bevelThickness:r,curveSegments:5});geometry.translate(0,0,-d/2+r);}else geometry=new T.BoxGeometry(w,h,d);
     const mesh=new T.Mesh(geometry,mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);return mesh;
    }
    function cylinder(radius:number,height:number,mat:unknown,x:number,y:number,z:number){const m=new T.Mesh(new T.CylinderGeometry(radius,radius*.92,height,24),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;}
    // A small procedural texture avoids large image downloads in the headset.
    const texCanvas=document.createElement('canvas');texCanvas.width=256;texCanvas.height=256;const ctx=texCanvas.getContext('2d')!;ctx.fillStyle='#b4936c';ctx.fillRect(0,0,256,256);for(let i=0;i<550;i++){ctx.strokeStyle=`rgba(77,50,26,${Math.random()*.14})`;const y=Math.random()*256;ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(80,y+Math.random()*7,150,y-4,256,y+3);ctx.stroke();}const texture=new T.CanvasTexture(texCanvas);texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(2,1);texture.colorSpace=T.SRGBColorSpace;const floorMat=new T.MeshStandardMaterial({map:texture,roughness:.8});
    for(let i=0;i<20;i++)box(.298,.07,6,floorMat,-2.85+i*.3,-.04,0);
    box(6,3,.15,plaster,0,1.5,-3);box(.15,3,6,plaster,3,1.5,0);box(.15,.7,6,plaster,-3,.35,0);box(.15,.45,6,plaster,-3,2.8,0);box(.15,2,1,plaster,-3,1.65,-2.5);box(.15,2,1,plaster,-3,1.65,2.5);
    box(.2,.1,4.2,wood,-2.92,.74,0);box(.2,.1,4.2,wood,-2.92,2.55,0);for(const z of [-2,0,2])box(.18,1.8,.07,wood,-2.92,1.65,z);
    const sky=new T.MeshBasicMaterial({color:'#dce8df',side:T.DoubleSide});box(.03,7,12,sky,-6,2,0);
    // Landscape outside the window gives parallax rather than a flat indoor backdrop.
    for(let i=0;i<8;i++){const tree=new T.Mesh(new T.SphereGeometry(.8,10,8),material(i%2?'#8c9e7c':'#abb99a'));tree.position.set(-4.8,1.1+Math.sin(i),-4+i*1.1);tree.scale.y=1.7;scene.add(tree);}
    box(6,.09,.06,wood,0,.08,-2.88);box(.06,.09,6,wood,2.89,.08,0);
    const rugMat=material('#d8d3bf');box(3.3,.025,2.7,rugMat,0,.015,.05,true);for(let i=0;i<34;i++)box(3.25,.002,.012,material(i%2?'#cec9b6':'#ded9c9'),0,.031,-1.24+i*.077);
    // Sofa with individual upholstered cushions, timber feet and softly rounded edges.
    box(2.3,.27,.86,linen,0,.39,-1.88,true);box(2.3,.65,.2,linen,0,.78,-2.26,true);box(.22,.52,.9,linen,-1.14,.64,-1.88,true);box(.22,.52,.9,linen,1.14,.64,-1.88,true);
    for(const x of [-.55,.55]){box(1.04,.16,.72,material('#ddd3bc'),x,.6,-1.85,true);const cushion=box(.94,.45,.17,material('#d4c9b0'),x,.88,-2.08,true);cushion.rotation.x=-.12;}
    const pillow=box(.38,.4,.16,teal,-.78,.9,-1.98,true);pillow.rotation.z=.18;for(const x of [-.9,.9])for(const z of [-2.12,-1.6])box(.07,.23,.07,darkwood,x,.15,z);
    // Therapist armchair.
    box(.95,.2,.85,teal,1.37,.46,1.17,true);box(.95,.7,.2,teal,1.37,.85,1.53,true);box(.15,.43,.85,teal,.9,.68,1.17,true);box(.15,.43,.85,teal,1.84,.68,1.17,true);box(.69,.14,.66,material('#47776a'),1.37,.61,1.14,true);for(const x of [1.03,1.7])for(const z of [.89,1.45])box(.055,.3,.055,darkwood,x,.19,z);
    cylinder(.48,.075,wood,-1.35,.63,-.5);for(const x of [-1.6,-1.1])box(.045,.6,.045,darkwood,x,.3,-.5);
    cylinder(.1,.11,material('#ede8d9'),-1.4,.72,-.46);const book=box(.3,.035,.22,teal,-1.25,.69,-.65);book.rotation.y=.2;
    cylinder(.28,.47,material('#c3af95'),-2.25,.25,-2.15);const stemMat=material('#536345');
    for(let i=0;i<14;i++){const a=i*2.4;const y=.7+i*.075;const x=-2.25+Math.sin(a)*.24;const z=-2.15+Math.cos(a)*.24;const stem=cylinder(.012,y,stemMat,-2.25,y/2+.4,-2.15);stem.rotation.z=Math.sin(a)*.2;const leaf=new T.Mesh(new T.SphereGeometry(.2,10,8),material(i%2?'#536d43':'#73875c'));leaf.scale.set(.7,.16,1.8);leaf.position.set(x,y+.4,z);leaf.rotation.set(.3,a,.35);leaf.castShadow=true;scene.add(leaf);}
    box(1,.95,.07,wood,.35,1.95,-2.87);box(.88,.83,.025,material('#e2dac6'),.35,1.95,-2.82);const art=box(.35,.48,.03,material('#7f8c71'),.32,1.95,-2.79,true);art.rotation.z=.3;box(.18,.3,.035,material('#b89b76'),.6,1.85,-2.76,true);
    cylinder(.25,.05,metal,2.25,.06,-1.75);cylinder(.025,1.6,metal,2.25,.85,-1.75);const shade=new T.Mesh(new T.ConeGeometry(.3,.35,28,1,true),new T.MeshStandardMaterial({color:'#e6ddc4',side:T.DoubleSide}));shade.position.set(2.25,1.76,-1.75);scene.add(shade);const lamp=new T.PointLight('#ffdfac',5,3,2);lamp.position.set(2.25,1.6,-1.75);scene.add(lamp);
    scene.add(new T.HemisphereLight('#fff8ea','#9b9f83',2));const sun=new T.DirectionalLight('#fff0d5',3.5);sun.position.set(-4,5,2);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-5;sun.shadow.camera.right=5;sun.shadow.camera.top=5;sun.shadow.camera.bottom=-5;sun.shadow.normalBias=.035;scene.add(sun);
    const fill=new T.DirectionalLight('#e8f0ee',.7);fill.position.set(2,3,3);scene.add(fill);
    const resize=new ResizeObserver(()=>{if(!container.clientHeight)return;camera.aspect=container.clientWidth/container.clientHeight;camera.updateProjectionMatrix();renderer.setSize(container.clientWidth,container.clientHeight);});resize.observe(container);
    // Controller selection teleports only onto the room floor, never by continuous acceleration.
    const raycaster=new T.Raycaster();const rotation=new T.Matrix4();const floor=new T.Mesh(new T.PlaneGeometry(5.6,5.6),new T.MeshBasicMaterial({visible:false}));floor.rotation.x=-Math.PI/2;floor.position.y=.02;scene.add(floor);
    const marker=new T.Mesh(new T.RingGeometry(.14,.2,30),new T.MeshBasicMaterial({color:'#d6ecd3',side:T.DoubleSide}));marker.rotation.x=-Math.PI/2;marker.position.y=.05;marker.visible=false;scene.add(marker);
    const controllers=[renderer.xr.getController(0),renderer.xr.getController(1)];
    controllers.forEach(c=>{rig.add(c);const line=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(0,0,0),new T.Vector3(0,0,-1)]),new T.LineBasicMaterial({color:'#c9e2c4'}));line.scale.z=5;c.add(line);c.addEventListener('select',()=>{rotation.identity().extractRotation(c.matrixWorld);raycaster.ray.origin.setFromMatrixPosition(c.matrixWorld);raycaster.ray.direction.set(0,0,-1).applyMatrix4(rotation);const hit=raycaster.intersectObject(floor)[0];if(hit){const pos=new T.Vector3();camera.getWorldPosition(pos);rig.position.x+=hit.point.x-pos.x;rig.position.z+=hit.point.z-pos.z;}});});
    onReady?.({enterVR:async()=>{const xr=(navigator as unknown as {xr?:{requestSession:(mode:string,options:unknown)=>Promise<unknown>}}).xr;if(!xr)throw new Error('WebXR não está disponível neste navegador.');const session=await xr.requestSession('immersive-vr',{optionalFeatures:['local-floor','bounded-floor']});await renderer.xr.setSession(session);},setView:(view)=>{rig.position.set(0,0,0);if(view==='therapist'){camera.position.set(1.35,1.6,1.2);orbit.target.set(0,1,-1.7);}else if(view==='window'){camera.position.set(-2.5,1.65,1.5);orbit.target.set(0,1,-1);}else{camera.position.set(2.6,1.85,2.9);orbit.target.set(0,1,-.7);}orbit.update();}});
    renderer.setAnimationLoop(()=>{orbit.enabled=!renderer.xr.isPresenting;if(!renderer.xr.isPresenting)orbit.update();renderer.render(scene,camera);});setLoading(false);
    cleanup=()=>{resize.disconnect();renderer.setAnimationLoop(null);renderer.xr.getSession()?.end();orbit.dispose();scene.traverse((object:{geometry?:{dispose:()=>void};material?:{dispose:()=>void}|{dispose:()=>void}[]})=>{object.geometry?.dispose();if(Array.isArray(object.material))object.material.forEach(m=>m.dispose());else object.material?.dispose();});texture.dispose();renderer.dispose();renderer.domElement.remove();};
   }catch(e){if(!disposed){setLoading(false);setError(e instanceof Error?e.message:'Não foi possível iniciar o ambiente 3D.');}}
  }
  init();return()=>{disposed=true;cleanup();};
 },[onReady]);
 return <div ref={host} className="absolute inset-0 h-full w-full">{loading&&<div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#e5e6db]"><Loader2 className="animate-spin text-primary"/><span className="text-xs text-primary">Preparando o seu espaço…</span></div>}{error&&<div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#e5e6db] p-8 text-center"><TriangleAlert className="text-primary"/><h2 className="text-lg font-semibold">O ambiente 3D não pôde ser carregado</h2><p className="max-w-md text-xs leading-6 text-muted-foreground">Verifique o acesso à internet e o suporte a WebGL. Os módulos Three.js são carregados de esm.sh nesta etapa.</p><p className="max-w-md break-all text-[10px] text-muted-foreground">{error}</p><button className="outline-button" onClick={()=>window.location.reload()}>Tentar novamente</button></div>}</div>;
}
