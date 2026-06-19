<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            "id" => 1,
            "name" => "test admin",
            "email" => "adminTest@gmail.com",
            "password" => Hash::make("admin@1234"),
            "role" => "admin",
        ]);

        User::create([
            "id" => 2,
            "name" => "test owner",
            "email" => "ownerTest@gmail.com",
            "password" => Hash::make("owner@1234"),
            "role" => "owner",
        ]);
    }
}
