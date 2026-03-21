<?php

namespace App\Http\Controllers;

use App\Models\ServiceCategory;
use Illuminate\Http\Request;

class ServiceCategoryController extends Controller
{
    public function index() {
        return ServiceCategory::all();
    }

    public function store(Request $request) {
        $category = ServiceCategory::create($request->all());
        return response()->json($category, 201);
    }

    public function show($id) {
        return ServiceCategory::findOrFail($id);
    }

    public function update(Request $request, $id) {
        $category = ServiceCategory::findOrFail($id);
        $category->update($request->all());
        return $category;
    }

    public function destroy($id) {
        ServiceCategory::destroy($id);
        return response()->json(null, 204);
    }
}