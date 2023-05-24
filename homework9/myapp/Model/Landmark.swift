//
//  Landmark.swift
//  myapp
//
//  Created by 李子琦 on 4/11/23.
//

import Foundation
import SwiftUI
import CoreLocation
struct Landmark: Hashable, Codable, Identifiable{
    
    var id: Int
    var category: String
    var name: String
    var park: String
    var state: String
    var description: String
    var isFavorite: Bool
    private var imageName: String
    var image: Image{
        Image(imageName)
    }
    private var coordinates: Coordinates
    var locationCoordinate: CLLocationCoordinate2D{
        CLLocationCoordinate2D(
            latitude: coordinates.latitude, longitude: coordinates.longitude)
    }
    struct Coordinates: Hashable, Codable{
        var latitude: Double
        var longitude: Double
    }
}
