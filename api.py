import re
import urllib.request
import json
geocodingAPI = 'AIzaSyCL8Xhvp4YIB7EpryNhDD_EjBvre0QNs3c'
ticketmasterAPI = '6ujwd3iBEq1PMIkel7erMyoQh2MF4xWG'
url = "https://app.ticketmaster.com/discovery/v2/events/vvG10Z9KDOHpPm?apikey=" + ticketmasterAPI
response = urllib.request.urlopen(url)
data = response.read()
adict = json.loads(data)
print(123)