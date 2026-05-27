// ==========================================
// CONFIGURACIÓN FIREBASE
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

const listaContenedor = document.getElementById('listaPedidos');
const contador = document.getElementById('contadorPedidos');

// ==========================================
// ESCUCHA EN TIEMPO REAL
// ==========================================
function escucharPedidos() {

    db.collection('pedidos')
    .orderBy('timestamp', 'desc')
    .onSnapshot((snapshot) => {

        contador.innerText = `${snapshot.size} Órdenes Activas`;

        if (snapshot.empty) {
            listaContenedor.innerHTML = `
                <p class="sin-pedidos"
                   style="color:#928794; text-align:center; padding:25px; font-style:italic;">
                   ✨ Ningún pedido pendiente. La cocina está libre.
                </p>
            `;
            return;
        }

        listaContenedor.innerHTML = '';

        snapshot.forEach((doc) => {

            const pedido = doc.data();

            const itemHTML = `
                <div class="pedido-card-moderno fade-in">

                    <div class="pedido-info">
                        <h4>${pedido.producto}</h4>

                        <p>
                            Alumno:
                            <strong style="color:white;">
                                ${pedido.nombre}
                            </strong>
                            |
                            Sección: ${pedido.grado}
                        </p>

                        <p>
                            <small style="color:#7bc143; font-weight:bold;">
                                Cantidad: ${pedido.cantidad} raciones
                                |
                                Pago verificado: S/ ${pedido.montoTotal}
                            </small>
                        </p>
                    </div>

                    <button class="btn-despachar" data-id="${doc.id}">
                        <i class="fa-solid fa-check"></i>
                        Despachado
                    </button>

                </div>
            `;

            listaContenedor.innerHTML += itemHTML;
        });

        activarBotonesDespacho();

    }, (error) => {

        console.error('ERROR FIRESTORE:', error);

        listaContenedor.innerHTML = `
            <p style="color:#ff8080; text-align:center; padding:25px;">
                ⚠️ Error al conectar con Firebase.<br><br>
                Revisa la consola (F12).
            </p>
        `;
    });
}

// ==========================================
// BOTONES DESPACHAR
// ==========================================
function activarBotonesDespacho() {

    document.querySelectorAll('.btn-despachar').forEach(btn => {

        btn.onclick = async () => {

            const id = btn.getAttribute('data-id');

            try {

                await db.collection('pedidos').doc(id).delete();

            } catch (error) {

                console.error('ERROR ELIMINANDO PEDIDO:', error);

                alert('No se pudo eliminar el pedido.');
            }
        };
    });
}

// ==========================================
// INICIO
// ==========================================
escucharPedidos();
