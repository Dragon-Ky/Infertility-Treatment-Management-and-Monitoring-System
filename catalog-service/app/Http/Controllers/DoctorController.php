<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    
    public function index()
    {
        return response()->json(
            Doctor::with('schedules')->get()
        );
    }

    
    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name' => 'required|string|max:255',
            'specialization' => 'required|string|max:255',
            'degree' => 'nullable|string|max:255',
            'experience_years' => 'required|integer|min:0',
            'bio' => 'nullable|string',
            'consultation_fee' => 'nullable|numeric|min:0',
            'status' => 'in:active,inactive'
        ]);

        $doctor = Doctor::create($data);

        return response()->json($doctor, 201);
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

        $data = $request->validate([
            'full_name' => 'sometimes|string|max:255',
            'specialization' => 'sometimes|string|max:255',
            'degree' => 'nullable|string|max:255',
            'experience_years' => 'sometimes|integer|min:0',
            'bio' => 'nullable|string',
            'consultation_fee' => 'nullable|numeric|min:0',
            'status' => 'in:active,inactive'
        ]);

        $doctor->update($data);

        return response()->json($doctor);
    }

    
    public function destroy($id)
    {
        Doctor::destroy($id);

        return response()->json([
            'message' => 'Doctor deleted successfully'
        ]);
    }
}