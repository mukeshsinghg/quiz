<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use QuizApI\DBContext\DBContext;

require __DIR__ . '/../vendor/autoload.php';

$app->get('/api/catalog', function (Request $request, Response $response,) {
   
    $response->getBody()->write(DBContext::GetCatalog());
    return $response;
});

$app->get('/api/question/{userid}/{quiznumber}', function (Request $request, Response $response,array $args) {
    $userid = $args['userid'];
    $quizid = $args['quiznumber'];
    $response->getBody()->write(DBContext::GetQuestion($userid,$quizid));
    return $response;
});

$app->post('/api/userattempt', function (Request $request, Response $response) {
    $parsedBody = $request->getParsedBody();
    //print_r($parsedBody);
    $response->getBody()->write(DBContext::SaveUserAttempt($parsedBody));
    return $response;
});

$app->get('/api/userattempt/{userid}/{quiznumber}', function (Request $request, Response $response,array $args) {
    $userid = $args['userid'];
    $quizid = $args['quiznumber'];
    $response->getBody()->write(DBContext::GetUserAttempt($userid,$quizid));
    return $response;
});

$app->post('/api/abort', function (Request $request, Response $response) {
    $parsedBody = $request->getParsedBody();
    //print_r($parsedBody);
    $response->getBody()->write(DBContext::Abort($parsedBody));
    return $response;
});

