import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts'; // Import ChartsModule
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GererComponent } from './components/gerer/gerer.component';
import { UserEditModalComponent } from './components/user-edit-modal/user-edit-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    GererComponent,
    UserEditModalComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    ChartsModule, // Add ChartsModule here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }