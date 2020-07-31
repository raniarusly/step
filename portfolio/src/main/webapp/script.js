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

function getComments(){
  const input = document.getElementById("limit");
  const limit = input.options[input.selectedIndex].value;
  var query = "/data?limit=";
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
    deleteComment(comment);
    commentElement.remove();
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

function validateForm() {
  var comment = document.forms["comment-section"]["comment-input"].value;
  if (comment == "") {
    alert("Comment cannot be empty :)");
    return false;
  }
}

async function checkLogin(){
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

function loadingAlert(){
  alert("Please allow a few seconds for the maps to load :D");
}

async function initMap() {
  await addUserLocation();  
  initTravelMap();
  initUserMap();
}

var jakarta = {lat: -6.175540, lng: 106.82743};

function addUserLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function(position) {
      const params = new URLSearchParams();
      params.append('lat', position.coords.latitude);
      params.append('lng', position.coords.longitude);
      fetch('/user-location-data', {method: 'POST', body: params});
    }, function() {
      console.log("Error: The Geolocation service failed.");
    });
  } else {
    // Browser doesn't support Geolocation
    console.log("Error: Your browser doesn\'t support geolocation.");
  }
}

function createMap(mapId, center) {
  const map = new google.maps.Map( document.getElementById(mapId), {
    center: center,
    zoom: 1,
    mapTypeControlOptions: { mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'night_map'] }
  });

  /** Set up map in night mode */
  const nightMapStyle = new google.maps.StyledMapType(nightVersion, {name: 'Night'});
  map.mapTypes.set('night_map', nightMapStyle);
  return map;
}

function addMarker(map, data, createMarker){
  var markers = data.map((entity) => {
    return createMarker(entity, map);
  });
  var markerCluster = new MarkerClusterer(map, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

function initTravelMap() {  
  fetch("/city-data").then(result => result.json()).then((cities) => {
      console.log(cities);
      const map = createMap("travel-map", jakarta);
      addMarker(map, cities, createCityMarker); 
  });
}

function createCityMarker(city, map){
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

function initUserMap() {  
  fetch("/user-location-data").then(result => result.json()).then((locations) => {
    console.log(locations);
    const map = createMap("user-map", jakarta);
    addMarker(map, locations, createLocationMarker);
  });
}

function createLocationMarker(location, map){
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
