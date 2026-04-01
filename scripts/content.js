// AutoFormTester Tupiniquim - Content Script v1.7.1
// Correção anti-SPAM: delays humanizados, honeypot expandido, React/Vue support
// v1.7.1: e-mail gerado a partir do nome preenchido no formulário

(function() {
    if (window.hasAutoFormTester) {
        console.log("AutoFormTester Tupiniquim: Content script já injetado.");
        return;
    }
    window.hasAutoFormTester = true;

    console.log("AutoFormTester Tupiniquim: Content script carregado v1.7.1.");

    // Armazena o nome preenchido no formulário para usar no e-mail
    let nameFromForm = "";

    // ─── Delay humanizado entre campos (1.2s ~ 3.5s) ───────────────────────
    function humanDelay(min = 1200, max = 3500) {
        return new Promise(r => setTimeout(r, min + Math.random() * (max - min)));
    }

    // ─── Campos de rastreamento / honeypot a ignorar ────────────────────────
    const trackingFields = [
        "matchtype", "device", "adposition", "placement", "targetid", "feeditemid",
        "adgroupid", "target", "gclid", "origem", "utm_term", "utm_content",
        "utm_id", "utm_source_platform", "utm_source", "utm_campaign",
        "devicemodel", "utm_medium", "form_name", "site_domain", "page_path",
        "page_url", "ultima_url_campanha"
    ];

    const honeypotKeywords = [
        "honeypot", "bot", "spam", "hidden", "extra", "dummy", "fake",
        "trap", "captcha", "confirm_email", "email_confirm", "fax",
        "website_url", "url_site", "_gotcha", "hp_", "h-captcha",
        "handle", "submit-response", "submit_response"
    ];

    function isTrackingOrHoneypot(field) {
        const name = (field.name || "").toLowerCase();
        const id   = (field.id   || "").toLowerCase();
        const ph   = (field.placeholder || "").toLowerCase();
        const cls  = (field.className || "").toLowerCase();

        const style = field.getAttribute("style") || "";
        if (/display\s*:\s*none|visibility\s*:\s*hidden/.test(style)) return true;

        const rect = field.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return true;

        return (
            trackingFields.some(k => name.includes(k) || id.includes(k)) ||
            honeypotKeywords.some(k => name.includes(k) || id.includes(k) || ph.includes(k) || cls.includes(k))
        );
    }

    // ─── Geração de valores de teste ────────────────────────────────────────
    function generateValue(field, formName = "", userName = "") {
        if (isTrackingOrHoneypot(field)) {
            console.log("AutoFormTester: Ignorando honeypot/rastreamento:", field.name || field.id);
            return null;
        }

        const type = (field.type || "").toLowerCase();
        const name = (field.name || "").toLowerCase();
        const id   = (field.id   || "").toLowerCase();
        const ph   = (field.placeholder || "").toLowerCase();
        const key  = name + id + ph;

        if (type === "hidden") return null;

        switch (type) {
            case "email": {
                const baseName = nameFromForm || userName || "tupiniquim";
                const prefix = baseName
                    .toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
                return prefix + "@tupiniquim.com";
            }
            case "tel":
            case "phone": {
                const ddds = [11, 21, 31, 41, 51];
                const ddd  = ddds[Math.floor(Math.random() * ddds.length)];
                const p1   = 90000 + Math.floor(Math.random() * 9999);
                const p2   = 1000  + Math.floor(Math.random() * 8999);
                return "(" + ddd + ") " + String(p1).slice(0, 5) + "-" + p2;
            }
            case "url":      return "https://www.tupiniquim.com.br";
            case "number":   return "42";
            case "date":     return "2025-06-15";
            case "time":     return "10:00";
            case "checkbox":
            case "radio":    return true;
        }

        if (/nome|name|fullname|first.?name/.test(key)) {
            const suffix = formName ? " (" + formName + ")" : "";
            const nameVal = (userName || "Bruno MEireles") + suffix;
            // Salva o nome SEM sufixo para usar no e-mail
            nameFromForm = userName || "Bruno MEireles";
            return nameVal;
        }
        if (/sobrenome|lastname|last.?name/.test(key)) return "Tupiniquim";
        if (/email|e-mail/.test(key)) {
            const baseName = nameFromForm || userName || "tupiniquim";
            const prefix = baseName
                .toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
            return prefix + "@tupiniquim.com";
        }
        if (isPhoneField(field)) {
            const ddds = [11, 21, 31];
            const ddd  = ddds[Math.floor(Math.random() * ddds.length)];
            const p1   = 90000 + Math.floor(Math.random() * 9999);
            const p2   = 1000  + Math.floor(Math.random() * 8999);
            return "(" + ddd + ") " + String(p1).slice(0, 5) + "-" + p2;
        }
        if (/cep|zipcode/.test(key))      return "01310-100";
        if (/endereco|address/.test(key)) return "Av. Paulista, 1000";
        if (/cidade|city/.test(key))      return "São Paulo";
        if (/estado|state/.test(key))     return "SP";
        if (/empresa|company/.test(key))  return "Tupiniquim Ltda.";
        if (/cpf/.test(key))              return "123.456.789-00";
        if (/cnpj/.test(key))             return "12.345.678/0001-90";
        if (/mensagem|message|assunto|subject|comment|descri/.test(key)) {
            const msgs = [
                "Olá, gostaria de receber mais informações sobre os serviços disponíveis.",
                "Boa tarde! Pode me enviar detalhes sobre propostas e valores?",
                "Tenho interesse em conhecer melhor as soluções que vocês oferecem.",
                "Preciso de um orçamento para meu projeto. Podem entrar em contato?",
                "Quero saber mais sobre as opções disponíveis para minha empresa."
            ];
            return msgs[Math.floor(Math.random() * msgs.length)];
        }

        return "Tupiniquim Teste";
    }

    function isPhoneField(field) {
        const key = ((field.type || "") + (field.name || "") + (field.id || "") + (field.placeholder || "")).toLowerCase();
        return /tel|telefone|phone|whatsapp|celular|mobile/.test(key);
    }

    // ─── Digitação humanizada com suporte a React/Vue ───────────────────────
    async function simulateTyping(field, value) {
        await new Promise(r => setTimeout(r, 300 + Math.random() * 400));

        field.focus();
        field.dispatchEvent(new FocusEvent("focus", { bubbles: true }));

        field.value = "";
        triggerReactInput(field, "");

        const chars = String(value).split("");
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            const code = char.charCodeAt(0);

            field.dispatchEvent(new KeyboardEvent("keydown", {
                key: char, keyCode: code, which: code,
                bubbles: true, cancelable: true
            }));

            field.value += char;
            triggerReactInput(field, field.value);

            field.dispatchEvent(new KeyboardEvent("keyup", {
                key: char, keyCode: code, which: code,
                bubbles: true, cancelable: true
            }));

            const base = isPhoneField(field) ? 80 : 55;
            await new Promise(r => setTimeout(r, base + Math.random() * 65));

            if (i > 0 && i % 7 === 0) {
                await new Promise(r => setTimeout(r, 150 + Math.random() * 300));
            }
        }

        field.dispatchEvent(new Event("change", { bubbles: true }));
        await new Promise(r => setTimeout(r, 200 + Math.random() * 300));
        field.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    }

    function triggerReactInput(field, value) {
        const proto = field.tagName === "TEXTAREA"
            ? window.HTMLTextAreaElement.prototype
            : window.HTMLInputElement.prototype;
        const nativeSetter = Object.getOwnPropertyDescriptor(proto, "value");
        if (nativeSetter && nativeSetter.set) {
            nativeSetter.set.call(field, value);
        }
        field.dispatchEvent(new Event("input", { bubbles: true }));
    }

    // ─── Preencher um campo ──────────────────────────────────────────────────
    async function fillField(field, formName, userName) {
        if (field.disabled || field.readOnly) return false;

        const tag  = field.tagName.toLowerCase();
        const type = (field.type || "").toLowerCase();
        const key  = ((field.name || "") + (field.id || "") + (field.placeholder || "")).toLowerCase();

        if (/nome|name|email|e-mail/.test(key) && field.value.trim() !== "") return false;

        if (tag === "input" || tag === "textarea") {
            if (type === "checkbox" || type === "radio") {
                if (!field.checked) {
                    field.checked = true;
                    field.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                    field.dispatchEvent(new Event("change", { bubbles: true }));
                    return true;
                }
                return false;
            }
            if (["submit", "reset", "button", "file", "image"].includes(type)) return false;

            const value = generateValue(field, formName, userName);
            if (value === null) return false;

            const before = field.value;
            await simulateTyping(field, value);
            return field.value !== before;

        } else if (tag === "select") {
            for (let i = 0; i < field.options.length; i++) {
                if (!field.options[i].disabled && field.options[i].value !== "") {
                    field.selectedIndex = i;
                    field.dispatchEvent(new Event("change", { bubbles: true }));
                    return true;
                }
            }
        }
        return false;
    }

    function highlightField(field) {
        const origBorder    = field.style.border;
        const origBoxShadow = field.style.boxShadow;
        field.style.border     = "2px solid #28a745";
        field.style.boxShadow  = "0 0 8px rgba(40,167,69,0.6)";
        field.style.transition = "all 0.3s ease-in-out";
        setTimeout(() => {
            field.style.border    = origBorder;
            field.style.boxShadow = origBoxShadow;
        }, 4000);
    }

    // ─── Função principal ────────────────────────────────────────────────────
    async function autoFillForms(userName) {
        console.log("AutoFormTester Tupiniquim v1.7.1: Iniciando para:", userName);
        nameFromForm = ""; // Resetar a cada execução

        const allFields = Array.from(document.querySelectorAll("input, textarea, select"));
        let filled = 0;

        for (const field of allFields) {
            const cs = window.getComputedStyle(field);
            if (cs.display === "none" || cs.visibility === "hidden") continue;
            if (field.type === "hidden") continue;

            const form     = field.closest("form");
            const formName = form
                ? (form.name || form.id || form.getAttribute("data-name") || form.getAttribute("aria-label") || "")
                : "";

            const changed = await fillField(field, formName, userName);

            if (changed) {
                highlightField(field);
                filled++;
                await humanDelay(1200, 3500);
            }
        }

        console.log("AutoFormTester Tupiniquim: Concluído.", filled, "campos preenchidos.");
        return filled;
    }

    // ─── Listener ───────────────────────────────────────────────────────────
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "ping") {
            sendResponse({ status: "ready" });
        } else if (request.action === "fillForms") {
            autoFillForms(request.userName).then(count => {
                sendResponse({ status: "Forms filled", count });
            });
            return true;
        }
    });

})();
