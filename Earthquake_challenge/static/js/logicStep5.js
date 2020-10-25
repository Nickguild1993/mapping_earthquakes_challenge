//            13.6.4 ****** 13.6.4 ***** 
// Add console.log to check if your code is working.
console.log("working")


let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});
// add streets to map || for 13.5.3 // the addTo(map) for just a sec
// streets.addTo(map);

// 13.5.3 adding another TILELAYER!
// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// 13.5.6 *** create a base layer that holds both mamps.
let baseMaps = {
    "Streets": streets,
    "Satellite": satelliteStreets
};

// 13.6.4 * Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();

// 13.6.4 Next, define the overlya object to addi to to the map.
// Define an object that contains the overlays. (this will be visiible at all times)
let overlays = {
    Earthquakes: earthquakes
};
// 13.6.4 now, need to go down to L.control and add it in the layers w/ baseMaps!

// 13.5.7 || Create teh map object with a center of US and zoom level
let map = L.map("mapid", {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
});

// 13.5.3 & 13.6.4 (overlays) *** Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps, overlays).addTo(map);

// 13.5.3 *** Accessing the airport GeoJSON URL
// let airportData = "https://raw.githubusercontent.com/Nickguild1993/Mapping_earthquakes/main/majorAirports.json"

// 13.5.7 + Accessing the Earthquake Data ****   **** GeoJSON URL.
let earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// to make the code for the styling (below) easier to read, create an object w/ style parameters
// for hte lines and assign it to variable: myStyle. (add before d3.json())

// Create a style for the lines.
// let myStyle = {
//     color: "cyan",
//     // radius: features.properties.mag,
//     fillColor: "red",
//     weight: 2


// Grabbing our GeoJSON data.
d3.json(earthquakeData).then(function(data) {
    console.log(data);
  // Creating a GeoJSON layer with the retrieved data.
    L.geoJson(data, {
        // style: styleInfo,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        // set the style with the styleInfo function
        style: styleInfo,
        // create a popup for each circleMarker to display the mag 
        // add the location of the earthquake after the marker has been created
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        } 
    }).addTo(earthquakes);

    // 13.6.4 (also above (earthquakes) is 13.6.4 Then we add the earthquake layer to our map.
    earthquakes.addTo(map);
});

// 13.6.5 create a legend control object
let legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend');
        const magnitudes = [0, 1, 2, 3, 4, 5];
        const colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];

    for (var i = 0; i < magnitudes.length; i++) {
        console.log(colors[i]);
        div.innerHTML +=
            "<i style='background: " + colors[i] + "'></i> " +
            magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
        return div;
};

legend.addTo(map);

    // loop through our density intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < magnitudes.length; i++) {
//         console.log(colors[i]);
//         div.innerHTML +=
//             '<i style="background:' + colors[i] + '"></i> ' +
//             magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
//     }

//     return div;
// };

// more on the "?" conditional operator -> it'ls like an if statement
// condition ? result_if_true : result_if_false

// ### for pointToLayer callback function syntax is:
// L.geoJson(data, {
//     pointToLayer: function(feature, latlng) {
//         return L.marker(latlng);
//     }
// });

//  instead of L.marker you can use L.circleMarker to make it a circle

// // This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into a function
// to calculate the radius.
function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
// getColor() function.  writing a conditional expression w/ logical operators for the magnitudes.
// this function determines the color based on magnitude of earthquake.
function getColor(magnitude) {
    if (magnitude > 5) {
        return "#ea2c2c";
    }
    if (magnitude > 4) {
        return "#ea822c";
    }
    if (magnitude > 3) {
        return "#ee9c00";
    }
    if (magnitude > 2) {
        return "#eecc00";
    }
    if (magnitude > 1) {
        return "#d4ee00";
    }
    return "#98ee00";
    
}


// get radius() function ( below the styleInfo() funciton)
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;

    }
    return magnitude * 4;
}
