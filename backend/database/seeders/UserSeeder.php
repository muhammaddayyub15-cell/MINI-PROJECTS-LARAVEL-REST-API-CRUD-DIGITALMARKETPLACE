<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Nonaktifkan foreign key check agar truncate tidak error
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        User::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $users = [
            // ==================== ADMIN ====================
            [
                'name'      => 'Admin',
                'email'     => 'admin@mail.com',
                'password'  => make('password'),
                'role'      => 'admin',
                'is_active' => true,
            ],

            // ==================== 19 NORMAL USERS ====================
            [
                'name'      => 'Budi Santoso',
                'email'     => 'budi.santoso@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => true,
            ],
            [
                'name'      => 'Siti Rahayu',
                'email'     => 'siti.rahayu@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => true,
            ],
            [
                'name'      => 'Andi Wijaya',
                'email'     => 'andi.wijaya@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => true,
            ],
            [
                'name'      => 'Dewi Lestari',
                'email'     => 'dewi.lestari@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => true,
            ],
            [
                'name'      => 'Rizky Pratama',
                'email'     => 'rizky.pratama@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => true,
            ],
            [
                'name'      => 'Nurul Hidayah',
                'email'     => 'nurul.hidayah@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => true,
            ],
            [
                'name'      => 'Fajar Kurniawan',
                'email'     => 'fajar.kurniawan@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => true,
            ],
            [
                'name'      => 'Mega Putri',
                'email'     => 'mega.putri@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => true,
            ],
            [
                'name'      => 'Hendra Gunawan',
                'email'     => 'hendra.gunawan@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => false,
            ],
            [
                'name'      => 'Rina Marlina',
                'email'     => 'rina.marlina@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => true,
            ],
            [
                'name'      => 'Dimas Ardiansyah',
                'email'     => 'dimas.ardiansyah@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => true,
            ],
            [
                'name'      => 'Yanti Susanti',
                'email'     => 'yanti.susanti@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => false,
            ],
            [
                'name'      => 'Bagas Prasetyo',
                'email'     => 'bagas.prasetyo@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => true,
            ],
            [
                'name'      => 'Indah Permatasari',
                'email'     => 'indah.permatasari@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => true,
            ],
            [
                'name'      => 'Wahyu Setiawan',
                'email'     => 'wahyu.setiawan@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => true,
            ],
            [
                'name'      => 'Fitri Handayani',
                'email'     => 'fitri.handayani@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => false,
            ],
            [
                'name'      => 'Rendi Saputra',
                'email'     => 'rendi.saputra@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => true,
            ],
            [
                'name'      => 'Ayu Ningrum',
                'email'     => 'ayu.ningrum@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => true,
            ],
            [
                'name'      => 'Galih Wicaksono',
                'email'     => 'galih.wicaksono@mail.com',
                'password'  => make('password'),
                'role'      => 'user',
                'is_active' => true,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}