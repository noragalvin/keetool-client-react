<?php


$routes = function () {
    Route::get('/', 'BeeSchoolController@index');
    Route::get('blogs', 'BeeSchoolController@blogs');
    Route::get('blog/post/{id}', 'BeeSchoolController@post');
};

Route::group(['middleware' => 'web', 'domain' => 'beeschool.test', 'namespace' => 'Modules\BeeSchool\Http\Controllers'], $routes);
Route::group(['middleware' => 'web', 'domain' => 'mineditor.com', 'namespace' => 'Modules\BeeSchool\Http\Controllers'], $routes);
