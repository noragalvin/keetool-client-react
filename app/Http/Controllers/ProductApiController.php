<?php

namespace App\Http\Controllers;

use App\Color;
use App\Colorme\Transformers\CommentTransformer;
use App\Colorme\Transformers\NotificationTransformer;
use App\Colorme\Transformers\ProductTransformer;
use App\Comment;
use App\Gen;
use App\Like;
use App\Notification;
use App\Product;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

class ProductApiController extends ApiController
{
    protected $commentTransformer, $notificationTransformer, $productTransformer;

    public function __construct(CommentTransformer $commentTransformer, NotificationTransformer $notificationTransformer,
                                ProductTransformer $productTransformer)
    {
        parent::__construct();
        $this->commentTransformer = $commentTransformer;
        $this->notificationTransformer = $notificationTransformer;
        $this->productTransformer = $productTransformer;
    }

    public function feature( $product_id)
    {
        $product = Product::find($product_id);
        if ($this->user->role == 0) {
            return $this->responseUnAuthorized("Bạn không có quyền đánh dấu nổi bật");
        } else {
            if ($product->feature) {
                if ($this->user->id != $product->feature_id) {
                    return $this->responseUnAuthorized("Bạn không phải là người đánh dấu nổi bật bài viết này");
                } else {
                    $product->feature_id = null;
                    $product->feature_time = null;
                    $product->rating -= 500;
                    $product->save();
                    return $this->respondSuccessWithStatus(['message' => 'Bỏ nổi bật thành công']);
                }
            } else {
                $product->feature_id = $this->user->id;
                $product->feature_time = format_time_to_mysql(time());
                $product->rating += 500;
                $product->save();
                return $this->respondSuccessWithStatus(['feature' => [
                    "id" => $product->feature_id,
                    "name" => $this->user->name,
                    "username" => $this->user->username
                ]]);
            }

        }
    }

    public function uncomment_products( Request $request, $genId = null)
    {
        if ($genId) {
            $current_teach_gen = Gen::find($genId);
        } else {
            $current_teach_gen = Gen::getCurrentTeachGen();
        }
        $page = 1;
        $limit = 20;
        if ($request->page) {
            $page = $request->page;
        }
        $this->productTransformer->setUser($this->user);
//        $classes = $current_teach_gen->studyclasses()
//            ->where('teacher_id', $this->user->id)
//            ->orWhere(function ($query) use ($current_teach_gen) {
//                $query->where('teaching_assistant_id', $this->user->id)
//                    ->where('gen_id', $current_teach_gen->id);
//            })
//            ->get();


//        $products = collect([]);
//        foreach ($classes as $class) {
//            if ($class->group) {
//                $topics = $class->group->topics;
//                foreach ($topics as $topic) {
//                    $temp = $topic->topicAttendances()
//                        ->whereNotNull('product_id')
//                        ->where('commented', false)->get()
//                        ->filter(function ($item) {
//                            return $item->product != null;
//                        })
//                        ->map(function ($i) {
//                            $product = $i->product;
//                            $product->need_comment = true;
//                            return $product;
//                        });
//                    $products = $products->merge($temp);
//                }
//            }
//        }
        $products = Product::hydrateRaw("
        select * from products 
        where id in ( select `topic_attendances`.product_id
        from topic_attendances
        join topics on topics.id = topic_attendances.topic_id
        join groups on topics.group_id = groups.id
        join classes on classes.id = groups.class_id
        where classes.gen_id = " . $current_teach_gen->id . "
         and ((topic_attendances.commented = false and classes.teacher_id = " . $this->user->id . ") or 
        (topic_attendances.ta_commented = false and classes.`teaching_assistant_id` = " . $this->user->id . ")) ) order by products.created_at  ");
//       limit " . $limit . " offset " . ($page - 1) * $limit

        $products = $this
            ->productTransformer
            ->transformCollection(collect($products)->map(function ($product) {
                $product->need_comment = true;
                return $product;
            }));
//        ->slice(($page - 1) * $limit, $limit)
        return $this->respondSuccessWithStatus(['products' => $products]);
    }

    public function delete_comment( $commendId)
    {
        $comment = Comment::find($commendId);
        if ($comment->commenter->id != $this->user->id && $comment->product->author->id != $this->user->id) {
            return $this->responseUnAuthorized('Bạn không có quyền xoá comment này');
        }
        $topicAttend = $comment->product->topicAttendance;
        if ($topicAttend) {
            $class = $topicAttend->topic->group->studyClass;
            if (
                $this->user->id == $class->teacher_id &&
                $comment->product->comments()->where('commenter_id', $class->teacher_id)->count() == 1
            ) {
                $topicAttend->commented = false;
                $topicAttend->save();
            }
            if (
                $this->user->id == $class->teaching_assistant_id &&
                $comment->product->comments()->where('commenter_id', $class->teaching_assistant_id)->count() == 1
            ) {
                $topicAttend->ta_commented = false;
                $topicAttend->save();
            }
        }

        $comment->delete();
        return $this->respond(['message' => 'Xoá comment thành công']);
    }

    public function update_product( $productId, Request $request)
    {
        $product = Product::find($productId);

        foreach ($product->colors as $c) {
            $c->delete();
        }

        $colorStr = $request->colorStr;
        $colors = explode("#", $colorStr);
        foreach ($colors as $c) {
            $color = new Color();
            $color->product_id = $productId;
            $color->value = $c;
            $color->save();
        }

        return $this->respond(['message' => "Update bài thành công"]);
    }

    public function like( $productId)
    {
        $product = Product::find($productId);
        $product->rating += 5;
        $product->save();

        $like = $product->likes()->where('liker_id', $this->user->id)->first();
        if ($like) {
            return $this->responseBadRequest('You already liked this one');
        } else {
            $like = new Like();
            $like->product_id = $productId;
            $like->liker_id = $this->user->id;
            $like->save();

            if ($this->user->id != $product->author->id) {
                $notification = new Notification;
                $notification->product_id = $productId;
                $notification->actor_id = $this->user->id;
                $notification->receiver_id = $product->author->id;
                $notification->type = 0;
                $notification->save();

                $publish_data = array(
                    "event" => "notification",
                    "data" => [
                        "notification" => $this->notificationTransformer->transform($notification),
                    ]
                );

                $json_data = json_encode($publish_data);
                Redis::publish('colorme-channel', $json_data);

                send_push_notification($json_data);
            }

            return $this->respond([
                'product_id' => $productId,
                'like_counts' => $product->likes()->count()
            ]);
        }
    }

    public function unlike( $productId)
    {
        $product = Product::find($productId);
        $like = $product->likes()->where('liker_id', $this->user->id)->first();
        if ($like) {
            $product->rating -= 5;
            $product->save();
            $like->delete();
        } else {
            return $this->responseBadRequest('You have not liked this one');
        }
    }

    public function comment( $productId, Request $request)
    {
        $comment_content = $request->comment_content;
        $product = Product::find($productId);
        //send one notifcation to author
        if ($product->author->id != $this->user->id) {
            $notification = new Notification;
            $notification->product_id = $productId;
            $notification->actor_id = $this->user->id;
            $notification->receiver_id = Product::find($productId)->author->id;
            $notification->type = 1;
            $notification->save();
            $publish_data = array(
                "event" => "notification",
                "data" => [
                    "notification" => $this->notificationTransformer->transform($notification),
                ]
            );
            Redis::publish('colorme-channel', json_encode($publish_data));
            send_push_notification(json_encode($publish_data));
        }


        $already_sent_noti = array();

        //send to all others that involve in the post

        foreach ($product->comments as $comment) {
            $commenter_id = $comment->commenter_id;
            if ($product->author->id != $commenter_id && $commenter_id != $this->user->id && !in_array($commenter_id, $already_sent_noti)) {
                $notification = new Notification;
                $notification->product_id = $productId;
                $notification->actor_id = $this->user->id;
                $notification->receiver_id = $commenter_id;
                $notification->type = 2;
                $notification->save();

                $publish_data = array(
                    "event" => "notification",
                    "data" => [
                        "notification" => $this->notificationTransformer->transform($notification),
                    ]
                );
                Redis::publish('colorme-channel', json_encode($publish_data));
                send_push_notification(json_encode($publish_data));
                $already_sent_noti[] = $commenter_id;
            }
        }

        $comment = new Comment;
        $comment->product_id = $productId;
        $comment->likes = 0;
        $comment->commenter_id = $this->user->id;
        $comment->content = $comment_content;
        $comment->save();

        $topicAttend = $product->topicAttendance;
        if ($topicAttend) {
            $group = $topicAttend->topic->group;
            if ($group) {
                $class = $group->studyClass;
                if ($class) {
                    $hours = computeTimeInterval($product->created_at, date("Y-m-d H:i:s", time()));
//                    dd(date("Y-m-d h:i:s", time()));
                    if ($hours <= 24) {
                        if ($this->user->id == $class->teacher_id) {
                            $topicAttend->commented = true;
                            $topicAttend->save();
                        }
                        if ($this->user->id == $class->teaching_assistant_id) {
                            $topicAttend->ta_commented = true;
                            $topicAttend->save();
                        }
                    }
                }
            }
        }

        $publish_data = array(
            "event" => "comment",
            "data" => json_encode([
                "comment" => $this->commentTransformer->transform($comment),
                "product_id" => $productId,
                "user_id" => $this->user->id
            ])
        );

        Redis::publish('colorme-channel', json_encode($publish_data));

        return $this->respond($this->commentTransformer->transform($comment));
    }
}
