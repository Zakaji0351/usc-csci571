//
//  ArtistView.swift
//  homework9
//
//  Created by 李子琦 on 4/26/23.
//

import SwiftUI
import Kingfisher
struct ArtistView: View {
    let artist: Artist?
    func formatFollowers(_ followers: String) -> String{
        guard let followerCount =  Int(followers.replacingOccurrences(of: ",", with: "")) else { return followers}
        switch followerCount{
        case let count where count >= 1_000_000:
            return "\(count/1_000_000)M"
        case let count where count > 1_000:
            return "\(count/1_0000)K"
        default:
            return "\(followerCount)"
        }
    }
    struct RingView: View{
        var progress: Int
        var body: some View{
            ZStack{
                Circle()
                    .stroke(lineWidth: 15)
                    .opacity(0.3)
                    .foregroundColor(Color.orange)
                Circle()
                    .trim(from: 0.0, to: CGFloat(min(Double(self.progress)/100.0, 1.0)))
                    .stroke(style: StrokeStyle(lineWidth: 15, lineCap: .round))
                    .foregroundColor(Color.orange)
                    .rotationEffect(Angle(degrees: 270.0))
                    
                Text(String(format: "%d%", min(self.progress,100)))
                    .font(.caption)
                    .foregroundColor(Color.white)
                    .bold()
            }
        }
    }
    var body: some View {
        VStack{
            HStack{
                if let artistImage = artist?.image{
                    let artistImageURL = URL(string: artistImage)
                    KFImage(artistImageURL)
                        .resizable()
                        .scaledToFit()
                        .cornerRadius(6)
                        .frame(width: 100, height: 100)
                }
                Spacer()
                VStack(alignment: .leading){
                    if let name = artist?.name{
                        Text(name)
                            .font(.system(size:20))
                            .bold()
                            .foregroundColor(Color.white)
                            .padding(.bottom)
                    }
                    if let followers = artist?.followers{
                        HStack{
                            Text(formatFollowers(followers))
                                .font(.system(size: 16))
                                .bold()
                            Text("followers")
                                .font(.system(size: 12))
                        }
                        .foregroundColor(Color.white)
                    }
                    if let spotifyURL = artist?.url?.spotify{
                            Link(destination: URL(string: spotifyURL)!){
                                HStack{
                                    Image("spotify_logo")
                                        .resizable()
                                        .scaledToFit()
                                        .frame(width: 50,height: 50)
                                    Text("Spotify")
                                        .foregroundColor(Color.green)
                                }
                            }
                    }
                }
                Spacer()
                VStack(){
                    Text("Popularity")
                        .bold()
                        .foregroundColor(Color.white)
                    if let popularity = artist?.popularity{
                        RingView(progress: popularity)
                            .frame(width: 70, height: 70)
                    }
                }
                .frame(alignment: .top)
            }
            VStack(alignment: .leading){
                Text("Popular Albums")
                    .foregroundColor(Color.white)
                    .font(.system(size: 20))
                    .bold()
                if let albums = artist?.albums{
                    HStack(spacing: 10){
                        ForEach(albums, id: \.self){ album in
                            KFImage(URL(string: album))
                                .resizable()
                                .scaledToFit()
                                .cornerRadius(5)
                        }
                    }
                }
            }
            
        }
        .padding()
        .frame(width: UIScreen.main.bounds.width * 0.9)
        .frame(maxWidth: .infinity)
        .background(Color.gray)
        .cornerRadius(10)
        .shadow(radius: 5)
    }
}

//struct ArtistView_Previews: PreviewProvider {
//    static var previews: some View {
//        ArtistView()
//    }
//}
