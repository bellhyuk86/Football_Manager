"use client";

import { useState } from "react";
import { usePlayers } from "./_hooks/usePlayers";
import { useFormations } from "./_hooks/useFormations";
import type { Player } from "@/types";
import useAuthStore from "@/stores/useAuthStore";
import Button from "@/app/_components/Button/Button";
import SearchBar from "@/app/_components/SearchBar/SearchBar";
import PlayerCard from "./_components/PlayerCard";
import FormationCard from "./_components/FormationCard";
import PositionFilter from "./_components/PositionFilter";
import PlayerFormModal from "./_components/PlayerFormModal";
import DeleteConfirmModal from "./_components/DeleteConfirmModal";
import styles from "./players.module.scss";

type Tab = "players" | "formations";

export default function PlayersPage() {
  const [tab, setTab] = useState<Tab>("players");
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

  const { formations, loading: formationsLoading } = useFormations();

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
            {tab === "players"
              ? `등록된 선수 ${players.length}명을 분석 및 관리하고 있습니다.`
              : "전술 프레임워크를 분석하고 배치하세요."}
          </p>
        </div>
        {tab === "players" && canEdit && (
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

      {/* Tabs & Filters */}
      <div className={styles.tabsSection}>
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabBtn} ${
              tab === "players" ? styles.tabBtnActive : ""
            }`}
            onClick={() => setTab("players")}
          >
            선수 리스트
          </button>
          <button
            className={`${styles.tabBtn} ${
              tab === "formations" ? styles.tabBtnActive : ""
            }`}
            onClick={() => setTab("formations")}
          >
            포메이션 리스트
          </button>
        </div>

        {tab === "players" && (
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
        )}
      </div>

      {/* Content */}
      {tab === "players" ? (
        <>
          {playersLoading ? (
            <div className={styles.loadingState}>선수 목록을 불러오는 중...</div>
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
        </>
      ) : (
        <>
          {formationsLoading ? (
            <div className={styles.loadingState}>
              포메이션 목록을 불러오는 중...
            </div>
          ) : formations.length === 0 ? (
            <div className={styles.emptyState}>
              저장된 포메이션이 없습니다.
            </div>
          ) : (
            <div className={styles.cardGrid}>
              {formations.map((formation) => (
                <FormationCard key={formation.id} formation={formation} />
              ))}
              <div className={styles.formationEmptyCard}>
                <div className={styles.formationEmptyIcon}>
                  <span
                    className={`material-symbols-outlined ${styles.formationEmptyIconInner}`}
                  >
                    add_circle
                  </span>
                </div>
                <span className={styles.formationEmptyTitle}>
                  새 포메이션 만들기
                </span>
                <p className={styles.formationEmptyDesc}>
                  전술을 설계하세요
                </p>
              </div>
            </div>
          )}
        </>
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
