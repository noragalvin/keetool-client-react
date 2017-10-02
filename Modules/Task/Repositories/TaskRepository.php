<?php
/**
 * Created by PhpStorm.
 * User: quanca
 * Date: 27/08/2017
 * Time: 19:56
 */

namespace Modules\Task\Repositories;


use App\Card;
use App\Colorme\Transformers\TaskTransformer;
use App\Notification;
use App\Repositories\CalendarEventRepository;
use App\Repositories\NotificationRepository;
use App\User;
use Illuminate\Support\Facades\Redis;
use Modules\Task\Entities\TaskList;
use Modules\Task\Transformers\MemberTransformer;

class TaskRepository
{
    protected $taskTransformer;
    protected $memberTransformer;
    protected $calendarEventRepository;
    protected $notificationRepository;

    public function __construct(
        NotificationRepository $notificationRepository,
        MemberTransformer $memberTransformer,
        CalendarEventRepository $calendarEventRepository,
        TaskTransformer $taskTransformer)
    {
        $this->notificationRepository = $notificationRepository;
        $this->taskTransformer = $taskTransformer;
        $this->calendarEventRepository = $calendarEventRepository;
        $this->memberTransformer = $memberTransformer;
    }

    public function saveTaskDeadline($task, $deadline, $currentUser)
    {
        $task->deadline = $deadline;
        $task->save();
        $this->calendarEventRepository->updateCalendarEvent("task", $task->id);

        $card = $task->taskList->card;
        $project = $card->board->project;
        $user = $task->member;

        if ($user && $currentUser && $currentUser->id != $user->id) {

            $notification = new Notification;
            $notification->actor_id = $currentUser->id;
            $notification->receiver_id = $user->id;
            $notification->type = 20;
            $message = $notification->notificationType->template;

            $message = str_replace('[[ACTOR]]', "<strong>" . $currentUser->name . "</strong>", $message);
            $message = str_replace('[[TASK]]', "<strong>" . $task->title . "</strong>", $message);
            $message = str_replace('[[DEADLINE]]', "<strong>" . format_vn_short_datetime(strtotime($deadline)) . "</strong>", $message);
            $message = str_replace('[[CARD]]', "<strong>" . $card->title . "</strong>", $message);
            $message = str_replace('[[PROJECT]]', "<strong>" . $project->title . "</strong>", $message);
            $notification->message = $message;

            $notification->color = $notification->notificationType->color;
            $notification->icon = $notification->notificationType->icon;
            $notification->url = '/project/' . $project->id . "/boards?card_id=" . $card->id;

            $notification->save();

            $data = array(
                "message" => $message,
                "link" => $notification->url,
                'created_at' => format_time_to_mysql(strtotime($notification->created_at)),
                "receiver_id" => $notification->receiver_id,
                "actor_id" => $notification->actor_id,
                "icon" => $notification->icon,
                "color" => $notification->color
            );

            $publish_data = array(
                "event" => "notification",
                "data" => $data
            );

            Redis::publish(config("app.channel"), json_encode($publish_data));
        }
        return $task;
    }

    public function createTaskListFromTemplate($taskListId, $cardId, $currentUser)
    {
        $taskListTemplate = TaskList::find($taskListId);
        $taskList = $taskListTemplate->replicate();
        $taskList->card_id = $cardId;
        $card = Card::find($cardId);
        $project = $card->board->project;
        $taskList->save();
        foreach ($taskListTemplate->tasks as $item) {
            $task = $item->replicate();
            $task->task_list_id = $taskList->id;
            if ($task->span > 0) {
                $date = new \DateTime();
                $date->modify("+$task->span hours");
                $task->deadline = $date->format("Y-m-d H:i:s");
            }
            $task->save();
            if ($task->member) {
                $member = $card->assignees()->where("id", $task->member->id)->first();
                if ($member == null) {
                    $card->assignees()->attach($task->member->id);
                }

                $projectMember = $project->members()->where("id", $task->member->id)->first();
                if ($projectMember == null) {
                    $project->members()->attach($task->member->id);
                }

                $user = $task->member;
                if ($currentUser && $currentUser->id != $user->id) {

                    $notification = new Notification;
                    $notification->actor_id = $currentUser->id;
                    $notification->receiver_id = $user->id;
                    $notification->type = 19;
                    $message = $notification->notificationType->template;

                    $message = str_replace('[[ACTOR]]', "<strong>" . $currentUser->name . "</strong>", $message);
                    $message = str_replace('[[TASK]]', "<strong>" . $task->title . "</strong>", $message);
                    $message = str_replace('[[CARD]]', "<strong>" . $card->title . "</strong>", $message);
                    $message = str_replace('[[PROJECT]]', "<strong>" . $project->title . "</strong>", $message);
                    $notification->message = $message;

                    $notification->color = $notification->notificationType->color;
                    $notification->icon = $notification->notificationType->icon;
                    $notification->url = '/project/' . $project->id . "/boards?card_id=" . $card->id;

                    $notification->save();

                    $this->notificationRepository->sendNotification($notification);
                }
            }
        }
        return [
            "id" => $taskList->id,
            "card_id" => $cardId,
            "title" => $taskList->title,
            'tasks' => $this->taskTransformer->transformCollection($taskList->tasks),
            "card" => $card->transform(),
            "project_members" => $project->members->map(function ($member) {
                return [
                    "id" => $member->id,
                    "name" => $member->name,
                    "email" => $member->email,
                    "is_admin" => $member->pivot->role === 1,
                    "added" => true,
                    "avatar_url" => generate_protocol_url($member->avatar_url)
                ];
            })
        ];
    }

    public function addMemberToTask($task, $userId, $currentUser)
    {
        $task->assignee_id = $userId;
        $card = $task->taskList->card;
        if ($card) {
            $member = $card->assignees()->where("id", $userId)->first();

            if ($userId != 0 && $member == null) {
                $card->assignees()->attach($userId);
            }


            $this->calendarEventRepository->updateCalendarEvent("task", $task->id);

            $card = $task->taskList->card;
            $project = $card->board->project;

            $user = User::find($userId);
            if ($currentUser && $user != null && $currentUser->id != $user->id) {

                $notification = new Notification;
                $notification->actor_id = $currentUser->id;
                $notification->receiver_id = $user->id;
                $notification->type = 19;
                $message = $notification->notificationType->template;

                $message = str_replace('[[ACTOR]]', "<strong>" . $currentUser->name . "</strong>", $message);
                $message = str_replace('[[TASK]]', "<strong>" . $task->title . "</strong>", $message);
                $message = str_replace('[[CARD]]', "<strong>" . $card->title . "</strong>", $message);
                $message = str_replace('[[PROJECT]]', "<strong>" . $project->title . "</strong>", $message);
                $notification->message = $message;

                $notification->color = $notification->notificationType->color;
                $notification->icon = $notification->notificationType->icon;
                $notification->url = '/project/' . $project->id . "/boards?card_id=" . $card->id;

                $notification->save();

                $this->notificationRepository->sendNotification($notification);
            }
        }
        $task->save();

        return true;
    }
}