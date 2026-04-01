# AutoFormTester Tupiniquim - Extensão Chrome

Extensão do Chrome para preenchimento automático de formulários com dados de teste genéricos, incluindo campos ocultos e UTMs, e destaque visual dos campos preenchidos. Agora com popup interativo!

## 🚀 Funcionalidades

- **Popup Interativo**: Interface moderna com botões para copiar URL e preencher formulários
- **Botão Copiar URL**: Copia automaticamente uma URL com parâmetros UTM e de tracking para testes
- **Preenchimento Manual**: Preenche formulários apenas quando você clicar no botão "Preencher Formulário"
- **Preenchimento Automático Inteligente**: Preenche campos de texto, email, telefone, CEP, etc., com valores de teste genéricos e relevantes
- **Suporte a Campos Ocultos (UTMs)**: Preenche automaticamente campos ocultos, incluindo parâmetros UTM (utm_source, utm_medium, utm_campaign, utm_term, utm_content) com valores fictícios
- **Seleção de Dropdowns**: Seleciona a primeira opção disponível em campos de seleção (dropdown/select) que não esteja desabilitada
- **Destaque Visual**: Adiciona uma borda azul aos campos preenchidos para facilitar a visualização
- **Não Envia Formulários**: A extensão apenas preenche os dados; o envio do formulário fica a cargo do usuário

## 🛠️ Como Usar

### Versão 1.1.0 - Com Popup

1. **Navegue até a página com o formulário**: Abra a página web que contém o formulário que você deseja testar.
2. **Clique no ícone da extensão**: Clique no ícone do **AutoFormTester Tupiniquim** na barra de ferramentas do Chrome para abrir o popup.
3. **Escolha sua ação**:
   - **Copiar URL**: Clique em "Copiar URL" para copiar a URL com parâmetros de teste para a área de transferência
   - **Preencher Formulário**: Clique em "Preencher Formulário" para preencher automaticamente os campos da página
4. **Visualização**: Os campos do formulário serão preenchidos automaticamente com dados de teste e destacados com uma borda azul.
5. **Envio Manual**: Revise os dados preenchidos e, se estiver satisfeito, clique no botão de envio do formulário (submit) manualmente.

### URL de Teste Incluída

A extensão inclui uma URL pré-configurada com os seguintes parâmetros para testes:
```
/?matchtype=matchtypeValue&device=deviceValue&adposition=adpositionValue&placement=placementValue&targetid=targetidValue&feeditemid=feeditemidValue&adgroupid=adgroupidValue&target=targetValue&gclid=gclidValue&utm_term=utm_termValue&utm_content=utm_contentValue&utm_id=utm_idValue&utm_source_platform=utm_source_platformValue&utm_source=utm_sourceValue&utm_campaign=utm_campaignValue&devicemodel=devicemodelValue&utm_medium=utm_mediumValue
```

## 📦 Instalação (Modo Desenvolvedor)

1. **Baixe os arquivos da extensão**: Faça o download de todos os arquivos do projeto e mantenha a estrutura de pastas intacta.
2. **Abra o Chrome e acesse as extensões**: Digite `chrome://extensions/` na barra de endereços do seu navegador Chrome e pressione Enter.
3. **Ative o modo desenvolvedor**: No canto superior direito da página de extensões, ative a chave "Modo do desenvolvedor".
4. **Carregue a extensão**: Clique no botão "Carregar sem compactação" (Load unpacked).
5. **Selecione a pasta da extensão**: Navegue até a pasta `AutoFormTesterTupiniquim` (a pasta que contém o arquivo `manifest.json`) e clique em "Selecionar Pasta".
6. **Fixe a extensão (opcional)**: Para facilitar o acesso, clique no ícone de quebra-cabeça (🧩) na barra de ferramentas do Chrome, encontre "AutoFormTester Tupiniquim" e clique no ícone de pin (📌) para fixá-lo na barra.

## ⚙️ Estrutura do Projeto

```
AutoFormTesterTupiniquim/
├── manifest.json          # Configuração da extensão (Manifest V3)
├── popup.html             # Interface do popup da extensão
├── popup.js               # Script do popup para copiar URL e preencher formulários
├── scripts/
│   ├── content.js         # Script injetado na página para preencher formulários
│   └── background.js      # Service Worker simplificado
├── icons/
│   ├── icon16.png         # Ícone 16x16
│   ├── icon32.png         # Ícone 32x32
│   ├── icon48.png         # Ícone 48x48
│   └── icon128.png        # Ícone 128x128
├── README.md              # Este arquivo
└── CHANGELOG.md           # Histórico de mudanças
```

## 🛡️ Permissões

- `activeTab`: Permite que a extensão acesse temporariamente a aba ativa quando o usuário clica no ícone da extensão.
- `scripting`: Permite que a extensão injete e execute scripts na aba ativa.

**Nenhum dado é coletado ou enviado para fora do seu navegador.** A extensão funciona completamente localmente.

## 📝 Changelog

### v1.1.0
- ✨ Adicionado popup interativo com interface moderna
- ✨ Botão para copiar URL com parâmetros de teste
- ✨ Controle manual do preenchimento de formulários
- 🔧 Removido preenchimento automático ao clicar na extensão
- 🎨 Interface visual aprimorada com gradientes e animações

### v1.0.0
- 🎉 Versão inicial com preenchimento automático de formulários

