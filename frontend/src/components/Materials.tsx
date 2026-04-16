import { type FC, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { FileText, Download, Upload, Loader2 } from 'lucide-react';

interface Material {
  id: number;
  fileName: string;
  fileType: string;
  uploadDate: string;
}

const Materials: FC<{ subjectId: number, isFaculty: boolean }> = ({ subjectId, isFaculty }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchMaterials = useCallback(async () => {
    try {
      const res = await api.get(`/materials/subject/${subjectId}`);
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [subjectId]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setMsg('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subjectId', subjectId.toString());
    formData.append('facultyId', '1'); // In real app, get from auth context

    try {
      await api.post('/materials/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg('Uploaded successfully!');
      setFile(null);
      fetchMaterials();
    } catch {
      setMsg('Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (id: number) => {
    window.open(`http://localhost:8080/api/materials/download/${id}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-indigo-600" />
          Study Materials
        </h3>
      </div>

      {isFaculty && (
        <form onSubmit={handleUpload} className="mb-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <div className="flex items-center space-x-3">
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <button 
              disabled={!file || isUploading}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:bg-slate-300 transition"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
              Upload
            </button>
          </div>
          {msg && <p className={`text-xs mt-2 ${msg.includes('success') ? 'text-emerald-600' : 'text-rose-600'}`}>{msg}</p>}
        </form>
      )}

      <div className="space-y-3">
        {materials.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No materials uploaded yet.</p>
        ) : (
          materials.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-3 h-14 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 truncate max-w-[150px]">{m.fileName}</p>
                  <p className="text-[10px] text-slate-400">{new Date(m.uploadDate).toLocaleDateString()}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDownload(m.id)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Materials;
