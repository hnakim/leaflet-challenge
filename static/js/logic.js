const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//create tile layer (background image) to our map
var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 3
  });
  function markerSize(magnitude) {
    return (Math.exp(magnitude)*2000);
  }
  
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//retrieve geoJSON data
d3.json(url).then(function (data) {

    //loop through response to return earthquake location, radius (to calculate magnitude), and depth ("3rd coordinate")
    for (var i = 0; i < data.features.length; i++) {
        let earthquake = data.features[i].geometry.coordinates;
        let location = [earthquake[1], earthquake[0]];
        let depth = earthquake[2];
        let magnitude = data.features[i].properties.mag

      //determine radius of earthquake map marker based off magnitude
      function radius(magnitude) {
        return magnitude * 4;
      }
      function color(depth) {
        switch (true) {
          case depth > 50:
            return "#ea2c2c";
          case depth > 40:
            return "#eaa92c";
          case depth > 30:
            return "#d5ea2c";
          case depth > 20:
            return "#92ea2c";
          case depth > 10:
            return "#2ceabf";
          default:
            return "#2c99ea";
        }
      }
      
    //create a geoJSON layer that contains the features
    L.circle(location, {
        color: 'black',
        fillColor: color(depth),
        fillOpacity: 0.8,
        radius: radius(magnitude),
        weight: 0.5})
        .bindPopup(`<h3>Location: ${data.features[i].properties.place}</h3> <hr> <h3>Magnitude: ${magnitude}</h3> <hr> <h3>Date & Time: ${new Date(data.features[i].properties.time)}</h3>`)
        .addTo(myMap);
    };
    
    //create legend and add details
    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [-10, 10, 20, 30, 40, 50];
        var colors = ["#ea2c2c","#eaa92c","#d5ea2c","#92ea2c","#2ceabf","#2c99ea"]
    
        // loop through intervals to add info to label
        for (var i = 0; i<grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
        };
    
      //add to map
      legend.addTo(myMap) 
}); 
