//
//  FavoriteView.swift
//  homework9
//
//  Created by 李子琦 on 4/24/23.
//

import SwiftUI

struct FavoriteView: View {
    @AppStorage("favoriteEvents") private var favoriteEventsData: Data = Data()
    @Environment(\.presentationMode) var presentationMode
    @State private var favoriteEvents: [Details] = []
    func deleteFavoriteEvent(at offsets: IndexSet){
        favoriteEvents.remove(atOffsets: offsets)
        if let data = try? JSONEncoder().encode(favoriteEvents){
            favoriteEventsData = data
        }
    }
    var body: some View {
        NavigationView(){
            if let decodedEvents = try? JSONDecoder().decode([Details].self, from: favoriteEventsData),!decodedEvents.isEmpty{
                List{
                    ForEach(favoriteEvents, id: \.url){ event in
                        HStack{
                            if let dateTime = event.dateTime{
                                Text(dateTime)
                            }
                            if let title = event.title{
                                Text(title)
                            }
                            if let genres = event.genre{
                                Text(genres)
                            }
                            if let venue = event.venue{
                                Text(venue)
                            }
                            
                        }
                    }
                    .onDelete(perform: deleteFavoriteEvent)
                }
                .navigationTitle("Favorites")
            }else{
                VStack{
                    Spacer()
                    Text("No favorites found")
                        .font(.title)
                        .foregroundColor(.red)
                    Spacer()
                }
            }
                
        }
        .onAppear{
            if let decodedEvents = try? JSONDecoder().decode([Details].self,from: favoriteEventsData){
                favoriteEvents = decodedEvents
                print("from favorite view:\(favoriteEvents)")
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
        .navigationBarBackButtonHidden(true)
        .toolbar{
            ToolbarItem(placement: .navigationBarLeading){
                Button(action:{
                    presentationMode.wrappedValue.dismiss()
                }){
                    HStack{
                        Image(systemName: "chevron.left")
                        Text("Event Search")
                    }
                }
            }
        }
        
    }
}
//struct FavoriteView_Previews: PreviewProvider {
//    static var previews: some View {
//        FavoriteView()
//    }
//}
