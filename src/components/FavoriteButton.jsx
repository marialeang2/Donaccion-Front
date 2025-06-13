import React, { useState, useEffect, useCallback } from "react";
import { Button } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const FavoriteButton = ({
  item,
  itemType,
  user,
  variant = "outline-light",
}) => {
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/users/${user.id}/favorites`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          window.location.href = "/login";
          return;
        }
        throw new Error("Error checking favorite status");
      }

      const favorites = await response.json();
      const isFav = favorites.some(
        (fav) => fav.item_id === item.id && fav.item_type === itemType
      );
      setIsFavorite(isFav);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  }, [user?.id, item.id, itemType]);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, item.id, checkFavoriteStatus]);

  const toggleFavorite = async () => {
    if (!user) {
      alert(t("favorites.loginRequired"));
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(
          `http://localhost:3001/api/users/${user.id}/favorites/${item.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            window.location.href = "/login";
            return;
          }
          throw new Error("Error removing favorite");
        }

        setIsFavorite(false);
      } else {
        // Add to favorites
        const response = await fetch(
          `http://localhost:3001/api/users/${user.id}/favorites`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              item_id: item.id,
              item_type: itemType,
            }),
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            window.location.href = "/login";
            return;
          }
          throw new Error("Error adding favorite");
        }

        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isFavorite ? "light" : variant}
      onClick={toggleFavorite}
      disabled={loading}
      className={`d-flex align-items-center ${isFavorite ? "text-danger" : ""}`}
      style={{
        minWidth: "auto",
        aspectRatio: "1",
        borderRadius: "50%",
        padding: "0.75rem",
      }}
    >
      {loading ? (
        <i className="fas fa-spinner fa-spin"></i>
      ) : isFavorite ? (
        <FaHeart size={20} />
      ) : (
        <FaRegHeart size={20} />
      )}
    </Button>
  );
};

export default FavoriteButton;
