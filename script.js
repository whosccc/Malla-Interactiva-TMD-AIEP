document.addEventListener("DOMContentLoaded", function () {
    const ramos = document.querySelectorAll(".ramo");

    ramos.forEach(ramo => {
        const id = ramo.id;

        // Recuperar estado desde localStorage
        const estadoGuardado = localStorage.getItem(id);

        if (estadoGuardado === "aprobado") {
            ramo.classList.remove("no-aprobado");
            ramo.classList.add("aprobado");
        }

        // Acción al hacer clic
        ramo.addEventListener("click", () => {
            if (ramo.classList.contains("bloqueado")) return;

            if (ramo.classList.contains("aprobado")) {
                // Cambiar a no aprobado
                ramo.classList.remove("aprobado");
                ramo.classList.add("no-aprobado");
                localStorage.setItem(id, "no");
            } else {
                // Cambiar a aprobado
                ramo.classList.remove("no-aprobado");
                ramo.classList.add("aprobado");
                localStorage.setItem(id, "aprobado");
            }
        });
    });
});

