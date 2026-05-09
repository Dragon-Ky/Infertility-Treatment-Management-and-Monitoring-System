<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            if (!Schema::hasColumn('doctors', 'avatar')) {
                $table->string('avatar')->nullable()->after('full_name');
            }
            if (!Schema::hasColumn('doctors', 'degree')) {
                $table->string('degree')->nullable()->after('avatar');
            }
            if (!Schema::hasColumn('doctors', 'bio')) {
                $table->text('bio')->nullable()->after('experience_years');
            }
            if (!Schema::hasColumn('doctors', 'education')) {
                $table->text('education')->nullable()->after('bio');
            }
            if (!Schema::hasColumn('doctors', 'certifications')) {
                $table->text('certifications')->nullable()->after('education');
            }
            if (!Schema::hasColumn('doctors', 'consultation_fee')) {
                $table->decimal('consultation_fee', 12, 2)->default(0)->after('certifications');
            }
            if (!Schema::hasColumn('doctors', 'status')) {
                $table->string('status')->default('active')->after('consultation_fee');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn([
                'avatar', 'degree', 'bio', 'education', 
                'certifications', 'consultation_fee', 'status'
            ]);
        });
    }
};
