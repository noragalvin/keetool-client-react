<?php

namespace Modules\Staff\Http\Controllers;

use App\Http\Controllers\ManageApiController;
use App\Work;
use App\WorkStaff;
use Illuminate\Http\Request;
use App\User;
use DateTime;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Modules\Staff\Entities\Salary;

class StaffApiController extends ManageApiController
{
    /**
     * POST /staff
     * @return Response
     */
    public function createStaff(Request $request)
    {

        $errors = [];
        if (!$request->email || !$request->username || trim($request->username) == "" || trim($request->email) == "") {
            return $this->respondErrorWithStatus("Thiếu thông tin");
        }
        $user = User::where('email', '=', trim($request->email))->first();
        if ($user) {
            $errors['email'] = "Email đã có người sử dụng";
        }
        $username = trim($request->username);
        $user = User::where('username', '=', $username)->first();
        if ($user) {
            $errors['username'] = "Username đã có người sử dụng";
        }

        if (!empty($errors)) {
            return $this->respondErrorWithStatus($errors);
        }

        $user = new User;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->username = $username;
        $user->phone = $request->phone;
        $user->department_id = $request->department_id;
        $user->role = 1;
        $user->role_id = $request->role_id;
        $user->start_company = new DateTime();
        $user->avatar_url = trim_url($request->avatar_url);
        if ($request->color) {
            $user->color = trim_color($request->color);
        }
        $user->password = Hash::make('123456');
        $user->save();
        $salary = new Salary;
        $salary->user_id = $user->id;
        $salary->base = $request->base ? $request->base : 0;
        $salary->revenue = $request->revenue ? $request->revenue : 0;
        $salary->allowance = $request->allowance ? $request->allowance : 0;
        $salary->save();
        return $this->respondSuccessWithStatus([
            "user" => $user
        ]);
    }

    public function getStaffs(Request $request)
    {
        $limit = 20;
        if ($request->limit) {
            $limit = (int)$request->limit;
        }
        $staffs = User::where("role", ">", 0)->orderBy("name");
        if ($limit === -1) {

            $staffs = $staffs->get();
            return $this->respond([
                "status" => 1,
                "staffs" => $staffs->map(function ($staff) {
                    return [
                        "id" => $staff->id,
                        "name" => $staff->name,
                        "avatar_url" => $staff->avatar_url ? $staff->avatar_url : defaultAvatarUrl()
                    ];
                })
            ]);
        } else {
            $staffs = $staffs->paginate($limit);
            return $this->respondWithPagination(
                $staffs,
                [
                    "staffs" => $staffs->map(function ($staff) {
                        return [
                            "id" => $staff->id,
                            "name" => $staff->name,
                            "avatar_url" => $staff->avatar_url ? $staff->avatar_url : defaultAvatarUrl()
                        ];
                    })
                ]
            );
        }


    }

    public function changeStatusInWork($staffId, $workId, Request $request)
    {
        $work_staff = WorkStaff::where('work_id', $workId)->where('staff_id', $staffId)->first();
        if (!$work_staff) return $this->respondErrorWithStatus("Không tồn tại");
        if (!$request->status) return $this->respondErrorWithStatus("Thiếu status");
        $work_staff->status = $request->status;
        $work_staff->save();

        $count_staff = WorkStaff::where('work_id', $workId)->count();

        $count_done = WorkStaff::where('work_id', $workId)->where('status', "done")->count();

        $count_doing = WorkStaff::where('work_id', $workId)->where('status', "doing")->count();
        $work = Work::find($workId);
        if ($count_staff == $count_done) {
            $work->status = "done";
            $work->save();
        }

        if ($count_staff == $count_doing) {
            $work->status = "doing";
            $work->save();
        }

        return $this->respondSuccessWithStatus([
            "message" => "Thành công"
        ]);

    }

}
