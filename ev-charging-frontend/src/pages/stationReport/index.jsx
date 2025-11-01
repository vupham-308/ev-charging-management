import { useState } from "react";
import { Card, Input, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaExclamationTriangle,
  FaPaperPlane,
  FaChargingStation,
  FaRegEdit,
  FaRegCommentDots,
  FaArrowLeft,
} from "react-icons/fa";
import api from "../../config/axios";

const { TextArea } = Input;

const ManageStationReport = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();

  const [problemTitle, setProblemTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!problemTitle || !description) {
      message.warning("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
        title: problemTitle,
        description,
      };

      await api.post(`/problem/create/${stationId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("🚀 Gửi báo cáo thành công!");
      navigate(-1);
    } catch (err) {
      console.error("❌ Lỗi khi gửi báo cáo:", err);
      const errorMsg = err.response?.data?.message || "Không thể gửi báo cáo!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center py-10 px-4">
      <Card
        bordered={false}
        className="w-full max-w-lg shadow-lg rounded-2xl bg-white hover:shadow-xl transition-all duration-300"
        title={
          <div className="flex items-center gap-2 text-xl font-semibold text-blue-700">
            <FaExclamationTriangle className="text-yellow-500" />
            Báo cáo sự cố trạm sạc
          </div>
        }
      >
        <p className="text-gray-600 mb-6">
          Hãy mô tả rõ ràng sự cố bạn gặp phải tại trạm sạc để đội ngũ kỹ thuật
          có thể hỗ trợ nhanh nhất.
        </p>

        {/* Thông tin trạm */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-gray-800 font-medium text-base">
            <FaChargingStation className="text-green-600" />
            Trạm sạc:
          </div>
          <p className="ml-6 mt-1 text-gray-700 font-semibold">
            Trung tâm thương mại Vincom
          </p>
        </div>

        {/* Tiêu đề sự cố */}
        <div className="mb-5">
          <label className="font-medium text-gray-700 flex items-center gap-2 mb-2">
            <FaRegEdit className="text-blue-500" />
            Tiêu đề sự cố <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="VD: Trụ sạc không khởi động được"
            value={problemTitle}
            onChange={(e) => setProblemTitle(e.target.value)}
            size="large"
            className="rounded-lg"
          />
        </div>

        {/* Mô tả chi tiết */}
        <div className="mb-8">
          <label className="font-medium text-gray-700 flex items-center gap-2 mb-2">
            <FaRegCommentDots className="text-indigo-500" />
            Mô tả chi tiết <span className="text-red-500">*</span>
          </label>
          <TextArea
            rows={5}
            placeholder="Hãy mô tả chi tiết sự cố, thời gian, và các bước bạn đã thử..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-lg"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            icon={<FaArrowLeft />}
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-lg border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400"
          >
            Hủy
          </Button>

          <Button
            type="primary"
            icon={<FaPaperPlane />}
            loading={loading}
            onClick={handleSubmit}
            className="bg-blue-700 hover:bg-blue-800 px-6 py-2 rounded-lg font-medium shadow-md"
          >
            Gửi báo cáo
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ManageStationReport;
