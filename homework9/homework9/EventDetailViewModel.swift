//
//  EventDetailViewModel.swift
//  homework9
//
//  Created by 李子琦 on 4/21/23.
//

import Foundation
import Alamofire
struct Details: Decodable, Encodable, Equatable{
    let title: String?
    let dateTime: String?
    let artist:  String?
    let genre: String?
    let venue: String?
    let priceRange: String?
    let ticketStatus: String?
    let seatMap: String?
    let url: String?
    let saleColor: String?
    let musicArtists: [String]?
}
struct Venue: Decodable{
    let venue: String
    let address: String?
    let phoneNumber: String?
    let generalRule: String?
    let childRule: String?
    let openHours: String?
    let lat: Double?
    let lng: Double?
}
typealias Artists = [Artist]
struct Artist: Decodable{
    let name: String?
    let image: String?
    let popularity: Int?
    let followers: String?
    let url: SpotifyURL?
    let albums: [String]?
}
struct SpotifyURL: Decodable{
    let spotify: String?
}

class APIService{
    let baseURL = "https://tickmaster-events-update0351.wl.r.appspot.com/api"
    func getVenue(venue: String, completion: @escaping (Venue?) -> Void){
        let venueURL = "\(baseURL)/venue/"
        let encodedVenue = venue.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? ""
        let url = venueURL + encodedVenue
        AF.request(url).validate().responseDecodable(of: Venue.self){ response in
            switch response.result{
            case .success(let venue):
                completion(venue)
            case .failure(let error):
                print("Venue fetching error", error.localizedDescription)
            }
        }
    }
    func getDetails(eventId: String, completion: @escaping (Details?) -> Void){
        let detailURL = "\(baseURL)/event-details/"
        let encodedDetails = eventId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? ""
        let url = detailURL + encodedDetails
        AF.request(url).validate().responseDecodable(of: Details.self){ response in
            switch response.result{
            case .success(let details):
                completion(details)
            case .failure(let error):
                print("Detail fetching error", error.localizedDescription)
            }
        }
    }
    func getArtists(artistNames: [String], completion: @escaping (Artists?) -> Void){
        let artistsURL = "\(baseURL)/artists"
        let parameters = artistNames.joined(separator: ",")
        let url = URL(string: artistsURL)!
        var urlComponents = URLComponents(url: url, resolvingAgainstBaseURL: true)!
        urlComponents.queryItems = [URLQueryItem(name: "artists", value: parameters)]
        let finalURL = urlComponents.url!
        AF.request(finalURL).validate().responseDecodable(of: Artists.self){ response in
//            print("raw artists response: ", response)
            switch response.result{
            case .success(let artists):
                completion(artists)
            case .failure(let error):
                print("Artists fetching error", error.localizedDescription)
            }
        }
        
    }
}
class EventDetailViewModel: ObservableObject{
    @Published var selectedVenue: Venue?
    @Published var selectedDetails: Details?
    @Published var selectedArtists: Artists?
    let apiService = APIService()
    func onRowClick(clickedEvent: Event){
        print("Row clicked: ", clickedEvent)
        apiService.getVenue(venue: clickedEvent.venue){ response in
//            print("Venue details:", response)
            DispatchQueue.main.async{
                self.selectedVenue = response
    
            }
        }
        apiService.getDetails(eventId: clickedEvent.id){ response in
//            print("Event details:", response)
            DispatchQueue.main.async{
                self.selectedDetails = response
            }
            if let musicArtists = response?.musicArtists, !musicArtists.isEmpty{
                self.apiService.getArtists(artistNames: musicArtists){ response in
                    DispatchQueue.main.async{
//                        print("Spotify response: ", response)
                        self.selectedArtists = response
                    }
                }
            }else{
                DispatchQueue.main.async{
                    print("No spotify response")
                    self.selectedArtists = nil
                }
            }
        }
    }
}
