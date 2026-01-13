"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import TicketCard from "@/feature/ticket/components/TicketCard";

type TabType = "upcoming" | "completed" | "cancelled";

interface TicketData {
  id: number;
  bookingReference: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  from: string;
  to: string;
  date: string;
  departureTime: string;
  seats: string;
  price: number;
}

export default function MyTicketsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");

  // Mock data - Thay bằng API call thực tế
  const mockTickets: TicketData[] = [
    {
      id: 1,
      bookingReference: "BT-12345678",
      status: "Upcoming",
      from: "Ho Chi Minh City",
      to: "Da Lat",
      date: "2025-11-25",
      departureTime: "06:00",
      seats: "A5",
      price: 500000,
    },
    {
      id: 2,
      bookingReference: "BT-87654321",
      status: "Upcoming",
      from: "Ha Noi",
      to: "Hai Phong",
      date: "2025-12-01",
      departureTime: "08:30",
      seats: "B3, B4",
      price: 350000,
    },
    {
      id: 3,
      bookingReference: "BT-11223344",
      status: "Completed",
      from: "Ho Chi Minh City",
      to: "Vung Tau",
      date: "2025-10-15",
      departureTime: "07:00",
      seats: "C1",
      price: 150000,
    },
    {
      id: 4,
      bookingReference: "BT-99887766",
      status: "Cancelled",
      from: "Da Nang",
      to: "Hue",
      date: "2025-10-20",
      departureTime: "09:00",
      seats: "A2",
      price: 200000,
    },
  ];

  const filterTickets = (status: string) => {
    return mockTickets.filter((ticket) => ticket.status === status);
  };

  const upcomingTickets = filterTickets("Upcoming");
  const completedTickets = filterTickets("Completed");
  const cancelledTickets = filterTickets("Cancelled");

  const getActiveTickets = () => {
    switch (activeTab) {
      case "upcoming":
        return upcomingTickets;
      case "completed":
        return completedTickets;
      case "cancelled":
        return cancelledTickets;
      default:
        return [];
    }
  };

  const handleViewDetails = (ticketId: number) => {
    console.log("View details for ticket:", ticketId);
    // Navigate to ticket details page
    // router.push(`/client/my-ticket/${ticketId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Tickets</h1>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "upcoming" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming ({upcomingTickets.length})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "completed" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed ({completedTickets.length})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "cancelled" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled ({cancelledTickets.length})
        </button>
      </div>

      <div className={styles.ticketList}>
        {getActiveTickets().length > 0 ? (
          getActiveTickets().map((ticket) => (
            <TicketCard
              key={ticket.id}
              bookingReference={ticket.bookingReference}
              status={ticket.status}
              from={ticket.from}
              to={ticket.to}
              date={ticket.date}
              departureTime={ticket.departureTime}
              seats={ticket.seats}
              price={ticket.price}
              onViewDetails={() => handleViewDetails(ticket.id)}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <svg
              className={styles.emptyIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className={styles.emptyText}>No {activeTab} tickets found</p>
            <p className={styles.emptySubtext}>
              Your {activeTab} tickets will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
