import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  constructor(
    private apiService: ApiService
  ){}
  @Input() events: any;
  @Input() isSubmitted = false;
  @Input() isLoading = false;
  @Input() isCleared: boolean = false;
  //@Input() isformReSubmitted!: boolean;
  selectedEventDetails: any;
  selectedVenue: any;
  selectedArtists: any;
  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void{
    if('events' in changes){
      this.sortEvents();
    }
    if('isCleared' in changes && this.isCleared === true){
      this.selectedEventDetails = null;
    }
    // console.log("formSubmitted in events",this.isformReSubmitted);
    // console.log(changes)
    // if('isformReSubmitted' in changes && this.isformReSubmitted === true){
    //   this.selectedEventDetails = null;
    //   this.isformReSubmitted = false;
    // }
  }
  onRowClick(clickedEvent: any){
    console.log('Row clicked: ', clickedEvent);
    this.apiService.getVenue(clickedEvent.venue).subscribe((response)=>{
      console.log('Venue details:', response);
      this.selectedVenue = response;
    });
    this.apiService.getDetails(clickedEvent.id).subscribe((response)=>{
      console.log('Event details:', response);
      this.selectedEventDetails = response;
      console.log("Music artists details:", this.selectedEventDetails.musicArtists);
      if(this.selectedEventDetails.musicArtists !== null && this.selectedEventDetails.musicArtists.length > 0){
        this.apiService.getArtistsInfo(this.selectedEventDetails.musicArtists).subscribe((response)=>{
          this.selectedArtists = response;
          console.log("spotify response: ",response)
        });
      }else{
        this.selectedArtists = null;
      }
      console.log("console shows:", this.selectedArtists)
    });

  }
  sortEvents(){
    if(this.events && this.events.length > 0){
      this.events.sort((a: any,b: any)=>{
        if(a.time && b.time){
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA.getTime() - dateB.getTime();
        }else{
          const dateA = new Date(`${a.date} `);
          const dateB = new Date(`${b.date}`);
          return dateA.getTime() - dateB.getTime();
        }
      });
    }; 
  }
  onDetailsBack(){
    this.selectedEventDetails = null;
  }

}
