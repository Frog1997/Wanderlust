export function exportAllData() {
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('travel_planner_') || key.startsWith('travel_weather_'))) {
      data[key] = localStorage.getItem(key) || '';
    }
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wanderlust_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importAllData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (typeof data !== 'object' || data === null) return false;
    
    // Validate if it's a valid backup by checking for expected keys
    let hasValidKeys = false;
    for (const key of Object.keys(data)) {
      if (key.startsWith('travel_planner_') || key.startsWith('travel_weather_')) {
        hasValidKeys = true;
        break;
      }
    }
    
    if (!hasValidKeys) return false;

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        localStorage.setItem(key, value);
      }
    }
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
}
