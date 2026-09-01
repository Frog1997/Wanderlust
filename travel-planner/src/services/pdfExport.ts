import jsPDF from 'jspdf';
import { Trip } from '../types';
import { formatMoney } from './currency';

export async function exportTripToPDF(trip: Trip): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header Banner
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(trip.title, 15, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Destination: ${trip.destination}  |  Dates: ${trip.startDate} ~ ${trip.endDate}  |  Code: ${trip.shareCode}`,
    15,
    30
  );

  y = 50;

  // Flights & Travel Briefing
  if (trip.flights && trip.flights.length > 0) {
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Flight & Travel Info', 15, y);
    y += 8;

    trip.flights.forEach((fl) => {
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(15, y, pageWidth - 30, 16, 2, 2, 'F');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${fl.flightNumber} (${fl.airline})`, 20, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(
        `${fl.departureCity} (${fl.departureAirport}) ${fl.departureTime}  ->  ${fl.arrivalCity} (${fl.arrivalAirport}) ${fl.arrivalTime}`,
        20,
        y + 12
      );
      doc.text(`Gate: ${fl.gate || 'TBD'} | Seat: ${fl.seat || 'TBD'}`, pageWidth - 60, y + 6);
      y += 20;
    });
  }

  // Daily Itinerary
  y += 5;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Daily Itinerary Schedule', 15, y);
  y += 8;

  trip.days.forEach((day) => {
    // Check if new page is needed
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(238, 242, 255); // Indigo-50
    doc.roundedRect(15, y, pageWidth - 30, 9, 1, 1, 'F');
    doc.setTextColor(67, 56, 202);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Day ${day.dayNumber} (${day.date}): ${day.themeTitle}`, 20, y + 6);
    y += 13;

    if (day.items.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('No scheduled activities for this day.', 20, y);
      y += 8;
    } else {
      day.items.forEach((item, idx) => {
        if (y > 265) {
          doc.addPage();
          y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(`${item.time} - ${item.title}`, 22, y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(`Location: ${item.locationName}`, 22, y + 5);

        if (item.notes) {
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text(`Note: ${item.notes.substring(0, 75)}${item.notes.length > 75 ? '...' : ''}`, 22, y + 9);
          y += 14;
        } else {
          y += 10;
        }

        if (item.transportToNext) {
          doc.setTextColor(129, 140, 248);
          doc.setFontSize(8);
          doc.text(`↓ ${item.transportToNext.mode.toUpperCase()} ~${item.transportToNext.durationMinutes} mins`, 30, y);
          y += 6;
        }
      });
    }

    y += 5;
  });

  // Budget & Summary Section
  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, pageWidth - 30, 35, 2, 2, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Budget & Expenses Summary', 20, y + 8);

  const totalSpent = trip.expenses.reduce((acc, curr) => acc + curr.convertedAmount, 0);
  const remaining = trip.totalBudget - totalSpent;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Total Budget: ${formatMoney(trip.totalBudget, trip.baseCurrency)}`, 20, y + 16);
  doc.text(`Total Expenses Logged: ${formatMoney(totalSpent, trip.baseCurrency)}`, 20, y + 23);
  doc.text(`Remaining Balance: ${formatMoney(remaining, trip.baseCurrency)}`, 20, y + 30);

  // Footer on each page
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Generated with Travel Planner App  |  Page ${i} of ${totalPages}  |  Trip Code: ${trip.shareCode}`,
      15,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  doc.save(`${trip.title.replace(/\s+/g, '_')}_Itinerary.pdf`);
}
