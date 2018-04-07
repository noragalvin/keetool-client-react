<?php

namespace Modules\Course\Http\Controllers;

use App\Attendance;
use App\ClassLesson;
use App\Course;
use App\Gen;
use App\Http\Controllers\ManageApiController;
use App\Lesson;
use App\Link;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CourseController extends ManageApiController
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function __construct()
    {

        parent::__construct();

    }

    public function getCourse($course_id)
    {
        $course = Course::find($course_id);
        return $this->respondSuccessWithStatus([
            "course" => $course->detailedTransform()
        ]);
    }

    public function pushOrder($orderNumber)
    {
        $course = Course::where('order_number', $orderNumber)->first();
        if ($course != null) {
            $this->pushOrder($orderNumber + 1);
            $course->order_number = $orderNumber + 1;
            $course->save();
        }
    }

    public function createOrEdit(Request $request)
    {
        if ($request->id)
            $course = Course::find($request->id);
        else {
            $course = new Course;
            $course->duration = 0;
        }
        if ($request->name == null)
            return $this->respondErrorWithStatus(["message" => "Thiếu name"]);
        $course->name = $request->name;
        $course->price = $request->price;
        $course->description = $request->description;
        $course->linkmac = $request->linkmac;
        $course->linkwindow = $request->linkwindow;
        $course->mac_how_install = $request->mac_how_install;
        $course->window_how_install = $request->window_how_install;
        $course->cover_url = $request->cover_url;
        $course->cover_url = $request->cover_url;
        $course->color = $request->color;
        $course->image_url = $request->image_url;
        $course->icon_url = $request->icon_url;
        $course->detail = $request->detail;
        if ($request->order_number == null) {
            $course->order_number = Course::max('order_number') + 1;
        }
        $course->type_id = 1;
        $course->save();
        $arr_ids = json_decode($request->categories);
        $course->courseCategories()->detach();
        foreach ($arr_ids as $arr_id)
            $course->courseCategories()->attach($arr_id->id);
        return $this->respondSuccessWithStatus([
            "message" => "Tạo/sửa thành công",
            "course" => $course->detailedTransform()
        ]);
    }

    public function getAllCourses(Request $request)
    {
        if (!$request->limit)
            $limit = 20;
        else
            $limit = $request->limit;
        $keyword = $request->search;
        $courses = Course::where(function ($query) use ($keyword) {
            $query->where("name", "like", "%$keyword%")->orWhere("price", "like", "%$keyword%");
        })->paginate($limit);
        return $this->respondWithPagination(
            $courses,
            [
                "courses" => $courses->map(function ($course) {
                    return $course->transform();
                })
            ]
        );
    }

    public function changeStatusCourse($course_id, Request $request)
    {
        $course = Course::find($course_id);

        if ($course == null) {
            return $this->respondErrorWithStatus("Không tồn tại môn học");
        }

        $course->status = $request->status ? $request->status : 0;

        $course->save();

        return $this->respondSuccessWithStatus([
            'course' => $course->transform()
        ]);
    }

    public function changeOrderCourse($course_id, Request $request)
    {
        $course = Course::find($course_id);

        if ($course == null) {
            return $this->respondErrorWithStatus("Không tồn tại môn học");
        }

        if ($request->order_number == null)
            return $this->respondErrorWithStatus("Thiếu thứ tự môn học");
        if ($course->order_number != $request->order_number) {
            $this->pushOrder($request->order_number);
            $course->order_number = $request->order_number;
        }

        $course->save();

        return $this->respondSuccessWithStatus([
            'course' => $course->transform()
        ]);
    }

    public function getAll()
    {
        $courses = Course::all();

        return $this->respondSuccessWithStatus([
            "courses" => $courses->map(function ($course) {
                return $course->transform();
            })
        ]);
    }


    public function deleteCourse($course_id, Request $request)
    {
        $course = Course::find($course_id);
        if ($course == null) {
            return $this->respondErrorWithStatus(['message' => "Khóa học không tồn tại"]);
        }
        $classes = $course->classes();
        $course->delete();
        foreach ($classes as $class) {
            $class->delete();
        }
        return $this->respondSuccessWithStatus([
            'message' => " Xóa thành công"
        ]);
    }

    public function detailedLink($link_id)
    {
        $link = Link::find($link_id);
        return $this->respondSuccessWithStatus([
            "link" => $link->detailedTransform()
        ]);
    }

    public function createLink(Request $request)
    {
        $link = new Link;
        if ($request->link_url == null || $request->link_name == null || $request->course_id == null)
            return $this->respondErrorWithStatus(["message" => "Thiếu course_id or link_url or link_name"]);
        $link->link_name = $request->link_name;
        $link->link_url = $request->link_url;
        $link->link_description = $request->link_description;
        $link->course_id = $request->course_id;
        if ($request->link_icon != null) {

            $link_icon = uploadFileToS3($request, 'link_icon', 200, $link->link_icon);
            $link->link_icon = $link_icon;
            $link->link_icon_url = $this->s3_url . $link_icon;
        } else {

            if ($link->link_icon_url === null) {
                $link->link_icon_url = 'https://placehold.it/800x600';
            }

            $link->link_icon_url = trim($request->link_icon_url) ? trim($request->link_icon_url) : 'https://placehold.it/800x600';

        }
        $link->save();
        return $this->respondSuccessWithStatus([
            'link' => $link
        ]);
    }

    public function editLink($linkId, Request $request)
    {
        $link = Link::find($linkId);
        if (!$link) return $this->respondErrorWithStatus("không tồn tại link");
        if ($request->link_url == null || $request->link_name == null || $request->course_id == null)
            return $this->respondErrorWithStatus(["message" => "Thiếu course_id or link_url or link_name"]);
        $link->link_name = $request->link_name;
        $link->link_url = $request->link_url;
        $link->link_description = $request->link_description;
        $link->course_id = $request->course_id;
        if ($request->link_icon != null) {

            $link_icon = uploadFileToS3($request, 'link_icon', 200, $link->link_icon);
            $link->link_icon = $link_icon;
            $link->link_icon_url = $this->s3_url . $link_icon;
        } else {
            $link->link_icon_url = trim($request->link_icon_url) ? trim($request->link_icon_url) : 'https://placehold.it/800x600';
        }
        $link->save();
        return $this->respondSuccessWithStatus([
            'link' => $link
        ]);
    }

    public function deleteLink($link_id, Request $request)
    {
        $link = Link::find($link_id);
        $link->delete();
        return $this->respondSuccessWithStatus([
            'message' => "Xóa thành công"
        ]);
    }

    public function addLesson($courseId, Request $request)
    {
        if (Course::find($courseId) == null)
            return $this->respondErrorWithStatus([
            'message' => 'non-existing course'
        ]);
        if ($request->name == null || $request->description == null)
            return $this->respondErrorWithStatus([
            'message' => 'missing name || description'
        ]);
        $lesson = new Lesson;
        $lesson->course_id = $courseId;
        $lesson->name = $request->name;
        $lesson->description = $request->description;
        $lesson->detail = $request->detail;
        $lesson->order = $request->order;
        $lesson->detail_content = $request->detail_content;
        $lesson->detail_teacher = $request->detail_teacher;
        $lesson->save();
        return $this->respondSuccessWithStatus([
            'lesson' => [
                'name' => $lesson->name,
                'course_id' => $lesson->course_id,
                'description' => $lesson->description,
                'detail' => $lesson->detail,
                'order' => $lesson->order,
                'detail_content' => $lesson->detail_content,
                'detail_teacher' => $lesson->detail_teacher
            ]
        ]);
    }

    public function editLesson($lessonId, Request $request)
    {
        if (Lesson::find($lessonId) == null)
            return $this->respondErrorWithStatus([
            'message' => 'non-existing lesson'
        ]);
        if ($request->name == null || $request->description == null)
            return $this->respondErrorWithStatus([
            'message' => 'missing name || description'
        ]);
        $lesson = Lesson::find($lessonId);
        $lesson->name = $request->name;
        $lesson->description = $request->description;
        $lesson->detail = $request->detail;
        $lesson->order = $request->order;
        $lesson->detail_content = $request->detail_content;
        $lesson->detail_teacher = $request->detail_teacher;
        $lesson->save();
        return $this->respondSuccessWithStatus([
            'lesson' => [
                'name' => $lesson->name,
                'course_id' => $lesson->course_id,
                'description' => $lesson->description,
                'detail' => $lesson->detail,
                'order' => $lesson->order,
                'detail_content' => $lesson->detail_content,
                'detail_teacher' => $lesson->detail_teacher
            ]
        ]);
    }

    public function getAttendance($classId, $lessonId, Request $request)
    {
        $classLesson = ClassLesson::query();
        $check = $classLesson->where('class_id', $classId)->count();
        if ($check < $lessonId || $lessonId == 0) return $this->respondErrorWithStatus("Khong ton tai buoi hoc");
        $classLesson_pre = $classLesson->where('class_id', $classId)->orderBy('lesson_id', 'asc')->get();
        $classLesson = $classLesson_pre[$lessonId - 1];
        $resgister_ids = $classLesson->attendances->map(function ($data) {
            if ($data->register->status === 1) return $data->register->id;
            else return 0;
        });
        $attendance_list = $classLesson->attendances()->whereIn('register_id', $resgister_ids)->get();

        $data['attendances'] = $attendance_list->map(function ($attendance) {
            return [
                'student_id' => $attendance->register->user->id,
                'name' => $attendance->register->user->name,
                'email' => $attendance->register->user->email,
                'attendance_id' => $attendance->id,
                'study_class' => $attendance->register->studyClass->name,
                'device' => $attendance->device,
                'note' => $attendance->note,
                'attendance_lesson_status' => $attendance->status,
                'attendance_homework_status' => $attendance->hw_status

            ];
        });
        $data['classLesson'] = [
            'name' => $classLesson->studyClass->name,
            'attendance_count' => $classLesson->attendances->count(),
        ];

        return $this->respondSuccessWithStatus([
            "data" => $data
        ]);

    }

    public function changeAttendance(Request $request)
    {

        $attendances = json_decode($request->attendances);

        foreach ($attendances as $attendance) {
            $get_attendance = Attendance::find($attendance->attendance_id);
            if (!$get_attendance) return $this->respondErrorWithStatus("Khong ton tai ID");
            $get_attendance->status = $attendance->attendance_lesson_status;
            $get_attendance->hw_status = $attendance->attendance_homework_status;
            $get_attendance->note = $attendance->note;
            $get_attendance->save();
        }
        return $this->respondSuccessWithStatus([
            "message" => "Diem danh thanh cong"
        ]);

    }
    public function duplicateCourse($courseId, Request $request)
    {
        $course = Course::find($courseId);
        if (!$course) return $this->respondErrorWithStatus("Không tồn tại course");
        $course_new = new Course;
        $course_new->name = $course->name;
        $course_new->price = $course->price;
        $course_new->description = $course->description;
        $course_new->linkmac = $course->linkmac;
        $course_new->linkwindow = $course->linkwindow;
        $course_new->mac_how_install = $course->mac_how_install;
        $course_new->window_how_install = $course->window_how_install;
        $course_new->cover_url = $course->cover_url;
        $course_new->cover_url = $course->cover_url;
        $course_new->color = $course->color;
        $course_new->image_url = $course->image_url;
        $course_new->icon_url = $course->icon_url;
        $course_new->detail = $course->detail;
        $course_new->type_id = $course->type_id;
        $course_new->duration = $course->duration;
        $course_new->order_number = Course::max('order_number') + 1;
        $course_new->save();
        return $this->respondSuccessWithStatus([
            "message" => "Thành công",
        ]);
    }

}
