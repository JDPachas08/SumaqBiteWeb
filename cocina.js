const firebaseConfig = {
    apiKey: "AIzaSyDvRNYdAI3_EsBj0nvlLUXvjng-wbfxueI",
    authDomain: "sumaqbite.firebaseapp.com",
    databaseURL: "https://sumaqbite-default-rtdb.firebaseio.com",
    projectId: "sumaqbite",
    storageBucket: "sumaqbite.firebasestorage.app",
    messagingSenderId: "827345920679",
    appId: "1:827345920679:web:e26e6881ada986ded23182"
};

if (!window.firebase.apps.length) {
    window.firebase.initializeApp(firebaseConfig);
}

const listaContenedor = document.getElementById('listaPedidos');
const contador = document.getElementById('contadorPedidos');
let pedidosFirebase = [];

function renderizarTodo() {
    let pedidosLocales = JSON.parse(localStorage.getItem('pedidos_concurso')) || [];
    let total = pedidosFirebase.length + pedidosLocales.length;
    contador.innerText = `${total} Órdenes Activas`;

    if (total === 0) {
        listaContenedor.innerHTML = '<p class="sin-pedidos" style="text-align:center; padding: 25px;">✨ Ningún pedido pendiente. La cocina está libre.</p>';
        return;
    }

    listaContenedor.innerHTML = '';
    
    // Dibujar Firebase
    pedidosFirebase.forEach(doc => {
        const p = doc.data();
        listaContenedor.innerHTML += crearTarjeta(p.producto, p.nombre, p.grado, p.cantidad, p.montoTotal, doc.id, "firebase");
    });

    // Dibujar Emergencia Local
    pedidosLocales.forEach(p => {
        listaContenedor.innerHTML += crearTarjeta(p.producto, p.nombre, p.grado, p.cantidad, p.montoTotal, p.id, "local");
    });

    // Activar botones de despacho
    pedidosFirebase.forEach(doc => {
        let btn = document.getElementById(`btn-del-${doc.id}`);
        if(btn) btn.onclick = () => { if(confirm("¿Despachado?")) window.firebase.firestore().collection("pedidos").doc(doc.id).delete(); };
    });

    pedidosLocales.forEach(p => {
        let btn = document.getElementById(`btn-del-${p.id}`);
        if(btn) btn.onclick = () => {
            if(confirm("¿Despachado?")) {
                let actuales = JSON.parse(localStorage.getItem('pedidos_concurso')) || [];
                localStorage.setItem('pedidos_concurso', JSON.stringify(actuales.filter(x => x.id !== p.id)));
                renderizarTodo();
            }
        };
    });
}

function crearTarjeta(producto, nombre, grado, cantidad, monto, id, tipo) {
    return `
        <div class="pedido-card-moderno fade-in">
            <div class="pedido-info">
                <h4>${producto}</h4>
                <p>Alumno: <strong style="color:white;">${nombre}</strong> | Sección: ${grado}</p>
                <p><small style="color:#7bc143; font-weight:bold;">Cant: ${cantidad} | Pago: S/ ${monto}</small></p>
            </div>
            <button class="btn-despachar" id="btn-del-${id}"><i class="fa-solid fa-check"></i> Despachado</button>
        </div>
    `;
}

// Escuchar Firebase si funciona
try {
    window.firebase.firestore().collection("pedidos").onSnapshot((snapshot) => {
        pedidosFirebase = snapshot.docs;
        renderizarTodo();
    });
} catch(e) {
    console.log("Modo 100% Offline (Local) Activado.");
}

// Escuchar actualizaciones locales automáticamente para el concurso
window.addEventListener('storage', renderizarTodo);
setInterval(renderizarTodo, 1500); // Forzar actualización cada segundo y medio
