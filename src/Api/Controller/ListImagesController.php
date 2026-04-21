<?php
namespace UlasimInfo\UploadExif\Api\Controller;

use Flarum\Http\RequestUtil;
use Flarum\Api\Controller\AbstractListController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Arr;

class ListImagesController extends AbstractListController {
    // Serializer UlasimInfo namespace'ine göre ayarlandı
    public $serializer = 'UlasimInfo\UploadExif\Api\Serializer\SpotterImageSerializer';
    public $include = ['user'];

    protected $db;

    public function __construct(ConnectionInterface $db) {
        $this->db = $db;
    }

    protected function data(ServerRequestInterface $request, Document $document) {
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
                // B) VEYA Kullanıcı adında ara (Alt sorgu ile)
                      ->orWhereIn('user_id', function($subQuery) use ($q) {
                          $subQuery->select('id')
                                   ->from('users')
                                   ->where('username', 'like', "%{$q}%");
                      });
            });
        }

        // --- YENİ EKLENEN KISIM: SADECE ORİJİNALLERİ GETİR ---
        // Admin panelindeki "Orijinal Medya Deposu" sekmesi için filtre
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

        // --- SAYFALAMA LİMİTİ (Admin Panelinde 14) ---
        if (strpos($path, '/all') !== false) {
            $limit = 14; 
        } else {
            $limit = $this->extractLimit($request);
        }

        $offset = $this->extractOffset($request);
        
        $results = $query->limit($limit)->offset($offset)->get();

        // Kullanıcı verilerini yükle (Misafir yazmaması için)
        $this->loadUsersForResults($results);

        return $results;
    }

    protected function loadUsersForResults($results) {
        $userIds = $results->pluck('user_id')->unique();
        if ($userIds->isEmpty()) return;

        $users = \Flarum\User\User::whereIn('id', $userIds)->get()->keyBy('id');

        foreach ($results as $result) {
            $result->user = $users->get($result->user_id);
        }
    }
}