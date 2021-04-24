export interface IQuiz {
    quiznumber:number,
    title:string,
    creator:string,
    description:String,
    category:string,
    numberofquestions:number
}

export interface Icategory {
    categoryid:number,
    title:string,
    description:String
}

export interface IUser {
    userid:number,
    username:string
}

export interface IQuestion {
    questionnumber:number,
    questionid:number,
    question:string,
    options:IOption
}

export interface IOption {
    A:string,
    B:string,
    C:string,
    D:string,
    E:string
}

export interface IUserAttempt {
    userid:number,
    quizid:number,
    attemptid:number,
    questionid:number,
    useranswer: string
}
