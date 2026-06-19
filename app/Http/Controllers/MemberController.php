<?php

namespace App\Http\Controllers;

use App\Models\Gym;
use App\Models\Member;
use App\Models\Plan;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MemberController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            'gymId' => 'required|exists:gyms,id',
            'planId' => 'required|exists:plans,id',
            'name' => 'required|string|min:3|max:100',
            'phone' => 'required|regex:/^[6-9][0-9]{9}$/',
            'address' => 'required|string|max:255',
            'joiningDate' => 'required|date',
        ]);

        try {
            if (auth()->user()->role === config('constants.roles.owner')) {

                ////owner select only their own gym
                $gym = Gym::where('id', $request->gymId)
                    ->where('user_id', auth()->id())->first();

                if (!$gym) {
                    return response()->json([
                        'message' => 'Invalid gym selected'
                    ], 403);
                }

                // owner select only their own plan
                $plan = Plan::where('id', $request->planId)
                    ->where('gym_id', $request->gymId)
                    ->whereHas('gym', function ($q) {
                        $q->where('user_id', auth()->id());
                    })->first();

                if (!$plan) {
                    return response()->json([
                        'message' => 'Invalid plan selected'
                    ], 403);
                }
            } else {
                //// for admin all plan
                $plan = Plan::find($request->planId);
            }
            $member = Member::create([
                'gym_id' => $request->gymId,
                'plan_id' => $request->planId,
                'name' => $request->name,
                'phone' => $request->phone,
                'address' => $request->address,
                'joining_date' => $request->joiningDate,
                'expire_date' => Carbon::parse($request->joiningDate)->addDays($plan->duration)
            ]);

            return response()->json([
                'status' => 1,
                'message' => 'Member Created',
                'data' => $member
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
            $query = Member::with([
                'gym:id,gym_name',
                'plan:id,name'
            ]);

            if (auth()->user()->role === config('constants.roles.owner')) {
                $query->whereHas('gym', function ($q) {
                    $q->where('user_id', auth()->id());
                });
            }

            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                        ->orWhere('phone', 'like', '%' . $request->search . '%');
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

    public function fetchMember($id)
    {
        try {
            $query = Member::select(
                'id',
                'name',
                'phone',
                'address',
                'plan_id',
                'gym_id',
                'joining_date',
                'expire_date'
            )->where('id', $id);

            if (auth()->user()->role === config('constants.roles.owner')) {
                $query->whereHas('gym', function ($q) {
                    $q->where('user_id', auth()->id());
                });
            }

            $memberData = $query->first();

            if (!$memberData) {
                return response()->json([
                    'message' => 'Member not found'
                ], 404);
            }

            return response()->json([
                'data' => $memberData
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
            'planId' => 'required|exists:plans,id',
            'name' => 'required|string|min:3|max:100',
            'phone' => 'required|regex:/^[6-9][0-9]{9}$/',
            'address' => 'required|string|max:255',
            'joiningDate' => 'required|date',
        ]);

        try {
            $query = Member::where('id', $id);

            if (auth()->user()->role === config('constants.roles.owner')) {

                $query->whereHas('gym', function ($q) {
                    $q->where('user_id', auth()->id());
                });
                ////owner select only their own gym
                $gym = Gym::where('id', $request->gymId)
                    ->where('user_id', auth()->id())->first();

                if (!$gym) {
                    return response()->json([
                        'message' => 'Invalid gym selected'
                    ], 403);
                }
                // owner select only their own plan
                $plan = Plan::where('id', $request->planId)
                    ->where('gym_id', $request->gymId)
                    ->whereHas('gym', function ($q) {
                        $q->where('user_id', auth()->id());
                    })->first();

                if (!$plan) {
                    return response()->json([
                        'message' => 'Invalid plan selected'
                    ], 403);
                }
            } else {
                //// for admin all plan
                $plan = Plan::find($request->planId);
            }

            $member = $query->first();

            if (!$member) {
                return response()->json([
                    'message' => 'Member not found'
                ], 404);
            }

            $member->update([
                'gym_id' => $request->gymId,
                'plan_id' => $request->planId,
                'name' => $request->name,
                'phone' => $request->phone,
                'joining_date' => $request->joiningDate,
                'address' => $request->address,
                'expire_date' => Carbon::parse($request->joiningDate)
                    ->addDays($plan->duration)
            ]);

            return response()->json([
                'status' => 1,
                'message' => 'Member Updated Succsessfully'
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
            $query = Member::where('id', $id);

            if (auth()->user()->role === config('constants.roles.owner')) {
                $query->whereHas('gym', function ($q) {
                    $q->where('user_id', auth()->id());
                });
            }

            $member = $query->first();

            if (!$member) {
                return response()->json([
                    'message' => 'Member not found'
                ], 404);
            }

            $member->delete();
            return response()->json([
                'message' => 'Member Removed'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function fetchPlans(Request $request)
    {

        try {
            $query = Plan::query();

            if ($request->filled('gym_id')) {
                $query->where('gym_id', $request->gym_id);

                if (auth()->user()->role === config('constants.roles.owner')) {

                    $query->whereHas('gym', function ($q) {
                        $q->where('user_id', auth()->id());
                    });
                }
            }

            $plans = $query->get();

            return response()->json([
                'status' => true,
                'data' => $plans
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
