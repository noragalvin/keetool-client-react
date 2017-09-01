<?php
/**
 * Created by PhpStorm.
 * User: quanca
 * Date: 27/08/2017
 * Time: 19:56
 */

namespace Modules\Task\Repositories;


use App\CalendarEvent;
use App\Card;
use App\Colorme\Transformers\TaskTransformer;
use App\User;

class UserCardRepository
{
    protected $taskTransformer;

    public function __construct(TaskTransformer $taskTransformer)
    {
        $this->taskTransformer = $taskTransformer;
    }

    public function loadCalendarEvents($userId)
    {
        $user = User::find($userId);
        return $user->calendarEvents->map(function ($event) {
            return [
                "title" => $event->title,
                "id" => $event->id,
                "allDay" => $event->all_day,
                "start" => $event->start,
                "end" => $event->end,
                "status" => $event->status,
                "editable" => $event->editable,
                "color" => $event->color,
                "textColor" => $event->textColor,
                "overlay" => $event->overlay,
                "url" => $event->url
            ];
        });
    }

    public function assign($cardId, $userId)
    {
        $card = Card::find($cardId);
        $assignee = $card->assignees()->where('id', '=', $userId)->first();
        if ($assignee) {
            $card->assignees()->detach($userId);
            $this->removeCalendarEvent($cardId, $userId);
        } else {
            $card->assignees()->attach($userId);
            $this->updateCalendarEvent($cardId);
        }

        return true;
    }

    public function removeCalendarEvent($cardId, $userId)
    {
        $card = Card::find($cardId);
        $assignees = $card->assignees;
        $event = CalendarEvent::where("user_id", $userId)->where("card_id", $card->id)->first();
        if ($event) {
            $event->delete();
        }
    }

    public function updateCalendarEvent($cardId)
    {
        $card = Card::find($cardId);
        $assignees = $card->assignees;
        foreach ($assignees as $assignee) {
            $color = "#777";
            $cardLabel = $card->cardLabels()->first();
            if (!is_null($cardLabel)) {
                $color = $cardLabel->color;
            }
            $this->removeCalendarEvent($cardId, $assignee->id);

            $calendarEvent = new CalendarEvent();
            $calendarEvent->user_id = $assignee->id;
            $calendarEvent->card_id = $card->id;
            $calendarEvent->all_day = false;
            $calendarEvent->start = $card->deadline;
            $calendarEvent->end = $card->deadline;
            $calendarEvent->title = $card->title;
            $calendarEvent->type = "card";
            $calendarEvent->url = "project/" . $card->board->project_id . "/boards";
            $calendarEvent->color = $color;

            $calendarEvent->save();
        }
    }

    public function loadCardDetail($cardId)
    {
        $card = Card::find($cardId);
        $files = $card->files->map(function ($file) {
            return [
                "id" => $file->id,
                "name" => $file->name,
                "url" => generate_protocol_url($file->url),
                "ext" => $file->ext,
                "size" => $file->size,
                "file_key" => $file->file_key,
                "created_at" => format_time_main(strtotime($file->created_at))
            ];
        });
        $taskLists = $card->taskLists->map(function ($taskList) {
            return [
                'id' => $taskList->id,
                'title' => $taskList->title,
                'tasks' => $this->taskTransformer->transformCollection($taskList->tasks)
            ];
        });
        $members = $card->assignees->map(function ($member) use ($card) {
            $data = [
                "id" => $member->id,
                "name" => $member->name,
                "avatar_url" => generate_protocol_url($member->avatar_url),
                "email" => $member->email,
                "added" => false
            ];

            $memberIds = $card->assignees()->pluck("id")->toArray();
            if (in_array($member->id, $memberIds)) {
                $data['added'] = true;
            }

            return $data;
        });

        $cardLabels = $card->cardLabels;

        return [
            "description" => $card->description,
            "members" => $members,
            "taskLists" => $taskLists,
            "cardLabels" => $cardLabels,
            "files" => $files
        ];
    }
}