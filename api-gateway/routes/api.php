<?php

use App\Http\Controllers\ApiGatewayController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Gateway Dynamic Routes
|--------------------------------------------------------------------------
|
| Route này tự động bắt tất cả các request có định dạng api/{service}/{path}
| Ví dụ: api/treatment/patients/1 -> Sẽ forward sang treatment-service
|
*/

Route::any('/{service}/{path}', [ApiGatewayController::class, 'handle'])
     ->where('path', '.*');
