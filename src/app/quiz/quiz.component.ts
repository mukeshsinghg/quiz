import { Component, Input, OnInit } from '@angular/core';
import { IQuestion, IQuiz, IUser, IUserAttempt } from '../interfaces/iquiz';
import { QuizService } from '../services/quiz.service';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  @Input() Quiz: IQuiz;
  @Input() User: IUser;
  public Question: any;
  public ButtonText: string = "Next";
  public Result;
  public ValidationMessage;
  //public CurrentQuestion: IQuestion;
  private _useranswer: IUserAttempt[] = [];
  public AttemptNumber: number;
  public Selectedanswer;
  public QuestDispNum: number = 1;



  constructor(private quizservice: QuizService) { }

  ngOnInit(): void {
    this.quizservice.GetUsetAttempt(this.User.userid, this.Quiz.quiznumber).subscribe(
      x => {
        this.AttemptNumber = x;
        console.log(this.AttemptNumber);
        this.quizservice.GetQuestion(this.User.userid, this.Quiz.quiznumber).subscribe(
          qtn => { this.Question = qtn; });
      });
    if (this.Quiz.numberofquestions <= 1) this.ButtonText = "Submit";
    var quizmodal = document.getElementById('quizmodal')
    quizmodal.addEventListener('show.bs.modal', function (event) {
      console.log("login model opening...");
    });
    quizmodal.addEventListener('hide.bs.modal', function (event) {
      console.log("closing...", this.ButtonText);
      if ((!(this.ButtonText)) || this.ButtonText.toLowerCase() == 'submit')
        var userinput = confirm("All progress will be lost, are you sure you want to quit?")

      if (!userinput) {
        event.preventDefault();
      }
      else {

        this.QuestDispNum = 1;
        this._useranswer = [];
        this.Selectedanswer = null;
        this.ValidationMessage = null;
        this.Question = null;

      }

    });


  }


  onAnswerSelectionChange(o) {
    console.log(o);
    //this.Selectedanswer = o;

  }

  onNext() {
    //change button text
    if (this.ButtonText.toLocaleLowerCase() == 'close') {


      return;
    }
    if (!this.Selectedanswer) {
      this.ValidationMessage = "Please select your answer.";
      return;
    }
    if (this.QuestDispNum == this.Quiz.numberofquestions - 1) {
      this.ButtonText = "Submit";
    }

    this._useranswer.push({ userid: this.User.userid, quizid: this.Quiz.quiznumber, attemptid: this.AttemptNumber[0], questionid: this.Question.questionnumber, useranswer: this.Selectedanswer });
    this.quizservice.GetQuestion(this.User.userid, this.Quiz.quiznumber).subscribe(
      qtn => {
        this.Question = qtn;
        console.log("question options", qtn.options.A);
      });
    this.Selectedanswer = null;
    this.ValidationMessage = null;

    if (this.QuestDispNum == this.Quiz.numberofquestions) {
      //save quiz 
      console.log(this._useranswer);
      this.quizservice.PostUserAttempt(this._useranswer).subscribe(
        res => this.Result = res
      );

      this.ButtonText = "Close"
      return;
    }
    this.QuestDispNum++;


  }

}

export class UserAttempt implements IUserAttempt {
  attemptid: number;
  userid: number;
  quizid: number;
  questionid: number;
  useranswer: string;
}
