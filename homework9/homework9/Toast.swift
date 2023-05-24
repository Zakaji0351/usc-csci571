//
//  Toast.swift
//  homework9
//
//  Created by 李子琦 on 4/24/23.
//

import SwiftUI

struct Toast: View {
    var message: String
    var body: some View {
        Text(message)
            .foregroundColor(.white)
            .padding()
            .background(Color.black.opacity(0.7))
            .cornerRadius(8)
    }
}

//struct Toast_Previews: PreviewProvider {
//    static var previews: some View {
//        Toast()
//    }
//}
