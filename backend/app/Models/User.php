<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use App\Models\Watchlist;
use App\Models\Reaction;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    // ✅ RELATION: WATCHLIST
    public function watchlist()
    {
        return $this->hasMany(Watchlist::class);
    }

    // ✅ RELATION: REACTIONS
    public function reactions()
    {
        return $this->hasMany(Reaction::class);
    }
}