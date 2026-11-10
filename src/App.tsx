import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Index from './pages/Index';
import PlatformLayout from './components/PlatformLayout';
import Platform from './pages/Platform';
import Patients from './pages/Patients';
import Scenarios from './pages/Scenarios';
import WaitingRoom from './pages/WaitingRoom';
import Reports, { SessionHistory } from './pages/Reports';
import Settings from './pages/Settings';
import Access from './pages/Access';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
const Consultorio=lazy(()=>import('./pages/Consultorio'));
export default function App(){return <TooltipProvider><Toaster richColors position="top-center"/><BrowserRouter><Suspense fallback={<div className="flex min-h-screen items-center justify-center gap-3 text-sm text-primary"><Loader2 className="animate-spin" size={20}/> Preparando experiência…</div>}><Routes><Route path="/" element={<Index/>}/><Route path="/acesso" element={<Access/>}/><Route path="/privacidade" element={<Privacy/>}/><Route path="/consultorio" element={<Consultorio/>}/><Route element={<PlatformLayout/>}><Route path="/plataforma" element={<Platform/>}/><Route path="/pacientes" element={<Patients/>}/><Route path="/cenarios" element={<Scenarios/>}/><Route path="/espera/:id" element={<WaitingRoom/>}/><Route path="/relatorio/:id" element={<Reports/>}/><Route path="/historico" element={<SessionHistory/>}/><Route path="/configuracoes" element={<Settings/>}/><Route path="/administracao" element={<Access/>}/><Route path="/perfil" element={<Access/>}/></Route><Route path="*" element={<NotFound/>}/></Routes></Suspense></BrowserRouter></TooltipProvider>}
