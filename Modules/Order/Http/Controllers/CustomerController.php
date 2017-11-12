<?php
/**
 * Created by PhpStorm.
 * User: tt
 * Date: 12/11/2017
 * Time: 15:45
 */

namespace Modules\Order\Http\Controllers;


use App\Http\Controllers\ManageApiController;
use App\Order;
use App\User;
use Illuminate\Http\Request;

class CustomerController extends ManageApiController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function allCustomers(Request $request)
    {

        $limit = $request->limit ? $request->limit : 20;
        $keyword = $request->search;
        $users = User::where("type", "customer")->where(function ($query) use ($keyword) {
            $query->where('name', 'like', "%$keyword%")->orWhere('phone', 'like', "%$keyword%")->orWhere('id', $keyword);
        })->paginate($limit);


        return $this->respondWithPagination(
            $users,
            [
                'customers' => $users->map(function ($user) {
                    $orders = Order::where("user_id", $user->id)->get();
                    $totalMoney = 0;
                    $totalPaidMoney = 0;
                    $lastOrder = 0;
                    foreach ($orders as $order) {
                        $goodOrders = $order->goodOrders()->get();
                        foreach ($goodOrders as $goodOrder) {
                            $totalMoney += $goodOrder->quantity * $goodOrder->price;
                        }
                        $lastOrder = $order->created_at;
                    }
                    foreach ($orders as $order) {
                        $orderPaidMoneys = $order->orderPaidMoneys()->get();
                        foreach ($orderPaidMoneys as $orderPaidMoney) {
                            $totalPaidMoney += $orderPaidMoney->money;
                        }
                    }
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'phone' => $user->phone,
                        'email' => $user->email,
                        'address' => $user->address,
                        'birthday' => $user->dob,
                        'gender' => $user->gender,
                        'last_order' => format_vn_short_datetime(strtotime($lastOrder)),
                        'total_money' => $totalMoney,
                        'total_paid_money' => $totalPaidMoney,
                        'debt' => $totalMoney - $totalPaidMoney,

                    ];
                }),
            ]
        );
    }

    public function countMoney()
    {
        $users = User::where("type", "customer")->get();
        $TM = 0;
        $TPM = 0;
        if ($users) {
            foreach ($users as $user) {
                $orders = Order::where("user_id", $user->id)->get();
                $totalMoney = 0;
                $totalPaidMoney = 0;
                $lastOrder = 0;
                foreach ($orders as $order) {
                    $goodOrders = $order->goodOrders()->get();
                    foreach ($goodOrders as $goodOrder) {
                        $totalMoney += $goodOrder->quantity * $goodOrder->price;
                    }

                    $lastOrder = $order->created_at;
                }
                foreach ($orders as $order) {
                    $orderPaidMoneys = $order->orderPaidMoneys()->get();
                    foreach ($orderPaidMoneys as $orderPaidMoney) {
                        $totalPaidMoney += $orderPaidMoney->money;
                    }
                }
                $TM += $totalMoney;
                $TPM += $totalPaidMoney;
            }
        }
        return $this->respondSuccessWithStatus([
            "total_moneys" => $TM,
            "total_paid_moneys" => $TPM
        ]);
    }

    public function addCustomer(Request $request)
    {
        if (!$request->name || !$request->phone || !$request->address || !$request->email || !$request->dob || !$request->gender || trim($request->name) == "" || trim($request->phone) == "" || trim($request->address) == "" || trim($request->email) == "" || trim($request->dob) == "")
            return $this->respondErrorWithStatus("Thiếu thông tin");

        if (!filter_var($request->email, FILTER_VALIDATE_EMAIL)) return $this->respondErrorWithStatus("Email không hợp lệ");

        $user = User::where("email", $request->email)->get();
        if (count($user) > 0) return $this->respondErrorWithStatus("Đã tồn tại khách hàng"); else {
            $user = new User;
            $user->name = $request->name;
            $user->phone = $request->phone;
            $user->address = $request->address;
            $user->email = $request->email;
            $user->dob = $request->dob;
            $user->gender = $request->gender;
            $user->save();
        }
        return $this->respondSuccessWithStatus([
            "message" => "Thêm thành công"
        ]);
    }

    public function deleteCustomer(Request $request)
    {
        $user = User::find($request->id);
        if (!$user) return $this->respondErrorWithStatus("Không tồn tại khách hàng");
        $user->delete();
        return $this->respondSuccessWithStatus([
            "message" => "Xóa thành công"
        ]);
    }
}