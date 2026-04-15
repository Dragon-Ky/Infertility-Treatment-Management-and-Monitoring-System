<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeviceToken;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DeviceController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => 'required|string',
            'platform' => 'required|in:android,ios,web'
        ]);

        $deviceToken = DeviceToken::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'token' => $validated['token']
            ],
            [
                'platform' => $validated['platform'],
                'is_active' => true
            ]
        );

        return response()->json($deviceToken);
    }

    public function remove(Request $request, string $token): JsonResponse
    {
        DeviceToken::where('user_id', auth()->id())
            ->where('token', $token)
            ->delete();

        return response()->json(['message' => 'Device token removed successfully']);
    }
}
