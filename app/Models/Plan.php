<?php

namespace App\Models;

use App\Models\Gym;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'gym_id',
        'name',
        'duration',
        'price',
        'description',
        'is_active'
    ];


    public function gym()
    {
        return $this->belongsTo(Gym::class);
    }

    // public function member()
    // {
    //     return $this->hasMany(Member::class);
    // }
}
