import { Trip } from '../types';
import { formatMoney } from './currency';

export async function exportTripToPDF(trip: Trip): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const totalSpent = trip.expenses.reduce((acc, curr) => acc + curr.convertedAmount, 0);
      const remaining = trip.totalBudget - totalSpent;

      const printWindow = window.open('', '_blank', 'width=800,height=900');
      if (!printWindow) {
        throw new Error("Unable to open print window. Please allow popups.");
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="zh-TW">
        <head>
          <meta charset="UTF-8">
          <title>${trip.title} - 行程手冊</title>
          <style>
            :root {
              --primary: #4f46e5;
              --bg: #ffffff;
              --text: #1e293b;
              --text-light: #64748b;
              --border: #e2e8f0;
              --surface: #f8fafc;
            }
            body {
              font-family: 'Helvetica Neue', 'Arial', 'PingFang TC', 'Microsoft JhengHei', sans-serif;
              color: var(--text);
              margin: 0;
              padding: 0;
              line-height: 1.6;
              background: #f1f5f9;
            }
            .page {
              background: var(--bg);
              margin: 20px auto;
              padding: 40px;
              max-width: 800px;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            }
            .header {
              background: var(--text);
              color: #ffffff;
              padding: 30px 40px;
              margin: -40px -40px 30px -40px;
              border-radius: 0 0 16px 16px;
            }
            .header h1 {
              margin: 0 0 10px 0;
              font-size: 28px;
            }
            .header p {
              margin: 0;
              font-size: 14px;
              opacity: 0.9;
            }
            h2 {
              color: var(--primary);
              border-bottom: 2px solid var(--border);
              padding-bottom: 8px;
              margin-top: 30px;
            }
            .card {
              background: var(--surface);
              border: 1px solid var(--border);
              border-radius: 12px;
              padding: 16px;
              margin-bottom: 16px;
              page-break-inside: avoid;
            }
            .card-title {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 4px;
            }
            .card-subtitle {
              font-size: 14px;
              color: var(--text-light);
            }
            .day-header {
              background: #eef2ff;
              color: var(--primary);
              padding: 12px 16px;
              border-radius: 8px;
              font-weight: bold;
              margin: 24px 0 16px 0;
              page-break-after: avoid;
            }
            .timeline-item {
              display: flex;
              gap: 16px;
              margin-bottom: 16px;
              page-break-inside: avoid;
            }
            .time {
              font-weight: bold;
              min-width: 60px;
              color: var(--text);
            }
            .content {
              flex: 1;
            }
            .location {
              font-size: 14px;
              color: var(--text-light);
              margin-bottom: 4px;
            }
            .notes {
              font-size: 13px;
              background: #f1f5f9;
              padding: 8px;
              border-radius: 6px;
              color: var(--text-light);
            }
            .transport {
              font-size: 13px;
              color: #818cf8;
              font-weight: bold;
              margin-top: 8px;
            }
            .budget-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 16px;
            }
            .budget-item {
              text-align: center;
              padding: 16px;
              background: var(--surface);
              border-radius: 8px;
              border: 1px solid var(--border);
            }
            .budget-val {
              font-size: 18px;
              font-weight: bold;
              color: var(--text);
              margin-top: 8px;
            }
            @media print {
              body { background: white; }
              .page { box-shadow: none; margin: 0; padding: 0; }
              .header { border-radius: 0; margin: 0 0 30px 0; padding: 20px 0; background: transparent; color: black; border-bottom: 3px solid black; }
              h2 { color: black; }
              .day-header { background: #f8f9fa; color: black; border: 1px solid #dee2e6; }
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <h1>${trip.title}</h1>
              <p>目的地: ${trip.destination} | 日期: ${trip.startDate} ~ ${trip.endDate} | 群組代碼: ${trip.shareCode}</p>
            </div>

            ${trip.flights.length > 0 ? `
              <h2>✈️ 航班資訊</h2>
              ${trip.flights.map(fl => `
                <div class="card">
                  <div class="card-title">${fl.flightNumber} (${fl.airline})</div>
                  <div class="card-subtitle">
                    出發: ${fl.departureCity} (${fl.departureAirport}) - ${fl.departureTime}<br/>
                    抵達: ${fl.arrivalCity} (${fl.arrivalAirport}) - ${fl.arrivalTime}<br/>
                    登機門: ${fl.gate || '未定'} | 座位: ${fl.seat || '未定'} | 轉盤: ${fl.baggageClaim || '未定'}
                  </div>
                </div>
              `).join('')}
            ` : ''}

            <h2>📅 每日行程</h2>
            ${trip.days.map(day => `
              <div class="day-header">
                Day ${day.dayNumber} (${day.date}) - ${day.themeTitle || '自由行程'}
              </div>
              ${day.items.length === 0 ? '<p style="color: #64748b; font-style: italic; margin-left: 16px;">本日尚無安排行程</p>' : ''}
              ${day.items.map(item => `
                <div class="timeline-item">
                  <div class="time">${item.time}</div>
                  <div class="content">
                    <div style="font-weight: bold;">${item.title}</div>
                    <div class="location">📍 ${item.locationName || '未指定地點'}</div>
                    ${item.notes ? `<div class="notes">📝 ${item.notes}</div>` : ''}
                    ${item.transportToNext ? `<div class="transport">↓ 前往下一站: ${item.transportToNext.mode} (約 ${item.transportToNext.durationMinutes} 分鐘)</div>` : ''}
                  </div>
                </div>
              `).join('')}
            `).join('')}

            <h2>💰 預算總覽</h2>
            <div class="budget-grid">
              <div class="budget-item">
                <div style="font-size: 13px; color: var(--text-light);">總預算</div>
                <div class="budget-val">${formatMoney(trip.totalBudget, trip.baseCurrency)}</div>
              </div>
              <div class="budget-item">
                <div style="font-size: 13px; color: var(--text-light);">已花費</div>
                <div class="budget-val" style="color: #e11d48;">${formatMoney(totalSpent, trip.baseCurrency)}</div>
              </div>
              <div class="budget-item">
                <div style="font-size: 13px; color: var(--text-light);">剩餘預算</div>
                <div class="budget-val" style="color: #10b981;">${formatMoney(remaining, trip.baseCurrency)}</div>
              </div>
            </div>
            
            <div style="margin-top: 40px; text-align: center; color: var(--text-light); font-size: 12px; border-top: 1px solid var(--border); padding-top: 16px;">
              由 Wanderlust 旅遊規劃工具產生
            </div>
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                window.onafterprint = () => window.close();
              }, 500);
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}
