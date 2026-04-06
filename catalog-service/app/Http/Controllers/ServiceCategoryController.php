<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;

class ServiceCategoryController extends Controller
{
    
    public function index()
    {
        return Cache::remember('service_categories', 600, function () {
            return ServiceCategory::all();
        });
    }

    
    public function store(Request $request)
    {
        $category = ServiceCategory::create($request->all());

        
        Cache::forget('service_categories');

        return response()->json($category, 201);
    }

    
    public function show($id)
    {
        return Cache::remember("service_category_$id", 600, function () use ($id) {
            return ServiceCategory::findOrFail($id);
        });
    }

    
    public function update(Request $request, $id)
    {
        $category = ServiceCategory::findOrFail($id);
        $category->update($request->all());

        
        Cache::forget('service_categories');
        Cache::forget("service_category_$id");

        return $category;
    }

    
    public function destroy($id)
    {
        ServiceCategory::destroy($id);

        
        Cache::forget('service_categories');
        Cache::forget("service_category_$id");

        return response()->json(null, 204);
    }
}