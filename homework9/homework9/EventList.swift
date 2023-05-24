//
//  EventList.swift
//  homework9
//
//  Created by 李子琦 on 4/18/23.
//

import SwiftUI
import Kingfisher

struct EventList: View {
    let events: [Event]
    var isLoading: Bool
    struct LoadingView: View{
        var body: some View{
            VStack(spacing: 16){
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle())
                Text("Please wait...")
            }
        }
    }
    struct StatusView: View{
        var isLoading: Bool
        var events: [Event]
        var body: some View{
            Group{
                if isLoading{
                    LoadingView()
                }else if events.isEmpty{
                    Text("No results available")
                }
            }
        }
    }

    var body: some View {
        List{
            Section(header: Text("Results")){
                if isLoading{
                    LoadingView()
                }else if events.isEmpty{
                    Text("No results available")
                }else{
                    ForEach(events.sorted(by: { $0.dateTime < $1.dateTime }), id: \.id) { event in
                        NavigationLink(destination: EventDetail(event: event)){
                            EventRow(event: event)
                        }
                    }
                }
                
            }
        }
//        .listStyle(GroupedListStyle())
//        .overlay(StatusView(isLoading: isLoading, events: events))
    }
}

//struct EventList_Previews: PreviewProvider {
//    static var previews: some View {
//        EventList(events: events)
//    }
//}
