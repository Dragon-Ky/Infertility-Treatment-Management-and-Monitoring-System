<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index()
    {
        return response()->json(Doctor::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'specialization' => 'required|string',
            'experience' => 'required|integer'
        ]);

        return response()->json(Doctor::create($data), 201);
    }

    public function show($id)
    {
        return response()->json(
            Doctor::with('schedules')->findOrFail($id)
        );
    }

    public function update(Request $request, $id)
    {
        $doctor = Doctor::findOrFail($id);

        $doctor->update($request->all());

        return response()->json($doctor);
    }

    public function destroy($id)
    {
        Doctor::destroy($id);

        return response()->json(['message' => 'Deleted']);
    }
}