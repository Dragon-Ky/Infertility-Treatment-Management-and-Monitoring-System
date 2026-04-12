<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ServiceController extends Controller
{
    public function index()
    {
        $cacheKey = "services_all";

        $services = Cache::remember($cacheKey, 600, function () {
            return Service::with('category')->get();
        });

        return response()->json($services);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'service_category_id' => 'required|exists:service_categories,id',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric'
        ]);

        $service = Service::create($data);

        Cache::forget("services_all");

        return response()->json($service, 201);
    }

    public function show($id)
    {
        $cacheKey = "service_" . $id;

        $service = Cache::remember($cacheKey, 600, function () use ($id) {
            return Service::with('category')->find($id);
        });

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found'
            ], 404);
        }

        return response()->json($service);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $data = $request->validate([
            'service_category_id' => 'sometimes|exists:service_categories,id',
            'name' => 'sometimes|string',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric'
        ]);

        $service->update($data);

        Cache::forget("services_all");
        Cache::forget("service_" . $id);

        return response()->json($service);
    }

    
    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        Cache::forget("services_all");
        Cache::forget("service_" . $id);

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully'
        ]);
    }

    
    public function restore($id)
    {
        $service = Service::withTrashed()->findOrFail($id);
        $service->restore();

        Cache::forget("services_all");

        return response()->json([
            'success' => true,
            'message' => 'Service restored successfully',
            'data'    => $service
        ]);
    }

    
    public function forceDelete($id)
    {
        $service = Service::withTrashed()->findOrFail($id);
        $service->forceDelete();

        Cache::forget("services_all");
        Cache::forget("service_" . $id);

        return response()->json([
            'success' => true,
            'message' => 'Service permanently deleted'
        ]);
    }

    
    public function trashed()
    {
        $services = Service::onlyTrashed()->with('category')->get();

        return response()->json([
            'success' => true,
            'data'    => $services
        ]);
    }
}