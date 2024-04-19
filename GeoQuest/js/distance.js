/* SUMMARY:
 * This script manages a location-based quiz game where the user's real or simulated location is used to determine their proximity to predefined places.
 * The user is presented with questions related to the nearest place, and their score is updated based on their answers.*/

/* Array of predefined places with name, latitude, longitude, and image */
const places = [
  {
    name: "Hållet",
    latitude: 58.765901163052824,
    longitude: 16.999851298924227,
    image: "./img/hallet.jpeg",
  },
  {
    name: "Segelstamosse",
    latitude: 58.71882549680376,
    longitude: 16.954421901218563,
    image: "./img/segelstamosse.jpeg",
  },
  {
    name: "Nävsjömossen",
    latitude: 58.65137275179356,
    longitude: 16.700652717156235,
    image: "./img/navsjomossen.webp",
  },
  {
    name: "Femöre",
    latitude: 58.65391892800757,
    longitude: 17.095887348939563,
    image: "./img/femore.jpeg",
  },
  {
    name: "Lindudden",
    latitude: 58.73349117687077,
    longitude: 17.09027153916236,
    image: "./img/lindudden.jpeg",
  },
  {
    name: "Ryssbergen",
    latitude: 58.73785087952063,
    longitude: 16.966892316972192,
    image: "./img/ryssbergen.jpeg",
  },
  {
    name: "Labroängar",
    latitude: 58.759141251935276,
    longitude: 17.08117348685268,
    image: "./img/labro.jpeg",
  },
  {
    name: "Strandstuviken",
    latitude: 58.710357261901585,
    longitude: 17.10723677848989,
    image: "./img/strandstuviken.jpeg",
  },
  {
    name: "Rågö",
    latitude: 58.737795870951636,
    longitude: 17.306303733032564,
    image: "./img/rago.jpeg",
  },
  {
    name: "Stendörren",
    latitude: 58.748065192531385,
    longitude: 17.392112910303897,
    image: "./img/stendorren.jpeg",
  },
];

let userPosition = null;
let nearestPlace = null;
let useRealLocation = true;
let simulationMode = false;
let simulationModeShown = false;
let visitedPlaces = [];
let answeredQuestions = [];
let score = 0;

const scoreDiv = document.getElementById("score");
const questionDiv = document.getElementById("question");
const distanceDiv = document.getElementById("distance");


// Toggle between real and simulated location modes.

function toggleSimulation() {
  useRealLocation = !useRealLocation;
  simulationMode = !simulationMode;

  if (simulationMode && !simulationModeShown) {
    alert("Simulation mode is on.");
    simulationAlertShown = true;
    getLocation();

  } else if (!simulationMode && !simulationModeShown) {
    alert("Simulation mode is off.");
    simulationModeShown = true;
  }
}

// Get user location: Real or simulated
function getLocation() {
  if (useRealLocation && navigator.geolocation) {
    
    navigator.geolocation.getCurrentPosition(showPosition);
    
  } else {
    if (visitedPlaces.length === places.length) {
      visitedPlaces = [];
    }

    const nextPlace = findNextNearestPlace();

    if (nextPlace) {
      visitedPlaces.push(nextPlace);
      showPosition({
        coords: {
          latitude: nextPlace.latitude,
          longitude: nextPlace.longitude,
        },
      });
    } else {
      console.log("No more places to visit.");
    }
  }
}

function showPosition(position) {
  userPosition = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
  checkUserLocation();
}

// Check the user's location relative to the nearest place.
function checkUserLocation() {
  nearestPlace = findNearestPlace();
  const distance = calculateDistance(userPosition, nearestPlace);

  if (distance <= 5000) {
    displayQuestion(nearestPlace.name);
    distanceDiv.innerHTML = "You are at " + nearestPlace.name + ".";
    visitedPlaces.push(nearestPlace);
    showNextNearestPlace();
  } else {
    distanceDiv.innerHTML =
      "You are currently " +
      distance.toFixed(2) +
      " meters from " +
      nearestPlace.name +
      ". Move closer to interact.";
  }
}

function findNearestPlace() {
  let nearestPlace = places[0];
  let minDistance = calculateDistance(userPosition, nearestPlace);

  for (let i = 1; i < places.length; i++) {
    const distance = calculateDistance(userPosition, places[i]);
    if (distance < minDistance) {
      minDistance = distance;
      nearestPlace = places[i];
    }
  }
  return nearestPlace;
}

function showNextNearestPlace() {
  const nextNearestPlace = findNextNearestPlace();

  if (nextNearestPlace) {
    const distanceToNextPlace = calculateDistance(
      userPosition,
      nextNearestPlace
    );
    const directionToNextPlace = calculateDirection(
      userPosition,
      nextNearestPlace
    );

    distanceDiv.innerHTML =
      "Current location: " +
      nearestPlace.name +
      "<br>" +
      "Next up: " +
      nextNearestPlace.name +
      " in " +
      distanceToNextPlace.toFixed(2) +
      " m <br>" +
      "Direction: Head " +
      directionToNextPlace;
  } else {
    distanceDiv.innerHTML = "Congratulations, all places have been visited!";
  }
}


function findNextNearestPlace() {
  const unvisitedPlaces = places.filter(
    (place) => !visitedPlaces.includes(place)
  );

  if (unvisitedPlaces.length === 0) {
    return null;
  }

  let nearestPlace = unvisitedPlaces[0];
  let minDistance = calculateDistance(userPosition, nearestPlace);

  for (let i = 1; i < unvisitedPlaces.length; i++) {
    const distance = calculateDistance(userPosition, unvisitedPlaces[i]);
    if (distance < minDistance) {
      minDistance = distance;
      nearestPlace = unvisitedPlaces[i];
    }
  }
  return nearestPlace;
}

// Calculate the distance between two geographical positions.
function calculateDistance(pos1, pos2) {
  const R = 6371e3;
  const φ1 = toRadians(pos1.latitude);
  const φ2 = toRadians(pos2.latitude);
  const Δφ = toRadians(pos2.latitude - pos1.latitude);
  const Δλ = toRadians(pos2.longitude - pos1.longitude);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Calculate the direction from one geographical position to another.
function calculateDirection(pos1, pos2) {
  const lat1 = pos1.latitude;
  const lon1 = pos1.longitude;
  const lat2 = pos2.latitude;
  const lon2 = pos2.longitude;

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  const brng = Math.atan2(y, x);

  const degrees = toDegrees(brng);
  const directions = [
    "North",
    "Northeast",
    "East",
    "Southeast",
    "South",
    "Southwest",
    "West",
    "Northwest",
  ];
  const index = Math.round((degrees + 360) / 45) % 8;

  return directions[index];
}

function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

// Display a question related to the current location.
function displayQuestion(placeName) {
  fetch("./data/questions.json")
    .then((response) => response.json())
    .then((questions) => {
      const questionData = questions.find(
        (question) => question.place === placeName
      );
      if (questionData) {
        questionDiv.innerHTML = questionData.question;
        const image = document.createElement("img");
        image.src = places.find((place) => place.name === placeName).image;
        questionDiv.appendChild(image);

        const buttonContainer = document.createElement("div");

        for (const option of questionData.options) {
          const button = document.createElement("button");
          button.textContent = option.key + ". " + option.value;
          button.addEventListener("click", function () {
            handleAnswer(option.key, questionData.answer);
          });
          buttonContainer.appendChild(button);
        }
        questionDiv.appendChild(buttonContainer);
      } else {
        questionDiv.innerHTML = "No question available for " + placeName;
      }
    })
    .catch((error) => console.error("Error loading question data:", error));
}

// Handle the user's answer to a question
function handleAnswer(userAnswer, correctAnswer) {
  if (!nearestPlace) {
    console.error("Nearest place is not defined.");
    return;
  }
  const placeIndex = places.findIndex((p) => p.name === nearestPlace.name);
    if (answeredQuestions.includes(placeIndex)) {
        if (questionDiv)
            questionDiv.innerHTML = "This question has already been answered.";
        return;
    }

    if (userAnswer === correctAnswer) {
        score += 10;
        if (scoreDiv) scoreDiv.innerText = "Correct! Current score: " + score;
    } else {
        score -= 5;
        if (scoreDiv) scoreDiv.innerText = "Incorrect. Current score: " + score;
    }
    localStorage.setItem("score", score); // Save score to localStorage
    answeredQuestions.push(placeIndex); // Save the index of answered question

    // Check if all questions have been answered
    if (answeredQuestions.length === places.length) {
        showModal(); // Call showModal when all questions are answered
    } else {
        simulateNextQuestion(); // Otherwise, simulate the next question
    }
}

function showModal() {
  const modal = document.getElementById('score-modal');
  const finalScore = document.getElementById('final-score');
  finalScore.textContent = `Your final score is: ${score}`;
  modal.classList.remove('hidden'); // Show the modal
}

function hideModal() {
  const modal = document.getElementById('score-modal');
  modal.classList.add('hidden'); // Hide the modal
}

document.getElementById('play-again-button').addEventListener('click', function() {
  score = 0; // Reset score
  visitedPlaces = []; // Reset visited places
  answeredQuestions = []; // Reset answered questions
  scoreDiv.innerText = 'Current score: ' + score;
  hideModal(); // Hide the modal
  getLocation(); // Restart the game
});

// Simulate the next question.
function simulateNextQuestion() {
  getLocation();
}
// Initial function call to get the user's location
getLocation();

// Periodically update user's location in simulation
setInterval(getLocation, 100000); 