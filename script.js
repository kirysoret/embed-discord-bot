// Elementos del DOM
const embedForm = document.getElementById('embedForm');
const previewBtn = document.getElementById('previewBtn');
const generateCodeBtn = document.getElementById('generateCodeBtn');
const generateCommandBtn = document.getElementById('generateCommandBtn');
const embedPreview = document.getElementById('embedPreview');
const codeCard = document.getElementById('codeCard');
const commandCard = document.getElementById('commandCard');
const generatedCode = document.getElementById('generatedCode');
const generatedCommand = document.getElementById('generatedCommand');
const copyCodeBtn = document.getElementById('copyCodeBtn');
const copyCommandBtn = document.getElementById('copyCommandBtn');
const colorPicker = document.getElementById('colorPicker');
const colorInput = document.getElementById('color');
const sendEmbedBtn = document.getElementById('sendEmbedBtn');

// Ejemplos predefinidos
const examples = {
    welcome: {
        titulo: '¡Bienvenido al servidor! 🎉',
        descripcion: 'Esperamos que disfrutes tu estancia en nuestra comunidad. No dudes en presentarte en el canal #presentaciones.',
        color: '#00ff00',
        imagen: 'https://i.imgur.com/example-welcome.jpg',
        thumbnail: 'https://i.imgur.com/example-avatar.jpg',
        footer: 'Servidor de Discord'
    },
    announcement: {
        titulo: '📢 Anuncio Importante',
        descripcion: 'Se ha programado un mantenimiento del servidor para el próximo domingo a las 2:00 AM. Durante este tiempo, el servidor estará temporalmente fuera de línea.',
        color: '#ff6b6b',
        imagen: '',
        thumbnail: '',
        footer: 'Administración del Servidor'
    },
    event: {
        titulo: '🎮 Evento de Gaming',
        descripcion: '¡Únete a nuestro torneo de gaming este sábado! Habrá premios para los ganadores. Inscripciones abiertas hasta el viernes.',
        color: '#4ecdc4',
        imagen: 'https://i.imgur.com/example-event.jpg',
        thumbnail: '',
        footer: 'Eventos del Servidor'
    },
    info: {
        titulo: 'ℹ️ Información del Servidor',
        descripcion: '**Reglas del servidor:**\n1. Sé respetuoso con todos\n2. No spam\n3. Usa los canales correctos\n4. No compartas contenido inapropiado',
        color: '#45b7d1',
        imagen: '',
        thumbnail: '',
        footer: 'Información General'
    }
};

// Sincronizar color picker con input de texto
colorPicker.addEventListener('input', (e) => {
    colorInput.value = e.target.value;
});

colorInput.addEventListener('input', (e) => {
    colorPicker.value = e.target.value;
});

// Función para obtener datos del formulario
function getFormData() {
    const formData = new FormData(embedForm);
    return {
        titulo: formData.get('titulo') || '',
        descripcion: formData.get('descripcion') || '',
        color: formData.get('color') || '#0099ff',
        imagen: formData.get('imagen') || '',
        thumbnail: formData.get('thumbnail') || '',
        footer: formData.get('footer') || ''
    };
}

// Función para crear vista previa del embed
function createEmbedPreview(data) {
    const embed = document.createElement('div');
    embed.className = 'discord-embed';
    embed.style.borderLeftColor = data.color;

    // Header: dos columnas fijas (título y thumbnail)
    let html = '<div class="embed-header">';
    html += `<div class="embed-title">${data.titulo ? escapeHtml(data.titulo) : ''}</div>`;
    html += data.thumbnail ? `<img src="${data.thumbnail}" alt="Thumbnail" class="embed-thumbnail" onerror="this.style.display='none'">` : '<div class="embed-thumbnail"></div>';
    html += '</div>';

    // Descripción
    if (data.descripcion) {
        html += `<div class="embed-description">${formatDescription(data.descripcion)}</div>`;
    }

    // Imagen principal
    if (data.imagen) {
        html += `<img src="${data.imagen}" alt="Embed Image" class="embed-image" onerror="this.style.display='none'">`;
    }

    // Footer
    if (data.footer) {
        html += `<div class="embed-footer">${escapeHtml(data.footer)}</div>`;
    }

    embed.innerHTML = html;
    return embed;
}

// Función para formatear descripción (soporte para markdown básico)
function formatDescription(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
}

// Función para escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función para mostrar mensaje de éxito
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Función para copiar al portapapeles
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showSuccessMessage('¡Copiado al portapapeles!');
    } catch (err) {
        // Fallback para navegadores más antiguos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showSuccessMessage('¡Copiado al portapapeles!');
    }
}

// Event Listeners
previewBtn.addEventListener('click', () => {
    const data = getFormData();
    const preview = createEmbedPreview(data);
    
    embedPreview.innerHTML = '';
    embedPreview.appendChild(preview);
    
    // Ocultar placeholder si hay contenido
    const placeholder = embedPreview.querySelector('.embed-placeholder');
    if (placeholder) {
        placeholder.remove();
    }
});

generateCodeBtn.addEventListener('click', async () => {
    const data = getFormData();
    
    try {
        const response = await fetch('/api/generate-embed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            generatedCode.textContent = result.code;
            codeCard.style.display = 'block';
            commandCard.style.display = 'none';
        }
    } catch (error) {
        console.error('Error generando código:', error);
        showSuccessMessage('Error al generar el código');
    }
});

generateCommandBtn.addEventListener('click', async () => {
    const data = getFormData();
    
    try {
        const response = await fetch('/api/generate-command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            generatedCommand.textContent = result.command;
            commandCard.style.display = 'block';
            codeCard.style.display = 'none';
        }
    } catch (error) {
        console.error('Error generando comando:', error);
        showSuccessMessage('Error al generar el comando');
    }
});

copyCodeBtn.addEventListener('click', () => {
    copyToClipboard(generatedCode.textContent);
});

copyCommandBtn.addEventListener('click', () => {
    copyToClipboard(generatedCommand.textContent);
});

// Event listeners para ejemplos
document.querySelectorAll('.example-card').forEach(card => {
    card.addEventListener('click', () => {
        const exampleType = card.dataset.example;
        const exampleData = examples[exampleType];
        
        if (exampleData) {
            // Llenar el formulario con los datos del ejemplo
            document.getElementById('titulo').value = exampleData.titulo;
            document.getElementById('descripcion').value = exampleData.descripcion;
            document.getElementById('color').value = exampleData.color;
            document.getElementById('colorPicker').value = exampleData.color;
            document.getElementById('imagen').value = exampleData.imagen;
            document.getElementById('thumbnail').value = exampleData.thumbnail;
            document.getElementById('footer').value = exampleData.footer;
            
            // Generar vista previa automáticamente
            previewBtn.click();
            
            // Scroll suave al formulario
            document.querySelector('.form-section').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    });
});

// Auto-preview al cambiar campos
const formInputs = embedForm.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('input', () => {
        // Solo generar preview si hay algún contenido
        const data = getFormData();
        const hasContent = Object.values(data).some(value => value.trim() !== '');
        
        if (hasContent) {
            previewBtn.click();
        }
    });
});

// --- Autenticación Discord y servidores privados ---
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const guildsSection = document.getElementById('guildsSection');
const guildSelect = document.getElementById('guildSelect');
const channelSelect = document.getElementById('channelSelect');

let guildsCache = [];

async function checkAuth() {
    try {
        const res = await fetch('/api/guilds');
        if (res.status === 401) {
            loginBtn.style.display = '';
            logoutBtn.style.display = 'none';
            userInfo.textContent = '';
            guildsSection.style.display = 'none';
            return;
        }
        const data = await res.json();
        loginBtn.style.display = 'none';
        logoutBtn.style.display = '';
        guildsSection.style.display = '';
        guildsCache = data.guilds;
        // Llenar el select de servidores
        guildSelect.innerHTML = '<option value="">Selecciona un servidor...</option>';
        data.guilds.forEach(g => {
            const opt = document.createElement('option');
            opt.value = g.id;
            opt.textContent = g.name;
            guildSelect.appendChild(opt);
        });
        channelSelect.style.display = 'none';
        channelSelect.innerHTML = '<option value="">Selecciona un canal...</option>';
    } catch (e) {
        loginBtn.style.display = '';
        logoutBtn.style.display = 'none';
        userInfo.textContent = '';
        guildsSection.style.display = 'none';
    }
}

guildSelect.addEventListener('change', async () => {
    const guildId = guildSelect.value;
    if (!guildId) {
        channelSelect.style.display = 'none';
        channelSelect.innerHTML = '<option value="">Selecciona un canal...</option>';
        sendEmbedBtn.style.display = 'none';
        return;
    }
    // Obtener canales del servidor
    const res = await fetch(`/api/guild-channels/${guildId}`);
    const data = await res.json();
    channelSelect.innerHTML = '<option value="">Selecciona un canal...</option>';
    if (data.channels && data.channels.length > 0) {
        data.channels.forEach(c => {
            const tipo = c.type === 5 ? ' (anuncios)' : '';
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `#${c.name}${tipo}`;
            channelSelect.appendChild(opt);
        });
        channelSelect.style.display = '';
    } else {
        channelSelect.style.display = '';
        channelSelect.innerHTML = '<option value="">No hay canales disponibles</option>';
    }
    sendEmbedBtn.style.display = 'none';
});

channelSelect.addEventListener('change', () => {
    if (guildSelect.value && channelSelect.value) {
        sendEmbedBtn.style.display = '';
    } else {
        sendEmbedBtn.style.display = 'none';
    }
});

sendEmbedBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const guildId = guildSelect.value;
    const channelId = channelSelect.value;
    if (!guildId || !channelId) {
        showSuccessMessage('Selecciona un servidor y un canal');
        return;
    }
    const data = getFormData();
    const res = await fetch('/api/send-embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId, channelId, ...data })
    });
    const result = await res.json();
    if (result.success) {
        showSuccessMessage('¡Embed enviado correctamente!');
    } else {
        showSuccessMessage('Error al enviar el embed');
    }
});

loginBtn.addEventListener('click', () => {
    window.location.href = '/api/login';
});
logoutBtn.addEventListener('click', () => {
    window.location.href = '/api/logout';
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('Generador de Embeds cargado correctamente');
    
    // Establecer color por defecto
    colorPicker.value = '#0099ff';
    colorInput.value = '#0099ff';
    
    checkAuth();
}); 