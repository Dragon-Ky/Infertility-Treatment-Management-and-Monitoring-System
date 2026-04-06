<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index() {
        return Service::all();
    }

    public function store(Request $request) {
        $service = Service::create($request->all());
        return response()->json($service, 201);
    }

    public function show($id) {
        return Service::findOrFail($id);
    }

    public function update(Request $request, $id) {
        $service = Service::findOrFail($id);
        $service->update($request->all());
        return $service;
    }

    public function destroy($id) {
        Service::destroy($id);
        return response()->json(null, 204);
    }
}