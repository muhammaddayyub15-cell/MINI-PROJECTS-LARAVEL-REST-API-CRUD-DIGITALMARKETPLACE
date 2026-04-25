<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    // Middleware untuk cek role user (admin, user)
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Pastikan user login
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        // Check Akun Aktif
        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Account is disabled'
            ], 403);
        }

        // Check Role
        if (!in_array($user->role, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden: insufficient permission'
            ], 403);
        }

        return $next($request);
    }
}