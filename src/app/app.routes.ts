import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { signupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChangerMdpComponent } from './components/changer-mdp/changer-mdp.component';
import { VerifComponent } from './components/verif/verif.component';
import { CodeComponent } from './components/code/code.component';
import { AjoutComponent } from './components/ajout/ajout.component';
import { GererComponent } from './components/gerer/gerer.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'change', component: ChangerMdpComponent }, // Assurez-vous que le composant existe
  { path: 'Dashboard', component: DashboardComponent },
  { path: 'Ajout', component: AjoutComponent },
  { path: 'gerer', component: GererComponent },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule],
})
export class AppRoutingModule {}
