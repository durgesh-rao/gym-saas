<?php

namespace App\Http\Controllers;

use App\Models\Gym;
use App\Models\Plan;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'gymId' => 'required|exists:gyms,id',
            'planType' => 'required|string|min:3|max:100',
            'duration' => 'required|integer|min:1|max:3650',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
        ]);
        try {
            if (auth()->user()->role === config('constants.roles.owner')) {
                $gym = Gym::where('id', $request->gymId)
                     ->where('user_id', auth()->id())->first();

                if (!$gym) {
                    return response()->json([
                        'message' => 'Invalid gym selected'
                    ], 403);
                }
            }
            
            $plan = Plan::create([
                'gym_id' => $request->gymId,
                'name' => $request->planType,
                'duration' => $request->duration,
                'price' => $request->price,
                'description' => $request->description,
                'is_active' => 1                 //manully
            ]);

            return response()->json([
                'status' => 1,
                'message' => 'Plan Created',
                'data' => $plan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $query = Plan::with('gym:id,gym_name');

            if (auth()->user()->role === config('constants.roles.owner')) {

                $query->whereHas('gym', function ($q) {
                    $q->where('user_id', auth()->id());
                });
            }

            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                        ->orWhere('duration', 'like', '%' . $request->search . '%')
                        ->orWhere('price', 'like', '%' . $request->search . '%');
                });
            }
            return response()->json([
                'data' => $query->paginate(10)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function fetchPlan($id)
    {
        try {
            $query = Plan::select(
                'id',
                'name',
                'duration',
                'price',
                'gym_id',
                'description'
            )->where('id', $id);

            if (auth()->user()->role === config('constants.roles.owner')) {
                $query->whereHas('gym', function ($q) {
                    $q->where('user_id', auth()->id());
                });
            }
            $planData = $query->first();

            if (!$planData) {
                return response()->json([
                    'message' => 'Plan not found'
                ], 404);
            }

            return response()->json([
                'data' => $planData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'gymId' => 'required|exists:gyms,id',
            'planType' => 'required|string|min:3|max:100',
            'duration' => 'required|integer|min:1|max:3650',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
        ]);
        try {
            $query = Plan::where('id', $id);

            if (auth()->user()->role === config('constants.roles.owner')) {
                $query->whereHas('gym', function ($q) {
                    $q->where('user_id', auth()->id());
                });

                ////owner select only their own gym
                $gym = Gym::where('id', $request->gymId)
                    ->where('user_id', auth()->id())
                    ->first();

                if (!$gym) {
                    return response()->json([
                        'message' => 'Invalid gym selected'
                    ], 403);
                }
            }

            $plan = $query->first();

            if (!$plan) {
                return response()->json([
                    'message' => 'Plan not found'
                ], 404);
            }
            $plan->update([
                'gym_id' => $request->gymId,
                'name' => $request->planType,
                'duration' => $request->duration,
                'price' => $request->price,
                'description' => $request->description,
            ]);

            return response()->json([
                'status' => 1,
                'message' => 'Plan Updated Succsessfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $query = Plan::where('id', $id);

            if (auth()->user()->role === config('constants.roles.owner')) {
                $query->whereHas('gym', function ($q) {
                    $q->where('user_id', auth()->id());
                });
            }

            $plan = $query->first();
            if (!$plan) {
                return response()->json([
                    'message' => 'Plan not found'
                ], 404);
            }

            $plan->delete();
            return response()->json([
                'message' => 'plan Removed'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
