import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { LoadingSpinner } from './shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, LoadingSpinner],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
