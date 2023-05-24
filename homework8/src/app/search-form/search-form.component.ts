import { Component, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../services/api.service'
import { NgForm } from '@angular/forms'
interface MyFormData{
  keyword: string;
  distance: number;
  category: string;
  location: string;
  autochecked: boolean;
}
@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent {
  constructor(private apiService: ApiService){}
  @Output() onEventsData = new EventEmitter<any>();
  @Output() formSubmitted = new EventEmitter<boolean>();
  @Output() onClearEvents = new EventEmitter<void>();
  //@Output() onFormReSubmitted = new EventEmitter<boolean>();
  formData: MyFormData = {
    keyword: '',
    distance: 10,
    category: 'Default',
    location: '',
    autochecked: false
  };
  async getUserIpAddress(){
    try{
      const token = 'ee25635fe15fe5';
      const response = await fetch(`https://ipinfo.io/json?token=${token}`);
      const data = await response.json();
      console.log(data)
      const [lat, lng] = data.loc.split(',').map(Number);
      return { lat: lat, lng: lng };
    }catch(error){
      console.error('Error getting user IP address',error);
      throw error;
    }
  }
  async onSubmit(form: NgForm){
    console.log('Form submitted: ', form);
    if(form.valid){
      let ipInfo;
      let lat, lng;
      if(this.formData.autochecked){
        try{
          ipInfo = await this.getUserIpAddress();
          lat = ipInfo.lat;
          lng = ipInfo.lng
        }catch(error){
          console.error('Error getting ip address',error);
        }
      }
      this.apiService.submitForm(this.formData, lat, lng).subscribe((response)=>{
        console.log(response);
        this.onEventsData.emit(response);  
      })
      this.formSubmitted.emit(true);
    }else{
      console.log('Form is invalid:',form);
    }
    // console.log("submitting form...");
    // this.onFormReSubmitted.emit(true);
  }
  keywordSuggestions: string[] = [];
  getKeywordSuggestions(keyword: string):void {
    if(keyword.length >= 2){
      this.apiService.getKeywordSuggestions(keyword).subscribe(suggestions => {
        this.keywordSuggestions = suggestions;
      });
    }else{
      this.keywordSuggestions = [];
    }
  }
  onSuggestionClick(suggestion: string): void {
    this.formData.keyword = suggestion;
    this.keywordSuggestions = [];
  }
  onAutoCheckedChange(): void {
    if(this.formData.autochecked){
      this.formData.location = '';
    }
  }
  onClear(form: NgForm){
    form.resetForm({distance: 10, category: 'Default'});
    this.onClearEvents.emit();
  }
}
