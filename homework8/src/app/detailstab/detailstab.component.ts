import { Component, Output, Input, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { MapMarker } from '@angular/google-maps';
import { ApiService } from '../services/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Carousel } from 'bootstrap';
@Component({
  selector: 'app-detailstab',
  templateUrl: './detailstab.component.html',
  styleUrls: ['./detailstab.component.css']
})
export class DetailstabComponent implements OnInit, AfterViewInit{
  @Input() details: any;
  @Input() venue: any;
  @Input() artists: any;
  @Output() goBack = new EventEmitter<void>();
  expandState: boolean = false;
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  latitude: any;
  longitude: any;
  showModal: boolean = false;
  mapDisplay = 'none';
  zoom = 15;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
  mapTypeId: 'hybrid',
  zoomControl: false,
  scrollwheel: false,
  disableDoubleClickZoom: true,
  maxZoom: 15,
  minZoom: 8,
  };
  favoriteStatus!: boolean;
  favoriteId: number | null = null;
  detailsWithId: any;
  constructor(
    private apiService: ApiService,
    private elementRef: ElementRef
  ){}
  ngOnInit():void{
    this.favoriteStatus = this.isFavorite();
  }
  onBackClick(){
    this.goBack.emit();
  }
  getTwitterShareLink(): string {
    const baseUrl = 'https://twitter.com/intent/tweet';
    const text = encodeURIComponent('Check out this event!');
    const eventUrl = encodeURIComponent(this.details.url);
    return `${baseUrl}?text=${text}&url=${eventUrl}`;
  }
  getFacebookShareLink(): string {
    const baseUrl = 'https://www.facebook.com/sharer/sharer.php';
    const eventUrl = encodeURIComponent(this.details.url);
    return `${baseUrl}?u=${eventUrl}`;
  }
  toggleMore(event: MouseEvent, element: HTMLElement | null) {
    if (element) {
      event.preventDefault();
      const infoContent = element.previousElementSibling as HTMLElement;
      infoContent.classList.toggle('expanded');
      const belowTab = document.getElementById("tab3") as HTMLElement;
      if (infoContent.classList.contains('expanded')) {
        belowTab.style.height = 'auto';
      } else {
        belowTab.style.height = '';
      }
      this.expandState = !this.expandState;
      element.innerText = this.expandState ? 'Show Less' : 'Show More'
    }
  }
  
  
  showMap(): void {
    this.showModal = true;
    this.latitude = this.venue.lat;
    this.longitude = this.venue.lng;
    this.center = {
      lat: this.latitude,
      lng: this.longitude,
    }
    this.mapDisplay = 'block';
  }
  closeMap(): void{
    this.mapDisplay = 'none';
    this.showModal = false;
  }
  // getArtists(){
  //   console.log(this.details.musicArtists);
  //   if(this.details.musicArtists){
  //     this.apiService.getArtistsInfo(this.details.musicArtists).subscribe((response)=>{
  //       this.artists = response;
  //       console.log("spotify response: ",response)
  //     });
  //   }else{
  //     this.artists = null;
  //   }
  // }
  ngAfterViewInit() {
    const carouselElement = this.elementRef.nativeElement.querySelector('#carouselExampleControls');
    new Carousel(carouselElement);
  }
  isFavorite(){
    const favoriteCounter = parseInt(localStorage.getItem('favoriteCounter') || '0');
    for(let i = 1; i <= favoriteCounter; i++){
      const favoriteId = `favorite_${i}`;
      const storedItem = localStorage.getItem(favoriteId);
      if(storedItem){
        const storeDetailsWithId = JSON.parse(storedItem);
        const storedDetails = storeDetailsWithId.details;
        const id = storeDetailsWithId.id;
        if(JSON.stringify(storedDetails) === JSON.stringify(this.details)){
          this.favoriteId = id;
          return true;
        }
      }
    }
    return false;
  }
  toggleFavorite(){
    this.favoriteStatus = this.isFavorite();
    if(!this.favoriteStatus){
      const favoriteCounter = parseInt(localStorage.getItem('favoriteCounter')|| '0') + 1;
      localStorage.setItem('favoriteCounter',favoriteCounter.toString());
      const favoriteId = `favorite_${favoriteCounter}`;
      this.detailsWithId = {details:this.details,id:favoriteCounter}
      alert('Added to favorites');
      localStorage.setItem(favoriteId,JSON.stringify(this.detailsWithId));
      this.favoriteStatus = true;
      this.favoriteId = favoriteCounter;
    }else{
      if(this.favoriteId){
        let favoriteCounter = parseInt(localStorage.getItem('favoriteCounter')||'0');
        alert('Removed from favorites');
        const idKey = `favorite_${this.favoriteId}`
        localStorage.removeItem(idKey);
        for(let i = this.favoriteId+1;i<=favoriteCounter;i++){
          const itemId = `favorite_${i}`;
          const storedItem = localStorage.getItem(itemId);
          if(storedItem){
            const storedDetails = JSON.parse(storedItem);
            const newId = `favorite_${i-1}`;
            const storedDetailswithId = {details:storedDetails.details,id:i-1};
            localStorage.removeItem(itemId);
            localStorage.setItem(newId,JSON.stringify(storedDetailswithId));
          }
        }
        if(favoriteCounter != 0){
          favoriteCounter -= 1;
          localStorage.setItem('favoriteCounter',favoriteCounter.toString());
        }
        this.favoriteStatus = false;
        this.favoriteId = null;
      }
    }
  }
}
