//
//  ContentView.swift
//  homework9
//
//  Created by 李子琦 on 4/17/23.
//

import SwiftUI

struct ContentView: View {
    @State private var events: [Event] = []
    @State private var showEventList: Bool = false
    @State private var isLoading: Bool = false
    var body: some View {
        NavigationView{
            Form{
                searchForm(events: $events, showEventList: $showEventList, isLoading: $isLoading)
                if showEventList{
                    EventList(events: events, isLoading: isLoading)
                }
            }
//            .navigationTitle("Event Search")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar{
                ToolbarItem(placement: .navigationBarLeading){
                    Text("Event Search")
                        .font(.title)
                        .bold()
                }
                ToolbarItem(placement: .navigationBarTrailing){
                    NavigationLink(destination: FavoriteView()){
                        Image(systemName: "heart")
                    }
                }
            }
        }

    }
}

//struct ContentView_Previews: PreviewProvider {
//    static var previews: some View {
//        ContentView()
//    }
//}
