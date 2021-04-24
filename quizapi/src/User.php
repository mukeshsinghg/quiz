<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use QuizApI\DBContext\DBContext;

$app->post('/api/login', function (Request $request, Response $response, array $args) {
    $parsedBody = $request->getParsedBody();
    $username = $parsedBody['username'];
    $password = $parsedBody['password'];

    $response->getBody()->write(DBContext::Login($username, $password));
    return $response;/*->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');*/
});
