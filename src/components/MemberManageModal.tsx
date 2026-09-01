import React, { useState } from 'react';
import { Trip, Collaborator } from '../types';
import { Users, Plus, Edit2, Trash2, Check, X, Shield, AlertTriangle } from 'lucide-react';
import { GOOGLE_ANIMAL_PRESETS, AnimalAvatar, getAnimalByEmojiOrId } from './AnimalAvatar';

interface MemberManageModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTrip: (updatedTrip: Trip) => void;
}

const COLOR_PRESETS = [
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#EF4444', // Red
  '#64748B', // Slate
];

export const MemberManageModal: React.FC<MemberManageModalProps> = ({
  trip,
  isOpen,
  onClose,
  onUpdateTrip,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#3B82F6');
  const [editAvatar, setEditAvatar] = useState('🦊');

  // New member form
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3B82F6');
  const [newAvatar, setNewAvatar] = useState('🦊');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (member: Collaborator) => {
    setEditingId(member.id);
    setEditName(member.name);
    setEditColor(member.color || '#3B82F6');
    setEditAvatar(member.avatar);
    setErrorMessage('');
  };

  const handleSaveEdit = (memberId: string) => {
    const trimmed = editName.trim();
    if (!trimmed) {
      setErrorMessage('成員名稱不能為空');
      return;
    }

    const currentMember = trip.collaborators.find((c) => c.id === memberId);
    if (!currentMember) return;

    const oldName = currentMember.name;
    const isDuplicate = trip.collaborators.some(
      (c) => c.id !== memberId && c.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      setErrorMessage('已有相同名稱的成員，請使用不同名稱');
      return;
    }

    // Update member details
    const updatedCollaborators = trip.collaborators.map((c) => {
      if (c.id === memberId) {
        return {
          ...c,
          name: trimmed,
          color: editColor,
          avatar: editAvatar,
        };
      }
      return c;
    });

    // If name was changed, also cascade rename to all expenses!
    const updatedExpenses = trip.expenses.map((exp) => {
      let changed = false;
      let paidBy = exp.paidBy;
      let splitWith = [...exp.splitWith];

      if (paidBy === oldName) {
        paidBy = trimmed;
        changed = true;
      }

      if (splitWith.includes(oldName)) {
        splitWith = splitWith.map((n) => (n === oldName ? trimmed : n));
        changed = true;
      }

      return changed ? { ...exp, paidBy, splitWith } : exp;
    });

    onUpdateTrip({
      ...trip,
      collaborators: updatedCollaborators,
      expenses: updatedExpenses,
    });

    setEditingId(null);
    setErrorMessage('');
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) {
      setErrorMessage('請輸入成員名稱');
      return;
    }

    const isDuplicate = trip.collaborators.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setErrorMessage('已有相同名稱的成員，請使用不同名稱');
      return;
    }

    const newCollaborator: Collaborator = {
      id: `user-${Date.now()}`,
      name: trimmed,
      avatar: newAvatar,
      role: 'editor',
      isOnline: false,
      color: newColor,
    };

    onUpdateTrip({
      ...trip,
      collaborators: [...trip.collaborators, newCollaborator],
    });

    setNewName('');
    setIsAdding(false);
    setErrorMessage('');
  };

  const handleDeleteMember = (member: Collaborator) => {
    if (trip.collaborators.length <= 1) {
      alert('旅行至少需保留一位成員！');
      return;
    }

    // Check if member has existing expenses
    const paidCount = trip.expenses.filter((e) => e.paidBy === member.name).length;
    const splitCount = trip.expenses.filter((e) => e.splitWith.includes(member.name)).length;

    if (paidCount > 0) {
      alert(
        `無法直接刪除「${member.name}」，因為有 ${paidCount} 筆消費記錄是由此成員代付。請先將該消費記錄修改為其他人代付或刪除該消費項目。`
      );
      return;
    }

    const confirmMsg =
      splitCount > 0
        ? `確定要移除成員「${member.name}」嗎？此成員參與了 ${splitCount} 筆分攤，移除後系統將自動將其從相關消費的分攤名單中剔除並重新計算。`
        : `確定要移除成員「${member.name}」嗎？`;

    if (!window.confirm(confirmMsg)) return;

    const updatedCollaborators = trip.collaborators.filter((c) => c.id !== member.id);
    const updatedExpenses = trip.expenses.map((exp) => {
      if (exp.splitWith.includes(member.name)) {
        const newSplitWith = exp.splitWith.filter((n) => n !== member.name);
        return {
          ...exp,
          splitWith: newSplitWith.length > 0 ? newSplitWith : [exp.paidBy],
        };
      }
      return exp;
    });

    onUpdateTrip({
      ...trip,
      collaborators: updatedCollaborators,
      expenses: updatedExpenses,
    });
  };

  return (
    <div
      id="member-manage-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in"
    >
      <div
        id="member-manage-modal-card"
        className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 dark:border-neutral-700 overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Modal Header */}
        <div className="p-5 bg-stone-50 dark:bg-neutral-950 border-b border-stone-200 dark:border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary-50 dark:bg-primary-950/50 text-primary-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-white text-base">成員名單管理</h3>
              <p className="text-xs text-stone-500 dark:text-neutral-400">
                新增、修改或自訂同行夥伴，供記帳與分帳結算使用
              </p>
            </div>
          </div>
          <button
            id="btn-close-member-modal"
            onClick={onClose}
            className="p-1.5 text-stone-400 dark:text-neutral-500 hover:text-stone-700 dark:hover:text-neutral-200 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Add Button / Form */}
          {!isAdding ? (
            <button
              id="btn-show-add-member"
              onClick={() => {
                setIsAdding(true);
                setErrorMessage('');
              }}
              className="w-full py-2.5 px-4 bg-primary-50 dark:bg-primary-950/40 hover:bg-primary-100 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-300 border border-dashed border-primary-300 dark:border-primary-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>新增同行夥伴 (User)</span>
            </button>
          ) : (
            <form
              onSubmit={handleAddMember}
              id="form-add-member"
              className="p-4 bg-stone-50 dark:bg-neutral-950 rounded-xl border border-stone-200 dark:border-neutral-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 dark:text-neutral-300">新增夥伴資訊</span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-stone-400 hover:text-stone-600 dark:text-neutral-500"
                >
                  取消
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 dark:text-neutral-400 mb-1">
                  姓名 / 暱稱 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：王小明、Sarah、媽媽"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs bg-white dark:bg-neutral-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 dark:text-neutral-400 mb-1">
                  代表標籤色彩
                </label>
                <div className="flex items-center gap-2">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewColor(color)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        newColor === color ? 'scale-125 ring-2 ring-offset-2 ring-primary-500' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Avatar Preset Picker (Google Sheet Style Animals) */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 dark:text-neutral-400 mb-1">
                  選擇極簡動物頭像 (Google Sheet 風格)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 max-h-40 overflow-y-auto p-1 bg-white dark:bg-neutral-900 rounded-xl border border-stone-200 dark:border-neutral-800">
                  {GOOGLE_ANIMAL_PRESETS.map((animal) => {
                    const isSelected = newAvatar === animal.emoji || newAvatar === animal.id;
                    return (
                      <button
                        key={animal.id}
                        type="button"
                        onClick={() => {
                          setNewAvatar(animal.emoji);
                          setNewColor(animal.color);
                        }}
                        className={`flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 shadow-xs scale-105'
                            : 'border-transparent hover:bg-stone-50 dark:hover:bg-neutral-800 opacity-80 hover:opacity-100'
                        }`}
                        title={animal.name}
                      >
                        <AnimalAvatar avatar={animal.emoji} color={animal.color} size="md" />
                        <span className="text-[10px] font-bold text-stone-600 dark:text-neutral-400 mt-1 truncate">
                          {animal.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 dark:text-neutral-400 hover:bg-stone-200 dark:hover:bg-neutral-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
                >
                  確認新增
                </button>
              </div>
            </form>
          )}

          {/* Members List */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-stone-500 dark:text-neutral-400 px-1">
              現有成員名單 ({trip.collaborators.length} 人)
            </div>

            {trip.collaborators.map((member) => {
              const isEditing = editingId === member.id;
              const paidCount = trip.expenses.filter((e) => e.paidBy === member.name).length;
              const splitCount = trip.expenses.filter((e) => e.splitWith.includes(member.name)).length;

              return (
                <div
                  key={member.id}
                  id={`member-item-${member.id}`}
                  className="p-3 bg-stone-50 dark:bg-neutral-950 rounded-xl border border-stone-200 dark:border-neutral-800 flex flex-col gap-2.5 transition-all"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-700 dark:text-neutral-300">修改成員資訊</span>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-xs text-stone-400 hover:text-stone-600"
                        >
                          取消
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <AnimalAvatar avatar={editAvatar || member.avatar} color={editColor} size="lg" />
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="成員名稱"
                          className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-stone-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        />
                      </div>

                      {/* Color Picker */}
                      <div>
                        <div className="text-[11px] font-bold text-stone-500 dark:text-neutral-400 mb-1">標籤色彩</div>
                        <div className="flex items-center gap-2">
                          {COLOR_PRESETS.map((col) => (
                            <button
                              key={col}
                              type="button"
                              onClick={() => setEditColor(col)}
                              className={`w-5 h-5 rounded-full transition-transform ${
                                editColor === col ? 'scale-125 ring-2 ring-offset-2 ring-primary-500' : 'hover:scale-110'
                              }`}
                              style={{ backgroundColor: col }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Avatar Picker */}
                      <div>
                        <div className="text-[11px] font-bold text-stone-500 dark:text-neutral-400 mb-1">更換動物頭像</div>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 max-h-36 overflow-y-auto p-1 bg-white dark:bg-neutral-900 rounded-xl border border-stone-200 dark:border-neutral-800">
                          {GOOGLE_ANIMAL_PRESETS.map((animal) => {
                            const isSelected = editAvatar === animal.emoji || editAvatar === animal.id;
                            return (
                              <button
                                key={animal.id}
                                type="button"
                                onClick={() => {
                                  setEditAvatar(animal.emoji);
                                  setEditColor(animal.color);
                                }}
                                className={`flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all ${
                                  isSelected
                                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 shadow-xs scale-105'
                                    : 'border-transparent hover:bg-stone-50 dark:hover:bg-neutral-800 opacity-80 hover:opacity-100'
                                }`}
                                title={animal.name}
                              >
                                <AnimalAvatar avatar={animal.emoji} color={animal.color} size="sm" />
                                <span className="text-[10px] font-bold text-stone-600 dark:text-neutral-400 mt-0.5 truncate">
                                  {animal.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1 border-t border-stone-200 dark:border-neutral-800">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 dark:text-neutral-400 hover:bg-stone-200 dark:hover:bg-neutral-800"
                        >
                          取消
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(member.id)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-sm flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>儲存變更</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AnimalAvatar avatar={member.avatar} name={member.name} color={member.color} size="md" />

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-900 dark:text-white">
                              {member.name}
                            </span>
                            {member.role === 'owner' && (
                              <span className="text-[10px] bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                <Shield className="w-2.5 h-2.5" />
                                創建者
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-400 dark:text-neutral-500 mt-0.5">
                            代付 {paidCount} 筆 • 參與分攤 {splitCount} 筆
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          id={`btn-edit-member-${member.id}`}
                          onClick={() => handleStartEdit(member)}
                          className="p-1.5 text-stone-500 hover:text-primary-600 hover:bg-white dark:hover:bg-neutral-800 rounded-lg transition-all"
                          title="修改姓名與頭像"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {trip.collaborators.length > 1 && (
                          <button
                            id={`btn-delete-member-${member.id}`}
                            onClick={() => handleDeleteMember(member)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all"
                            title="刪除成員"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 dark:bg-neutral-950 border-t border-stone-200 dark:border-neutral-700 flex justify-end">
          <button
            id="btn-done-member-modal"
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-black dark:bg-white dark:text-stone-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
