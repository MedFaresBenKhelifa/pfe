import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChangerMdpComponent } from './components/changer-mdp/changer-mdp.component';
import { AjoutComponent } from './components/ajout/ajout.component';

import { NgModule } from '@angular/core';
import { GererComponent } from './components/gerer/gerer.component';
import { CodeComponent } from './components/code/code.component';
import { VerifComponent } from './components/verif/verif.component';

import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'LogIn', component: LoginComponent },
  { path: 'SignUp', component: SignupComponent },
  { path: 'Change', component: ChangerMdpComponent },
  { path: 'Dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, 
  { path: 'Ajout', component: AjoutComponent, canActivate: [AuthGuard] },         
  { path: 'Gerer', component: GererComponent, canActivate: [AuthGuard] },         
  { path: 'Code', component: CodeComponent },
  { path: 'Verif', component: VerifComponent },
  { path: '', redirectTo: 'LogIn', pathMatch: 'full' }
];
