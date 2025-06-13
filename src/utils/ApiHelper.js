// API Helper - Utility functions for API calls
const API_BASE_URL = 'http://localhost:3001/api';

class ApiHelper {
  // Get authorization headers
  static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Generic API call method
  static async apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed: ${endpoint}`, error);
      throw error;
    }
  }

  // User-related methods
  static async getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  static async updateUser(userId, userData) {
    return this.apiCall(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData)
    });
  }

  static async getUserFavorites(userId) {
    return this.apiCall(`/users/${userId}/favorites`);
  }

  static async addToFavorites(userId, itemId, itemType) {
    return this.apiCall(`/users/${userId}/favorites`, {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId, item_type: itemType })
    });
  }

  static async removeFromFavorites(userId, itemId) {
    return this.apiCall(`/users/${userId}/favorites/${itemId}`, {
      method: 'DELETE'
    });
  }

  // Foundation-related methods
  static async getFoundations() {
    return this.apiCall('/foundations');
  }

  static async getFoundation(foundationId) {
    return this.apiCall(`/foundations/${foundationId}`);
  }

  static async getFoundationByUser(userId) {
    return this.apiCall(`/foundations/user/${userId}`);
  }

  static async createFoundation(foundationData) {
    return this.apiCall('/foundations', {
      method: 'POST',
      body: JSON.stringify(foundationData)
    });
  }

  static async updateFoundation(foundationId, foundationData) {
    return this.apiCall(`/foundations/${foundationId}`, {
      method: 'PATCH',
      body: JSON.stringify(foundationData)
    });
  }

  // Opportunity-related methods
  static async getOpportunities() {
    return this.apiCall('/opportunities');
  }

  static async getOpportunity(opportunityId) {
    return this.apiCall(`/opportunities/${opportunityId}`);
  }

  static async getOpportunitiesByFoundation(foundationId) {
    return this.apiCall(`/opportunities/foundation/${foundationId}`);
  }

  static async createOpportunity(opportunityData) {
    return this.apiCall('/opportunities', {
      method: 'POST',
      body: JSON.stringify(opportunityData)
    });
  }

  static async updateOpportunity(opportunityId, opportunityData) {
    return this.apiCall(`/opportunities/${opportunityId}`, {
      method: 'PUT',
      body: JSON.stringify(opportunityData)
    });
  }

  static async deleteOpportunity(opportunityId) {
    return this.apiCall(`/opportunities/${opportunityId}`, {
      method: 'DELETE'
    });
  }

  static async applyToOpportunity(opportunityId, message) {
    return this.apiCall(`/opportunities/${opportunityId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }

  // Participation request methods
  static async getParticipationRequests() {
    return this.apiCall('/participation-requests');
  }

  static async getParticipationRequestsByUser(userId) {
    return this.apiCall(`/participation-requests/user/${userId}`);
  }

  static async getParticipationRequestsBySocialAction(socialActionId) {
    return this.apiCall(`/participation-requests/social-action/${socialActionId}`);
  }

  static async getPendingParticipationRequestsBySocialAction(socialActionId) {
    return this.apiCall(`/participation-requests/social-action/${socialActionId}/pending`);
  }

  static async updateParticipationRequest(requestId, status) {
    return this.apiCall(`/participation-requests/${requestId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // Donation-related methods
  static async getDonations() {
    return this.apiCall('/donations');
  }

  static async getDonationsByUser(userId) {
    return this.apiCall(`/donations/user/${userId}`);
  }

  static async getDonationsByFoundation(foundationId) {
    return this.apiCall(`/donations/foundation/${foundationId}`);
  }

  static async createDonation(donationData) {
    return this.apiCall('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData)
    });
  }

  // Comment-related methods
  static async getComments() {
    return this.apiCall('/comments');
  }

  static async getCommentsByUser(userId) {
    return this.apiCall(`/comments/user/${userId}`);
  }

  static async getCommentsByDonation(donationId) {
    return this.apiCall(`/comments/donation/${donationId}`);
  }

  static async getCommentsBySocialAction(socialActionId) {
    return this.apiCall(`/comments/social-action/${socialActionId}`);
  }

  static async getCommentsByOpportunity(opportunityId) {
    return this.apiCall(`/comments/opportunity/${opportunityId}`);
  }

  static async getCommentsByFoundation(foundationId) {
    return this.apiCall(`/comments/foundation/${foundationId}`);
  }

  static async createComment(commentData) {
    return this.apiCall('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  }

  static async createFoundationComment(commentData) {
    return this.apiCall('/foundation-detail/comment', {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  }

  // Rating-related methods
  static async getRatings() {
    return this.apiCall('/ratings');
  }

  static async getRatingsByUser(userId) {
    return this.apiCall(`/ratings/user/${userId}`);
  }

  static async getRatingsByDonation(donationId) {
    return this.apiCall(`/ratings/donation/${donationId}`);
  }

  static async getRatingsBySocialAction(socialActionId) {
    return this.apiCall(`/ratings/social-action/${socialActionId}`);
  }

  static async getRatingsByOpportunity(opportunityId) {
    return this.apiCall(`/ratings/opportunity/${opportunityId}`);
  }

  static async getAverageRatingForDonation(donationId) {
    return this.apiCall(`/ratings/donation/${donationId}/average`);
  }

  static async getAverageRatingForSocialAction(socialActionId) {
    return this.apiCall(`/ratings/social-action/${socialActionId}/average`);
  }

  static async getAverageRatingForOpportunity(opportunityId) {
    return this.apiCall(`/ratings/opportunity/${opportunityId}/average`);
  }

  static async createRating(ratingData) {
    return this.apiCall('/ratings', {
      method: 'POST',
      body: JSON.stringify(ratingData)
    });
  }

  // Notification-related methods
  static async getNotifications() {
    return this.apiCall('/notifications');
  }

  static async getNotificationsByUser(userId) {
    return this.apiCall(`/notifications/user/${userId}`);
  }

  static async getUnreadNotificationsByUser(userId) {
    return this.apiCall(`/notifications/user/${userId}/unread`);
  }

  static async markNotificationAsRead(notificationId) {
    return this.apiCall(`/notifications/${notificationId}/read`, {
      method: 'PATCH'
    });
  }

  static async markAllNotificationsAsRead() {
    return this.apiCall('/notifications/mark-all-read', {
      method: 'POST'
    });
  }

  static async markAllUserNotificationsAsRead(userId) {
    return this.apiCall(`/notifications/user/${userId}/mark-all-read`, {
      method: 'POST'
    });
  }

  static async createNotification(notificationData) {
    return this.apiCall('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData)
    });
  }

  // Certificate-related methods
  static async getCertificates() {
    return this.apiCall('/certificates');
  }

  static async getCertificatesByUser(userId) {
    return this.apiCall(`/certificates/user/${userId}`);
  }

  static async createCertificate(certificateData) {
    return this.apiCall('/certificates', {
      method: 'POST',
      body: JSON.stringify(certificateData)
    });
  }

  static async downloadCertificate(certificateId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}/download`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error downloading certificate');
    }

    return response.blob();
  }

  // Suggestion-related methods
  static async getSuggestions() {
    return this.apiCall('/suggestions');
  }

  static async getSuggestionsByUser(userId) {
    return this.apiCall(`/suggestions/user/${userId}`);
  }

  static async getUnprocessedSuggestions() {
    return this.apiCall('/suggestions/unprocessed');
  }

  static async createSuggestion(suggestionData) {
    return this.apiCall('/suggestions', {
      method: 'POST',
      body: JSON.stringify(suggestionData)
    });
  }

  static async markSuggestionAsProcessed(suggestionId) {
    return this.apiCall(`/suggestions/${suggestionId}/process`, {
      method: 'PATCH'
    });
  }

  // Authentication methods
  static async login(email, password) {
    return fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(response => {
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    });
  }

  static async register(userData) {
    return fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(response => {
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      return response.json();
    });
  }

  // File upload methods
  static async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload-documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Document upload failed');
    }

    return response.json();
  }

  static async uploadImage(image, type, entityId) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('type', type);
    formData.append('entity_id', entityId);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    return response.json();
  }

  // Report methods
  static async getReports() {
    return this.apiCall('/reports');
  }

  static async getDonationsByCategory() {
    return this.apiCall('/reports/donations-by-category');
  }

  static async getDonationsByDay() {
    return this.apiCall('/reports/donations-by-day');
  }
}

export default ApiHelper;