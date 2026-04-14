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

        // =========================
        // 🚨 [ADD] CHECK TRÙNG LỊCH
        // =========================
        $exists = DoctorSchedule::where('doctor_id', $data['doctor_id'])
            ->where('day_of_week', $data['day_of_week'])
            ->where(function ($query) use ($data) {
                $query->where('start_time', '<', $data['end_time'])
                      ->where('end_time', '>', $data['start_time']);
            })
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Schedule bị trùng giờ!'
            ], 400);
        }
        // =========================
        // END CHECK
        // =========================

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

       
        $data = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'day_of_week' => 'required|string',
            'start_time' => 'required',
            'end_time' => 'required',
            'is_available' => 'boolean'
        ]);
        

        // =========================
        // CHECK TRÙNG LỊCH
        // =========================
        $exists = DoctorSchedule::where('doctor_id', $data['doctor_id'])
            ->where('day_of_week', $data['day_of_week'])
            ->where('id', '!=', $id) 
            ->where(function ($query) use ($data) {
                $query->where('start_time', '<', $data['end_time'])
                      ->where('end_time', '>', $data['start_time']);
            })
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Schedule bị trùng giờ!'
            ], 400);
        }
        

        // sửa từ update($request->all()) → update($data) để đồng bộ validate
        $schedule->update($data);

        return response()->json($schedule);
    }

    public function destroy($id)
    {
        DoctorSchedule::destroy($id);

        return response()->json(['message' => 'Deleted']);
    }
}