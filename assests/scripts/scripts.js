            // Load the function when the document is ready
            $(document).ready(function() { 
                
                //Geolocation
                //Variable for location 
                var newLocation = '';
                //Set default location to Canberra
                var defaultLocation = '-35.28346,149.12807';
                //Defualt location for opencage API 
                var defaultRLocation = '-35.28346+149.12807';
                
                //Get location information from browser 
                //If there is a geolocation recorded 
                if (navigator.geolocation) {
                    //Log the geolocation data 
                    console.log(navigator.geolocation);
                    
                    //If you can retrieve a location 
                    function success(position) {
                        var crds = position.coords;
                        
                        console.log('Latitude: ' + crds.latitude);
                        console.log('Longitude: ' + crds.longitude);
                        
                        //Format location variable for darksky API
                        newLocation = crds.latitude + ',' + crds.longitude;
                        //Format location variable for opencage API
                        var RLocation = crds.latitude + '+' + crds.longitude;
                        
                        //Run function to get weather, sending location data
                        getWeather(newLocation);
                        //Run function to get location name, sending location data
                        locationName(RLocation);
                    }
                    
                    //Cannot retrieve the function location: error
                    function error(err) {
                        console.warn('ERROR(' + err.code + '): ' + err.message);
                        
                        //Run function to get weather sending default location
                        getWeather(defaultLocation);
                        //Run function to get location name, sending default location
                        locationName(defaultRLocation);
                    }
                    
                    //Request to allow the location data from the browser 
                    navigator.geolocation.getCurrentPosition(success, error);
                    
                    //Browser doesn't support geolocation: show error
                } else {
                    showError(); 
                   
                }
                
               
            });
            
                //Reverse geocode for location name 
                function locationName (currentRLocation) {
                
                //API Key can callback url
                var GLKey = 'b3c6f8195444484eabbbfa78c4ab681f';
                var GLurl = 'https://api.opencagedata.com/geocode/v1/json?q=' + currentRLocation + '&key=' + GLKey;
                
                //Request reverse geolocation data
                $.getJSON(GLurl, function (Locationdata) {
                    console.log(Locationdata);
                    //Display data
                    console.log(Locationdata.results[0].components.suburb);
                    console.log(Locationdata.results[0].components.state_code);
                    $('.Lsuburb').append(Locationdata.results[0].components.suburb);
                    $('.Lstate').append(Locationdata.results[0].components.state_code);
                });
                
                    
                }
            
            
                //Get weather function
                function getWeather (currentLocation) {
                
        
                    
                    //Including the DarkSky API Key
                    var DSkey = '22f0a2a4548baa22a9f5a74f5d27aabf';
                    //Including the DarkSky API url for callback 
                    var url = 'https://api.darksky.net/forecast/' + DSkey + '/' + currentLocation + '?units=auto&callback=?';
                    //Make GET request to server with API callback
                    $.getJSON(url, function(data){
                    //Output data from request onto console
                    console.log(data);
                    
                  
                    
                    //Get the current weather and load it on the console, and in the html. Round numbers where needed.
                    //Temperature
                    console.log(data.currently.temperature);
                    //Round numbers
                     var currentTemp = Math.round(data.currently.temperature);
                    $('.currentTemp span').html(currentTemp);
                    
                    //Date-Time 
                    console.log(data.currently.time);
                    //Make date-time into readable format with JS date object
                    var datetime = new Date(data.currently.time *1000);
                    console.log(datetime);
                    //Load it onto the html with jQuery
                    $('.currentDatetime span').html(datetime.toLocaleDateString() + ', ' + datetime.toLocaleTimeString());
                   

                    //Summary + Icon
                    //Get summary data and display on page
                    console.log(data.currently.summary);
                    $('.currentSummary span').html(data.currently.summary);
                    //Get the icon data  
                    console.log(data.currently.icon);
                    var icon = data.currently.icon;
                        
                    //Insert comments and colour changes according to weather, using icon and temperature
                    //Run function, sending current icon and temperature data
                    makeComments(icon, currentTemp);
                        
                                          
                    
                    //Humidity 
                    //Rounding % isn't really nessary, but i'm doing it anyway to prevent the odd '57.9999999999%' 
                    var humidity = Math.round(data.currently.humidity *100);
                    console.log(humidity);
                    $('.currentHumidity span').html(humidity);
                    
                    //Pressure
                    console.log(data.currently.pressure);
                    //Round numbers
                    var currentPressure = Math.round(data.currently.pressure);
                    $('.currentPressure span').html(currentPressure);
                    
                    //Wind 
                    console.log(data.currently.windSpeed);
                    //Round numbers and convert to km/hr
                    var currentWind = Math.round(data.currently.windSpeed * 3.6);
                    $('.currentWind span').html(currentWind);
                    
                    //Cloud cover 
                    //Round numbers
                    var cloudcover = Math.round(data.currently.cloudCover *100);
                    console.log(cloudcover);
                    $('.currentClouds span').html(cloudcover);
                    
                    //UV 
                    console.log(data.currently.uvIndex);
                    $('.currentUV span').html(data.currently.uvIndex);
                    
                    
              //Get the daily weather forcast and load it on the console, and in the html. Rounded numbers where needed. 
                    //Loop for daily forcast
                    for (var i = 0; i < data.daily.data.length; i++) {
                        var dailyFcast = data.daily.data[i];
                        console.log(dailyFcast);
                        
                        
                        //Define days of week
                        var week = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
                        
                        // Get the forecast date/time and convert it to a JS date
                        var date = new Date(dailyFcast.time * 1000); 
                        var dayofweek = week[date.getDay()];
                        console.log(dayofweek);
                        
                        //create stacked divs (instead of table) for forcast content 
                        var divRow = $('<div class ="' + i + ' dDaily"></div>').appendTo('.daily');
                        
                        //Insert the days the of the week
                        if (i == 0) {
                            //If the day is today, append 'today'
                            divRow.append('<span class ="dDay a">Today:</span>');
                        } else if (i == 1) { 
                            // If the day is tomorrow, append 'tomorrow'
                            divRow.append('<span class ="dDay a">Tomorrow:</span>');
                        } else {
                            divRow.append('<span class ="dDay a">' + dayofweek + ':</span>');
                            }

                        
                        //Summary
                        console.log(dailyFcast.summary);
                        divRow.append(' <span class ="dSum a">' + dailyFcast.summary + '</span>');
                        
                    
                        //Sunrise
                        var sunriseT = new Date(dailyFcast.sunriseTime *1000);
                        var up = sunriseT.toLocaleTimeString();
                        console.log(up);
                        divRow.append('<br><span class ="b">Sunrise: ' + up + '</span>');
                    
                        //Sunset
                        var sunsetT = new Date(dailyFcast.sunsetTime *1000);
                        var down = sunsetT.toLocaleTimeString();
                        console.log(down);
                        divRow.append('<span class ="b">Sunset: ' + down + '</span>');

                        //Temperature high
                        console.log(dailyFcast.temperatureHigh);
                        //Round numbers
                        var dailyHigh = Math.round(dailyFcast.temperatureHigh);
                        //At time
                        var tempHigh = new Date(dailyFcast.temperatureHighTime *1000); 
                        var highT = tempHigh.toLocaleTimeString(); 
                        console.log(highT);
                        divRow.append('<br><span class ="c">High Temperature: ' + dailyHigh + '&deg;C at: ' + highT + '</span>');
                    
                        //Temperature low 
                        console.log(dailyFcast.temperatureLow);
                        //Round numbers
                        var dailyLow = Math.round(dailyFcast.temperatureLow);
                        //At time
                        var tempLow = new Date(dailyFcast.temperatureLowTime *1000); 
                        var lowT = tempLow.toLocaleTimeString(); 
                        console.log(lowT);
                        divRow.append(' <span class ="c">Low Temperature: ' + dailyLow + '&deg;C at: ' + lowT + '</span>');
                    
                        //Rain
                        //Round numbers
                        var precipProb = Math.round(dailyFcast.precipProbability *100);
                        console.log(precipProb);
                        console.log(dailyFcast.precipType);
                        divRow.append('<br><span class="d">' + precipProb + '% chance of ' + dailyFcast.precipType + '</span>');
                   
                        //Humidity
                        //Round numbers
                        var fHumidity = Math.round(dailyFcast.humidity *100);
                        console.log(fHumidity);
                        divRow.append('<span class="d">Humidity: ' + fHumidity + '%</span>');
                        
                        //Wind
                        //Round numbers and convert to km/h
                        console.log(dailyFcast.windSpeed);
                        var dailyWind = Math.round(dailyFcast.windSpeed * 3.6);
                        divRow.append('<span class="d"> Wind speed: ' + dailyWind + ' km/h</span>');
                    
                        //UV
                        console.log(dailyFcast.uvIndex);
                        divRow.append('<br><span class="e">UV index: ' + dailyFcast.uvIndex + '</span>');
                    
                        //Clouds
                        //Round numbers
                        var fClouds = Math.round(dailyFcast.cloudCover *100);
                        console.log(fClouds);
                        divRow.append(' <span class="e"> Cloud cover: ' + fClouds + '%</span>');
                    
                        //Pressure
                        console.log(dailyFcast.pressure);
                        var dailyPressure = Math.round(dailyFcast.pressure);
                        divRow.append(' <span class="e"> Pressure: ' + dailyPressure + ' mb</span>')
                    };
                    

                });
                
                    
                };
                
            
                //Insert comments and colour changes by temperature and icon function 
                function makeComments (cIcon, cTemp) {
                    
                    //If temperature is less than 16, insert depressed comments and blue/grey colours
                        if (cTemp < 16) {
                            switch (cIcon) {
                                case "clear-day":
                                    IconText = "It's such a shame there are no clouds today.";
                                    break;
                                case "clear-night":
                                    IconText = "How miserable, it's a clear night and the stars are out.";
                                    break;
                                case "rain":
                                    IconText = "All this rain is making me sad.";
                                    break;
                                case "snow":
                                    IconText = "It's snowing today, how drepressing.";
                                    break;
                                case "sleet":
                                    IconText = "Your weather can't make up its mind. You've got rain and snow.";
                                    break;
                                case "wind":
                                    IconText = "You might want to bring a jacket. It's windy outside.";
                                    break;
                                case "fog":
                                    IconText = "Fog is so dreary.";
                                    break;
                                case "cloudy":
                                    IconText = "All these clouds make it so gloomy.";
                                    break;
                                case "partly-cloudy-day":
                                    IconText = "It's partly cloudy, how depressing.";
                                    break;
                                case "partly-cloudy-night":
                                    IconText = "Not even the clouds are putting in a good effort tonight.";
                                    break;
                                default:
                                    IconText = "Don't know, but it'll be miserable";
                                    }
                            
                        //Display the suggestions on the html
                        $('.currentIcon span').html(IconText);
                            
                        //Change colours to blues and greys.                           
                        $('body').css({ 'background-color': '#3D5D7C', 'color': '#E5E8E8' });
                        $('.now div').css({ 'background-color': '#738292', 'border': '5px solid #A0B0C0', 'color': '#E5E8E8' });
                        $('.daily').css({ 'background-color': '#7298BF', 'color': '#1B1B1B' });
                            
                        //If temperature is greater than 28, insert annoyed comments and red/orange colours
                            } else if (cTemp > 28) {
                                  switch (cIcon) {
                                    case "clear-day":
                                        IconText = "All this sun is getting in my eyes!";
                                        break;
                                    case "clear-night":
                                        IconText = "There are no clouds, the stars are too bright tonight.";
                                        break;
                                    case "rain":
                                        IconText = "It's raining, I hope you brought your washing in.";
                                        break;
                                    case "snow":
                                        IconText = "Typical, it's snowing.";
                                        break;
                                    case "sleet":
                                        IconText = "Ugh, sleet, how annoying.";
                                        break;
                                    case "wind":
                                        IconText = "It's windy, make sure nothing gets blown away!";
                                        break;
                                    case "fog":
                                        IconText = "Fog is so annoying, I can hardly see.";
                                        break;
                                    case "cloudy":
                                        IconText = "Clouds, clouds and more clouds. I'd say its cloudy.";
                                        break;
                                    case "partly-cloudy-day":
                                        IconText = "There are clouds in the sky. This annoys me.";
                                        break;
                                    case "partly-cloudy-night":
                                        IconText = "These clouds are blocking my view of the stars!";
                                        break;
                                    default:
                                        IconText = "I dunno, check it yourself.";
}

                                //Display the suggestions on the html
                                $('.currentIcon span').html(IconText);
                                
                                //Change colours to reds and oranges.
                                $('body').css({ 'background-color': '#B03A2E', 'color': '#E5E8E8' });
                                $('.now div').css({ 'background-color': '#BA4A00', 'border': '5px solid #E59866', 'color': '#E5E8E8' });
                                $('.daily').css({ 'background-color': '#D18678', 'color': '#1B1B1B' });
                            

                            //Else insert cheerful comments, and green/yellow colours
                                } else { 
                                    switch (cIcon) {
                                        case "clear-day":
                                            IconText = "Sun's out! Have chores to do? It's a good day to get stuff done outside!";
                                            break;
                                        case "clear-night":
                                            IconText = "It's a clear night! Good for stargazing, if you like that kind of thing.";
                                            break;
                                        case "rain":
                                            IconText = "It's a good day for dancing in the rain! Or stay inside, your choice.";
                                            break;
                                        case "snow":
                                            IconText = "Congratulations you've got snow!";
                                            break;
                                        case "sleet":
                                            IconText = "Ooooh you've got sleet, how interesting!";
                                            break;
                                        case "wind":
                                            IconText = "There's some good winds around right now, good day to fly a kite!";
                                            break;
                                        case "fog":
                                            IconText = "Cold and damp. You've got fog!";
                                            break;
                                        case "cloudy":
                                            IconText = "Cloudy, but at least the sun wont get in your eyes!";
                                            break;
                                        case "partly-cloudy-day":
                                            IconText = "There are clouds in the sky. What shapes can you see?";
                                            break;
                                        case "partly-cloudy-night":
                                            IconText = "There are still clouds up there, it's just harder to see them when its dark... keep trying.";
                                            break;
                                        default:
                                            IconText = "I don't know, but i'm sure it'll be wonderful!";

                                }
                                       //Display the suggestions on the html
                                        $('.currentIcon span').html(IconText);
                                        
                                        //Change colours to greens and yellos.
                                        $('body').css({ 'background-color': '#7B8E6A', 'color': '#E5E8E8' });
                                        $('.now div').css({ 'background-color': '#D4B969', 'border': '5px solid #E6CD80', 'color': '#1B1B1B' });
                                        $('.daily').css({ 'background-color': '#85B060', 'color': '#1B1B1B' });
                            

                                        }
                    }

                        