<?php

namespace App\Http\Controllers;

use App\Models\Gym;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GymController extends Controller
{
    public function index(Request $request)
    {

        try {

            $query = Gym::query();

            if (auth()->user()->role === config('constants.roles.owner')) {
                $query->where('user_id', auth()->id());
            }

            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('gym_name', 'like', '%' . $request->search . '%')
                        ->orWhere('gym_address', 'like', '%' . $request->search . '%');
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

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:3|max:100',
            'address' => 'required|string|min:3|max:255',
        ]);
        try {
            $userId = Auth::id();

            $gym = Gym::create([
                'user_id' => $userId,
                'gym_name' => $request->name,
                'gym_address' => $request->address,
            ]);

            return response()->json([
                'status' => 1,
                'message' => 'Gym Created Successfully',
                'data' => $gym
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function fetchGym($id)
    {
        try {

            $query = Gym::select(
                'id',
                'gym_name',
                'gym_address'
            )->where('id', $id);

            if (auth()->user()->role === config('constants.roles.owner')) {
                $query->where('user_id', auth()->id());
            }

            $gymData = $query->first();

            if (!$gymData) {
                return response()->json([
                    'message' => 'Gym not found'
                ], 404);
            }

            return response()->json([
                'data' => $gymData
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
            'name' => 'required|string|min:3|max:100',
            'address' => 'required|string|min:3|max:255',
        ]);
        try {

            $query = Gym::where('id', $id);

            if (auth()->user()->role === config('constants.roles.owner')) {
                $query->where('user_id', auth()->id());
            }
            $gym = $query->first();

            if (!$gym) {
                return response()->json([
                    'message' => 'Gym not found'
                ], 404);
            }
            $gym->update([
                'gym_name' => $request->name,
                'gym_address' => $request->address
            ]);

            return response()->json([
                'status' => 1,
                'message' => 'Gym Updated Succsessfully'
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

            $query = Gym::where('id', $id);

            if (auth()->user()->role === config('constants.roles.owner')) {
                $query->where('user_id', auth()->id());
            }
            $gym = $query->first();

            if (!$gym) {
                return response()->json([
                    'message' => 'Gym not found'
                ], 404);
            }

            $gym->delete();
            return response()->json([
                'message' => 'Gym Removed'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getGyms()
    {
        $query = Gym::select('id', 'gym_name');

        if (auth()->user()->role === config('constants.roles.owner')) {
            $query->where('user_id', auth()->id());
        }
        $gyms = $query->get();
        return response()->json([
            'data' => $gyms
        ]);
    }
}
