// import { Controller } from '../controllers/Controller';
import { Controller } from '@supertype';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mytestapp';
  a: Controller
  // ba:number ='hi';
}