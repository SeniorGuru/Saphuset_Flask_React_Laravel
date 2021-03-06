<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::get('/team', function () {
    return view('welcome');
});
Route::get('/setting', function () {
    return view('welcome');
});
Route::get('/dashboard', function () {
    return view('welcome');
});
Route::group(['prefix' => 'api'], function () {


    Route::get('/q/{query}', [
        'uses' => 'ApiController@apiParser'
    ]);

    Route::post('/q/{query}', [
        'uses' => 'ApiController@apiParser'
    ]);
});
