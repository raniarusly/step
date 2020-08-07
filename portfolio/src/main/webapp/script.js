// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random fact to the page.
 */
function addRandomFact() {
  const facts =
      [
          "I love K-pop, I have been to over 10 concerts", 
          "I...hate snakes, please get snake pictures away from me", 
          "I spent countless hours watching K-dramas, especially in this quarantinae", 
          "people I know in Google are nice!",
          "I don\"t know much about front-end, mostly because I imagine that I have to design stuffs", 
          "I don\"t like working from home", 
          "Hate to miss the Google office experience :(, hope I can visit the office in the future",
          "I am the oldest of 4",
          "I am looking for more interests, please tell me suggestions of things to try out",
          "I love trying new restaurants and new areas",
          "I am an extrovert, in fact at 83% (but I can get awkward with people sometimes)",
          "my MBTI is ESTJ, I would like to know yours too!",
          "my little sister designed the background for this website"
      ];

  // Pick a random fact.
  const fact = facts[Math.floor(Math.random() * facts.length)];

  // Add it to the page.
  const factContainer = document.getElementById("fact-container");
  factContainer.innerText = fact;
}

function getKdramaRecommendation() {
  const recommendations =
      [
          {
              title:"Crash Landing On You",
              cover:"/images/kdrama/cloy.jpg",
              link:"http://asianwiki.com/Crash_Landing_on_You"
          },
          {
              title:"Goblin",
              cover:"/images/kdrama/goblin.jpg",
              link:"http://asianwiki.com/Guardian:_The_Lonely_and_Great_God"
          },
          {
              title:"Itaewon Class",
              cover:"/images/kdrama/itaewon-class.jpg",
              link:"http://asianwiki.com/Itaewon_Class"
          },
          {
              title:"Extracurricular",
              cover:"/images/kdrama/extracurricular.jpg",
              link:"http://asianwiki.com/Extracurricular"
          },
          {
              title:"Hospital Playlist",
              cover:"/images/kdrama/hospital-playlist.jpg",
              link:"http://asianwiki.com/Hospital_Playlist"
          }
      ];

  // Get a K-drama series recommendation.
  const recommendation = recommendations[Math.floor(Math.random() * recommendations.length)];

  // Add it to the page.
  document.getElementById("kdrama-cover").src = recommendation.cover;
  document.getElementById("kdrama-title").innerText = recommendation.title;
  document.getElementById("kdrama-title").href = recommendation.link;
}

function getComments() {
  const input = document.getElementById("limit");
  const limit = input.options[input.selectedIndex].value;
  const query = "/data?limit=";
  fetch(query.concat(limit)).then(result => result.json()).then((comments) => {
    const section = document.getElementById("comments");
    section.innerHTML = "";
    comments.forEach((comment) => {
      section.appendChild(createCommentElement(comment));
    });
    section.appendChild(createParagraphElement("Thank you for the feedback! :D"));
  });
}

/* Creates a paragraph element containing text. */
function createParagraphElement(text) {
  const element = document.createElement("p");
  element.innerText = text;
  return element;
}

/* Creates an element that represents a comment, including its delete button. */
function createCommentElement(comment) {
  const commentElement = document.createElement("div");
  commentElement.className = "comment-card";

  const contentElement = document.createElement("div");
  contentElement.className = "comment-content";
  contentElement.innerHTML = "<h4>" + comment.userEmail + "</h4>";
  contentElement.innerHTML += "<p>" + comment.content + "</p>";

  const deleteButtonElement = document.createElement("button");
  deleteButtonElement.className = "delete-button"
  deleteButtonElement.innerText = "Delete";
  deleteButtonElement.addEventListener("click", () => {
    fetch("/user-email").then(result => result.text()).then((userEmail) => {
      if (userEmail != comment.userEmail) {
        alert("You can only delete your own comment");
      }
      else {
        deleteComment(comment);
        commentElement.remove();
      }
    });
  });

  commentElement.appendChild(contentElement);
  commentElement.appendChild(deleteButtonElement);
  return commentElement;
}

/* Tells the server to delete the comment. */
function deleteComment(comment) {
  const params = new URLSearchParams();
  params.append("id", comment.id);
  fetch("/delete-data", {method: "POST", body: params});
}

/* Forbid commenting with empty comment */
function validateForm() {
  const comment = document.forms["comment-section"]["comment-input"].value;
  if (comment == "") {
    alert("Comment cannot be empty :)");
    return false;
  }
}

/* Display or hide the commenting section (contact.html) based on the user login status */
async function checkLogin() {
  const result = await fetch("/login");
  const details = await result.json();

  const formElement = document.getElementById("comment-form");
  const loginElement = document.getElementById("login");
  if (details.isUserLoggedIn) {
    loginElement.style.display = "none";
    formElement.style.display = "block";
  }
  else {
    loginElement.style.display = "block";
    formElement.style.display = "none";
    document.getElementById("login-link").href = details.loginUrl;
  }
}

function loadingAlert() {
  alert("Please allow a few seconds for the maps to load :D");
}

/* Create and returns a map created on the html with the mapId and a given center*/
const jakarta = {lat: -6.175540, lng: 106.82743};
const athens = {lat: 37.9838, lng: 23.7275};
const prague = {lat: 50.0755, lng: 14.4378};
const london = {lat: 51.514248, lng: -0.09314520};
const florence = {lat: 43.766667, lng: 11.25};
const budapest = {lat: 47.5, lng: 19.083333};
const santorini = {lat: 36.3932, lng: 25.4615};
const vatican = {lat: 41.9029, lng: 12.4534}
const salzburg = {lat: 47.8095,lng: 13.0550};

function createMap(mapId, center, zoomScale) {
  const map = new google.maps.Map( document.getElementById(mapId), {
    center: center,
    zoom: zoomScale,
    mapTypeControlOptions: { mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'night_map'] }
  });

  /** Set up map in night mode */
  const nightMapStyle = new google.maps.StyledMapType(nightVersion, {name: 'Night'});
  map.mapTypes.set('night_map', nightMapStyle);
  return map;
}

/* Add a marker on the map using specific function, then cluster them */
function addMarker(map, data, createMarker) {
  const markers = data.map((entity) => {
    return createMarker(entity, map);
  });
  const markerCluster = new MarkerClusterer(map, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

/* Initialize map which display the places I have traveled to */
function initTravelMap(){
    initCenteredTravelMap(jakarta)
}

function initCenteredTravelMap(center) {
  fetch("/city-data").then(result => result.json()).then((cities) => {
      console.log(cities);
      const map = createMap("travel-map", center, 10);
      addMarker(map, cities, createCityMarker); 
  });
}

/* Create a marker on the map which represents a city that has been visited */
function createCityMarker(city, map) {
  const infoWindow = new google.maps.InfoWindow({
    content: "<h3>" + city.name + "</h3><h4>"+ city.dateVisited + "</h4>"
  });

  /* add marker on map */
  const marker = new google.maps.Marker({
    position: {lat: city.lat, lng: city.lng}, 
    map: map, 
    title: city.name
  });

  marker.addListener("click", function() {
    infoWindow.open(map, marker);
    map.setZoom(12);
    map.setCenter(marker.getPosition());
  });
  return marker;
}

/* Store user location and display page views map */
async function initDemographicMap() {
  await addUserLocation();
  initUserMap();
}

/* Store user location (latitude and longitude) to Location datastore */
function addUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function(position) {
      const params = new URLSearchParams();
      params.append('lat', position.coords.latitude);
      params.append('lng', position.coords.longitude);
      fetch('/user-location-data', {method: 'POST', body: params});
    }, function(error) {
      console.warn(`Error ${err.code}: The Geolocation service failed. ${err.message}`);
    });
  } else {
    // Browser doesn't support Geolocation
    console.log("Error: Your browser doesn\'t support geolocation.");
  }
}

/* Initialize a map which displays where the website's page views come from */
function initUserMap() {  
  fetch("/user-location-data").then(result => result.json()).then((locations) => {
    const map = createMap("user-map", jakarta, 1);
    addMarker(map, locations, createLocationMarker);
  });
}

/* Create a marker on the map which represents a location */
function createLocationMarker(location, map) {
  /* add marker on map */
  const marker = new google.maps.Marker({
    position: {lat: location.lat, lng: location.lng}, 
    map: map, 
  });

  marker.addListener("click", function() {
    map.setZoom(12);
    map.setCenter(marker.getPosition());
  });
  return marker;
}

function centerAthens(){
  initCenteredTravelMap(athens)
}

function centerPrague(){
  initCenteredTravelMap(prague)
}

function centerFlorence(){
  initCenteredTravelMap(florence)
}

function centerLondon(){
  initCenteredTravelMap(london)
}

function centerSalzburg(){
  initCenteredTravelMap(salzburg)
}

function centerVatican(){
  initCenteredTravelMap(vatican)
}

function centerBudapest(){
  initCenteredTravelMap(budapest)
}
