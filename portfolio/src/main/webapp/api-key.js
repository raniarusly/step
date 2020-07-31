var APIkey = AIzaSyAuk539i0M-Dm_8O_GlJowtpnWYN6Taqxg;
var mapAPIurl = "https://maps.googleapis.com/maps/api/js?key=" + APIkey + "&callback=initMap";

var mapScriptElement = document.createElement("script");
mapScriptElement.src = mapAPIurl;
mapScriptElement.defer = true;

var scriptElement = document.getElementsByTagName("script")[0];
scriptElement.parentNode.insertBefore(mapScriptElement, scriptElement);