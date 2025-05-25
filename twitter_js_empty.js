///--------------------------------------------------------------------------------
///-----------------------------------Variables--------------------------------
///--------------------------------------------------------------------------------
const tweetInput = document.getElementById("tweetInput");
const tweetButton = document.getElementById("tweetButton");
const charCount = document.getElementById("charCount");
const tweetContainer = document.getElementById("tweetContainer");

// Lista para almacenar los tweets favoritos
let favorites = JSON.parse(getCookie("favorites") || "[]");

const sampleTweets = [
    { text: "Este es un tweet de ejemplo!", likes: 3 },
    { text: "Aprendiendo a usar eventos", likes: 5 },
    { text: "Aprendiendo a manipular el DOM", likes: 7 }
];

// Añade esta variable global para almacenar todos los tweets (ejemplo + nuevos)
let allTweets = [...sampleTweets];

///--------------------------------------------------------------------------------
///----------------------------------Funciones------------------------------------
///--------------------------------------------------------------------------------

// Función para establecer una cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
}

// Función para obtener una cookie
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const [key, value] = cookies[i].split("=");
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

// Función para eliminar una cookie
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Función para convertir hashtags en enlaces clicables
function linkifyHashtags(text) {
    // Detecta hashtags y los convierte en enlaces
    return text.replace(/#(\w+)/g, function(match, tag) {
        return `<a href="#" class="hashtag-link" data-hashtag="${tag}">${match}</a>`;
    });
}

//PRE: Recibe el texto que tendrá el tweet, los likes que tiene y opcionalmente una imagen
//POST: Añade al contenedor de tweets "tweetContainer" un tweet con los botones de responder, eliminar y like/unlike
function createTweet(text, likes = 0, image = null, addToAllTweets = false) {
    // Crear el contenedor principal del tweet
    const tweetDiv = document.createElement("div");
    tweetDiv.classList.add("tweet");

    // Usar linkifyHashtags para el texto del tweet
    const tweetText = document.createElement("p");
    tweetText.innerHTML = linkifyHashtags(text);
    tweetDiv.appendChild(tweetText);

    // Si hay una imagen, añadirla al tweet
    if (image) {
        const tweetImage = document.createElement("img");
        tweetImage.src = image;
        tweetImage.alt = "Tweet Image";
        tweetImage.style.maxWidth = "100%";
        tweetImage.style.marginTop = "10px";
        tweetDiv.appendChild(tweetImage);
    }

    // Crear el elemento para el contador de likes
    const likeCount = document.createElement("span");
    likeCount.classList.add("like-count");
    likeCount.textContent = `Likes: ${likes}`;
    tweetDiv.appendChild(likeCount);

    // Crear el botón de like/unlike
    const likeButton = document.createElement("button");
    likeButton.classList.add("like-btn");
    likeButton.textContent = "Like";
    tweetDiv.appendChild(likeButton);

    // Crear el botón de eliminar
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Eliminar";
    tweetDiv.appendChild(deleteButton);

    // Crear el botón de responder
    const replyButton = document.createElement("button");
    replyButton.classList.add("reply-btn");
    replyButton.textContent = "Responder";
    tweetDiv.appendChild(replyButton);

    // Crear el botón de favorito
    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add("favorite-btn");
    favoriteButton.textContent = favorites.some(fav => fav.text === text) ? "Favorito ✔" : "Favorito";
    tweetDiv.appendChild(favoriteButton);

    // Crear el contenedor para las respuestas
    const repliesContainer = document.createElement("div");
    repliesContainer.classList.add("replies");
    tweetDiv.appendChild(repliesContainer);

    // Añadir el tweet al contenedor de tweets
    tweetContainer.prepend(tweetDiv);

    // Si es un tweet nuevo del usuario, lo añadimos a allTweets
    if (addToAllTweets) {
        allTweets.push({ text, likes, image });
    }

    // Añadir los eventos de los botones usando el método addTweetEvents
    addTweetEvents(tweetDiv);

    // Añadir evento al botón de favorito
    favoriteButton.addEventListener("click", function () {
        const isFavorite = favorites.some(fav => fav.text === text);
        if (isFavorite) {
            // Quitar de favoritos
            favorites = favorites.filter(fav => fav.text !== text);
            favoriteButton.textContent = "Favorito";
        } else {
            // Añadir a favoritos
            favorites.push({ text, likes, image });
            favoriteButton.textContent = "Favorito ✔";
        }
        updateFavorites();
    });

    // Añadir eventos a los hashtags (opcional: mostrar tweets con ese hashtag)
    tweetText.querySelectorAll('.hashtag-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const hashtag = this.dataset.hashtag;
            filterTweetsByHashtag(hashtag);
        });
    });
}

// Modifica iniciarTwitter para usar createTweet sin añadir los de ejemplo a allTweets dos veces
function iniciarTwitter() {
    allTweets = [...sampleTweets]; // Reinicia allTweets con los de ejemplo
    tweetContainer.innerHTML = ""; // Limpia el contenedor
    allTweets.forEach(tweet => createTweet(tweet.text, tweet.likes, tweet.image));

    tweetInput.addEventListener("input", function () {
        charCount.textContent = `${this.value.length}/280`;
    });

    tweetButton.addEventListener("click", function () {
        const tweetText = tweetInput.value.trim();
        if (tweetText === "") return;

        // Leer la imagen seleccionada
        const file = document.getElementById("imageInput").files[0];
        let imageUrl = null;

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                imageUrl = event.target.result;
                createTweet(tweetText, 0, imageUrl, true); // true: añadir a allTweets
            };
            reader.readAsDataURL(file);
        } else {
            createTweet(tweetText, 0, null, true); // true: añadir a allTweets
        }

        // Limpiar el input de texto y el input de imagen
        tweetInput.value = "";
        document.getElementById("imageInput").value = "";
        charCount.textContent = "0/280";
    });
}

// Modifica filterTweetsByHashtag para buscar en allTweets
function filterTweetsByHashtag(hashtag) {
    tweetContainer.innerHTML = "";
    allTweets.forEach(tweet => {
        if (tweet.text.includes(`#${hashtag}`)) {
            createTweet(tweet.text, tweet.likes, tweet.image);
        }
    });
}

// Función para actualizar la sección de favoritos
function updateFavorites() {
    const favoritesList = document.getElementById("favoritesList");
    favoritesList.innerHTML = ""; // Limpiar la lista de favoritos

    favorites.forEach(favoriteTweet => {
        const favoriteDiv = document.createElement("div");
        favoriteDiv.classList.add("tweet");

        const favoriteText = document.createElement("p");
        favoriteText.textContent = favoriteTweet.text;
        favoriteDiv.appendChild(favoriteText);

        if (favoriteTweet.image) {
            const favoriteImage = document.createElement("img");
            favoriteImage.src = favoriteTweet.image;
            favoriteImage.alt = "Tweet Image";
            favoriteImage.style.maxWidth = "100%";
            favoriteImage.style.marginTop = "10px";
            favoriteDiv.appendChild(favoriteImage);
        }

        favoritesList.appendChild(favoriteDiv);
    });

    // Guardar los favoritos en cookies
    setCookie("favorites", JSON.stringify(favorites), 7); // Guardar por 7 días
}

// PRE: Recibe un elemento 'tweetDiv' que representa un tweet ya creado en el DOM. 
//       Este debe contener botones con las clases 'like-btn', 'delete-btn' y 'reply-btn', 
//       así como un contenedor de respuestas con la clase 'replies'.
// POST: Añade eventos a los botones del tweet:
//       - "Like": Permite alternar entre dar y quitar like, actualizando el contador de likes.
//       - "Eliminar": Borra el tweet del DOM al hacer clic en el botón correspondiente.
//       - "Responder": Muestra un campo de texto y un botón "Enviar" para agregar respuestas al tweet.
function addTweetEvents(tweetDiv) {
    const likeButton = tweetDiv.querySelector(".like-btn");
    const deleteButton = tweetDiv.querySelector(".delete-btn");
    const replyButton = tweetDiv.querySelector(".reply-btn");
    const likeCount = tweetDiv.querySelector(".like-count");
    const repliesContainer = tweetDiv.querySelector(".replies");

    let liked = false; //Por defecto no tendrá dado el like
    let likes = parseInt(likeCount.textContent.match(/\d+/)[0]); //Obtenemos 

    //TODO: Añadir el evento al botón de like. 
    //Este evento comprobará si se ha dado like, sumando o restando el like en caso de tenerlo previamente o no
    //---------------------------------------------------------------------------------------------------------
    likeButton.addEventListener("click", function () {
        if (liked) {
            likes--;
            likeButton.textContent = "Like";
        } else {
            likes++;
            likeButton.textContent = "Unlike";
        }
        liked = !liked;
        likeCount.textContent = `Likes: ${likes}`;
    });
    //TODO: Añadir el evento al botón eliminar. Este eliminará el tweet
    //------------------------------------------------------------------
    deleteButton.addEventListener("click", function () {
        tweetDiv.remove();
    });

    //TODO: Añadir el evento al botón de respuesta.
    replyButton.addEventListener("click", function () {
        // 1) Crear un nuevo elemento que será un input de tipo "text"
        const replyInput = document.createElement("input");
        replyInput.type = "text";
        replyInput.placeholder = "Escribe tu respuesta";
        replyInput.classList.add("reply-input");

        // 2) Crear el botón para enviar nuestra respuesta
        const sendReplyButton = document.createElement("button");
        sendReplyButton.textContent = "Enviar";
        sendReplyButton.classList.add("send-reply-btn");

        // 3) Añadir el input y el botón al "repliesContainer"
        repliesContainer.appendChild(replyInput);
        repliesContainer.appendChild(sendReplyButton);

        // 4) Añadir el evento al botón de enviar
        sendReplyButton.addEventListener("click", function () {
            // 4.1) Comprobar que el input tiene texto
            const replyText = replyInput.value.trim();
            if (replyText === "") return;

            // 4.2) Crear un div con el texto del input y añadirlo al "repliesContainer"
            const replyDiv = document.createElement("div");
            replyDiv.textContent = replyText;
            replyDiv.classList.add("reply");
            repliesContainer.appendChild(replyDiv);

            // 4.3) Eliminar el input y el botón de enviar
            replyInput.remove();
            sendReplyButton.remove();
        });
    });

}

async function login() {
    const usuario = document.getElementById("username").value;
    const contraseña = document.getElementById("password").value;
    const recordar = document.getElementById("remember").checked;
    const contenedorTwitter = document.getElementById("twitterContainer");
    const contenedorLogin = document.getElementById("loginContainer");

    try {
        const respuesta = await fetch("http://localhost:3000/usuarios");
        const datos = await respuesta.json();
        if (usuario === datos.nombre && contraseña === datos.contraseña) {
            alert("Login correcto");
            if (recordar) {
                localStorage.setItem("usuario", usuario);
                localStorage.setItem("contraseña", contraseña);
            }
            contenedorLogin.style.display = "none";
            contenedorTwitter.style.display = "block";
            iniciarTwitter();
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    } catch (error) {
        console.log(error);
        alert("Error al realizar la petición");
    }
}
function logout() {
    const contenedorTwitter = document.getElementById("twitterContainer");
    const contenedorLogin = document.getElementById("loginContainer");
    contenedorLogin.style.display = "block";
    contenedorTwitter.style.display = "none";
    localStorage.removeItem("usuario");
    localStorage.removeItem("contraseña");
}
function iniciarTwitter() {
    allTweets = [...sampleTweets]; // Reinicia allTweets con los de ejemplo
    tweetContainer.innerHTML = ""; // Limpia el contenedor
    allTweets.forEach(tweet => createTweet(tweet.text, tweet.likes, tweet.image));

    tweetInput.addEventListener("input", function () {
        charCount.textContent = `${this.value.length}/280`;
    });

    tweetButton.addEventListener("click", function () {
        const tweetText = tweetInput.value.trim();
        if (tweetText === "") return;

        // Leer la imagen seleccionada
        const file = document.getElementById("imageInput").files[0];
        let imageUrl = null;

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                imageUrl = event.target.result;
                createTweet(tweetText, 0, imageUrl, true); // true: añadir a allTweets
            };
            reader.readAsDataURL(file);
        } else {
            createTweet(tweetText, 0, null, true); // true: añadir a allTweets
        }

        // Limpiar el input de texto y el input de imagen
        tweetInput.value = "";
        document.getElementById("imageInput").value = "";
        charCount.textContent = "0/280";
    });

    

}
    window.onload = function () {

        const savedUser = localStorage.getItem("usuario");
        const savedPassword = localStorage.getItem("contraseña");

        if (savedUser && savedPassword) {
            document.getElementById("username").value = savedUser;
            document.getElementById("password").value = savedPassword;
            login();
        }

        document.getElementById("loginButton").addEventListener("click", function (event) {
            event.preventDefault();
            login();
        });

        document.getElementById("logoutButton").addEventListener("click", function (event) {
            event.preventDefault();
            logout();
        });

        // Cargar favoritos
        updateFavorites();
    };