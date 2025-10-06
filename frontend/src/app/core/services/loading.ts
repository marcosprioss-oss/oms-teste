import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Loading {
  loading$ = signal(false);

  show() { this.loading$.set(true); }
  hide() { this.loading$.set(false); }
}
