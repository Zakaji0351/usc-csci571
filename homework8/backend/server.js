const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const ngeohash = require('ngeohash');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
const port = process.env.PORT || 3000;
const spotify = new SpotifyWebApi({
    clientId: "675a43b01e8e40c687e5bcacb429defb",
    clientSecret: "68c1da50517d4b4993f2e7ff7498ff92"
})
const {Logging} = require('@google-cloud/logging');
const logging = new Logging();
const log = logging.log('request-log');
app.use(cors());
app.use(bodyParser.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API!' });
});
app.get('/',(req,res) => {
    res.send("This is my backend server of ticketmaster event search app.");
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// async function makeApiRequest(url) {
//     const metadata = {resource: {type: 'gae_app', labels: {project_id: process.env.GOOGLE_CLOUD_PROJECT}}};
//     const entry = log.entry(metadata, {message: `Request sent to: ${url}`});
//     log.write(entry);
//     const response = await axios.get(url);
//     return response;
//   }
  
// async function getCurrentAddress(){
//     try{
//         const token = "ee25635fe15fe5";
//         const response = await axios.get(`https://ipinfo.io/json?token=${token}`);
//         const [lat, lng] = response.data.loc.split(',').map(Number);
//         return { lat: lat, lng: lng };
//     }catch(error){
//         console.error('Error getting current address', error);
//         throw error;
//     }
// }
async function getGeocode(location){
    const googleAPI = "AIzaSyCL8Xhvp4YIB7EpryNhDD_EjBvre0QNs3c";
    const address = encodeURIComponent(location);
    const googleURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleAPI}`;
    try{
        const response = await axios.get(googleURL);
        const data = response.data;
        console.log(data);
        if(data.status === 'OK' && data.results){
            const lat = data.results[0].geometry.location.lat;
            const lng = data.results[0].geometry.location.lng;
            return { lat: lat, lng: lng };
        }
    }catch(error){
        console.error(error);
    }
}
async function getSuggestions(keyword){
    const ticketmasterAPI = '6ujwd3iBEq1PMIkel7erMyoQh2MF4xWG';
    const url = `https://app.ticketmaster.com/discovery/v2/suggest?apikey=${ticketmasterAPI}&keyword=${keyword}`;
    try{
        const response = await axios.get(url);
        const suggestions = response.data._embedded.attractions.map(attraction => attraction.name);
        console.log("getting suggestions successfully");
        return suggestions
    }catch(error){
        console.error('Error fetching suggestions');
        return [];
    }
}
async function authenticateSpotifyApi(){
    try{
        const response = await spotify.clientCredentialsGrant();
        spotify.setAccessToken(response.body.access_token);
        console.log("successfully authentication");
        const expiresInMs = (response.body.expires_in - 60) * 1000;
        setTimeout(authenticateSpotifyApi,expiresInMs);
    }catch(error){
        console.error('Authentication Failure');
    }
}
authenticateSpotifyApi();
async function searchArtists(artistName){
    try{
        const response = await spotify.searchArtists(artistName);
        return response.body.artists.items;
    }catch(error){
        console.error("Error searching artists in spotify");
        throw error;
    }
}
async function getArtistAlbums(artistId){
    try{
        const response = await spotify.getArtistAlbums(artistId,{limit: 3});
        const albums = response.body.items;
        let result = [];
        for(let album of albums){
            result.push(album.images[0].url);
        }
        return result;
    }catch(error){
        console.error('Error getting albums in spotify');
        throw error;
    }
}
app.get('/api/autocomplete', async(req,res)=>{
    const keyword = req.query.query;
    console.log(keyword);
    const suggestions = await getSuggestions(keyword);
    res.json(suggestions);
})

app.get('/api/submit-form',async (req,res) => {
    try{
        const tickermasterAPI = '6ujwd3iBEq1PMIkel7erMyoQh2MF4xWG';
        const keyword = req.query.keyword;
        const distance = req.query.distance;
        const category = req.query.category;
        const location = req.query.location;
        const autochecked = req.query.autochecked === 'true';
        console.log("keyword:",keyword,"distance:",distance,"category:", category, "location:", location,"autocheck:",autochecked);
        let lat, lng;
        if(autochecked === true){
            lat = req.query.ipLat;
            lng = req.query.ipLng;
            // try{
            // const coords = await getCurrentAddress();
            // lat = coords.lat;
            // lng = coords.lng;
            // }catch(error){
            //     console.error(error.response.status);
            //     console.error(error.response.headers);
            // }
        }else{
            try{
            const coords = await getGeocode(location);
            console.log("geocoding...")
            lat = coords.lat;
            lng = coords.lng;
            console.log(lat,lng);
            }catch(error){
                console.error("Geocoding error",error.message);
            }
        }
        const categoryMap = new Map();
        categoryMap.set('Music',"KZFzniwnSyZfZ7v7nJ");
        categoryMap.set('Sports',"KZFzniwnSyZfZ7v7nE");
        categoryMap.set('Arts',"KZFzniwnSyZfZ7v7na");
        categoryMap.set('Film',"KZFzniwnSyZfZ7v7nn");
        categoryMap.set('Miscellaneous',"KZFzniwnSyZfZ7v7n1");
        categoryMap.set('Default',"");
        const geoPoint = ngeohash.encode(lat,lng);
        console.log("location and geopoint", location, geoPoint);
        const categoryCode = categoryMap.get(category);
        const ticketmasterURL =  `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${tickermasterAPI}&keyword=${keyword}&segmentId=${categoryCode}&radius=${distance}&unit=miles&geoPoint=${geoPoint}`;
        const response = await axios.get(ticketmasterURL);
        //const response = await makeApiRequest(ticketmasterURL);
        const events = response.data._embedded && response.data._embedded.events ? response.data._embedded.events: [];
        const events1 = events.slice(0,20);
        const resultData = events1.map(event =>{
            const id = event.id;
            const date = event.dates && event.dates.start ? event.dates.start.localDate : null;
            const time = event.dates && event.dates.start ? event.dates.start.localTime : null;
            const icon = event.images ? event.images[0].url : null;
            const name = event.name ? event.name : null;
            const genre = event.classifications && event.classifications[0].segment ? event.classifications[0].segment.name : null;
            const venue = event._embedded && event._embedded.venues ? event._embedded.venues[0].name : null;
            return {
                id,
                date,
                time,
                icon,
                name,
                genre,
                venue
            }
        })
        console.log(resultData);
        res.json(resultData);
    }catch(error){
        console.error("error"+error.message);
    }
}
)
app.get('/api/event-details/:eventId', async(req,res)=>{
    
    try{
        const eventId = req.params.eventId;
        const ticketmasterAPI = '6ujwd3iBEq1PMIkel7erMyoQh2MF4xWG';
        const durl = `https://app.ticketmaster.com/discovery/v2/events/${eventId}?apikey=${ticketmasterAPI}`;
        const response = await axios.get(durl);
        // console.log(response);
        const details = response.data;
        // console.log(details);
        const title = details.name? details.name : null;
        const date = details.dates?.start?.localDate || null;
        const time = details.dates?.start?.localTime || null;
        const artists = details._embedded?.attractions? details._embedded.attractions.map(attraction=>{
            const artist = attraction.name;
            const segment = attraction.classifications[0].segment.name;
            return{artist,segment};}) : null;
        // console.log(artists);
        let teams = "";
        let musicArtists = [];
        if(artists){
            for(let a of artists){
                teams += a.artist + ' | ';
                if(a.segment === 'Music'){
                    musicArtists.push(a.artist);
                }
            }
            teams = teams.slice(0,-3);
        }
        let genres = '';
        const venue = details._embedded?.venues?.[0]?.name || null;
        const segment = details.classifications?.[0]?.segment?.name || null;
        genres = segment ? genres + segment : genres;
        const genre = details.classifications?.[0]?.genre?.name || null;
        genres = genre ? (genres ? genres + ' | ' + genre : genre) : genres;
        const subGenre = details.classifications?.[0]?.subGenre?.name || null;
        genres = subGenre ? (genres ? genres + ' | ' + subGenre : subGenre) : genres;
        const type = details.classifications?.[0]?.primary?.type?.name || null;
        genres = type ? (genres ? genres + ' | ' + type : type) : genres;
        const subType = details.classifications?.[0]?.primary?.subType?.name || null;
        genres = subType ? (genres ? genres + ' | ' + subType : subType): genres;
        const priceRange = details.priceRanges ? (String(details.priceRanges[0].min)) + "-" + String(details.priceRanges[0].max + details.priceRanges[0].currency) : null;
        const url = details.url ? details.url : null;
        const ticketStatus = details.dates?.status?.code || null;
        const seatMap = details.seatmap ? details.seatmap.staticUrl : null;
        let saleColor = '';
        if(ticketStatus === 'onsale'){
            saleColor = "#377E22";
        }else if(ticketStatus == 'offsale'){
            saleColor = "#D42E20";
        }else if(ticketStatus === 'rescheduled' || ticketStatus === 'postponed'){
            saleColor = "#DFA339";
        }else{
            saleColor = "black";
        }
        const resultDetail = {
            title: title,
            dateTime: date + ' ' + time,
            artist: teams,
            genre: genres,
            venue: venue,
            priceRange: priceRange,
            ticketStatus: ticketStatus,
            seatMap: seatMap,
            url: url,
            saleColor: saleColor,
            musicArtists: musicArtists
        }
        console.log(resultDetail);
        res.json(resultDetail);
    }catch(error){
        console.error(error.message);
    }
})
app.get('/api/venue/:venue', async(req,res)=>{
    try{
    const ticketmasterAPI = '6ujwd3iBEq1PMIkel7erMyoQh2MF4xWG';
    const venue = req.params.venue;
    const keyword = encodeURIComponent(venue);
    const vurl = `https://app.ticketmaster.com/discovery/v2/venues?apikey=${ticketmasterAPI}&keyword=${keyword}`;
    const response = await axios.get(vurl);
    let addressInfo = '';
    const venues = response.data;
    const venue0 = venues._embedded?.venues?.[0] || null;
    // console.log(venue0)
    const name = venue0?.name || null;
    const address = venue0.address?.line1 || null;
    addressInfo = address ? addressInfo + address : addressInfo;
    const city = venue0.city?.name || null;
    addressInfo = city ? (addressInfo ? addressInfo + ", " + city : city) : addressInfo;
    const state = venue0.state?.stateCode || null;
    addressInfo = state ? (addressInfo ? addressInfo + ", " + state : state) : addressInfo;
    const country = venue0.country?.countryCode || null;
    addressInfo = country ? (addressInfo ? addressInfo + ", " + country : country) : addressInfo;
    console.log(addressInfo)
    const phone = venue0.boxOfficeInfo?.phoneNumberDetail || null;
    const openHour = venue0.boxOfficeInfo?.openHoursDetail || null;
    const gr = venue0.generalInfo?.generalRule || null;
    const cr = venue0.generalInfo?.childRule || null;
    let lat, lng;
    try{
        const coords = await getGeocode(address);
        lat = coords.lat;
        lng = coords.lng;
    }catch(error){
        console.error("can't get the coordinates");
    }
    const resultVenue = {
        venue: name,
        address: addressInfo,
        phoneNumber: phone,
        generalRule: gr,
        childRule: cr,
        openHours: openHour,
        lat: lat,
        lng: lng
    }
    console.log(resultVenue);
    res.json(resultVenue);
    }catch(error){
        console.error(error.message);
    }
})
app.get('/api/artists', async(req,res)=>{
    console.log("server side making spotify api call")
    const artistNames = req.query.artists.split(',');
    const artistInfo = [];
    try{
        for(const artistName of artistNames){
            const artists = await searchArtists(artistName);
            if(artists.length > 0){
                const artist = artists[0];
                const name = artist.name;
                const followers = artist.followers?.total?.toLocaleString() || null;
                const popularity = artist.popularity;
                const url = artist.external_urls;
                const image = artist.images[0].url;
                const albums = await getArtistAlbums(artist.id);
                artistInfo.push({
                    name: name,
                    image: image,
                    popularity: popularity,
                    followers: followers,
                    url: url,
                    albums: albums
                });
            }
        }
        console.log(artistInfo);
        res.json(artistInfo);
    }catch(error){
        console.error('Error fetching artist information:', error);
        res.status(500).json({ error: 'An error occurred while fetching artist information.' });
    }
})
