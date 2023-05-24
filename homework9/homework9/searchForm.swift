
//
//  searchForm.swift
//  homework9
//
//  Created by 李子琦 on 4/17/23.
//

import SwiftUI
import Combine
struct searchForm: View {
    @Binding var events: [Event]
    var isFormValid: Bool{
        return !keyword.isEmpty && !distance.isEmpty && !category.isEmpty && (!location.isEmpty || autochecked)
    }
    @State private var keyword: String = ""
    @State private var distance: String = "10"
    @State private var category: String = "Default"
    @State private var location: String = ""
    @State private var autochecked: Bool = false
    @StateObject private var autocompleteViewModel = AutocompleteViewModel()
    @State private var showSuggestionsPopover: Bool = false
    @Binding var showEventList: Bool
    @Binding var isLoading: Bool
    @State private var isAutoLoading: Bool = false
    @State private var debounceTimer: Cancellable?
    private var suggestionsList: some View{
        VStack(alignment: .leading){
            Text("Suggestions")
                .font(.headline)
                .padding(.leading)
            if isAutoLoading{
                ProgressView()
                    .padding()
                    .progressViewStyle(CircularProgressViewStyle())
                Text("Please wait...")
            }else{
                List(autocompleteViewModel.suggestions, id: \.self){ suggestion in
                    Button(action:{
                        keyword = suggestion
                        autocompleteViewModel.suggestions = []
                        showSuggestionsPopover = false
                        autocompleteViewModel.userSelected = true
                    }){
                        Text(suggestion)
                    }
                }
            }
        }
        .frame(maxWidth: .infinity)
    }
    private func clearForm(){
        keyword = ""
        distance = "10"
        category = "Default"
        location = ""
        autochecked = false
        DispatchQueue.main.async{
            self.events = []
            self.showEventList = false
        }
    }
    var body: some View {
//        VStack(alignment:.leading, spacing: 0) {
//            Text("Event Search")
//                .font(.largeTitle)
//                .fontWeight(.bold)
//                .padding(.bottom, 0)
//                .padding(.leading)
            List {
                ZStack{
                    if showSuggestionsPopover{
                        suggestionsList
                            .popover(isPresented: $showSuggestionsPopover, content:{
                                suggestionsList
                            })
                            .frame(maxWidth: .infinity, alignment: .trailing)
                            .padding(.top)
                    }
                    HStack{
                        Text("Keyword:")
                        Spacer()
                        TextField("Required", text: $keyword)
                            .onChange(of: keyword){ newValue in
                                isAutoLoading = true
                                debounceTimer?.cancel()
                                debounceTimer = Just(newValue)
                                    .delay(for: .seconds(2), scheduler: DispatchQueue.main)
                                    .sink{ newValue in
                                        autocompleteViewModel.query = newValue
                                        isAutoLoading = false
                                    }
                            }
                            .onReceive(autocompleteViewModel.$suggestions){ suggestions in
//                                isAutoLoading = false
                                showSuggestionsPopover = !suggestions.isEmpty && !keyword.isEmpty
                            }
                    }
                }
                HStack{
                    Text("Distance:")
                    Spacer()
                    TextField("", text: $distance)
                        .keyboardType(.numberPad)
                }
                HStack{
                    Text("Category:")
                    Spacer()
                    Picker("", selection: $category){
                        Text("Default").tag("Default")
                        Text("Music").tag("Music")
                        Text("Sports").tag("Sports")
                        Text("Arts&Theatre").tag("Arts")
                        Text("Film").tag("Film")
                        Text("Miscellaneous").tag("Miscellaneous")
                    }
                    .pickerStyle(MenuPickerStyle())
                }
                if !autochecked{
                    HStack{
                        Text("Location:")
                        Spacer()
                        TextField("Required", text: $location)
                            .disabled(autochecked)
                    }
                }
                HStack{
                    Text("Auto-Detection my location")
                    Spacer()
                    Toggle("", isOn: $autochecked)
                }
                
                HStack(spacing: 20) {
                    Spacer()
                    Button(action: {
                        isLoading = true
                        submitForm(keyword: keyword, distance: distance, category: category, location: location, autochecked: autochecked){ fetchedEvents in
                            events = fetchedEvents
                            showEventList = true
                            isLoading = false
                            showEventList = true
                        }
                    }){
                        Text("Submit")
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(isFormValid ? Color.red : Color.gray)
                    .foregroundColor(.white)
                    .cornerRadius(10)
                    .disabled(!isFormValid)
                    .buttonStyle(BorderlessButtonStyle())
                    Spacer()
                    Button(action: {
                        clearForm()
                    }){
                        Text("Clear")
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(10)
                    .buttonStyle(BorderlessButtonStyle())
                    Spacer()
                }
                
            }
            
            
        //}
//        if showEventList{
//            EventList(events: events, isLoading: isLoading)
//        }
    }
}
//    struct searchForm_Previews: PreviewProvider {
//        static var previews: some View {
//            searchForm()
//        }
//    }

