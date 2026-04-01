// AutoFormTester Tupiniquim - Content Script v1.6.0

(function() {
    // Verifica se o script já foi injetado para evitar duplicação
    if (window.hasAutoFormTester) {
        console.log("AutoFormTester Tupiniquim: Content script já injetado.");
        return;
    }
    window.hasAutoFormTester = true;

    console.log("AutoFormTester Tupiniquim: Content script carregado v1.6.0.");

    // Lista de campos de rastreamento e metadados que DEVEM ser ignorados para evitar SPAM
    const trackingFields = [
        "matchtype", "device", "adposition", "placement", "targetid", "feeditemid", 
        "adgroupid", "target", "gclid", "origem", "utm_term", "utm_content", 
        "utm_id", "utm_source_platform", "utm_source", "utm_campaign", 
        "devicemodel", "utm_medium", "form_name", "site_domain", "page_path", 
        "page_url", "ultima_url_campanha"
    ];

    // Função para gerar valores de teste genéricos
    function generateGenericValue(field, formName = "", userName = "") {
        const type = field.type ? field.type.toLowerCase() : "";
        const name = field.name ? field.name.toLowerCase() : "";
        const id = field.id ? field.id.toLowerCase() : "";
        const placeholder = field.placeholder ? field.placeholder.toLowerCase() : "";

        // 1. Verificar se é um campo de rastreamento (Ignorar sempre)
        const isTrackingField = trackingFields.some(keyword => 
            name.includes(keyword) || id.includes(keyword)
        );

        if (isTrackingField) {
            console.log(`AutoFormTester Tupiniquim: Ignorando campo de rastreamento/metadados: ${name || id}`);
            return null;
        }

        // 2. Lógica para campos ocultos (Hidden)
        if (type === "hidden") {
            // Ignorar campos ocultos que pareçam tokens de segurança ou honeypots
            // Se o usuário quiser preencher UTMs específicos, ele deve fazer via URL, não via extensão automática em campos hidden
            if (name.includes("csrf") || name.includes("token") || name.includes("session") || name.includes("hash")) {
                console.log(`AutoFormTester Tupiniquim: Ignorando campo de segurança oculto: ${name}`);
                return null;
            }
            
            // Se for um campo hidden genérico (não rastreamento nem segurança), podemos tentar preencher, 
            // mas o ideal é ignorar para evitar gatilhos de spam em campos "honeypot"
            console.log(`AutoFormTester Tupiniquim: Ignorando campo oculto genérico (possível honeypot): ${name || id}`);
            return null;
        }

        // 3. Prioridade por tipo de campo
        switch (type) {
            case "email":
                const randomNum = Math.floor(Math.random() * 10000);
                const emailPrefix = (userName || "teste_tupiniquim").toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9]/g, "");
                return `${emailPrefix}${randomNum}@email.com`;
            case "tel":
            case "phone":
                // Número realista com DDD e variação para evitar padrão spam óbvio
                const ddd = 11; // Você pode ajustar para a região desejada
                const first = 90000 + Math.floor(Math.random() * 9999);
                const second = 1000 + Math.floor(Math.random() * 8999);
                return `${ddd}${first}${second}`;
            case "url":
                return "https://www.tupiniquim.com.br";
            case "number":
                return "12345";
            case "date":
                return "2025-01-01";
            case "time":
                return "12:30";
            case "checkbox":
            case "radio":
                return true;
            default:
                // 4. Prioridade por nome/id/placeholder do campo
                if (name.includes("nome") || id.includes("nome") || name.includes("name") || id.includes("name") || placeholder.includes("nome") || placeholder.includes("name")) {
                    const formSuffix = formName ? ` (${formName})` : "";
                    return `${userName || "Teste Tupiniquim Bruno"}${formSuffix}`;
                }
                if (name.includes("sobrenome") || id.includes("sobrenome") || name.includes("lastname") || id.includes("lastname") || placeholder.includes("sobrenome") || placeholder.includes("lastname")) {
                    return "da Silva Teste";
                }
                if (name.includes("email") || id.includes("email") || placeholder.includes("email") || name.includes("e-mail") || id.includes("e-mail") || placeholder.includes("e-mail")) {
                    const randomNum = Math.floor(Math.random() * 10000);
                    return `teste${randomNum}@email.com`;
                }
                if (isPhoneField(field)) {
                    return "11980311888";
                }
                if (name.includes("cep") || id.includes("cep") || name.includes("zipcode") || id.includes("zipcode") || placeholder.includes("cep") || placeholder.includes("zipcode")) {
                    return "01001000";
                }
                if (name.includes("endereco") || id.includes("endereco") || name.includes("address") || id.includes("address") || placeholder.includes("endereco") || placeholder.includes("address")) {
                    return "Rua dos Testes, 123";
                }
                if (name.includes("cidade") || id.includes("cidade") || name.includes("city") || id.includes("city") || placeholder.includes("cidade") || placeholder.includes("city")) {
                    return "São Paulo";
                }
                if (name.includes("estado") || id.includes("estado") || name.includes("state") || id.includes("state") || placeholder.includes("estado") || placeholder.includes("state")) {
                    return "SP";
                }
                if (name.includes("mensagem") || id.includes("mensagem") || name.includes("message") || id.includes("message") || placeholder.includes("mensagem") || placeholder.includes("message")) {
                    const samples = [
                        "Olá, solicito contato para mais informações sobre seus serviços.",
                        "Por favor, envie detalhes sobre propostas e valores.",
                        "Interessado em atendimento e orçamento; aguardo retorno.",
                        "Preciso de suporte para fechamento de proposta, obrigado."
                    ];
                    return samples[Math.floor(Math.random() * samples.length)];
                }
                if (name.includes("empresa") || id.includes("empresa") || name.includes("company") || id.includes("company") || placeholder.includes("empresa") || placeholder.includes("company")) {
                    return "Empresa Tupiniquim Ltda.";
                }
                if (name.includes("cpf") || id.includes("cpf") || placeholder.includes("cpf")) {
                    return "12345678900";
                }
                if (name.includes("cnpj") || id.includes("cnpj") || placeholder.includes("cnpj")) {
                    return "12345678000190";
                }
                
                return "teste_tupiniquim";
        }
    }

    // Função para simular digitação realística
    async function simulateTyping(field, value, delay = 30) {
        field.focus();
        
        // Disparar evento de foco
        field.dispatchEvent(new Event("focus", { bubbles: true }));
        
        // Limpar o campo antes de digitar
        field.value = "";
        field.dispatchEvent(new Event("input", { bubbles: true }));

        for (let i = 0; i < value.length; i++) {
            const char = value[i];
            const charCode = char.charCodeAt(0);

            // Eventos de teclado
            const events = ["keydown", "keypress", "keyup"];
            events.forEach(type => {
                const event = new KeyboardEvent(type, {
                    key: char,
                    char: char,
                    keyCode: charCode,
                    which: charCode,
                    bubbles: true,
                    cancelable: true
                });
                field.dispatchEvent(event);
            });

            // Adicionar o caractere e disparar input
            field.value += char;
            field.dispatchEvent(new Event("input", { bubbles: true }));

            // Pequeno atraso variável para parecer humano
            await new Promise(resolve => setTimeout(resolve, delay + Math.random() * 20));
        }

        // Finalizar com change e blur
        field.dispatchEvent(new Event("change", { bubbles: true }));
        field.dispatchEvent(new Event("blur", { bubbles: true }));
    }

    // Detectar campos de telefone
    function isPhoneField(field) {
        const type = field.type ? field.type.toLowerCase() : "";
        const name = field.name ? field.name.toLowerCase() : "";
        const id = field.id ? field.id.toLowerCase() : "";
        const placeholder = field.placeholder ? field.placeholder.toLowerCase() : "";
        
        const keywords = ["telefone", "phone", "whatsapp", "celular", "mobile", "tel"];
        return type === "tel" || keywords.some(kw => name.includes(kw) || id.includes(kw) || placeholder.includes(kw));
    }

    async function fillField(field, formName = "", userName = "") {
        if (field.disabled || field.readOnly) return;

        const tagName = field.tagName.toLowerCase();
        const type = field.type ? field.type.toLowerCase() : "";
        const name = field.name ? field.name.toLowerCase() : "";
        const id = field.id ? field.id.toLowerCase() : "";
        const placeholder = field.placeholder ? field.placeholder.toLowerCase() : "";

        const isNameField = /nome|name|fullname|first.*name|last.*name/.test(name + id + placeholder);
        const isEmailField = type === "email" || /email|e-mail/.test(name + id + placeholder);

        // Não sobrescreve nome e e-mail já preenchidos pelo usuário
        if ((isNameField || isEmailField) && field.value.trim() !== "") {
            return;
        }

        if (tagName === "input" || tagName === "textarea") {
            if (type === "checkbox" || type === "radio") {
                if (!field.checked) {
                    field.checked = true;
                    field.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                    field.dispatchEvent(new Event("change", { bubbles: true }));
                }
            } else if (!["submit", "reset", "button", "file"].includes(type)) {
                const value = generateGenericValue(field, formName, userName);
                if (value !== null) {
                    await simulateTyping(field, value, isPhoneField(field) ? 50 : 20);
                }
            }
        } else if (tagName === "select") {
            let selectedIndex = -1;
            for (let i = 0; i < field.options.length; i++) {
                if (!field.options[i].disabled && field.options[i].value !== "") {
                    selectedIndex = i;
                    break;
                }
            }
            if (selectedIndex !== -1) {
                field.selectedIndex = selectedIndex;
                field.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }
    }

    function highlightField(field) {
        const originalBorder = field.style.border;
        const originalBoxShadow = field.style.boxShadow;
        
        field.style.border = "2px solid #007bff";
        field.style.boxShadow = "0 0 8px rgba(0, 123, 255, 0.6)";
        field.style.transition = "all 0.3s ease-in-out";
        
        // Manter o destaque por alguns segundos
        setTimeout(() => {
            field.style.border = originalBorder;
            field.style.boxShadow = originalBoxShadow;
        }, 5000);
    }

    async function autoFillForms(userName) {
        console.log("AutoFormTester Tupiniquim: Iniciando preenchimento para:", userName);
        
        // Capturar todos os elementos de entrada possíveis
        const allFields = document.querySelectorAll("input, textarea, select");
        let filledCount = 0;

        for (const field of allFields) {
            // Verificar se o campo é visível (heurística simples)
            const style = window.getComputedStyle(field);
            const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && field.type !== 'hidden';
            
            // Se for hidden, a função fillField/generateGenericValue já trata o filtro de spam
            // Se for visível, preenchemos normalmente
            
            const form = field.closest("form");
            const formName = form ? (form.name || form.id || form.getAttribute("data-name") || "") : "";
            
            // Armazenar valor antigo para comparar se mudou
            const oldVal = field.value;
            
            await fillField(field, formName, userName);
            
            // Se o valor mudou ou se é checkbox/radio marcado, contamos como preenchido
            if (field.value !== oldVal || field.checked) {
                highlightField(field);
                filledCount++;
            }
        }
        
        console.log(`AutoFormTester Tupiniquim: Preenchimento concluído. ${filledCount} campos processados.`);
        return filledCount;
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "ping") {
            sendResponse({ status: "ready" });
        } else if (request.action === "fillForms") {
            autoFillForms(request.userName).then(count => {
                sendResponse({ status: "Forms filled", count: count });
            });
            return true; // Manter canal aberto para resposta assíncrona
        }
    });

})();
