//
//  submitForm.swift
//  homework9
//
//  Created by 李子琦 on 4/17/23.
//

import Foundation
import Alamofire
typealias APIResponse = [Event]
struct Event: Codable, Identifiable{
    let id: String
    let date: String
    let time: String?
    let icon: String
    let name: String
    let genre: String
    let venue: String
    var dateTime: String{
        if let time = time{
            return "\(date) \(time)"
        }else{
            return date
        }
    }
}
struct IpInfoResponse: Decodable{
    let ip: String
    let loc: String
}
func submitForm(keyword: String, distance: String, category: String, location: String, autochecked: Bool, completion: @escaping([Event]) -> Void){
    if autochecked{
        getUserIpAddress { result in
            switch result{
            case .success(let (lat, lng)):
                submit(keyword: keyword, distance: distance, category: category, location: location, autochecked: autochecked, lat: lat, lng: lng, completion: completion)
            case .failure(let error):
                print("Error: \(error.localizedDescription)")
            }
        }
    }else{
        submit(keyword: keyword, distance: distance, category: category, location: location, autochecked: autochecked, completion: completion)
    }
}
func submit(keyword: String, distance: String, category: String, location: String, autochecked: Bool, lat: Double? = nil, lng: Double? = nil, completion: @escaping ([Event]) -> Void){
    let parameters: [String: Any] = [
        "keyword": keyword,
        "distance": distance,
        "category": category,
        "location": location,
        "autochecked": autochecked ? "true" : "false",
        "ipLat": lat as Any,
        "ipLng": lng as Any
    ]
    print(parameters)
    let url = "https://tickmaster-events-update0351.wl.r.appspot.com/api/submit-form"
    AF.request(url, method: .get, parameters: parameters)
        .validate()
        .responseDecodable(of: APIResponse.self){ response in
            switch response.result{
            case .success(let events):
                print("Response events: \(events)")
                completion(events)
            case .failure(let error):
                print("Error: \(error.localizedDescription)")
            }
        }
//        .responseString{ response in
//            switch response.result{
//            case .success(let jsonString):
//                print("JSON String: \(jsonString)")
//            case .failure(let error):
//                print("Error: \(error)")
//            }
//        }
}
func getUserIpAddress(completion: @escaping(Result<(Double, Double),Error>) -> Void){
    let token = "ee25635fe15fe5"
    let url = "https://ipinfo.io/json?token=\(token)"
    AF.request(url).validate()
        .responseDecodable(of: IpInfoResponse.self){ response in
        switch response.result{
        case .success(let ipInfo):
            let coordinates = ipInfo.loc.split(separator: ",").map{Double($0)!}
            let lat = coordinates[0]
            let lng = coordinates[1]
            completion(.success((lat,lng)))
        case .failure(let error):
            completion(.failure(error))
        }
    }
}
func getSuggestions(query: String, completion: @escaping([String]) -> Void){
    let url = "https://tickmaster-events-update0351.wl.r.appspot.com/api/autocomplete"
    let parameters: Parameters = ["query": query]
    AF.request(url, method: .get, parameters: parameters)
        .responseDecodable(of: [String].self){ response in
            switch response.result{
            case .success(let suggestions):
                completion(suggestions)
            case .failure(let error):
                print("Error fetching suggestions: \(error.localizedDescription)")
                completion([])
            }
        }
}
