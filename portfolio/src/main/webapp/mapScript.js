fetch("/api-key").then(result => result.text()).then((apiKey) => {
  const mapApi = "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&callback=initMap";
  const mapScriptElement = document.createElement("script");
  mapScriptElement.src = mapApi
  mapScriptElement.defer = true;

  const scriptElement = document.getElementsByTagName("script")[0];
  scriptElement.parentNode.insertBefore(mapScriptElement, scriptElement);
});