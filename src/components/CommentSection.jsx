import React, { useState, useEffect, useCallback } from "react";
import { Card, Form, Button, ListGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import RatingStars from "./RatingStars";

const CommentSection = ({ itemId, itemType, user }) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint =
        itemType === "foundation"
          ? `http://localhost:3001/api/comments/foundation/${itemId}`
          : `http://localhost:3001/api/comments/opportunity/${itemId}`;

      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, [itemId, itemType]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert(t("comments.loginRequired"));
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      // Submit comment
      if (newComment.trim()) {
        const commentData = {
          user_id: user.id,
          text: newComment,
          ...(itemType === "foundation"
            ? { foundation_id: itemId }
            : { social_action_id: itemId }),
        };

        const commentResponse = await fetch(
          "http://localhost:3001/api/comments",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(commentData),
          }
        );

        if (!commentResponse.ok && commentResponse.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          window.location.href = "/login";
          return;
        }
      }

      // Submit rating
      const ratingData = {
        user_id: user.id,
        rating: newRating,
        ...(itemType === "foundation"
          ? { foundation_id: itemId }
          : { social_action_id: itemId }),
      };

      const ratingResponse = await fetch("http://localhost:3001/api/ratings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingData),
      });

      if (!ratingResponse.ok && ratingResponse.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        window.location.href = "/login";
        return;
      }

      setNewComment("");
      setNewRating(5);
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert(t("comments.submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>{t("common.loading")}</div>;

  // Función para formatear la fecha o devolver null si es inválida
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    // Verifica si la fecha es válida
    if (isNaN(date.getTime())) return null;
    
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <Card.Header>
        <h5>{t("comments.title")}</h5>
      </Card.Header>
      <Card.Body>
        {/* Comment Form */}
        {user && (
          <Form onSubmit={handleSubmitComment} className="mb-4">
            <Form.Group className="mb-3">
              <Form.Label>{t("comments.rating")}</Form.Label>
              <div>
                <RatingStars rating={newRating} onRatingChange={setNewRating} />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t("comments.writeComment")}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t("comments.placeholder")}
                required
              />
            </Form.Group>

            <Button type="submit" disabled={submitting}>
              {submitting ? t("common.submitting") : t("comments.submit")}
            </Button>
          </Form>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-muted text-center">{t("comments.noComments")}</p>
        ) : (
          <ListGroup variant="flush">
            {comments.map((comment) => (
              <ListGroup.Item key={comment.id}>
                <div className="d-flex justify-content-between">
                  <strong>
                    {comment.user?.name || t("common.anonymousUser")}
                  </strong>
                  {formatDate(comment.created_at) && (
                    <small className="text-muted">
                      {formatDate(comment.created_at)}
                    </small>
                  )}
                </div>
                <p className="mt-2 mb-0">{comment.text}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default CommentSection;