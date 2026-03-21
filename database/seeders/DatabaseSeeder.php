<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;


  public function run(): void
{

    \Spatie\Permission\Models\Role::create(['name' => 'Admin']);
    \Spatie\Permission\Models\Role::create(['name' => 'Doctor']);
    \Spatie\Permission\Models\Role::create(['name' => 'Customer']);
    \Spatie\Permission\Models\Role::create(['name' => 'Guest']);


    $admin = \App\Models\User::create([
        'name' => 'Quản Trị Viên',
        'email' => 'admin@gmail.com',
        'password' => bcrypt('12345678'),
    ]);

    $admin->assignRole('Admin');
}
}
