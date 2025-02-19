import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts'; // Import ChartsModule

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ChartsModule, // Add ChartsModule here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }