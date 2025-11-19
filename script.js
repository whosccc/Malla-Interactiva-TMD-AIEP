document.addEventListener("DOMContentLoaded", () => {
    const ramos = document.querySelectorAll(".ramo");
    const totalRamos = ramos.length;
    const progresoBarra = document.getElementById("progreso");
    const contadorTexto = document.getElementById("contador");
    const resetBtn = document.getElementById("reset-btn");

    // Cargar estados guardados
    ramos.forEach(ramo => {
        const id = ramo.id;
        const estado = localStorage.getItem(id);

        if (estado === "aprobado") {
            ramo.classList.add("aprobado");
            ramo.classList.remove("no-aprobado");
        }
    });

    actualizarProgreso();

    // Evento de clic para aprobar
    ramos.forEach(ramo => {
        ramo.addEventListener("click", () => {

            if (ramo.classList.contains("aprobado")) {
                ramo.classList.remove("aprobado");
                ramo.classList.add("no-aprobado");
                localStorage.setItem(ramo.id, "no");
            } else {
                ramo.classList.add("aprobado");
                ramo.classList.remove("no-aprobado");
                localStorage.setItem(ramo.id, "aprobado");
            }

            actualizarProgreso();
        });
    });

    // Botón RESET
    resetBtn.addEventListener("click", () => {
        ramos.forEach(ramo => {
            ramo.classList.remove("aprobado");
            ramo.classList.add("no-aprobado");
            localStorage.setItem(ramo.id, "no");
        });

        actualizarProgreso();
    });

    // Función de progreso
    function actualizarProgreso() {
        let aprobados = document.querySelectorAll(".aprobado").length;
        let porcentaje = Math.round((aprobados / totalRamos) * 100);

        progresoBarra.style.width = porcentaje + "%";
        contadorTexto.textContent = porcentaje;
    }
});
