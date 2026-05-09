<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServicePricing;
use Illuminate\Http\Request;

class ServicePricingController extends Controller
{
   
    public function getByService($serviceId)
    {
        $service = Service::with('pricings')->find($serviceId);

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $service->pricings
        ]);
    }

   
    public function store(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $pricing = ServicePricing::create([
            'service_id' => $request->service_id,
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'is_active' => $request->is_active ?? true
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pricing created successfully',
            'data' => $pricing
        ]);
    }

    
    public function update(Request $request, $id)
    {
        $pricing = ServicePricing::find($id);

        if (!$pricing) {
            return response()->json([
                'success' => false,
                'message' => 'Pricing not found'
            ], 404);
        }

        $pricing->update($request->only([
            'name',
            'price',
            'description',
            'is_active'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Pricing updated successfully',
            'data' => $pricing
        ]);
    }

    
    public function destroy($id)
    {
        $pricing = ServicePricing::find($id);

        if (!$pricing) {
            return response()->json([
                'success' => false,
                'message' => 'Pricing not found'
            ], 404);
        }

        $pricing->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pricing deleted successfully'
        ]);
    }
}