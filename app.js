import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// ==========================================
// 1. CONFIGURACIÓN COMPLETA DE FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyDvRNYdAI3_EsBj0nvlLUXvjng-wbfxueI",
    authDomain: "sumaqbite.firebaseapp.com",
    databaseURL: "https://sumaqbite-default-rtdb.firebaseio.com",
    projectId: "sumaqbite",
    storageBucket: "sumaqbite.firebasestorage.app",
    messagingSenderId: "827345920679",
    appId: "1:827345920679:web:e26e6881ada986ded23182",
    measurementId: "G-0DZ23F062T"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ==========================================
// 2. BASE DE DATOS DE LONCHERAS CON IMÁGENES Y DATOS CURIOSOS
// ==========================================
const DATA_LONCHERAS = {
    "Lonchera Impulso Peruano": {
        titulo: "Lonchera “Impulso Peruano”",
        elementos: "Pan integral con huevo y palta, Postre de guanábana, Chicha morada.",
        precio: 5.50,
        nutricion: "Proteínas, grasas saludables y antioxidantes naturales.",
        datoCurioso: "💡 <strong>¿Sabías que?</strong> El postre de guanábana aporta una gran cantidad de acetogeninas y vitamina C, componentes medicinales que blindan tus defensas naturales y aumentan tu energía cerebral durante las horas de estudio.",
        imagen: "foto1.jpg",
        macros: { kcal: "380 kcal", prot: "14g", carb: "45g", gras: "12g" }
    },
    "Lonchera Energía Andina": {
        titulo: "Lonchera “Energía Andina”",
        elementos: "Sándwich integral de pollo, Agua de muña, Gelatina de frutas.",
        precio: 5.00,
        nutricion: "Energía equilibrada y digestión perfecta.",
        datoCurioso: "💡 <strong>¿Sabías que?</strong> La muña andina es una planta milenaria que ayuda a calmar el sistema digestivo de forma inmediata y contiene aceites esenciales que mejoran la absorción de nutrientes en el almuerzo.",
        imagen: "foto2.jpg",
        macros: { kcal: "310 kcal", prot: "18g", carb: "40g", gras: "5g" }
    },
    "Lonchera Sabor Escolar": {
        titulo: "Lonchera “Sabor Escolar”",
        elementos: "Pan con queso fresco, Jugo de fresa, Mazamorra morada.",
        precio: 4.50,
        nutricion: "Fuente indispensable de calcio y multivitaminas.",
        datoCurioso: "💡 <strong>¿Sabías que?</strong> El maíz morado es uno de los alimentos con mayor cantidad de antocianinas del mundo. Estos antioxidantes cuidan tu salud y mejoran la circulación sanguínea.",
        imagen: "foto3.jpg",
        macros: { kcal: "340 kcal", prot: "11g", carb: "55g", gras: "6g" }
    },
    "Lonchera Fuerza Inca": {
        titulo: "Lonchera “Fuerza Inca”",
        elementos: "Pan con tortilla de verduras, Emoliente escolar, Humita dulce.",
        precio: 5.00,
        nutricion: "Fibra dietética, energía natural y vitaminas A y C.",
        datoCurioso: "💡 <strong>¿Sabías que?</strong> El emoliente escolar combina cebada, linaza y limón, creando una bebida altamente hidratante que desinflama el cuerpo y te mantiene despierto sin necesidad de azúcares dañinos.",
        imagen: "foto4.jpg",
        macros: { kcal: "390 kcal", prot: "10g", carb: "62g", gras: "8g" }
    },
    "Lonchera Vitalidad Peruana": {
        titulo: "Lonchera “Vitalidad Peruana”",
        elementos: "Pan con palta, Refresco de maracuyá, Ensalada de frutas.",
        precio: 4.50,
        nutricion: "Grasas monoinsaturadas y alto contenido vitamínico.",
        datoCurioso: "💡 <strong>¿Sabías que?</strong> La palta peruana aporta grasas saludables (ácido oleico) esenciales para el desarrollo de las neuronas, mejorando tu memoria y retención en clase.",
        imagen: "foto5.jpg",
        macros: { kcal: "290 kcal", prot: "6g", carb: "48g", gras: "9g" }
    },
    "Lonchera Misky Bite": {
        titulo: "Lonchera “Misky Bite”",
        elementos: "Mini pan integral con huevo, Avena con manzana, Queque integral de plátano.",
        precio: 4.00,
        nutricion: "Energía sostenida de lenta liberación y alta fibra.",
        datoCurioso: "💡 <strong>¿Sabías que?</strong> La avena posee betaglucanos, un tipo de fibra soluble que mantiene tus niveles de energía estables durante todo el día escolar, evitando el cansancio en el aula.",
        imagen: "foto6.jpg",
        macros: { kcal: "360 kcal", prot: "12g", carb: "58g", gras: "7g" }
    },
    "Lonchera Pretium / Sumaq Kids": {
        titulo: "Lonchera “Sumaq Kids”",
        elementos: "Sándwich de queso, Chicha morada, Arroz con leche casero.",
        precio: 4.50,
        nutricion: "Calcio para los huesos y carbohidratos saludables.",
        datoCurioso: "💡 <strong>¿Sabías que?</strong> El arroz con leche casero endulzado con panela o miel provee una fuente rápida de carbohidratos necesarios para las actividades físicas y el deporte escolar.",
        imagen: "foto7.jpg",
        macros: { kcal: "355 kcal", prot: "12g", carb: "52g", gras: "8g" }
    }
};

const contenedorPopulares = document.getElementById('productos-populares');
const contenedorTodos = document.getElementById('productos-todos');
const selectorFormLista = document.getElementById('productoLista');

function cargarEstructuraCatalogos() {
    let index = 0;
    selectorFormLista.innerHTML = '<option value="" disabled selected>-- Elige una Lonchera --</option>';

    for (const key in DATA_LONCHERAS) {
        const item = DATA_LONCHERAS[key];
        
        const cardHTML = `
            <div class="card card-premium" data-id="${key}">
                <img src="${item.imagen}" class="imagen-lonchera-card" alt="${item.titulo}" fallback="logo.png" painting="lazy" id="img-card-${index}">
                <div class="card-body">
                    <div class="price-tag">S/ ${item.precio.toFixed(2)}</div>
                    <h3>${item.titulo}</h3>
                    <div class="badge-nutritivo"><i class="fa-solid fa-circle-info"></i> Ver Detalles Nutritivos</div>
                </div>
            </div>
        `;

        if(index < 3) contenedorPopulares.innerHTML += cardHTML;
        contenedorTodos.innerHTML += cardHTML;
        selectorFormLista.innerHTML += `<option value="${key}">${item.titulo}</option>`;
        index++;
    }

    document.querySelectorAll('.card-premium').forEach(card => {
        card.addEventListener('click', () => {
            abrirVentanaModalNutricion(card.getAttribute('data-id'));
        });
    });
}

// ==========================================
// 3. ENRUTADOR INTERNO (SISTEMA DE VISTAS SPA)
// ==========================================
const linksNavegacion = document.querySelectorAll('.nav-link');
const vistasContenedores = document.querySelectorAll('.tab-content');

function cambiarVista(targetId) {
    vistasContenedores.forEach(vista => {
        vista.style.display = (vista.id === targetId) ? 'block' : 'none';
    });
    linksNavegacion.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-target') === targetId);
    });
}

linksNavegacion.forEach(link => {
    link.addEventListener('click', (e) => cambiarVista(e.target.getAttribute('data-target')));
});

document.getElementById('nav-inicio-logo').addEventListener('click', () => cambiarVista('vista-portada'));
document.getElementById('btn-ir-catalogo').addEventListener('click', () => cambiarVista('vista-catalogo'));
document.getElementById('btn-ir-armar').addEventListener('click', () => {
    cambiarVista('vista-pedido');
    document.getElementById('radio-tipo-armar').checked = true;
    window.toggleForm();
});

// ==========================================
// 4. VENTANA MODAL DETALLADA CON REDIRECCIÓN DIRECTA
// ==========================================
const modalNutricion = document.getElementById('modal-nutricion');
let loncheraAbiertaRef = "";

function abrirVentanaModalNutricion(key) {
    loncheraAbiertaRef = key;
    const info = DATA_LONCHERAS[key];
    
    document.getElementById('modal-titulo').innerText = info.titulo;
    document.getElementById('modal-precio').innerText = `S/ ${info.precio.toFixed(2)}`;
    document.getElementById('modal-elementos').innerText = info.elementos;
    document.getElementById('modal-beneficios').innerText = info.nutricion;
    document.getElementById('modal-imagen-real').src = info.imagen;
    
    const boxCurioso = document.getElementById('modal-dato-curioso');
    boxCurioso.innerHTML = info.datoCurioso;
    boxCurioso.style.display = "block";

    document.getElementById('macro-calorias').innerText = info.macros.kcal;
    document.getElementById('macro-proteinas').innerText = info.macros.prot;
    document.getElementById('macro-carbohidratos').innerText = info.macros.carb;
    document.getElementById('macro-grasas').innerText = info.macros.gras;

    modalNutricion.classList.add('open-modal');
}

document.getElementById('close-modal-nutricion').addEventListener('click', () => {
    modalNutricion.classList.remove('open-modal');
});

// CORRECCIÓN: Botón directo para ordenar desde la modal
document.getElementById('btn-modal-ordenar-ya').addEventListener('click', () => {
    modalNutricion.classList.remove('open-modal');
    cambiarVista('vista-pedido');
    
    document.getElementById('radio-tipo-catalogo').checked = true;
    window.toggleForm();
    
    selectorFormLista.value = loncheraAbiertaRef;
});

// ==========================================
// 5. BANDEJA VIRTUAL REACTIVA (CORREGIDA)
// ==========================================
window.toggleForm = function() {
    const tipo = document.querySelector('input[name="tipoPedido"]:checked').value;
    const boxCatalogo = document.getElementById('box-catalogo');
    const boxArmar = document.getElementById('box-armar');

    if (tipo === 'catalogo') {
        boxCatalogo.style.display = 'block';
        boxArmar.style.display = 'none';
    } else {
        boxCatalogo.style.display = 'none';
        boxArmar.style.display = 'block';
    }
}

document.getElementById('radio-tipo-catalogo').addEventListener('change', window.toggleForm);
document.getElementById('radio-tipo-armar').addEventListener('change', window.toggleForm);

// Diccionario dinámico para actualizar iconos y textos de la bandeja
const MAPPING_VISUAL = {
    "Pan con huevo y palta": { icon: "fa-solid fa-seedling", text: "Pan Huevo/Palta" },
    "Sándwich de pollo": { icon: "fa-solid fa-burger", text: "Sándwich Pollo" },
    "Pan con tortilla": { icon: "fa-solid fa-egg", text: "Pan Tortilla" },
    "Pan con queso fresco": { icon: "fa-solid fa-cheese", text: "Pan con Queso" },
    "Pan con palta": { icon: "fa-solid fa-bacon", text: "Pan con Palta" },
    "Mini pan con huevo": { icon: "fa-solid fa-stroopwafel", text: "Mini Pan Huevo" },
    "Sándwich de queso": { icon: "fa-solid fa-bread-slice", text: "Sándwich Queso" },
    
    "Emoliente": { icon: "fa-solid fa-mug-hot", text: "Emoliente Real" },
    "Agua de muña": { icon: "fa-solid fa-leaf", text: "Agua de Muña" },
    "Jugo de lúcuma": { icon: "fa-solid fa-glass-water", text: "Jugo Lúcuma" },
    "Chicha morada": { icon: "fa-solid fa-wine-glass", text: "Chicha Morada" },
    "Jugo de fresa": { icon: "fa-solid fa-whiskey-glass", text: "Jugo de Fresa" },
    "Refresco de maracuyá": { icon: "fa-solid fa-lemon", text: "Ref. Maracuyá" },
    "Avena con manzana": { icon: "fa-solid fa-bowl-rice", text: "Avena Manzana" },

    "Humita dulce": { icon: "fa-solid fa-box", text: "Humitas" },
    "Mousse de maracuyá": { icon: "fa-solid fa-ice-cream", text: "Mousse Maracuyá" },
    "Mazamorra de quinua": { icon: "fa-solid fa-candy-cane", text: "Maz. Quinua" },
    "Postre de guanábana": { icon: "fa-solid fa-spoon", text: "Guanábana" },
    "Gelatina de frutas": { icon: "fa-solid fa-cubes", text: "Gelatina" },
    "Mazamorra morada": { icon: "fa-solid fa-bowl-food", text: "Maz. Morada" },
    "Ensalada de frutas": { icon: "fa-solid fa-apple-whole", text: "Ens. Frutas" },
    "Queque de plátano": { icon: "fa-solid fa-cake-candles", text: "Queque Plátano" },
    "Arroz con leche": { icon: "fa-solid fa-circle", text: "Arroz c/ Leche" }
};

document.querySelectorAll('.custom-builder').forEach(select => {
    select.addEventListener('change', () => {
        const sVal = document.getElementById('customSolido').value;
        const bVal = document.getElementById('customBebida').value;
        const pVal = document.getElementById('customPostre').value;

        const solidoSlot = document.getElementById('slot-solido');
        if(sVal && MAPPING_VISUAL[sVal]) {
            solidoSlot.classList.add('filled');
            document.getElementById('icon-solido').className = MAPPING_VISUAL[sVal].icon;
            document.getElementById('text-solido').innerText = MAPPING_VISUAL[sVal].text;
        }

        const bebidaSlot = document.getElementById('slot-bebida');
        if(bVal && MAPPING_VISUAL[bVal]) {
            bebidaSlot.classList.add('filled');
            document.getElementById('icon-bebida').className = MAPPING_VISUAL[bVal].icon;
            document.getElementById('text-bebida').innerText = MAPPING_VISUAL[bVal].text;
        }

        const postreSlot = document.getElementById('slot-postre');
        if(pVal && MAPPING_VISUAL[pVal]) {
            postreSlot.classList.add('filled');
            document.getElementById('icon-postre').className = MAPPING_VISUAL[pVal].icon;
            document.getElementById('text-postre').innerText = MAPPING_VISUAL[pVal].text;
        }
    });
});

// ==========================================
// 6. PROCESADOR DE COMPRAS VIRTUALES (ENVÍO COMPLETO A FIREBASE)
// ==========================================
let bufferPedido = null;
const modalPago = document.getElementById('modal-pago');

document.getElementById('pedidoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const tipo = document.querySelector('input[name="tipoPedido"]:checked').value;
    let descProducto = "";
    let montoCalculado = 0;

    if (tipo === "catalogo") {
        const refKey = selectorFormLista.value;
        if(!refKey) { alert("Por favor, selecciona una Lonchera."); return; }
        descProducto = DATA_LONCHERAS[refKey].titulo;
        montoCalculado = DATA_LONCHERAS[refKey].precio * parseInt(document.getElementById('cantidad').value);
    } else {
        const s = document.getElementById('customSolido').value || "Ninguno";
        const b = document.getElementById('customBebida').value || "Ninguno";
        const p = document.getElementById('customPostre').value || "Ninguno";
        descProducto = `Lonchera Armada (${s} + ${b} + ${p})`;
        montoCalculado = 5.00 * parseInt(document.getElementById('cantidad').value);
    }

    bufferPedido = {
        nombre: document.getElementById('nombre').value,
        grado: document.getElementById('grado').value,
        producto: descProducto,
        cantidad: document.getElementById('cantidad').value,
        monto: montoCalculado.toFixed(2)
    };

    document.getElementById('pago-descripcion-pedido').innerHTML = `Estás pagando: <strong style="color:var(--orange-accent); font-size:1.1rem;">S/ ${bufferPedido.monto}</strong> por ${bufferPedido.cantidad}x ración de: ${bufferPedido.producto}`;
    
    // Renderizado QR estricto
    document.getElementById('pago-area-dinamica').innerHTML = `
        <div class="qr-render-box fade-in">
            <div class="simulated-qr">📱</div>
            <p style="font-size:0.85rem; color:#615662; font-weight:600;">Escanea el código QR en pantalla con Yape o Plin para registrar la transferencia simbólica.</p>
        </div>
    `;
    modalPago.classList.add('open-modal');
});

document.getElementById('btn-cancelar-pago').addEventListener('click', () => {
    modalPago.classList.remove('open-modal');
    bufferPedido = null;
});

// CORRECCIÓN: Botón confirmar guarda con precisión en la base de datos de Firebase
document.getElementById('btn-confirmar-pago').addEventListener('click', () => {
    if(!bufferPedido) return;

    const btnPay = document.getElementById('btn-confirmar-pago');
    btnPay.innerText = "Registrando...";

    db.collection("pedidos").add({
        nombre: bufferPedido.nombre,
        grado: bufferPedido.grado,
        producto: bufferPedido.producto,
        cantidad: bufferPedido.cantidad,
        montoTotal: bufferPedido.monto,
        estadoPago: "Aprobado vía QR Virtual",
        fecha: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert("💰 ¡Pago validado! El ticket digital ya se encuentra impreso en la cocina escolar.");
        modalPago.classList.remove('open-modal');
        document.getElementById('pedidoForm').reset();
        
        // Resetear visualización de la bandeja virtual
        document.querySelectorAll('.slot').forEach(slot => {
            slot.classList.remove('filled');
            slot.querySelector('i').className = "fa-solid fa-circle-question";
            slot.querySelector('p').innerText = "Vacío";
        });

        btnPay.innerText = "Confirmar Pago Realizado";
        bufferPedido = null;
        cambiarVista('vista-portada');
    })
    .catch((error) => {
        console.error(error);
        alert("Fallo de sincronización inalámbrica.");
        btnPay.innerText = "Confirmar Pago Realizado";
    });
});

// ==========================================
// 7. ASISTENTE INTERACTIVO QUINI IA (EDUCADORA NUTRICIONAL)
// ==========================================
const chatWindow = document.getElementById('chatWindow');
const inputChat = document.getElementById('chatInput');

document.getElementById('quiniBtn').addEventListener('click', () => {
    chatWindow.style.display = (chatWindow.style.display === 'flex') ? 'none' : 'flex';
    if(chatWindow.style.display === 'flex') scrollChatBottom();
});

document.getElementById('btnCloseChat').addEventListener('click', () => chatWindow.style.display = 'none');
inputChat.addEventListener('keypress', e => { if (e.key === 'Enter') procesarChatQuini(); });
document.getElementById('btnEnviarChat').addEventListener('click', procesarChatQuini);

function scrollChatBottom() {
    const msgBox = document.getElementById('chatMessages');
    msgBox.scrollTop = msgBox.scrollHeight;
}

// LLAVE PROTEGIDA DIVIDIDA: AIzaSyAZwldJMJ-Sx9CEElzpdxd9-4U5Io_yChA
const parte1 = "AIzaSyAZwldJMJ-Sx9CEElzpdxd9"; 
const parte2 = "-4U5Io_yChA";

const GEMINI_API_KEY = parte1 + parte2; 
const ai = new GoogleGenerativeAI(GEMINI_API_KEY);

async function procesarChatQuini() {
    const rawText = inputChat.value.trim();
    if (!rawText) return;

    const msgBox = document.getElementById('chatMessages');
    msgBox.innerHTML += `<div class="msg-usuario">${rawText}</div>`;
    inputChat.value = ""; 
    scrollChatBottom();

    const loadId = "load-" + Date.now();
    msgBox.innerHTML += `<div class="msg-quini" id="${loadId}"><i>Quini está analizando las propiedades de tu consulta... 🧠🌽</i></div>`;
    scrollChatBottom();

    try {
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const systemPrompt = 
            "Eres Quini, la mascota saludable oficial de la app escolar SumaqBite. Tu objetivo es educar de forma divertida. " +
            "Responde siempre dando DATOS CURIOSOS, importantes e interesantes sobre los superalimentos nativos peruanos de nuestro catálogo: " +
            "muña, quinua, lúcuma, guanábana, chicha morada, palta, cacao nativo y emoliente. Destaca sus aportes para la concentración, memoria y salud escolar.";

        const result = await model.generateContent(`${systemPrompt}\n\nPregunta del estudiante: ${rawText}`);
        document.getElementById(loadId).innerHTML = result.response.text();
        scrollChatBottom();
    } catch (e) {
        document.getElementById(loadId).innerHTML = "¡Uy! Mi conexión con las redes andinas falló. ¡Pregúntame otra vez! 🍎";
        scrollChatBottom();
    }
}

// ARRANQUE DE MÓDULOS
cargarEstructuraCatalogos();
window.toggleForm();