"use client";

import { useState } from "react";
import { usePlayers } from "./_hooks/usePlayers";
import type { Player } from "@/types";
import useAuthStore from "@/stores/useAuthStore";
import Button from "@/app/_components/Button/Button";
import SearchBar from "@/app/_components/SearchBar/SearchBar";
import PlayerCard from "./_components/PlayerCard";
import PositionFilter from "./_components/PositionFilter";
import PlayerFormModal from "./_components/PlayerFormModal";
import DeleteConfirmModal from "./_components/DeleteConfirmModal";
import PageContainer from "@/app/_components/PageContainer/PageContainer";
import styles from "./players.module.scss";

export default function PlayersPage() {
  const [addPlayerOpen, setAddPlayerOpen] = useState(false);
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Player | null>(null);
  const [search, setSearch] = useState("");
  const role = useAuthStore((s) => s.user?.role);
  const canEdit = role === "manager" || role === "coach";

  const {
    players,
    loading: playersLoading,
    positionFilter,
    setPositionFilter,
    deletePlayer,
    refetch,
  } = usePlayers();

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditPlayer = (player: Player) => {
    setEditPlayer(player);
    setAddPlayerOpen(true);
  };

  return (
    <>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>스쿼드 관리</h1>
          <p className={styles.headerDesc}>
            등록된 선수 {players.length}명을 분석 및 관리하고 있습니다.
          </p>
        </div>
        {canEdit && (
          <div className={styles.headerActions}>
            <Button
              icon="person_add"
              onClick={() => setAddPlayerOpen(true)}
            >
              선수 등록
            </Button>
          </div>
        )}
      </header>

      {/* Filters */}
      <div className={styles.tabsSection}>
        <div className={styles.filterRow}>
          <PositionFilter
            value={positionFilter}
            onChange={setPositionFilter}
          />
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="선수 검색..."
          />
        </div>
      </div>

      {/* Content */}
      {playersLoading ? (
        <PageContainer loading />
      ) : filteredPlayers.length === 0 ? (
        <div className={styles.emptyState}>
          {search ? "검색 결과가 없습니다." : "등록된 선수가 없습니다."}
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onEdit={handleEditPlayer}
              onDelete={(player) => setDeleteTarget(player)}
            />
          ))}
          {canEdit && !search && (
            <div
              className={styles.emptyCard}
              onClick={() => setAddPlayerOpen(true)}
            >
              <div className={styles.emptyIcon}>
                <span
                  className={`material-symbols-outlined ${styles.emptyIconInner}`}
                >
                  add
                </span>
              </div>
              <span className={styles.emptyText}>선수 추가</span>
            </div>
          )}
        </div>
      )}

      {/* Add Player Modal */}
      <PlayerFormModal
        isOpen={addPlayerOpen}
        onClose={() => {
          setAddPlayerOpen(false);
          setEditPlayer(null);
        }}
        onSuccess={refetch}
        editPlayer={editPlayer}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        playerName={deleteTarget?.name ?? ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deletePlayer(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />
    </>
  );
}
