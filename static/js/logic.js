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

      //create function to return earthquake data to create markers for magnitude
      function markerStyle(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: color(feature.geometry.coordinates[2]),
          color: "#000000",
          radius: radius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }

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
    L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
      },
      //set the style for each circleMarker using function created
      style: markerStyle,
  
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " + feature.properties.place
        );
      }
  
    }).addTo(myMap);
  
    //create legend and add details
    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [-10, 10, 20, 30, 40, 50];
        var colors = ["#2c99ea","#2ceabf","#92ea2c","#eaa92c","#d5ea2c","#ea2c2c"]
    
        // loop through intervals to add info to label
        //revisit this part
        for (var i = 0; i<grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
        };
    
      //add to map
      legend.addTo(myMap) 
}); 
