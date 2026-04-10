<?php
// app/Http/Controllers/RatingController.php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\Doctor;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    // GET /doctors/{doctorId}/ratings
    public function getByDoctor($doctorId)
    {
        $doctor = Doctor::find($doctorId);

        if (!$doctor) {
            return response()->json([
                'success' => false,
                'message' => 'Doctor not found'
            ], 404);
        }

        $ratings = Rating::where('doctor_id', $doctorId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'doctor_id'    => (int) $doctorId,
                'rating_avg'   => round($doctor->rating_avg, 1),
                'rating_count' => $doctor->rating_count,
                'ratings'      => $ratings,
            ]
        ]);
    }

    
    public function store(Request $request)
    {
        $request->validate([
            'doctor_id'      => 'required|exists:doctors,id',
            'user_id'        => 'required|integer',
            'appointment_id' => 'required|integer|unique:ratings,appointment_id',
            'rating'         => 'required|integer|min:1|max:5',
            'feedback'       => 'nullable|string',
        ]);

        $rating = Rating::create([
            'doctor_id'      => $request->doctor_id,
            'user_id'        => $request->user_id,
            'appointment_id' => $request->appointment_id,
            'rating'         => $request->rating,
            'feedback'       => $request->feedback,
        ]);

        
        $this->recalculateDoctorRating($request->doctor_id);

        return response()->json([
            'success' => true,
            'message' => 'Rating submitted successfully',
            'data'    => $rating
        ], 201);
    }

    
    public function update(Request $request, $id)
    {
        $rating = Rating::find($id);

        if (!$rating) {
            return response()->json([
                'success' => false,
                'message' => 'Rating not found'
            ], 404);
        }

        $request->validate([
            'rating'   => 'sometimes|integer|min:1|max:5',
            'feedback' => 'nullable|string',
        ]);

        $rating->update($request->only(['rating', 'feedback']));

        // Cập nhật lại rating_avg sau khi sửa
        $this->recalculateDoctorRating($rating->doctor_id);

        return response()->json([
            'success' => true,
            'message' => 'Rating updated successfully',
            'data'    => $rating
        ]);
    }

    
    public function destroy($id)
    {
        $rating = Rating::find($id);

        if (!$rating) {
            return response()->json([
                'success' => false,
                'message' => 'Rating not found'
            ], 404);
        }

        $doctorId = $rating->doctor_id;
        $rating->delete();

        // Cập nhật lại rating_avg sau khi xóa
        $this->recalculateDoctorRating($doctorId);

        return response()->json([
            'success' => true,
            'message' => 'Rating deleted successfully'
        ]);
    }

    
    private function recalculateDoctorRating($doctorId)
    {
        $ratings = Rating::where('doctor_id', $doctorId)->get();

        $count = $ratings->count();
        $avg   = $count > 0 ? round($ratings->avg('rating'), 2) : 0.00;

        Doctor::where('id', $doctorId)->update([
            'rating_avg'   => $avg,
            'rating_count' => $count,
        ]);
    }
}