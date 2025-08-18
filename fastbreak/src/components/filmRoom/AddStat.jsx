import React from "react";
import "./AddStat.css";

const STAT_BUTTONS = [
    { label: "+2p Miss", value: "2p_miss" },
    { label: "2p Make", value: "2p_make" },
    { label: "3p Miss", value: "3p_miss" },
    { label: "3p Make", value: "3p_make" },
    { label: "FT Miss", value: "ft_miss" },
    { label: "FT Make", value: "ft_make" },
    { label: "OREB", value: "oreb" },
    { label: "DREB", value: "dreb" },
    { label: "AST", value: "ast" },
    { label: "TOV", value: "tov" },
    { label: "STL", value: "stl" },
    { label: "BLK", value: "blk" },
    { label: "FLS", value: "fls" },
    { label: "Substitution", value: "substitution" }
];

function AddStat({ selectedPlayer, onAddStat, starters = [], bench = [], allowOpponent = false, onSelectOpponent, isOpponentSelected }) {
    // Determine if selected player is on court
    const isOnCourt = selectedPlayer && starters && starters.map(String).includes(String(selectedPlayer.user_id));

    return (
        <div className="add-stat-panel">
            <div className="add-stat-selected">
                {selectedPlayer && !isOpponentSelected
                    ? <>Selected Player: <b>{selectedPlayer.name}</b></>
                    : isOpponentSelected
                        ? <>Selected: <b>Opponent</b></>
                        : <span style={{ color: "#888" }}>Select a player in the table below</span>
                }
            </div>
            {allowOpponent && (
                <button
                    className={`add-stat-btn add-stat-opponent-btn${isOpponentSelected ? ' selected' : ''}`}
                    style={{ marginBottom: 8, background: isOpponentSelected ? '#d32f2f' : undefined }}
                    onClick={onSelectOpponent}
                >
                    {isOpponentSelected ? 'Opponent Selected' : 'Select Opponent'}
                </button>
            )}
            <div className="add-stat-buttons">
                {STAT_BUTTONS.map(btn => (
                    <button
                        key={btn.value}
                        className="add-stat-btn"
                        disabled={
                            (!selectedPlayer && !isOpponentSelected && btn.value !== "substitution") ||
                            (btn.value === "substitution" && (!selectedPlayer || starters.map(String).includes(String(selectedPlayer.user_id))))
                        }
                        onClick={() => onAddStat && onAddStat(btn.value, isOpponentSelected ? { user_id: null, name: 'Opponent', is_opponent: true } : selectedPlayer)}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default AddStat;
