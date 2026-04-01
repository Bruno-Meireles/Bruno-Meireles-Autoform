# Changelog - AutoFormTester Tupiniquim

## Versão 1.6.0 - Correção de SPAM e Melhoria de Simulação
- **Correção Crítica**: Agora a extensão ignora explicitamente campos de rastreamento e metadados (`utm_source`, `gclid`, `matchtype`, etc.) para evitar bloqueios de spam e distorção de dados.
- **Prevenção de Honeypot**: Campos ocultos (`type="hidden"`) que parecem ser de segurança ou honeypots são ignorados por padrão.
- **Simulação Realística**: Melhoria na simulação de digitação para incluir eventos de `focus`, `keydown`, `keypress`, `keyup`, `input`, `change` e `blur` em todos os campos.
- **Atraso Inteligente**: Atrasos variáveis entre caracteres para mimetizar comportamento humano.
- **Destaque Temporário**: O destaque azul nos campos preenchidos agora desaparece após 5 segundos para não poluir a visualização do usuário.
- **Limpeza de Campo**: Agora o campo é limpo antes de iniciar a simulação de digitação.

---

## Versão 1.1.0 - Popup Interativo e Controle Manual

### 🚀 Principais Melhorias
- **Popup Interativo**: Adicionada interface moderna com popup ao clicar na extensão
- **Botão Copiar URL**: Novo botão para copiar URL com parâmetros de teste pré-configurados
- **Controle Manual**: Preenchimento de formulários agora é manual através do botão "Preencher Formulário"
- **Interface Visual Aprimorada**: Design moderno com gradientes, animações e feedback visual

### ✨ Novas Funcionalidades
- **URL de Teste Pré-configurada**: Inclui parâmetros UTM e de tracking para testes completos
- **Feedback Visual**: Botões mudam de cor e texto quando ações são executadas
- **Mensagens de Sucesso**: Notificações visuais para confirmar ações realizadas
- **Auto-fechamento**: Popup fecha automaticamente após preencher formulário

### 🔧 Mudanças Técnicas
- Removido preenchimento automático ao clicar na extensão
- Adicionado `popup.html` e `popup.js` para interface do usuário
- Simplificado `background.js` removendo listener de clique automático
- Atualizado `manifest.json` para incluir popup

### 📋 URL de Teste Incluída
```
/?matchtype=matchtypeValue&device=deviceValue&adposition=adpositionValue&placement=placementValue&targetid=targetidValue&feeditemid=feeditemidValue&adgroupid=adgroupidValue&target=targetValue&gclid=gclidValue&utm_term=utm_termValue&utm_content=utm_contentValue&utm_id=utm_idValue&utm_source_platform=utm_source_platformValue&utm_source=utm_sourceValue&utm_campaign=utm_campaignValue&devicemodel=devicemodelValue&utm_medium=utm_mediumValue
```

### 🎨 Melhorias de UX
- Interface responsiva e moderna
- Cores e tipografia profissionais
- Ícones SVG para melhor qualidade visual
- Transições suaves e efeitos hover

---

## Versão 3.0 - Solução Avançada para Campos de Telefone/Celular

### 🚀 Principais Melhorias
- **Sistema de Múltiplas Estratégias para Telefone/Celular**: Implementado sistema robusto com 3 estratégias diferentes para preencher campos de telefone que usam máquinas JavaScript
- **Detecção Aprimorada**: Melhor identificação de campos de telefone/celular incluindo variações como "mobile", "whatsapp", etc.
- **Logs Detalhados**: Sistema de logging para debug e acompanhamento do processo de preenchimento

### 🔧 Estratégias de Preenchimento de Telefone
1. **Estratégia 1**: Preenchimento direto com `field.value = valor`
2. **Estratégia 2**: Simulação de digitação caractere por caractere com eventos de teclado completos
3. **Estratégia 3**: Teste de múltiplos formatos alternativos:
   - `(11) 11111-1111`
   - `(11)11111-1111`
   - `11 11111-1111`
   - `1111111111`
   - `11-11111-1111`

### 🐛 Correções Específicas
- Resolvido problema de campos de telefone que ficavam apenas com parênteses `(`
- Melhorada compatibilidade com máquinas JavaScript populares
- Adicionado suporte para campos rotulados como "Celular"
- Implementado sistema de timeout para tentar estratégias alternativas

### 📋 Sites Analisados e Otimizados
- ✅ castanheiras.jardinsdoparque.com.br (campo telefone com máscara)
- ✅ infertilidade.inventre.com.br (campo celular)
- ✅ plataformas.safetyrentals.com.br (campo celular + radio buttons)
- ✅ radartires.com.br (campo telefone simples)

### 🎯 Melhorias Técnicas
- Eventos de teclado mais completos (keydown, keypress, keyup)
- Códigos de tecla apropriados para dígitos
- Sistema de fallback inteligente
- Melhor timing entre tentativas

### 📈 Versões Anteriores
- **Versão 2.0**: Melhorias de compatibilidade geral
- **Versão 1.0**: Versão inicial básica
