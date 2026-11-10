# VR CLINIC AI

Plataforma educacional em português brasileiro. Esta entrega inicial implementa a experiência institucional, o consultório 3D e um fluxo de demonstração **roteirizado**, sem IA externa conectada.

## Preparação e execução

Projeto React 19 + TypeScript + Vite. O ambiente Dyad gerencia instalação e inicialização. `package.json` define as tarefas de desenvolvimento (`dev`), produção (`build`) e pré-visualização (`preview`). Em hospedagem própria, usar um ambiente Node compatível com Vite 8, instalar as dependências do projeto e configurar a plataforma de hospedagem para a tarefa `build` e diretório de saída `dist`. Rotas de SPA devem redirecionar para `index.html`; `vercel.json` já contém a configuração do projeto.

Copiar os nomes públicos de `.env.example` para a configuração do ambiente somente ao conectar o Supabase. Nenhuma variável é necessária para a demonstração. Nunca inserir segredos em variáveis `VITE_*`.

**Bloqueio encontrado durante esta entrega:** o gerenciador de pacotes local falhou com `EBUSY` em links de `node_modules` no Windows. Uma tentativa de reinstalação também falhou. O preview e a checagem TypeScript locais não puderam ser executados. Não se deve interpretar a revisão de código como teste de execução.

**Verificação de produção:** o build em ambiente isolado, com instalação limpa de dependências, passou. Isso verifica a compilação Vite, não substitui checagem TypeScript, testes de navegação no navegador ou testes físicos em headset. Módulos Three.js carregados em tempo de execução pelo CDN não são verificados por esse build.

## Fluxo disponível

- `/`: página institucional e referências arquitetônicas.
- `/plataforma`: entrada da demonstração, sem métricas fictícias.
- `/pacientes`: cinco personagens fictícios, busca, objetivos e dificuldade.
- `/cenarios`: três níveis e roteiros de estudo locais. Roteiros não modificam o motor do paciente.
- `/espera/:id`: preparação e consentimento opcional para persistir transcrição textual.
- `/consultorio`: ambiente WebGL real, modos de posição, conversa roteirizada, notas, pausa e cronômetro.
- `/relatorio/:id`: reflexão baseada em critérios simples e exemplos, se houver consentimento; exportação JSON.
- `/historico`: registros temporários da aba, com exclusão individual.
- `/configuracoes`: detecção real de suporte WebXR e estado das integrações.
- `/acesso`, `/perfil`, `/administracao`: acesso explicitamente bloqueado até implementação da autenticação real.
- `/privacidade`: dados, consentimento, limitações e serviços externos.

## Arquitetura

Rotas em `src/App.tsx`. `components/ClinicScene.tsx` encapsula renderização e WebXR; o ambiente é carregado separadamente. `data/patients.ts` contém cinco históricos fictícios e níveis. `lib/demo-engine.ts` fornece interface `ConversationEngine`, implementação roteirizada substituível e geração de reflexões. As páginas contêm os módulos de seleção, sessão e registros. Não existe backend nem autenticação simulada.

### Ambiente 3D

Three.js **0.170.0**, com OrbitControls da mesma versão, carregado de `esm.sh` por módulos ESM versionados. Solução inicial devido ao bloqueio na instalação local; para produção, incorporar Three.js ao gerenciamento de dependências e ao bundle após corrigir o ambiente. São necessários internet e acesso a esse CDN. Erros de rede e WebGL têm mensagem específica.

Consultório com geometria própria em escala métrica, sofá com almofadas, poltrona, mesa, livro, vaso, vegetação, quadro, janela, paisagem com paralaxe, luminária, tapete, textura procedural de madeira, sombras e luz natural. Não é um ambiente fotogramétrico nem usa personagens humanos 3D. As fotografias da página institucional são referências ilustrativas, não capturas do ambiente real.

Pixel ratio limitado a 1,5; sombra de 1024; geometria de baixa complexidade; câmera desktop com limites orbitais. O renderizador libera recursos na desmontagem.

### VR

Entrada real via `navigator.xr.requestSession('immersive-vr')` e Three.js WebXRManager, somente quando o navegador informa suporte. Rastreamento de cabeça fornecido pelo runtime WebXR. Controle com raio e seleção sobre o piso para teletransporte. Há alternativa desktop por seleção de posições, arraste e zoom.

**Não implementado:** rastreamento de mãos, HUD espacial de atendimento, avatar humano, áudio espacial. O chat e as notas são uma interface HTML 2D; não aparecem dentro de uma sessão imersiva. Esta versão não é um fluxo completo de atendimento dentro do headset.

**Não validado em Meta Quest 3 físico.** É necessário testar HTTPS, disponibilidade WebXR, recenter, escala, orientação, controles, teletransporte, permissões e taxa de quadros no navegador do Quest antes de afirmar compatibilidade de produção. O teletransporte atual deve ser validado quanto a posicionamento junto aos móveis antes de uso em treinamento.

### Voz

Síntese Web Speech do navegador, quando disponível, com preferência `pt-BR`, sem sincronização labial. Ditado via SpeechRecognition/webkitSpeechRecognition, sujeito ao suporte do navegador e consentimento a cada uso. O provedor do navegador pode processar áudio externamente. O texto ditado permanece editável antes de enviar. Texto sempre disponível como alternativa. Pausar ou iniciar nova intervenção interrompe a leitura. Não gravamos áudio/vídeo.

### Dados e privacidade

Relatórios e notas no `sessionStorage` da aba; não são privados por autenticação. Não inserir dados reais. Transcrição completa ou trechos só são incluídos após consentimento explícito na sala de espera. Ao negar, são salvas apenas observações sem citações, contagens, notas e duração. Registros podem ser exportados e excluídos. Fechar a aba normalmente elimina o armazenamento, mas a recuperação de sessão do navegador pode restaurá-lo.

Serviços externos: Google Fonts, Unsplash e esm.sh. Imagens não são representações dos pacientes fictícios; os perfis usam iniciais para não associar pessoas reais a sintomas.

## Próximas etapas necessárias para produção

1. Conectar Supabase; implementar cadastro, confirmação de e-mail, aprovação administrativa, autenticação e políticas RLS com isolamento de dados. Superadministrador deve ser provisionado de forma segura; nunca aceitar privilégios enviados pelo cliente. Preparar organizações e membros para expansão institucional.
2. Implementar operações reais de pacientes/cenários, histórico privado e consentimentos; retenção, exclusão e trilha administrativa com controle de acesso.
3. Consultar documentação e SDK oficiais atuais do D-ID antes de implementar. Definir o fluxo autorizado de sessão e conexão no backend, sem expor chaves secretas ou inventar endpoints. Nenhum SDK ou endpoint D-ID foi implementado nesta entrega.
4. Implementar motor de IA com contexto consistente e relatório pedagógico fundamentado em evidências. A demonstração atual não atribui pontuações nem se apresenta como avaliação de competência.
5. Validar ativos 3D, renderização, voz e WebXR em hardware real; adicionar HUD acessível no headset e realizar auditoria de segurança, acessibilidade e adequação jurídica à LGPD.

Esta entrega não está pronta para uso comercial clínico ou coleta de dados sensíveis. A camada funcional de demonstração é uma base para as etapas restantes, não uma simulação de serviços externos ativos.
