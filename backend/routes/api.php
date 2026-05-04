<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\WatchlistController;
use App\Http\Controllers\ReactionController;
use App\Http\Middleware\RoleMiddleware;

// Auth Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Public Movie Routes
Route::get('/movies',       [MovieController::class, 'index']);
Route::get('/movies/{id}',  [MovieController::class, 'show']);

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {

    // Current User Info
    Route::get('/me',    fn (Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    // Watchlist Routes
    Route::get('/watchlist',              [WatchlistController::class, 'index']);
    Route::post('/watchlist/{movieId}',   [WatchlistController::class, 'toggle']);

    // Reaction Routes
    Route::post('/reactions/{movieId}',   [ReactionController::class, 'react']);
    Route::get('/reactions/{movieId}',    [ReactionController::class, 'summary']);

    // User Self-Management
    Route::put('/me',    [UserController::class, 'updateSelf']);
    Route::delete('/me', [UserController::class, 'deleteSelf']);

    // Report broken poster — any logged-in user can trigger this
    // Backend will clear poster_url so it sorts to last page permanently
    Route::post('/movies/{id}/broken-poster', [MovieController::class, 'markBrokenPoster']);

    // Admin Routes
    Route::middleware([RoleMiddleware::class . ':admin'])->group(function () {

        // User Management
        Route::get('/users',          [UserController::class, 'index']);
        Route::get('/users/{id}',     [UserController::class, 'show']);
        Route::post('/users',         [UserController::class, 'store']);
        Route::put('/users/{id}',     [UserController::class, 'update']);
        Route::delete('/users/{id}',  [UserController::class, 'destroy']);

        // ── BARU: Admin lihat watchlist & reactions milik user tertentu ──
        Route::get('/users/{id}/watchlist',  [UserController::class, 'userWatchlist']);
        Route::get('/users/{id}/reactions',  [UserController::class, 'userReactions']);

        // Movie Management
        Route::post('/movies',        [MovieController::class, 'store']);
        Route::put('/movies/{id}',    [MovieController::class, 'update']);
        Route::delete('/movies/{id}', [MovieController::class, 'destroy']);
    });
});