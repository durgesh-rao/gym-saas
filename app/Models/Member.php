<?php

namespace App\Models;

use App\Models\Gym;
use App\Models\Plan;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Member extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'gym_id',
        'plan_id',
        'name',
        'phone',
        'address',
        'joining_date',
        'expire_date'
    ];


    public function gym()
    {
        return $this->belongsTo(Gym::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
