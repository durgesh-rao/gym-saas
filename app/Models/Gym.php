<?php

namespace App\Models;

use App\Models\Member;
use App\Models\Plan;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Gym extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'gym_name',
        'gym_address',
    ];

    public function members()
    {
        return $this->hasMany(Member::class);
    }

    public function plans()
    {
        return $this->hasMany(Plan::class);
    }
}
