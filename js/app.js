var map;
var markers = [];

// Loaction information of my favorite restaurants of Washington DC.
var Model = {
  defaultData: [
    {
    name: "Florida Avenue Grill",
    address: "1100 Florida Ave NW, Washington, DC 20009",
    location: {
        lat: 38.920613,
        lng: -77.027349
      }
  },
  {
    name: "Market Lunch",
    address: "225 7th St SE, Washington, DC 20003",
    location: {
        lat: 38.886652,
        lng: -76.996438
      }
  },
  {
    name: "Shaw's Tavern",
    address: "520 Florida Ave NW, Washington, DC 20001",
    location: {
        lat: 38.915118,
        lng: -77.019651
      }
  },
  {
    name: "Tonic",
    address: "2036 G St NW, Washington, DC 20036",
    location: {
        lat: 38.89808,
        lng: -77.046469
      }
  },
  {
    name: "Daikaya",
    address: "705 6th St NW, Washington, DC 20001",
    location: {
        lat: 38.898574,
        lng: -77.019638
      }
    }
    ],
  apiData: []
};


// add google clendar first
addMapScript();

// Add model array information to the list.
function Lists(data) {
   var self = this;
   self.name = ko.observable(data.name);
   self.address = ko.observable(data.address);
   self.location = ko.observable(data.location);
   //self.marker = ko.observable(data.marker);
};


var viewModel = function() {

   var self = this;
   var marker;
   var searchResult;

   self.search_text = ko.observable('');
   self.nameList = ko.observableArray([]);
   self.showFilteredMarkers = ko.observable(); // names to store the filter


   //iterates through defaultData in Model and adds info to markers
      Model.defaultData.forEach(function (names) {
           self.nameList.push( new Lists(names));
       });

       // Filter based on user text
    self.filterNameList = ko.computed(function () {

        if (!self.search_text()) {
            searchResult = self.nameList();
        } else {
            searchResult = ko.utils.arrayFilter(self.nameList(), function (name) {
          
                return (
                    (self.search_text().length == 0 || name.name().toLowerCase().indexOf(self.search_text().toLowerCase()) > -1)
                );
            });
        }

        // Call showFilteredMarkers to visible only those markers, matched from user input
        self.showFilteredMarkers(searchResult, self.nameList());
        return searchResult;
    });

    // To make visible user serach result only
        self.showFilteredMarkers = function(filteredSearchArray, namesArray) {
              var i;
            for ( i = 0; i < namesArray.length; i++) {
                namesArray[i].marker.setVisible(false);
            }

            for ( i = 0; i < filteredSearchArray.length; i++) {

                namesArray[i].marker.setVisible(true);
            }

        };

    // To Generate marker and it's  other properties
    for(var i = 0; i < self.nameList().length; i++){

               marker = new google.maps.Marker({
                   map: map,
                   position: self.nameList()[i].location(),
                   title: self.nameList()[i].name(),
                   animation: google.maps.Animation.DROP
               });
               self.nameList()[i].marker = marker;

               // InfoWindow content
               var popupContent = '<div id="iw-container">' +
                   '<div class="iw-title">' + self.nameList()[i].name() +'</div>' +


                   '</div>';

               // Call infoWindowHandler to manage popup content
               populateInfoWindow(marker, popupContent);

               //pushes all premade marker from for loop to markers array defined earlier
               markers.push(marker);
           }



           // generate blank info object
             var infoWindow = new google.maps.InfoWindow();

           // Populate one infowindow when one of the markers is clicked.
           function populateInfoWindow(marker, popupContent) {
             google.maps.event.addListener(marker, 'click', function () {
           infoWindow.setContent(popupContent);



           if (marker.getAnimation() !== null) {

               this.setAnimation(null);
               marker.setIcon('assets/img/map-marker.png');
               infoWindow.close(map, this);
           } else {
               //setTimeout(function(){ this.setAnimation(google.maps.Animation.BOUNCE); }, 750);
               marker.setAnimation(google.maps.Animation.BOUNCE);
               setTimeout(function(){ marker.setAnimation(null); }, 1400);
               marker.setIcon('assets/img/map-marker.png');
               infoWindow.open(map, this);
           }
       });
           }


};





// Locate the map and the markers
function initMap() {

   map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: 38.889939, lng: -77.00905},
         zoom: 13
   });

  ko.applyBindings(viewModel);
};

function addMapScript() {
    var mapScript = document.createElement('script');
    mapScript.type = 'text/javascript';
    mapScript.async = true;
    mapScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBMNBtEzJyAvLrGDgO3m-_KNTHHfc42FK8&callback=initMap';
    mapScript.onerror = function() {
        console.log("Error loading Google Maps API");
        alert("Error loading Google Maps API");
    }
    document.body.appendChild(mapScript);
}
