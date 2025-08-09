// api/notificationApi.ts
export const getAllNotifications = async (token: string, page: number, size: number): Promise<any> => {
    const response = await fetch(`http://localhost:8080/api/v1/notifications/get-all-notifications?page=${page}&size=${size}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  };
  
  export const markNotificationAsRead = async (token: string, notificationId: number): Promise<void> => {
    const response = await fetch(`http://localhost:8080/api/v1/notifications/mark-as-read/${notificationId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
  };