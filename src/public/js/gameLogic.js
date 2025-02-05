document.addEventListener("DOMContentLoaded", () => {
    const playerName = localStorage.getItem("playerName") || "Jugador";
    const questionTime = parseInt(localStorage.getItem("questionTime")) || 120;
    const countdownElement = document.getElementById("countdown");
    const progressBar = document.getElementById("progress-bar");
    const scoreElement = document.getElementById("score");
    const feedbackElement = document.getElementById("feedback");
    const nextButton = document.getElementById("next");
    
    let currentQuestion = 0;
    let score = 0;
    let timer;
    let timeLeft;
    let hasAnswered = false;
    
    const questions = [
        {
            question: "¿Cuál es la forma correcta? 'Quiero _____ en una casa junto al mar.'",
            options: ["bibir", "vivir", "bivír", "vivír"],
            correct: 1,
            explanation: "Se escribe 'vivir' con V."
        },
        {
            question: "Selecciona la palabra correcta: 'El próximo año será ____ porque febrero tendrá 29 días.'",
            options: ["bisiesto", "visierto", "biciclo", "visicleta"],
            correct: 0,
            explanation: "La palabra correcta es 'bisiesto', con B, ya que se refiere a un año con 366 días."
        },
        {
            question: "¿Cuál está bien escrita? 'Voy a ____ agua porque tengo sed.'",
            options: ["veber", "beber", "vever", "bever"],
            correct: 1,
            explanation: "Se escribe 'beber' con B."
        },
        {
            question: "Elige la correcta: 'Me duele la ____ después de ir al dentista.'",
            options: ["voca", "boca", "voko", "boko"],
            correct: 1,
            explanation: "Se escribe 'boca' con B."
        },
        {
            question: "¿Cuál es la palabra correcta? 'Juan ____ muchos juguetes cuando era niño.'",
            options: ["tubo", "tuvo", "tabo", "tavo"],
            correct: 1,
            explanation: "Se escribe 'tuvo' con V cuando es del verbo 'tener'. 'Tubo' con B es un objeto cilíndrico."
        },
        {
            question: "Selecciona la palabra escrita correctamente: 'Quiero ____ la verdad sobre lo que pasó.'",
            options: ["savar", "saber", "savir", "sabeer"],
            correct: 1,
            explanation: "Se escribe 'saber' con B, ya que es el verbo que significa conocer o entender algo."
        },
        {
            question: "¿Cuál es la opción correcta? 'El jardinero comenzó a ____ un hoyo para plantar el árbol.'",
            options: ["cavar", "cabar", "cabar", "caváar"],
            correct: 0,
            explanation: "Se escribe 'cavar' con V cuando significa hacer un hoyo en la tierra. 'Cabar' no existe."
        },
        {
            question: "Elige la palabra bien escrita: 'Voy a ____ un video para mi canal de YouTube.'",
            options: ["gravar", "grabar", "grabáar", "graváar"],
            correct: 1,
            explanation: "Se escribe 'grabar' con B cuando se refiere a registrar sonidos o imágenes. 'Gravar' con V significa imponer un impuesto o carga."
        },
        {
            question: "¿Cuál de estas palabras está correctamente escrita? 'Voy a ____ por mi candidato favorito en las elecciones.'",
            options: ["votar", "botar", "bortar", "vortar"],
            correct: 0,
            explanation: "Se escribe 'votar' con V cuando significa participar en elecciones. 'Botar' con B significa arrojar algo."
        },
        {
            question: "Selecciona la forma correcta de la palabra: 'Ese niño es muy ____, nunca sigue las reglas.'",
            options: ["rebelde", "revelde", "rebelde", "revende"],
            correct: 0,
            explanation: "Se escribe 'rebelde' con B, ya que hace referencia a alguien que se rebela contra algo."
        },
        {
            question: "¿Cuál es la palabra correcta? 'La biblioteca tiene un gran ____ de libros antiguos.'",
            options: ["acervo", "acerbo", "acervoo", "acerbó"],
            correct: 0,
            explanation: "'Acervo' con V significa conjunto de bienes o conocimientos, mientras que 'acerbo' con B significa algo áspero o cruel."
        },
        {
            question: "Elige la opción correcta: 'Voy a ____ el agua para preparar té.'",
            options: ["hervir", "herbir", "hervíir", "herbír"],
            correct: 0,
            explanation: "Se escribe 'hervir' con V, ya que es el verbo que indica la acción de calentar un líquido hasta su ebullición."
        },
        {
            question: "¿Cuál de estas palabras está correctamente escrita? 'Voy a ____ al segundo piso usando las escaleras.'",
            options: ["subir", "suvir", "subíir", "suvír"],
            correct: 0,
            explanation: "Se escribe 'subir' con B, ya que es el verbo que significa ascender o ir hacia arriba."
        },
        {
            question: "Selecciona la palabra bien escrita: 'Este año la cosecha fue muy ____, tenemos suficiente comida.'",
            options: ["abundante", "avundante", "habundante", "havundante"],
            correct: 0,
            explanation: "Se escribe 'abundante' con B, ya que se refiere a algo que existe en gran cantidad."
        },
        {
            question: "Elige la opción correcta: 'Las esponjas pueden ____ mucha agua.'",
            options: ["absorver", "absorber", "absober", "absurver"],
            correct: 1,
            explanation: "Se escribe 'absorber' con B, ya que significa retener o incorporar líquidos o conocimientos."
        }
    ];
    
    
    
    function startTimer() {
        timeLeft = questionTime;
        updateProgressBar();
        countdownElement.textContent = timeLeft;
        
        // Desactiva el anuncio de cambios en tiempo normal
        document.getElementById("timer-container").setAttribute("aria-live", "off");
    
        timer = setInterval(() => {
            timeLeft--;
            updateProgressBar();
            countdownElement.textContent = timeLeft;
    
            // Activa aria-live solo cuando queden 5 segundos o menos
            if (timeLeft <= 5) {
                document.getElementById("timer-container").setAttribute("aria-live", "assertive");
            }
    
            if (timeLeft <= 0) {
                clearInterval(timer);
                handleTimeout();
            }
        }, 1000);
    }
    
    
    function updateProgressBar() {
        const percentage = (timeLeft / questionTime) * 100;
        progressBar.style.width = percentage + "%";
    }
    
    function handleTimeout() {
        if (!hasAnswered) {
            hasAnswered = true;
            feedbackElement.textContent = "¡Se acabó el tiempo! " + questions[currentQuestion].explanation;
            feedbackElement.className = "feedback error";
            disableOptions();
            feedbackElement.classList.remove("hidden");
            nextButton.classList.remove("hidden");
            nextButton.disabled = false;
            
            // Resalta la opción correcta en verde
            const options = document.querySelectorAll(".option");
            options[questions[currentQuestion].correct].classList.add("correct");
        }
    }
    
    function disableOptions() {
        document.querySelectorAll(".option").forEach(option => option.disabled = true);
    }
    
    function enableOptions() {
        document.querySelectorAll(".option").forEach(option => {
            option.disabled = false;
            option.classList.remove("correct", "incorrect");
        });
    }
    
    function checkAnswer(selected) {
        clearInterval(timer);
        hasAnswered = true;
        const correct = questions[currentQuestion].correct;
    
        const options = document.querySelectorAll(".option");
        options[selected].classList.add(selected === correct ? "correct" : "incorrect");
        options[correct].classList.add("correct");
    
        // Determinar puntos base según dificultad y tiempo de respuesta
        let basePoints = getPointsPerQuestion();
        let bonusPoints = getTimeBonus();
        let totalPoints = basePoints + bonusPoints;
        
        if (selected === correct) {
            score += totalPoints;
            scoreElement.textContent = score;
            feedbackElement.textContent = questions[currentQuestion].explanation;
            feedbackElement.className = "feedback correct";
        } else {
            feedbackElement.textContent = "Incorrecto. " + questions[currentQuestion].explanation;
            feedbackElement.className = "feedback error";
        }
    
        // Asegurar que el feedback sea leído
        feedbackElement.classList.remove("hidden");
        nextButton.classList.remove("hidden");
        nextButton.disabled = false;
        disableOptions();
    }

    function getTimeBonus() {
        let elapsed = questionTime - timeLeft; // Tiempo que ha pasado
        let percentElapsed = elapsed / questionTime; // Porcentaje del tiempo usado
    
        if (percentElapsed < 0.15) return 3; // Respondió en el 15% del tiempo → Máximo bono
        if (percentElapsed < 0.30) return 2; // Respondió en el 30% del tiempo → Bono medio
        if (percentElapsed < 0.50) return 1; // Respondió en el 75% del tiempo → Bono bajo
        return 0; // Respondió tarde → Sin bono
    }
    
    
    
    function getPointsPerQuestion() {
        if (questionTime >= 180) return 1; // Muy fácil
        if (questionTime >= 150) return 2; // Fácil
        if (questionTime >= 120) return 3; // Media
        if (questionTime >= 90) return 4;  // Difícil
        return 5; // Muy difícil (60s)
    }    
    
    window.nextQuestion = function () {
        currentQuestion++;
    
        if (currentQuestion >= questions.length) {
            showFinalScore();
            return;
        }
    
        hasAnswered = false;
        feedbackElement.classList.add("hidden");
        nextButton.classList.add("hidden");
        nextButton.disabled = true;
    
        loadQuestion();
        enableOptions();
        startTimer();
    };
    
    function showFinalScore() {
        // Obtener la tabla de clasificación desde localStorage
        let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    
        // Crear un nuevo registro para el jugador actual
        let newEntry = {
            player: playerName,
            score: score,
            difficulty: getDifficultyLabel(questionTime),
            date: new Date().toLocaleString()
        };
    
        // Agregar el nuevo puntaje a la tabla de clasificación
        leaderboard.push(newEntry);
    
        // Ordenar los puntajes de mayor a menor
        leaderboard.sort((a, b) => b.score - a.score);
    
        // Mantener solo los 5 mejores puntajes
        leaderboard = leaderboard.slice(0, 5);
    
        // Guardar la clasificación en localStorage
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    
        // Generar la tabla de clasificación en HTML
        let leaderboardHTML = `
            <h2>🏆 ¡Juego terminado! 🏆</h2>
            <p>Tu puntuación final: <strong>${score}</strong></p>
            <h3>📋 Tabla de clasificación:</h3>
            <table border="1">
                <tr>
                    <th>Posición</th>
                    <th>Jugador</th>
                    <th>Puntaje</th>
                    <th>Dificultad</th>
                    <th>Fecha</th>
                </tr>
        `;
    
        leaderboard.forEach((entry, index) => {
            leaderboardHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${entry.player}</td>
                    <td>${entry.score}</td>
                    <td>${entry.difficulty}</td>
                    <td>${entry.date}</td>
                </tr>
            `;
        });
    
        leaderboardHTML += `</table>
            <button class="next-button" onclick="window.location.href='/'">Jugar de nuevo 🔄</button>
        `;
    
        // Mostrar la tabla de clasificación en la pantalla
        document.querySelector(".game-container").innerHTML = leaderboardHTML;
    }
    
    
    function loadQuestion() {
        const question = questions[currentQuestion];
        
        // Asignar el texto con puntuaciones en el contenido visual
        document.getElementById("question").textContent = question.question;
        
        // Limpiar el texto para el lector de pantalla (eliminando guiones y puntuaciones)
        let cleanQuestion = question.question.replace(/[_]/g, ", ");
    
        // Agregar el aria-label sin puntuaciones
        document.getElementById("question").setAttribute("aria-label", cleanQuestion);
    
        document.querySelectorAll(".option").forEach((option, index) => {
            option.textContent = question.options[index];
    
            // Generar el deletreo con pausas usando puntos suspensivos
            let spelledOut = question.options[index].split("").join(". . ");
    
            // Asignar aria-label con deletreo + palabra completa
            option.setAttribute("aria-label", `Opción ${index + 1}: ${spelledOut}. . La palabra es: ${question.options[index]}`);
    
            // Asegurar que el evento de clic se reasigna correctamente
            option.onclick = () => checkAnswer(index);
        });
    }
    
    function getDifficultyLabel(time) {
        if (time >= 180) return "Muy Fácil";
        if (time >= 150) return "Fácil";
        if (time >= 120) return "Moderado";
        if (time >= 90) return "Difícil";
        return "Muy Difícil"; // Para 60 segundos
    }
    
    
    // Iniciar el juego
    loadQuestion();
    startTimer();
});
