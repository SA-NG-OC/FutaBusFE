/**
 * Printable Ticket Template
 * Template vé xe có thể in ra PDF với dữ liệu động
 * Sử dụng inline styles RGB để tránh lỗi oklch khi convert PDF
 * Layout giống hệt TicketDetail component
 */

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface PrintableTicketProps {
  bookingCode: string;
  status: string;
  qrCode?: string;
  fromLocation: string;
  toLocation: string;
  departureDate: string;
  departureTime: string;
  duration: string;
  vehicleType: string;
  licensePlate: string;
  driverName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerIdCard?: string;
  seatNumber: string;
  seatFloor: string;
  pickupLocation: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffTime: string;
}

export default function PrintableTicket(props: PrintableTicketProps) {
  const {
    bookingCode,
    status,
    qrCode,
    fromLocation,
    toLocation,
    departureDate,
    departureTime,
    duration,
    vehicleType,
    licensePlate,
    driverName,
    customerName,
    customerPhone,
    customerEmail,
    customerIdCard,
    seatNumber,
    // seatFloor, // not displayed in this layout
    pickupLocation,
    pickupTime,
    dropoffLocation,
    dropoffTime,
  } = props;

  const getStatusStyle = () => {
    const base = {
      padding: '8px 16px',
      borderRadius: '16px',
      fontWeight: 500,
      fontSize: '14px',
    };
    
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'paid':
        return { ...base, background: '#fee', color: '#D83E3E' };
      case 'pending':
        return { ...base, background: '#ffedd5', color: '#ea580c' };
      case 'cancelled':
        return { ...base, background: '#ffe2e2', color: '#9f0712' };
      default:
        return { ...base, background: '#6366f1', color: '#fff' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
      case "PAID":
        return "Đã xác nhận";
      case "PENDING":
        return "Chờ xác nhận";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0px 10px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ background: '#ffffff', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '20px', color: '#D83E3E' }}>🎫</div>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 600, color: '#171717' }}>Thông tin vé</div>
              <div style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
                Mã vé: {bookingCode}
              </div>
            </div>
          </div>
          <div style={getStatusStyle()}>
            {getStatusText(status)}
          </div>
        </div>

        {/* QR Code */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <QRCodeSVG
            value={qrCode || bookingCode}
            size={220}
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          
          {/* Left Column */}
          <div style={{ padding: '24px', borderRight: '1px solid #e2e8f0' }}>
            
            {/* Thông tin chuyến đi */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '17px', color: '#D83E3E' }}>🚌</span>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#171717' }}>Thông tin chuyến đi</span>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '17px', flexShrink: 0, marginTop: '2px' }}>📍</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Tuyến đường</div>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: '#D83E3E' }}>
                    {fromLocation} → {toLocation}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '17px', flexShrink: 0, marginTop: '2px' }}>📅</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Ngày khởi hành</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#171717' }}>
                    {departureDate}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ fontSize: '17px', flexShrink: 0, marginTop: '2px' }}>⏰</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Thời gian</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#171717' }}>
                    {departureTime} ({duration})
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin hành khách */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '17px', color: '#D83E3E' }}>👤</span>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#171717' }}>
                  Thông tin hành khách
                </span>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Họ và tên</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#171717' }}>{customerName}</div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Số điện thoại</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#171717' }}>
                  {customerPhone}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Email</div>
                  <div style={{ fontSize: '16px', color: '#171717', fontWeight: 600, lineHeight: 1.5 }}>{customerEmail}</div>
                </div>
                {customerIdCard && (
                  <div>
                    <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>CMND/CCCD</div>
                    <div style={{ fontSize: '16px', color: '#171717', fontWeight: 600, lineHeight: 1.5 }}>
                      {customerIdCard}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Thông tin ghế */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '17px', color: '#D83E3E' }}>🎫</span>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#171717' }}>Thông tin ghế</span>
              </div>

              <div>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Số ghế</div>
                <div style={{ fontSize: '40px', fontWeight: 700, color: '#D83E3E', lineHeight: 1 }}>{seatNumber}</div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ padding: '24px' }}>
            
            {/* Loại xe */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '17px', color: '#D83E3E' }}>🚐</span>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#171717' }}>Loại xe</span>
              </div>

              <div style={{ fontSize: '16px', color: '#171717', fontWeight: 600, lineHeight: 1.5, marginBottom: '12px' }}>
                {vehicleType}
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Biển số</div>
                <div style={{ fontSize: '16px', color: '#171717', fontWeight: 600, lineHeight: 1.5 }}>{licensePlate}</div>
              </div>

              <div>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Tài xế</div>
                <div style={{ fontSize: '16px', color: '#171717', fontWeight: 600, lineHeight: 1.5 }}>{driverName}</div>
              </div>
            </div>

            {/* Điểm đón/trả */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '17px', color: '#D83E3E' }}>📍</span>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#171717' }}>Điểm đón/trả</span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Điểm đón</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#171717' }}>
                  {pickupLocation}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                  Thời gian: {pickupTime}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Điểm trả</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#171717' }}>
                  {dropoffLocation}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                  Thời gian dự kiến: {dropoffTime}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}