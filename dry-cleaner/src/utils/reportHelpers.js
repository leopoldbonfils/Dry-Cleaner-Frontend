import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate } from './helpers';

/**
 * Generate and download a PDF report with client details
 * Detailed Orders Report comes FIRST
 */
export const generatePDFReport = (reportData, reportType) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const primaryColor = [59, 130, 246]; // Blue
  const secondaryColor = [139, 148, 158]; // Gray
  const textColor = [30, 41, 59]; // Dark text
  
  let yPosition = 20;

  // ===== HEADER =====
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.circle(15, yPosition, 5, 'F');
  
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('CleanPro Dry Cleaning', 23, yPosition + 2);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  const reportTitle = getReportTitle(reportType);
  doc.text(reportTitle, 23, yPosition + 8);
  
  const dateRangeText = `${formatDate(reportData.dateRange.startDate)} - ${formatDate(reportData.dateRange.endDate)}`;
  doc.text(dateRangeText, 23, yPosition + 14);
  
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 15, yPosition, { align: 'right' });
  
  yPosition = 45;

  // ===== DETAILED ORDERS REPORT (FIRST SECTION) =====
  if (reportData.orders && reportData.orders.length > 0) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('DETAILED ORDERS REPORT', 15, yPosition);
    
    yPosition += 10;

    const ordersData = reportData.orders.map(order => {
      const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
      const clientInfo = `${order.clientName}\n${order.clientPhone}${order.clientEmail ? `\n${order.clientEmail}` : ''}`;
      
      return [
        order.orderCode,
        clientInfo,
        `${itemsCount} items`,
        order.status,
        order.paymentMethod,
        order.paymentStatus,
        formatCurrency(order.totalAmount)
      ];
    });

    doc.autoTable({
      startY: yPosition,
      head: [['Order Code', 'Client Information', 'Items', 'Status', 'Payment Method', 'Payment Status', 'Amount']],
      body: ordersData,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: textColor,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      margin: { left: 15, right: 15 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 40 },
        2: { cellWidth: 18 },
        3: { cellWidth: 22 },
        4: { cellWidth: 25 },
        5: { cellWidth: 22 },
        6: { cellWidth: 23 }
      }
    });

    yPosition = doc.lastAutoTable.finalY + 15;
  }

  // Add new page for summary sections
  doc.addPage();
  yPosition = 20;

  // ===== SUMMARY SECTION =====
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('SUMMARY', 15, yPosition);
  
  yPosition += 10;

  const summaryData = [
    ['Total Orders', reportData.totalOrders.toString()],
    ['Total Revenue', formatCurrency(reportData.totalRevenue)],
    ['Paid Revenue', formatCurrency(reportData.paidRevenue)],
    ['Unpaid Amount', formatCurrency(reportData.unpaidRevenue)],
    ['Partial Payments', formatCurrency(reportData.partialRevenue)]
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 11
    },
    bodyStyles: {
      fontSize: 10,
      textColor: textColor
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    margin: { left: 15, right: 15 }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // ===== PAYMENT STATUS BREAKDOWN =====
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT STATUS', 15, yPosition);
  
  yPosition += 10;

  const paymentData = [
    ['Paid Orders', `${reportData.paidOrders} (${formatCurrency(reportData.paidRevenue)})`],
    ['Unpaid Orders', `${reportData.unpaidOrders} (${formatCurrency(reportData.unpaidRevenue)})`],
    ['Partial Payments', `${reportData.partialOrders} (${formatCurrency(reportData.partialRevenue)})`]
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['Status', 'Count (Amount)']],
    body: paymentData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 11
    },
    bodyStyles: {
      fontSize: 10,
      textColor: textColor
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    margin: { left: 15, right: 15 }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // Check if new page is needed
  if (yPosition > 220) {
    doc.addPage();
    yPosition = 20;
  }

  // ===== ORDER STATUS BREAKDOWN =====
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDER STATUS', 15, yPosition);
  
  yPosition += 10;

  const statusData = Object.entries(reportData.statusBreakdown).map(([status, count]) => [
    status,
    count.toString()
  ]);

  doc.autoTable({
    startY: yPosition,
    head: [['Status', 'Count']],
    body: statusData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 11
    },
    bodyStyles: {
      fontSize: 10,
      textColor: textColor
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    margin: { left: 15, right: 15 }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // Check if new page is needed
  if (yPosition > 220) {
    doc.addPage();
    yPosition = 20;
  }

  // ===== PAYMENT METHODS =====
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT METHODS', 15, yPosition);
  
  yPosition += 10;

  const methodsData = Object.entries(reportData.paymentMethods).map(([method, count]) => [
    method,
    count.toString()
  ]);

  doc.autoTable({
    startY: yPosition,
    head: [['Method', 'Count']],
    body: methodsData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 11
    },
    bodyStyles: {
      fontSize: 10,
      textColor: textColor
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    margin: { left: 15, right: 15 }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // ===== TOP ITEMS =====
  if (reportData.topItems && reportData.topItems.length > 0) {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TOP ITEMS', 15, yPosition);
    
    yPosition += 10;

    const topItemsData = reportData.topItems.map((item, index) => [
      `#${index + 1}`,
      item.type,
      `${item.quantity} pieces`
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Rank', 'Item Type', 'Quantity']],
      body: topItemsData,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11
      },
      bodyStyles: {
        fontSize: 10,
        textColor: textColor
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      margin: { left: 15, right: 15 }
    });
  }

  // ===== FOOTER =====
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    
    doc.text(
      'CleanPro Dry Cleaning - Management Report',
      15,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // ===== SAVE PDF =====
  const fileName = `CleanPro_Report_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

/**
 * Get report title based on type
 */
const getReportTitle = (reportType) => {
  switch (reportType) {
    case 'today':
      return "Today's Report";
    case 'week':
      return 'Weekly Report';
    case 'month':
      return 'Monthly Report';
    case 'year':
      return 'Yearly Report';
    case 'custom':
      return 'Custom Date Range Report';
    default:
      return 'Business Report';
  }
};