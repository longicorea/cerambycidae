"use client";

import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { CollDataType } from "@src/data/collData";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface AdminDashboardProps {
  user: User;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_WORKER_API_URL || "https://cerambycidae-api.longicorea.workers.dev";

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [specimens, setSpecimens] = useState<CollDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSpecimen, setEditingSpecimen] = useState<CollDataType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 데이터 로드
  useEffect(() => {
    loadSpecimens();
  }, []);

  const loadSpecimens = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/specimens?includeHidden=true`);
      const data = await response.json();
      setSpecimens(data);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      setMessage({ type: "error", text: "데이터를 불러오는데 실패했습니다." });
    } finally {
      setLoading(false);
    }
  };

  // 검색 필터
  const filteredSpecimens = specimens.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.coll_id?.toLowerCase().includes(term) ||
      s.name_ko?.toLowerCase().includes(term) ||
      s.genus_name?.toLowerCase().includes(term) ||
      s.species_name?.toLowerCase().includes(term) ||
      s.location?.toLowerCase().includes(term)
    );
  });

  // 저장 (생성/수정)
  const handleSave = async (specimen: Partial<CollDataType>) => {
    try {
      const isNew = isCreating;
      const url = isNew
        ? `${API_BASE_URL}/api/specimens`
        : `${API_BASE_URL}/api/specimens/${specimen.coll_id}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(specimen),
      });

      if (!response.ok) {
        throw new Error("저장 실패");
      }

      setMessage({ type: "success", text: isNew ? "추가되었습니다." : "수정되었습니다." });
      setEditingSpecimen(null);
      setIsCreating(false);
      loadSpecimens();
    } catch (error) {
      console.error("저장 실패:", error);
      setMessage({ type: "error", text: "저장에 실패했습니다." });
    }
  };

  // 삭제
  const handleDelete = async (collId: string) => {
    if (!confirm(`정말 ${collId}를 삭제하시겠습니까?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/specimens/${collId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("삭제 실패");
      }

      setMessage({ type: "success", text: "삭제되었습니다." });
      loadSpecimens();
    } catch (error) {
      console.error("삭제 실패:", error);
      setMessage({ type: "error", text: "삭제에 실패했습니다." });
    }
  };

  // 메시지 자동 숨김
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            관리자 대시보드
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user.email}
            </span>
            {user.image && (
              <img
                src={user.image}
                alt=""
                className="w-8 h-8 rounded-full"
              />
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 알림 메시지 */}
      {message && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            message.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* 툴바 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="검색 (ID, 이름, 학명, 위치...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button
            onClick={() => {
              setIsCreating(true);
              setEditingSpecimen({
                id: "",
                coll_id: "",
                type: "",
                dna_identified: "",
                dna_accession_no: "",
                seq_identifier: "",
                coll_date: "",
                collector_name: "",
                family_name: "Cerambycidae",
                subfamily_name: "",
                tribe_name: "",
                genus_name: "",
                species_name: "",
                subspecies_name: "",
                name_ko: "",
                location: "",
                host: "",
                is_hidden: false,
              });
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + 새 표본 추가
          </button>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {specimens.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              전체 표본
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {specimens.filter((s) => s.imageFiles && s.imageFiles.length > 0).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              이미지 있음
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Set(specimens.map((s) => s.genus_name)).size}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              속 (Genus)
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Set(specimens.map((s) => `${s.genus_name} ${s.species_name}`)).size}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              종 (Species)
            </div>
          </div>
        </div>

        {/* 테이블 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      학명
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      국명
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      이미지
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSpecimens.slice(0, 100).map((specimen) => (
                    <tr
                      key={specimen.coll_id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">
                        {specimen.coll_id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white italic">
                        {specimen.genus_name} {specimen.species_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {specimen.name_ko || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {specimen.type || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            specimen.imageFiles && specimen.imageFiles.length > 0
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {specimen.imageFiles?.length || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm space-x-2">
                        <button
                          onClick={() => {
                            setIsCreating(false);
                            setEditingSpecimen(specimen);
                          }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(specimen.coll_id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredSpecimens.length > 100 && (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
                {filteredSpecimens.length}개 중 100개 표시
              </div>
            )}
          </div>
        )}
      </main>

      {/* 수정/추가 모달 */}
      {editingSpecimen && (
        <SpecimenModal
          specimen={editingSpecimen}
          isNew={isCreating}
          onSave={handleSave}
          onClose={() => {
            setEditingSpecimen(null);
            setIsCreating(false);
          }}
          onImageChange={loadSpecimens}
        />
      )}
    </div>
  );
}

// 수정/추가 모달 컴포넌트
function SpecimenModal({
  specimen,
  isNew,
  onSave,
  onClose,
  onImageChange,
}: {
  specimen: CollDataType;
  isNew: boolean;
  onSave: (data: Partial<CollDataType>) => void;
  onClose: () => void;
  onImageChange?: () => void;
}) {
  const [formData, setFormData] = useState(specimen);
  const [images, setImages] = useState(specimen.imageFiles || []);
  const [uploading, setUploading] = useState(false);
  const [imageMessage, setImageMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (field: keyof CollDataType, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // 이미지 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setImageMessage(null);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          `${API_BASE_URL}/api/specimens/${specimen.coll_id}/images`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`업로드 실패: ${file.name}`);
        }

        const data = await response.json();
        setImages((prev) => [...prev, data.image]);
      }
      setImageMessage({ type: "success", text: "이미지가 업로드되었습니다." });
      onImageChange?.();
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      setImageMessage({ type: "error", text: "이미지 업로드에 실패했습니다." });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // 이미지 삭제
  const handleImageDelete = async (imageKey: string) => {
    if (!confirm("이 이미지를 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/specimens/${specimen.coll_id}/images/${encodeURIComponent(imageKey)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("삭제 실패");
      }

      setImages((prev) => prev.filter((img) => img.key !== imageKey));
      setImageMessage({ type: "success", text: "이미지가 삭제되었습니다." });
      onImageChange?.();
    } catch (error) {
      console.error("이미지 삭제 실패:", error);
      setImageMessage({ type: "error", text: "이미지 삭제에 실패했습니다." });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full my-4 flex flex-col max-h-[calc(100vh-2rem)]">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isNew ? "새 표본 추가" : "표본 수정"}
          </h2>
        </div>

        <form id="specimen-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Collection ID *
              </label>
              <input
                type="text"
                value={formData.coll_id}
                onChange={(e) => handleChange("coll_id", e.target.value)}
                disabled={!isNew}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">선택</option>
                <option value="Larva">Larva</option>
                <option value="Pupa">Pupa</option>
                <option value="Adult">Adult</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Family
              </label>
              <input
                type="text"
                value={formData.family_name}
                onChange={(e) => handleChange("family_name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subfamily
              </label>
              <input
                type="text"
                value={formData.subfamily_name}
                onChange={(e) => handleChange("subfamily_name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tribe
              </label>
              <input
                type="text"
                value={formData.tribe_name}
                onChange={(e) => handleChange("tribe_name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Genus *
              </label>
              <input
                type="text"
                value={formData.genus_name}
                onChange={(e) => handleChange("genus_name", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Species *
              </label>
              <input
                type="text"
                value={formData.species_name}
                onChange={(e) => handleChange("species_name", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subspecies
              </label>
              <input
                type="text"
                value={formData.subspecies_name}
                onChange={(e) => handleChange("subspecies_name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              국명 (Korean Name)
            </label>
            <input
              type="text"
              value={formData.name_ko}
              onChange={(e) => handleChange("name_ko", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              채집 장소 (Location)
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                채집일 (Collection Date)
              </label>
              <input
                type="text"
                value={formData.coll_date}
                onChange={(e) => handleChange("coll_date", e.target.value)}
                placeholder="YYYY-MM-DD"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                채집자 (Collector)
              </label>
              <input
                type="text"
                value={formData.collector_name}
                onChange={(e) => handleChange("collector_name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              기주 (Host)
            </label>
            <input
              type="text"
              value={formData.host}
              onChange={(e) => handleChange("host", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                DNA Identified
              </label>
              <select
                value={formData.dna_identified}
                onChange={(e) => handleChange("dna_identified", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">선택</option>
                <option value="TRUE">TRUE</option>
                <option value="FALSE">FALSE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                DNA Accession No
              </label>
              <input
                type="text"
                value={formData.dna_accession_no}
                onChange={(e) => handleChange("dna_accession_no", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Seq Identifier
              </label>
              <input
                type="text"
                value={formData.seq_identifier}
                onChange={(e) => handleChange("seq_identifier", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_hidden"
              checked={formData.is_hidden === true}
              onChange={(e) => handleChange("is_hidden", e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="is_hidden" className="text-sm text-gray-700 dark:text-gray-300">
              숨김 처리 (비공개)
            </label>
          </div>

          {/* 이미지 관리 섹션 */}
          {!isNew && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  이미지 ({images.length})
                </h3>
                <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer flex items-center gap-2">
                  {uploading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      업로드 중...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                      </svg>
                      이미지 추가
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {imageMessage && (
                <div
                  className={`mb-3 px-4 py-2 rounded-lg text-sm ${
                    imageMessage.type === "success"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {imageMessage.text}
                </div>
              )}

              {images.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  등록된 이미지가 없습니다
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-2">
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {images.map((image) => (
                      <div
                        key={image.key}
                        className="relative group aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
                      >
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleImageDelete(image.key)}
                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                            title="삭제"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] p-1 truncate">
                          {image.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </form>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            취소
          </button>
          <button
            type="submit"
            form="specimen-form"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isNew ? "추가" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
