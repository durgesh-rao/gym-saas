<?php

namespace Database\Factories;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Member>
 */
class MemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $plan = Plan::inRandomOrder()->first();

        $joiningDate = fake()->dateTimeBetween('-6 months', 'now');
        $expireDate = (clone $joiningDate)->modify("+{$plan->duration} days");

        return [
            'gym_id' => $plan->gym_id,
            'plan_id' => $plan->id,
            'name' => fake()->name(),
            'phone' => fake()->regexify('[6-9][0-9]{9}'),
            'address' => fake()->address(),
            'joining_date' => $joiningDate->format('Y-m-d'),
            'expire_date' => $expireDate->format('Y-m-d'),
        ];
    }
}
