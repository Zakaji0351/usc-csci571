import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  // message!: string;
  // eventsData: any;
  // isFormSubmitted = false;
  // isLoading = false;

  // constructor(private apiService: ApiService) {}

  // ngOnInit() {
  //   this.apiService.getWelcomeMessage().subscribe((response) => {
  //     this.message = response.message;
  //   });
  // }
  // onDataReceived(data: any){
  //   this.eventsData = data;
  //   this.isLoading = false;
  // }
  // onFormSubmitted(isSubmitted: boolean){
  //   this.isFormSubmitted = isSubmitted;
  //   this.eventsData = [];
  //   this.isLoading = true;
  // }
  
}
