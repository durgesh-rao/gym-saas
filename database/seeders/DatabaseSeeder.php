<?php

namespace Database\Seeders;

// use App\Models\User;
use Database\Seeders\GymSeeder;
use Database\Seeders\MemberSeeder;
use Database\Seeders\PlanSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        $this->call([
        UserSeeder::class,
        GymSeeder::class,
        PlanSeeder::class,
        MemberSeeder::class,
        ]);

        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
