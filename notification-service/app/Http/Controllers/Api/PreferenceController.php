<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NotificationPreference;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PreferenceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $preference = NotificationPreference::firstOrCreate(
            ['user_id' => auth()->id()],
            [
                'appointment_reminder' => true,
                'treatment_reminder' => true,
                'system_notification' => true,
                'email_notification' => true,
                'sms_notification' => true
            ]
        );

        return response()->json($preference);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'appointment_reminder' => 'boolean',
            'treatment_reminder' => 'boolean',
            'system_notification' => 'boolean',
            'email_notification' => 'boolean',
            'sms_notification' => 'boolean'
        ]);

        $preference = NotificationPreference::where('user_id', auth()->id())->firstOrFail();
        $preference->update($validated);

        return response()->json($preference);
    }
}
