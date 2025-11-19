document.addEventListener("DOMContentLoaded", () => {

    const ramos = document.querySelectorAll(".ramo");

    ramos.forEach(ramo => {
        const id = ramo.id;

        // Recuperar estado guardado
        const estado = localStorage.getItem(id);
        if (estado === "aprobado") {
            ramo.classList.remove("no-aprobado");
            ramo.classList.add("aprobado");
        }

        // Acción al hacer clic
        ramo.addEventListener("click", () => {

            if (ramo.classList.contains("bloqueado")) return;

            if (ramo.classList.contains("aprobado")) {
                ramo.classList.remove("aprobado");
                ramo.classList.add("no-aprobado");
                localStorage.setItem(id, "no");
            } else {
                ramo.classList.remove("no-aprobado");
                ramo.classList.add("aprobado");
                localStorage.setItem(id, "aprobado");
            }
        });
    });

});
