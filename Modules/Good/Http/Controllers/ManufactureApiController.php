<?php

namespace Modules\Good\Http\Controllers;

use App\Good;
use App\HistoryGood;
use App\Http\Controllers\ManageApiController;
use App\ImportedGoods;
use App\Manufacture;
use App\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ManufactureApiController extends ManageApiController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function allManufactures(Request $request)
    {
        $limit = $request->limit ? $request->limit : 20;
        $manufactures = Manufacture::query();
        $search = $request->search;

        $manufactures = $manufactures->where('name', 'like', '%' . $search . '%');
        $manufactures = $manufactures->orderBy("created_at", "desc")->paginate($limit);
        return $this->respondWithPagination(
            $manufactures,
            [
                'manufactures' => $manufactures->map(function ($manufacture) {
                    return [
                        'id' => $manufacture->id,
                        'name' => $manufacture->name,
                    ];
                })
            ]);
    }

    public function createManufacture(Request $request)
    {
        if($request->name == null && trim($request->name)=='')
            return $this->respondErrorWithStatus([
                'message' => 'Thiếu tên nhà sản xuất'
            ]);
        $manufacture = new Manufacture;
        $manufacture->name = $request->name;
        $manufacture->save();
        return $this->respondSuccessWithStatus([
            'message' => 'SUCCESS'
        ]);
    }

    public function deleteManufacture($manufactureId, Request $request) {
        $manufacture = Manufacture::find($manufactureId);
        if($manufacture == null)
            return $this->respondErrorWithStatus([
                'message' => 'Không tồn tại nhà sản xuất'
            ]);
        $manufacture->save();
        return $this->respondSuccessWithStatus([
            'message' => 'SUCCESS'
        ]);
    }
}