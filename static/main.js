const autochecked = document.getElementById("autochecked");
const search_button = document.querySelector(".search-button");
const clear_button = document.querySelector(".clear-button");
search_button.addEventListener('click',(e)=>{
    var keyword = document.getElementById("keyword").value;
    var location = document.getElementById("location").value;
    if(keyword != '' && location != ''){
        e.preventDefault();
    }
    search();
})
clear_button.addEventListener('click',(e)=>{
    clear();
})


if(autochecked.checked){
    var locationInput = document.getElementById("location");
    locationInput.style.display = "none";
    locationInput.value = "";
}else{
    var locationInput = document.getElementById("location");
    locationInput.style.display = "block";
    locationInput.value = "";
}
autochecked.addEventListener('click',(e)=>{
    console.log(autochecked);
    if(autochecked.checked){
        var locationInput = document.getElementById("location");
        locationInput.style.display = "none";
        locationInput.value = "";
        var location = document.querySelector('.location');
        location.style.height = "30px";
        var searchTitle = document.querySelector('.search-title');
        searchTitle.style.height = "480px";
        // autochecked.style.float = "left";
    }else{
        var location = document.querySelector('.location');
        location.style.height = "100px";
        var searchTitle = document.querySelector('.search-title');
        searchTitle.style.height = "550px";
        var locationInput = document.getElementById("location");
        locationInput.style.display = "block";
    }
})

async function search(){
    const keyword = document.getElementById("keyword").value;
    const distance = document.getElementById("distance").value;
    const category = document.getElementById("category").value;
    var ac = false;
    var location;
    //determine whether use ipinfoAPI
    if(autochecked.checked){
        let response = await fetch("https://ipinfo.io/?token=ee25635fe15fe5",{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
            }
        })
        response = await response.json();
        console.log(response)
        location = response['loc'];
        ac = true;
    }else{
        location = document.getElementById("location").value;
    }
    console.log(keyword,distance,category,location);
    if(keyword != '' && location != ''){
        let response = await fetch(`/Events?keyword=${keyword}&distance=${distance}&category=${category}&location=${location}&autochecked=${ac}`,{
            method: 'GET',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        response = await response.json()
        console.log(response);
        if(Object.keys(response).length == 0){
            if(document.getElementById("table-head").innerHTML != ``){
                searchClear();
            }
            no_record = document.querySelector(".no-record");
            no_record.innerHTML = `<span class='no-display'>No Records Found</span>`;
        }else{
            if(document.querySelector(".no-record") != ``){
                document.querySelector(".no-record").innerHTML = ``;
            }
            table_head = document.getElementById('table-head');
            table_head.innerHTML = `
                <th>Date</th>
                <th>Icon</th>
                <th onclick="sortEvent()" class="sortable">Event</th>
                <th onclick="sortGenre()" class="sortable">Genre</th>
                <th onclick="sortVenue()" class="sortable">Venue</th>
            `;
            table_body = document.getElementById('table-body');
            table_body.innerHTML = ``;
            const keys = Object.keys(response)
            keys.forEach(i => {
                date = response[i]['date'];
                time = response[i]['time'];
                icon = response[i]['icon'][0]['url'];
                eventName = response[i]['event'];
                genre = response[i]['genre'];
                venue = response[i]['venue'];
                eventID = response[i]['eventID']
                table_body.innerHTML += `
                        <tr class="row">
                        <td class="content-unit date-unit">
                            <p>${date}</p>
                            <p>${time}</p>
                        </td>
                        <td class="content-unit icon-unit">
                            <img src="${icon}">
                        </td>
                        <td class="content-unit name-unit">
                            <a href="#detail-area" onClick="displayDetail('${eventID}')">${eventName}</a>
                        </td>
                        <td class="content-unit genre-unit">
                            ${genre}
                        </td> 
                        <td class="content-unit venue-unit">
                            ${venue}
                        </td>
                    </tr>
                `
            });
        }  
    }
}

async function displayDetail(eventID){
    venueBox = document.querySelector(".venue-box");
    venueBox.innerHTML = ``;
    if(document.querySelector(".show1")){
        venueBox.classList.remove("show1");
    }
    let response = await fetch(`/Detail?eventID=${eventID}`,{
        method: 'GET',
        xhrFields:{
            withCredentials: true
        },
        crossDomain: true,
        headers:{
            'ContentType': 'application/json'
        }
    })
    response = await response.json();
    console.log(response);
    eventName = response.name;
    date = response.date;
    time = response.time;
    artist = response.artist;
    artistLink = response.artistLink;
    venue = response.venue;
    genres = response.genre;
    priceRange = response.price;
    ticketStatus = response.ticketStatus;
    saleLink = response.saleLink;
    seatMap = response.seatMap;

    detailBox = document.querySelector(".detail-box");
    detailBox.classList.add('show');
    detailTitle = document.querySelector(".detail-title");
    detailTitle.innerHTML = `<h1>${eventName}</h1>` ;

    detailInfo = document.querySelector(".detail-info");
    detailInfo.innerHTML = ``;
    if(date && time){
        detailInfo.innerHTML += `
                <div class="info-item">
                    <h3 class="info-title">Date</h3>
                    <p class="info-content">${date} ${time}</p>
                </div>
        `;
    }
    if(artist){
        detailInfo.innerHTML +=`
                <div class="info-item">
                    <h3 class="info-title">Artist/Team</h3>
                    <a href="${artistLink}" target="_blank">${artist}</a>
                </div>
        `;
    }
    if(venue){
        detailInfo.innerHTML +=`
                <div class="info-item">
                    <h3 class="info-title">Venue</h3>
                    <p class="info-content">${venue}</p>
                </div>
        `
    }
    if(genres){
        detailInfo.innerHTML += `
                <div class="info-item">
                    <h3 class="info-title">Genre</h3>
                    <p class="info-content">${genres}</p>
                </div>
        `
    }
    if(priceRange){
        detailInfo.innerHTML += `
                <div class="info-item">
                    <h3 class="info-title">Price Ranges</h3>
                    <p class="info-content">${priceRange}</p>
                </div>
        `
    }
    if(ticketStatus){
        detailInfo.innerHTML += `
                <div class="info-item">
                    <h3 class="info-title">Ticket Status</h3>
                    <div id="sale-status">
                        
                    </div>
                </div>
        `
        switch(ticketStatus){
            case "onsale":
                document.getElementById("sale-status").innerHTML = `On Sale`;
                document.getElementById("sale-status").style.backgroundColor = "#377E22";
                break;
            case "offsale":
                document.getElementById("sale-status").innerHTML = `Off Sale`;
                document.getElementById("sale-status").style.backgroundColor = "#D42E20";
                break;
            case "rescheduled":
                document.getElementById("sale-status").innerHTML = `Rescheduled`;
                document.getElementById("sale-status").style.backgroundColor = "#DFA339";
                break;
            case "postponed":
                document.getElementById("sale-status").innerHTML = `PostPoned`;
                document.getElementById("sale-status").style.backgroundColor = "#DFA339";
                break;
            case "canceled":
                document.getElementById("sale-status").innerHTML = `Canceled`;
                document.getElementById("sale-status").style.backgroundColor = "black";
                break;
        }
    }
    if(saleLink){
        detailInfo.innerHTML += `
                <div class="info-item">
                    <h3 class="info-title">Buy Ticket At</h3>
                    <a href="${saleLink}" target="_blank">Ticketmaster</a>
                </div>
        `
    }
    seat = document.getElementById("seatmap");
    seat.innerHTML = `<img src="${seatMap}" alt="">`

    showVenue = document.querySelector('.show-venue');
    showVenue.classList.add('show-venue0');
    showVenue.innerHTML = `
            <p class="show-venue1">Show Venue Details</p>
            <p class="show-venue2" onclick="displayVenue('${venue}')"></p>
    `
}

async function displayVenue(venue){
    document.querySelector('.show-venue').innerHTML = ``;
    document.querySelector('.show-venue').classList.remove('show-venue0');
    let response = await fetch(`/Venue?venue=${venue}`,{
        method: 'GET',
        headers: {
            'Content-Type':'application/json'
        }
    })
    response = await response.json();
    venueName = response.name;
    address = response.address;
    city = response.city;
    postcode = response.postcode;
    upcomingEvents = response.upcomingEvents;
    googleMap = venueName + ' ' + address + ' ' + city + ' ' + postcode;
    googleMap = googleMap.replace(/ /g,'+');
    googleMap = googleMap.replace(/,/g,'%2C');
    googleURL = "https://www.google.com/maps/search/?api=1&query=" + googleMap;
    venueBox = document.querySelector('.venue-box');
    venueBox.classList.add('show1');
    venueBox.innerHTML = `
            <div class="venue-title">${venueName}</div>
            <div class="venue-info">
                <div class="address">
                    <div class="address-title">Address:</div>
                    <div class="address-info">
                        <p>${address}</p>
                        <p>${city}</p>
                        <P>${postcode}</P>
                    </div>
                </div>
                <div class="google-address">
                    <a href="${googleURL}" target="_blank">Open in Google Maps</a>
                </div>
            </div>
            <div class="upcoming-events">
                <a href="${upcomingEvents}" target="_blank">More Events at this venue</a>
            </div>
    `
}
function clear(){
    document.getElementById('table-head').innerHTML = ``;
    document.getElementById('table-body').innerHTML = ``;
    document.querySelector(".no-record").innerHTML = ``;
    // document.querySelector(".detail-box").innerHTML = ``;
    document.querySelector(".detail-title").innerHTML = ``;
    document.querySelector(".detail-info").innerHTML = ``;
    document.getElementById("seatmap").innerHTML = ``;
    document.querySelector(".detail-box").classList.remove("show");
    document.querySelector(".show-venue").innerHTML = ``;
    document.querySelector(".show-venue").classList.remove("show-venue0");
    document.querySelector(".venue-box").innerHTML = ``;
    document.querySelector(".venue-box").classList.remove("show1");
    if(autochecked.checked){
        var location = document.querySelector('.location');
        location.style.height = "100px";
        var searchTitle = document.querySelector('.search-title');
        searchTitle.style.height = "550px";
        var locationInput = document.getElementById("location");
        locationInput.style.display = "block";
    }
}
function searchClear(){
    document.getElementById('table-head').innerHTML = ``;
    document.getElementById('table-body').innerHTML = ``;
    document.querySelector(".no-record").innerHTML = ``;
    // document.querySelector(".detail-box").innerHTML = ``;
    document.querySelector(".detail-title").innerHTML = ``;
    document.querySelector(".detail-info").innerHTML = ``;
    document.getElementById("seatmap").innerHTML = ``;
    document.querySelector(".detail-box").classList.remove("show");
    document.querySelector(".show-venue").innerHTML = ``;
    document.querySelector(".show-venue").classList.remove("show-venue0");
    document.querySelector(".venue-box").innerHTML = ``;
    document.querySelector(".venue-box").classList.remove("show1");
}
function sortEvent(){
    var table = document.getElementById("table-body");
    var flag = true;
    var order = "ascending";
    var pairFlag;
    var count = 0;
    while(flag){
        flag = false;
        rows = table.rows;
        var i;
        for(i = 0; i < rows.length - 1; i++){
            pairFlag = false;
            var row1 = rows[i].querySelector(".name-unit").getElementsByTagName("a")[0];
            var row2 = rows[i+1].querySelector(".name-unit").getElementsByTagName("a")[0];
            if(order == "ascending"){
                if(row1.innerHTML.toLowerCase() > row2.innerHTML.toLowerCase()){
                    pairFlag = true;
                    break;
                }
            }
            else if(order == "descending"){
                if(row1.innerHTML.toLowerCase() < row2.innerHTML.toLowerCase()){
                    pairFlag = true;
                    break;
                }
            }
        }
        if(pairFlag == true){
            rows[i].parentNode.insertBefore(rows[i+1],rows[i]);
            flag = true;
            count ++;
        }else{
            if(count == 0 && order == "ascending"){
                order = "descending";
                flag = true;
            }
        }
    }
}
function sortGenre(){
    console.log("sorting-genre")
    var table = document.getElementById("table-body");
    rows1 = table.rows
    console.log(rows1);
    var row11 = rows1[0].querySelector(".genre-unit");
    console.log(row11);
    var flag = true;
    var order = "ascending";
    var pairFlag;
    var count = 0;
    while(flag){
        flag = false;
        rows = table.rows;
        var i;
        for(i = 0; i < rows.length - 1; i++){
            pairFlag = false;
            var row1 = rows[i].querySelector(".genre-unit");
            var row2 = rows[i+1].querySelector(".genre-unit");
            if(order == "ascending"){
                if(row1.innerHTML.toLowerCase() > row2.innerHTML.toLowerCase()){
                    pairFlag = true;
                    break;
                }
            }
            else if(order == "descending"){
                if(row1.innerHTML.toLowerCase() < row2.innerHTML.toLowerCase()){
                    pairFlag = true;
                    break;
                }
            }
        }
        if(pairFlag == true){
            rows[i].parentNode.insertBefore(rows[i+1],rows[i]);
            flag = true;
            count ++;
        }else{
            if(count == 0 && order == "ascending"){
                order = "descending";
                flag = true;
            }
        }
    }
}
function sortVenue(){
    var table = document.getElementById("table-body");
    var flag = true;
    var order = "ascending";
    var pairFlag;
    var count = 0;
    while(flag){
        flag = false;
        rows = table.rows;
        var i;
        for(i = 0; i < rows.length - 1; i++){
            pairFlag = false;
            var row1 = rows[i].querySelector(".venue-unit");
            var row2 = rows[i+1].querySelector(".venue-unit");
            if(order == "ascending"){
                if(row1.innerHTML.toLowerCase() > row2.innerHTML.toLowerCase()){
                    pairFlag = true;
                    break;
                }
            }
            else if(order == "descending"){
                if(row1.innerHTML.toLowerCase() < row2.innerHTML.toLowerCase()){
                    pairFlag = true;
                    break;
                }
            }
        }
        if(pairFlag == true){
            rows[i].parentNode.insertBefore(rows[i+1],rows[i]);
            flag = true;
            count ++;
        }else{
            if(count == 0 && order == "ascending"){
                order = "descending";
                flag = true;
            }
        }
    }
}
