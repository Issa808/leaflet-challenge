// Creating the map object
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
// Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
// Load the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//function for depth color
function DepthColor(c) {
    if (c>90) {
        return "#FF0000";
    }
    else if (c>70) {
        return "#FF8C00";
    }
    else if (c>50) {
        return "#008000";
    }
    else if (c>30) {
        return "#2E8B57";
    }
    else if (c>10) {
        return "#556B2F";
    }
    else return "#90EE90";
}

// Get the data with d3.
d3.json(link).then(function(data) {
    console.log(data);
    
    const Geojson = L.geoJson(data,{
        pointToLayer: (feature, latlng) => {
          
          return L.circleMarker(latlng, {
            color: "black",
            fillOpacity: 1,
            fillColor: DepthColor(feature.geometry.coordinates[2]),
            radius: feature.properties.mag*5,
            weight: 1,
          }
        )},
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Location: " + feature.properties.place + "<br>Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2]);
          }
      });
    Geojson.addTo(myMap);


    // Set up the legend.
    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function(myMap) {
        let div = L.DomUtil.create("div", "info legend");

        let legendRating = [-10, 10, 30, 50, 70, 90];
        let legendColors = ["#FF0000", "#FF8C00", "#008000", "#2E8B57", "#556B2F", "#90EE90"]

        for(let i = 0; i < legendRating.length; i++) {
            div.innerHTML += "<i style=background: " + legendColors[i] + "'></i> " + legendRating[i] + (legendRating[i + 1] ? "&ndash;" + legendRating[i + 1] + "<br>" : "+");
        }
        return div;
        
    };
    legend.addTo(myMap);
});