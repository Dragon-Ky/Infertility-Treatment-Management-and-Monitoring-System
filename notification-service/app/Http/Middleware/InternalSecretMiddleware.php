<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InternalSecretMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $secret = config('services.gateway.internal_secret');
        $headerSecret = $request->header('X-Internal-Secret');

        if (!$headerSecret || $headerSecret !== $secret) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: Invalid internal secret.'
            ], 401);
        }

        return $next($request);
    }
}
