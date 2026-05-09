<?php

namespace App\Http\Controllers;

use App\Models\ServiceCategory;
use Illuminate\Http\Request;

class ServiceCategoryController extends Controller
{
    public function index()
    {
        return response()->json(ServiceCategory::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string'
        ]);

        return response()->json(ServiceCategory::create($data), 201);
    }

    public function show($id)
    {
        return response()->json(ServiceCategory::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $category = ServiceCategory::findOrFail($id);

        $category->update($request->all());

        return response()->json($category);
    }

    public function destroy($id)
    {
        ServiceCategory::destroy($id);

        return response()->json(['message' => 'Deleted']);
    }
}