//
//  EventRow.swift
//  homework9
//
//  Created by 李子琦 on 4/24/23.
//

import SwiftUI
import Kingfisher
struct EventRow: View {
    var event: Event
    var body: some View{
        HStack{
            Text(event.dateTime)
            if let iconURL = URL(string: event.icon){
                KFImage(iconURL)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 50, height: 60)
            }
            Text(event.name)
                .lineLimit(3)
            Text(event.venue)
        }
    }
}

//struct EventRow_Previews: PreviewProvider {
//    static var previews: some View {
//        EventRow()
//    }
//}
