import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-search-wrapper',
  templateUrl: './search-wrapper.component.html',
  styleUrls: ['./search-wrapper.component.css']
})
export class SearchWrapperComponent implements OnInit {
  message!: string;
  eventsData: any;
  isFormSubmitted: boolean = false;
  isLoading: boolean = false;
  isCleared: boolean = false;
  formSubmitted: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getWelcomeMessage().subscribe((response) => {
      this.message = response.message;
    });
  }
  onDataReceived(data: any){
    this.eventsData = data;
    this.isLoading = false;
    // this.formSubmitted = true;
  }
  onFormSubmitted(isSubmitted: boolean){
    console.log("isSubmitted",isSubmitted);
    this.isFormSubmitted = isSubmitted;
    this.eventsData = [];
    this.isLoading = true;
    this.isCleared = false;
  }
  // onFormSubmitted1(): void{
  //   this.formSubmitted = true;
  //   console.log("formSubmitted in search wrapper",this.formSubmitted);
  // }
  clearEventsData(){
    this.eventsData = [];
    this.isCleared = true;
  }
}
