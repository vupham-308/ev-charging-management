import { useState, useEffect } from "react";
import { Input, Button, Tag, Spin, message, Card } from "antd";
import {
  EnvironmentOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../config/axios";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

const ManageMap = () => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);

  // 🔹 Lấy danh sách trạm
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const response = await api.get("/station/getAllStations");
        const result = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setStations(result);
        setFilteredData(result);
      } catch (error) {
        console.error("❌ Lỗi khi tải trạm:", error);
        message.error("Không thể tải danh sách trạm sạc!");
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  // 🔍 Tìm kiếm
  const handleSearch = () => {
    const keyword = searchText.toLowerCase();
    const filtered = stations.filter(
      (s) =>
        s.name.toLowerCase().includes(keyword) ||
        s.address.toLowerCase().includes(keyword)
    );
    setFilteredData(filtered);
  };

  const handleBookingClick = (station) => {
    navigate(`/driver/booking/${station.id}`);
  };
  const handleStartCharging = (station) => {
    navigate(`/driver/startCharging/${station.id}`);
  };

  // ✅ Lấy vị trí người dùng hiện tại
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("❌ Không thể lấy vị trí người dùng:", error);
          message.warning("Không thể lấy vị trí của bạn.");
        }
      );
    } else {
      message.warning("Trình duyệt không hỗ trợ định vị.");
    }
  }, []);

  // ✅ Khi đã có userLocation, tính khoảng cách và sắp xếp trạm
  useEffect(() => {
    const fetchNearestStations = async () => {
      if (!userLocation) return;
      try {
        setLoading(true);
        const res = await api.post("/station/nearest", {
          latitude: userLocation.lat,
          longitude: userLocation.lon,
        });

        // API có thể trả về trực tiếp hoặc nằm trong res.data.data
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        if (data.length > 0 && data[0].distance !== undefined) {
          data.sort((a, b) => a.distance - b.distance);
        }

        setStations(data);
        setFilteredData(data);
      } catch (error) {
        console.error("❌ Lỗi khi gọi API /station/nearest:", error);
        message.error("Không thể lấy danh sách trạm gần bạn nhất!");
      } finally {
        setLoading(false);
      }
    };

    fetchNearestStations();
  }, [userLocation]);

  // ✅ Icon vị trí người dùng (màu xanh dương, tròn rõ)
  const userIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // icon người/vị trí xanh
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
  });

  // ✅ Icon trạm sạc (màu xanh lá cây, biểu tượng EV)
  const stationIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448613.png", // icon trạm sạc EV
    iconSize: [40, 40],
    iconAnchor: [19, 38],
    popupAnchor: [0, -30],
  });

  function FlyToUser({ location }) {
    const map = useMap();
    useEffect(() => {
      if (location) {
        map.flyTo([location.lat, location.lon], 14, { duration: 1.5 });
      }
    }, [location]);
    return null;
  }

  // Chỉ đường
  function Routing({ userLocation, station }) {
    const map = useMap();

    useEffect(() => {
      if (!userLocation || !station) return;

      // Xóa route cũ nếu có
      if (map._routingControl) {
        map.removeControl(map._routingControl);
      }

      // Tạo tuyến đường mới
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation.lat, userLocation.lon),
          L.latLng(station.latitude, station.longitude),
        ],
        lineOptions: {
          styles: [{ color: "#007bff", weight: 5 }], // Đường màu xanh dương
        },
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        createMarker: () => null, // ẩn marker mặc định
      }).addTo(map);

      // Lưu để xóa sau này
      map._routingControl = routingControl;

      return () => {
        if (map._routingControl) {
          map.removeControl(map._routingControl);
          map._routingControl = null;
        }
      };
    }, [userLocation, station]);

    return null;
  }

  const handleDirection = (station) => {
    if (!userLocation) {
      message.warning("Không xác định được vị trí hiện tại của bạn!");
      return;
    }

    const origin = `${userLocation.lat},${userLocation.lon}`;
    const destination = `${station.latitude},${station.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    window.open(url, "_blank");
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fb",
        minHeight: "100vh",
        display: "flex",
        gap: "30px",
        padding: "30px 40px",
      }}
    >
      {/* BÊN TRÁI - Danh sách trạm */}
      <div style={{ flex: 1, maxWidth: "500px" }}>
        {/* Thanh tìm kiếm */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Input
            placeholder="Tìm kiếm trạm sạc..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{
              width: "300px",
              borderRadius: "8px",
            }}
          />
          <Button
            icon={<FilterOutlined />}
            onClick={handleSearch}
            style={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            Tìm kiếm
          </Button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxHeight: "80vh",
              overflowY: "auto",
              paddingRight: "10px",
            }}
          >
            {filteredData.length === 0 ? (
              <p style={{ textAlign: "center", color: "#888" }}>
                Không tìm thấy trạm nào phù hợp.
              </p>
            ) : (
              filteredData.map((station, index) => (
                <Card
                  key={station.id}
                  onClick={() => setSelectedStation(station)}
                  style={{
                    borderRadius: "12px",
                    boxShadow:
                      index === 0
                        ? "0 0 10px rgba(0,128,0,0.5)"
                        : "0 2px 10px rgba(0,0,0,0.08)",
                    padding: "20px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h3 style={{ margin: 0, fontSize: "18px" }}>
                      {station.name}
                    </h3>
                    <p style={{ color: "#666", margin: "4px 0 8px" }}>
                      <EnvironmentOutlined /> {station.address}
                    </p>

                    {station.distance && (
                      <p style={{ margin: "4px 0", color: "#333" }}>
                        Cách bạn khoảng <b>{station.distance.toFixed(2)} km</b>
                      </p>
                    )}

                    <p style={{ margin: "4px 0" }}>
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        {station.pointChargerAvailable} /{" "}
                        {station.pointChargerTotal} trụ sạc khả dụng
                      </span>
                    </p>

                    <div style={{ marginBottom: "10px" }}>
                      {station.portType?.map((type, index) => (
                        <Tag
                          key={index}
                          color={type === "CCS" ? "blue" : "purple"}
                          style={{
                            borderRadius: "6px",
                            fontSize: "0.9rem",
                            marginBottom: "4px",
                          }}
                        >
                          {type}
                        </Tag>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: "black",
                          border: "none",
                          borderRadius: "8px",
                          flex: 1,
                        }}
                        onClick={() => handleBookingClick(station)}
                      >
                        Đặt chỗ
                      </Button>
                      <Button
                        type="default"
                        style={{
                          borderRadius: "8px",
                          flex: 1,
                        }}
                        onClick={() => handleStartCharging(station)}
                      >
                        Bắt đầu sạc
                      </Button>

                      <Button
                        style={{
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          flex: 1,
                        }}
                        onClick={() => handleDirection(station)}
                      >
                        Chỉ đường
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* BÊN PHẢI - Bản đồ */}
      <div
        style={{
          flex: 2,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          height: "calc(100vh - 120px)",
          position: "relative",
          zIndex: 0,
        }}
      >
        <MapContainer
          center={[10.84, 106.78]} // vị trí trung tâm (TP Thủ Đức)
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lon]}
              icon={userIcon}
            >
              <Popup>📍 Bạn đang ở đây</Popup>
            </Marker>
          )}

          <FlyToUser location={userLocation} />
          <Routing userLocation={userLocation} station={selectedStation} />

          {filteredData.map((station) => (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={stationIcon}
            >
              <Popup>
                <b>{station.name}</b> <br />
                {station.address} <br />
                {station.distance && (
                  <>
                    {station.distance.toFixed(2)} km <br />
                  </>
                )}
                🔌 {station.pointChargerAvailable}/{station.pointChargerTotal}{" "}
                trụ sạc khả dụng
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ManageMap;
