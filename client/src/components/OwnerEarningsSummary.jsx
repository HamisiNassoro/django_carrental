import React from "react";
import { formatMoney } from "../utils/currency";
import "./BookingTimeline.css";

const OwnerEarningsSummary = ({ earnings }) => {
  if (!earnings) return null;

  return (
    <div className="owner-earnings-summary">
      <div className="owner-earnings-card owner-earnings-card--earned">
        <div className="owner-earnings-card__label">Total paid out</div>
        <div className="owner-earnings-card__value">
          {formatMoney(earnings.total_earned, earnings.currency)}
        </div>
      </div>
      <div className="owner-earnings-card owner-earnings-card--pending">
        <div className="owner-earnings-card__label">Pending payout</div>
        <div className="owner-earnings-card__value">
          {formatMoney(earnings.pending_payout, earnings.currency)}
        </div>
      </div>
      <div className="owner-earnings-card">
        <div className="owner-earnings-card__label">Active trips</div>
        <div className="owner-earnings-card__value">{earnings.active_trips}</div>
      </div>
      <div className="owner-earnings-card">
        <div className="owner-earnings-card__label">Completed trips</div>
        <div className="owner-earnings-card__value">{earnings.completed_trips}</div>
      </div>
    </div>
  );
};

export default OwnerEarningsSummary;
