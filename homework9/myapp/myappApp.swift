//
//  myappApp.swift
//  myapp
//
//  Created by 李子琦 on 4/10/23.
//

import SwiftUI

@main
struct myappApp: App {
    @StateObject private var modelData = ModelData()
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(modelData)
        }
    }
}
