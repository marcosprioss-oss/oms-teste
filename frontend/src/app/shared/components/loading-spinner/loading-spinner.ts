import { Component } from '@angular/core';
import { Loading } from '../../../core/services/loading';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.css'
})
export class LoadingSpinner {
  constructor(private readonly loader: Loading) { }

  get loading() {
    return this.loader.loading$();
  }
}
