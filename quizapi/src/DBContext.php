<?php

declare(strict_types=1);

namespace QuizApI\DBContext;

use FastRoute\DataGenerator;
use PDO;
use PDOException;

class DBContext
{
    function __construct()
    {
    }

    private static function connect()
    {
        $dbhost = "127.0.0.1";
        $dbuser = "root";
        $dbpass = "";
        $dbname = "quizcontext";
        $db = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    }

    //Login()
    public static function Login($username, $password)
    {


        $sql = "SELECT userid,username,firstname,lastname,password FROM user where username='$username'";
        try {
            $db = DBContext::connect();
            $stmt = $db->query($sql);
            $user = $stmt->fetchAll(PDO::FETCH_OBJ);

            $success = password_verify($password, $user[0]->password);
            unset($user[0]->password);
            if ($success)
                $verifieduser = $user[0];
            else
                $verifieduser = null;

            $db = null;
        } catch (PDOException $e) {
            throw ($e);
        }
        return json_encode($verifieduser);
    }

    //GetCatelog() //gets [] of quiz
    public static function GetCatalog()
    {

        $sql = "SELECT `quizid` as `quiznumber`,`title`,`category`,`description`,  case WHEN user.firstname is NOT null THEN CONCAT(user.firstname,' ', user.lastname) ELSE user.username End as `creator`, (select count(question.quid) from question WHERE question.quizid=quiz.quizid) as `numberofquestions` FROM `quiz` join user on quiz.creator=user.userid order by quizid";
        try {
            $db = DBContext::connect();
            $stmt = $db->query($sql);
            $catalog = $stmt->fetchAll(PDO::FETCH_OBJ);
            $db = null;
        } catch (PDOException $e) {
            throw ($e);
        }
        return json_encode($catalog);
    }

    public static function GetUserAttempt($userid, $quizid)
    {

        try {
            $db = DBContext::connect();
            $sql = "delete from quizsession where userid='$userid'";
            $db->prepare($sql)->execute();
            $sql = "SELECT IFNULL(max(`attemptid`),0)+1 as `attemptnumber` FROM `userattempt` where userid=$userid and quizid=$quizid";
            $stmt = $db->query($sql);
            $attemptnumber = $stmt->fetch(PDO::FETCH_NUM);
            $db = null;
        } catch (PDOException $e) {
            throw ($e);
        }
        return json_encode($attemptnumber);
    }
    //CreateMockData (if environment is dev only schema in dev, mockdata may be read from json file)

    //GetQuestion(Quizid,Questionnumber)

    public static function GetQuestion($userid, $quizid)
    {

        try {
            $db = DBContext::connect();

            //Find next question
            $nextqid = self::GetNextQuestionID($userid, $quizid, $db);
            $sql = "SELECT * from question where quid='$nextqid' and quizid='$quizid'";
            $stmt = $db->query($sql);
            $questions = $stmt->fetchAll(PDO::FETCH_OBJ);
            $dto = array();
            // echo ("<pre>");
            foreach ($questions as $q) {
                $dto["questionnumber"] = $q->quid;
                $dto["question"] = $q->question;
                empty($q->optionA) ?: $dto["options"]["A"] = $q->optionA;
                empty($q->optionB) ?: $dto["options"]["B"] = $q->optionB;
                empty($q->optionC) ?: $dto["options"]["C"] = $q->optionC;
                empty($q->optionD) ?: $dto["options"]["D"] = $q->optionD;
                empty($q->optionE) ?: $dto["options"]["E"] = $q->optionE;
            }

            //echo ("<pre/>");
            //print_r($dto);
            $db = null;
        } catch (PDOException $e) {
            throw ($e);
        }
        return json_encode($dto);
    }

    public static function SaveUserAttempt($userattempt)
    {
        $db = DBContext::connect();
        $userid = 0;
        $quizid = 0;
        $attemptid = 0;
        foreach ($userattempt as $value) {
            $userid = $value['userid'];
            $quizid = $value['quizid'];
            $attemptid = $value['attemptid'];
            $data = [
                'userid' => $value['userid'],
                'quizid' => $value['quizid'],
                'attemptid' => $value['attemptid'],
                'quid' => $value['questionid'],
                'answer' => $value['useranswer'],
                'iscorrect' => false,
                'attemptedon' => date("Y/m/d h:i:sa")
            ];
            //print_r( $data);
            $sql = "INSERT INTO `userattempt` (`userid`, `quizid`,`attemptid`, `quid`,`answer`,`iscorrect`,`attemptedon`) VALUES (:userid, :quizid,:attemptid, :quid,:answer,:iscorrect,:attemptedon)";
            $db->prepare($sql)->execute($data);
        }

        //update correctly answered qustion
        $sql = "update `userattempt` u inner join question q on u.quid=q.quid  set u.iscorrect=  (u.answer=q.answer)  WHERE u.userid='$userid' and q.quizid='$quizid' and u.attemptid='$attemptid'";

        $db->prepare($sql)->execute();

        //clear quiz session
        $sql = "delete from quizsession where userid='$userid'";
        $db->prepare($sql)->execute();

        //return result
        $sql = "SELECT COUNT(*) FROM `userattempt` WHERE iscorrect=1 and  userid='$userid' and quizid='$quizid' and attemptid='$attemptid'";
        $correctcount = $db->query($sql)->fetch(PDO::FETCH_NUM);
        //print_r($correctcount);
        return json_encode($correctcount[0]);
    }

    public static function Abort($user)
    {
        $db = DBContext::connect();
        $userid = $user['userid'];
        $sql = "delete from quizsession where userid='$userid'";
        $db->prepare($sql)->execute();
    }

    //SaveQuizAttempt(UserId, Quizid, Qustionid, Answer)
    private static function GetNextQuestionID($userid, $quizid, $db)
    {
        //Questions in quiz
        $sqtn = "select quid from question where quizid='$quizid' order by quid asc";
        $stmt = $db->query($sqtn);
        $questions = $stmt->fetchall(PDO::FETCH_COLUMN);
        // echo("<pre>");
        //print_r($questions);

        $sql = "SELECT * from quizsession where userid='$userid'";
        $stmt = $db->query($sql);
        $quizsession = $stmt->fetch(PDO::FETCH_OBJ);
        // print_r($quizsession);
        if ($quizsession) {
            $nextquid = $quizsession->nextquestion;
            $currentindx = array_search($nextquid, $questions, true);
            if (count($questions) - 1 > $currentindx) {
                $data = [
                    'userid' => $userid,
                    'quizid' => $quizid,
                    'nextquestion' => $questions[$currentindx + 1],
                ];
                $sql = "UPDATE quizsession SET nextquestion=:nextquestion WHERE userid=:userid and quizid=:quizid";

                $stmt = $db->prepare($sql)->execute($data);
            }
            return $quizsession->nextquestion;
        } else {
            if (count($questions)  > 1) {
                $nextquestion = $questions[1];
                $data = [
                    'userid' => $userid,
                    'quizid' => $quizid,
                    'nextquestion' => $nextquestion
                ];
                $sql = "INSERT INTO `quizsession` (`userid`, `quizid`, `nextquestion`) VALUES (:userid, :quizid, :nextquestion)";

                $stmt = $db->prepare($sql);
                $stmt->execute($data);
            }
            return $questions[0];
        }
    }
}
