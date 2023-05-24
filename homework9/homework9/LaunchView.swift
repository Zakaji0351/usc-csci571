//
//  LaunchView.swift
//  homework9
//
//  Created by 李子琦 on 4/27/23.
//

import SwiftUI
import Kingfisher
struct LaunchView: View {
    @State private var isActive = false
    var body: some View {
        if isActive{
            ContentView()
        }else{
            Image("launchScreen")
                .onAppear{
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2.0){
                        self.isActive = true
                    }
                }
        }
    }
}

//struct LaunchView_Previews: PreviewProvider {
//    static var previews: some View {
//        LaunchView()
//    }
//}
