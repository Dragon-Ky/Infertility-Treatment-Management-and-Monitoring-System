<?php

namespace App\Http\Controllers;

use App\Models\DoctorSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class DoctorScheduleController extends Controller
{
    
    public function index()
    {
        return Cache::remember('doctor_schedules', 600, function () {
            return DoctorSchedule::with('doctor')->get();
        });
    }

    
    public function store(Request $request)
    {
        $schedule = DoctorSchedule::create($request->all());

        
        Cache::forget('doctor_schedules');

        return response()->json($schedule, 201);
    }

    
    public function show($id)
    {
        return Cache::remember("doctor_schedule_$id", 600, function () use ($id) {
            return DoctorSchedule::with('doctor')->findOrFail($id);
        });
    }

    
    public function update(Request $request, $id)
    {
        $schedule = DoctorSchedule::findOrFail($id);
        $schedule->update($request->all());

        
        Cache::forget('doctor_schedules');
        Cache::forget("doctor_schedule_$id");

        return $schedule;
    }

   
    public function destroy($id)
    {
        DoctorSchedule::destroy($id);

        
        Cache::forget('doctor_schedules');
        Cache::forget("doctor_schedule_$id");

        return response()->json(null, 204);
    }
}