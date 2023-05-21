from flask import Flask, request, current_app
from flask_cors import cross_origin
import api
import re
import urllib.request
import json
from geolib import geohash
app = Flask(__name__)



@app.route('/')
def hello():
    return current_app.send_static_file('search.html')




def geocoding(address,autochecked):
    if autochecked == "true":
        lat, lng = address.split(',')
        return geohash.encode(lat,lng,7)
    # make address format correct using regular expression
    address = re.sub("[^a-zA-Z0-9]","+",address)
    print(address)
    url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + api.geocodingAPI
    response = urllib.request.urlopen(url)
    data = response.read()
    adict = json.loads(data)
    if adict['results']:
        lat = adict.get('results')[0].get('geometry').get('location').get('lat')
        lng = adict.get('results')[0].get('geometry').get('location').get('lng')
        return geohash.encode(lat,lng,7)
    return False

@app.route('/Events',methods = ['GET'])
@cross_origin(supports_credentials=True)
def getEvents():
        args = request.args
        keyword = args.get('keyword')
        keyword = re.sub("[^a-zA-Z0-9]","+",keyword)
        radius = args.get("distance",default='10')
        category = args.get("category", default="Default")
        location = args.get("location")
        autochecked = args.get("autochecked")
        SegmentId = {"Music":"KZFzniwnSyZfZ7v7nJ","Sports":"KZFzniwnSyZfZ7v7nE","Arts":"KZFzniwnSyZfZ7v7na","Film":"KZFzniwnSyZfZ7v7nn","Miscellaneous":"KZFzniwnSyZfZ7v7n1","Default":""}
        geoLocation = geocoding(location,autochecked)
        if geoLocation == False:
            return {}
        url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + api.ticketmasterAPI + "&keyword=" + keyword + "&segmentId=" + SegmentId[category] +"&radius=" + radius + "&unit=miles&geoPoint=" + geoLocation
        response = urllib.request.urlopen(url)
        data = response.read()
        adict = json.loads(data)

        if '_embedded' not in adict:
            return {}
        Data = {}
        i = 0
        for event in adict.get('_embedded').get('events'):
            date, time, icon, name, genre, venue, eventID = '','','','','','',''
            eventID = event['id']
            if 'dates' in event and 'start' in event['dates']:
                if 'localDate' in event['dates']['start']:
                    date = event.get('dates').get('start').get('localDate')
                if 'localTime' in event['dates']['start']:
                    time = event.get('dates').get('start').get('localTime')
            if 'images' in event:
                icon = event.get('images')
            if 'name' in event:
                name = event.get('name')
            if 'classifications' in event and 'segment' in event['classifications'][0]:
                genre = event.get('classifications')[0].get('segment').get('name')
            if '_embedded' in event and 'venues' in event['_embedded']:
                venue = event.get('_embedded').get('venues')[0].get('name')
            Data[i] = {'date':date,'time':time, 'icon':icon,'event':name,'genre':genre,'venue':venue,'eventID':eventID}
            i += 1
            if i > 20:
                break
        return Data

@app.route('/Detail',methods=['GET'])
@cross_origin(supports_credentials=True)
def getDetail():
    args = request.args
    eventID = args.get('eventID')
    url = "https://app.ticketmaster.com/discovery/v2/events/" + eventID + "?apikey=" + api.ticketmasterAPI
    response = urllib.request.urlopen(url)
    data = response.read()
    adict = json.loads(data)
    name, date, time, artist, artistLink = '','','','',''
    venue, genres, price, ticketStatus, seatMap = '',[],'','',''
    name = adict['name']
    saleLink = ''
    if 'dates' in adict:
        if 'start' in adict['dates']:
            date = adict.get('dates').get('start').get('localDate')
            time = adict.get('dates').get('start').get('localTime')
        if 'status' in adict['dates']:
            ticketStatus = adict.get('dates').get('status').get('code')
    if '_embedded' in adict:
        if 'attractions' in adict['_embedded']:
            artist = adict.get('_embedded').get('attractions')[0].get('name')
            artistLink = adict.get('_embedded').get('attractions')[0].get('url')
        if 'venues' in adict['_embedded']:
            venue = adict.get('_embedded').get('venues')[0].get('name')
    if 'classifications' in adict:
        if 'segment' in adict['classifications'][0] and adict.get('classifications')[0].get('segment').get('name') != 'Undefined':
            genres.append(adict.get('classifications')[0].get('segment').get('name'))
        if 'genre' in adict['classifications'][0] and adict.get('classifications')[0].get('genre').get('name') != 'Undefined':
            genres.append(adict.get('classifications')[0].get('genre').get('name'))
        if 'subGenre' in adict['classifications'][0] and adict.get('classifications')[0].get('subGenre').get('name') != 'Undefined':
            genres.append(adict.get('classifications')[0].get('subGenre').get('name'))
    genre = ''
    for i in genres:
        if i:
            genre += i + '|'

    if 'priceRanges' in adict:
        price = str(adict.get('priceRanges')[0].get('min')) + "---" + str(adict.get('priceRanges')[0].get('max')) + adict.get('priceRanges')[0].get('currency')
    if 'url' in adict:
        saleLink = adict.get('url')
    if 'seatmap' in adict:
        seatMap = adict.get('seatmap').get('staticUrl')
    Data = {'name':name,'date':date,'time':time,'artist':artist,'artistLink':artistLink,'venue':venue,'genre':genre[:-1],'price':price,'ticketStatus':ticketStatus,'saleLink':saleLink,'seatMap':seatMap}
    return Data

@app.route('/Venue',methods=['GET'])
@cross_origin(supports_credentials=True)
def getVenue():
    args = request.args
    keyword = args.get('venue')
    keyword = keyword.replace(' ','%20')
    url = "https://app.ticketmaster.com/discovery/v2/venues?apikey=" + api.ticketmasterAPI + "&keyword=" + keyword
    response = urllib.request.urlopen(url)
    data = response.read()
    adict = json.loads(data)
    name, address, city, postcode, upcomingEvents = '','','','',''
    Data = {}
    if '_embedded' in adict and 'venues' in adict['_embedded']:
        node = adict['_embedded']['venues'][0]
        name = node.get('name')
        if 'address' in node:
            address = node.get('address').get('line1')
        if 'city' in node:
            city = node.get('city').get('name')
        if 'state' in node and 'stateCode' in node['state']:
            city += ', ' + node.get('state').get('stateCode')
        if 'postalCode' in node:
            postcode = node.get('postalCode')
        if 'url' in node:
            upcomingEvents = node.get('url')
    Data = {'name':name,'address':address,'city':city,'postcode':postcode,'upcomingEvents':upcomingEvents}
    return Data
if __name__ == '__main__':
    app.run()
