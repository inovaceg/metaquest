import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Brand from '@/components/Brand';
export default function NotFound(){return <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center"><Brand/><p className="eyebrow mt-6">ESPAÇO NÃO ENCONTRADO · 404</p><h1 className="page-title">Vamos encontrar um novo caminho.</h1><p className="text-sm text-muted-foreground">Esta página não está disponível.</p><Link to="/" className="primary-button"><ArrowLeft size={16}/> Voltar ao início</Link></div>}
