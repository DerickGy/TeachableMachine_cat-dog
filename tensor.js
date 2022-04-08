// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
//A variável page vai identificar qual pasta está habilitada e o if ira substituir o Javascript

var page = window.location.pathname;
var treino = "vazio"

// 12k "https://teachablemachine.withgoogle.com/models/E1oBnHJyU/"
// 09k "https://teachablemachine.withgoogle.com/models/p06oExTR_/"
// 06k "https://teachablemachine.withgoogle.com/models/48v0etS1F/"
// 03k "https://teachablemachine.withgoogle.com/models/4eAs4-78x/"

if (page == '/index.html') {
    var treino = "https://teachablemachine.withgoogle.com/models/E1oBnHJyU/";
} 
else if (page == '/trained_9k.html') {
    var treino = "https://teachablemachine.withgoogle.com/models/p06oExTR_/";
} 
else if (page == '/trained_6k.html') {
    var treino = "https://teachablemachine.withgoogle.com/models/48v0etS1F/"
}
else {
    var treino = "https://teachablemachine.withgoogle.com/models/4eAs4-78x/";
} 

const URL = treino;

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        // filtrando para aparecer apenas o objeto desejado caso a probabilidade de previsão for maior que 85%
        if (prediction[i].probability > 0.85) {



            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        } // fim do if maior que 85%
        else
            labelContainer.childNodes[i].innerHTML = "";
    }
}