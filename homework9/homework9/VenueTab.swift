//
//  VenueTab.swift
//  homework9
//
//  Created by 李子琦 on 4/26/23.
//

import SwiftUI
import MapKit
struct VenueTab: View {
    var detail: Details?
    var venue: Venue?
    @State private var showingMap = false
    struct IdentifiableAnnotation: Identifiable{
        let id = UUID()
        let annotaion: MKPointAnnotation
    }
    @State private var annotation = MKPointAnnotation()
    func prepareAnnotation(){
        guard let lat = venue?.lat, let lng = venue?.lng else { return }
        annotation.coordinate = CLLocationCoordinate2D(latitude: lat, longitude: lng)
    }
    struct MapView: View{
        @Environment(\.dismiss) var dismiss
        var annotation: IdentifiableAnnotation
        var latitude: Double?
        var longitude: Double?
        var body: some View{
            if let lat = latitude, let lng = longitude{
                VStack{
                    Map(coordinateRegion: .constant(MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: lat, longitude: lng),span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05))), annotationItems:[annotation]){ place in
                        MapMarker(coordinate: place.annotaion.coordinate, tint: .red)
                    }
                    .edgesIgnoringSafeArea(.bottom)
                    .padding(.top, 10)
                }
            }
            
        }
    }
    var body: some View {
        
        ScrollView{
            VStack(alignment: .center){
                if let title = detail?.title{
                    Text(title)
                        .font(.system(size: 24))
                        .bold()
                        .padding(.bottom, 10)
                }
                if let name = venue?.venue{
                    VStack{
                        Text("Name")
                            .bold()
                        Text(name)
                            .foregroundColor(Color.gray)
                    }
                    .padding(.bottom, 10)
                }
                if let address = venue?.address{
                    VStack{
                        Text("Address")
                            .bold()
                        Text(address)
                            .foregroundColor(Color.gray)
                    }
                    .padding(.bottom, 10)
                }
                if let phone = venue?.phoneNumber{
                    VStack{
                        Text("Phone Number")
                            .bold()
                        Text(phone)
                            .foregroundColor(Color.gray)
                    }
                    .padding(.bottom, 10)
                }
                if let openHours = venue?.openHours{
                    VStack{
                        Text("Open Hours")
                            .bold()
                        ScrollView(.vertical){
                            Text(openHours)
                                .foregroundColor(Color.gray)
                                .lineLimit(nil)
                        }
                        .frame(height: 70)
                        .padding(.bottom, 10)
                    }
                }
                if let generalRule = venue?.generalRule{
                    VStack{
                        Text("General Rule")
                            .bold()
                        ScrollView(.vertical){
                            Text(generalRule)
                                .foregroundColor(Color.gray)
                                .lineLimit(nil)
                        }
                        .frame(height: 70)
                        .padding(.bottom, 10)
                    }
                }
                if let childRule = venue?.childRule{
                    VStack{
                        Text("Child Rule")
                            .bold()
                        ScrollView(.vertical){
                            Text(childRule)
                                .foregroundColor(Color.gray)
                                .lineLimit(nil)
                        }
                        .frame(height: 70)
                        .padding(.bottom, 10)
                    }
                }
                if let lat = venue?.lat, let lng = venue?.lng{
                    Button(action: {
                        showingMap = true
                        prepareAnnotation()
                    }){
                        ZStack{
                            RoundedRectangle(cornerRadius: 10)
                                .fill(Color.red)
                                .frame(width: 170, height: 60)
                                .frame(maxWidth: .infinity)
                            Text("Show venue on map")
                                .foregroundColor(.white)
                        }
                    }
                    .popover(isPresented: $showingMap, content: {
                        let identifiableAnnotation = IdentifiableAnnotation(annotaion: annotation)
                        MapView(annotation: identifiableAnnotation,latitude: lat, longitude:lng)
                            .edgesIgnoringSafeArea(.bottom)
                    })
                }
            }
            .frame(width: UIScreen.main.bounds.width * 0.8)
            .frame(maxWidth: .infinity)
        }
        
        
        
    }
}

//struct VenueTab_Previews: PreviewProvider {
//    static var previews: some View {
//        VenueTab()
//    }
//}
