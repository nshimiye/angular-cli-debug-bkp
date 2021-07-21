import { Controller } from '@supertype';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CpIconModule } from '../../common/cp-icon/cp-icon/cp-icon.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CpIconModule
  ],
  providers: [{
    provide: Controller,
    useFactory: () => null
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
