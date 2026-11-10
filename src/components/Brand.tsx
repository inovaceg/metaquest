import { Link } from 'react-router-dom';

export default function Brand({ light = false }: { light?: boolean }) {
 return <Link to="/" aria-label="VR Clinic AI — início" className={`inline-flex shrink-0 items-center gap-2.5 ${light ? 'text-white' : 'text-primary'}`}>
  <svg width="36" height="38" viewBox="0 0 36 38" fill="none" aria-hidden="true"><path d="M4 9 18 2l14 7v19l-14 8L4 28V9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="m4 9 14 8 14-8M18 17v19M10 12.5v11l8 4.5 8-4.5v-11" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="m13 7 5-2.5L23 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
  <span className="flex flex-col"><span className="font-['Manrope'] text-lg font-extrabold leading-none tracking-[-.06em]">VR CLINIC <span className="font-medium">AI</span></span><span className="mt-1.5 text-[7px] font-semibold uppercase tracking-[.25em] opacity-70">Presença que transforma</span></span>
 </Link>;
}
