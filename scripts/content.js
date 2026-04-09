// AutoFormTester Tupiniquim - Content Script v1.8.0
// Otimizacoes: selecao de formulario, preenchimento rapido, estabilidade visual

(function() {
    if (window.hasAutoFormTester) {
        console.log("AutoFormTester Tupiniquim: Content script já injetado.");
        return;
    }
    window.hasAutoFormTester = true;

    console.log("AutoFormTester Tupiniquim: Content script carregado v1.8.0.");

    let nameFromForm = "";

    function shortDelay(min = 90, max = 220) {
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
        const type = (field.type || "").toLowerCase();

        if (type === "hidden") return true;

        const style = field.getAttribute("style") || "";
        if (/display\s*:\s*none|visibility\s*:\s*hidden/.test(style)) return true;

        const rect = field.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return true;

        return (
            trackingFields.some(k => name.includes(k) || id.includes(k)) ||
            honeypotKeywords.some(k => name.includes(k) || id.includes(k) || ph.includes(k) || cls.includes(k))
        );
    }

    function isActuallyVisible(field) {
        if (!field || !field.isConnected) return false;
        const cs = window.getComputedStyle(field);
        if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
        const rect = field.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
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

    async function setFieldValueFast(field, value) {
        field.focus();
        field.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
        triggerReactInput(field, String(value));
        field.dispatchEvent(new Event("change", { bubbles: true }));
        field.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
        await shortDelay(40, 100);
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

    async function fillField(field, formName, userName) {
        if (field.disabled || field.readOnly) return false;
        if (!isActuallyVisible(field)) return false;
        if (isTrackingOrHoneypot(field)) return false;

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
            if (["submit", "reset", "button", "file", "image", "hidden"].includes(type)) return false;

            const value = generateValue(field, formName, userName);
            if (value === null) return false;

            const before = field.value;
            await setFieldValueFast(field, value);
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
        const origOutline = field.style.outline;
        const origOffset = field.style.outlineOffset;
        const origShadow = field.style.boxShadow;
        field.style.outline = "2px solid #28a745";
        field.style.outlineOffset = "1px";
        field.style.boxShadow = "0 0 0 3px rgba(40,167,69,0.25)";
        setTimeout(() => {
            field.style.outline = origOutline;
            field.style.outlineOffset = origOffset;
            field.style.boxShadow = origShadow;
        }, 2200);
    }

    function waitForDomSettling(timeoutMs = 1200) {
        return new Promise(resolve => {
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                observer.disconnect();
                resolve();
            };
            const observer = new MutationObserver(() => {
                clearTimeout(timer);
                timer = setTimeout(finish, 250);
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
            let timer = setTimeout(finish, timeoutMs);
        });
    }

    function fieldScore(field) {
        const key = ((field.name || "") + " " + (field.id || "") + " " + (field.placeholder || "") + " " + (field.className || "")).toLowerCase();
        let score = 0;
        if (/nome|name/.test(key)) score += 3;
        if (/email|e-mail/.test(key)) score += 3;
        if (/tel|telefone|phone|celular|whatsapp/.test(key)) score += 2;
        if (/mensagem|message|comment|assunto|subject/.test(key)) score += 2;
        if (/busca|search/.test(key)) score -= 4;
        return score;
    }

    function formPenalty(formEl) {
        const key = ((formEl.id || "") + " " + (formEl.className || "") + " " + (formEl.getAttribute("aria-label") || "")).toLowerCase();
        let penalty = 0;
        if (/whatsapp|floating|chat|widget/.test(key)) penalty += 6;
        if (/newsletter/.test(key)) penalty += 3;
        if (/login|signin|search|busca/.test(key)) penalty += 5;
        return penalty;
    }

    function getCandidateForms() {
        const forms = Array.from(document.querySelectorAll("form"));
        const candidates = [];
        for (const form of forms) {
            if (!isActuallyVisible(form)) continue;
            const fields = Array.from(form.querySelectorAll("input, textarea, select"))
                .filter(f => !f.disabled && !f.readOnly && !isTrackingOrHoneypot(f) && isActuallyVisible(f));
            if (!fields.length) continue;

            let score = 0;
            score += Math.min(fields.length, 8);
            const submit = form.querySelector('button[type="submit"], input[type="submit"], button:not([type])');
            if (submit && isActuallyVisible(submit)) score += 5;
            for (const field of fields) score += fieldScore(field);
            score -= formPenalty(form);

            const title = (form.getAttribute("aria-label") || form.getAttribute("name") || form.id || "").trim() || "Formulario";
            candidates.push({ form, fields, score, title });
        }
        candidates.sort((a, b) => b.score - a.score);
        return candidates;
    }

    function getFormCandidatesForPopup() {
        const candidates = getCandidateForms();
        const best = candidates[0];
        const second = candidates[1];
        const confidence = best ? (second ? best.score - second.score : best.score) : 0;
        return candidates.slice(0, 8).map((item, index) => ({
            index,
            score: item.score,
            title: item.title,
            fieldCount: item.fields.length,
            selectedByDefault: index === 0 && confidence >= 3
        }));
    }

    async function autoFillForms(userName, selectedIndex = null) {
        console.log("AutoFormTester Tupiniquim v1.8.0: Iniciando para:", userName);
        nameFromForm = "";
        await waitForDomSettling(1200);
        const candidates = getCandidateForms();
        if (!candidates.length) return 0;
        const target = Number.isInteger(selectedIndex) && candidates[selectedIndex]
            ? candidates[selectedIndex]
            : candidates[0];

        const form = target.form;
        const formName = form
            ? (form.name || form.id || form.getAttribute("data-name") || form.getAttribute("aria-label") || "")
            : "";
        const fields = target.fields;
        let filled = 0;

        for (const field of fields) {
            const changed = await fillField(field, formName, userName);
            if (changed) {
                highlightField(field);
                filled++;
                await shortDelay(90, 220);
            }
        }

        console.log("AutoFormTester Tupiniquim: Concluido.", filled, "campos preenchidos.");
        return filled;
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "ping") {
            sendResponse({ status: "ready" });
        } else if (request.action === "getFormCandidates") {
            waitForDomSettling(700).then(() => {
                sendResponse({
                    status: "ok",
                    candidates: getFormCandidatesForPopup()
                });
            });
            return true;
        } else if (request.action === "fillForms") {
            autoFillForms(request.userName, request.selectedIndex).then(count => {
                sendResponse({ status: "Forms filled", count });
            });
            return true;
        }
    });

})();
