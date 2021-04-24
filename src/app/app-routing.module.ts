import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { LoginComponent } from './login/login.component';
import { QuizComponent } from './quiz/quiz.component';

const routes: Routes = [{path:'',redirectTo:'catalog',pathMatch:'full'},
{path: 'catalog', component:CatalogComponent },
{path: 'quiz', component:QuizComponent },
{path: 'login', component:LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
