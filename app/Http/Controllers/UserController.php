<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;


class UserController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', User::class);

        try {
            $query = User::query();

            if ($request->search) {
                $query->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
            };

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
        Gate::authorize('create', User::class);

        $request->validate([
            'name' => 'required|string|min:3|max:100',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,owner',
        ]);

        try {
            $user = User::create([
                "name" => $request->name,
                "email" => $request->email,
                "password" => Hash::make($request->password),
                "role" => $request->role,
            ]);

            return response()->json([
                'status' => 1,
                'message' => 'User Created Successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function fetchUser($id)
    {
        $user = User::select(
            'id',
            'name',
            'email',
            'role'
        )->find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        Gate::authorize('view', $user);

        return response()->json([
            'data' => $user
        ]);
    }


    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        Gate::authorize('update', $user);

        $request->validate([
            'name' => 'required|string|min:3|max:100',
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|in:admin,owner',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
        ]);

        try {
            $data = [
                'name' => $request->name,
                'email' => $request->email,
                'role' => $request->role,
            ];

            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->password);
            }

            $user->update($data);

            return response()->json([
                'status' => 1,
                'message' => 'User Updated Succsessfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        Gate::authorize('delete', $user);

        try {
            $user->delete();
            return response()->json([
                'message' => 'User Removed'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
