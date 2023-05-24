//
//  AutocompleteViewModel.swift
//  homework9
//
//  Created by 李子琦 on 4/17/23.
//

import Foundation
import SwiftUI
import Combine
class AutocompleteViewModel: ObservableObject{
    @Published var query: String = ""
    @Published var suggestions: [String] = []
    private var subscription = Set<AnyCancellable>()
    var userSelected: Bool = false
    init(){
        $query
            .debounce(for: .milliseconds(1000), scheduler: DispatchQueue.main)
            .removeDuplicates()
            .sink{ [weak self] query in
                if self?.userSelected == false{
                    self?.fetchSuggestions(query: query)
                }else{
                    self?.userSelected = false
                }
                
            }
            .store(in: &subscription)
    }
    private func fetchSuggestions(query: String){
        getSuggestions(query: query){ suggestions in
            DispatchQueue.main.async{
                self.suggestions = suggestions
            }
            
        }
    }
}

