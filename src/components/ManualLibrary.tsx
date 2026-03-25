import { useEffect, useMemo, useState } from 'react';
import { ManualResource, ManualResourceSource } from '../types';
import { manualDefaultResources } from '../data/manualDefaultResources';
import { addUserManualResource, getUserManualResources } from '../utils/manualStorage';
import { toYoutubeEmbedUrl } from '../utils/youtube';

type ManualFilter = 'all' | 'youtube' | 'amway';

export default function ManualLibrary() {
  const [resources, setResources] = useState<ManualResource[]>(manualDefaultResources);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ManualFilter>('all');
  const [showAdd, setShowAdd] = useState(false);

  // Add form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [source, setSource] = useState<ManualResourceSource>('youtube');
  const [url, setUrl] = useState('');
  const [productNames, setProductNames] = useState('');
  const [productCodes, setProductCodes] = useState('');
  const [freeKeywords, setFreeKeywords] = useState('');

  useEffect(() => {
    const user = getUserManualResources();
    setResources([...manualDefaultResources, ...user]);
  }, []);

  const filteredResources = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

    return resources
      .filter(r => {
        if (filter === 'all') return true;
        return r.source === filter;
      })
      .filter(r => {
        if (!tokens.length) return true;
        const haystack = [
          r.title,
          r.author || '',
          r.url,
          r.productNames.join(' '),
          r.productCodes.join(' '),
          r.freeKeywords.join(' ')
        ]
          .join(' ')
          .toLowerCase();
        return tokens.every(t => haystack.includes(t));
      });
  }, [resources, query, filter]);

  const handleAdd = () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề');
      return;
    }
    if (!url.trim()) {
      alert('Vui lòng nhập URL');
      return;
    }

    const toList = (s: string) =>
      s
        .split(',')
        .map(x => x.trim())
        .filter(Boolean);

    const embedUrl = source === 'youtube' ? toYoutubeEmbedUrl(url.trim() ) ?? undefined : undefined;

    const saved = addUserManualResource({
      title: title.trim(),
      author: author.trim() || undefined,
      source,
      url: url.trim(),
      embedUrl: embedUrl || undefined,
      productNames: toList(productNames),
      productCodes: toList(productCodes),
      freeKeywords: toList(freeKeywords)
    });

    if (!saved) return;
    setResources(prev => [...prev, saved]);
    setShowAdd(false);
    setTitle('');
    setAuthor('');
    setUrl('');
    setProductNames('');
    setProductCodes('');
    setFreeKeywords('');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manual cho người mới</h1>
        <p className="text-gray-600 mt-1">
          Tìm video/tài liệu minh hoạ sản phẩm theo <strong>tên</strong>, <strong>mã sản phẩm</strong> hoặc <strong>từ khoá</strong>.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <input
              className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-96"
              placeholder="VD: 110415, Double X, bột protein, sop, bodykey..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg"
              value={filter}
              onChange={(e) => setFilter(e.target.value as ManualFilter)}
            >
              <option value="all">Tất cả</option>
              <option value="youtube">YouTube</option>
              <option value="amway">Amway</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowAdd(prev => !prev)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
            >
              {showAdd ? 'Đóng' : '+ Thêm tài nguyên'}
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600 mt-3">
          Hiển thị {filteredResources.length} / {resources.length} tài nguyên
        </div>

        {showAdd && (
          <div className="mt-5 border-t pt-5 space-y-4">
            <h2 className="font-semibold text-gray-800">Thêm tài nguyên (lưu trên trình duyệt)</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Video giới thiệu Double X - 120843"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nguồn</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={source}
                  onChange={(e) => setSource(e.target.value as ManualResourceSource)}
                >
                  <option value="youtube">YouTube (embed)</option>
                  <option value="amway">Amway (link)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả (tuỳ chọn)</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="VD: Vũ Hoàng Tâm"
                />
              </div>
              <div className="md:col-span-1 md:row-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Dán link YouTube hoặc link Amway"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm (cách nhau bằng ,)</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={productNames}
                  onChange={(e) => setProductNames(e.target.value)}
                  placeholder="VD: Protein, BodyKey"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã sản phẩm (cách nhau bằng ,)</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={productCodes}
                  onChange={(e) => setProductCodes(e.target.value)}
                  placeholder="VD: 110415, 120843"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Từ khoá tự do (cách nhau bằng ,)</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={freeKeywords}
                  onChange={(e) => setFreeKeywords(e.target.value)}
                  placeholder="VD: sop, giảm cân, omega-3"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
              >
                Lưu tài nguyên
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Huỷ
              </button>
            </div>

            <div className="text-xs text-gray-500">
              Ghi chú: Ứng dụng nhúng/hiển thị nội dung dựa trên URL từ YouTube/Amway. Bạn tự chịu trách nhiệm tuân thủ quy định và bản quyền của nguồn.
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredResources.map(r => (
          <div key={r.id} className="bg-white rounded-lg shadow p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-semibold text-gray-800 break-words">{r.title}</h2>
                <div className="text-sm text-gray-500 mt-1">
                  Nguồn: {r.source === 'youtube' ? 'YouTube' : 'Amway Việt Nam'}
                  {r.author ? ` • ${r.author}` : ''}
                </div>
              </div>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm whitespace-nowrap"
              >
                Mở trang
              </a>
            </div>

            {r.source === 'youtube' && r.embedUrl && (
              <div className="mt-4">
                <div className="relative" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    title={r.title}
                    src={r.embedUrl}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {r.productCodes.map(code => (
                <span key={code} className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded">
                  Mã: {code}
                </span>
              ))}
              {r.productNames.slice(0, 3).map(name => (
                <span key={name} className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded">
                  {name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500 mt-6">
          Không tìm thấy tài nguyên phù hợp. Thử đổi từ khoá hoặc thêm tài nguyên của bạn.
        </div>
      )}
    </div>
  );
}

