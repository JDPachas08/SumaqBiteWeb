// ==========================================
// CONFIGURACIÓN DE CONEXIÓN FIREBASE (COCINA)
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

if (!window.firebase.apps.length) {
    window.firebase.initializeApp(firebaseConfig);
}
const db = window.firebase.firestore();

// ==========================================
// ESCUCHA ACTIVA EN TIEMPO REAL DESDE LA NUBE
// ==========================================
db.collection("pedidos").orderBy("fecha", "desc").onSnapshot((snapshot) => {
    const listaContenedor = document.getElementById('listaPedidos');
    const contador = document.getElementById('contadorPedidos');
    
    contador.innerText = `${snapshot.size} Órdenes Activas`;

    if (snapshot.empty) {
        listaContenedor.innerHTML = '<p class="sin-pedidos" style="color:#928794; text-align:center; padding: 25px; font-style: italic;">✨ Ningún pedido pendiente. La cocina está libre.</p>';
        return;
    }

    listaContenedor.innerHTML = '';
    
    snapshot.forEach((doc) => {
        const pedido = doc.data();
        const itemHTML = `
            <div class="pedido-card-moderno fade-in">
                <div class="pedido-info">
                    <h4>${pedido.producto}</h4>
                    <p>Alumno: <strong style="color:white;">${pedido.nombre}</strong> | Sección: ${pedido.grado}</p>
                    <p><small style="color: #7bc143; font-weight:bold;">Cantidad: ${pedido.cantidad} raciones | Pago verificado: S/ ${pedido.montoTotal || '0.00'}</small></p>
                </div>
                <button class="btn-despachar" id="btn-del-${doc.id}">
                    <i class="fa-solid fa-check"></i> Despachado
                </button>
            </div>
        `;
        listaContenedor.innerHTML += itemHTML;

        // Asignación manual del evento de borrado para evitar problemas con el ciclo del DOM
        setTimeout(() => {
            const btn = document.getElementById(`btn-del-${doc.id}`);
            if(btn) {
                btn.onclick = () => {
                    if(confirm(`¿Confirmas que la ración de ${pedido.nombre} ya fue entregada en físico?`)) {
                        db.collection("pedidos").doc(doc.id).delete();
                    }
                };
            }
        }, 50);
    });
}, (error) => {
    console.error("Error en la conexión en tiempo real de la cocina: ", error);
});
