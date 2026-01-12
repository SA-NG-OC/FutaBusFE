import TripMap from '@/src/components/TrackingMap/index';

export default function TripDetailPage({ params }: { params: { id: string } }) {
    // Giả sử lấy ID từ URL
    const tripId = parseInt(params.id);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Theo dõi chuyến đi #{tripId}</h1>

            {/* Gọi Component Bản đồ ở đây */}
            <TripMap
                tripId={1}
                routeInfo={{
                    origin: "Ben Xe Mien Dong",
                    destination: "Da Lat Center",
                    startTime: "22:00",
                    endTime: "05:00"
                }}
            />

            <div className="mt-4">
                <p>Thông tin chi tiết chuyến đi...</p>
            </div>
        </div>
    );
}