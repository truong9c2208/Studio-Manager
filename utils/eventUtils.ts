import type { Event } from '../types';

export const getEventStatus = (event: { startDate: string, endDate: string }): Event['status'] => {
    const today = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (today < startDate) {
        return 'Upcoming';
    } else if (today >= startDate && today <= endDate) {
        return 'Ongoing';
    } else {
        return 'Completed';
    }
};
