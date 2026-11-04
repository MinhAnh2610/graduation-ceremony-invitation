import { InvitationDetails } from '../types';

export function createGoogleCalendarUrl(details: InvitationDetails): string {
  const title = encodeURIComponent(`🎓 Lễ Tốt Nghiệp FPT University · ${details.graduateName} (${details.studentId})`);
  const desc = encodeURIComponent(
    `Trân trọng kính mời tham dự Lễ Trao Bằng Tốt Nghiệp của Tân Cử Nhân ${details.graduateName} (${details.degree}).\n\n- Thời gian: ${details.dateStr} (Ca 1: ${details.checkinTime} Check-in, ${details.ceremonyTime} Lễ trao bằng)\n- Số ghế tân cử nhân: ${details.seatNumber}\n- Vị trí phụ huynh: ${details.parentArea} (${details.parentSeats})\n- Địa điểm: ${details.venueName}\n- Địa chỉ: ${details.address}\n- Bản đồ Google Maps: ${details.mapsUrl}`
  );
  const location = encodeURIComponent(`${details.venueName}, ${details.address}`);

  // 2026-11-07 07:00:00 to 2026-11-07 10:00:00 (Vietnam Time UTC+7: 00:00Z to 03:00Z)
  const dates = '20261107T000000Z/20261107T030000Z';

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${desc}&location=${location}&dates=${dates}`;
}

export function downloadIcsFile(details: InvitationDetails) {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FPT University Graduation Ceremony//VI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:🎓 Lễ Tốt Nghiệp FPT University · ${details.graduateName}`,
    `DESCRIPTION:Lễ Trao Bằng Tốt Nghiệp cho Tân Cử Nhân ${details.graduateName} (${details.degree}) - Số ghế ${details.seatNumber}.`,
    `LOCATION:${details.venueName}\\, ${details.address}`,
    'DTSTART:20261107T000000Z',
    'DTEND:20261107T030000Z',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'DESCRIPTION:Nhắc nhở: Lễ Tốt Nghiệp ngày mai tại FPT University',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Le_Tot_Nghiep_${details.graduateName.replace(/\s+/g, '_')}_FPTU.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
