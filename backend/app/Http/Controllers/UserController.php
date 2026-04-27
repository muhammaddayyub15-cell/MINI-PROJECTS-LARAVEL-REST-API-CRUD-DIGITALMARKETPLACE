<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Admin: Create User
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role'     => 'sometimes|in:user,admin',
            'avatar'   => 'sometimes|nullable|string', // base64 image
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role ?? 'user',
            'avatar'   => $request->avatar ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User created',
            'data'    => $user
        ], 201);
    }

    // Admin: List Users with Search + Pagination
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        return response()->json([
            'success' => true,
            'data'    => $query->latest()->paginate(10)
        ]);
    }

    // Admin: Show User Detail (dengan watchlist + reactions)
    public function show($id)
    {
        $user = User::with([
            'watchlist.movie',
            'reactions.movie'
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $user
        ]);
    }

    // Admin: Update User
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'      => 'sometimes|string',
            'email'     => 'sometimes|email|unique:users,email,' . $id,
            'password'  => 'sometimes|min:6',
            'role'      => 'sometimes|in:user,admin',
            'is_active' => 'sometimes|boolean',
            'avatar'    => 'sometimes|nullable|string', // base64 image
        ]);

        $data = $request->only(['name', 'email', 'role', 'is_active', 'avatar']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'User updated',
            'data'    => $user
        ]);
    }

    // Admin: Delete User
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if (auth()->id() == $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete yourself'
            ], 400);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted'
        ]);
    }

    // Admin: Suspend User
    public function suspend($id)
    {
        User::findOrFail($id)->update(['is_active' => false]);
        return response()->json(['success' => true, 'message' => 'User suspended']);
    }

    // Admin: Activate User
    public function activate($id)
    {
        User::findOrFail($id)->update(['is_active' => true]);
        return response()->json(['success' => true, 'message' => 'User activated']);
    }

    // User: Get Own Profile
    public function me(Request $request)
    {
        return response()->json(['success' => true, 'data' => $request->user()]);
    }

    // User: Update Own Profile
    public function updateSelf(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'  => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
        ]);

        $user->update($request->only(['name', 'email']));

        return response()->json(['success' => true, 'message' => 'Profile updated', 'data' => $user]);
    }

    // User: Delete Own Account
    public function deleteSelf(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['success' => true, 'message' => 'Account deleted']);
    }
}