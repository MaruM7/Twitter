///--------------------------------------------------------------------------------
///-----------------------------------Variables--------------------------------
///--------------------------------------------------------------------------------
const tweetInput = document.getElementById("tweetInput");
const tweetButton = document.getElementById("tweetButton");
const charCount = document.getElementById("charCount");
const tweetContainer = document.getElementById("tweetContainer");

const sampleTweets = [
    { text: "Este es un tweet de ejemplo!", likes: 3 },
    { text: "Aprendiendo a usar eventos", likes: 5 },
    { text: "Aprendiendo a manipular el DOM", likes: 7 }
];


///--------------------------------------------------------------------------------
///----------------------------------Funciones------------------------------------
///--------------------------------------------------------------------------------

//PRE: Recibe el texto que tendrá el tweet y los likes que tiene
//POST: Añade al contenedor de tweets "tweetContainer" un tweet con los botones de responder, eliminar y like/unlike
function createTweet(text, likes = 0) {
    // Crear el contenedor principal del tweet
    const tweetDiv = document.createElement("div");
    tweetDiv.classList.add("tweet");

    // Crear el elemento para el texto del tweet
    const tweetText = document.createElement("p");
    tweetText.textContent = text;
    tweetDiv.appendChild(tweetText);

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

    // Crear el contenedor para las respuestas
    const repliesContainer = document.createElement("div");
    repliesContainer.classList.add("replies");
    tweetDiv.appendChild(repliesContainer);

    // Añadir el tweet al contenedor de tweets
    tweetContainer.appendChild(tweetDiv);

    // Añadir los eventos de los botones usando el método addTweetEvents
    addTweetEvents(tweetDiv);
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
    
    //TODO: Añadir el evento al botón eliminar. Este eliminará el tweet
    //------------------------------------------------------------------

    //TODO: Añadir el evento al botón de respuesta.
    // 1) Creará un un nuevo elemento que será un input de tipo "text"
    // 2) Creará el botón para enviar nuestra respuesta
    // 3) Lo añadirá al "repliesContainer"
    // 4) Añadirá el evento al botón de enviar:
    //      4.1) Comprobará que el input tiene texto
    //      4.2) Creará un div con el texto del input y lo añadirá al "repliesContainer"
    //      4.3) Eliminará el input y el botón de enviar

}


///--------------------------------------------------------------------------------
///-----------------------------------Método OnLoad-----------------------------
///--------------------------------------------------------------------------------
window.onload = function () {
    sampleTweets.forEach(tweet => createTweet(tweet.text, tweet.likes));

    tweetInput.addEventListener("input", function () {
        charCount.textContent = `${this.value.length}/280`;
    });

    tweetButton.addEventListener("click", function () {
        const tweetText = tweetInput.value.trim();
        if (tweetText === "") return;
        createTweet(tweetText);
        tweetInput.value = "";
        charCount.textContent = "0/280";
    });
}