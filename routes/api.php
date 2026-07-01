<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GymController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

//login & logout
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

//// for auth(login) user
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/permissions', [AuthController::class, 'permissions']);

    Route::middleware('role:admin')->prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/add', [UserController::class, 'store']);
        Route::get('/fetch/{id}', [UserController::class, 'fetchUser']);
        Route::put('/update/{id}', [UserController::class, 'update']);
        Route::delete('/delete/{id}', [UserController::class, 'destroy']);
    });

    Route::middleware('role:admin,owner')->prefix('members')->group(function () {
        Route::get('/', [MemberController::class, 'index']);
        Route::post('/add', [MemberController::class, 'store']);
        Route::get('/fetch/{id}', [MemberController::class, 'fetchMember']);
        Route::put('/update/{id}', [MemberController::class, 'update']);
        Route::delete('/delete/{id}', [MemberController::class, 'destroy']);
        Route::get('gyms/list', [GymController::class, 'getGyms']);
        Route::get('/plans/', [MemberController::class, 'fetchPlans']);

    });

    Route::middleware('role:admin,owner')->prefix('gyms')->group(function () {
        Route::get('/', [GymController::class, 'index']);
        Route::post('/add', [GymController::class, 'store']);
        Route::get('/fetch/{id}', [GymController::class, 'fetchGym']);
        Route::put('/update/{id}', [GymController::class, 'update']);
        Route::delete('/delete/{id}', [GymController::class, 'destroy']);
    });

    Route::middleware('role:admin,owner')->prefix('plans')->group(function () {
        Route::get('/', [PlanController::class, 'index']);
        Route::post('/add', [PlanController::class, 'store']);
        Route::get('/fetch/{id}', [PlanController::class, 'fetchPlan']);
        Route::put('/update/{id}', [PlanController::class, 'update']);
        Route::delete('/delete/{id}', [PlanController::class, 'destroy']);
        Route::get('gyms/list', [GymController::class, 'getGyms']);
    });

});