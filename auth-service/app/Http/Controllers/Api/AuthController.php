<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Exception;

class AuthController extends Controller
{
    /**
     * Đăng nhập hệ thống
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email hoặc mật khẩu không chính xác'
            ], 401);
        }

        // Lấy thông tin user kèm theo roles mới (4 tầng)
        $user = User::with('roles')->find(auth('api')->user()->id);

        return response()->json([
            'status' => 'success',
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => $user
        ]);
    }

    /**
     * Đăng ký tài khoản (Mặc định là Customer)
     */
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
                'message' => 'Dữ liệu đăng ký không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'phone'    => $request->phone,
                'password' => Hash::make($request->password),
                'status'   => 1,
                'avatar'   => null,
            ]);

            // Gán role mặc định cho khách hàng là 'Customer' (đúng cấu trúc mới)
            if (method_exists($user, 'assignRole')) {
                $user->assignRole('Customer');
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Đăng ký tài khoản khách hàng thành công!',
                'user' => $user->load('roles')
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống trong quá trình đăng ký',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy thông tin cá nhân
     */
    public function me()
    {
        try {
            $user = User::with('roles')->find(auth('api')->user()->id);
            return response()->json([
                'status' => 'success',
                'data' => $user
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }
    }

    /**
     * Đăng xuất
     */
    public function logout()
    {
        auth('api')->logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Đăng xuất thành công'
        ]);
    }

    /**
     * Cập nhật thông tin cá nhân
     */
    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();
        if (!$user) return response()->json(['message' => 'Unauthorized'], 401);

        $validator = Validator::make($request->all(), [
            'name'  => 'required|string|max:255',
            'phone' => 'required|string|max:15',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $user->update($request->only('name', 'phone'));

        return response()->json([
            'status'  => 'success',
            'message' => 'Cập nhật hồ sơ thành công!',
            'user'    => $user->fresh('roles')
        ]);
    }

    /**
     * Thay đổi mật khẩu
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'old_password' => 'required',
            'new_password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)->mixedCase()->numbers()->symbols(),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $user = auth('api')->user();

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mật khẩu cũ không chính xác!'
            ], 400);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Thay đổi mật khẩu thành công!'
        ]);
    }
}
