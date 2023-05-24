//
//  AritstTab.swift
//  homework9
//
//  Created by 李子琦 on 4/26/23.
//

import SwiftUI

struct AritstTab: View {
    var artists: Artists?
    var body: some View {
        VStack{
            if (artists?.isEmpty ?? true){
                Text("No music related artists to show")
                    .font(.title)
                    .foregroundColor(.gray)
            }else{
                ScrollView{
                    LazyVStack{
                        ForEach(artists!, id: \.name){ artist in
                            ArtistView(artist: artist)
                        }
                    }
                }
            }
        }
    }
}

//struct AritstTab_Previews: PreviewProvider {
//    static var previews: some View {
//        AritstTab()
//    }
//}
