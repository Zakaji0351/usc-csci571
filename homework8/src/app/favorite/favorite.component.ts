import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent {
  favoriteEvents: any[] = [];
  constructor(){}
  ngOnInit():void {
    this.loadFavorite();
  }
  loadFavorite(): void{
    this.favoriteEvents = [];
    const favoriteCounter = parseInt(localStorage.getItem('favoriteCounter') || '0');
    for(let i = 1; i <= favoriteCounter; i++){
      const favoriteId = `favorite_${i}`;
      const StoredItem = localStorage.getItem(favoriteId);
      if(StoredItem){
        const storedDetailswithId = JSON.parse(StoredItem);
        this.favoriteEvents.push(storedDetailswithId);
      }
    }
  }
  deleteEvent(favoriteId: number): void{
    let favoriteCounter = parseInt(localStorage.getItem('favoriteCounter')||'0');
    alert('Removed from favorites');
    localStorage.removeItem(`favorite_${favoriteId}`);
    for(let i = favoriteId+1;i<=favoriteCounter;i++){
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
    this.loadFavorite();
  }
}
