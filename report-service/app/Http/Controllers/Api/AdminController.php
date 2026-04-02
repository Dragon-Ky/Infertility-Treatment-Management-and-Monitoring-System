<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SyncLog;
use App\Services\NiFiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    protected $nifiService;

    public function __construct(NiFiService $nifiService)
    {
        $this->nifiService = $nifiService;
    }

    /**
     * Get data synchronization status.
     */
    public function syncStatus(Request $request): JsonResponse
    {
        try {
            $query = SyncLog::query();

            if ($request->has('source_service')) {
                $query->fromService($request->source_service);
            }

            if ($request->has('status')) {
                $query->withStatus($request->status);
            }

            $syncLogs = $query->orderBy('synced_at', 'desc')
                ->paginate($request->get('per_page', 20));

            $summary = [
                'total_syncs' => SyncLog::count(),
                'successful_syncs' => SyncLog::where('status', 'success')->count(),
                'failed_syncs' => SyncLog::where('status', 'failed')->count(),
                'last_sync' => SyncLog::orderBy('synced_at', 'desc')->first(),
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'logs' => $syncLogs,
                    'summary' => $summary,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get sync status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Trigger data synchronization.
     */
    public function triggerSync(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'source_service' => 'required|in:auth,catalog,appointment,treatment,notification',
                'sync_type' => 'required|string',
            ]);

            $result = $this->nifiService->triggerSync(
                $request->source_service,
                $request->sync_type
            );

            return response()->json([
                'success' => true,
                'message' => 'Data sync triggered successfully',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to trigger data sync',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
