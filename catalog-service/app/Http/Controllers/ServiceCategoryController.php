<?php

namespace App\Http\Controllers;

use App\Models\ServiceCategory;
use Illuminate\Http\Request;

class ServiceCategoryController extends Controller
{
    // =========================
    // GET ALL
    // =========================
    public function index()
    {
        return response()->json(ServiceCategory::all());
    }

    // =========================
    // CREATE (STORE)
    // =========================
    public function store(Request $request)
    {
        $data = $request->validate([

            // thêm unique để chống trùng IVF / IUI
            'name' => 'required|string|unique:service_categories,name',

            // bắt buộc description (tránh NULL)
            'description' => 'required|string'
        ]);

        $category = ServiceCategory::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Created successfully',
            'data' => $category
        ], 201);
    }

    // =========================
    // GET BY ID
    // =========================
    public function show($id)
    {
        return response()->json(ServiceCategory::findOrFail($id));
    }

    // =========================
    // UPDATE
    // =========================
    public function update(Request $request, $id)
    {
        $category = ServiceCategory::findOrFail($id);

        $data = $request->validate([

            // SỬA unique nhưng bỏ qua chính nó khi update
            'name' => 'required|string|unique:service_categories,name,' . $id,

            // SỬA bắt buộc description
            'description' => 'required|string'
        ]);

        // SỬA 5 không dùng request->all() (tránh update bừa)
        $category->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Updated successfully',
            'data' => $category
        ]);
    }

    // =========================
    // DELETE 
    // =========================
    public function destroy($id)
    {
        ServiceCategory::destroy($id);

        return response()->json([
            'success' => true,
            'message' => 'Deleted successfully'
        ]);
    }
}