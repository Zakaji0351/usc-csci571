//
//  DetailTab.swift
//  homework9
//
//  Created by 李子琦 on 4/24/23.
//

import SwiftUI
import Kingfisher
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}



struct DetailTab: View {
    @State private var isFavorite: Bool = false
    @AppStorage("favoriteEvents") private var favoriteEventsData: Data = Data()
    func toggleFavorite(){
        isFavorite.toggle()
        
        print("IsFavorite Status after toggle:", isFavorite)
        var favoriteEvents: [Details] = []
        if let events = try? JSONDecoder().decode([Details].self, from: favoriteEventsData){
            favoriteEvents = events
        }
        if isFavorite{
            if let details = details{
                favoriteEvents.append(details)
            }
        }else{
                favoriteEvents.removeAll(where: {$0.url == details?.url})
        }
        if let data = try? JSONEncoder().encode(favoriteEvents){
            favoriteEventsData = data
        }
        if let decodedEvents = try? JSONDecoder().decode([Details].self, from: favoriteEventsData) {
            print("Current favorite events: \(decodedEvents)")
        } else {
                print("Failed to decode favorite events data")
        }
        showToast = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 2){
            showToast = false
        }
    }
    private func checkIfFavorite(){
        guard let details = self.details else{
            print("details is fucking nil")
            return
        }
        if let favoriteEvents = try? JSONDecoder().decode([Details].self, from: favoriteEventsData){
            print("check favorite events:", favoriteEvents)
            print("it's this:", favoriteEvents.contains(where: {$0.url == details.url}))
            print("details url", details.url!)
            print("stored urls", favoriteEvents.map { $0.url })
            if favoriteEvents.contains(where: {$0.url == details.url}){
                isFavorite = true
                print("isFavorite status:", isFavorite)
            }else{
                isFavorite = false
            }
        }
        
    }
    @State private var showToast: Bool = false
    var details: Details?
    init(details: Details?){
        self.details = details
        checkIfFavorite()
    }
    var body: some View {
        ZStack{
            VStack(spacing: 16){
                if let title = details?.title{
                    Text(title)
                        .bold()
                        .font(.system(size:24))
                }
                
                HStack{
                    VStack(alignment: .leading, spacing: 8){
                        if let dateTime = details?.dateTime{
                            Text("Date")
                                .bold()
                            Text(dateTime)
                                .foregroundColor(Color.gray)
                        }
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 8){
                        if let artists = details?.artist{
                            Text("Artists/Team")
                                .bold()
                            Text(artists)
                                .foregroundColor(Color.gray)
                        }
                    }
                }
                .frame(maxWidth: .infinity)
                .padding(.horizontal)
                HStack{
                    VStack(alignment: .leading,spacing: 8){
                        if let venue = details?.venue{
                            Text("Venue")
                                .bold()
                            Text(venue)
                                .foregroundColor(Color.gray)
                        }
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 8){
                        if let genres = details?.genre{
                            Text("Genres")
                                .bold()
                            Text(genres)
                                .foregroundColor(Color.gray)
                        }
                    }
                }
                .frame(maxWidth: .infinity)
                .padding(.horizontal)
                HStack{
                    VStack(alignment: .leading, spacing: 8){
                        if let priceRange = details?.priceRange{
                            Text("Price Range")
                                .bold()
                            Text(priceRange)
                                .foregroundColor(Color.gray)
                        }
                    }
                    Spacer()
                    VStack(alignment: .leading, spacing: 8){
                        if let saleColor = details?.saleColor{
                            if let ticketStatus = details?.ticketStatus {
                                Text("Ticket Status")
                                Text(ticketStatus)
                                    .background(Color(hex: saleColor))
                                    .foregroundColor(.white)
                                    .cornerRadius(5)
                                    .padding(.leading)
                            }
                        }
                    }
                }
                .padding(.horizontal)
                .frame(maxWidth: .infinity)
                Button(action:{
                    toggleFavorite()
                }){
                    Text(isFavorite ? "Remove from Favorites": "Save Event")
                        .padding()
                        .background(isFavorite ? Color.red : Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(5)
                }
                if let seatURL = details?.seatMap{
                    if let seatMap = URL(string: seatURL){
                        KFImage(seatMap)
                            .resizable()
                            .scaledToFit()
                            .frame(width: 300, height: 260)
                    }

                }
                if let ticketLink = details?.url{
                    HStack{
                        Text("Buy Ticket At:")
                            .bold()
                        Link("Ticketmaster", destination: URL(string: ticketLink)!)
                    }
                    HStack{
                        Text("Shared on:")
                        let encodedURL = ticketLink.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
                        let twitterBaseUrl = "https://twitter.com/intent/tweet"
                        let twitterText = "Check out this event!".addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
                        let twitter = "\(twitterBaseUrl)?text=\(twitterText)&url=\(encodedURL)"
                        Link(destination: URL(string: twitter)!){
                            Image("Twitter social icons - circle - blue")
                                .resizable()
                                .scaledToFit()
                        }
                        let facebookBaseUrl = "https://www.facebook.com/sharer/sharer.php"
                        let facebook = "\(facebookBaseUrl)?u=\(encodedURL)"
                        Link(destination: URL(string: facebook)!){
                            Image("f_logo_RGB-Blue_144")
                                .resizable()
                                .scaledToFit()
                        }
                    }
                    
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
            .padding(.top,0)
            if showToast{
                Toast(message: isFavorite ? "Save event" : "Remove from favorites")
                    .transition(.opacity)
                    .animation(.easeInOut(duration: 0.2))
            }
        }
    }
}

//struct DetailTab_Previews: PreviewProvider {
//    static var previews: some View {
//        DetailTab()
//    }
//}
