<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Lấy vai trò người dùng từ Header do Gateway truyền xuống
        $userRole = $request->header('X-User-Role'); 

        if (!$userRole || !in_array($userRole, $roles)) {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập chức năng này.'
            ], 403);
        }

        return $next($request);
    }
}