//
//  EventDetail.swift
//  homework9
//
//  Created by 李子琦 on 4/21/23.
//

import SwiftUI

struct EventDetail: View {
    let event: Event
    @StateObject private var viewModel = EventDetailViewModel()
    @Environment(\.presentationMode) var presentationMode
    var body: some View {
        TabView{
            DetailTab(details: viewModel.selectedDetails)
                .tabItem{
                    Image(systemName: "text.bubble")
                    Text("Events")
                }
            AritstTab(artists: viewModel.selectedArtists)
                .tabItem{
                    Image(systemName: "guitars")
                    Text("Artist/Team")
                }
            VenueTab(detail: viewModel.selectedDetails, venue: viewModel.selectedVenue)
                .tabItem{
                    Image(systemName: "paperplane")
                    Text("Venue")
                }
        }
        .onAppear{
            viewModel.onRowClick(clickedEvent: event)
        }
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
        .navigationViewStyle(StackNavigationViewStyle())
        
    }
}

//struct EventDetail_Previews: PreviewProvider {
//    static var previews: some View {
//        EventDetail()
//    }
//}
