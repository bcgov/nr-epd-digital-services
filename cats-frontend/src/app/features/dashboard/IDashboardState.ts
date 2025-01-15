interface IDashboard {
  recentView: [];
  recentFolios: [];
  recentAssigned: [];
}

export interface IDashboardState {
  dashboard: IDashboard;
  error?: string;
  status: string;
}
