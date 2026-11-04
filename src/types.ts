export interface InvitationDetails {
  graduateName: string;
  studentId: string;
  degree: string;
  major: string;
  university: string;
  dateStr: string;
  session: string;
  checkinTime: string;
  ceremonyTime: string;
  seatNumber: string;
  parentArea: string;
  parentSeats: string;
  venueName: string;
  address: string;
  mapsUrl: string;
  countdownTarget: string; // ISO string 2026-11-07T07:00:00+07:00
  photoUrl: string;
  officialInvitationImage: string;
  campusImageUrl?: string;
}

export interface ScheduleStep {
  time: string;
  title: string;
  titleVi: string;
  description: string;
  highlight?: boolean;
}

export interface VisualizerPreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  ringGlow: string;
}
