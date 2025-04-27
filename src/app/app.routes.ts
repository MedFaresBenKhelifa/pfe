import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChangerMdpComponent } from './components/changer-mdp/changer-mdp.component';
import { AjoutComponent } from './components/ajout/ajout.component';
import { NgModel } from '@angular/forms';
import { NgModule } from '@angular/core';
import { GererComponent } from './components/gerer/gerer.component';
import { CodeComponent } from './components/code/code.component';
import { VerifComponent } from './components/verif/verif.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'change', component: ChangerMdpComponent }, // Assurez-vous que le composant existe
  { path: 'Dashboard', component: DashboardComponent },
  { path: 'Ajout', component: AjoutComponent },
  { path: 'gerer', component: GererComponent },
  { path: 'code', component: CodeComponent },
  { path: 'verif', component: VerifComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRouingModule {}
