<?php
namespace App\Http\Controllers;
use App\Models\Treatment;
use App\Services\RabbitMQService;
use Illuminate\Http\Request;

class TreatmentController extends Controller {
    protected $rabbitmq;
    public function __construct(RabbitMQService $rabbitmq) { $this->rabbitmq = $rabbitmq; }

    public function register(Request $request) {
        $treatment = Treatment::create($request->all());
        $this->rabbitmq->publish('treatment.created', $treatment);
        return response()->json($treatment, 201);
    }
}