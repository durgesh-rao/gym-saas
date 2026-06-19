<?php

namespace Database\Factories;

use App\Models\Gym;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Plan>
 */
class PlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'gym_id' => Gym::inRandomOrder()->value('id'),

            'name' => fake()->randomElement([
                'Monthly',
                'Quarterly',
                'Half Yearly',
                'Yearly',
            ]),

            'duration' => fake()->randomElement([
                30,
                90,
                180,
                365,
            ]),

            'price' => fake()->randomElement([
                999,
                1999,
                2999,
                4999,
            ]),

            'description' => fake()->sentence(),

            'is_active' => fake()->boolean(),
        ];
    }
}
