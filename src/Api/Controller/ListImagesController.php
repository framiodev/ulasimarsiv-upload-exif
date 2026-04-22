<?php
namespace UlasimArsiv\UploadExif\Api\Controller;

use Flarum\Http\RequestUtil;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Arr;
use Flarum\User\User;

class ListImagesController implements RequestHandlerInterface {
    protected $db;

    public function __construct(ConnectionInterface $db) {
        $this->db = $db;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface {
        $actor = RequestUtil::getActor($request);
        $filters = $request->getQueryParams()['filter'] ?? [];
        $path = $request->getUri()->getPath(); 
        
        // Veritabanı sorgusunu başlat
        $query = $this->db->table('spotter_images')->select('spotter_images.*');

        // --- 1. AKILLI ARAMA (Dosya Adı VEYA Kullanıcı Adı) ---
        if ($q = Arr::get($filters, 'q')) {
            $query->where(function ($query) use ($q) {
                // A) Dosya adında ara
                $query->where('filename', 'like', "%{$q}%")
                // B) VEYA Kullanıcı adında ara
                      ->orWhereIn('user_id', function($subQuery) use ($q) {
                          $subQuery->select('id')
                                   ->from('users')
                                   ->where('username', 'like', "%{$q}%");
                      });
            });
        }

        // --- YENİ EKLENEN KISIM: SADECE ORİJİNALLERİ GETİR ---
        if (Arr::get($filters, 'has_original') === '1') {
            $query->whereNotNull('original_path');
        }
        // -----------------------------------------------------

        // --- 2. PROFİL FİLTRESİ ---
        if ($userId = Arr::get($filters, 'user')) {
            $query->where('user_id', $userId);
        }
        
        // --- 3. ADMIN PANELİ (Kısıtlama Yok) ---
        elseif (strpos($path, '/all') !== false && $actor->isAdmin()) {
            // Admin panelindeyiz, tüm görseller gelsin.
        }

        // --- 4. VARSAYILAN (Sadece Kendi Yüklemelerim) ---
        else {
            $actor->assertRegistered();
            $query->where('user_id', $actor->id);
        }

        // --- SIRALAMA (Yeniden Eskiye) ---
        $query->orderBy('id', 'desc');

        // --- SAYFALAMA LİMİTİ ---
        if (strpos($path, '/all') !== false) {
            $limit = 14; 
        } else {
            $limit = (int) Arr::get($request->getQueryParams(), 'page.limit', 20);
        }

        $offset = (int) Arr::get($request->getQueryParams(), 'page.offset', 0);
        
        $results = $query->limit($limit)->offset($offset)->get();

        // Kullanıcı verilerini yükle
        $userIds = $results->pluck('user_id')->unique();
        $users = User::whereIn('id', $userIds)->get()->keyBy('id');

        $data = [];
        $included = [];
        $includedIds = [];

        foreach ($results as $result) {
            $user = $users->get($result->user_id);
            
            $item = [
                'type' => 'ulasimarsiv-images',
                'id' => (string) $result->id,
                'attributes' => [
                    'filename' => $result->filename,
                    'path' => $result->path,
                    'thumb_path' => $result->thumb_path,
                    'exif_data' => $result->exif_data,
                    'original_path' => $result->original_path,
                ],
            ];

            if ($user) {
                $item['relationships'] = [
                    'user' => [
                        'data' => [
                            'type' => 'users',
                            'id' => (string) $user->id,
                        ]
                    ]
                ];

                if (!isset($includedIds[$user->id])) {
                    $includedIds[$user->id] = true;
                    $included[] = [
                        'type' => 'users',
                        'id' => (string) $user->id,
                        'attributes' => [
                            'username' => $user->username,
                            'displayName' => $user->display_name,
                            'avatarUrl' => $user->avatar_url,
                        ]
                    ];
                }
            }
            
            $data[] = $item;
        }

        return new JsonResponse([
            'data' => $data,
            'included' => $included
        ]);
    }
}