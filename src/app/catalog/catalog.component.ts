import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IQuiz, IUser } from '../interfaces/iquiz';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../services/auth.service';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  public Quizes: IQuiz[] = [];
  public SelectedQuiz:IQuiz;
  public FilteredQuizes: IQuiz[] = [];
  public FilterBy: { id: number, text: string } = { id: 0, text: "Search By" };
  public FilterText: any;
  public CurrentUser:IUser=new user();
  public FilterByData: { id: number, text: string }[] = [
    {
      id: 0,
      text: "Search By"
    },
    {
      id: 1,
      text: "Title"
    },
    {
      id: 2,
      text: "Category"
    },
    {
      id: 3,
      text: "Quiz Number"
    }
  ];
  
  constructor(private quizservice: QuizService,private userservice:AuthService) { }
  SignInHandler($event) {
    this.CurrentUser = $event;
    console.log( this.CurrentUser);
  }

  ngOnInit(): void {
    this.quizservice.GetCatalog()
      .subscribe(data => {
        this.Quizes = data;
        this.FilteredQuizes = data;
      });
       var quizmodal = document.getElementById('quizmodal')
       quizmodal.addEventListener('show.bs.modal', function (event) {
        console.log("model opening...");
      })
      quizmodal.addEventListener('hide.bs.modal', function (event) {
        console.log("model closing...");
      })
  }

  onClick() {

    this.FilteredQuizes = this.FilterQuiz(this.FilterBy.id, this.FilterText);

  }

  Selected(filterby: number) {
    console.log(filterby);
  }

  onKey(event:any)
  {
    this.FilteredQuizes = this.FilterQuiz(this.FilterBy.id, this.FilterText);
  }

  isLogedin():boolean
  {
    //console.log(this.CurrentUser.userid)
    return this.userservice.isLoggedIn(this.CurrentUser.username);
  }

  

  FilterQuiz(filterby: number, filtertext: any): IQuiz[] {
   // console.log("filterby: " + filterby + "filtertext:" + filtertext);
    if ((!filterby) || (!filtertext)) {
     // console.log("either filter or text is not set");
      return this.Quizes
    }
    else {
      return this.Quizes.filter(function (a) {
                
        switch (filterby) {
          case 1:
            return a.title.toLowerCase().indexOf(filtertext.toLowerCase()) > -1
          case 2:
            return a.category.toLowerCase().indexOf(filtertext.toLowerCase()) > -1
          case 3:
            return a.quiznumber == filtertext
          default:
            return (true)

        }

      });
    }
  }

  SelectQuiz(q){
    var selectedquiz = q.getAttribute('data-quiznumber');
    this.SelectedQuiz=this.Quizes.filter(function (a) {return a.quiznumber == selectedquiz})[0];
   }

}

export class user implements IUser
{
  userid!: number;
  username!: string;
  
}
