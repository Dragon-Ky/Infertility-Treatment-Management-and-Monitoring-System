<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MicroserviceRoleCheck
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Lấy Token từ Header
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Unauthenticated. Thiếu Token xác thực.'], 401);
        }

        // Decode phần Payload của JWT (đoạn ở giữa 2 dấu chấm)
        $tokenParts = explode('.', $token);
        if (count($tokenParts) !== 3) {
            return response()->json(['message' => 'Unauthenticated. Token không hợp lệ.'], 401);
        }

        $payload = json_decode(base64_decode($tokenParts[1]), true);

        // Lấy Role ra để kiểm tra
        $userRole = $payload['role'] ?? null;

        // Nếu Role không có trong danh sách được phép -> (Lỗi 403)
        if (!$userRole || !in_array($userRole, $roles)) {
            return response()->json([
                'message' => 'Forbidden. Bạn không có quyền thực hiện hành động này!',
            ], 403);
        }

        // Đạt chuẩn -> Cho đi tiếp
        return $next($request);
    }
}
