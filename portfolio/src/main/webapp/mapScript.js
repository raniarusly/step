const url = window.location.pathname;
const filename = url.substring(url.lastIndexOf('/')+1);
const initMapFunction = filename === "demographic.html" ? "initDemographicMap" : "initTravelMap";
const mapApi = "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&callback=" + initMapFunction;
const mapScriptElement = document.createElement("script");
mapScriptElement.src = mapApi
mapScriptElement.defer = true;

const scriptElement = document.getElementsByTagName("script")[0];
scriptElement.parentNode.insertBefore(mapScriptElement, scriptElement);
