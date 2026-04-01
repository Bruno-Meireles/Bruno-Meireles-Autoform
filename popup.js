// AutoFormTester Tupiniquim - Popup Script

document.addEventListener("DOMContentLoaded", function () {
    const copyButton = document.getElementById("copyButton");
    const customUrlButton = document.getElementById("customUrlButton");
    const fillButton = document.getElementById("fillButton");
    const successMessage = document.getElementById("successMessage");
    const userNameInput = document.getElementById("userNameInput");
    const saveNameButton = document.getElementById("saveNameButton");

    // Função para configurar o estado do input de nome e botão
    function setupNameInput(userName, disableInput = true) {
        userNameInput.value = userName;
        userNameInput.disabled = disableInput;
        if (disableInput && userName) {
            saveNameButton.textContent = "Editar Nome";
            saveNameButton.classList.remove("save-button");
            saveNameButton.classList.add("edit-button");
        } else {
            saveNameButton.textContent = "Salvar Nome";
            saveNameButton.classList.remove("edit-button");
            saveNameButton.classList.add("save-button");
        }
    }

    // Carregar o nome salvo ao abrir o popup
    chrome.storage.sync.get(["userName"], function (result) {
        console.log("AutoFormTester Tupiniquim: Carregando nome do storage. Resultado:", result);
        if (result.userName) {
            setupNameInput(result.userName, true);
        } else {
            setupNameInput("", false);
        }
    });

    // Lógica para o botão de editar/salvar
    saveNameButton.addEventListener("click", function () {
        if (userNameInput.disabled) {
            setupNameInput(userNameInput.value, false);
            userNameInput.focus();
        } else {
            const userName = userNameInput.value.trim();
            if (userName) {
                chrome.storage.sync.set({ userName: userName }, function () {
                    console.log("AutoFormTester Tupiniquim: Nome salvo no storage:", userName);
                    showSuccessMessage("Nome salvo com sucesso!");
                    setupNameInput(userName, true);
                });
            } else {
                showSuccessMessage("Por favor, insira um nome.");
            }
        }
    });

    // Função para mostrar mensagem de sucesso
    function showSuccessMessage(message) {
        successMessage.textContent = message;
        successMessage.classList.add("show");
        setTimeout(() => {
            successMessage.classList.remove("show");
        }, 2000);
    }

    // Função para aguardar que o content script esteja pronto
    async function waitForContentScript(tabId, maxAttempts = 10) {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                console.log(`AutoFormTester Tupiniquim: Tentativa ${attempt} de comunicação com content script.`);
                const response = await chrome.tabs.sendMessage(tabId, { action: "ping" });
                if (response) {
                    console.log("AutoFormTester Tupiniquim: Content script está pronto.");
                    return true;
                }
            } catch (err) {
                console.log(`AutoFormTester Tupiniquim: Tentativa ${attempt} falhou:`, err.message);
                if (attempt < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 200)); // Aguarda 200ms antes da próxima tentativa
                }
            }
        }
        return false;
    }

    // Função para preencher formulário
    fillButton.addEventListener("click", async function () {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const userName = userNameInput.value.trim();

        if (!userName) {
            showSuccessMessage("Por favor, salve um nome primeiro.");
            return;
        }

        try {
            console.log("AutoFormTester Tupiniquim: Executando content script.");
            // Injeta o content script e aguarda sua execução
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["scripts/content.js"],
            });

            // Aguarda que o content script esteja pronto para receber mensagens
            const isReady = await waitForContentScript(tab.id);
            if (!isReady) {
                throw new Error("Content script não está respondendo após várias tentativas.");
            }

            console.log("AutoFormTester Tupiniquim: Enviando mensagem para content script.");
            const response = await chrome.tabs.sendMessage(tab.id, { action: "fillForms", userName: userName });
            console.log("AutoFormTester Tupiniquim: Resposta do content script:", response);
            if (response && response.status === "Forms filled") {
                showSuccessMessage("Formulário preenchido com sucesso!");
                setTimeout(() => window.close(), 1500);
            } else {
                showSuccessMessage("Nenhum formulário encontrado.");
            }
        } catch (err) {
            console.error("Erro ao preencher formulário:", err);
            showSuccessMessage("Erro ao acessar a página. Recarregue e tente novamente.");
        }
    });

    // Função para copiar URL (mantida do código anterior)
    const urlToCopy = "/?matchtype=matchtypeValue&device=deviceValue&adposition=adpositionValue&placement=placementValue&targetid=targetidValue&feeditemid=feeditemidValue&adgroupid=adgroupidValue&target=targetValue&gclid=gclidValue&utm_term=utm_termValue&utm_content=utm_contentValue&utm_id=utm_idValue&utm_source_platform=utm_source_platformValue&utm_source=utm_sourceValue&utm_campaign=utm_campaignValue&devicemodel=devicemodelValue&utm_medium=utm_mediumValue";

    copyButton.addEventListener("click", async function () {
        try {
            await navigator.clipboard.writeText(urlToCopy);
            showSuccessMessage("URL copiada com sucesso!");
        } catch (err) {
            console.error("Erro ao copiar URL:", err);
            showSuccessMessage("Erro ao copiar URL");
        }
    });

    // Função para copiar URL personalizada
    customUrlButton.addEventListener("click", async function () {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const url = new URL(tab.url);
            const baseUrl = `${url.protocol}//${url.hostname}`;
            const customUrl = `${baseUrl}/?user_origin=${encodeURIComponent(tab.url)}&matchtype=matchtypeValue&device=deviceValue&adposition=adpositionValue&placement=placementValue&targetid=targetidValue&feeditemid=feeditemidValue&adgroupid=adgroupidValue&target=targetValue&gclid=gclidValue&utm_term=utm_termValue&utm_content=utm_contentValue&utm_id=utm_idValue&utm_source_platform=utm_source_platformValue&utm_source=utm_sourceValue&utm_campaign=utm_campaignValue&devicemodel=devicemodelValue&utm_medium=utm_mediumValue`;

            await navigator.clipboard.writeText(customUrl);
            showSuccessMessage("URL personalizada copiada!");
        } catch (err) {
            console.error("Erro ao copiar URL personalizada:", err);
            showSuccessMessage("Erro ao copiar URL personalizada");
        }
    });

    console.log("AutoFormTester Tupiniquim: Popup script carregado.");
});

