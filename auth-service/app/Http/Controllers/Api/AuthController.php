<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email hoặc mật khẩu không chính xác'
            ], 401);
        }

        // Lấy thông tin user kèm theo roles
        $user = User::with('roles')->find(auth('api')->user()->id);

        return response()->json([
            'status' => 'success',
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => $user
        ]);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'phone'    => 'required|string|max:15|unique:users',
            'password' => [
                'required',
                'string',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'password' => Hash::make($request->password),
            'status'   => 1,
            'avatar'   => null,
        ]);

        // Gán role mặc định cho khách hàng
        if (method_exists($user, 'assignRole')) {
            $user->assignRole('Customer');
        }

        $user->load('roles');

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng ký tài khoản thành công!',
            'user' => $user
        ], 201);
    }

    public function me()
    {
        $user = User::with('roles')->find(auth('api')->user()->id);
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    public function logout()
    {
        auth('api')->logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Đăng xuất thành công'
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();

        $validator = Validator::make($request->all(), [
            'name'  => 'required|string|max:255',
            'phone' => 'required|string|max:15',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Cập nhật Database
        $user->update([
            'name'  => $request->name,
            'phone' => $request->phone,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Cập nhật hồ sơ thành công!',
            'user'    => $user
        ]);
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'old_password' => 'required',
            'new_password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = auth('api')->user();

        // Kiểm tra mật khẩu cũ
        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mật khẩu cũ không chính xác!'
            ], 400);
        }

        // Cập nhật mật khẩu mới
        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Thay đổi mật khẩu thành công!'
        ]);
    }
}
