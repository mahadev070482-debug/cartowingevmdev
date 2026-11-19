import React from 'react';
import { TowRequest } from '../../types';
import { HeroSection } from '../customer/HeroSection';
import { ServicesSection } from '../customer/ServicesSection';
import { BookingForm } from '../customer/BookingForm';
import { TrackingTicketLookup } from '../customer/TrackingTicketLookup';
import { VideoShowcase } from '../customer/VideoShowcase';
import { EVWhyFlatbed } from '../customer/EVWhyFlatbed';
import { FleetGallery } from '../customer/FleetGallery';
import { HyderabadCoverage } from '../customer/HyderabadCoverage';
import { RescueGallery } from '../customer/RescueGallery';
import { ReviewsSection } from '../customer/ReviewsSection';

interface ClassicLayoutProps {
  onBookingSuccess: (newRequest: TowRequest) => void;
  onTrackSearch: (query: string) => void;
  onScrollToBooking: () => void;
  onOpenWhyFlatbed: () => void;
  onSelectCoverageArea: (areaName: string, landmark: string) => void;
  prefillLocation: { address: string; landmark?: string } | null;
}

export const ClassicLayout: React.FC<ClassicLayoutProps> = ({
  onBookingSuccess,
  onTrackSearch,
  onScrollToBooking,
  onOpenWhyFlatbed,
  onSelectCoverageArea,
  prefillLocation
}) => {
  return (
    <div>
      <HeroSection
        onScrollToBooking={onScrollToBooking}
        onTrackSearch={onTrackSearch}
        onOpenWhyFlatbed={onOpenWhyFlatbed}
      />

      {/* Services Section with 25 in Large Recognisable Format & 100+ Rescues text */}
      <ServicesSection onScrollToBooking={onScrollToBooking} />

      {/* Request Booking UP */}
      <BookingForm
        onBookingSuccess={onBookingSuccess}
        initialLocation={prefillLocation}
      />

      {/* Tracking Ticket BELOW Request Booking */}
      <TrackingTicketLookup onTrackSearch={onTrackSearch} />

      {/* Live Video Recovery Showcase */}
      <VideoShowcase onScrollToBooking={onScrollToBooking} />

      <EVWhyFlatbed />

      <FleetGallery />

      <HyderabadCoverage onSelectArea={onSelectCoverageArea} />

      <RescueGallery onSelectBookNow={onScrollToBooking} />

      <ReviewsSection isOwnerMode={false} />
    </div>
  );
};
