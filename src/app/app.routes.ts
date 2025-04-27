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

export const routes: Routes = [
  { path: 'LogIn', component: LoginComponent },
  { path: 'SignUp', component: SignupComponent },
  { path: 'Change', component: ChangerMdpComponent }, // Assurez-vous que le composant existe
  { path: 'Dashboard', component: DashboardComponent },
  { path: 'Ajout', component: AjoutComponent },
  { path: 'Gerer', component: GererComponent },
  { path: 'Code', component: CodeComponent },
  { path: 'Verif', component: VerifComponent },
  { path: '', redirectTo: 'LogIn', pathMatch: 'full' }
];
@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRouingModule {}
