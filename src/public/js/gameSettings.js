document.addEventListener("DOMContentLoaded", function () {
    const difficultyButtons = document.querySelectorAll(".difficulty-button");
    const difficultyMessage = document.getElementById("difficultyMessage");
    const difficultyText = document.getElementById("difficultyText");
    const confirmDifficulty = document.getElementById("confirmDifficulty");
    const pageContent = document.querySelector(".game-container");

    // Crear el botón de cancelar si no existe
    let cancelButton = document.getElementById("cancelDifficulty");
    if (!cancelButton) {
        cancelButton = document.createElement("button");
        cancelButton.id = "cancelDifficulty";
        cancelButton.textContent = "Cancelar";
        cancelButton.classList.add("cancel-button");

        // Contenedor para alinear los botones
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        // Insertar los botones en el contenedor
        buttonContainer.appendChild(confirmDifficulty);
        buttonContainer.appendChild(cancelButton);

        // Agregar el contenedor debajo del mensaje
        difficultyMessage.appendChild(buttonContainer);
    }

    let selectedTime = null;
    let lastSelectedButton = null; // Guarda el último botón seleccionado

    console.log("✅ Script cargado correctamente");

    // Evento para seleccionar dificultad
    difficultyButtons.forEach(button => {
        button.addEventListener("click", function () {
            selectedTime = this.getAttribute("data-time");
            lastSelectedButton = this; // Guarda el botón seleccionado

            // Extraer el texto sin emojis y convertir las abreviaciones
            let difficultyTextContent = this.innerText
                .replace(/🔰|🟢|🟡|🔴|🔥/g, "") // Eliminar emojis
                .replace(/\bmin\b/g, "minutos") // Reemplazar "min" por "minutos"
                .replace(/\bseg\b/g, "segundos") // Reemplazar "seg" por "segundos")
                .trim()
                .split("\n")[0];

            // Resaltar el botón seleccionado
            difficultyButtons.forEach(btn => btn.classList.remove("selected"));
            this.classList.add("selected");

            console.log(`🟢 Dificultad seleccionada: ${difficultyTextContent} con ${selectedTime} segundos`);

            // Mostrar mensaje de confirmación con accesibilidad mejorada
            difficultyText.textContent = `${difficultyTextContent} ha sido seleccionado. Presiona "Comenzar" para iniciar o "Cancelar" para volver.`;

            difficultyMessage.classList.remove("hidden");
            difficultyMessage.setAttribute("aria-hidden", "false");
            difficultyMessage.setAttribute("aria-live", "polite"); // Se anuncia sin ser alerta intrusiva
            difficultyMessage.setAttribute("aria-describedby", "difficultyText");
            difficultyMessage.setAttribute("tabindex", "-1");

            // Desenfocar el fondo para mejorar experiencia de usuario
            pageContent.classList.add("blur-background");
            pageContent.setAttribute("aria-hidden", "true");

            // Transferir el foco al botón "Comenzar" para accesibilidad
            setTimeout(() => confirmDifficulty.focus(), 100);

            // Restringir navegación con tab dentro del cuadro emergente
            trapFocus(difficultyMessage);
        });
    });

    // Evento para confirmar la dificultad y comenzar el juego
    confirmDifficulty.addEventListener("click", function () {
        if (selectedTime) {
            localStorage.setItem("questionTime", selectedTime);
            console.log("🚀 Dificultad confirmada:", selectedTime);

            closeModal();

            // Redirigir al juego
            window.location.href = "/juego";
        }
    });

    // Evento para cancelar la selección de dificultad
    cancelButton.addEventListener("click", function () {
        console.log("❌ Selección de dificultad cancelada.");

        closeModal();

        // Regresar el foco al último botón seleccionado
        if (lastSelectedButton) {
            setTimeout(() => lastSelectedButton.focus(), 100);
        } else {
            // Si no hay botón seleccionado, ir al primero
            setTimeout(() => difficultyButtons[0].focus(), 100);
        }
    });

    // Función para cerrar el modal de confirmación
    function closeModal() {
        difficultyMessage.classList.add("hidden");
        difficultyMessage.setAttribute("aria-hidden", "true");

        // Restaurar accesibilidad de la página
        pageContent.classList.remove("blur-background");
        pageContent.setAttribute("aria-hidden", "false");
    }

    // Función para restringir la navegación con Tab dentro del modal
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll("button");
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        element.addEventListener("keydown", function (event) {
            if (event.key === "Tab") {
                if (event.shiftKey) {
                    // Si Shift+Tab, mover foco al último elemento si estamos en el primero
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Si Tab, mover foco al primer elemento si estamos en el último
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
});
