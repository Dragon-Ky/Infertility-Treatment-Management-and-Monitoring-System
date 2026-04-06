<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index()
    {
        return Doctor::all();
    }

    public function store(Request $request)
    {
        $doctor = Doctor::create($request->all());
        return response()->json($doctor, 201);
    }

    public function show(string $id)
    {
        return Doctor::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $doctor = Doctor::findOrFail($id);
        $doctor->update($request->all());
        return $doctor;
    }

    public function destroy(string $id)
    {
        Doctor::destroy($id);
        return response()->json(null, 204);
    }
}