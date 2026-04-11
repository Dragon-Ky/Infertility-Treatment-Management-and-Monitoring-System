<?php

namespace App\Http\Controllers;

use App\Models\DoctorSchedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        return response()->json(
            DoctorSchedule::with('doctor')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'day_of_week' => 'required|string',
            'start_time' => 'required',
            'end_time' => 'required',
            'is_available' => 'boolean'
        ]);

        return response()->json(DoctorSchedule::create($data), 201);
    }

    public function show($id)
    {
        return response()->json(
            DoctorSchedule::with('doctor')->findOrFail($id)
        );
    }

    public function update(Request $request, $id)
    {
        $schedule = DoctorSchedule::findOrFail($id);

        $schedule->update($request->all());

        return response()->json($schedule);
    }

    public function destroy($id)
    {
        DoctorSchedule::destroy($id);

        return response()->json(['message' => 'Deleted']);
    }
}